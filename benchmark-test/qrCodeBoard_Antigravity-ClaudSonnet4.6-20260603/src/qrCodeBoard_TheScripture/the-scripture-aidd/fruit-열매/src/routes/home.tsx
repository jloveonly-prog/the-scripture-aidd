// TASK-003: 홈 라우트 (JSX 지원 - .tsx)
// 연결 REQ: REQ-003 (홈페이지 메인 화면)
// 연결 API: API-001 (GET /)
// 단일 책임: GET / → 홈 뷰 반환 만

import { Hono } from 'hono'
import HomeView from '../views/home/index.js'

const homeRouter = new Hono()

// API-001: GET / — 홈페이지 (QR 스캐너 화면)
homeRouter.get('/', async (c) => {
  try {
    return c.html(<HomeView />)  // REQ-003
  } catch (err) {
    console.error('[GET /] 에러:', err)
    return c.text('Internal Server Error', 500)
  }
})

export default homeRouter
