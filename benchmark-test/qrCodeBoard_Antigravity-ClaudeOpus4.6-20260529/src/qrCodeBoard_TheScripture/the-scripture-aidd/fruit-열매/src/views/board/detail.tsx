/**
 * 게시글 상세 화면
 * 연결 REQ: REQ-002, FR-003, SCR-003, UC-003, UC-006
 * 단일 책임: 게시글 상세 렌더링만
 */
import type { FC } from 'hono/jsx';
import type { Post } from '../../db/database.js';

interface BoardDetailProps {
  post: Post;
}

export const BoardDetail: FC<BoardDetailProps> = ({ post }) => {
  return (
    <div>
      {/* 뒤로가기 */}
      <a href="/board" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        ← 목록으로
      </a>

      {/* 게시글 카드 */}
      <article class="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-3">{post.title}</h1>
        <div class="flex items-center gap-4 text-sm text-slate-400 mb-6">
          <span>작성일: {post.created_at.slice(0, 10)}</span>
          {post.updated_at !== post.created_at && (
            <span>수정일: {post.updated_at.slice(0, 10)}</span>
          )}
        </div>
        <hr class="border-slate-100 mb-6" />
        <div class="text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[120px]">
          {post.content}
        </div>
        <hr class="border-slate-100 mt-8 mb-6" />

        {/* 액션 버튼 — FR-005, FR-006 */}
        <div class="flex items-center gap-3" x-data="{ showConfirm: false }">
          <a
            href={`/board/${post.id}/edit`}
            class="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            ✏️ 수정
          </a>
          <form method="POST" action={`/board/${post.id}/delete`} onsubmit="return confirm('정말 삭제하시겠습니까?')">
            <button
              type="submit"
              class="inline-flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              🗑️ 삭제
            </button>
          </form>
        </div>
      </article>
    </div>
  );
};
