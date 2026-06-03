# Architecture Decision Records (ADR)

## ADR 1: Web Framework
**Decision**: Use Hono with Node.js Adapter.
**Rationale**: Required by `req.md`. Hono is fast, lightweight, and supports JSX for server-side rendering, which pairs perfectly with HTMX.
**Status**: Accepted

## ADR 2: Frontend Interactivity
**Decision**: Use HTMX + Alpine.js + Tailwind CSS + Hono JSX.
**Rationale**: Required by `req.md`. Reduces the need for a heavy SPA framework. Server-rendered JSX provides the structure, HTMX handles network requests without JS, and Alpine.js handles minor client-side state (like toggling the camera scanner).
**Status**: Accepted

## ADR 3: Database
**Decision**: Use `better-sqlite3` for SQLite.
**Rationale**: SQLite is required. `better-sqlite3` is the fastest and most synchronous driver for Node.js, making the code simple and performant for a local DB.
**Status**: Accepted

## ADR 4: QR Scanning Library
**Decision**: Use `html5-qrcode` via CDN.
**Rationale**: The requirement asks for scanning a QR code from the browser. `html5-qrcode` is a robust client-side library that handles camera streams and QR decoding efficiently across devices.
**Status**: Accepted
