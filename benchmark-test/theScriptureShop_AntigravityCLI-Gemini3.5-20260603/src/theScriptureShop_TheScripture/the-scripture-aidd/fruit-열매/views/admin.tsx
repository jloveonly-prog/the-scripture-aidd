interface AdminLoginProps {
  error?: string;
}

export function AdminLogin({ error }: AdminLoginProps) {
  return (
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="bg-glassCharcoal border border-cathedralGold/20 p-8 rounded-lg max-w-sm w-full shadow-2xl">
        <div class="text-center mb-6">
          <span class="font-outfit text-xl font-bold tracking-wider text-cathedralGold uppercase block mb-1">
            어드민 관리 도구
          </span>
          <span class="text-xs text-slateGrey font-light">
            관리자 계정정보로 로그인해 주세요.
          </span>
        </div>

        {error && (
          <div class="mb-4 p-3 bg-repentRed/20 border border-repentRed text-repentRed text-xs rounded">
            {error}
          </div>
        )}

        <form action="/admin/login" method="POST" class="space-y-4">
          <div>
            <label class="block text-slateGrey text-xs font-semibold uppercase tracking-wider mb-2">
              아이디
            </label>
            <input
              type="text"
              name="username"
              required
              class="w-full bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-3 py-2 text-sm text-holyWhite outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-slateGrey text-xs font-semibold uppercase tracking-wider mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              required
              class="w-full bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-3 py-2 text-sm text-holyWhite outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-cathedralGold text-deepSlate font-bold py-2 rounded hover:bg-mutedGold active:scale-95 transition-all text-sm"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  orders: any[];
  filter: 'PENDING' | 'SHIPPED';
}

export function AdminDashboard({ orders, filter }: AdminDashboardProps) {
  return (
    <div class="flex-1 flex flex-col h-full md:flex-row">
      {/* Sidebar */}
      <aside class="w-full md:w-64 bg-glassCharcoal border-b md:border-b-0 md:border-r border-cathedralGold/10 p-6 flex flex-col justify-between">
        <div>
          <div class="mb-8">
            <span class="font-outfit text-xl font-bold tracking-tight text-cathedralGold block">
              ADMIN MODE
            </span>
            <span class="text-[10px] text-slateGrey font-semibold uppercase tracking-wider">
              The Scripture Shop
            </span>
          </div>
          <nav class="space-y-2">
            <a
              href="/admin?filter=PENDING"
              class={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-cathedralGold text-deepSlate font-bold'
                  : 'text-slateGrey hover:text-holyWhite hover:bg-deepSlate/50'
              }`}
            >
              발송 대기 주문
            </a>
            <a
              href="/admin?filter=SHIPPED"
              class={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'SHIPPED'
                  ? 'bg-cathedralGold text-deepSlate font-bold'
                  : 'text-slateGrey hover:text-holyWhite hover:bg-deepSlate/50'
              }`}
            >
              발송 완료 주문
            </a>
          </nav>
        </div>
        <div class="mt-8 pt-4 border-t border-cathedralGold/10">
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              class="w-full bg-glassCharcoal border border-repentRed/30 hover:border-repentRed text-repentRed text-xs font-semibold py-2 rounded transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* Main Panel */}
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <h2 class="font-outfit text-2xl font-bold text-holyWhite mb-6">
          주문 관리 — {filter === 'PENDING' ? '발송 대기' : '발송 완료'} ({orders.length}건)
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order List */}
          <div class="lg:col-span-7 bg-glassCharcoal border border-cathedralGold/10 rounded-lg overflow-hidden h-fit">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-cathedralGold/10 bg-deepSlate/30 text-xs text-slateGrey font-semibold uppercase tracking-wider">
                    <th class="p-4">주문번호</th>
                    <th class="p-4">수령인</th>
                    <th class="p-4">주문일시</th>
                    <th class="p-4 text-right">상세</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-cathedralGold/5 text-sm text-holyWhite">
                  {orders.length === 0 ? (
                    <tr>
                      <td colspan="4" class="p-8 text-center text-slateGrey font-light">
                        해당 주문 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} class="hover:bg-deepSlate/20 transition-colors">
                        <td class="p-4 font-outfit text-cathedralGold font-medium tracking-wide">
                          {order.order_number}
                        </td>
                        <td class="p-4">{order.customer_name}</td>
                        <td class="p-4 text-xs text-slateGrey">
                          {new Date(order.created_at).toLocaleString('ko-KR')}
                        </td>
                        <td class="p-4 text-right">
                          <button
                            hx-get={`/admin/orders/${order.id}`}
                            hx-target="#detail-panel"
                            class="text-xs bg-glassCharcoal hover:bg-cathedralGold/10 border border-cathedralGold/20 text-cathedralGold px-2.5 py-1 rounded transition-colors"
                          >
                            보기
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Panel */}
          <div id="detail-panel" class="lg:col-span-5 bg-glassCharcoal border border-cathedralGold/20 p-6 rounded-lg min-h-[300px] flex items-center justify-center text-slateGrey font-light">
            주문 목록에서 [보기] 버튼을 누르면 상세 정보가 노출됩니다.
          </div>
        </div>
      </main>
    </div>
  );
}

