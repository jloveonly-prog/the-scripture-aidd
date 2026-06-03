# Spec: The Scripture Shop

## Objective
A non-member online store for distributing free Bibles (KJV, NIV, Greek, Hebrew, etc.). Users can browse 10 pre-seeded Bibles, add them to a cart, input their address, make a faith confession ("예수님을 나의 구원자로 믿고, 내가 죄인인 것과 하나님이신 예수님이 내 죄들을 대신해 피 흘려 죽고 장사되시고 부활한 것을 믿고 받아들입니다"), place a free order, and track their order via a unique order number. Admin (admin/admin) can view orders, check their confession status, and update shipment with an 8-digit tracking number.

## Tech Stack
- **Backend**: Node.js (Hono v4)
- **Frontend**: Hono JSX + HTMX + Alpine.js + Tailwind CSS (via CDN)
- **Database**: SQLite (via `better-sqlite3`)
- **Testing**: Vitest

## Commands
- **Dev Server**: `npm run dev` (runs on port 3000)
- **Test Suite**: `npm test`
- **Build**: `npm run build`
- **Production Start**: `npm start`

## Project Structure
```
src/
  db/          -> SQLite connection and schema setup
  views/       -> Hono JSX templates/pages
  routes/      -> Hono router handlers
  index.tsx    -> Application entry point
tests/         -> Vitest test suites
docs/          -> PRD, design docs, ADRs
data/          -> SQLite database file (production/dev)
```

## Code Style
We use TypeScript with clean functional routes, semantic JSX elements, and Tailwind utility classes for premium aesthetics.
Example:
```tsx
const BibleCard = ({ bible }: { bible: Bible }) => (
  <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1">
    <div class="h-48 bg-gradient-to-br from-indigo-950 to-slate-950 flex items-center justify-center p-6 border-b border-slate-800">
      <div class="text-center">
        <span class="text-3xl block mb-2">📖</span>
        <span class="text-sm font-semibold tracking-wider text-cyan-400 uppercase">{bible.translation}</span>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-white mb-2">{bible.title}</h3>
      <p class="text-slate-400 text-sm mb-4 line-clamp-3">{bible.description}</p>
      <button 
        hx-post={`/cart/add/${bible.id}`} 
        hx-target="#cart-count"
        class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span>장바구니 담기</span>
      </button>
    </div>
  </div>
);
```

## Testing Strategy
- **Unit & Integration Tests**: Using `vitest` to verify database operations, cart logic, order creation constraints, and admin shipment processing.
- **Test File Location**: `tests/` directory.

## Boundaries
- **Always**: 
  - Run the server on port 3000.
  - Verify inputs (e.g., shipping address non-empty, order confession checked).
  - Verify tracking number is exactly 8 digits of numbers.
- **Ask first**:
  - Adding third-party NPM packages not declared in initial plan.
- **Never**:
  - Hardcode sensitive credentials (use environment variables or safe defaults).
  - Store plaintext passwords (admin is hardcoded to `admin`/`admin` for this benchmark requirement but let's compare secure hashes or simple check).

## Success Criteria
- Home page displays 10 Bibles in an aesthetically rich dark-mode catalog.
- Cart quantity can be adjusted or removed; uses HTMX for dynamic updates without full reload.
- Checkout displays address form, the mandatory faith confession checkbox, and `[믿는다]` button.
- Placing order generates a unique Order ID and redirects/updates to show the ID.
- Tracking page retrieves order details and shows either "발송 대기" (Pending) or "발송 완료" (Completed) with its 8-digit tracking number.
- Admin panel `/admin` (login `admin` / `admin`) displays list of orders grouped by status, clearly showing the user's faith confession check.
- Admin can input an 8-digit shipping code to process shipment.

## Open Questions / Clarifications
- *How are order numbers formatted?* We will generate unique 8-character uppercase alphanumeric strings or UUIDs. Alphanumeric (e.g., `ORD-XXXX-XXXX` or short nano-ids) is more user-friendly. We'll use short uppercase IDs (e.g., `TS-XXXXXX`).
