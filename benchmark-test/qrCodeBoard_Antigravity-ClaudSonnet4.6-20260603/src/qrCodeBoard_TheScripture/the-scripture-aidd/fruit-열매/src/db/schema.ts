// TASK-002: DB 스키마 DDL
// 연결 REQ: REQ-004, REQ-005, REQ-006 (게시판 CRUD)
// 방어 깊이(Defense in Depth) 3번째 층: DB CHECK 제약

export const CREATE_POSTS_TABLE = `
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL CHECK(length(trim(title)) > 0),
    content    TEXT    NOT NULL CHECK(length(trim(content)) > 0),
    created_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`

export const CREATE_IDX_POSTS_CREATED_AT = `
  CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)
`
