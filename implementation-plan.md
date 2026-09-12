# Implementation Plan: Auth0 Authentication & Authorization

This plan implements the architecture described in [high-level-design.md](./high-level-design.md).
It is split into phases. Phase 1 requires manual action in the Auth0 dashboard
(needs your own account); the remaining phases are code changes.

## Phase 1 — Auth0 Dashboard Setup (manual)

1. Sign up / log into [auth0.com](https://auth0.com), create a tenant (or use an
   existing one).
2. Create an **Application** of type "Single Page Application" for the React FE.
   Note down: **Domain**, **Client ID**. Configure:
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
3. Create an **API** for the Express BE. Set an **Identifier** (this becomes the
   `audience`, e.g. `https://chiraaiya-api`). Signing algorithm: RS256 (default).
4. Share the Domain, Client ID, and API Identifier (not secrets — safe to share)
   so they can be wired into FE/BE config.

## Phase 2 — Backend: JWT Validation

5. Install `express-oauth2-jwt-bearer`.
6. Add a `.env` file in `BE` with `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` (already
   covered by `BE/.gitignore`).
7. Create a `checkJwt` middleware configured from those env vars.
8. Apply `checkJwt` to the product routes (or just write operations — see
   Phase 5 decision).
9. Add a basic error handler so invalid/missing tokens return a clean `401`
   JSON response instead of a stack trace.
10. Test with Postman: request without token → 401. Full test with a valid
    token happens after Phase 3 (FE login) provides one.

## Phase 3 — Frontend: Login Integration

11. Install `@auth0/auth0-react`.
12. Add a `.env` in `FE` with `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`,
    `VITE_AUTH0_AUDIENCE`, and explicitly gitignore `.env`.
13. Wrap the app in `Auth0Provider` (in `main.tsx`) using those env vars.
14. Add Login/Logout buttons using the `useAuth0()` hook.
15. Show basic profile info (name/email/avatar) when `isAuthenticated` is true.

## Phase 4 — Connect FE to Protected BE Endpoint

16. Update `fetchProducts` to get a token via `getAccessTokenSilently()` and
    send it as `Authorization: Bearer <token>`.
17. End-to-end test: log in on FE → products load successfully. Log out →
    request fails/blocked (or button hidden, depending on UX choice).

## Phase 5 — Role-Based Authorization (optional, can defer)

18. In Auth0 API settings, define permissions (e.g. `read:products`,
    `write:products`) and enable RBAC + "Add Permissions in the Access Token".
19. Create roles (e.g. `admin`, `customer`) and assign permissions to each.
20. Assign a role to test user(s) in Auth0.
21. Add a `requirePermission()` middleware on the BE to guard specific routes
    (e.g. a future `POST /api/products` would need `write:products`).
22. Test with two users of different roles to confirm authorization behaves
    correctly.

---

**Recommended order:** complete Phases 1–4 now (covers authentication end to
end). Revisit Phase 5 once write endpoints (create/update/delete product)
exist, since authorization checks are only meaningful once there's something
to differentiate access to.
