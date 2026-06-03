interface AdminOrderItem {
  title: string;
  translation: string;
  quantity: number;
}

interface AdminOrder {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  invoice_number: string | null;
  created_at: string;
  confessed: number;
  items: AdminOrderItem[];
}

interface AdminProps {
  orders: AdminOrder[];
  activeTab: 'pending' | 'completed';
}

// Order Card Component for dynamic HTMX updates or direct render
export const OrderCard = ({ order }: { order: AdminOrder }) => {
  return (
    <div class="order-card glass-panel rounded-2xl p-6 space-y-4 hover:border-slate-800 transition-all shadow-lg">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-3">
        <div>
          <span class="text-xs font-semibold text-slate-500">주문번호</span>
          <span class="block text-sm font-bold text-cyan-400 tracking-wider font-display">{order.id}</span>
        </div>
        <div class="text-right sm:text-right text-xs text-slate-500">
          <span>주문 일시: {order.created_at}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span class="block text-slate-500 font-semibold mb-1">수령인 / 연락처</span>
          <span class="block text-slate-200 font-bold">{order.name} ({order.phone})</span>
        </div>
        <div>
          <span class="block text-slate-500 font-semibold mb-1">배송 주소</span>
          <span class="block text-slate-200 leading-relaxed font-bold">{order.address}</span>
        </div>
      </div>

      {/* Ordered Items */}
      <div class="border-t border-slate-900/60 pt-3">
        <span class="block text-xs font-semibold text-slate-500 mb-2">주문 도서</span>
        <div class="space-y-1.5">
          {order.items.map((item, index) => (
            <div key={index} class="flex justify-between items-center text-xs bg-slate-950/40 rounded-lg p-2 border border-slate-900/40">
              <span class="text-slate-300">{item.title} ({item.translation})</span>
              <span class="text-slate-400 font-bold">{item.quantity}권</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confession Approval Status */}
      <div class="border-t border-slate-900/60 pt-3 flex items-center justify-between">
        <span class="text-xs font-semibold text-slate-500">신앙 고백 여부</span>
        {order.confessed === 1 ? (
          <span class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/10">
            † 시인 및 서약 완료
          </span>
        ) : (
          <span class="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-450 border border-rose-500/10">
            미고백 (비정상 주문)
          </span>
        )}
      </div>

      {/* Ship Process Form or Tracking display */}
      <div class="border-t border-slate-900/60 pt-4">
        {order.status === 'completed' ? (
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-emerald-950/10 border border-emerald-950/30 rounded-xl p-3">
            <span class="text-xs font-bold text-emerald-400">발송 처리 완료</span>
            <span class="text-sm font-display font-black text-slate-200 tracking-wider">송장번호: {order.invoice_number}</span>
          </div>
        ) : (
          <form 
            hx-post={`/admin/ship/${order.id}`} 
            hx-target="closest .order-card" 
            hx-swap="outerHTML" 
            class="flex flex-col sm:flex-row gap-2"
          >
            <div class="relative flex-grow">
              <input 
                type="text" 
                name="invoice" 
                required
                maxLength={8}
                pattern="[0-9]{8}"
                placeholder="송장번호 8자리 입력"
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans"
              />
            </div>
            <button 
              type="submit"
              class="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors whitespace-nowrap"
            >
              발송 처리
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const Admin = ({ orders, activeTab }: AdminProps) => {
  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-white">관리자 대시보드</h1>
          <p class="text-sm text-slate-400 mt-1">사용자의 무료 성경 주문 목록을 확인하고 발송 처리를 완료하세요.</p>
        </div>
        <a 
          href="/admin/logout" 
          class="text-xs font-semibold text-slate-500 hover:text-slate-350 hover:underline bg-slate-900 border border-slate-850 px-3.5 py-2 rounded-xl transition-colors"
        >
          로그아웃
        </a>
      </div>

      {/* Tabs */}
      <div class="border-b border-slate-900 mb-8 flex gap-4">
        <a 
          href="/admin?tab=pending" 
          class={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${
            activeTab === 'pending' 
              ? 'border-cyan-500 text-cyan-400' 
              : 'border-transparent text-slate-500 hover:text-slate-400'
          }`}
        >
          발송 대기 ({orders.filter(o => o.status === 'pending').length})
        </a>
        <a 
          href="/admin?tab=completed" 
          class={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${
            activeTab === 'completed' 
              ? 'border-cyan-500 text-cyan-400' 
              : 'border-transparent text-slate-500 hover:text-slate-400'
          }`}
        >
          발송 완료 ({orders.filter(o => o.status === 'completed').length})
        </a>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div class="glass-panel rounded-2xl p-12 text-center">
          <span class="text-4xl block mb-3">📦</span>
          <h3 class="text-base font-bold text-slate-200">주문 내역이 없습니다</h3>
          <p class="text-xs text-slate-500 mt-1">선택하신 상태의 주문이 존재하지 않습니다.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
