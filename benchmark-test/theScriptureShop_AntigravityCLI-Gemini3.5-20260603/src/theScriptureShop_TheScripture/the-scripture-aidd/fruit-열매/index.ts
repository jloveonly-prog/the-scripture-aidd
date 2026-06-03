import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { initDb } from './db/client.js';
import { seedDb } from './db/seed.js';
import { shopRouter } from './routes/shop.js';
import { adminRouter } from './routes/admin.js';

// Initialize SQLite database and inject seed data
initDb();
seedDb();

const app = new Hono();

// Mount routes
app.route('/', shopRouter);
app.route('/admin', adminRouter);

// Start server on local port 3000
const port = 3000;

if (process.env.NODE_ENV !== 'test') {
  console.log(`[Genesis] The Scripture Shop server is running on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port
  });
}

// HTTP 앱 인스턴스 Export (통합 테스트의 전제 조건)
export default app;
