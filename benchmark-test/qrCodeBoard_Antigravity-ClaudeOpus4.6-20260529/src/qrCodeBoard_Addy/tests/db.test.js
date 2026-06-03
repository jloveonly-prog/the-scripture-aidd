// tests/db.test.js — DB 모듈 단위 테스트
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  initTestDatabase,
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  closeDatabase,
} = require('../src/db');

describe('DB 모듈', () => {
  before(() => {
    initTestDatabase();
  });

  after(() => {
    closeDatabase();
  });

  describe('createPost', () => {
    it('제목과 내용으로 게시글을 생성한다', () => {
      const post = createPost({ title: '테스트 제목', content: '테스트 내용', author: '작성자' });
      assert.ok(post.id);
      assert.equal(post.title, '테스트 제목');
      assert.equal(post.content, '테스트 내용');
      assert.equal(post.author, '작성자');
      assert.ok(post.created_at);
      assert.ok(post.updated_at);
    });

    it('작성자 미지정 시 "익명"으로 설정된다', () => {
      const post = createPost({ title: '익명 글', content: '' });
      assert.equal(post.author, '익명');
    });

    it('내용 미지정 시 빈 문자열로 설정된다', () => {
      const post = createPost({ title: '내용 없는 글' });
      assert.equal(post.content, '');
    });
  });

  describe('getPost', () => {
    it('존재하는 게시글을 조회한다', () => {
      const created = createPost({ title: '조회 테스트', content: '내용' });
      const found = getPost(created.id);
      assert.equal(found.id, created.id);
      assert.equal(found.title, '조회 테스트');
    });

    it('존재하지 않는 ID는 undefined를 반환한다', () => {
      const found = getPost(99999);
      assert.equal(found, undefined);
    });
  });

  describe('updatePost', () => {
    it('게시글 제목과 내용을 수정한다', () => {
      const created = createPost({ title: '원래 제목', content: '원래 내용' });
      const updated = updatePost(created.id, { title: '수정된 제목', content: '수정된 내용', author: '수정자' });
      assert.equal(updated.title, '수정된 제목');
      assert.equal(updated.content, '수정된 내용');
      assert.equal(updated.author, '수정자');
    });
  });

  describe('deletePost', () => {
    it('게시글을 삭제한다', () => {
      const created = createPost({ title: '삭제 대상', content: '' });
      const result = deletePost(created.id);
      assert.equal(result, true);
      const found = getPost(created.id);
      assert.equal(found, undefined);
    });

    it('존재하지 않는 게시글 삭제 시 false를 반환한다', () => {
      const result = deletePost(99999);
      assert.equal(result, false);
    });
  });

  describe('listPosts', () => {
    before(() => {
      // 테스트 데이터를 충분히 생성
      initTestDatabase();
      for (let i = 1; i <= 25; i++) {
        createPost({ title: `게시글 ${i}`, content: `내용 ${i}` });
      }
    });

    it('페이지네이션으로 게시글 목록을 조회한다', () => {
      const result = listPosts(1, 10);
      assert.equal(result.posts.length, 10);
      assert.equal(result.pagination.page, 1);
      assert.equal(result.pagination.totalItems, 25);
      assert.equal(result.pagination.totalPages, 3);
    });

    it('2페이지를 조회한다', () => {
      const result = listPosts(2, 10);
      assert.equal(result.posts.length, 10);
      assert.equal(result.pagination.page, 2);
    });

    it('마지막 페이지를 조회한다', () => {
      const result = listPosts(3, 10);
      assert.equal(result.posts.length, 5);
      assert.equal(result.pagination.page, 3);
    });

    it('범위를 벗어난 페이지는 마지막 페이지로 보정된다', () => {
      const result = listPosts(100, 10);
      assert.equal(result.pagination.page, 3);
    });

    it('게시글이 없을 때 빈 배열을 반환한다', () => {
      initTestDatabase(); // 빈 DB 재초기화
      const result = listPosts(1, 10);
      assert.equal(result.posts.length, 0);
      assert.equal(result.pagination.totalItems, 0);
      assert.equal(result.pagination.totalPages, 1);
    });
  });
});
