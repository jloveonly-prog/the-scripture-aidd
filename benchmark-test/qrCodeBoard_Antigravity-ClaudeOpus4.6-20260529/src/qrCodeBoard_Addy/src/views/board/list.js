// src/views/board/list.js — 게시글 목록 뷰
const { layout, escapeHtml } = require('../layout');

/**
 * 게시글 목록 HTML을 렌더링한다.
 * @param {{ posts: Array, pagination: { page: number, pageSize: number, totalItems: number, totalPages: number } }} data
 * @returns {string}
 */
function boardListView({ posts, pagination }) {
  const { page, totalPages, totalItems } = pagination;

  // 게시글 행 생성
  const rows = posts.length > 0
    ? posts.map((post, idx) => `
        <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group" style="animation-delay: ${idx * 50}ms">
          <td class="px-4 py-3 text-center text-slate-500 text-sm">${escapeHtml(String(post.id))}</td>
          <td class="px-4 py-3">
            <a href="/board/${post.id}" class="text-slate-100 hover:text-indigo-300 font-medium transition-colors" id="post-${post.id}">
              ${escapeHtml(post.title)}
            </a>
          </td>
          <td class="px-4 py-3 text-sm text-slate-400 hidden sm:table-cell">${escapeHtml(post.author)}</td>
          <td class="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">${formatDate(post.created_at)}</td>
        </tr>
      `).join('')
    : `
        <tr>
          <td colspan="4" class="px-4 py-16 text-center">
            <div class="text-4xl mb-3">📭</div>
            <p class="text-slate-400 mb-4">아직 게시글이 없습니다.</p>
            <a href="/board/new" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
              ✏️ 첫 글 작성하기
            </a>
          </td>
        </tr>
      `;

  // 페이지네이션
  let paginationHtml = '';
  if (totalPages > 1) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === page;
      const cls = isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white';
      pages.push(`<a href="/board?page=${i}" class="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${cls}">${i}</a>`);
    }
    paginationHtml = `
      <div class="flex items-center justify-center gap-1 mt-6" role="navigation" aria-label="페이지네이션">
        ${page > 1 ? `<a href="/board?page=${page - 1}" class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 transition-all" aria-label="이전 페이지">‹</a>` : ''}
        ${pages.join('')}
        ${page < totalPages ? `<a href="/board?page=${page + 1}" class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 transition-all" aria-label="다음 페이지">›</a>` : ''}
      </div>
    `;
  }

  const content = `
    <div class="animate-fade-in-up">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">📋 게시판</h1>
          <p class="text-sm text-slate-400 mt-1">총 ${totalItems}개의 게시글</p>
        </div>
        <a href="/board/new" id="btn-new-post" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95">
          ✏️ 새 글 작성
        </a>
      </div>

      <!-- 게시글 테이블 -->
      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full" id="post-table">
          <thead>
            <tr class="border-b border-slate-700/50 bg-slate-800/30">
              <th class="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">번호</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">제목</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell w-28">작성자</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell w-36">작성일</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      ${paginationHtml}
    </div>
  `;

  return layout({ title: '게시판', content, currentPath: '/board' });
}

/**
 * 날짜 포맷팅
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

module.exports = { boardListView };
