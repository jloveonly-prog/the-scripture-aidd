import { Bible } from '../services/shop.service.js';

interface NavbarProps {
  cartCount: number;
}

export function Navbar({ cartCount }: NavbarProps) {
  return (
    <nav class="sticky top-0 z-40 bg-deepSlate/90 backdrop-blur-md border-b border-cathedralGold/10 px-4 py-4 md:px-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="flex items-center space-x-2">
          <span class="font-outfit text-2xl font-bold tracking-tight text-cathedralGold">
            THE SCRIPTURE SHOP
          </span>
        </a>
        <div class="flex items-center space-x-4">
          <button
            hx-get="/track-modal"
            hx-target="#modal-container"
            class="text-sm font-medium text-slateGrey hover:text-cathedralGold transition-colors"
          >
            배송 조회
          </button>
          <a
            href="/cart"
            class="relative flex items-center space-x-1 bg-glassCharcoal border border-cathedralGold/20 hover:border-cathedralGold/50 px-3 py-1.5 rounded-md transition-all text-sm text-holyWhite"
          >
            <span>장바구니</span>
            {cartCount > 0 && (
              <span id="cart-badge" class="bg-cathedralGold text-deepSlate font-bold text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </nav>
  );
}

interface CatalogProps {
  bibles: Bible[];
  cartCount: number;
}

export function CatalogPage({ bibles, cartCount }: CatalogProps) {
  return (
    <div class="flex-1 flex flex-col">
      <Navbar cartCount={cartCount} />
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
        <div class="text-center my-12">
          <h1 class="font-outfit text-4xl md:text-5xl font-extrabold text-holyWhite mb-4 tracking-tight">
            말씀을 듣고 <span class="text-cathedralGold">믿음에 이르라</span>
          </h1>
          <p class="text-slateGrey max-w-2xl mx-auto font-light leading-relaxed">
            "그러므로 믿음은 들음에서 나며 들음은 그리스도의 말씀으로 말미암았느니라" (로마서 10:17)<br/>
            귀한 성경 번역본을 배송비 없이 무료로 배포합니다. 원하는 성경을 담아주십시오.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bibles.map((bible) => (
            <div
              key={bible.id}
              class="group relative bg-glassCharcoal border border-cathedralGold/10 hover:border-cathedralGold/30 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cathedralGold/5"
            >
              <div class="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={bible.cover_image}
                  alt={bible.translation_name}
                  class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-glassCharcoal to-transparent opacity-80"></div>
              </div>
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div class="mb-4">
                  <h3 class="font-outfit text-lg font-bold text-holyWhite group-hover:text-cathedralGold transition-colors">
                    {bible.translation_name}
                  </h3>
                  <p class="text-slateGrey text-sm font-light mt-2 line-clamp-3">
                    {bible.description}
                  </p>
                </div>
                <button
                  hx-post="/cart/add"
                  hx-vals={`{"bibleId": ${bible.id}}`}
                  hx-swap="none"
                  class="w-full bg-glassCharcoal hover:bg-cathedralGold border border-cathedralGold/40 hover:border-cathedralGold text-cathedralGold hover:text-deepSlate font-medium py-2 rounded-md transition-all active:scale-95 text-sm"
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Container */}
      <div id="modal-container"></div>
    </div>
  );
}

interface CartItemDetail {
  bible: Bible;
  quantity: number;
}

interface CartPageProps {
  items: CartItemDetail[];
  cartCount: number;
}

export function CartPage({ items, cartCount }: CartPageProps) {
  return (
    <div class="flex-1 flex flex-col">
      <Navbar cartCount={cartCount} />
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
        <h2 class="font-outfit text-3xl font-bold text-holyWhite mb-8 border-b border-cathedralGold/10 pb-4">
          내 장바구니
        </h2>

        {items.length === 0 ? (
          <div class="text-center py-24 bg-glassCharcoal border border-cathedralGold/10 rounded-lg max-w-xl mx-auto">
            <p class="text-slateGrey mb-6 font-light">장바구니에 담긴 성경이 없습니다.</p>
            <a
              href="/"
              class="bg-cathedralGold text-deepSlate font-medium px-6 py-2.5 rounded-md hover:bg-mutedGold transition-all"
            >
              성경 둘러보기
            </a>
          </div>
        ) : (
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8" x-data="{ agreed: false }">
            {/* Left: Cart Items */}
            <div class="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.bible.id}
                  class="flex items-center justify-between bg-glassCharcoal border border-cathedralGold/10 p-4 rounded-lg"
                >
                  <div class="flex items-center space-x-4">
                    <img
                      src={item.bible.cover_image}
                      alt={item.bible.translation_name}
                      class="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 class="font-outfit font-bold text-holyWhite text-base">
                        {item.bible.translation_name}
                      </h4>
                      <p class="text-slateGrey text-xs mt-1">무료 배포 도서</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex items-center border border-cathedralGold/20 rounded overflow-hidden">
                      <button
                        hx-post="/cart/update"
                        hx-vals={`{"bibleId": ${item.bible.id}, "quantity": ${item.quantity - 1}}`}
                        hx-target="body"
                        class="px-2.5 py-1 text-slateGrey hover:bg-glassCharcoal hover:text-cathedralGold transition-colors"
                      >
                        -
                      </button>
                      <span class="px-4 py-1 text-sm font-semibold text-holyWhite bg-glassCharcoal/50 min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        hx-post="/cart/update"
                        hx-vals={`{"bibleId": ${item.bible.id}, "quantity": ${item.quantity + 1}}`}
                        hx-target="body"
                        class="px-2.5 py-1 text-slateGrey hover:bg-glassCharcoal hover:text-cathedralGold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      hx-post="/cart/delete"
                      hx-vals={`{"bibleId": ${item.bible.id}}`}
                      hx-target="body"
                      class="text-repentRed hover:underline text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Shipping Info & Confession */}
            <div class="lg:col-span-5 bg-glassCharcoal border border-cathedralGold/20 p-6 rounded-lg h-fit">
              <h3 class="font-outfit text-xl font-bold text-cathedralGold mb-6 border-b border-cathedralGold/10 pb-3">
                배송 및 신앙 고백
              </h3>
              
              {/* Client Side Check & Error Handling */}
              <div id="error-message" class="hidden mb-4 p-4 bg-repentRed/20 border border-repentRed text-repentRed rounded-md text-sm"></div>

              <form
                hx-post="/order"
                hx-target="body"
                x-on:submit="if (!agreed) { 
                  $event.preventDefault(); 
                  const errDiv = document.getElementById('error-message');
                  errDiv.innerText = '예수님을 구원자로 고백하고 동의하셔야 성경을 주문하실 수 있습니다.';
                  errDiv.classList.remove('hidden');
                  // Shake effect
                  errDiv.classList.add('animate-bounce');
                  setTimeout(() => errDiv.classList.remove('animate-bounce'), 1000);
                }"
                class="space-y-4"
              >
                <div>
                  <label class="block text-slateGrey text-xs font-semibold uppercase tracking-wider mb-2">
                    수령인 이름
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="이름을 입력하세요"
                    class="w-full bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-4 py-2.5 text-sm text-holyWhite outline-none transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-slateGrey text-xs font-semibold uppercase tracking-wider mb-2">
                    연락처
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    placeholder="예: 010-1234-5678"
                    class="w-full bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-4 py-2.5 text-sm text-holyWhite outline-none transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-slateGrey text-xs font-semibold uppercase tracking-wider mb-2">
                    배송지 주소
                  </label>
                  <textarea
                    name="address"
                    required
                    rows="3"
                    placeholder="도로명 주소 및 상세 주소를 입력하세요"
                    class="w-full bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-4 py-2.5 text-sm text-holyWhite outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Faith Confession Section */}
                <div class="mt-6 p-4 bg-deepSlate/50 border border-cathedralGold/10 rounded-md">
                  <p class="text-xs text-slateGrey leading-relaxed mb-4">
                    아래 신앙 고백에 마음으로 동의하고 믿으시는 분들께만 무료로 성경을 전해 드립니다.
                  </p>
                  <div class="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="confession"
                      name="confession"
                      x-model="agreed"
                      class="mt-1 w-4 h-4 rounded text-cathedralGold focus:ring-amber-500 bg-deepSlate border-cathedralGold/30 accent-cathedralGold cursor-pointer"
                    />
                    <label for="confession" class="text-sm text-holyWhite leading-relaxed select-none cursor-pointer">
                      "예수님을 나의 구원자로 믿고, 내가 죄인인 것과 하나님이신 예수님이 내 죄들을 대신해 피 흘려 죽고 장사되시고 부활한 것을 믿고 받아들입니다."
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  class="w-full mt-6 bg-cathedralGold text-deepSlate font-bold py-3 rounded-md hover:bg-mutedGold active:scale-95 transition-all text-base"
                >
                  믿는다 (무료 주문 완료)
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <div id="modal-container"></div>
    </div>
  );
}

interface OrderCompletedProps {
  orderNumber: string;
}

export function OrderCompleted({ orderNumber }: OrderCompletedProps) {
  return (
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="bg-glassCharcoal border border-cathedralGold/30 max-w-lg w-full p-8 rounded-lg text-center shadow-2xl">
        <div class="w-16 h-16 bg-cathedralGold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-cathedralGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="font-outfit text-3xl font-extrabold text-holyWhite mb-2">
          주문이 완료되었습니다!
        </h2>
        <p class="text-slateGrey text-sm font-light mb-8">
          구원의 약속(신앙고백)을 감사히 수신하였습니다.<br/>
          배송 현황 조회를 위해 아래 주문번호를 반드시 안전하게 보관하세요.
        </p>

        <div class="bg-deepSlate border border-cathedralGold/20 p-4 rounded-md mb-8 select-all">
          <span class="block text-xs text-slateGrey font-semibold uppercase tracking-wider mb-1">
            고유 주문번호
          </span>
          <span class="font-outfit text-2xl font-bold text-cathedralGold tracking-wider">
            {orderNumber}
          </span>
        </div>

        <a
          href="/"
          class="inline-block bg-glassCharcoal hover:bg-cathedralGold border border-cathedralGold/40 hover:border-cathedralGold text-cathedralGold hover:text-deepSlate font-semibold px-8 py-3 rounded-md transition-all text-sm"
        >
          메인 화면으로
        </a>
      </div>
    </div>
  );
}

export function TrackModal() {
  return (
    <div
      x-data="{ show: true }"
      x-show="show"
      x-transition
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/80" x-on:click="show = false"></div>

      {/* Modal Content */}
      <div class="relative bg-glassCharcoal border border-cathedralGold/20 max-w-md w-full p-6 rounded-lg shadow-2xl z-10">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-outfit text-lg font-bold text-cathedralGold">비회원 배송 조회</h3>
          <button x-on:click="show = false" class="text-slateGrey hover:text-holyWhite font-bold text-xl">
            &times;
          </button>
        </div>

        <form
          hx-get="/track"
          hx-target="#track-result"
          class="space-y-4"
        >
          <div>
            <label class="block text-slateGrey text-xs font-semibold uppercase tracking-wider mb-2">
              주문번호 입력
            </label>
            <input
              type="text"
              name="orderNumber"
              required
              placeholder="예: S-20260603-1234"
              class="w-full bg-deepSlate border border-cathedralGold/20 focus:border-cathedralGold/60 rounded px-4 py-2.5 text-sm text-holyWhite outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-cathedralGold text-deepSlate font-bold py-2 rounded hover:bg-mutedGold active:scale-95 transition-all text-sm"
          >
            조회하기
          </button>
        </form>

        <div id="track-result" class="mt-6 border-t border-cathedralGold/10 pt-4">
          {/* Result injected by HTMX */}
        </div>
      </div>
    </div>
  );
}

interface TrackingResultProps {
  order: any;
}

export function TrackingResult({ order }: TrackingResultProps) {
  if (!order) {
    return (
      <div class="text-center py-4 text-repentRed text-sm font-light">
        일치하는 주문 정보가 없습니다. 주문번호를 다시 확인해 주세요.
      </div>
    );
  }

  return (
    <div class="space-y-4 text-sm font-light">
      <div class="flex justify-between border-b border-cathedralGold/5 pb-2">
        <span class="text-slateGrey">상태</span>
        <span class={`font-bold ${order.status === 'SHIPPED' ? 'text-green-500' : 'text-amber-500'}`}>
          {order.status === 'SHIPPED' ? '발송 완료' : '발송 대기'}
        </span>
      </div>
      {order.status === 'SHIPPED' && (
        <div class="flex justify-between border-b border-cathedralGold/5 pb-2">
          <span class="text-slateGrey">송장번호 (8자리)</span>
          <span class="font-outfit font-bold text-cathedralGold">{order.tracking_number}</span>
        </div>
      )}
      <div class="flex justify-between border-b border-cathedralGold/5 pb-2">
        <span class="text-slateGrey">수령인</span>
        <span class="text-holyWhite">{order.customer_name}</span>
      </div>
      <div class="flex justify-between border-b border-cathedralGold/5 pb-2">
        <span class="text-slateGrey">배송지</span>
        <span class="text-holyWhite text-right max-w-[200px] truncate">{order.address}</span>
      </div>
      <div class="space-y-1 pt-2">
        <span class="text-slateGrey text-xs font-semibold block mb-1">신청 도서</span>
        {order.items.map((item: any) => (
          <div key={item.id} class="flex justify-between text-xs text-holyWhite">
            <span>{item.translation_name}</span>
            <span>{item.quantity}권</span>
          </div>
        ))}
      </div>
    </div>
  );
}
