// app.ts: Hono 앱 팩토리 (서버 bind 없음 — 테스트용 export)
// 연결 REQ: REQ-003, REQ-004, REQ-005, REQ-006
// 단일 책임: Hono 앱 인스턴스 생성 + 라우터 등록

import { Hono } from 'hono'
import homeRouter from './routes/home.js'
import boardRouter from './routes/board.js'

const app = new Hono()

// 라우터 등록
app.route('/', homeRouter)        // REQ-003
app.route('/board', boardRouter)  // REQ-004, 005, 006

// 전역 404 핸들러
app.notFound((c) => {
  return c.html(
    `<html><body style="font-family:sans-serif;padding:2rem;"><h1>404 Not Found</h1><a href="/">홈으로</a></body></html>`,
    404
  )
})

// 전역 에러 핸들러
app.onError((err, c) => {
  console.error('[전역 에러]', err)
  return c.text('Internal Server Error', 500)
})

// HTTP 통합 테스트용 export (SKILL-04 지침)
export default app
