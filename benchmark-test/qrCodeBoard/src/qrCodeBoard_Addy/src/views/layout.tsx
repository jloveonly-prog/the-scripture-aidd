import type { FC } from 'hono/jsx'

interface LayoutProps {
  title?: string
  children?: any
}

export const Layout: FC<LayoutProps> = ({ title = 'QR 게시판', children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content="QR 코드 스캔 및 게시판 서비스" />
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* HTMX */}
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>
        {/* Alpine.js */}
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        {/* html5-qrcode */}
        <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: { DEFAULT: '#6366f1', dark: '#4f46e5' },
                      surface: '#1e1e2e',
                      card: '#2a2a3e',
                    }
                  }
                }
              }
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body { background: #0f0f1a; color: #e2e8f0; font-family: 'Segoe UI', system-ui, sans-serif; }
              .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
              .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.2s; }
              .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
              .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); transition: all 0.2s; }
              .btn-danger:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(239,68,68,0.4); }
              .nav-link { transition: color 0.2s; }
              .nav-link:hover { color: #a5b4fc; }
              .card { background: rgba(42,42,62,0.8); border: 1px solid rgba(99,102,241,0.2); transition: all 0.2s; }
              .card:hover { border-color: rgba(99,102,241,0.5); transform: translateY(-2px); }
              input, textarea { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.15) !important; color: #e2e8f0 !important; }
              input:focus, textarea:focus { outline: none !important; border-color: #6366f1 !important; box-shadow: 0 0 0 2px rgba(99,102,241,0.3) !important; }
              .htmx-indicator { display: none; }
              .htmx-request .htmx-indicator { display: inline-block; }
            `,
          }}
        />
      </head>
      <body class="min-h-screen">
        {/* 네비게이션 */}
        <nav class="glass sticky top-0 z-50 px-6 py-4">
          <div class="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-xl font-bold text-white">
              <span class="text-2xl">📱</span>
              <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                QR 게시판
              </span>
            </a>
            <div class="flex items-center gap-6">
              <a href="/" class="nav-link text-slate-300 hover:text-white text-sm">홈</a>
              <a href="/board" class="nav-link text-slate-300 hover:text-white text-sm">게시판</a>
              <a
                href="/board/new"
                class="btn-primary text-white text-sm px-4 py-2 rounded-lg font-medium"
              >
                + 글쓰기
              </a>
            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main class="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>

        {/* 푸터 */}
        <footer class="mt-16 py-8 text-center text-slate-500 text-sm border-t border-white/5">
          <p>QR 게시판 © 2026</p>
        </footer>
      </body>
    </html>
  )
}
