# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Grafly** gamified design education mobile app (Expo) and an API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5

## Artifacts

### Grafly Mobile App (`artifacts/grafly`)
- **Framework**: Expo (React Native), expo-router v6
- **State**: React Context + AsyncStorage (`context/GameContext.tsx`)
- **Font**: Nunito (`@expo-google-fonts/nunito`) — SemiBold 600 + ExtraBold 800
- **Theme**: Dark-first (`constants/colors.ts`) — background #21263F, primary #00A4FA, accent #E3ED43, pink #FF7BD0
- **Navigation**: Floating frosted-glass tab bar with spring press animation + Stack screens (lesson, leaderboard, paywall, onboarding)
- **Screens**: Onboarding (4-step with placement test + mascot), Home (time greeting, XP bar, fixed streak), Skill Tree (S/Z winding path + swipeable course cards), AI Critique (mascot-driven feedback), Shop (bounce mascot), Profile (inline name edit, 2x2 stats, horizontal achievement badges), Lesson Engine, Leaderboard, Paywall
- **Mascot**: `GraflyMascot` component (`components/GraflyMascot.tsx`) with states: idle, celebrate, think, oops, correct, wrong — used throughout all screens
- **Assets**: `constants/assets.ts` exports MASCOT and LOGO path maps; mascot images in `assets/mascot/`, logo in `assets/logo/`
- **Services**: `services/voiceService.ts` (ElevenLabs via API), `services/aiCritique.ts` (NVIDIA NIM via API)
- **Gamification**: XP/level progression, coins, 5 hearts (lesson screen only), streak (home screen only), shields, XP booster
- **Lesson data**: 5 courses × multiple skill nodes × multiple lessons (`constants/lessons.ts`); 10-question placement test; 7 question types: multiple_choice, true_false, spot_the_difference, tap_the_element, arrange_in_order, drag_to_match, fill_in_blank
- **Display rules**: Coins shown on home/shop/lesson result only. Hearts shown on lesson screen only. Streak shown on home only (fixed, no animation). No hyphens or dashes in UI strings.

### API Server (`artifacts/api-server`)
- **Routes**: `GET /api/health`, `POST /api/critique/chat` (NVIDIA NIM Gemma proxy), `GET /api/critique/designs(/random)` (Supabase + fallback list), `POST /api/tts` (ElevenLabs proxy)
- **Env vars**: `NVIDIA_API_KEY`, `ELEVENLABS_API_KEY`, `SESSION_SECRET`, plus `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` (shared)
- **NVIDIA model**: `google/gemma-3-27b-it`
- **ElevenLabs voice ID**: `MFZUKuGQUsGJPQjTS4wC`
- **Supabase client**: `src/lib/supabase.ts` (anon key, no session persistence)

## Recent Architecture Decisions

- **Onboarding-first auth**: no account required. AuthGate (`app/_layout.tsx`) routes declaratively based on `state.onboardingComplete` — never use imperative `router.replace` for these transitions, it causes navigator races.
- **Hydration gate**: `GameContext` exposes a `hydrated` flag; AuthGate waits on it so the app does not bounce to the welcome screen before AsyncStorage loads.
- **Local→cloud migration**: `GameContext` syncs to AsyncStorage immediately and to Supabase `game_state` (debounced 1.5s). On sign-in, falls back to local state if no cloud row exists.
- **Google OAuth**: `supabase.auth.signInWithOAuth` + `expo-web-browser` + `expo-linking`. Do NOT reintroduce `expo-auth-session`/`expo-crypto` — ExpoCryptoAES native module is missing in Expo Go SDK 54.
- **AI Critique chat**: chat-style UI in `app/(tabs)/critique.tsx`. Designs come from `data/localDesigns.ts` (4 bundled PNGs in `assets/designs/`) so the AI is testable without Supabase. Backend `loadDesignsFromSupabase()` exists for when the user runs the SQL.
- **Critique composer**: floats above the tab bar (`composerLift = tabBarHeight + 12`). Uses `KeyboardAvoidingView` from `react-native-keyboard-controller` so the UI lifts with the keyboard.
- **Display rules** (strict): coins on home/shop/lesson results only; hearts on lesson screen only; streak on home only; no hyphens/dashes in UI strings; mascot only via `GraflyMascot`.
- **Secrets policy**: never write API keys to files; always use the secrets vault. NVIDIA key was once shared in chat — needs rotation.

## Pending User Actions

1. Disable "Confirm email" in Supabase Auth → Providers → Email (default SMTP is rate-limited).
2. Configure Google OAuth: Google Cloud OAuth Client ID + redirect `https://ylvkpbfzyyruacabgfhc.supabase.co/auth/v1/callback`; Supabase allow list must include `grafly://auth-callback`.
3. Rotate the NVIDIA API key.
4. (Optional) Run the provided SQL to create `critique_designs` table + `critique-designs` storage bucket to swap from local to user-managed designs.

## GitHub

Repo: `Jawad-stable/grafly` (last push commit `4549e3f`).

## Key Commands

- `pnpm --filter @workspace/grafly run dev` — start Expo dev server
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure details.
