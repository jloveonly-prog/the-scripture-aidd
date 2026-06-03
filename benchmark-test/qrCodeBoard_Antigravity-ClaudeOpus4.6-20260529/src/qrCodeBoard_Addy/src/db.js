// src/db.js — SQLite DB 초기화 및 CRUD 헬퍼
// Source: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'board.db');

let db;

/**
 * DB 인스턴스를 초기화하고 스키마를 생성한다.
 * @returns {import('better-sqlite3').Database}
 */
function initDatabase() {
  if (db) return db;

  const fs = require('fs');
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '익명',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  return db;
}

/**
 * 게시글 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (1-based)
 * @param {number} pageSize - 페이지당 항목 수
 * @returns {{ posts: Array, pagination: { page: number, pageSize: number, totalItems: number, totalPages: number } }}
 */
function listPosts(page = 1, pageSize = 10) {
  const database = initDatabase();
  const totalItems = database.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const offset = (safePage - 1) * pageSize;

  const posts = database.prepare(
    'SELECT id, title, author, created_at, updated_at FROM posts ORDER BY id DESC LIMIT ? OFFSET ?'
  ).all(pageSize, offset);

  return {
    posts,
    pagination: { page: safePage, pageSize, totalItems, totalPages },
  };
}

/**
 * 게시글 상세 조회
 * @param {number} id
 * @returns {object|undefined}
 */
function getPost(id) {
  const database = initDatabase();
  return database.prepare('SELECT * FROM posts WHERE id = ?').get(id);
}

/**
 * 게시글 생성
 * @param {{ title: string, content: string, author?: string }} data
 * @returns {object}
 */
function createPost({ title, content, author }) {
  const database = initDatabase();
  const stmt = database.prepare(
    'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)'
  );
  const result = stmt.run(title, content || '', author || '익명');
  return getPost(result.lastInsertRowid);
}

/**
 * 게시글 수정
 * @param {number} id
 * @param {{ title: string, content: string, author?: string }} data
 * @returns {object|undefined}
 */
function updatePost(id, { title, content, author }) {
  const database = initDatabase();
  const stmt = database.prepare(
    "UPDATE posts SET title = ?, content = ?, author = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
  );
  stmt.run(title, content || '', author || '익명', id);
  return getPost(id);
}

/**
 * 게시글 삭제
 * @param {number} id
 * @returns {boolean}
 */
function deletePost(id) {
  const database = initDatabase();
  const result = database.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

/**
 * DB 연결 종료
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * 테스트용 — 인메모리 DB로 초기화
 * @returns {import('better-sqlite3').Database}
 */
function initTestDatabase() {
  if (db) {
    db.close();
  }
  db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '익명',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  return db;
}

module.exports = {
  initDatabase,
  initTestDatabase,
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  closeDatabase,
};
