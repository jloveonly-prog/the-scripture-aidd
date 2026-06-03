/**
 * 게시판 작성/수정 공용 폼
 * 연결 REQ: REQ-002, FR-004, FR-005, SCR-004, SCR-005
 * 단일 책임: 작성/수정 폼 렌더링만
 */
import type { FC } from 'hono/jsx';
import type { Post } from '../../db/database.js';

interface BoardFormProps {
  mode: 'create' | 'edit';
  post?: Post;
  error?: string;
}

export const BoardForm: FC<BoardFormProps> = ({ mode, post, error }) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? '✏️ 글 수정' : '📝 새 글 작성';
  const action = isEdit ? `/board/${post?.id}/edit` : '/board';
  const cancelHref = isEdit ? `/board/${post?.id}` : '/board';

  return (
    <div>
      {/* 뒤로가기 */}
      <a href={cancelHref} class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        ← 취소
      </a>

      <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-6">{title}</h1>

        {/* 에러 메시지 — 서버 검증 실패 시 */}
        {error && (
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form method="POST" action={action}>
          {/* 제목 입력 — 방어 깊이 1층: HTML required */}
          <div class="mb-5">
            <label for="title" class="block text-sm font-medium text-slate-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={isEdit ? post?.title : ''}
              placeholder="제목을 입력하세요"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 내용 입력 — 방어 깊이 1층: HTML required */}
          <div class="mb-6">
            <label for="content" class="block text-sm font-medium text-slate-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              placeholder="내용을 입력하세요"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
            >
              {isEdit ? post?.content : ''}
            </textarea>
          </div>

          {/* 버튼 */}
          <div class="flex items-center justify-end gap-3">
            <a
              href={cancelHref}
              class="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              취소
            </a>
            <button
              type="submit"
              class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
