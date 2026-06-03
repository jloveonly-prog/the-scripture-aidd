import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { ShopService, CartItem } from '../services/shop.service.js';
import { Layout } from '../views/layout.js';
import { CatalogPage, CartPage, OrderCompleted, TrackModal, TrackingResult } from '../views/shop.js';

export const shopRouter = new Hono();

// Cart Session Helpers
function getCart(c: any): CartItem[] {
  const cookie = getCookie(c, 'cart');
  if (!cookie) return [];
  try {
    return JSON.parse(cookie);
  } catch {
    return [];
  }
}

function saveCart(c: any, cart: CartItem[]) {
  setCookie(c, 'cart', JSON.stringify(cart), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
}

function getCartCount(cart: CartItem[]): number {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

// API-001: Main page (Bible Catalog)
shopRouter.get('/', (c) => {
  const cart = getCart(c);
  const cartCount = getCartCount(cart);
  const bibles = ShopService.getBibles();
  
  return c.html(
    Layout({
      title: 'The Scripture Shop — 무료 성경 배포 쇼핑몰',
      children: CatalogPage({ bibles, cartCount })
    })
  );
});

// API-003: Add bible to cart
shopRouter.post('/cart/add', async (c) => {
  try {
    const { bibleId } = await c.req.parseBody();
    const id = Number(bibleId);
    
    if (isNaN(id) || !ShopService.getBibleById(id)) {
      return c.text('유효하지 않은 성경 ID입니다.', 400);
    }
    
    const cart = getCart(c);
    const existing = cart.find(item => item.bibleId === id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ bibleId: id, quantity: 1 });
    }
    
    saveCart(c, cart);
    
    // HX-Trigger header to tell client to update badge or refresh
    const count = getCartCount(cart);
    c.header('HX-Trigger', JSON.stringify({ cartUpdated: count }));
    
    // Return custom Hono swap trigger block
    return c.html(
      html`<span id="cart-badge" hx-swap-oob="true" class="bg-cathedralGold text-deepSlate font-bold text-xs px-1.5 py-0.5 rounded-full">${count}</span>`
    );
  } catch (err: any) {
    return c.text(err.message, 500);
  }
});

// API-002: Cart and Checkout view
shopRouter.get('/cart', (c) => {
  const cart = getCart(c);
  const cartCount = getCartCount(cart);
  
  const items = cart.map(item => {
    const bible = ShopService.getBibleById(item.bibleId);
    if (!bible) return null;
    return { bible, quantity: item.quantity };
  }).filter(Boolean) as any[];

  return c.html(
    Layout({
      title: '장바구니 — The Scripture Shop',
      children: CartPage({ items, cartCount })
    })
  );
});

// API-004: Update quantity
shopRouter.post('/cart/update', async (c) => {
  try {
    const { bibleId, quantity } = await c.req.parseBody();
    const id = Number(bibleId);
    const qty = Number(quantity);
    
    let cart = getCart(c);
    
    if (qty <= 0) {
      cart = cart.filter(item => item.bibleId !== id);
    } else {
      const item = cart.find(item => item.bibleId === id);
      if (item) {
        item.quantity = qty;
      }
    }
    
    saveCart(c, cart);
    
    // Redirect to refresh cart page
    return c.redirect('/cart');
  } catch (err: any) {
    return c.text(err.message, 500);
  }
});

// API-005: Delete item from cart
shopRouter.post('/cart/delete', async (c) => {
  try {
    const { bibleId } = await c.req.parseBody();
    const id = Number(bibleId);
    
    let cart = getCart(c);
    cart = cart.filter(item => item.bibleId !== id);
    saveCart(c, cart);
    
    return c.redirect('/cart');
  } catch (err: any) {
    return c.text(err.message, 500);
  }
});

// API-007: Submit order and perform confession
shopRouter.post('/order', async (c) => {
  try {
    const body = await c.req.parseBody();
    const customerName = (body.customerName as string)?.trim() || '';
    const contact = (body.contact as string)?.trim() || '';
    const address = (body.address as string)?.trim() || '';
    const confession = body.confession === 'on' || body.confession === 'true';

    // Validation checks
    if (!customerName || !contact || !address) {
      return c.html(
        `<div id="error-message" class="mb-4 p-4 bg-repentRed/20 border border-repentRed text-repentRed rounded-md text-sm">
          이름, 연락처, 배송지 주소를 모두 기입해 주셔야 합니다.
        </div>`,
        400
      );
    }

    if (!confession) {
      return c.html(
        `<div id="error-message" class="mb-4 p-4 bg-repentRed/20 border border-repentRed text-repentRed rounded-md text-sm">
          예수님을 구원자로 고백하고 동의하셔야 성경을 주문하실 수 있습니다.
        </div>`,
        400
      );
    }

    const cart = getCart(c);
    if (cart.length === 0) {
      return c.html(
        `<div id="error-message" class="mb-4 p-4 bg-repentRed/20 border border-repentRed text-repentRed rounded-md text-sm">
          장바구니가 비어 있습니다.
        </div>`,
        400
      );
    }

    const orderNumber = ShopService.createOrder({
      customerName,
      contact,
      address,
      believed: confession,
      items: cart
    });

    // Clear cart session cookie on successful order
    saveCart(c, []);

    // Return completed page directly
    return c.html(
      Layout({
        title: '주문 완료 — The Scripture Shop',
        children: OrderCompleted({ orderNumber })
      })
    );
  } catch (err: any) {
    return c.html(
      `<div id="error-message" class="mb-4 p-4 bg-repentRed/20 border border-repentRed text-repentRed rounded-md text-sm">
        주문 처리 중 서버 에러가 발생했습니다: ${err.message}
      </div>`,
      500
    );
  }
});

// Load Tracking Modal Content (HTMX)
shopRouter.get('/track-modal', (c) => {
  return c.html(TrackModal());
});

// API-008: Get order status track result (HTMX)
shopRouter.get('/track', (c) => {
  const { orderNumber } = c.req.query();
  const order = ShopService.trackOrder(orderNumber || '');
  return c.html(TrackingResult({ order }));
});

// Helper imports
import { html } from 'hono/html';
