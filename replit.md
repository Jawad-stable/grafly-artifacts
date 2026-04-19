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
- **Routes**: `GET /api/health`, `POST /api/critique` (NVIDIA NIM proxy), `POST /api/tts` (ElevenLabs proxy)
- **Env vars**: `NVIDIA_API_KEY`, `ELEVENLABS_API_KEY`, `SESSION_SECRET`
- **NVIDIA model**: `meta/llama-3.3-70b-instruct`
- **ElevenLabs voice ID**: `MFZUKuGQUsGJPQjTS4wC`

## Key Commands

- `pnpm --filter @workspace/grafly run dev` — start Expo dev server
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure details.
