import { DatabaseSync } from 'node:sqlite';
import { join } from 'path';

// TBL-001, TBL-002, TBL-003: SQLite database client and schema setup using Node's native node:sqlite
const dbPath = join(process.cwd(), process.env.NODE_ENV === 'test' ? 'db.test.sqlite' : 'db.sqlite');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

export function initDb() {
  // Create bibles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bibles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      translation_name TEXT NOT NULL UNIQUE CHECK(length(trim(translation_name)) > 0),
      cover_image TEXT NOT NULL CHECK(length(trim(cover_image)) > 0),
      description TEXT NOT NULL CHECK(length(trim(description)) > 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE CHECK(length(trim(order_number)) > 0),
      customer_name TEXT NOT NULL CHECK(length(trim(customer_name)) > 0),
      contact TEXT NOT NULL CHECK(length(trim(contact)) > 0),
      address TEXT NOT NULL CHECK(length(trim(address)) > 0),
      believed INTEGER NOT NULL CHECK(believed = 1),
      believed_at TEXT NOT NULL,
      tracking_number TEXT CHECK(tracking_number IS NULL OR (length(tracking_number) = 8 AND tracking_number NOT GLOB '*[^0-9]*')),
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SHIPPED')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create order_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      bible_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (bible_id) REFERENCES bibles(id)
    )
  `);
}
