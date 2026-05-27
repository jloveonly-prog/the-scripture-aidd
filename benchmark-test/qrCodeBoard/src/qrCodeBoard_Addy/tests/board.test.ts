import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { DatabaseSync } from 'node:sqlite'

// DB 레이어 단위 테스트 (인메모리 SQLite 사용)
describe('DB - postRepo (in-memory)', () => {
  let db: DatabaseSync
  let postRepo: {
    findAll: () => any[]
    findById: (id: number) => any
    create: (title: string, content: string) => any
    update: (id: number, title: string, content: string) => any
    delete: (id: number) => void
  }

  beforeAll(() => {
    db = new DatabaseSync(':memory:')
    db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        title     TEXT NOT NULL,
        content   TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );
    `)

    postRepo = {
      findAll: () => db.prepare('SELECT * FROM posts ORDER BY id DESC').all() as any[],
      findById: (id: number) => db.prepare('SELECT * FROM posts WHERE id = ?').get(id),
      create: (title: string, content: string) =>
        db.prepare('INSERT INTO posts (title, content) VALUES (?, ?) RETURNING *').get(title, content),
      update: (id: number, title: string, content: string) =>
        db.prepare(`UPDATE posts SET title=?, content=?, updated_at=datetime('now','localtime') WHERE id=? RETURNING *`).get(title, content, id),
      delete: (id: number) => { db.prepare('DELETE FROM posts WHERE id = ?').run(id) },
    }
  })

  afterAll(() => {
    db.close()
  })

  it('creates a post and returns it with correct fields', () => {
    const post = postRepo.create('테스트 제목', '테스트 내용')
    expect(post.id).toBeGreaterThan(0)
    expect(post.title).toBe('테스트 제목')
    expect(post.content).toBe('테스트 내용')
    expect(post.created_at).toBeDefined()
  })

  it('finds all posts ordered by id descending', () => {
    postRepo.create('첫 번째', '내용1')
    postRepo.create('두 번째', '내용2')
    const posts = postRepo.findAll()
    expect(posts.length).toBeGreaterThanOrEqual(2)
    // DESC 순서 확인
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].id).toBeGreaterThan(posts[i + 1].id)
    }
  })

  it('finds a post by id', () => {
    const created = postRepo.create('찾기테스트', '내용')
    const found = postRepo.findById(created.id)
    expect(found).toBeDefined()
    expect(found.title).toBe('찾기테스트')
  })

  it('returns undefined for non-existent id', () => {
    const found = postRepo.findById(99999)
    expect(found).toBeUndefined()
  })

  it('updates title and content', () => {
    const post = postRepo.create('원래제목', '원래내용')
    const updated = postRepo.update(post.id, '수정된제목', '수정된내용')
    expect(updated.title).toBe('수정된제목')
    expect(updated.content).toBe('수정된내용')
  })

  it('deletes a post', () => {
    const post = postRepo.create('삭제할 글', '삭제내용')
    postRepo.delete(post.id)
    const found = postRepo.findById(post.id)
    expect(found).toBeUndefined()
  })
})

// Hono 라우트 통합 테스트
describe('Hono app routes', () => {
  let app: any

  beforeAll(async () => {
    const { Hono } = await import('hono')
    const { homeRouter } = await import('../src/routes/home.tsx')
    const { boardRouter } = await import('../src/routes/board.tsx')
    app = new Hono()
    app.route('/', homeRouter)
    app.route('/board', boardRouter)
  })

  it('GET / returns 200 with QR scanner page', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('QR')
  })

  it('GET /board returns 200', async () => {
    const res = await app.request('/board')
    expect(res.status).toBe(200)
  })

  it('GET /board/new returns 200 with form', async () => {
    const res = await app.request('/board/new')
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('form')
  })

  it('POST /board with valid data redirects to detail', async () => {
    const body = new URLSearchParams({ title: '통합테스트 글', content: '테스트 내용입니다' })
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toMatch(/\/board\/\d+/)
  })

  it('POST /board with empty title returns 200 with error', async () => {
    const body = new URLSearchParams({ title: '', content: '내용' })
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('입력해주세요')
  })

  it('GET /board/999 non-existent returns 404', async () => {
    const res = await app.request('/board/999999')
    expect(res.status).toBe(404)
  })
})
