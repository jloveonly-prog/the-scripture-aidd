// src/index.ts
// 서버 진입점 — serve() 호출만 담당
// Source: https://hono.dev/docs/getting-started/nodejs

import { serve } from '@hono/node-server';
import app from './app.js';

const PORT = 3000;

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`✅ QR Code Board 서버가 시작되었습니다`);
  console.log(`🌐 http://localhost:${info.port}`);
});
