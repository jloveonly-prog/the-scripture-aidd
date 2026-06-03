# Task Breakdown: The Scripture Shop

- [ ] Task 1: Initialize Database & Seed Data
  - Acceptance: A local SQLite database `data/shop.db` is initialized with `bibles` and `orders` (with order items) schemas. Exactly 10 specific Bibles are seeded with high-quality descriptions and translations (KJV, NIV, NASB, Greek TR, Hebrew WLC, etc.).
  - Verify: Run database initialization script or check file creation, and query database to verify exactly 10 Bibles exist.
  - Files: `src/db/schema.ts`, `src/db/init.ts`

- [ ] Task 2: Build Layout & Styles
  - Acceptance: A premium HTML base layout using Tailwind CSS CDN and Outfit/Inter fonts. Clean dark-mode design with vibrant indigo/cyan gradients.
  - Verify: Visual inspection via browser (or compile JSX component and test markup).
  - Files: `src/views/layout.tsx`

- [ ] Task 3: Build Catalog (Home Page)
  - Acceptance: Main catalog showing the 10 Bibles with cover graphics, title, translation name, and "장바구니 담기" button. Navbar with brand logo and cart count badge.
  - Verify: Verify home page endpoint `/` returns the 10 cards.
  - Files: `src/views/home.tsx`, `src/routes/home.ts`

- [ ] Task 4: Cart Management
  - Acceptance: Cookie-based cart where users can add, update quantities, or delete Bibles. HTMX updates for the cart badge and a dedicated Cart page showing list of items, quantities, and a checkout button.
  - Verify: Write integration tests for `/cart` endpoint, verifying item adding and deleting operations.
  - Files: `src/routes/cart.ts`, `src/views/cart.tsx`

- [ ] Task 5: Checkout & Confession Process
  - Acceptance: Shipping form containing name, address, phone. A faith confession section with a checkbox and `[믿는다]` button. Submitting creates an order in SQLite, saves the confession status (`confessed = 1`), clears the cart, and redirects to a receipt page showing a unique order number (e.g. `TS-XXXXXX`).
  - Verify: Test order placement via POST to `/checkout` with and without confession checked.
  - Files: `src/routes/checkout.ts`, `src/views/checkout.tsx`

- [ ] Task 6: Order Tracking Page
  - Acceptance: Tracking input page. Entering the Order ID retrieves and shows order details: items, shipping address, status ("발송 대기" or "발송 완료"), and invoice number (8 digits) if completed.
  - Verify: Query order tracking endpoint with valid/invalid order IDs.
  - Files: `src/routes/tracking.ts`, `src/views/tracking.tsx`

- [ ] Task 7: Admin Panel
  - Acceptance: Basic login page for `/admin`. Valid credentials (`admin` / `admin`) set a session cookie. Admin dashboard shows orders grouped by status. Each order displays customer details and their confession validation status. Admin can type an 8-digit invoice number and press `[발송처리]` to transition the order to completed.
  - Verify: Test access restriction to `/admin` without credentials. Verify tracking number validation (exactly 8 digits).
  - Files: `src/routes/admin.ts`, `src/views/admin.tsx`

- [ ] Task 8: Verification & Hardening
  - Acceptance: All test cases pass. CSS aesthetics polished. OWASP security checklist audited (SQL injection prevented, XSS prevented, safe cookies).
  - Verify: Run `npm test` and verify 100% test success.
  - Files: `tests/shop.test.ts`
