// src/views/layout.js — 공통 HTML 레이아웃 생성기
// HTMX: https://htmx.org/docs/
// Alpine.js: https://alpinejs.dev/
// Tailwind CSS: https://tailwindcss.com/docs/installation/play-cdn

/**
 * 전체 HTML 레이아웃을 반환한다.
 * @param {{ title: string, content: string, currentPath?: string }} options
 * @returns {string}
 */
function layout({ title, content, currentPath = '/' }) {
  const navItems = [
    { href: '/', label: '🏠 홈' },
    { href: '/board', label: '📋 게시판' },
  ];

  const navHtml = navItems.map(item => {
    const isActive = currentPath === item.href ||
      (item.href !== '/' && currentPath.startsWith(item.href));
    const activeClass = isActive
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white';
    return `<a href="${item.href}" class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeClass}">${item.label}</a>`;
  }).join('\n            ');

  return `<!DOCTYPE html>
<html lang="ko" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="QR 코드로 접속하는 게시판 서비스" />
  <title>${escapeHtml(title)} — QR 게시판</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
              950: '#1e1b4b',
            }
          }
        }
      }
    }
  </script>

  <!-- HTMX -->
  <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>

  <!-- Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    body {
      font-family: 'Inter', 'Pretendard', system-ui, sans-serif;
    }

    /* HTMX 로딩 인디케이터 */
    .htmx-indicator {
      opacity: 0;
      transition: opacity 300ms ease-in;
    }
    .htmx-request .htmx-indicator,
    .htmx-request.htmx-indicator {
      opacity: 1;
    }

    /* 스크롤바 스타일 */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #64748b; }

    /* 글래스모피즘 카드 */
    .glass-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.15);
    }

    /* 미세 애니메이션 */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.15); }
      50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.3); }
    }
    .animate-pulse-glow {
      animation: pulse-glow 3s ease-in-out infinite;
    }

    /* 그라디언트 텍스트 */
    .gradient-text {
      background: linear-gradient(135deg, #818cf8, #6366f1, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* 호버 카드 효과 */
    .hover-lift {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
    }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">

  <!-- 상단 네비게이션 -->
  <nav class="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="flex items-center gap-2 group">
          <span class="text-2xl">📱</span>
          <span class="text-lg font-bold gradient-text group-hover:opacity-80 transition-opacity">QR 게시판</span>
        </a>
        <div class="flex items-center gap-2">
            ${navHtml}
        </div>
      </div>
    </div>
  </nav>

  <!-- 메인 콘텐츠 -->
  <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    ${content}
  </main>

  <!-- 푸터 -->
  <footer class="border-t border-slate-800/50 mt-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-slate-500">
      <p>QR 게시판 &copy; 2026 — Powered by Hono + HTMX + Alpine.js</p>
    </div>
  </footer>

</body>
</html>`;
}

/**
 * HTML 이스케이프 (XSS 방지)
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { layout, escapeHtml };
