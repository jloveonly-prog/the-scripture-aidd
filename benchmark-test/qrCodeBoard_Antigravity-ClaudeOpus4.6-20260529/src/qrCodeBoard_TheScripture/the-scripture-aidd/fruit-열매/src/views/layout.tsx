/**
 * 공통 HTML 레이아웃
 * 연결 REQ: FR-001 (홈페이지 표시 기반)
 * 단일 책임: 공통 HTML 구조 (head, nav, footer)
 */
import type { FC, PropsWithChildren } from 'hono/jsx';

interface LayoutProps {
  title?: string;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({ title, children }) => {
  const pageTitle = title ? `${title} — QR Code Board` : 'QR Code Board';
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="QR 코드를 스캔하여 접속하는 게시판 홈페이지" />
        <title>{pageTitle}</title>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script defer src="https://unpkg.com/alpinejs@3.14.8/dist/cdn.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.17/lib/index.min.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Inter', sans-serif; }
        `}</style>
      </head>
      <body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        {/* Header — 공통 네비게이션 */}
        <header class="bg-white border-b border-slate-200 shadow-sm">
          <nav class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              📋 QR Code Board
            </a>
            <a href="/board" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50">
              게시판
            </a>
          </nav>
        </header>

        {/* Main — 페이지별 콘텐츠 */}
        <main class="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer class="bg-white border-t border-slate-200 mt-auto">
          <div class="max-w-3xl mx-auto px-4 py-4 text-center text-xs text-slate-400">
            © 2026 QR Code Board. The Scripture AIDD.
          </div>
        </footer>
      </body>
    </html>
  );
};
