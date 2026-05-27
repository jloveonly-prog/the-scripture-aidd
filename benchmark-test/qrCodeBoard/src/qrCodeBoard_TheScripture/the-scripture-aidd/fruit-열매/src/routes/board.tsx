// 게시판 라우트 — SCR-002~005, API-002~008
// REQ-003: 게시판 CRUD
// FR-004~008: 게시판 목록/작성/상세/수정/삭제
import { Hono } from 'hono';
import { Layout } from '../components/layout';
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../db/schema';
import type { Post } from '../db/schema';

const board = new Hono();

// API-002: GET /board — 게시판 목록 (SCR-002, UC-003)
board.get('/', (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const currentPage = isNaN(page) || page < 1 ? 1 : page;
    const pageSize = 10;
    const { posts, total } = getPosts(currentPage, pageSize);
    const totalPages = Math.ceil(total / pageSize);

    return c.html(
      <Layout title="게시판">
        {/* 페이지 헤더 + 글쓰기 버튼 */}
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-slate-800">📋 게시판</h1>
          <a href="/board/new" class="btn-primary px-4 py-2 rounded-lg font-medium text-sm no-underline transition-colors focus-ring" aria-label="새 글 작성">
            ✏️ 글쓰기
          </a>
        </div>

        {/* 게시글 목록 테이블 — FR-004 */}
        {posts.length === 0 ? (
          <div class="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p class="text-slate-400 text-lg mb-2">아직 게시글이 없습니다</p>
            <p class="text-slate-400 text-sm">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full" aria-label="게시글 목록">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">제목</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">작성일</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {posts.map((post: Post) => (
                  <tr class="hover:bg-slate-50 transition-colors" key={post.id}>
                    <td class="px-4 py-3 text-sm text-slate-400">{post.id}</td>
                    <td class="px-4 py-3">
                      <a href={`/board/${post.id}`} class="text-slate-800 hover:text-indigo-700 font-medium no-underline hover:underline focus-ring rounded" tabindex={0}>
                        {post.title}
                      </a>
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-400 text-right">
                      {post.created_at.split(' ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div class="flex justify-center items-center gap-4 mt-6">
            {currentPage > 1 ? (
              <a href={`/board?page=${currentPage - 1}`} class="btn-secondary px-4 py-2 rounded-lg text-sm no-underline focus-ring" aria-label="이전 페이지">◀ 이전</a>
            ) : (
              <span class="px-4 py-2 text-sm text-slate-300">◀ 이전</span>
            )}
            <span class="text-sm text-slate-500">{currentPage} / {totalPages}</span>
            {currentPage < totalPages ? (
              <a href={`/board?page=${currentPage + 1}`} class="btn-secondary px-4 py-2 rounded-lg text-sm no-underline focus-ring" aria-label="다음 페이지">다음 ▶</a>
            ) : (
              <span class="px-4 py-2 text-sm text-slate-300">다음 ▶</span>
            )}
          </div>
        )}
      </Layout>
    );
  } catch (err) {
    console.error('[ERROR] Board list:', err);
    return c.html(
      <Layout title="오류">
        <div class="text-center py-12">
          <h1 class="text-xl font-bold text-red-600">목록을 불러올 수 없습니다</h1>
          <p class="text-slate-500 mt-2">잠시 후 다시 시도해주세요</p>
        </div>
      </Layout>,
      500
    );
  }
});

// API-003: GET /board/new — 게시글 작성 폼 (SCR-003, UC-004)
board.get('/new', (c) => {
  try {
    return c.html(
      <Layout title="새 글 작성">
        <h1 class="text-2xl font-bold text-slate-800 mb-6">✏️ 새 글 작성</h1>
        <form method="POST" action="/board" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {/* 제목 입력 — FR-005 */}
          <div class="mb-4">
            <label for="title" class="block text-sm font-semibold text-slate-700 mb-1">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxlength={200}
              placeholder="제목을 입력하세요"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors focus-ring"
              aria-label="게시글 제목"
            />
          </div>
          {/* 내용 입력 — FR-005 */}
          <div class="mb-6">
            <label for="content" class="block text-sm font-semibold text-slate-700 mb-1">내용</label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              placeholder="내용을 입력하세요"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y focus-ring"
              aria-label="게시글 내용"
            ></textarea>
          </div>
          {/* 액션 버튼 */}
          <div class="flex gap-3">
            <button type="submit" class="btn-primary px-6 py-2 rounded-lg font-medium transition-colors focus-ring" aria-label="게시글 저장">
              💾 저장
            </button>
            <a href="/board" class="btn-secondary px-6 py-2 rounded-lg font-medium no-underline transition-colors focus-ring" aria-label="취소">
              취소
            </a>
          </div>
        </form>
      </Layout>
    );
  } catch (err) {
    console.error('[ERROR] New post form:', err);
    return c.html(<Layout title="오류"><p class="text-red-600">오류가 발생했습니다</p></Layout>, 500);
  }
});

// API-004: POST /board — 게시글 저장 (UC-004)
board.post('/', async (c) => {
  try {
    const body = await c.req.parseBody();
    const title = (body['title'] as string || '').trim();
    const content = (body['content'] as string || '').trim();

    // 유효성 검증 — UC-004 E1, E2
    if (!title || !content) {
      return c.html(
        <Layout title="새 글 작성">
          <h1 class="text-2xl font-bold text-slate-800 mb-6">✏️ 새 글 작성</h1>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-red-700 text-sm">{!title ? '제목을 입력해주세요' : '내용을 입력해주세요'}</p>
          </div>
          <form method="POST" action="/board" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div class="mb-4">
              <label for="title" class="block text-sm font-semibold text-slate-700 mb-1">제목</label>
              <input type="text" id="title" name="title" required maxlength={200} value={title}
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors focus-ring" />
            </div>
            <div class="mb-6">
              <label for="content" class="block text-sm font-semibold text-slate-700 mb-1">내용</label>
              <textarea id="content" name="content" required rows={10}
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y focus-ring">{content}</textarea>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-primary px-6 py-2 rounded-lg font-medium transition-colors focus-ring">💾 저장</button>
              <a href="/board" class="btn-secondary px-6 py-2 rounded-lg font-medium no-underline transition-colors focus-ring">취소</a>
            </div>
          </form>
        </Layout>,
        400
      );
    }

    createPost(title, content);
    return c.redirect('/board');
  } catch (err) {
    console.error('[ERROR] Create post:', err);
    return c.html(<Layout title="오류"><p class="text-red-600">저장에 실패했습니다</p></Layout>, 500);
  }
});

// API-005: GET /board/:id — 게시글 상세 (SCR-004, UC-005)
board.get('/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.html(
        <Layout title="오류"><div class="text-center py-12"><h1 class="text-xl font-bold text-red-600">잘못된 요청입니다</h1><a href="/board" class="text-indigo-600 mt-4 inline-block">목록으로 돌아가기</a></div></Layout>,
        400
      );
    }

    const post = getPostById(id);
    // UC-005 E1: 존재하지 않는 게시글
    if (!post) {
      return c.html(
        <Layout title="게시글 없음">
          <div class="text-center py-12">
            <h1 class="text-xl font-bold text-slate-600">게시글을 찾을 수 없습니다</h1>
            <a href="/board" class="text-indigo-600 mt-4 inline-block focus-ring rounded">📋 목록으로 돌아가기</a>
          </div>
        </Layout>,
        404
      );
    }

    return c.html(
      <Layout title={post.title}>
        {/* 게시글 상세 — FR-006 */}
        <article class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-slate-800 mb-2">{post.title}</h1>
            <div class="flex gap-4 text-sm text-slate-400 mb-6">
              <span>📅 작성: {post.created_at}</span>
              {post.updated_at !== post.created_at && (
                <span>✏️ 수정: {post.updated_at}</span>
              )}
            </div>
            <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>

        {/* 액션 버튼 — UC-006 수정, UC-007 삭제 */}
        <div class="flex gap-3 mt-6" x-data="">
          <a href={`/board/${post.id}/edit`} class="btn-primary px-4 py-2 rounded-lg font-medium text-sm no-underline transition-colors focus-ring" aria-label="게시글 수정">
            ✏️ 수정
          </a>
          <form method="POST" action={`/board/${post.id}/delete`}
            onsubmit="return confirm('정말 삭제하시겠습니까?');">
            <button type="submit" class="btn-danger px-4 py-2 rounded-lg font-medium text-sm transition-colors focus-ring" aria-label="게시글 삭제">
              🗑️ 삭제
            </button>
          </form>
          <a href="/board" class="btn-secondary px-4 py-2 rounded-lg font-medium text-sm no-underline transition-colors focus-ring" aria-label="목록으로">
            📋 목록
          </a>
        </div>
      </Layout>
    );
  } catch (err) {
    console.error('[ERROR] Post detail:', err);
    return c.html(<Layout title="오류"><p class="text-red-600">게시글을 불러올 수 없습니다</p></Layout>, 500);
  }
});

