# Threat Model

## Project Overview

Grafly is a mobile design education app built with Expo/React Native in a pnpm monorepo, with an Express 5 API server that proxies AI critique and text-to-speech features. Users can use the app anonymously at first, optionally sign in with Supabase Auth, and sync their game state to Supabase across devices.

Production-relevant components in this repo are the mobile app in `artifacts/grafly`, the API server in `artifacts/api-server`, and shared libraries used by those components. The presentation artifacts in `artifacts/pitch`, `artifacts/intro-outro`, and the `artifacts/mockup-sandbox` environment are not treated as production attack surface unless future scans show production reachability. Per platform assumptions, deployed traffic is protected by TLS and mockup sandbox is never deployed.

## Assets

- **User accounts and sessions** — Supabase sessions, password reset flows, OAuth callbacks, and synced user identity. Compromise would allow account takeover or unauthorized access to cloud-synced progress.
- **Synced user state** — `game_state` records, including XP, streaks, coins, progress, profile fields, and premium flags. Integrity matters because the app promises cross-device persistence and uses this state to gate features.
- **Third-party API authority and quota** — server-side NVIDIA and ElevenLabs API keys, plus the spend and quota they control. Abuse can create direct cost exposure and service disruption.
- **Application configuration and secrets** — environment variables for Supabase connectivity, API keys, and server configuration.
- **Course and critique content** — lesson content, critique designs, and generated mentor responses. Most of this is not highly sensitive, but integrity and availability matter for the product experience.

## Trust Boundaries

- **Mobile client to API server** — requests from the app to `artifacts/api-server/src/app.ts` cross from an untrusted client into a server that holds third-party API secrets.
- **Mobile client to Supabase** — the app talks directly to Supabase Auth and tables using the public anon key. Authorization therefore depends heavily on Supabase-side policy enforcement.
- **API server to third-party services** — the Express server uses privileged NVIDIA and ElevenLabs credentials to call external APIs on behalf of clients.
- **Authenticated to unauthenticated user boundary** — onboarding can occur before sign-in, while account sync and password reset flows rely on authenticated Supabase sessions.
- **Free to premium boundary** — critique limits and Pro-only behavior are implemented in the app and must not be enforceable only on the client.
- **Production to dev-only boundary** — build scripts, pitch artifacts, intro/outro assets, and mockup sandbox code should usually be ignored during production scans unless an execution or deployment path pulls them into production.

## Scan Anchors

- **Production entry points**
  - `artifacts/api-server/src/index.ts`
  - `artifacts/api-server/src/app.ts`
  - `artifacts/api-server/src/routes/*.ts`
  - `artifacts/grafly/app/_layout.tsx`
  - `artifacts/grafly/context/AuthContext.tsx`
  - `artifacts/grafly/context/GameContext.tsx`
- **Highest-risk areas**
  - Secret-bearing API proxy routes in `artifacts/api-server/src/routes/critique.ts` and `artifacts/api-server/src/routes/tts.ts`
  - Auth and deep-link handling in `artifacts/grafly/context/AuthContext.tsx` and `artifacts/grafly/app/auth-callback.tsx`
  - Client-to-Supabase state sync in `artifacts/grafly/context/GameContext.tsx`
  - Premium gating in `artifacts/grafly/app/paywall.tsx` and `artifacts/grafly/app/(tabs)/critique.tsx`
- **Surface split**
  - Public: API health check and any unauthenticated API routes
  - Authenticated: Supabase-backed account and synced state flows
  - Premium: Pro entitlement and critique usage caps
- **Usually dev-only**
  - `artifacts/mockup-sandbox/**`
  - `artifacts/pitch/**`
  - `artifacts/intro-outro/**`
  - local build scripts unless a production execution path reaches them

## Threat Categories

### Spoofing

Supabase authentication is the primary identity mechanism for signed-in users. The app must only accept valid Supabase sessions, password recovery links, and OAuth callbacks that result in genuine Supabase-issued sessions. Auth callback handling MUST be stateful and tied to an expected in-app auth transaction, rather than accepting arbitrary deep links that contain session material. Any API endpoint that is intended to distinguish users or plans MUST verify a server-trusted identity instead of trusting the client to self-report state.

### Tampering

The mobile client currently computes and persists game progression locally, then syncs it to Supabase. Because the client is untrusted, any value that affects access, monetization, ranking, or other user-visible privileges MUST be validated or derived server-side. Premium entitlements, usage caps, and any cross-user-visible progression data MUST NOT rely solely on client-controlled state. Local cached state MUST also be scoped to the correct authenticated account before it is restored or uploaded, so one session cannot inherit another user's device state.

### Information Disclosure

The app stores synced user state in Supabase and exposes some design content through API routes. Access to user-specific data MUST remain scoped to the authenticated user through Supabase policies or equivalent server checks. Error handling and logs MUST avoid leaking tokens, cookies, or other sensitive request metadata.

### Denial of Service

The API server exposes routes that proxy paid third-party services. These endpoints MUST have meaningful abuse controls such as authentication, authorization, quotas, or rate limiting so unauthenticated or low-cost requests cannot exhaust third-party spend or degrade service availability.

### Elevation of Privilege

Privilege boundaries in this project include authenticated versus unauthenticated use and free versus premium access. No user should be able to obtain premium features, higher usage limits, or broader data access simply by toggling client state, replaying requests, or calling backend proxy routes directly. Any privileged backend action MUST be bound to a verified server-side entitlement or policy decision.