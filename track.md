# Progress Tracker

Tracks what has been implemented so far and what remains. See
[high-level-design.md](./high-level-design.md) and
[implementation-plan.md](./implementation-plan.md) for full details.

## Done

### Project setup
- [x] Scaffolded React app (Vite + TypeScript) in `FE`
- [x] Scaffolded Node.js backend (Express + TypeScript, `tsx` for dev reload) in `BE`
- [x] Root `.gitignore` (`.idea/`), `BE/.gitignore`, `FE/.gitignore` (incl. `.env`)

### Backend — Products API (no DB, in-memory)
- [x] `GET /api/products` — list all products
- [x] `GET /api/products/:id` — get single product (404 if not found)
- [x] CORS enabled on the Express app

### Frontend — Products UI
- [x] `fetchProducts()` API helper (`FE/src/api/products.ts`)
- [x] Product list UI in `App.tsx` fetching from the backend

### Auth0 — Design & planning
- [x] `high-level-design.md` — architecture (Auth Code Flow + PKCE, FE/BE responsibilities)
- [x] `implementation-plan.md` — phased step-by-step plan

### Auth0 — Phase 1 (dashboard setup)
- [x] Auth0 SPA Application created (Client ID + Domain obtained)
- [ ] Allowed Callback URLs set to `http://localhost:5173`
- [ ] Allowed Logout URLs set to `http://localhost:5173`
- [ ] Allowed Web Origins set to `http://localhost:5173`
- [x] Auth0 API created (Identifier/audience: `https://chiraaiya-api`)

### Auth0 — Phase 3 (frontend login integration)
- [x] Installed `@auth0/auth0-react`
- [x] Pinned Vite dev server to port `5173` with `strictPort`
- [x] `FE/.env` + `.env.example` with `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID` / `VITE_AUTH0_AUDIENCE`
- [x] `Auth0Provider` wired in `main.tsx` (now requests `audience`)
- [x] Login / Signup / Logout buttons + logged-in email display in `App.tsx`
- [ ] End-to-end login test (blocked on Phase 1 dashboard URLs above)

### Auth0 — Phase 2 (backend JWT validation)
- [x] Installed `express-oauth2-jwt-bearer` + `dotenv`
- [x] Added `BE/.env` + `.env.example` with `AUTH0_DOMAIN` and `AUTH0_AUDIENCE`
- [x] Created `checkJwt` middleware (`BE/src/middleware/auth.ts`)
- [x] Applied middleware to product routes
- [x] Added 401 error handler for invalid/missing tokens (verified: unauthenticated request returns 401)

## To Do

### Auth0 — Phase 4 (connect FE to protected BE endpoint)
- [x] Attach `Authorization: Bearer <token>` (via `getAccessTokenSilently()`) to `fetchProducts`
- [x] Products UI only fetches/renders when `isAuthenticated`, shows "Log in to view products." otherwise
- [ ] End-to-end test in browser: logged-in fetch succeeds, logged-out fetch fails/blocked (needs manual login — see Immediate Next Step)

### Auth0 — Phase 5 (role-based authorization) — optional, deferred
- [ ] Define permissions (`read:products`, `write:products`) in Auth0 API settings, enable RBAC
- [ ] Create roles (`admin`, `customer`) and assign permissions
- [ ] Assign roles to test users
- [ ] Add `requirePermission()` middleware on BE
- [ ] Test authorization with different roles
- Note: only meaningful once write endpoints (create/update/delete product) exist

### Git
- [ ] Initial commit/push of `FE` and `BE` to the repo (not yet pushed)

## Immediate Next Step
Set Allowed Callback URLs / Logout URLs / Web Origins to `http://localhost:5173`
on the Auth0 SPA Application (Phase 1 — still unchecked). Then restart the FE
dev server (env vars are only read on startup) and manually test in the
browser: log in → products load; log out → "Log in to view products." shown
and `GET /api/products` returns 401 without a token.
