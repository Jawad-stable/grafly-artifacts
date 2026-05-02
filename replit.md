# Overview

Grafly is a gamified design education mobile app built with Expo (React Native) within a pnpm monorepo. It provides an engaging learning experience through interactive lessons, AI critique, and a structured skill tree progression. The project aims to deliver a high-quality, accessible, and visually appealing educational platform for design principles, with a focus on editorial design aesthetics and market potential in mobile learning.

# User Preferences

- All UI scale/slide animations should use `withTiming` with `Easing.out(Easing.cubic)` – never `withSpring` (which can overshoot), except for the mascot's bounciness which is intentional.
- No hyphens or dashes in UI strings.
- Coins should be shown on home/shop/lesson results only.
- Hearts should be shown on the lesson screen only.
- Streak should be shown on the home screen only.
- The mascot should only be displayed via the `GraflyMascot` component.
- The default theme is light (`themeMode: "light"` in GameContext).
- I prefer an editorial design aesthetic, reminiscent of magazines and collages.
- All primary CTAs across the app should use `PressScale.tsx` for consistent press feedback.
- I want iterative development; ask before making major changes.

# System Architecture

## Monorepo Structure
The project is a pnpm workspace monorepo using TypeScript, comprising the Grafly mobile app (`artifacts/grafly`) and an API server (`artifacts/api-server`).

## Grafly Mobile App (Expo/React Native)
- **Framework**: Expo (React Native), expo-router v6.
- **State Management**: React Context with AsyncStorage for persistence and Supabase for cloud sync (`GameContext.tsx`).
- **Theming**: Defaults to light theme, using a WCAG 2.1 AA compliant color palette from `constants/colors.ts` and `constants/contrast.ts` for utility functions.
- **Typography**: Custom Teshrin fonts (Regular, Medium, Bold).
- **Navigation**:
    - Floating frosted-glass tab bar with five icon-only tabs.
    - Stack screens with custom transitions (slide_from_right default, fade for tabs/onboarding, slide_from_bottom for modals).
    - `initialRouteName` is `(tabs)`.
- **UI/UX Patterns**:
    - **Editorial Design**: Magazine-like headers, near-black pill primary CTAs, 24px horizontal padding.
    - **Press Feedback**: `PressScale.tsx` for consistent scaling.
- **Core Screens**:
    - **Skill Tree (`app/(tabs)/tree.tsx`)**: Editorial layout with node tree, `CoursesButton`, and `NodeSheet` modal.
    - **Course Picker (`CoursePickerModal`)**: Fullscreen slide-in modal.
    - **Home Screen (`app/(tabs)/index.tsx`)**: Editorial stat cards and a horizontal `FlatList` of premium course cards.
    - **AI Critique (`app/(tabs)/critique.tsx`)**: Chat-style UI with redesigned hero, composer, and a warm, friend-like mentor voice (server-side `SYSTEM_PROMPT`). Visual identity includes a brand-squiggle backdrop, tinted pills for eyebrows, and distinct user/assistant bubble styling to ensure AA contrast. The `AiBot` star is the canonical mentor avatar, not the octopus mascot.
    - **Onboarding**: A 7-step editorial flow with a clear "Skip for now" exit option.
    - **Lesson exit guard (`app/lesson.tsx`)**: `confirmExit` callback for close/back presses, handles mid-lesson progress loss and out-of-hearts redirects.
    - **Mascot**: `GraflyMascot` component with various states.
    - **Brand Decoration**: `BrandSquiggle.tsx` for low-opacity SVG motifs as watermark textures, replacing previous decorative layers for performance and brand consistency. Color pairing rules enforce AA contrast, particularly for text on colored surfaces, through gradient adjustments and `onBrand()` utility.
- **Gamification**: XP/level progression, coins, hearts, streak, shields, XP boosters.
- **Lesson Engine**: Supports 12 question types with data in `constants/lessons.ts`. Includes optional `intro` cards and `ModuleCompleteCelebration` banners.
- **Design Principles Course**: Six modules with 3-5 lessons each, accessible via `app/course-intro.tsx`.
- **Auth**: Onboarding-first authentication, Google Sign-In, and `AuthGate` for routing based on `onboardingComplete` state. Hydration gate ensures `GameContext` is loaded.
- **Internationalization (English / Arabic)**: Lightweight custom i18n in `lib/i18n.ts` (single flat dict, ~5 KB) plus `hooks/useT.ts` returning `{ t, lang, isRTL, dir }`. Language is stored on `ProfileContext` (`language: "en" | "ar"`) and persisted via the existing AsyncStorage flow. The first onboarding step is a language picker (English / العربية). Translation strategy is chrome-only: UI shell, onboarding, profile/settings, and auth screens are translated; lesson curriculum content remains English. The Profile tab has a `SETTINGS` section with Language, Theme (light/dark), and Voice rows.
- **Full RTL when Arabic is selected**: `ProfileContext` calls `I18nManager.allowRTL` + `I18nManager.forceRTL` whenever the persisted language flips, then triggers a JS bundle reload (`window.location.reload()` on web, `DevSettings.reload()` on native). The reload is fired from the persist effect AFTER the AsyncStorage write resolves so the new language survives the relaunch. On the next mount, `I18nManager.isRTL` already matches the persisted language, so no second reload happens. After forceRTL, React Native auto-mirrors flexDirection / margins / paddings / text alignment across every screen. Arrow icons (`arrow-back` / `arrow-forward`) are still flipped manually via `isRTL` because icon images are not auto-mirrored. The `dir` style spread from `useT` remains as a harmless explicit override useful on web (where forceRTL is a no-op).

## API Server (Express 5)
- Provides routes for health checks, AI critique (Gemma proxy), design retrieval, and TTS (ElevenLabs proxy).
- Utilizes environment variables for API keys and session secrets.

# External Dependencies

- **Monorepo Tool**: pnpm workspaces
- **Frontend Framework**: Expo (React Native), expo-router v6
- **Backend Framework**: Express 5
- **Database**: Supabase (for `game_state` sync and `critique_designs`)
- **AI/ML**: NVIDIA NIM (for AI Critique, currently `meta/llama-4-maverick-17b-128e-instruct` for multimodal vision). Critique design images are served publicly via `express.static` from `artifacts/api-server/assets/designs/`.
- **Text-to-Speech**: ElevenLabs (voice ID `MFZUKuGQUsGJPQjTS4wC`)
- **OAuth**: Google OAuth (via `supabase.auth.signInWithOAuth`, `expo-web-browser`, `expo-linking`)
- **Fonts**: Teshrin (custom TTFs)
- **UI Libraries**:
    - `expo-linear-gradient`
    - `expo-blur`
    - `react-native-keyboard-controller`
- **Expo Packages**: `expo-av`, `expo-image-picker`, `expo-blur`, `expo-haptics`, `expo-sharing`.
- **Screen capture**: `react-native-view-shot` for dev-only screenshot functionality.
- **Build Tool**: EAS Build (`eas-cli`) for Android builds.