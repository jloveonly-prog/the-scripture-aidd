// src/app.ts
// Hono 앱 인스턴스 (서버 시작 분리 — 테스트에서 직접 fetch 핸들러 사용)
// Source: https://hono.dev/docs/guides/testing

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from '@hono/node-server/serve-static';
import home from './routes/home.js';
import board from './routes/board.js';
import api from './routes/api.js';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// data/ 디렉토리 보장 (동기)
mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });

const app = new Hono();

// 로거 미들웨어
app.use('*', logger());

// 정적 파일 서빙 (public/)
app.use('/public/*', serveStatic({ root: './' }));

// 라우트 등록
app.route('/', home);
app.route('/', board);
app.route('/api', api);

// 404 핸들러
app.notFound((c) => {
  return c.json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404);
});

// 500 에러 핸들러
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    500
  );
});

export default app;
