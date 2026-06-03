// Phase 5: 광야 — HTTP 통합 테스트 (Tier 2)
// Hono app.request() 패턴 사용 (실서버 불필요)

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

// Hono 앱 직접 import (SKILL-04 export 지침 적용)
// 참고: 통합 테스트는 src/index.ts의 export default app 사용

describe('Tier 2: HTTP 통합 테스트', async () => {
  // 앱 동적 import (ESM) - 서버 구동 없이 앱만 import
  const { default: app } = await import('../app.js')

  // ====== GET / ======
  test('API-001: GET / → 200 (홈페이지)', async () => {
    const res = await app.request('/')
    assert.equal(res.status, 200, 'GET / 상태코드 200')
    const html = await res.text()
    assert.ok(html.includes('QR'), 'QR 관련 콘텐츠 포함')
  })

  // ====== GET /board ======
  test('API-002: GET /board → 200 (게시판 목록)', async () => {
    const res = await app.request('/board')
    assert.equal(res.status, 200, 'GET /board 상태코드 200')
    const html = await res.text()
    assert.ok(html.includes('게시판'), '게시판 콘텐츠 포함')
  })

  // ====== GET /board/new ======
  test('API-003: GET /board/new → 200 (작성 폼)', async () => {
    const res = await app.request('/board/new')
    assert.equal(res.status, 200, 'GET /board/new 상태코드 200')
    const html = await res.text()
    assert.ok(html.includes('작성') || html.includes('title'), '작성 폼 콘텐츠 포함')
  })

  // ====== POST /board 정상 ======
  test('API-004: POST /board 정상 데이터 → 302 리다이렉트', async () => {
    const body = new URLSearchParams({ title: '통합테스트 게시글', content: '통합테스트 내용입니다.' })
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    assert.equal(res.status, 302, 'POST 성공 시 302 리다이렉트')
    assert.equal(res.headers.get('location'), '/board', '리다이렉트 위치: /board')
  })

  // ====== POST /board 빈 제목 ======
  test('API-004: POST /board 빈 제목 → 400 (방어 깊이 2층)', async () => {
    const body = new URLSearchParams({ title: '', content: '내용입니다.' })
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    assert.equal(res.status, 400, '빈 제목 → 400 Bad Request')
  })

  // ====== POST /board 빈 내용 ======
  test('API-004: POST /board 빈 내용 → 400 (방어 깊이 2층)', async () => {
    const body = new URLSearchParams({ title: '제목', content: '' })
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    assert.equal(res.status, 400, '빈 내용 → 400 Bad Request')
  })

  // ====== POST /board 공백만 있는 제목 ======
  test('API-004: POST /board 공백 제목 → 400 (trim 방어)', async () => {
    const body = new URLSearchParams({ title: '   ', content: '내용' })
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    assert.equal(res.status, 400, '공백 제목 → 400 Bad Request')
  })

  // ====== GET /board/:id 없는 게시글 ======
  test('API-005: GET /board/99999 → 404 (게시글 없음)', async () => {
    const res = await app.request('/board/99999')
    assert.equal(res.status, 404, '없는 게시글 → 404')
  })

  // ====== GET /board/:id 잘못된 id ======
  test('API-005: GET /board/abc → 400 (잘못된 ID)', async () => {
    const res = await app.request('/board/abc')
    // 숫자 아닌 id → parseInt NaN → 400 또는 404
    assert.ok([400, 404].includes(res.status), '잘못된 ID → 400 또는 404')
  })
})
