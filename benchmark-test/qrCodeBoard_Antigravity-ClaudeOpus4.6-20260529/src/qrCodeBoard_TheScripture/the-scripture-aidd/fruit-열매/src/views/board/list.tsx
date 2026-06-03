/**
 * 게시판 목록 화면
 * 연결 REQ: REQ-002, FR-002, SCR-002
 * 단일 책임: 게시판 목록 렌더링만
 */
import type { FC } from 'hono/jsx';
import type { Post } from '../../db/database.js';

interface BoardListProps {
  posts: Post[];
}

export const BoardList: FC<BoardListProps> = ({ posts }) => {
  return (
    <div>
      {/* 페이지 타이틀 + 글쓰기 버튼 */}
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-800">📋 게시판</h1>
        <a
          href="/board/new"
          class="inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          ✏️ 글쓰기
        </a>
      </div>

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <div class="bg-white rounded-xl shadow-sm p-12 text-center">
          <div class="text-4xl mb-4">📝</div>
          <p class="text-slate-400 mb-4">등록된 게시글이 없습니다.</p>
          <a href="/board/new" class="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            첫 글을 작성해보세요 →
          </a>
        </div>
      ) : (
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-16">#</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">제목</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase w-32">작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" key={post.id}>
                  <td class="px-4 py-3 text-sm text-slate-400">{post.id}</td>
                  <td class="px-4 py-3">
                    <a href={`/board/${post.id}`} class="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                      {post.title}
                    </a>
                  </td>
                  <td class="px-4 py-3 text-right text-sm text-slate-400">
                    {post.created_at.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
