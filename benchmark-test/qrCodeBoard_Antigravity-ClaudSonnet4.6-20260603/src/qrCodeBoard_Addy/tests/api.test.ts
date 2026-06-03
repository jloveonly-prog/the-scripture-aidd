// tests/api.test.ts
// API 통합 테스트 — TDD Prove-It Pattern
// Source: https://hono.dev/docs/guides/testing

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../src/app.js';

// Hono의 fetch 핸들러를 직접 테스트 (Node.js 어댑터 불필요)
const request = (path: string, options?: RequestInit) =>
  app.fetch(new Request(`http://localhost${path}`, options));

describe('POST /api/posts', () => {
  it('QR 스캔 결과(URL)를 저장하면 201과 Post 객체를 반환한다', async () => {
    const res = await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'https://example.com' }),
    });

    expect(res.status).toBe(201);
    const body = await res.json() as Record<string, unknown>;
    expect(body.id).toBeDefined();
    expect(body.content).toBe('https://example.com');
    expect(body.type).toBe('url');
    expect(body.createdAt).toBeDefined();
  });

  it('QR 스캔 결과(텍스트)를 저장하면 type이 text이다', async () => {
    const res = await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '안녕하세요 QR 텍스트' }),
    });

    expect(res.status).toBe(201);
    const body = await res.json() as Record<string, unknown>;
    expect(body.type).toBe('text');
    expect(body.content).toBe('안녕하세요 QR 텍스트');
  });

  it('content가 없으면 422 VALIDATION_ERROR를 반환한다', async () => {
    const res = await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(422);
    const body = await res.json() as { error: { code: string } };
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('content가 빈 문자열이면 422를 반환한다', async () => {
    const res = await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '   ' }),
    });

    expect(res.status).toBe(422);
  });

  it('JSON이 아닌 바디면 400 BAD_REQUEST를 반환한다', async () => {
    const res = await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/posts', () => {
  it('게시물 목록과 페이지네이션 정보를 반환한다', async () => {
    const res = await request('/api/posts');

    expect(res.status).toBe(200);
    const body = await res.json() as {
      data: unknown[];
      pagination: { page: number; pageSize: number; totalItems: number; totalPages: number };
    };
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.pagination).toBeDefined();
    expect(body.pagination.page).toBeGreaterThanOrEqual(1);
    expect(body.pagination.pageSize).toBeGreaterThanOrEqual(1);
    expect(body.pagination.totalItems).toBeGreaterThanOrEqual(0);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('존재하는 게시물을 삭제하면 204를 반환한다', async () => {
    // 먼저 게시물 생성
    const createRes = await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'https://delete-test.com' }),
    });
    const created = await createRes.json() as { id: number };

    // 삭제
    const deleteRes = await request(`/api/posts/${created.id}`, {
      method: 'DELETE',
    });
    expect(deleteRes.status).toBe(204);
  });

  it('존재하지 않는 ID를 삭제하면 404 NOT_FOUND를 반환한다', async () => {
    const res = await request('/api/posts/999999', { method: 'DELETE' });
    expect(res.status).toBe(404);
    const body = await res.json() as { error: { code: string } };
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('잘못된 ID 형식이면 400을 반환한다', async () => {
    const res = await request('/api/posts/abc', { method: 'DELETE' });
    expect(res.status).toBe(400);
  });
});
