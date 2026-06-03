/**
 * DB 연결 + 초기화 + CRUD 쿼리
 * 연결 REQ: REQ-002, TBL-001
 * 단일 책임: 데이터 저장/조회
 */
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'qrboard.db');

const db = new Database(DB_PATH);

// WAL 모드 활성화 (성능)
db.pragma('journal_mode = WAL');

// DDL — TBL-001: posts (data-ark-법궤.md 기반)
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL CHECK(length(trim(title)) > 0),
    content    TEXT    NOT NULL CHECK(length(trim(content)) > 0),
    created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
`);

// 타입 정의
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// CRUD 쿼리 — FR-002~006

/** FR-002: 게시글 목록 조회 (최신순) */
export function getAllPosts(): Post[] {
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  return stmt.all() as Post[];
}

/** FR-003: 게시글 상세 조회 */
export function getPostById(id: number): Post | undefined {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  return stmt.get(id) as Post | undefined;
}

/** FR-004: 게시글 작성 */
export function createPost(title: string, content: string): number {
  const stmt = db.prepare(
    'INSERT INTO posts (title, content) VALUES (?, ?)'
  );
  const result = stmt.run(title.trim(), content.trim());
  return Number(result.lastInsertRowid);
}

/** FR-005: 게시글 수정 */
export function updatePost(id: number, title: string, content: string): boolean {
  const stmt = db.prepare(
    `UPDATE posts SET title = ?, content = ?, updated_at = datetime('now','localtime') WHERE id = ?`
  );
  const result = stmt.run(title.trim(), content.trim(), id);
  return result.changes > 0;
}

/** FR-006: 게시글 삭제 */
export function deletePost(id: number): boolean {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export default db;
