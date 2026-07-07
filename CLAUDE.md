# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal investment dashboard (pt-BR UI) showing real crypto/fiat prices (Binance,
Frankfurter) and a real Bybit Unified Trading Account balance, gated behind a native
login system. Built for the repo owner and one friend — not a multi-tenant product.

## Repo shape: two independent Node projects

The frontend (repo root) and backend (`server/`) are **separate npm projects** — separate
`package.json`, `node_modules`, and `tsconfig.json`. Installing one does not install the
other; this has bitten onboarding more than once (see `REQUIREMENTS.md` / README). Always
`npm install` in both places after a fresh clone or a dependency change.

## Commands

Frontend (repo root):
- `npm run dev` — Vite dev server only
- `npm run dev:all` — Vite **and** the backend together (`concurrently`) — this is the
  normal way to run the app locally
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — eslint

Backend (`server/`):
- `npm run dev` — `tsx watch src/index.ts`
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — `tsc` (emits to `server/dist`)
- `npm start` — `node dist/index.js` (production, after build)

No test suite exists in either project.

Local env files (both gitignored, never commit them):
- `.env` (root) — `VITE_API_URL=http://localhost:3333/api`. Without this the frontend
  falls back to a relative `/api`, which hits Vite's own port instead of the backend and
  fails silently as a connection error.
- `server/.env` — `BYBIT_BASE_URL`, `PORT`, `CORS_ORIGIN`. `SETTINGS_ENCRYPTION_KEY` is
  generated automatically on first boot and appended here — never set it by hand.

## Architecture

### Backend (`server/src/`) — Express, CommonJS, native Node only

No auth framework, no ORM, no JWT library — deliberately built on Node built-ins only
(`node:sqlite`, `node:crypto`). Do not introduce bcrypt/passport/express-session/an ORM
without a real reason; this was a conscious choice.

- `db.ts` — `node:sqlite` `DatabaseSync` at `DATA_DIR/app.db` (`DATA_DIR` env var overrides
  the default `server/data`, used to point at the Fly.io volume in production). Single-row
  tables (`id = 1`) for `users` and `settings` since this is single-account; `sessions`
  keyed by token hash. All raw SQL lives here — everywhere else calls repo functions.
