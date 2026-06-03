// TASK-001: 서버 진입점
// 연결 REQ: REQ-003 (홈페이지), C-003 (포트 4000)
// 단일 책임: 포트 4000 서버 구동

import { serve } from '@hono/node-server'
import app from './app.js'

// 서버 구동 (포트 4000 고정 - C-003)
const PORT = 4000

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`🚀 서버 구동 중: http://localhost:${info.port}`)
    console.log(`📋 게시판: http://localhost:${info.port}/board`)
    console.log(`📷 QR 스캐너: http://localhost:${info.port}/`)
  }
)
