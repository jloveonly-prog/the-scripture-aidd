import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'database.sqlite'));

// Initialize the database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface BoardItem {
  id: number;
  content: string;
  created_at: string;
}

export function getAllItems(): BoardItem[] {
  const stmt = db.prepare('SELECT * FROM boards ORDER BY created_at DESC');
  return stmt.all() as BoardItem[];
}

export function createItem(content: string): BoardItem {
  const stmt = db.prepare('INSERT INTO boards (content) VALUES (?)');
  const info = stmt.run(content);
  return db.prepare('SELECT * FROM boards WHERE id = ?').get(info.lastInsertRowid) as BoardItem;
}

export default db;
