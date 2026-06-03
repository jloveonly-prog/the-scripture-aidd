/**
 * 앱 진입점 — 서버 구동
 * 연결 REQ: C-003 (포트 4000)
 * 단일 책임: 서버 구동 + 라우트 등록
 */
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import homeRoutes from './routes/home.js';
import boardRoutes from './routes/board.js';

const app = new Hono();

// 라우트 등록
app.route('/', homeRoutes);
app.route('/board', boardRoutes);

// 서버 구동 — C-003: 포트 4000
const PORT = 4000;

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`🚀 QR Code Board 서버 시작 — http://localhost:${info.port}`);
});

// HTTP 통합 테스트용 export
export default app;
