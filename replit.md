# Easy-Brand Store

A full-stack e-commerce storefront for a premium menswear brand ("Easy-Brand"). Customers can browse products, manage a cart and wishlist, and complete orders.

## Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Shadcn UI, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: PostgreSQL via Replit's built-in DB, Drizzle ORM
- **Monorepo**: pnpm workspaces

## Structure

```
artifacts/
  easy-brand/       # React/Vite storefront (preview path: /)
  api-server/       # Express REST API (preview path: /api)
  mockup-sandbox/   # Canvas component preview server
lib/
  db/               # Drizzle schema + migrations (push with `pnpm run push`)
  api-zod/          # Zod schemas for API request/response validation
  api-spec/         # OpenAPI spec + Orval codegen config
  api-client-react/ # Generated TanStack Query hooks
```

## Running locally

All three services start automatically via workflows. To start manually:

```bash
# Install all dependencies
pnpm install

# API server (port from $PORT env var)
pnpm --filter @workspace/api-server run dev

# Frontend
pnpm --filter @workspace/easy-brand run dev
```

## Database

Replit's built-in PostgreSQL. Schema is defined in `lib/db/src/schema/`.

To push schema changes to the DB:
```bash
cd lib/db && pnpm run push
```

## API

The API server exposes these routes under `/api`:
- `GET /api/products` — list products
- `GET /api/products/:id` — product detail
- `GET/POST /api/cart/items` — cart management (session-based)
- `GET/POST/DELETE /api/wishlist/items` — wishlist management
- `POST /api/orders` — place an order
- `GET /api/health` — health check

## Environment variables

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Auto-provided by Replit (do not set manually) |
| `SESSION_SECRET` | Secret for signing session cookies |
| `PORT` | Auto-assigned per artifact by Replit |

## User preferences

_No preferences recorded yet._
