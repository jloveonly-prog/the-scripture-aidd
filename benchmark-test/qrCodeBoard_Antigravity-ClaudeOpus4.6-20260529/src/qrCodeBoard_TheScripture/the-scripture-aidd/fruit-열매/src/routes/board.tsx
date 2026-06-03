/**
 * 게시판 HTTP 핸들러
 * 연결 REQ: REQ-002, API-002~008
 * 단일 책임: 게시판 HTTP 요청 수신/응답 반환
 */
import { Hono } from 'hono';
import { Layout } from '../views/layout.js';
import { BoardList } from '../views/board/list.js';
import { BoardDetail } from '../views/board/detail.js';
import { BoardForm } from '../views/board/form.js';
import { listPosts, findPost, addPost, editPost, removePost, validatePostInput } from '../services/boardService.js';

const boardRoutes = new Hono();

/** API-002: GET /board — 게시판 글 목록 */
boardRoutes.get('/', (c) => {
  try {
    const posts = listPosts(); // FR-002
    return c.html(
      <Layout title="게시판">
        <BoardList posts={posts} />
      </Layout>
    );
  } catch (err) {
    console.error('게시판 목록 조회 에러:', err);
    return c.text('데이터를 불러올 수 없습니다.', 500);
  }
});

/** API-004: GET /board/new — 글 작성 폼 */
boardRoutes.get('/new', (c) => {
  return c.html(
    <Layout title="새 글 작성">
      <BoardForm mode="create" />
    </Layout>
  );
});

/** API-003: GET /board/:id — 게시글 상세 */
boardRoutes.get('/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.text('잘못된 요청입니다.', 400);
    }
    const post = findPost(id); // FR-003
    if (!post) {
      return c.html(
        <Layout title="게시글 없음">
          <div class="text-center py-16">
            <div class="text-4xl mb-4">😢</div>
            <p class="text-slate-500 mb-4">게시글을 찾을 수 없습니다.</p>
            <a href="/board" class="text-indigo-600 hover:text-indigo-700 font-medium">← 목록으로</a>
          </div>
        </Layout>,
        404
      );
    }
    return c.html(
      <Layout title={post.title}>
        <BoardDetail post={post} />
      </Layout>
    );
  } catch (err) {
    console.error('게시글 상세 조회 에러:', err);
    return c.text('데이터를 불러올 수 없습니다.', 500);
  }
});

/** API-005: POST /board — 게시글 저장 */
boardRoutes.post('/', async (c) => {
  try {
    const body = await c.req.parseBody();
    const title = String(body['title'] ?? '');
    const content = String(body['content'] ?? '');

    // 방어 깊이 2층: 서버 검증
    const validation = validatePostInput({ title, content });
    if (!validation.valid) {
      return c.html(
        <Layout title="새 글 작성">
          <BoardForm mode="create" error={validation.error} />
        </Layout>,
        400
      );
    }

    addPost({ title, content }); // FR-004
    return c.redirect('/board');
  } catch (err) {
    console.error('게시글 저장 에러:', err);
    return c.text('저장에 실패했습니다. 다시 시도해주세요.', 500);
  }
});

/** API-006: GET /board/:id/edit — 수정 폼 */
boardRoutes.get('/:id/edit', (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.text('잘못된 요청입니다.', 400);
    }
    const post = findPost(id);
    if (!post) {
      return c.html(
        <Layout title="게시글 없음">
          <div class="text-center py-16">
            <div class="text-4xl mb-4">😢</div>
            <p class="text-slate-500 mb-4">게시글을 찾을 수 없습니다.</p>
            <a href="/board" class="text-indigo-600 hover:text-indigo-700 font-medium">← 목록으로</a>
          </div>
        </Layout>,
        404
      );
    }
    return c.html(
      <Layout title="글 수정">
        <BoardForm mode="edit" post={post} />
      </Layout>
    );
  } catch (err) {
    console.error('수정 폼 에러:', err);
    return c.text('데이터를 불러올 수 없습니다.', 500);
  }
});

/** API-007: POST /board/:id/edit — 수정 처리 */
boardRoutes.post('/:id/edit', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.text('잘못된 요청입니다.', 400);
    }

    const body = await c.req.parseBody();
    const title = String(body['title'] ?? '');
    const content = String(body['content'] ?? '');

    // 방어 깊이 2층: 서버 검증
    const validation = validatePostInput({ title, content });
    if (!validation.valid) {
      const post = findPost(id);
      return c.html(
        <Layout title="글 수정">
          <BoardForm mode="edit" post={post} error={validation.error} />
        </Layout>,
        400
      );
    }

    const updated = editPost(id, { title, content }); // FR-005
    if (!updated) {
      return c.text('게시글을 찾을 수 없습니다.', 404);
    }
    return c.redirect(`/board/${id}`);
  } catch (err) {
    console.error('게시글 수정 에러:', err);
    return c.text('수정에 실패했습니다. 다시 시도해주세요.', 500);
  }
});

/** API-008: POST /board/:id/delete — 삭제 처리 */
boardRoutes.post('/:id/delete', (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.text('잘못된 요청입니다.', 400);
    }
    const deleted = removePost(id); // FR-006
    if (!deleted) {
      return c.text('게시글을 찾을 수 없습니다.', 404);
    }
    return c.redirect('/board');
  } catch (err) {
    console.error('게시글 삭제 에러:', err);
    return c.text('삭제에 실패했습니다. 다시 시도해주세요.', 500);
  }
});

export default boardRoutes;
