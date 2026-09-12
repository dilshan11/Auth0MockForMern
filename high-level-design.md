# High Level Design: Auth0 Authentication & Authorization

This document describes the high-level architecture for adding authentication and
authorization to the FE (React) and BE (Express) using Auth0, based on the
**Authorization Code Flow with PKCE** — the industry-standard flow for single-page
applications.

## Auth0 Setup

Two entities are registered in the Auth0 tenant:

- **Application (SPA)** — represents the React app. Has a Client ID, and is configured
  with allowed callback / logout / web-origin URLs (e.g. `http://localhost:5173`).
- **API** — represents the Express backend. Has an "Identifier" (a URL-like string,
  e.g. `https://chiraaiya-api`) that acts as the **audience** tokens are issued for,
  and defines permissions (e.g. `read:products`, `write:products`) used for
  authorization.

## Login Flow (Authentication)

```
 Browser (React SPA)                 Auth0                      Express API
        │                              │                             │
  1. Click "Log in"                    │                             │
        │──── redirect to /authorize ─▶│                             │
        │        (+ code_challenge)    │                             │
        │                              │                             │
  2.    │◀─── Auth0 hosted login ──────│  (user enters credentials,  │
        │       page shown             │   or social login, MFA...)  │
        │                              │                             │
  3.    │◀── redirect to callback ─────│  (with authorization code)  │
        │      URL + auth code         │                             │
        │                              │                             │
  4.    │──── exchange code + ────────▶│  (code_verifier proves      │
        │      code_verifier           │   this is the same client)  │
        │                              │                             │
  5.    │◀─── ID Token + Access ───────│                             │
        │      Token (+ refresh)       │                             │
        │                              │                             │
  6. SDK stores tokens in memory,                                    │
     app now knows user is logged in                                 │
```

## Calling the Backend (Authorization)

```
 React SPA                                                    Express API
     │                                                              │
     │── GET /api/products  ───────────────────────────────────────▶│
     │   Authorization: Bearer <access_token>                       │
     │                                                              │
     │                                    checkJwt middleware:      │
     │                                    - fetch Auth0's public    │
     │                                      keys (JWKS endpoint)    │
     │                                    - verify signature        │
     │                                    - check `aud` == API id   │
     │                                    - check `iss`, expiry     │
     │                                    - (optional) check        │
     │                                      required `permissions`  │
     │                                                              │
     │◀───────────── 200 + data, or 401/403 ───────────────────────│
```

## Key Pieces

### FE (React)

- `Auth0Provider` wraps the app (domain, client ID, redirect URI, audience).
- `useAuth0()` hook provides `loginWithRedirect()`, `logout()`, `isAuthenticated`,
  `user` (decoded ID token claims), `getAccessTokenSilently()`.
- Before each API call, get the access token via `getAccessTokenSilently()` and
  attach it as `Authorization: Bearer <token>`.
- A `<ProtectedRoute>` wrapper checks `isAuthenticated` to guard pages/routes.

### BE (Express)

- `express-oauth2-jwt-bearer` middleware (`checkJwt`) configured with the Auth0
  domain + API audience — validates the JWT on every protected route, no
  session/DB lookup needed (fully stateless).
- A second middleware/helper checks the `permissions` claim in the token for
  role-based authorization (e.g., only users with `write:products` can hit
  `POST /api/products`).

## Why This Is Industry Standard

- Tokens are short-lived JWTs validated cryptographically — no server-side session
  store required.
- Password/credential handling never touches application code — Auth0's hosted
  login page handles it, reducing security liability.
- PKCE prevents authorization-code interception attacks — required for public
  clients like SPAs.
- Roles/permissions live in the token itself, so authorization checks on the BE
  are just claim checks, with no extra round-trip.

## Open Decision

Whether to start with **authentication only** (any logged-in user can access all
endpoints) or introduce **role-based authorization** from the start (e.g.,
distinguishing admin vs. customer for product write access). This determines
whether permissions/roles need to be set up in Auth0 now or can be added later.
