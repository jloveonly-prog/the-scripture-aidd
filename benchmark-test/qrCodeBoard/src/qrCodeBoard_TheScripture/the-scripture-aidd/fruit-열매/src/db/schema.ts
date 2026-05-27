// DB 스키마 — data-ark-법궤.md DDL 기반 (TBL-001: posts)
// REQ-003: 게시판 CRUD 데이터 저장
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', 'data', 'board.db');

// 데이터 디렉토리 생성
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// WAL 모드 활성화 (성능 향상)
db.pragma('journal_mode = WAL');

// TBL-001: posts 테이블 생성 (data-ark-법궤.md DDL 기반)
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(title) > 0),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
`);

// 게시글 타입 정의
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// --- DB 서비스 함수 (단일 책임: 데이터 접근) ---

// FR-004: 게시판 목록 조회
export function getPosts(page: number = 1, pageSize: number = 10): { posts: Post[]; total: number } {
  try {
    const total = (db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }).count;
    const offset = (page - 1) * pageSize;
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(pageSize, offset) as Post[];
    return { posts, total };
  } catch (err) {
    console.error('[DB ERROR] getPosts:', err);
    throw err;
  }
}

// FR-006: 게시글 상세 조회
export function getPostById(id: number): Post | undefined {
  try {
    return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
  } catch (err) {
    console.error('[DB ERROR] getPostById:', err);
    throw err;
  }
}

// FR-005: 게시글 생성
export function createPost(title: string, content: string): Post {
  try {
    const stmt = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)');
    const result = stmt.run(title, content);
    return getPostById(Number(result.lastInsertRowid))!;
  } catch (err) {
    console.error('[DB ERROR] createPost:', err);
    throw err;
  }
}

// FR-007: 게시글 수정
export function updatePost(id: number, title: string, content: string): Post | undefined {
  try {
    const stmt = db.prepare(
      "UPDATE posts SET title = ?, content = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
    );
    const result = stmt.run(title, content, id);
    if (result.changes === 0) return undefined;
    return getPostById(id);
  } catch (err) {
    console.error('[DB ERROR] updatePost:', err);
    throw err;
  }
}

// FR-008: 게시글 삭제
export function deletePost(id: number): boolean {
  try {
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    return result.changes > 0;
  } catch (err) {
    console.error('[DB ERROR] deletePost:', err);
    throw err;
  }
}

export default db;
