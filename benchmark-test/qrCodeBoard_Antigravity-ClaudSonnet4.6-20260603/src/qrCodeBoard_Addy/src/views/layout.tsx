// src/views/layout.tsx
// 공통 레이아웃 컴포넌트
// Source: https://hono.dev/docs/guides/jsx

/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';

interface LayoutProps {
  title?: string;
  children: unknown;
}

export const Layout: FC<LayoutProps> = ({ title = 'QR 게시판', children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content="QR 코드를 스캔하여 게시판에 저장하는 웹 앱" />
        {/* Tailwind CSS Play CDN (개발/데모용) — ADR-004 */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Alpine.js — 클라이언트 상태 관리 */}
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        {/* HTMX — 동적 서버 요청 */}
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>
        {/* html5-qrcode — Google ZXing 기반 QR 스캐너 */}
        <script src="https://unpkg.com/html5-qrcode"></script>
        <style>{`
          [x-cloak] { display: none !important; }
          .scanner-box { border: 3px solid #6366f1; border-radius: 12px; overflow: hidden; }
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.7; }
            100% { transform: scale(1.05); opacity: 0.3; }
          }
          .scanning-pulse { animation: pulse-ring 1.5s ease-in-out infinite alternate; }
        `}</style>
      </head>
      <body class="min-h-screen bg-gray-950 text-gray-100 font-sans">
        {/* 네비게이션 */}
        <nav class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-indigo-400 font-bold text-xl hover:text-indigo-300 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              QR 게시판
            </a>
            <div class="flex gap-4 text-sm">
              <a href="/" id="nav-home" class="px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                📷 스캐너
              </a>
              <a href="/board" id="nav-board" class="px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                📋 게시판
              </a>
            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main class="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* 푸터 */}
        <footer class="border-t border-gray-800 mt-16 py-6 text-center text-gray-600 text-sm">
          QR Code Board — Hono + SQLite + HTMX + Alpine.js
        </footer>
      </body>
    </html>
  );
};
