import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import app from './index'

describe('HTTP 통합 테스트', () => {
  test('GET / → 200', async () => {
    const res = await app.request('/')
    assert.equal(res.status, 200)
  })
  
  test('GET /board → 200', async () => {
    const res = await app.request('/board')
    assert.equal(res.status, 200)
  })

  test('POST /api/scan 빈 내용 → 400', async () => {
    const res = await app.request('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ content: '' }).toString()
    })
    assert.equal(res.status, 400)
  })

  test('POST /api/scan 유효 내용 → 200', async () => {
    const res = await app.request('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ content: 'http://google.com' }).toString()
    })
    assert.equal(res.status, 200)
  })
})
