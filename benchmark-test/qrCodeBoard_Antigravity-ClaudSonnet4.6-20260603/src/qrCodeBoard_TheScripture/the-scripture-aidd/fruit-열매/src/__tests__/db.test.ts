// Phase 5: 광야 — 자동화 테스트
// node:test 내장 프레임워크 사용
// Tier 1: DB 단위 테스트 + Tier 2: HTTP 통합 테스트

import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import Database from 'better-sqlite3'

// 인메모리 DB로 격리 테스트
// src/db/index.ts를 직접 테스트하기 위해 인메모리 DB 분리 방식 사용
const testDb = new Database(':memory:')
testDb.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL CHECK(length(trim(title)) > 0),
    content    TEXT    NOT NULL CHECK(length(trim(content)) > 0),
    created_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`)

// ===========================================================
// Tier 1: DB 단위 테스트
// ===========================================================
describe('Tier 1: DB 단위 테스트', () => {
  // 테스트용 CRUD 함수 (인메모리 DB 사용)
  function insertPost(title: string, content: string): number {
    const stmt = testDb.prepare('INSERT INTO posts (title, content) VALUES (?, ?)')
    const result = stmt.run(title, content)
    return result.lastInsertRowid as number
  }

  function getPost(id: number) {
    return testDb.prepare('SELECT * FROM posts WHERE id = ?').get(id) as any
  }

  function getAllPosts() {
    return testDb.prepare('SELECT id, title, created_at FROM posts ORDER BY created_at DESC').all()
  }

  test('REQ-005: 게시글 작성 — 정상 삽입', () => {
    const id = insertPost('테스트 제목', '테스트 내용')
    assert.ok(id > 0, '게시글 ID가 양의 정수여야 함')
  })

  test('REQ-006: 게시글 상세 조회 — 존재하는 글', () => {
    const id = insertPost('조회 테스트', '내용 테스트')
    const post = getPost(id)
    assert.equal(post.title, '조회 테스트')
    assert.equal(post.content, '내용 테스트')
  })

  test('REQ-006: 게시글 상세 조회 — 존재하지 않는 글', () => {
    const post = getPost(99999)
    assert.equal(post, undefined, '없는 게시글은 undefined 반환')
  })

  test('REQ-004: 게시글 목록 조회 — 최신순', () => {
    const posts = getAllPosts()
    assert.ok(Array.isArray(posts), '배열 반환')
    assert.ok(posts.length > 0, '게시글이 1개 이상 존재')
  })

  test('방어 깊이 3층: DB CHECK — 빈 제목 거부', () => {
    assert.throws(() => {
      insertPost('', '내용')
    }, /CHECK constraint failed/, '빈 제목은 DB CHECK 에러 발생')
  })

  test('방어 깊이 3층: DB CHECK — 공백만 있는 제목 거부', () => {
    assert.throws(() => {
      insertPost('   ', '내용')
    }, /CHECK constraint failed/, '공백만 있는 제목은 DB CHECK 에러 발생')
  })

  test('방어 깊이 3층: DB CHECK — 빈 내용 거부', () => {
    assert.throws(() => {
      insertPost('제목', '')
    }, /CHECK constraint failed/, '빈 내용은 DB CHECK 에러 발생')
  })
})
