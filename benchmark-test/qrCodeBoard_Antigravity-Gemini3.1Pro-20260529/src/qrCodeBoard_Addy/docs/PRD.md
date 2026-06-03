# PRD: QR Code Scanner and Board

## Objective
A simple web application that allows users to scan a QR code using their device camera. The scanned result is displayed on the screen and can be saved to a bulletin board (게시판) for others to view.
Target users: Anyone who needs to scan QR codes and share the results.
Success criteria: User can grant camera permission, scan a QR code successfully, view the scanned data, and post it to a persistent board.

## Tech Stack
- Backend: Node.js (Hono)
- Frontend: Hono JSX + HTMX + Alpine.js + Tailwind CSS
- Database: SQLite
- Infrastructure: Local PC

## Commands
- Dev Server: `npm run dev`
- Install: `npm install`

## Project Structure
- `src/` -> Application source code
  - `src/index.tsx` -> Entry point for Hono
  - `src/db/` -> SQLite DB connection and schemas
  - `src/components/` -> Hono JSX UI components
  - `src/public/` -> Static assets
- `docs/` -> Documentation, PRD, ADRs

## Code Style
```tsx
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => {
  return c.html(<h1>QR Code Board</h1>)
})
```

## Testing Strategy
- Manual verification on browser with devtools
- Camera API access check via browser

## Boundaries
- Always: validate QR data before saving to DB, sanitize inputs
- Ask first: Schema changes
- Never: store arbitrary malicious script in the board (prevent XSS)
