import { Bible } from '../db/client.js';

interface CartItem {
  bible: Bible;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
}

export const Cart = ({ items }: CartProps) => {
  const isEmpty = items.length === 0;

  return (
    <div id="cart-container" class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="font-display text-3xl font-extrabold text-white">장바구니</h1>
        <p class="text-sm text-slate-400 mt-1">담으신 성경 목록과 수량을 확인해 주세요.</p>
      </div>

      {isEmpty ? (
        <div class="glass-panel rounded-2xl p-12 text-center">
          <span class="text-5xl block mb-4">🛒</span>
          <h2 class="text-xl font-bold text-slate-200">장바구니가 비어 있습니다</h2>
          <p class="text-slate-400 text-sm mt-2 mb-6">성경 도서 목록에서 원하시는 번역본을 담아주세요.</p>
          <a 
            href="/" 
            class="inline-flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 font-semibold transition-colors"
          >
            성경 보러가기
          </a>
        </div>
      ) : (
        <div class="space-y-6">
          {/* Cart List */}
          <div class="glass-panel rounded-2xl overflow-hidden divide-y divide-slate-900">
            {items.map((item) => (
              <div key={item.bible.id} class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Book Info */}
                <div class="flex items-center gap-4">
                  <div class={`h-20 w-14 flex-shrink-0 bg-gradient-to-br ${item.bible.cover_color} rounded-lg flex flex-col justify-end p-2 border border-slate-800 shadow-md`}>
                    <span class="text-white font-extrabold text-xs block tracking-tighter uppercase font-display leading-none">
                      {item.bible.translation}
                    </span>
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-slate-100">{item.bible.title}</h3>
                    <p class="text-xs text-slate-400 mt-0.5">{item.bible.translation} 번역본</p>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div class="flex items-center justify-between sm:justify-end gap-6">
                  {/* Quantity Control */}
                  <div class="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 p-1">
                    <button 
                      hx-post={`/cart/update/${item.bible.id}?action=decrease`}
                      hx-target="#cart-container"
                      hx-swap="outerHTML"
                      class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-850 hover:text-cyan-400 text-slate-400 transition-all font-bold"
                      disabled={item.quantity <= 1}
                    >
                      －
                    </button>
                    <span class="w-8 text-center text-sm font-semibold text-slate-200">
                      {item.quantity}
                    </span>
                    <button 
                      hx-post={`/cart/update/${item.bible.id}?action=increase`}
                      hx-target="#cart-container"
                      hx-swap="outerHTML"
                      class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-850 hover:text-cyan-400 text-slate-400 transition-all font-bold"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    hx-post={`/cart/remove/${item.bible.id}`}
                    hx-target="#cart-container"
                    hx-swap="outerHTML"
                    class="text-xs font-semibold text-rose-400 hover:text-rose-350 hover:underline px-2 py-1 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary & Order Action */}
          <div class="flex flex-col sm:flex-row justify-between items-center gap-6 glass-panel rounded-2xl p-6">
            <div class="text-center sm:text-left">
              <p class="text-sm text-slate-400">수량 합계</p>
              <p class="text-2xl font-black text-white mt-1">
                총 {items.reduce((acc, curr) => acc + curr.quantity, 0)}권
              </p>
            </div>
            
            <a 
              href="/checkout" 
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold px-8 py-3.5 shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
            >
              무료 배송 주문하기
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
