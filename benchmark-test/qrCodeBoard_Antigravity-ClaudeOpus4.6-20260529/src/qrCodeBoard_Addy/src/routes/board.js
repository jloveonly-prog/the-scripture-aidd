// src/routes/board.js — 게시판 CRUD 라우트
// Hono: https://hono.dev/docs/api/hono
const { Hono } = require('hono');
const { listPosts, getPost, createPost, updatePost, deletePost } = require('../db');
const { boardListView } = require('../views/board/list');
const { boardDetailView, notFoundView } = require('../views/board/detail');
const { boardFormView } = require('../views/board/form');

const boardRouter = new Hono();

/**
 * GET /board — 게시글 목록 (페이지네이션)
 */
boardRouter.get('/', (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10) || 1);
  const data = listPosts(page, 10);
  const html = boardListView(data);
  return c.html(html);
});

/**
 * GET /board/new — 새 글 작성 폼
 */
boardRouter.get('/new', (c) => {
  const html = boardFormView({ isEdit: false });
  return c.html(html);
});

/**
 * POST /board — 게시글 작성 처리
 * 유효성 검증: 제목 필수, 최대 200자
 */
boardRouter.post('/', async (c) => {
  const body = await c.req.parseBody();
  const title = String(body.title || '').trim();
  const content = String(body.content || '').trim();
  const author = String(body.author || '').trim() || '익명';

  // 입력 유효성 검증 (서버에서 반드시 수행)
  if (!title) {
    const html = boardFormView({
      post: { title, content, author },
      error: '제목을 입력해주세요.',
      isEdit: false,
    });
    return c.html(html, 422);
  }

  if (title.length > 200) {
    const html = boardFormView({
      post: { title, content, author },
      error: '제목은 200자 이하로 입력해주세요.',
      isEdit: false,
    });
    return c.html(html, 422);
  }

  createPost({ title, content, author });
  return c.redirect('/board');
});

/**
 * GET /board/:id — 게시글 상세 조회
 */
boardRouter.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) {
    return c.html(notFoundView(), 404);
  }

  const post = getPost(id);
  if (!post) {
    return c.html(notFoundView(), 404);
  }

  const html = boardDetailView({ post });
  return c.html(html);
});

/**
 * GET /board/:id/edit — 게시글 수정 폼
 */
boardRouter.get('/:id/edit', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const post = getPost(id);
  if (!post) {
    return c.html(notFoundView(), 404);
  }

  const html = boardFormView({ post, isEdit: true });
  return c.html(html);
});

/**
 * POST /board/:id/edit — 게시글 수정 처리
 */
boardRouter.post('/:id/edit', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const post = getPost(id);
  if (!post) {
    return c.html(notFoundView(), 404);
  }

  const body = await c.req.parseBody();
  const title = String(body.title || '').trim();
  const content = String(body.content || '').trim();
  const author = String(body.author || '').trim() || '익명';

  if (!title) {
    const html = boardFormView({
      post: { ...post, title, content, author },
      error: '제목을 입력해주세요.',
      isEdit: true,
    });
    return c.html(html, 422);
  }

  if (title.length > 200) {
    const html = boardFormView({
      post: { ...post, title, content, author },
      error: '제목은 200자 이하로 입력해주세요.',
      isEdit: true,
    });
    return c.html(html, 422);
  }

  updatePost(id, { title, content, author });
  return c.redirect(`/board/${id}`);
});

/**
 * POST /board/:id/delete — 게시글 삭제 처리
 */
boardRouter.post('/:id/delete', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  deletePost(id);
  return c.redirect('/board');
});

module.exports = { boardRouter };
