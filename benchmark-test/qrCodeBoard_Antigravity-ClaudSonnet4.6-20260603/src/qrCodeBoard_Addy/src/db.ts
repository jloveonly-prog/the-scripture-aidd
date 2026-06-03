// src/db.ts
// SQLite 초기화 및 CRUD 함수
// Source: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Post, CreatePostInput } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'board.db');

// better-sqlite3 동기 API — 로컬 PC 단일 사용자 앱에 적합 (ADR-003)
const db = new Database(DB_PATH);

// WAL 모드 활성화 (성능 향상)
db.pragma('journal_mode = WAL');

// 테이블 초기화
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    content    TEXT    NOT NULL,
    type       TEXT    NOT NULL CHECK(type IN ('url', 'text')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// content가 URL인지 판별
function detectType(content: string): 'url' | 'text' {
  try {
    const url = new URL(content);
    return url.protocol === 'http:' || url.protocol === 'https:' ? 'url' : 'text';
  } catch {
    return 'text';
  }
}

// DB row → API 응답 타입 변환
function rowToPost(row: { id: number; content: string; type: string; created_at: string }): Post {
  return {
    id: row.id,
    content: row.content,
    type: row.type as 'url' | 'text',
    createdAt: row.created_at,
  };
}

// --- CRUD 함수 ---

export function createPost(input: CreatePostInput): Post {
  const type = detectType(input.content);
  const stmt = db.prepare(
    'INSERT INTO posts (content, type) VALUES (?, ?) RETURNING id, content, type, created_at'
  );
  const row = stmt.get(input.content, type) as {
    id: number;
    content: string;
    type: string;
    created_at: string;
  };
  return rowToPost(row);
}

export function getPosts(
  page: number,
  pageSize: number
): { data: Post[]; totalItems: number } {
  const offset = (page - 1) * pageSize;

  const countRow = db
    .prepare('SELECT COUNT(*) as count FROM posts')
    .get() as { count: number };
  const totalItems = countRow.count;

  const rows = db
    .prepare(
      'SELECT id, content, type, created_at FROM posts ORDER BY id DESC LIMIT ? OFFSET ?'
    )
    .all(pageSize, offset) as Array<{
    id: number;
    content: string;
    type: string;
    created_at: string;
  }>;

  return { data: rows.map(rowToPost), totalItems };
}

export function getPostById(id: number): Post | null {
  const row = db
    .prepare('SELECT id, content, type, created_at FROM posts WHERE id = ?')
    .get(id) as
    | { id: number; content: string; type: string; created_at: string }
    | undefined;
  return row ? rowToPost(row) : null;
}

export function deletePost(id: number): boolean {
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

export default db;
