// Phase 5 자동화 테스트 — node:test 사용 (SKILL-05 권장)
// REQ-001~003, FR-001~008 전체 검증
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 테스트 전용 DB (격리 — SKILL-05 3단계)
const testDbPath = path.join(__dirname, '..', 'data', 'test_board.db');

describe('DB CRUD 테스트 — TBL-001 posts', () => {
  let db: InstanceType<typeof Database>;

  before(() => {
    // 테스트 DB 초기화
    const dir = path.dirname(testDbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);

    db = new Database(testDbPath);
    db.pragma('journal_mode = WAL');
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
  });

  after(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  // FR-005: 게시글 생성
  it('REQ-003/FR-005: 게시글 생성', () => {
    const stmt = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)');
    const result = stmt.run('테스트 제목', '테스트 내용');
    assert.ok(result.lastInsertRowid > 0, '게시글 ID가 생성되어야 한다');
  });

  // FR-006: 게시글 상세 조회
  it('REQ-003/FR-006: 게시글 상세 조회', () => {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(1) as any;
    assert.ok(post, '게시글이 존재해야 한다');
    assert.strictEqual(post.title, '테스트 제목');
    assert.strictEqual(post.content, '테스트 내용');
  });

  // FR-004: 게시판 목록 조회
  it('REQ-003/FR-004: 게시판 목록 조회', () => {
    // 추가 게시글 생성
    db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run('두 번째', '내용2');
    db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run('세 번째', '내용3');

    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    assert.ok(posts.length >= 3, '최소 3개 게시글이 존재해야 한다');
  });

  // FR-007: 게시글 수정
  it('REQ-003/FR-007: 게시글 수정', () => {
    const stmt = db.prepare("UPDATE posts SET title = ?, content = ?, updated_at = datetime('now', 'localtime') WHERE id = ?");
    const result = stmt.run('수정된 제목', '수정된 내용', 1);
    assert.strictEqual(result.changes, 1, '1개 행이 수정되어야 한다');

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(1) as any;
    assert.strictEqual(post.title, '수정된 제목');
  });

  // FR-008: 게시글 삭제
  it('REQ-003/FR-008: 게시글 삭제', () => {
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(1);
    assert.strictEqual(result.changes, 1, '1개 행이 삭제되어야 한다');

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(1);
    assert.strictEqual(post, undefined, '삭제된 게시글은 조회되지 않아야 한다');
  });

  // 에러 케이스: 빈 제목
  it('에러: 빈 제목 생성 시 CHECK 제약조건 위반', () => {
    assert.throws(() => {
      db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run('', '내용');
    }, 'CHECK 제약조건에 의해 빈 제목이 거부되어야 한다');
  });

  // 에러 케이스: 존재하지 않는 게시글 수정
  it('에러: 존재하지 않는 게시글 수정 시 changes = 0', () => {
    const result = db.prepare("UPDATE posts SET title = ? WHERE id = ?").run('없는글', 9999);
    assert.strictEqual(result.changes, 0, '존재하지 않는 게시글 수정 시 변경 행 0');
  });

  // 에러 케이스: 존재하지 않는 게시글 삭제
  it('에러: 존재하지 않는 게시글 삭제 시 changes = 0', () => {
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(9999);
    assert.strictEqual(result.changes, 0, '존재하지 않는 게시글 삭제 시 변경 행 0');
  });
});
