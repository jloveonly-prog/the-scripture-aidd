// 앱 진입점 — architecture-temple-성전설계.md 기반
// Hono 서버 설정 및 라우트 등록
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import home from './routes/home';
import board from './routes/board';

const app = new Hono();

// 라우트 등록 — api-gate-성문.md 기반
app.route('/', home);       // API-001: 홈페이지
app.route('/board', board);  // API-002~008: 게시판 CRUD

// 전역 404 핸들러
app.notFound((c) => {
  return c.html(
    `<!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>404 — QR Code Board</title>
    <script src="https://cdn.tailwindcss.com"></script></head>
    <body class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-slate-300 mb-4">404</h1>
        <p class="text-slate-500 mb-4">페이지를 찾을 수 없습니다</p>
        <a href="/" class="text-indigo-600 hover:underline">홈으로 돌아가기</a>
      </div>
    </body>
    </html>`,
    404
  );
});

// 전역 에러 핸들러
app.onError((err, c) => {
  console.error('[GLOBAL ERROR]', err);
  return c.html(
    `<!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>오류 — QR Code Board</title>
    <script src="https://cdn.tailwindcss.com"></script></head>
    <body class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-red-300 mb-4">500</h1>
        <p class="text-slate-500 mb-4">서버 오류가 발생했습니다</p>
        <a href="/" class="text-indigo-600 hover:underline">홈으로 돌아가기</a>
      </div>
    </body>
    </html>`,
    500
  );
});

// 서버 시작 — C-002: 로컬 PC, 포트 3001
const port = 3001;
console.log(`🚀 QR Code Board 서버 실행 중: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
