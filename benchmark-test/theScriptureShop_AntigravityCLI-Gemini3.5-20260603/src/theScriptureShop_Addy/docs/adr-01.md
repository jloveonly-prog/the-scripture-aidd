# ADR 01: Core Architecture for The Scripture Shop

## Context
We need to build a high-fidelity, high-performance, and visually beautiful non-member Scripture shop with cart, checkout, tracking, and an admin system. The technology stack must be:
- Node.js (Hono)
- Hono JSX + HTMX + Alpine.js + Tailwind CSS
- SQLite for storage
- Local execution on port 3000

## Decision
We will use the following architectural choices:
1. **Server Architecture**: We will use Hono with `@hono/node-server` to run on Node.js. Hono's native JSX renderer will be used for server-side HTML rendering, giving us a type-safe templating engine.
2. **Database**: We will use `better-sqlite3` to store Bibles, Orders, and Order Items. A local database file `data/shop.db` will be used. Database schema will be created programmatically if it doesn't exist, and the 10 Bibles seed data will be inserted automatically.
3. **Frontend Interactivity**:
   - **Tailwind CSS** (via Play CDN) will style the application in a sleek, premium dark theme with custom gradients and interactive states.
   - **HTMX** will handle dynamic cart updates (adjusting quantities, removing items) and admin operations (submitting tracking number) asynchronously without full-page reloads.
   - **Alpine.js** will manage client-side ephemeral state such as cart modal toggle, mobile menu states, and minor UI animations.
4. **Session / Cart Management**:
   - Since there are no accounts/membership, the Cart will be stored in an encrypted/serialized cookie or simply a JSON cookie (`cart`) containing Bible IDs and quantities. This avoids server-side session overhead and works seamlessly for non-member checkout.
   - Admin login will set a simple cookie `admin_session=true` when username/password is `admin`/`admin`.

## Consequences
- High-speed performance due to server-side JSX rendering and fast SQLite queries.
- Zero-auth overhead for visitors, matching the non-member requirement.
- Sleek and clean code structure where pages are composed of JSX components.
- Easily testable endpoints and database queries.
