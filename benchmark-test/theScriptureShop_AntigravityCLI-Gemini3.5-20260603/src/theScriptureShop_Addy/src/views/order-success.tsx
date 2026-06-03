interface OrderSuccessProps {
  orderId: string;
}

export const OrderSuccess = ({ orderId }: OrderSuccessProps) => {
  return (
    <div class="mx-auto max-w-xl px-4 py-20 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-6 border border-cyan-500/25">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>

      <h1 class="font-display text-3xl font-extrabold text-slate-100 mb-3">
        주문이 완료되었습니다
      </h1>
      <p class="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
        진실된 믿음 고백과 함께 주문이 성공적으로 접수되었습니다. 성경은 기쁜 마음으로 신속히 발송해 드리겠습니다.
      </p>

      {/* Order Number Box */}
      <div class="glass-panel rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 pointer-events-none"></div>
        <span class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">고유 주문번호</span>
        <span class="block font-display text-3xl font-black text-cyan-400 tracking-wider">
          {orderId}
        </span>
      </div>

      <p class="text-xs text-slate-500 mb-8">
        주문번호를 분실하지 않도록 메모해 주세요. 상단 <strong>[배송 조회]</strong> 메뉴에서 발송 상황과 송장번호를 조회하실 수 있습니다.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href={`/tracking?orderId=${orderId}`}
          class="inline-flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 font-semibold transition-colors"
        >
          실시간 배송 조회
        </a>
        <a 
          href="/"
          class="inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 px-6 py-3 font-semibold transition-colors"
        >
          도서 목록으로
        </a>
      </div>
    </div>
  );
};
