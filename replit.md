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
- **Theme**: Dark-first (`constants/colors.ts`) — background #0F0F14, primary #00A4FA, accent #E3ED43, pink #FF7BD0
- **Navigation**: Bottom tabs (Home, Learn, Critique, Shop, Profile) + Stack screens (lesson, leaderboard, paywall, onboarding)
- **Screens**: Onboarding (4-step with placement test), Home, Skill Tree, AI Critique, Shop, Profile, Lesson Engine, Leaderboard, Paywall
- **Services**: `services/voiceService.ts` (ElevenLabs via API), `services/aiCritique.ts` (NVIDIA NIM via API)
- **Gamification**: XP/level progression, coins, 5 hearts, streak tracking, streak shields, XP booster
- **Lesson data**: 5 courses × multiple skill nodes × multiple lessons (`constants/lessons.ts`); 10-question placement test

### API Server (`artifacts/api-server`)
- **Routes**: `GET /api/health`, `POST /api/critique` (NVIDIA NIM proxy), `POST /api/tts` (ElevenLabs proxy)
- **Env vars**: `NVIDIA_API_KEY`, `ELEVENLABS_API_KEY`, `SESSION_SECRET`
- **NVIDIA model**: `meta/llama-3.3-70b-instruct`
- **ElevenLabs voice ID**: `MFZUKuGQUsGJPQjTS4wC`

## Key Commands

- `pnpm --filter @workspace/grafly run dev` — start Expo dev server
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure details.
