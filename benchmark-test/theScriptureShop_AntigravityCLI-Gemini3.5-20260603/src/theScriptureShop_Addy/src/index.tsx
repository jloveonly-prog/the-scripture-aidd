import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { getCookie, setCookie } from 'hono/cookie';
import { db, initDb } from './db/client.js';
import { Layout } from './views/layout.js';
import { Home } from './views/home.js';
import { Cart } from './views/cart.js';
import { Checkout } from './views/checkout.js';
import { OrderSuccess } from './views/order-success.js';
import { Tracking } from './views/tracking.js';
import { AdminLogin } from './views/admin-login.js';
import { Admin, OrderCard } from './views/admin.js';

// Setup Hono app
const app = new Hono();

// Helper: Get cart count from cookie
function getCartCount(cartStr?: string): number {
  if (!cartStr) return 0;
  try {
    const items = JSON.parse(decodeURIComponent(cartStr)) as { id: number; quantity: number }[];
    return items.reduce((acc, curr) => acc + curr.quantity, 0);
  } catch {
    return 0;
  }
}

// Helper: Get cart items from cookie
async function getCartItems(cartStr?: string) {
  if (!cartStr) return [];
  try {
    const rawItems = JSON.parse(decodeURIComponent(cartStr)) as { id: number; quantity: number }[];
    if (rawItems.length === 0) return [];
    
    // Fetch Bibles
    const biblesRes = await db.execute('SELECT * FROM bibles');
    const biblesMap = new Map(biblesRes.rows.map(b => [Number(b.id), b]));
    
    const items = [];
    for (const raw of rawItems) {
      const dbBible = biblesMap.get(raw.id);
      if (dbBible) {
        items.push({
          bible: {
            id: Number(dbBible.id),
            title: String(dbBible.title),
            translation: String(dbBible.translation),
            description: String(dbBible.description),
            cover_color: String(dbBible.cover_color)
          },
          quantity: raw.quantity
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

// Routes
// 1. Catalog Page
app.get('/', async (c) => {
  const biblesRes = await db.execute('SELECT * FROM bibles');
  const bibles = biblesRes.rows.map(b => ({
    id: Number(b.id),
    title: String(b.title),
    translation: String(b.translation),
    description: String(b.description),
    cover_color: String(b.cover_color)
  }));
  
  const cartCookie = getCookie(c, 'cart');
  const cartCount = getCartCount(cartCookie);
  
  return c.html(
    <Layout cartCount={cartCount}>
      <Home bibles={bibles} />
    </Layout>
  );
});

// 2. Add to Cart (HTMX)
app.post('/cart/add/:id', async (c) => {
  const bibleId = Number(c.req.param('id'));
  const cartCookie = getCookie(c, 'cart');
  let items: { id: number; quantity: number }[] = [];
  
  if (cartCookie) {
    try {
      items = JSON.parse(decodeURIComponent(cartCookie));
    } catch {
      items = [];
    }
  }
  
  const existing = items.find(item => item.id === bibleId);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ id: bibleId, quantity: 1 });
  }
  
  const newCartStr = encodeURIComponent(JSON.stringify(items));
  setCookie(c, 'cart', newCartStr, { path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7 days
  
  const newCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  return c.text(String(newCount));
});

// 3. Cart Page
app.get('/cart', async (c) => {
  const cartCookie = getCookie(c, 'cart');
  const items = await getCartItems(cartCookie);
  const cartCount = getCartCount(cartCookie);
  
  return c.html(
    <Layout title="장바구니" cartCount={cartCount}>
      <Cart items={items} />
    </Layout>
  );
});

// 4. Update Cart Item Quantity (HTMX)
app.post('/cart/update/:id', async (c) => {
  const bibleId = Number(c.req.param('id'));
  const action = c.req.query('action');
  
  const cartCookie = getCookie(c, 'cart');
  let items: { id: number; quantity: number }[] = [];
  if (cartCookie) {
    try {
      items = JSON.parse(decodeURIComponent(cartCookie));
    } catch {
      items = [];
    }
  }
  
  const item = items.find(item => item.id === bibleId);
  if (item) {
    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity -= 1;
    }
  }
  
  const newCartStr = encodeURIComponent(JSON.stringify(items));
  setCookie(c, 'cart', newCartStr, { path: '/', maxAge: 60 * 60 * 24 * 7 });
  
  const updatedItems = await getCartItems(newCartStr);
  const newCount = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
  
  // Set header to trigger body update on client (so cart badge updates)
  c.header('HX-Trigger', 'cartUpdated');
  
  return c.html(<Cart items={updatedItems} />);
});

// 5. Remove Cart Item (HTMX)
app.post('/cart/remove/:id', async (c) => {
  const bibleId = Number(c.req.param('id'));
  const cartCookie = getCookie(c, 'cart');
  let items: { id: number; quantity: number }[] = [];
  
  if (cartCookie) {
    try {
      items = JSON.parse(decodeURIComponent(cartCookie));
    } catch {
      items = [];
    }
  }
  
  items = items.filter(item => item.id !== bibleId);
  
  const newCartStr = encodeURIComponent(JSON.stringify(items));
  setCookie(c, 'cart', newCartStr, { path: '/', maxAge: 60 * 60 * 24 * 7 });
  
  const updatedItems = await getCartItems(newCartStr);
  c.header('HX-Trigger', 'cartUpdated');
  
  return c.html(<Cart items={updatedItems} />);
});

// 6. Checkout Page
app.get('/checkout', async (c) => {
  const cartCookie = getCookie(c, 'cart');
  const items = await getCartItems(cartCookie);
  const cartCount = getCartCount(cartCookie);
  
  if (items.length === 0) {
    return c.redirect('/cart');
  }
  
  return c.html(
    <Layout title="주문하기" cartCount={cartCount}>
      <Checkout items={items} />
    </Layout>
  );
});

// 7. Process Checkout
app.post('/checkout', async (c) => {
  const cartCookie = getCookie(c, 'cart');
  const items = await getCartItems(cartCookie);
  
  if (items.length === 0) {
    return c.redirect('/cart');
  }
  
  const body = await c.req.parseBody();
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const address = String(body.address || '').trim();
  const confession = body.confession; // "on" if checked
  
  if (!name || !phone || !address || confession !== 'on') {
    const cartCount = getCartCount(cartCookie);
    return c.html(
      <Layout title="주문하기" cartCount={cartCount}>
        <Checkout items={items} error="모든 배송 정보를 입력하고 구원 신앙 고백을 체크하셔야 주문이 가능합니다." />
      </Layout>
    );
  }
  
  // Generate random order ID (e.g. TS-123456)
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `TS-${randNum}`;
  const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  
  // Insert order
  await db.execute({
    sql: 'INSERT INTO orders (id, name, address, phone, confessed, status, invoice_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [orderId, name, address, phone, 1, 'pending', null, nowStr]
  });
  
  // Insert order items
  for (const item of items) {
    await db.execute({
      sql: 'INSERT INTO order_items (order_id, bible_id, quantity) VALUES (?, ?, ?)',
      args: [orderId, item.bible.id, item.quantity]
    });
  }
  
  // Clear cart cookie
  setCookie(c, 'cart', '', { path: '/', maxAge: 0 });
  
  // Return order success page
  return c.html(
    <Layout title="주문 성공" cartCount={0}>
      <OrderSuccess orderId={orderId} />
    </Layout>
  );
});

// 8. Order Tracking Page
app.get('/tracking', async (c) => {
  const orderId = c.req.query('orderId');
  const cartCookie = getCookie(c, 'cart');
  const cartCount = getCartCount(cartCookie);
  
  if (!orderId) {
    return c.html(
      <Layout title="배송 조회" cartCount={cartCount}>
        <Tracking searched={false} />
      </Layout>
    );
  }
  
  // Search order
  const orderRes = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ?',
    args: [orderId.trim()]
  });
  
  if (orderRes.rows.length === 0) {
    return c.html(
      <Layout title="배송 조회" cartCount={cartCount}>
        <Tracking searched={true} searchQuery={orderId} error="입력하신 주문번호에 해당하는 주문을 찾을 수 없습니다." />
      </Layout>
    );
  }
  
  const dbOrder = orderRes.rows[0];
  const orderInfo = {
    id: String(dbOrder.id),
    name: String(dbOrder.name),
    address: String(dbOrder.address),
    phone: String(dbOrder.phone),
    status: String(dbOrder.status),
    invoice_number: dbOrder.invoice_number ? String(dbOrder.invoice_number) : null,
    created_at: String(dbOrder.created_at),
    confessed: Number(dbOrder.confessed)
  };
  
  // Fetch items
  const itemsRes = await db.execute({
    sql: 'SELECT oi.id, oi.quantity, b.title, b.translation FROM order_items oi JOIN bibles b ON oi.bible_id = b.id WHERE oi.order_id = ?',
    args: [orderId.trim()]
  });
  
  const items = itemsRes.rows.map(item => ({
    id: Number(item.id),
    title: String(item.title),
    translation: String(item.translation),
    quantity: Number(item.quantity)
  }));
  
  return c.html(
    <Layout title="배송 조회 결과" cartCount={cartCount}>
      <Tracking searched={true} order={orderInfo} items={items} searchQuery={orderId} />
    </Layout>
  );
});

// 9. Admin Page (Dashboard)
app.get('/admin', async (c) => {
  const adminCookie = getCookie(c, 'admin_session');
  if (adminCookie !== 'true') {
    return c.redirect('/admin/login');
  }
  
  const tab = c.req.query('tab') === 'completed' ? 'completed' : 'pending';
  
  // Fetch all orders
  const ordersRes = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
  
  const orders = [];
  for (const o of ordersRes.rows) {
    // Fetch items for this order
    const itemsRes = await db.execute({
      sql: 'SELECT b.title, b.translation, oi.quantity FROM order_items oi JOIN bibles b ON oi.bible_id = b.id WHERE oi.order_id = ?',
      args: [String(o.id)]
    });
    
    orders.push({
      id: String(o.id),
      name: String(o.name),
      address: String(o.address),
      phone: String(o.phone),
      status: String(o.status),
      invoice_number: o.invoice_number ? String(o.invoice_number) : null,
      created_at: String(o.created_at),
      confessed: Number(o.confessed),
      items: itemsRes.rows.map(item => ({
        title: String(item.title),
        translation: String(item.translation),
        quantity: Number(item.quantity)
      }))
    });
  }
  
  const cartCookie = getCookie(c, 'cart');
  const cartCount = getCartCount(cartCookie);
  
  return c.html(
    <Layout title="관리자 대시보드" cartCount={cartCount}>
      <Admin orders={orders} activeTab={tab} />
    </Layout>
  );
});

// 10. Admin Login Form
app.get('/admin/login', async (c) => {
  const adminCookie = getCookie(c, 'admin_session');
  if (adminCookie === 'true') {
    return c.redirect('/admin');
  }
  
  const cartCookie = getCookie(c, 'cart');
  const cartCount = getCartCount(cartCookie);
  
  return c.html(
    <Layout title="관리자 로그인" cartCount={cartCount}>
      <AdminLogin />
    </Layout>
  );
});

// 11. Admin Login Process
app.post('/admin/login', async (c) => {
  const body = await c.req.parseBody();
  const username = body.username;
  const password = body.password;
  
  const cartCookie = getCookie(c, 'cart');
  const cartCount = getCartCount(cartCookie);
  
  if (username === 'admin' && password === 'admin') {
    setCookie(c, 'admin_session', 'true', { path: '/', maxAge: 60 * 60 * 2, httpOnly: true, sameSite: 'Lax' }); // 2 hours
    return c.redirect('/admin');
  }
  
  return c.html(
    <Layout title="관리자 로그인" cartCount={cartCount}>
      <AdminLogin error="아이디 또는 비밀번호가 올바르지 않습니다." />
    </Layout>
  );
});

// 12. Admin Logout
app.get('/admin/logout', async (c) => {
  setCookie(c, 'admin_session', '', { path: '/', maxAge: 0 });
  return c.redirect('/admin/login');
});

// 13. Ship Process (HTMX support)
app.post('/admin/ship/:id', async (c) => {
  const adminCookie = getCookie(c, 'admin_session');
  if (adminCookie !== 'true') {
    return c.text('Unauthorized', 401);
  }
  
  const orderId = c.req.param('id');
  const body = await c.req.parseBody();
  const invoice = String(body.invoice || '').trim();
  
  // Validate tracking code: exactly 8 digits of numbers
  if (!/^[0-9]{8}$/.test(invoice)) {
    return c.text('Invalid invoice number. Must be exactly 8 digits.', 400);
  }
  
  // Update order in DB
  await db.execute({
    sql: 'UPDATE orders SET status = ?, invoice_number = ? WHERE id = ?',
    args: ['completed', invoice, orderId]
  });
  
  // Fetch updated order to render Card
  const orderRes = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ?',
    args: [orderId]
  });
  
  if (orderRes.rows.length === 0) {
    return c.text('Order not found', 404);
  }
  
  const o = orderRes.rows[0];
  const itemsRes = await db.execute({
    sql: 'SELECT b.title, b.translation, oi.quantity FROM order_items oi JOIN bibles b ON oi.bible_id = b.id WHERE oi.order_id = ?',
    args: [orderId]
  });
  
  const updatedOrder = {
    id: String(o.id),
    name: String(o.name),
    address: String(o.address),
    phone: String(o.phone),
    status: String(o.status),
    invoice_number: o.invoice_number ? String(o.invoice_number) : null,
    created_at: String(o.created_at),
    confessed: Number(o.confessed),
    items: itemsRes.rows.map(item => ({
      title: String(item.title),
      translation: String(item.translation),
      quantity: Number(item.quantity)
    }))
  };
  
  return c.html(<OrderCard order={updatedOrder} />);
});

// App Startup & DB Init
const port = 3000;

console.log('Initializing Database...');
initDb()
  .then(() => {
    console.log('Database initialized successfully.');
    console.log(`Starting Hono server on port ${port}...`);
    serve({
      fetch: app.fetch,
      port: port
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
  });
