/**
 * 게시판 HTTP 통합 테스트 + DB 단위 테스트
 * Tier 1: DB CRUD 동작 검증
 * Tier 2: HTTP 요청 → 응답 상태코드 검증
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';
import { getAllPosts, createPost, getPostById, updatePost, deletePost } from '../src/db/database.js';

// ============================
// Tier 1: DB 단위 테스트
// ============================
describe('Tier 1: DB 단위 테스트 — TBL-001 posts', () => {

  test('FR-004: createPost — 게시글 생성 시 ID 반환', () => {
    const id = createPost('테스트 제목', '테스트 내용');
    assert.ok(id > 0, '생성된 ID는 양수여야 한다');
  });

  test('FR-003: getPostById — 존재하는 게시글 조회', () => {
    const id = createPost('조회 테스트', '조회 내용');
    const post = getPostById(id);
    assert.ok(post, '게시글이 존재해야 한다');
    assert.equal(post!.title, '조회 테스트');
    assert.equal(post!.content, '조회 내용');
  });

  test('FR-003: getPostById — 존재하지 않는 게시글 → undefined', () => {
    const post = getPostById(999999);
    assert.equal(post, undefined);
  });

  test('FR-002: getAllPosts — 게시글 목록 조회', () => {
    const posts = getAllPosts();
    assert.ok(Array.isArray(posts), '배열이어야 한다');
    assert.ok(posts.length > 0, '이전 테스트에서 생성한 게시글이 있어야 한다');
  });

  test('FR-005: updatePost — 게시글 수정 성공', () => {
    const id = createPost('수정 전', '수정 전 내용');
    const result = updatePost(id, '수정 후', '수정 후 내용');
    assert.equal(result, true);
    const post = getPostById(id);
    assert.equal(post!.title, '수정 후');
    assert.equal(post!.content, '수정 후 내용');
  });

  test('FR-005: updatePost — 존재하지 않는 게시글 수정 → false', () => {
    const result = updatePost(999999, '없는 글', '없는 내용');
    assert.equal(result, false);
  });

  test('FR-006: deletePost — 게시글 삭제 성공', () => {
    const id = createPost('삭제 테스트', '삭제 내용');
    const result = deletePost(id);
    assert.equal(result, true);
    const post = getPostById(id);
    assert.equal(post, undefined, '삭제 후 조회 불가');
  });

  test('FR-006: deletePost — 존재하지 않는 게시글 삭제 → false', () => {
    const result = deletePost(999999);
    assert.equal(result, false);
  });

  test('DB CHECK 제약: 빈 제목 → 에러', () => {
    assert.throws(() => {
      createPost('', '내용');
    }, '빈 제목은 CHECK 제약에 의해 거부되어야 한다');
  });

  test('DB CHECK 제약: 빈 내용 → 에러', () => {
    assert.throws(() => {
      createPost('제목', '');
    }, '빈 내용은 CHECK 제약에 의해 거부되어야 한다');
  });

  test('DB CHECK 제약: 공백만 있는 제목 → 에러', () => {
    assert.throws(() => {
      createPost('   ', '내용');
    }, '공백만 있는 제목은 CHECK 제약에 의해 거부되어야 한다');
  });
});

// ============================
// Tier 2: HTTP 통합 테스트
// ============================
describe('Tier 2: HTTP 통합 테스트 — API-001~008', () => {

  test('API-001: GET / → 200 (홈페이지)', async () => {
    const res = await app.request('/');
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('QR Code Board'), '홈페이지에 프로젝트명이 포함되어야 한다');
  });

  test('API-002: GET /board → 200 (게시판 목록)', async () => {
    const res = await app.request('/board');
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('게시판'), '게시판 페이지에 "게시판"이 포함되어야 한다');
  });

  test('API-004: GET /board/new → 200 (글 작성 폼)', async () => {
    const res = await app.request('/board/new');
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('새 글 작성'), '작성 폼에 "새 글 작성"이 포함되어야 한다');
  });

  test('API-005: POST /board — 정상 저장 → 302', async () => {
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ title: 'HTTP 테스트 글', content: 'HTTP 테스트 내용' }).toString(),
    });
    assert.equal(res.status, 302, '저장 성공 시 리다이렉트');
  });

  test('API-005: POST /board — 빈 제목 → 400', async () => {
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ title: '', content: '내용' }).toString(),
    });
    assert.equal(res.status, 400, '빈 제목 시 400');
  });

  test('API-005: POST /board — 빈 내용 → 400', async () => {
    const res = await app.request('/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ title: '제목', content: '' }).toString(),
    });
    assert.equal(res.status, 400, '빈 내용 시 400');
  });

  test('API-003: GET /board/:id — 존재하는 게시글 → 200', async () => {
    const id = createPost('상세 테스트', '상세 내용');
    const res = await app.request(`/board/${id}`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('상세 테스트'), '게시글 제목이 표시되어야 한다');
  });

  test('API-003: GET /board/99999 → 404 (존재하지 않는 게시글)', async () => {
    const res = await app.request('/board/99999');
    assert.equal(res.status, 404);
  });

  test('API-006: GET /board/:id/edit → 200 (수정 폼)', async () => {
    const id = createPost('수정폼 테스트', '수정폼 내용');
    const res = await app.request(`/board/${id}/edit`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('글 수정'), '수정 폼에 "글 수정"이 포함되어야 한다');
  });

  test('API-007: POST /board/:id/edit — 정상 수정 → 302', async () => {
    const id = createPost('수정전', '수정전 내용');
    const res = await app.request(`/board/${id}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ title: '수정후', content: '수정후 내용' }).toString(),
    });
    assert.equal(res.status, 302, '수정 성공 시 리다이렉트');
  });

  test('API-008: POST /board/:id/delete — 정상 삭제 → 302', async () => {
    const id = createPost('삭제 테스트 HTTP', '삭제 내용 HTTP');
    const res = await app.request(`/board/${id}/delete`, {
      method: 'POST',
    });
    assert.equal(res.status, 302, '삭제 성공 시 리다이렉트');
  });

  test('API-008: POST /board/99999/delete → 404', async () => {
    const res = await app.request('/board/99999/delete', {
      method: 'POST',
    });
    assert.equal(res.status, 404);
  });
});