interface OrderDetailPanelProps {
  order: any;
}

export function OrderDetailPanel({ order }: OrderDetailPanelProps) {
  return (
    <div class="w-full space-y-6 text-sm">
      <div class="border-b border-cathedralGold/10 pb-3 flex justify-between items-center">
        <h3 class="font-outfit text-lg font-bold text-cathedralGold">주문 상세 조회</h3>
        <span class={`text-xs px-2.5 py-0.5 rounded font-bold ${order.status === 'SHIPPED' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
          {order.status === 'SHIPPED' ? '발송 완료' : '발송 대기'}
        </span>
      </div>

      {/* General Info */}
      <div class="space-y-2 font-light">
        <div class="flex justify-between">
          <span class="text-slateGrey">주문번호</span>
          <span class="font-outfit text-holyWhite">{order.order_number}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slateGrey">수령인</span>
          <span class="text-holyWhite font-medium">{order.customer_name}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slateGrey">연락처</span>
          <span class="text-holyWhite">{order.contact}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slateGrey">배송 주소</span>
          <span class="text-holyWhite text-right max-w-[220px]">{order.address}</span>
        </div>
        {order.status === 'SHIPPED' && (
          <div class="flex justify-between">
            <span class="text-slateGrey">송장번호 (8자리)</span>
            <span class="font-outfit text-cathedralGold font-bold">{order.tracking_number}</span>
          </div>
        )}
      </div>

      {/* Confession Verification (REQ-005) */}
      <div class="bg-deepSlate/50 border border-cathedralGold/10 p-4 rounded-md">
        <div class="flex items-center space-x-2 text-xs font-semibold text-cathedralGold mb-2 uppercase tracking-wide">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>신앙 고백 동의 완료</span>
        </div>
        <p class="text-xs text-holyWhite leading-relaxed italic mb-3">
          "예수님을 나의 구원자로 믿고, 내가 죄인인 것과 하나님이신 예수님이 내 죄들을 대신해 피 흘려 죽고 장사되시고 부활한 것을 믿고 받아들입니다."
        </p>
        <div class="text-[10px] text-slateGrey text-right">
          동의 일시: {new Date(order.believed_at).toLocaleString('ko-KR')}
        </div>
      </div>

      {/* Ordered Items */}
      <div class="border-t border-cathedralGold/10 pt-4">
        <span class="block text-xs text-slateGrey font-semibold uppercase tracking-wider mb-2">주문 품목</span>
        <div class="space-y-1.5">
          {order.items.map((item: any) => (
            <div key={item.id} class="flex justify-between text-xs text-holyWhite">
              <span>{item.translation_name}</span>
              <span class="font-semibold">{item.quantity}권</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipment Action (PENDING status only) */}
      {order.status === 'PENDING' && (
        <div class="border-t border-cathedralGold/10 pt-4 space-y-3">
          <span class="block text-xs text-slateGrey font-semibold uppercase tracking-wider">배송 발송 처리</span>
          <div id="ship-error" class="hidden text-xs text-repentRed"></div>
          <form
            hx-post={`/admin/orders/${order.id}/ship`}
            hx-target="#detail-panel"
            class="flex items-center space-x-2"
          >
            <input
              type="text"
              name="trackingNumber"
              required
              maxlength="8"
              placeholder="송장번호 8자리 숫자"
              class="flex-1 bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-3 py-2 text-xs text-holyWhite outline-none transition-colors"
            />
            <button
              type="submit"
              class="bg-cathedralGold text-deepSlate font-bold px-4 py-2 rounded hover:bg-mutedGold transition-all text-xs"
            >
              발송처리
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
