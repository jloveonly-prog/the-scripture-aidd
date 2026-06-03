import { DatabaseSync } from 'node:sqlite';
import path from 'path';

// REQ-003 DB 초기화
const dbPath = path.join(process.cwd(), 'scans.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL CHECK(length(content) > 0),
    scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Scan {
  id: number;
  content: string;
  scanned_at: string;
}

export const insertScan = (content: string): number => {
  const stmt = db.prepare('INSERT INTO scans (content) VALUES (?)');
  const info = stmt.run(content.trim());
  return info.lastInsertRowid as number;
};

export const getScans = (): Scan[] => {
  const stmt = db.prepare('SELECT * FROM scans ORDER BY scanned_at DESC');
  return stmt.all() as Scan[];
};
