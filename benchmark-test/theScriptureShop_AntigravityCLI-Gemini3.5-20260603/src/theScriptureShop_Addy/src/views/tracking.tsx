import { Bible } from '../db/client.js';

interface OrderDetailItem {
  id: number;
  title: string;
  translation: string;
  quantity: number;
}

interface OrderInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  invoice_number: string | null;
  created_at: string;
  confessed: number;
}

interface TrackingProps {
  order?: OrderInfo | null;
  items?: OrderDetailItem[];
  error?: string;
  searched: boolean;
  searchQuery?: string;
}

export const Tracking = ({ order, items = [], error, searched, searchQuery = '' }: TrackingProps) => {
  return (
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <h1 class="font-display text-3xl font-extrabold text-white">비회원 배송 조회</h1>
        <p class="text-sm text-slate-400 mt-1">발급받으신 주문번호를 입력해 배송 상태와 송장번호를 조회하세요.</p>
      </div>

      {/* Search Input Box */}
      <div class="glass-panel rounded-2xl p-6 mb-8">
        <form method="get" action="/tracking" class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-grow">
            <input 
              type="text" 
              name="orderId" 
              required
              value={searchQuery}
              placeholder="주문번호 입력 (예: TS-XXXXXX)"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-semibold tracking-wider"
            />
          </div>
          <button 
            type="submit"
            class="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.636Z" />
            </svg>
            조회하기
          </button>
        </form>

        {error && (
          <p class="text-sm text-rose-450 mt-3 font-semibold">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Tracking Result */}
      {searched && order && (
        <div class="glass-panel rounded-2xl overflow-hidden divide-y divide-slate-900/60 shadow-2xl">
          {/* Status Header */}
          <div class="p-6 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900">
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">주문번호 {order.id}</span>
              <span class="block text-xs text-slate-500 mt-0.5">주문 일시: {order.created_at}</span>
            </div>
            
            <div class="flex items-center gap-3">
              {order.status === 'completed' ? (
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  발송 완료
                </span>
              ) : (
                <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/20">
                  발송 대기
                </span>
              )}
            </div>
          </div>

          {/* Invoice Info */}
          {order.status === 'completed' && order.invoice_number && (
            <div class="p-6 bg-gradient-to-r from-emerald-950/10 to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span class="block text-xs font-bold text-emerald-400 uppercase tracking-widest">배송 정보</span>
                <span class="block text-lg font-display font-black text-slate-100 mt-1 tracking-widest">{order.invoice_number}</span>
              </div>
              <span class="text-xs text-slate-400">송장번호 8자리가 정상 등록되어 택배사로 인계되었습니다.</span>
            </div>
          )}

          {/* Items & Shipping Address */}
          <div class="p-6 space-y-6">
            {/* Items */}
            <div>
              <h3 class="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">신청 도서</h3>
              <div class="space-y-3">
                {items.map((item) => (
                  <div key={item.id} class="flex justify-between items-center text-sm bg-slate-950/40 rounded-xl p-3 border border-slate-900/50">
                    <span class="text-slate-300 font-medium">{item.title} ({item.translation})</span>
                    <span class="text-slate-400 font-semibold">{item.quantity}권</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 class="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">배송 정보</h3>
              <div class="bg-slate-950/40 rounded-2xl p-4 border border-slate-900/50 space-y-2.5 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">수령인</span>
                  <span class="text-slate-250 font-semibold">{order.name}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">연락처</span>
                  <span class="text-slate-250 font-semibold">{order.phone}</span>
                </div>
                <div class="border-t border-slate-900/60 my-2 pt-2">
                  <span class="block text-slate-500 font-medium mb-1">배송 주소</span>
                  <span class="block text-slate-250 font-semibold leading-relaxed">{order.address}</span>
                </div>
              </div>
            </div>

            {/* Confession verification */}
            <div class="bg-indigo-950/10 border border-indigo-900/20 rounded-xl p-4 flex items-center gap-3">
              <span class="text-emerald-400 font-bold text-lg select-none">✓</span>
              <span class="text-xs text-indigo-300 leading-relaxed font-semibold">
                이 주문은 구원 신앙 고백("예수님은 나의 구원자이시며...")이 정상 확인 및 서약된 주문입니다.
              </span>
            </div>
          </div>
        </div>
      )}

      {searched && !order && !error && (
        <div class="glass-panel rounded-2xl p-10 text-center mt-6">
          <span class="text-4xl block mb-3">🔍</span>
          <h3 class="text-base font-bold text-slate-200">주문을 찾을 수 없습니다</h3>
          <p class="text-xs text-slate-400 mt-1">입력하신 주문번호를 다시 한번 확인해 주세요.</p>
        </div>
      )}
    </div>
  );
};
