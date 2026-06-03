// src/routes/api.ts
// REST API 엔드포인트
// Source: https://hono.dev/docs/api/routing

import { Hono } from 'hono';
import { createPost, getPosts, deletePost } from '../db.js';
import type { CreatePostInput, PaginatedResult, Post } from '../types.js';

const api = new Hono();

// POST /api/posts — QR 스캔 결과 저장
api.post('/posts', async (c) => {
  let body: Partial<CreatePostInput>;
  try {
    body = await c.req.json<Partial<CreatePostInput>>();
  } catch {
    return c.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      400
    );
  }

  // 입력 검증 (API 경계에서만)
  if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
    return c.json(
      { error: { code: 'VALIDATION_ERROR', message: 'content is required and must be a non-empty string' } },
      422
    );
  }

  const post = createPost({ content: body.content.trim() });
  return c.json(post, 201);
});

// GET /api/posts — 목록 조회 (페이지네이션)
api.get('/posts', (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(c.req.query('pageSize') ?? '20', 10) || 20));

  const { data, totalItems } = getPosts(page, pageSize);
  const totalPages = Math.ceil(totalItems / pageSize);

  const result: PaginatedResult<Post> = {
    data,
    pagination: { page, pageSize, totalItems, totalPages },
  };
  return c.json(result, 200);
});

// DELETE /api/posts/:id — 삭제
api.delete('/posts/:id', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) {
    return c.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid post id' } },
      400
    );
  }

  const deleted = deletePost(id);
  if (!deleted) {
    return c.json(
      { error: { code: 'NOT_FOUND', message: 'Post not found' } },
      404
    );
  }

  return new Response(null, { status: 204 });
});

export default api;
