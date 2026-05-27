import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const DB_PATH = path.join(dataDir, 'board.db')
export const db = new DatabaseSync(DB_PATH)

// 초기 스키마 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT NOT NULL,
    content   TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`)

export interface Post {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export const postRepo = {
  findAll(): Post[] {
    const stmt = db.prepare('SELECT * FROM posts ORDER BY id DESC')
    return stmt.all() as unknown as Post[]
  },

  findById(id: number): Post | undefined {
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?')
    return stmt.get(id) as unknown as Post | undefined
  },

  create(title: string, content: string): Post {
    const stmt = db.prepare(
      'INSERT INTO posts (title, content) VALUES (?, ?) RETURNING *'
    )
    return stmt.get(title, content) as unknown as Post
  },

  update(id: number, title: string, content: string): Post | undefined {
    const stmt = db.prepare(
      `UPDATE posts SET title = ?, content = ?, updated_at = datetime('now', 'localtime')
       WHERE id = ? RETURNING *`
    )
    return stmt.get(title, content, id) as unknown as Post | undefined
  },

  delete(id: number): void {
    db.prepare('DELETE FROM posts WHERE id = ?').run(id)
  },
}
