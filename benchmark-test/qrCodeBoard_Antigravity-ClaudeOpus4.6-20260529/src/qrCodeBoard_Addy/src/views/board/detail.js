// src/views/board/detail.js — 게시글 상세 뷰
const { layout, escapeHtml } = require('../layout');

/**
 * 게시글 상세 HTML을 렌더링한다.
 * @param {{ post: object }} params
 * @returns {string}
 */
function boardDetailView({ post }) {
  // 줄바꿈을 <br>로 변환 (이스케이프 후)
  const contentHtml = escapeHtml(post.content)
    .replace(/\n/g, '<br>');

  const content = `
    <div class="animate-fade-in-up max-w-3xl mx-auto">
      <!-- 뒤로가기 -->
      <a href="/board" class="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-300 transition-colors mb-6" id="back-to-list">
        ← 목록으로
      </a>

      <!-- 게시글 카드 -->
      <article class="glass-card rounded-xl overflow-hidden">
        <!-- 헤더 -->
        <div class="px-6 py-5 border-b border-slate-700/50">
          <h1 class="text-xl font-bold text-white mb-3" id="post-title">${escapeHtml(post.title)}</h1>
          <div class="flex items-center gap-4 text-sm text-slate-400">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              ${escapeHtml(post.author)}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              ${escapeHtml(post.created_at)}
            </span>
            ${post.created_at !== post.updated_at ? `
              <span class="flex items-center gap-1 text-slate-500">
                (수정됨: ${escapeHtml(post.updated_at)})
              </span>
            ` : ''}
          </div>
        </div>

        <!-- 본문 -->
        <div class="px-6 py-6 leading-relaxed text-slate-300 min-h-[120px]" id="post-content">
          ${contentHtml || '<span class="text-slate-500 italic">내용이 없습니다.</span>'}
        </div>

        <!-- 하단 버튼 -->
        <div class="px-6 py-4 border-t border-slate-700/50 flex items-center justify-end gap-3">
          <a href="/board/${post.id}/edit" id="btn-edit" class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 rounded-lg text-sm font-medium transition-colors">
            ✏️ 수정
          </a>
          <form method="POST" action="/board/${post.id}/delete" onsubmit="return confirm('정말 삭제하시겠습니까?')" x-data>
            <button type="submit" id="btn-delete" class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-200 rounded-lg text-sm font-medium transition-colors border border-red-600/30">
              🗑️ 삭제
            </button>
          </form>
        </div>
      </article>
    </div>
  `;

  return layout({ title: post.title, content, currentPath: '/board' });
}

/**
 * 404 페이지
 * @returns {string}
 */
function notFoundView() {
  const content = `
    <div class="animate-fade-in-up text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <h1 class="text-2xl font-bold text-white mb-2">게시글을 찾을 수 없습니다</h1>
      <p class="text-slate-400 mb-6">삭제되었거나 존재하지 않는 게시글입니다.</p>
      <a href="/board" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all">
        ← 목록으로 돌아가기
      </a>
    </div>
  `;

  return layout({ title: '게시글 없음', content, currentPath: '/board' });
}

module.exports = { boardDetailView, notFoundView };
