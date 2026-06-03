// TASK-005: 공통 레이아웃
// 연결 REQ: REQ-003 (홈페이지 메인 화면)
// 단일 책임: HTML 껍데기 + 네비게이션 렌더링 만

import type { FC, PropsWithChildren } from 'hono/jsx'

interface LayoutProps {
  title?: string
}

const Layout: FC<PropsWithChildren<LayoutProps>> = ({ children, title = 'QR 코드 게시판' }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="QR 코드를 스캔하고 게시판을 이용하는 웹 서비스" />
        <title>{title}</title>
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Alpine.js CDN - REQ-001 QR 스캔 상태관리 */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
        ></script>
        {/* HTMX CDN */}
        <script src="https://unpkg.com/htmx.org@2.0.0"></script>
        <style>{`
          body { font-family: 'Inter', system-ui, sans-serif; }
        `}</style>
      </head>
      <body class="bg-gray-50 min-h-screen">
        {/* 네비게이션 */}
        <nav class="bg-white border-b border-gray-200 shadow-sm">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a
              href="/"
              class="flex items-center gap-2 text-indigo-600 font-bold text-lg hover:text-indigo-700 transition-colors"
            >
              <span class="text-2xl">📷</span>
              <span>QR 코드 게시판</span>
            </a>
            <a
              href="/board"
              class="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors px-3 py-2 rounded-md hover:bg-indigo-50"
            >
              게시판
            </a>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* 푸터 */}
        <footer class="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
          QR Code Board — The Scripture AIDD v1.0
        </footer>
      </body>
    </html>
  )
}

export default Layout
