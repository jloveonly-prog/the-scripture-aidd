import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

// Declare global variables for the test suite
let app: any;
let db: any;
let ShopService: any;

describe('The Scripture Shop Integration Tests', () => {
  before(async () => {
    // Set test environment before any module import occurs (guarantees clean separation)
    process.env.NODE_ENV = 'test';

    // Dynamically import inside asynchronous before hook
    const indexModule = await import('../index.js');
    app = indexModule.default;

    const clientModule = await import('../db/client.js');
    db = clientModule.db;

    const serviceModule = await import('../services/shop.service.js');
    ShopService = serviceModule.ShopService;
  });

  after(() => {
    // Commented out to prevent experimental node:sqlite heap corruption on close under node:test
    /*
    if (db) {
      db.close();
    }
    const testDbPath = join(process.cwd(), 'db.test.sqlite');
    if (existsSync(testDbPath)) {
      try {
        rmSync(testDbPath);
      } catch (err) {
        console.error('Failed to clean up test database file:', err);
      }
    }
    */
  });

  // TC-001: Main page render (REQ-001, FR-001)
  test('GET / should return 200 and render bible list', async () => {
    const res = await app.request('/');
    assert.equal(res.status, 200);
    const htmlText = await res.text();
    assert.ok(htmlText.includes('THE SCRIPTURE SHOP'));
    assert.ok(htmlText.includes('King James Version (KJV)'));
    assert.ok(htmlText.includes('70인역 헬라어 구약성경 (Septuagint LXX)'));
  });

  // TC-002: Add item to cart (REQ-002, FR-002)
  test('POST /cart/add should return 200 and return badge update', async () => {
    const res = await app.request('/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ bibleId: '1' }).toString()
    });
    
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('id="cart-badge"'));
    
    // Cookie header checks
    const cookie = res.headers.get('set-cookie');
    assert.ok(cookie && cookie.includes('cart='));
  });

  // TC-003: Render cart page (REQ-002, FR-003)
  test('GET /cart should return 200 and render cart contents', async () => {
    const res = await app.request('/cart', {
      headers: {
        Cookie: 'cart=' + encodeURIComponent(JSON.stringify([{ bibleId: 1, quantity: 2 }]))
      }
    });
    
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('내 장바구니'));
    assert.ok(text.includes('King James Version (KJV)'));
  });

  // TC-004: Submit order rejected without confession (REQ-003, FR-005)
  test('POST /order without confession should return 400 and show warning', async () => {
    const res = await app.request('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'cart=' + encodeURIComponent(JSON.stringify([{ bibleId: 1, quantity: 1 }]))
      },
      body: new URLSearchParams({
        customerName: '홍길동',
        contact: '010-1111-2222',
        address: '서울시 종로구 사직로 161',
        confession: 'off'
      }).toString()
    });
    
    assert.equal(res.status, 400);
    const text = await res.text();
    assert.ok(text.includes('구원자로 고백하고 동의'));
  });

  // TC-005: Submit order success (REQ-003, FR-006)
  test('POST /order with correct fields and confession should return 200/201 and clear cart', async () => {
    const res = await app.request('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'cart=' + encodeURIComponent(JSON.stringify([{ bibleId: 1, quantity: 2 }]))
      },
      body: new URLSearchParams({
        customerName: '홍길동',
        contact: '010-1111-2222',
        address: '서울시 종로구 사직로 161',
        confession: 'on'
      }).toString()
    });
    
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('주문이 완료되었습니다!'));
    assert.ok(text.includes('S-2026')); // Order number prefix
    
    // Validate cart cookie is cleared
    const setCookieHeader = res.headers.get('set-cookie');
    assert.ok(setCookieHeader && setCookieHeader.includes('cart=%5B%5D')); // cart=[]
  });

  // TC-006: Non-member shipping status tracking (REQ-004, FR-007)
  test('GET /track should return tracking information', async () => {
    // Generate order manually in DB
    const orderNumber = ShopService.createOrder({
      customerName: '임꺽정',
      contact: '010-9999-8888',
      address: '함경도 평화로 3',
      believed: true,
      items: [{ bibleId: 2, quantity: 1 }]
    });

    const res = await app.request(`/track?orderNumber=${orderNumber}`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('발송 대기'));
    assert.ok(text.includes('임꺽정'));
  });

  // TC-007: Admin login success & access control (REQ-005, FR-008)
  test('POST /admin/login with correct credentials should authenticate and redirect', async () => {
    const res = await app.request('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: 'admin',
        password: 'admin'
      }).toString()
    });
    
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/admin');
    assert.ok(res.headers.get('set-cookie')?.includes('admin_session=authenticated'));
  });

  test('GET /admin without login should redirect to login page', async () => {
    const res = await app.request('/admin');
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/admin/login');
  });

  // TC-008: Admin register 8-digit tracking number (REQ-005, FR-011)
  test('POST /admin/orders/:id/ship should update order and validate format', async () => {
    // Generate order in test DB
    const orderNumber = ShopService.createOrder({
      customerName: '강감찬',
      contact: '010-7777-6666',
      address: '개성 성벽길 10',
      believed: true,
      items: [{ bibleId: 3, quantity: 3 }]
    });

    // Query order id from DB
    const order = db.prepare('SELECT id FROM orders WHERE order_number = ?').get(orderNumber) as { id: number };

    // 1. Invalid tracking number (letters)
    const badRes1 = await app.request(`/admin/orders/${order.id}/ship`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'admin_session=authenticated'
      },
      body: new URLSearchParams({ trackingNumber: 'ABC12345' }).toString()
    });
    assert.equal(badRes1.status, 200); // Renders the error fragment inside page
    assert.ok((await badRes1.text()).includes('송장번호는 반드시 8자리 숫자여야 합니다.'));

    // 2. Invalid tracking number (wrong length)
    const badRes2 = await app.request(`/admin/orders/${order.id}/ship`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'admin_session=authenticated'
      },
      body: new URLSearchParams({ trackingNumber: '1234567' }).toString()
    });
    assert.ok((await badRes2.text()).includes('송장번호는 반드시 8자리 숫자여야 합니다.'));

    // 3. Valid tracking number (8 digits)
    const goodRes = await app.request(`/admin/orders/${order.id}/ship`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'admin_session=authenticated'
      },
      body: new URLSearchParams({ trackingNumber: '98765432' }).toString()
    });
    assert.equal(goodRes.status, 200);
    const text = await goodRes.text();
    assert.ok(text.includes('발송 완료'));
    assert.ok(text.includes('98765432'));
  });
});
