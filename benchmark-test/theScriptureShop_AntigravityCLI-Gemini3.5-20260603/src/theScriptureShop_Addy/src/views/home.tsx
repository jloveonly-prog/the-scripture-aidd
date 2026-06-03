import { Bible } from '../db/client.js';

interface HomeProps {
  bibles: Bible[];
}

export const Home = ({ bibles }: HomeProps) => {
  return (
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20 mb-4 animate-pulse-slow">
          무료 성경 보급 사역
        </span>
        <h1 class="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
          The Scripture Shop
        </h1>
        <p class="text-lg text-slate-400 leading-relaxed">
          성경(KJV, NIV, 헬라어, 히브리어 번역본 등)을 비회원으로 안전하게 무료 주문하실 수 있습니다. 
          예수 그리스도를 구원자로 시인하고 믿음을 고백하시는 모든 분들께 무상으로 발송해 드립니다.
        </p>
      </div>

      {/* Catalog Grid */}
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {bibles.map((bible) => (
          <div key={bible.id} class="glass-panel rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1 group">
            {/* Bible Cover Graphic */}
            <div class={`h-56 bg-gradient-to-br ${bible.cover_color} flex flex-col justify-between p-6 border-b border-slate-900 relative overflow-hidden`}>
              <div class="absolute inset-0 bg-slate-950/10 mix-blend-overlay"></div>
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold tracking-widest text-white/60 uppercase border border-white/20 rounded px-2 py-0.5 backdrop-blur-sm">
                  Holy Bible
                </span>
                <span class="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">📖</span>
              </div>
              <div>
                <span class="block text-4xl font-extrabold font-display text-white/90 tracking-wide uppercase drop-shadow-md">
                  {bible.translation}
                </span>
                <span class="block text-sm font-medium text-white/70 mt-1">
                  {bible.title}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div class="p-6 flex flex-col h-60 justify-between">
              <div>
                <h3 class="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                  {bible.title} ({bible.translation})
                </h3>
                <p class="text-sm text-slate-400 leading-relaxed line-clamp-4">
                  {bible.description}
                </p>
              </div>

              {/* Add to Cart Action */}
              <button 
                hx-post={`/cart/add/${bible.id}`} 
                hx-target="#cart-count"
                class="w-full mt-4 bg-slate-900 border border-slate-800 hover:bg-cyan-500 hover:border-cyan-400 hover:text-slate-950 text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
