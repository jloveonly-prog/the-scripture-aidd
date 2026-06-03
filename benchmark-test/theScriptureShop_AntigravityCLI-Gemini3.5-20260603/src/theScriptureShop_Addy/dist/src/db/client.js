import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
// Ensure the data directory exists
const dbDir = path.resolve('data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
export const db = createClient({
    url: 'file:data/shop.db',
});
export async function initDb() {
    // Create tables
    await db.execute(`
    CREATE TABLE IF NOT EXISTS bibles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      translation TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_color TEXT NOT NULL
    )
  `);
    await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      confessed INTEGER NOT NULL,
      status TEXT NOT NULL,
      invoice_number TEXT,
      created_at TEXT NOT NULL
    )
  `);
    await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      bible_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (bible_id) REFERENCES bibles (id)
    )
  `);
    // Seed Bibles if empty
    const countRes = await db.execute('SELECT COUNT(*) as count FROM bibles');
    const count = Number(countRes.rows[0].count);
    if (count === 0) {
        const seedBibles = [
            {
                title: 'King James Version',
                translation: 'KJV',
                description: 'The historic English translation of the Holy Scriptures, published in 1611 under King James I. Renowned for its majestic, poetic language and word-for-word accuracy.',
                cover_color: 'from-amber-950 to-amber-900'
            },
            {
                title: 'New International Version',
                translation: 'NIV',
                description: 'The world\'s most popular modern English translation. Balances word-for-word accuracy with clear, thought-for-thought readability, perfect for study and devotion.',
                cover_color: 'from-emerald-950 to-emerald-900'
            },
            {
                title: 'English Standard Version',
                translation: 'ESV',
                description: 'An "essentially literal" translation that emphasizes word-for-word correspondence, literary excellence, and depth of meaning. Highly favored by scholars.',
                cover_color: 'from-indigo-950 to-indigo-900'
            },
            {
                title: 'New American Standard Bible',
                translation: 'NASB',
                description: 'Widely respected as the most literal word-for-word translation of the Bible in English, retaining original sentence structures for precise study.',
                cover_color: 'from-blue-950 to-blue-900'
            },
            {
                title: 'New Living Translation',
                translation: 'NLT',
                description: 'A modern translation using dynamic equivalence to render ancient texts into clear, natural English. Exceptionally accessible and engaging to read.',
                cover_color: 'from-rose-950 to-rose-900'
            },
            {
                title: 'Textus Receptus (Greek)',
                translation: 'GNT-TR',
                description: 'The classic Greek New Testament text compiled by Erasmus, which served as the textual basis for the KJV and other Protestant Reformation translations.',
                cover_color: 'from-slate-900 to-slate-800'
            },
            {
                title: 'Westminster Leningrad Codex (Hebrew)',
                translation: 'WLC',
                description: 'The oldest complete manuscript of the Hebrew Bible (Old Testament) in Hebrew, preserving the Masoretic Text tradition with vowel points and cantillations.',
                cover_color: 'from-amber-900 to-orange-950'
            },
            {
                title: 'Latin Vulgate',
                translation: 'VUL',
                description: 'The historic Latin translation of the Bible prepared by St. Jerome in the late 4th century. The standard text of the Western Church for over a millennium.',
                cover_color: 'from-purple-950 to-purple-900'
            },
            {
                title: '개역한글 성경',
                translation: 'KOR',
                description: '한국 교회가 오랫동안 공식적으로 사용하며 깊은 영적 유산을 담아온 전통적인 한국어 번역본. 문체가 장중하고 신앙고백적 깊이가 있습니다.',
                cover_color: 'from-teal-950 to-teal-900'
            },
            {
                title: 'KJV 한영 대조 성경',
                translation: 'KJV/KOR',
                description: '영문 킹제임스 성경(KJV)과 한국어 개역한글 성경(KOR)을 나란히 배치하여, 성경 연구와 어학 학습을 동시에 돕는 최고의 대조 성경입니다.',
                cover_color: 'from-cyan-950 to-cyan-900'
            }
        ];
        for (const b of seedBibles) {
            await db.execute({
                sql: 'INSERT INTO bibles (title, translation, description, cover_color) VALUES (?, ?, ?, ?)',
                args: [b.title, b.translation, b.description, b.cover_color]
            });
        }
    }
}
