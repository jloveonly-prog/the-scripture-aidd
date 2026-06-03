// src/index.js — Hono 서버 진입점
// Hono Node.js adapter: https://hono.dev/docs/getting-started/nodejs
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { homeRouter } = require('./routes/home');
const { boardRouter } = require('./routes/board');
const { initDatabase } = require('./db');

const app = new Hono();

// DB 초기화
initDatabase();

// 라우트 등록
app.route('/', homeRouter);
app.route('/board', boardRouter);

// 404 핸들러
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>404</title></head>
    <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0f172a;color:#e2e8f0;font-family:sans-serif;flex-direction:column;">
      <h1 style="font-size:4rem;margin-bottom:1rem;">404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <a href="/" style="margin-top:1rem;color:#818cf8;">홈으로 돌아가기</a>
    </body>
    </html>
  `, 404);
});

// 에러 핸들러 — 스택 트레이스를 사용자에게 노출하지 않는다
app.onError((err, c) => {
  console.error('[서버 에러]', err.message);
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>오류</title></head>
    <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0f172a;color:#e2e8f0;font-family:sans-serif;flex-direction:column;">
      <h1 style="font-size:2rem;margin-bottom:1rem;">⚠️ 오류가 발생했습니다</h1>
      <p>잠시 후 다시 시도해주세요.</p>
      <a href="/" style="margin-top:1rem;color:#818cf8;">홈으로 돌아가기</a>
    </body>
    </html>
  `, 500);
});

// 서버 시작 — 포트 3000 사용 (autoRun 지침)
const PORT = 3000;

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`✅ QR 게시판 서버가 시작되었습니다: http://localhost:${info.port}`);
});

module.exports = { app };
