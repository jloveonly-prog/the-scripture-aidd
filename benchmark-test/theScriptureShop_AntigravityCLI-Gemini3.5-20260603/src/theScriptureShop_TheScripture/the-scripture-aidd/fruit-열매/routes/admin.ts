import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { AdminService } from '../services/admin.service.js';
import { Layout } from '../views/layout.js';
import { AdminLogin, AdminDashboard, OrderDetailPanel } from '../views/admin.js';

export const adminRouter = new Hono();

// Auth Guard Middleware
async function adminGuard(c: any, next: any) {
  const session = getCookie(c, 'admin_session');
  if (session !== 'authenticated') {
    return c.redirect('/admin/login');
  }
  await next();
}

// API-009: Admin login page
adminRouter.get('/login', (c) => {
  const session = getCookie(c, 'admin_session');
  if (session === 'authenticated') {
    return c.redirect('/admin');
  }
  return c.html(
    Layout({
      title: '관리자 로그인 — The Scripture Shop',
      children: AdminLogin({})
    })
  );
});

// API-010: Admin login handler
adminRouter.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const username = body.username as string;
  const password = body.password as string;

  if (username === 'admin' && password === 'admin') {
    setCookie(c, 'admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 2 // 2 hours
    });
    return c.redirect('/admin');
  }

  return c.html(
    Layout({
      title: '관리자 로그인 — The Scripture Shop',
      children: AdminLogin({ error: '아이디 또는 비밀번호가 올치않습니다.' })
    })
  );
});

// API-011: Admin logout handler
adminRouter.post('/logout', (c) => {
  deleteCookie(c, 'admin_session');
  return c.redirect('/admin/login');
});

// API-012: Admin dashboard (Guard applied)
adminRouter.get('/', adminGuard, (c) => {
  const queryFilter = c.req.query('filter') || 'PENDING';
  const filter = queryFilter === 'SHIPPED' ? 'SHIPPED' : 'PENDING';

  const orders = AdminService.getOrdersByStatus(filter);

  return c.html(
    Layout({
      title: '관리자 대시보드 — The Scripture Shop',
      children: AdminDashboard({ orders, filter })
    })
  );
});

// API-006: View order detail (HTMX swap target)
adminRouter.get('/orders/:id', adminGuard, (c) => {
  const id = Number(c.req.param('id'));
  const order = AdminService.getOrderDetail(id);
  if (!order) {
    return c.text('주문이 존재하지 않습니다.', 404);
  }
  return c.html(OrderDetailPanel({ order }));
});

// API-013: Register tracking number and ship
adminRouter.post('/orders/:id/ship', adminGuard, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.parseBody();
  const trackingNumber = body.trackingNumber as string;

  try {
    AdminService.shipOrder(id, trackingNumber);
    const order = AdminService.getOrderDetail(id);
    return c.html(OrderDetailPanel({ order }));
  } catch (err: any) {
    // If validation fails, return an error message that alerts admin
    return c.html(
      `<div class="space-y-4">
        <div class="p-3 bg-repentRed/20 border border-repentRed text-repentRed text-xs rounded">
          오류: ${err.message}
        </div>
        <button
          hx-get="/admin/orders/${id}"
          hx-target="#detail-panel"
          class="text-xs bg-glassCharcoal hover:bg-cathedralGold/10 border border-cathedralGold/20 text-cathedralGold px-4 py-2 rounded transition-colors"
        >
          상세 화면으로 돌아가기
        </button>
      </div>`
    );
  }
});
