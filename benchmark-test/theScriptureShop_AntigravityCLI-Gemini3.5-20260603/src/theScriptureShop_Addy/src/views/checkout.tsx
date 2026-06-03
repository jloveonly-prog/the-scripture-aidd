import { Bible } from '../db/client.js';

interface CartItem {
  bible: Bible;
  quantity: number;
}

interface CheckoutProps {
  items: CartItem[];
  error?: string;
}

export const Checkout = ({ items, error }: CheckoutProps) => {
  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-10 text-center sm:text-left">
        <h1 class="font-display text-3xl font-extrabold text-white">주문 및 신앙 고백</h1>
        <p class="text-sm text-slate-400 mt-1">배송 정보를 입력하고 구원 신앙을 고백하여 주문을 완료해 주세요.</p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Order Details (Right column on desktop, but let's place it top/left) */}
        <div class="lg:col-span-4 lg:order-last space-y-6">
          <div class="glass-panel rounded-2xl p-6">
            <h2 class="text-base font-bold text-slate-100 mb-4 border-b border-slate-900 pb-2">주문 도서 요약</h2>
            <div class="space-y-4 max-h-[250px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.bible.id} class="flex items-center justify-between text-sm">
                  <span class="text-slate-350 truncate max-w-[150px]">{item.bible.title}</span>
                  <span class="text-slate-400 font-medium">x{item.quantity}권</span>
                </div>
              ))}
            </div>
            <div class="border-t border-slate-900 mt-4 pt-4 flex justify-between items-center text-sm font-bold">
              <span class="text-slate-300">총 수량</span>
              <span class="text-cyan-400 text-base">{totalCount}권</span>
            </div>
          </div>
        </div>

        {/* Address Form & Confession (Left column) */}
        <div class="lg:col-span-8 space-y-6">
          {error && (
            <div class="bg-rose-950/50 border border-rose-800/40 rounded-xl p-4 text-sm text-rose-350">
              ⚠️ {error}
            </div>
          )}

          <form 
            hx-post="/checkout" 
            hx-push-url="true"
            class="space-y-6 glass-panel rounded-2xl p-8"
            x-data="{ agreed: false }"
          >
            {/* Shipping Info Section */}
            <div class="space-y-4">
              <h2 class="text-base font-bold text-slate-100 border-b border-slate-900 pb-2 mb-4">배송지 정보 입력</h2>
              
              <div>
                <label for="name" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">성함</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  placeholder="홍길동"
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label for="phone" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">연락처</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required
                    placeholder="010-1234-5678"
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="address" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">배송 주소</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  required
                  placeholder="서울특별시 강남구 테헤란로 123, 405호"
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Faith Confession Section */}
            <div class="bg-indigo-950/10 border border-indigo-900/30 rounded-2xl p-6 mt-8 space-y-4">
              <h2 class="text-sm font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <span class="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/10 text-xs font-bold text-indigo-400">
                  †
                </span>
                구원 신앙 고백 (필수)
              </h2>
              
              <div class="text-slate-300 text-sm leading-relaxed bg-slate-950/60 rounded-xl p-4 border border-slate-900/80 italic font-medium">
                "예수님을 나의 구원자로 믿고, 내가 죄인인 것과 하나님이신 예수님이 내 죄들을 대신해 피 흘려 죽고 장사되시고 부활한 것을 믿고 받아들입니다."
              </div>

              <label class="relative flex items-start gap-3 cursor-pointer group select-none mt-4">
                <input 
                  type="checkbox" 
                  name="confession" 
                  required
                  x-model="agreed"
                  class="peer sr-only"
                />
                <div class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-slate-800 bg-slate-900 peer-checked:bg-cyan-500 peer-checked:border-cyan-400 text-slate-950 transition-all mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 transition-opacity">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span class="text-sm text-slate-350 group-hover:text-slate-200 transition-colors">
                  위의 복음과 고백을 진심으로 믿고 영접합니다.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button 
              type="submit"
              x-bind:disabled="!agreed"
              x-bind:class="agreed ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 cursor-pointer shadow-lg shadow-cyan-500/10' : 'bg-slate-800/80 border border-slate-900 text-slate-500 cursor-not-allowed'"
              class="w-full font-extrabold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base mt-8"
            >
              <span>믿는다</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