- `auth.ts` — scrypt password hashing (`timingSafeEqual` for comparison, never `===`),
  opaque random session tokens (only the SHA-256 hash is persisted, so a leaked DB row
  can't be replayed as a cookie), `requireAuth` middleware, in-memory login lockout.
- `crypto.ts` — AES-256-GCM encrypt/decrypt, used only for the two Bybit credential
  fields at rest in `settings`.
- `secrets.ts` — generates `SETTINGS_ENCRYPTION_KEY` on first boot if absent.
- `bybitCredentials.ts` — get/save Bybit creds, wraps `db.ts` + `crypto.ts`.
- `bybit.ts` — signs and calls the Bybit V5 wallet-balance endpoint. Bybit returns HTTP
  200 even on auth errors — always check `retCode !== 0` in the body, not just
  `response.ok`. Also compensates for local clock drift by offsetting the signed
  timestamp against Bybit's own `/v5/market/time` (cached 60s via `cache.ts`) — Bybit
  rejects timestamps ahead of its server clock even when the gap is within
  `recv_window`.
- `cache.ts` — tiny in-memory TTL memoizer (`getCached`), reused for both the Bybit
  server-time offset and login-attempt lockout tracking. Single process, single user —
  don't reach for Redis here.
- `cookies.ts` — hand-written cookie parsing; there's no `cookie-parser` dependency
  (only reading `req.cookies` needs a parser — Express's `res.cookie()` for setting them
  is built in).
- `routes/auth.ts` — `/session` (public), `/setup` (409 if a user already exists),
  `/login` (lockout-gated), `/logout`.
- `routes/settings.ts`, `routes/portfolio.ts` — mounted behind `requireAuth` in
  `index.ts`. Settings validates new Bybit keys with a live call before persisting them.
- `index.ts` — in production (`NODE_ENV=production`) also serves the built frontend as
  static files with a SPA fallback (`app.get(/^\/(?!api).*/, ...)`), so the deployed app
  is a single origin — no CORS/cross-site-cookie concerns in production. `trust proxy`
  is set for correct `secure` cookies and `req.ip` behind Fly's proxy.

### Frontend (`src/`) — Vite + React 19 + TypeScript

- **Data fetching**: TanStack React Query v5 exclusively. Each feature under
  `src/features/<name>/` follows the same shape: `services/` (fetch functions),
  `hooks/` (`useQuery`/`useMutation` wrappers + a `keys.ts` for query keys), optionally
  `components/`. Follow this shape for any new feature rather than inventing a new one.
  Note: `useQuery` has no `onSuccess` in v5 — side effects go in `useEffect` or a
  mutation's `onSuccess`.
- **Auth**: `features/auth/auth-context.tsx` composes the session-status query with the
  login/setup/logout mutations into `AuthStatus = 'loading' | 'error' | 'setup-required' |
  'unauthenticated' | 'authenticated'`. `RequireAuth`/`GuestOnly` (`src/app/`) are route
  guards keyed off this status; router structure is in `src/app/router.tsx`.
- **HTTP layer**: `src/services/http.ts`'s `http()` wraps `fetch` with
  `credentials: 'include'` and parses a `{ error: code }` JSON body into
  `HttpError.code`. Use `isErrorCode(error, 'not_configured')` etc. rather than checking
  raw status codes — e.g. the portfolio endpoints return `not_configured` (409) when no
  Bybit key is saved yet, which the UI renders as a "connect your account" prompt
  (`ConnectBybitPrompt`) instead of a generic error.
- **Live data sources**: `services/binance.ts` (public ticker + klines, no key needed —
  CoinGecko was tried first and dropped for aggressive rate limiting) and
  `services/exchangeRate.ts` (Frankfurter, for BRL/USD). Real portfolio quantities come
  from the backend's `/portfolio/holdings` (Bybit), never entered manually — asset cost
  basis (`averageBuyPriceBRL`) is the one piece of static data, in
  `features/assets/holdings.ts`, joined to live quantities by symbol.
- **News is the one feature still mocked** (`src/mocks/news.ts`) — everything else
  (prices, FX, portfolio) is live.
- **History period toggle**: `features/portfolio/historyPeriod.ts` centralizes the
  daily/weekly/monthly config (Binance kline interval, limit, label formatting) shared
  between `PortfolioHistoryChart` and the detail table on `/historico`. The chart takes
  optional `period`/`onPeriodChange` props — controlled when a parent needs to sync a
  toggle with something else (the history table), uncontrolled (own internal state)
  otherwise (the dashboard preview).
- **Design system**: Tailwind only — no CSS-in-JS, no component libraries (MUI/Chakra),
  no charting library other than Recharts. Semantic color tokens are defined in
  `tailwind.config.js` (`positive`/`negative`/`neutral`, `surface`/`canvas`/`border`,
  `text.primary/secondary/muted`) — use these instead of raw Tailwind color utilities.
  Every data-consuming component handles four states: loading (skeleton, not a bare
  spinner), error (message + retry), empty (a real empty state, not a blank screen), and
  success. Financial numbers always go through the centralized formatters in
  `src/lib/formatters.ts` (`formatCurrency`, `formatPercent`, etc. — `Intl.NumberFormat`,
  pt-BR locale) rather than being formatted ad hoc in components; percentage/variation
  indicators pair color with a sign or arrow, never color alone.

## Deployment

Single Fly.io container (`Dockerfile`, `fly.toml`) — the backend serves the built
frontend from the same origin (see `index.ts` above), so there's no separate frontend
host and no production CORS config to maintain. SQLite lives on a Fly persistent volume
mounted at `/data` (`DATA_DIR` env var). `SETTINGS_ENCRYPTION_KEY` must be set as a Fly
secret before first deploy rather than left to auto-generate, since the container
filesystem outside the volume doesn't persist across deploys.