// API-006: GET /board/:id/edit — 게시글 수정 폼 (SCR-005, UC-006)
board.get('/:id/edit', (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const post = getPostById(id);

    if (!post) {
      return c.html(
        <Layout title="게시글 없음">
          <div class="text-center py-12">
            <h1 class="text-xl font-bold text-slate-600">게시글을 찾을 수 없습니다</h1>
            <a href="/board" class="text-indigo-600 mt-4 inline-block">📋 목록으로 돌아가기</a>
          </div>
        </Layout>,
        404
      );
    }

    return c.html(
      <Layout title="게시글 수정">
        <h1 class="text-2xl font-bold text-slate-800 mb-6">✏️ 게시글 수정</h1>
        <form method="POST" action={`/board/${post.id}/edit`} class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div class="mb-4">
            <label for="title" class="block text-sm font-semibold text-slate-700 mb-1">제목</label>
            <input type="text" id="title" name="title" required maxlength={200} value={post.title}
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors focus-ring"
              aria-label="게시글 제목" />
          </div>
          <div class="mb-6">
            <label for="content" class="block text-sm font-semibold text-slate-700 mb-1">내용</label>
            <textarea id="content" name="content" required rows={10}
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y focus-ring"
              aria-label="게시글 내용">{post.content}</textarea>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary px-6 py-2 rounded-lg font-medium transition-colors focus-ring">💾 저장</button>
            <a href={`/board/${post.id}`} class="btn-secondary px-6 py-2 rounded-lg font-medium no-underline transition-colors focus-ring">취소</a>
          </div>
        </form>
      </Layout>
    );
  } catch (err) {
    console.error('[ERROR] Edit form:', err);
    return c.html(<Layout title="오류"><p class="text-red-600">오류가 발생했습니다</p></Layout>, 500);
  }
});

