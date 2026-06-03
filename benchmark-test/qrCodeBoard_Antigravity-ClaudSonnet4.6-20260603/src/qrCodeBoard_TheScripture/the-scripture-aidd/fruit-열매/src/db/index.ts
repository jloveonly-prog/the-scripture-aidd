// TASK-002: DB 초기화 + 쿼리 함수
// 연결 REQ: REQ-004 (목록조회), REQ-005 (작성), REQ-006 (상세조회)
// 단일 책임: better-sqlite3 연결 + posts CRUD 쿼리 함수

import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'
import { CREATE_POSTS_TABLE, CREATE_IDX_POSTS_CREATED_AT } from './schema.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_DIR = join(__dirname, '..', '..', 'data')
const DB_PATH = join(DB_DIR, 'app.db')

// DB 디렉토리 자동 생성
mkdirSync(DB_DIR, { recursive: true })

// better-sqlite3 동기 방식 초기화
const db = new Database(DB_PATH)

// WAL 모드 활성화 (성능 향상)
db.pragma('journal_mode = WAL')

// 스키마 초기화 (CREATE TABLE IF NOT EXISTS)
db.exec(CREATE_POSTS_TABLE)
db.exec(CREATE_IDX_POSTS_CREATED_AT)

// ===========================================================
// Post 타입 정의 (TBL-001 posts 테이블)
// ===========================================================
export interface Post {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface PostRow {
  id: number
  title: string
  created_at: string
}

// ===========================================================
// CRUD 쿼리 함수
// ===========================================================

/** REQ-004: 게시판 글 목록 조회 (최신순) */
export function getAllPosts(): PostRow[] {
  const stmt = db.prepare(
    'SELECT id, title, created_at FROM posts ORDER BY created_at DESC'
  )
  return stmt.all() as PostRow[]
}

/** REQ-006: 게시글 상세 조회 */
export function getPostById(id: number): Post | undefined {
  const stmt = db.prepare(
    'SELECT id, title, content, created_at, updated_at FROM posts WHERE id = ?'
  )
  return stmt.get(id) as Post | undefined
}

/** REQ-005: 게시글 작성 */
export function createPost(title: string, content: string): number {
  const stmt = db.prepare(
    'INSERT INTO posts (title, content) VALUES (?, ?)'
  )
  const result = stmt.run(title, content)
  return result.lastInsertRowid as number
}

export default db
