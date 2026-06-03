// src/views/board/form.js — 게시글 작성/수정 폼 뷰
const { layout, escapeHtml } = require('../layout');

/**
 * 게시글 작성/수정 폼 HTML을 렌더링한다.
 * @param {{ post?: object, error?: string, isEdit?: boolean }} params
 * @returns {string}
 */
function boardFormView({ post, error, isEdit = false }) {
  const title = isEdit ? '글 수정' : '새 글 작성';
  const action = isEdit ? `/board/${post.id}/edit` : '/board';
  const buttonLabel = isEdit ? '수정 완료' : '작성 완료';

  const content = `
    <div class="animate-fade-in-up max-w-3xl mx-auto">
      <!-- 뒤로가기 -->
      <a href="${isEdit ? '/board/' + post.id : '/board'}" class="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-300 transition-colors mb-6">
        ← ${isEdit ? '게시글로' : '목록으로'}
      </a>

      <div class="glass-card rounded-xl p-6">
        <h1 class="text-xl font-bold text-white mb-6">${isEdit ? '✏️' : '📝'} ${title}</h1>

        ${error ? `
          <div class="mb-4 px-4 py-3 rounded-lg bg-red-600/15 border border-red-600/30 text-red-300 text-sm" role="alert" id="form-error">
            ⚠️ ${escapeHtml(error)}
          </div>
        ` : ''}

        <form method="POST" action="${action}" id="post-form" x-data="{ submitting: false }" @submit="submitting = true">
          <!-- 제목 -->
          <div class="mb-5">
            <label for="title" class="block text-sm font-medium text-slate-300 mb-2">제목 <span class="text-red-400">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxlength="200"
              value="${escapeHtml(post?.title || '')}"
              placeholder="제목을 입력하세요"
              class="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <!-- 작성자 -->
          <div class="mb-5">
            <label for="author" class="block text-sm font-medium text-slate-300 mb-2">작성자</label>
            <input
              type="text"
              id="author"
              name="author"
              maxlength="50"
              value="${escapeHtml(post?.author || '')}"
              placeholder="익명"
              class="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <!-- 내용 -->
          <div class="mb-6">
            <label for="content" class="block text-sm font-medium text-slate-300 mb-2">내용</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              maxlength="10000"
              placeholder="내용을 입력하세요"
              class="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-y min-h-[160px]"
            >${escapeHtml(post?.content || '')}</textarea>
          </div>

          <!-- 버튼 -->
          <div class="flex items-center justify-end gap-3">
            <a href="${isEdit ? '/board/' + post.id : '/board'}" class="px-5 py-2.5 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors">
              취소
            </a>
            <button
              type="submit"
              id="btn-submit"
              class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
              :disabled="submitting"
            >
              <template x-if="submitting">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              </template>
              <span x-text="submitting ? '처리 중...' : '${buttonLabel}'">${buttonLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  return layout({ title, content, currentPath: '/board' });
}

module.exports = { boardFormView };
