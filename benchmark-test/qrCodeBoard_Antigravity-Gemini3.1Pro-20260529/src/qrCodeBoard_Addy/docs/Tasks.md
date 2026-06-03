# Task Breakdown

## Phase 1: Foundation
- [ ] Task 1: Setup Project
  - Acceptance: `package.json` created, dependencies installed (Hono, SQLite, Tailwind).
  - Verify: `npm start` runs a basic Hono server on port 3000.
- [ ] Task 2: Setup Database
  - Acceptance: `src/db/schema.sql` created, SQLite DB initialized with a `boards` table (id, content, created_at).
  - Verify: Can insert and read data via a simple script.

## Phase 2: Backend API and HTML Shell
- [ ] Task 3: Setup Hono JSX & Tailwind
  - Acceptance: Hono serves a basic HTML shell styled with Tailwind CSS, including HTMX and Alpine.js via CDN.
  - Verify: Browser shows styled "QR Board" header.
- [ ] Task 4: Board API endpoints
  - Acceptance: `GET /api/board` returns list of items, `POST /api/board` creates an item.
  - Verify: API testing via curl or browser.

## Phase 3: Frontend Integration
- [ ] Task 5: QR Scanner UI
  - Acceptance: A page/component with a "Scan" button that activates the device camera, scans a QR code, and shows the result using standard Web APIs (e.g. `html5-qrcode` or built-in `BarcodeDetector` if supported, but typically `html5-qrcode` library via CDN).
  - Verify: Browser requests camera permission and can scan a QR code.
- [ ] Task 6: Posting to Board
  - Acceptance: Scanned result can be posted to the board using HTMX `hx-post`. Board auto-updates or prepends the new item.
  - Verify: Scanning a code adds it to the UI immediately.

## Phase 4: Polish
- [ ] Task 7: Styling and Accessibility
  - Acceptance: UI looks premium, WCAG 2.1 AA compliant.
  - Verify: Check contrast and keyboard navigation.
