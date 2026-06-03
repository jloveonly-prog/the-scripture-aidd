// tests/routes.test.js — API 라우트 통합 테스트
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { initTestDatabase, createPost, closeDatabase } = require('../src/db');

// Hono의 app을 직접 import하여 테스트 (서버 시작 없이)
const { Hono } = require('hono');
const { boardRouter } = require('../src/routes/board');

describe('게시판 라우트', () => {
  let app;

  before(() => {
    initTestDatabase();
    app = new Hono();
    app.route('/board', boardRouter);
  });

  after(() => {
    closeDatabase();
  });

  describe('GET /board', () => {
    it('게시글 목록 페이지를 반환한다', async () => {
      const res = await app.request('/board');
      assert.equal(res.status, 200);
      const text = await res.text();
      assert.ok(text.includes('게시판'));
    });

    it('비어있을 때 빈 상태 메시지를 표시한다', async () => {
      const res = await app.request('/board');
      const text = await res.text();
      assert.ok(text.includes('아직 게시글이 없습니다'));
    });
  });

  describe('GET /board/new', () => {
    it('작성 폼 페이지를 반환한다', async () => {
      const res = await app.request('/board/new');
      assert.equal(res.status, 200);
      const text = await res.text();
      assert.ok(text.includes('새 글 작성'));
      assert.ok(text.includes('<form'));
    });
  });

  describe('POST /board', () => {
    it('유효한 데이터로 게시글을 생성하면 리다이렉트한다', async () => {
      const formData = new FormData();
      formData.append('title', '통합 테스트 글');
      formData.append('content', '테스트 내용입니다');
      formData.append('author', '테스터');

      const res = await app.request('/board', {
        method: 'POST',
        body: formData,
      });
      assert.equal(res.status, 302);
      assert.ok(res.headers.get('location')?.includes('/board'));
    });

    it('빈 제목으로 게시글 작성 시 422를 반환한다', async () => {
      const formData = new FormData();
      formData.append('title', '');
      formData.append('content', '내용');

      const res = await app.request('/board', {
        method: 'POST',
        body: formData,
      });
      assert.equal(res.status, 422);
      const text = await res.text();
      assert.ok(text.includes('제목을 입력해주세요'));
    });

    it('200자 초과 제목으로 작성 시 422를 반환한다', async () => {
      const formData = new FormData();
      formData.append('title', 'a'.repeat(201));
      formData.append('content', '내용');

      const res = await app.request('/board', {
        method: 'POST',
        body: formData,
      });
      assert.equal(res.status, 422);
      const text = await res.text();
      assert.ok(text.includes('200자'));
    });
  });

  describe('GET /board/:id', () => {
    it('존재하는 게시글의 상세 페이지를 반환한다', async () => {
      const post = createPost({ title: '상세 테스트', content: '상세 내용' });
      const res = await app.request(`/board/${post.id}`);
      assert.equal(res.status, 200);
      const text = await res.text();
      assert.ok(text.includes('상세 테스트'));
      assert.ok(text.includes('상세 내용'));
    });

    it('존재하지 않는 게시글은 404를 반환한다', async () => {
      const res = await app.request('/board/99999');
      assert.equal(res.status, 404);
      const text = await res.text();
      assert.ok(text.includes('찾을 수 없습니다'));
    });

    it('잘못된 ID 형식은 404를 반환한다', async () => {
      const res = await app.request('/board/abc');
      assert.equal(res.status, 404);
    });
  });

  describe('GET /board/:id/edit', () => {
    it('수정 폼 페이지를 반환한다', async () => {
      const post = createPost({ title: '수정할 글', content: '원래 내용' });
      const res = await app.request(`/board/${post.id}/edit`);
      assert.equal(res.status, 200);
      const text = await res.text();
      assert.ok(text.includes('글 수정'));
      assert.ok(text.includes('수정할 글'));
    });
  });

  describe('POST /board/:id/edit', () => {
    it('게시글을 수정하면 상세 페이지로 리다이렉트한다', async () => {
      const post = createPost({ title: '수정 전', content: '이전 내용' });
      const formData = new FormData();
      formData.append('title', '수정 후');
      formData.append('content', '새 내용');

      const res = await app.request(`/board/${post.id}/edit`, {
        method: 'POST',
        body: formData,
      });
      assert.equal(res.status, 302);
      assert.ok(res.headers.get('location')?.includes(`/board/${post.id}`));
    });
  });

  describe('POST /board/:id/delete', () => {
    it('게시글을 삭제하면 목록으로 리다이렉트한다', async () => {
      const post = createPost({ title: '삭제할 글', content: '' });
      const res = await app.request(`/board/${post.id}/delete`, {
        method: 'POST',
      });
      assert.equal(res.status, 302);
      assert.ok(res.headers.get('location')?.includes('/board'));
    });
  });
});
