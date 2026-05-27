// 공통 레이아웃 컴포넌트 — screen-vision-화면설계.md 기반
// 모든 화면의 공통 Header/Footer/구조 (SCR-001~005)
import type { FC, PropsWithChildren } from 'hono/jsx';

interface LayoutProps {
  title: string;
}

// REQ-002: 홈페이지 네비게이션 포함 레이아웃
export const Layout: FC<PropsWithChildren<LayoutProps>> = ({ title, children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — QR Code Board</title>
        <meta name="description" content="QR 코드를 스캔하고 게시판을 이용하세요" />
        {/* Tailwind CSS CDN — C-001 기술 스택 */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* HTMX — C-001 기술 스택 */}
        <script src="https://unpkg.com/htmx.org@2.0.0"></script>
        {/* Alpine.js — C-001 기술 스택 */}
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        {/* Pretendard 폰트 — 디자인 명세 */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <style>{`
          * { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; }
          body { background-color: #f8fafc; color: #1e293b; }
          .btn-primary { background-color: #3730a3; color: white; }
          .btn-primary:hover { background-color: #4338ca; }
          .btn-secondary { background-color: #e2e8f0; color: #1e293b; }
          .btn-secondary:hover { background-color: #cbd5e1; }
          .btn-danger { background-color: #dc2626; color: white; }
          .btn-danger:hover { background-color: #b91c1c; }
          a { color: #3730a3; }
          a:hover { color: #4338ca; text-decoration: underline; }
          .focus-ring:focus { outline: 2px solid #6366f1; outline-offset: 2px; }
        `}</style>
      </head>
      <body class="min-h-screen flex flex-col">
        {/* Header — 공통 네비게이션 */}
        <header class="bg-white border-b border-slate-200 shadow-sm">
          <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold text-indigo-800 no-underline hover:no-underline" aria-label="홈으로 이동">
              📱 QR Code Board
            </a>
            <nav class="flex gap-4" aria-label="메인 네비게이션">
              <a href="/" class="text-sm font-medium text-slate-600 hover:text-indigo-700 no-underline focus-ring rounded px-2 py-1" tabindex={0}>홈</a>
              <a href="/board" class="text-sm font-medium text-slate-600 hover:text-indigo-700 no-underline focus-ring rounded px-2 py-1" tabindex={0}>게시판</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main class="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer class="bg-white border-t border-slate-200 mt-auto">
          <div class="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-slate-500">
            © 2026 QR Code Board — The Scripture
          </div>
        </footer>
      </body>
    </html>
  );
};
