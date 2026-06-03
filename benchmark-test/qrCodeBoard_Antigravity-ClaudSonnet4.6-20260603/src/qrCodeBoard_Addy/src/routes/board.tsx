// src/routes/board.tsx
// 게시판 페이지 — HTMX로 삭제 동작

/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../views/layout.js';
import { getPosts } from '../db.js';
import type { Post } from '../types.js';

const board = new Hono();

// 게시물 행 렌더링 (HTMX 부분 교체용)
const PostRow = ({ post }: { post: Post }) => (
  <tr
    id={`post-row-${post.id}`}
    class="border-b border-gray-800 hover:bg-gray-900/50 transition-colors group"
  >
    <td class="px-4 py-3 text-gray-500 text-sm w-16">#{post.id}</td>
    <td class="px-4 py-3 max-w-xs">
      {post.type === 'url' ? (
        <a
          href={post.content}
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-400 hover:text-indigo-300 underline break-all text-sm"
        >
          {post.content}
        </a>
      ) : (
        <span class="text-gray-200 break-all text-sm">{post.content}</span>
      )}
    </td>
    <td class="px-4 py-3 w-24">
      <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${
        post.type === 'url'
          ? 'bg-blue-900/50 text-blue-400'
          : 'bg-gray-800 text-gray-400'
      }`}>
        {post.type === 'url' ? '🔗 URL' : '📝 텍스트'}
      </span>
    </td>
    <td class="px-4 py-3 text-gray-500 text-xs w-40">
      {new Date(post.createdAt).toLocaleString('ko-KR')}
    </td>
    <td class="px-4 py-3 w-16 text-center">
      <button
        id={`btn-delete-${post.id}`}
        hx-delete={`/api/posts/${post.id}`}
        hx-target={`#post-row-${post.id}`}
        hx-swap="outerHTML"
        hx-confirm="이 게시물을 삭제하시겠습니까?"
        class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-900/50 hover:bg-red-700 text-red-400 hover:text-red-100 rounded text-xs transition-all duration-200"
      >
        삭제
      </button>
    </td>
  </tr>
);

board.get('/board', (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1);
  const pageSize = 20;
  const { data: posts, totalItems } = getPosts(page, pageSize);
  const totalPages = Math.ceil(totalItems / pageSize);

  return c.html(
    <Layout title="게시판 — QR 게시판">
      <div class="space-y-6">
        {/* 헤더 */}
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">📋 게시판</h1>
            <p class="text-gray-400 mt-1">QR 스캔 이력 (총 {totalItems}개)</p>
          </div>
          <a
            href="/"
            id="btn-go-scanner"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
          >
            📷 스캐너로 이동
          </a>
        </div>

        {/* 게시물 테이블 */}
        {posts.length === 0 ? (
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div class="text-5xl mb-4">📭</div>
            <p class="text-gray-400">아직 스캔된 QR 코드가 없습니다</p>
            <a href="/" class="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm">
              스캐너로 이동
            </a>
          </div>
        ) : (
          <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full" id="posts-table">
                <thead>
                  <tr class="border-b border-gray-800 bg-gray-800/50">
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">내용</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">유형</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">시각</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <PostRow key={post.id} post={post} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div class="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-sm">
                <span class="text-gray-500">{page} / {totalPages} 페이지</span>
                <div class="flex gap-2">
                  {page > 1 && (
                    <a href={`/board?page=${page - 1}`} class="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">이전</a>
                  )}
                  {page < totalPages && (
                    <a href={`/board?page=${page + 1}`} class="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">다음</a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HTMX 삭제 응답 처리: 성공 시 빈 행 제거 */}
      <script>{`
        document.addEventListener('htmx:afterSwap', function(e) {
          // 삭제 후 빈 응답(204)이면 행 제거
        });
        // HTMX DELETE 후 빈 셀 처리
        document.body.addEventListener('htmx:responseError', function(e) {
          alert('삭제 중 오류가 발생했습니다.');
        });
      `}</script>
    </Layout>
  );
});

export default board;