// API-007: POST /board/:id/edit — 게시글 수정 저장 (UC-006)
board.post('/:id/edit', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.parseBody();
    const title = (body['title'] as string || '').trim();
    const content = (body['content'] as string || '').trim();

    // 유효성 검증 — UC-006 E1
    if (!title || !content) {
      const post = getPostById(id);
      return c.html(
        <Layout title="게시글 수정">
          <h1 class="text-2xl font-bold text-slate-800 mb-6">✏️ 게시글 수정</h1>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-red-700 text-sm">{!title ? '제목을 입력해주세요' : '내용을 입력해주세요'}</p>
          </div>
          <form method="POST" action={`/board/${id}/edit`} class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div class="mb-4">
              <label for="title" class="block text-sm font-semibold text-slate-700 mb-1">제목</label>
              <input type="text" id="title" name="title" required maxlength={200} value={title || post?.title || ''}
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors focus-ring" />
            </div>
            <div class="mb-6">
              <label for="content" class="block text-sm font-semibold text-slate-700 mb-1">내용</label>
              <textarea id="content" name="content" required rows={10}
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y focus-ring">{content || post?.content || ''}</textarea>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-primary px-6 py-2 rounded-lg font-medium transition-colors focus-ring">💾 저장</button>
              <a href={`/board/${id}`} class="btn-secondary px-6 py-2 rounded-lg font-medium no-underline transition-colors focus-ring">취소</a>
            </div>
          </form>
        </Layout>,
        400
      );
    }

    // UC-006 E2: 수정 대상 미존재
    const result = updatePost(id, title, content);
    if (!result) {
      return c.html(
        <Layout title="게시글 없음">
          <div class="text-center py-12">
            <h1 class="text-xl font-bold text-slate-600">게시글을 찾을 수 없습니다</h1>
            <a href="/board" class="text-indigo-600 mt-4 inline-block">📋 목록으로 돌아가기</a>
          </div>
        </Layout>,
        404
      );
    }

    return c.redirect(`/board/${id}`);
  } catch (err) {
    console.error('[ERROR] Update post:', err);
    return c.html(<Layout title="오류"><p class="text-red-600">수정에 실패했습니다</p></Layout>, 500);
  }
});

// API-008: POST /board/:id/delete — 게시글 삭제 (UC-007)
board.post('/:id/delete', (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    // UC-007 E1: 삭제 대상 미존재
    const deleted = deletePost(id);
    if (!deleted) {
      return c.html(
        <Layout title="게시글 없음">
          <div class="text-center py-12">
            <h1 class="text-xl font-bold text-slate-600">게시글을 찾을 수 없습니다</h1>
            <a href="/board" class="text-indigo-600 mt-4 inline-block">📋 목록으로 돌아가기</a>
          </div>
        </Layout>,
        404
      );
    }

    return c.redirect('/board');
  } catch (err) {
    console.error('[ERROR] Delete post:', err);
    return c.html(<Layout title="오류"><p class="text-red-600">삭제에 실패했습니다</p></Layout>, 500);
  }
});

export default board;
