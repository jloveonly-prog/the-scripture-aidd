// src/views/home.js — 홈페이지 뷰
const { layout, escapeHtml } = require('./layout');

/**
 * 홈페이지 HTML을 렌더링한다.
 * @param {{ qrCodeSvg: string, serverUrl: string }} params
 * @returns {string}
 */
function homeView({ qrCodeSvg, serverUrl }) {
  const content = `
    <div class="animate-fade-in-up">
      <!-- 히어로 영역 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">
          <span class="gradient-text">QR 코드 게시판</span>
        </h1>
        <p class="text-lg text-slate-400 max-w-xl mx-auto">
          아래 QR 코드를 스캔하여 게시판에 접속하세요.
          모바일에서도 빠르고 편리하게 사용할 수 있습니다.
        </p>
      </div>

      <!-- QR 코드 카드 -->
      <div class="flex justify-center mb-10">
        <div class="glass-card rounded-2xl p-8 animate-pulse-glow max-w-sm w-full">
          <div class="bg-white rounded-xl p-6 flex items-center justify-center">
            ${qrCodeSvg}
          </div>
          <div class="mt-4 text-center">
            <p class="text-sm text-slate-400 mb-1">접속 주소</p>
            <p class="text-indigo-300 font-mono text-sm break-all">${escapeHtml(serverUrl)}</p>
          </div>
        </div>
      </div>

      <!-- 바로가기 카드들 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <a href="/board" class="glass-card hover-lift rounded-xl p-6 block group" id="go-board">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">📋</span>
            <h2 class="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">게시판 바로가기</h2>
          </div>
          <p class="text-sm text-slate-400">글을 작성하고, 읽고, 소통하세요.</p>
        </a>
        <a href="/board/new" class="glass-card hover-lift rounded-xl p-6 block group" id="go-write">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">✏️</span>
            <h2 class="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">새 글 작성</h2>
          </div>
          <p class="text-sm text-slate-400">지금 바로 글을 작성해보세요.</p>
        </a>
      </div>
    </div>
  `;

  return layout({ title: '홈', content, currentPath: '/' });
}

module.exports = { homeView };
