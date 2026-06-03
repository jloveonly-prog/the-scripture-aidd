import { Child } from 'hono/jsx';

interface LayoutProps {
  title?: string;
  children: Child;
  cartCount: number;
}

export const Layout = ({ title = 'The Scripture Shop', children, cartCount }: LayoutProps) => {
  return (
    <html lang="ko" class="h-full bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-900">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — 성경 무료 배포 쇼핑몰</title>
        <meta name="description" content="예수 그리스도의 구원 사역을 믿는 모든 이들에게 성경을 무료로 배포하는 비회원 전용 온라인 성경 숍입니다." />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
        
        {/* Tailwind CSS & HTMX & Alpine.js */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>
        <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
                  display: ['Outfit', 'sans-serif'],
                },
                animation: {
                  'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }
              }
            }
          }
        `}} />
        
        <style dangerouslySetInnerHTML={{__html: `
          [x-cloak] { display: none !important; }
          .glass-panel {
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .bible-glow {
            box-shadow: 0 0 40px -10px rgba(6, 182, 212, 0.15);
          }
        `}} />
      </head>
      <body class="flex min-h-full flex-col font-sans bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" hx-boost="true">
        {/* Navigation */}
        <header class="sticky top-0 z-40 w-full glass-panel border-b border-slate-900">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
              {/* Logo */}
              <div class="flex items-center gap-3">
                <a href="/" class="flex items-center gap-2.5 group">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/10 group-hover:scale-105 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <span class="font-display text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors">
                    The Scripture Shop
                  </span>
                </a>
              </div>

              {/* Navigation Links */}
              <nav class="hidden md:flex items-center gap-8">
                <a href="/" class="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">도서 목록</a>
                <a href="/tracking" class="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-cyan-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-1.242-1.008-2.25-2.25-2.25H9m10.5-3v12h-3V6.75a2.25 2.25 0 0 0-2.25-2.25h-7.5a2.25 2.25 0 0 0-2.25 2.25v10.5h-3m15 0V18a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 3 18v-3.75" />
                  </svg>
                  배송 조회
                </a>
                <a href="/admin" class="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">관리자</a>
              </nav>

              {/* Cart Button */}
              <div class="flex items-center gap-4">
                <a href="/cart" class="relative flex h-10 px-4 items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span class="text-sm font-medium text-slate-350">장바구니</span>
                  <div 
                    id="cart-count" 
                    class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-500 px-1 text-[11px] font-bold text-slate-950 transition-all scale-100"
                  >
                    {cartCount}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer class="mt-auto border-t border-slate-900 bg-slate-950 py-12">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                </div>
                <span class="font-display font-semibold tracking-wider text-slate-400 text-sm">
                  THE SCRIPTURE SHOP
                </span>
              </div>
              <p class="text-xs text-slate-500 text-center md:text-right max-w-md">
                "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라." — 요한복음 3:16
              </p>
            </div>
            <div class="mt-8 border-t border-slate-900/50 pt-8 text-center">
              <p class="text-xs text-slate-650">
                &copy; {new Date().getFullYear()} The Scripture Shop. 모든 성경은 신앙고백을 하시는 분들께 배송비 포함 전액 무료로 발송됩니다.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};
