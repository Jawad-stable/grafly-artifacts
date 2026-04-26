# Overview

Grafly is a gamified design education mobile app built with Expo (React Native) within a pnpm monorepo. Its primary purpose is to provide an engaging learning experience through interactive lessons, AI critique, and a structured skill tree progression. The project aims to deliver a high-quality, accessible, and visually appealing educational platform for design principles.

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
- **Theming**: Dark-first initially, but now defaults to light theme. Uses `constants/colors.ts` for a WCAG 2.1 AA compliant color palette aligned to the Grafly 2026 brand: vibrant cyan `#00A4FA` (primary), lime `#E3ED43` (accent), pink `#FF7BD0`, navy `#21263F` (foreground/dark), off-white `#F5F6FA` (light bg). On primary cyan fills, foreground text is brand navy (AA-safe ~5.9:1); a deeper cyan `#0078BB` (`primaryDeep`) is available when white text is needed. All hex values must use tokens from this file (or the exposed `colors.brand` map). `constants/contrast.ts` provides utility functions for contrast ratio checks.
- **Typography**: Custom Teshrin fonts (Regular, Medium, Bold) are used.
- **Navigation**:
    - Floating frosted-glass tab bar with subtle press feedback.
    - Stack screens with custom transitions (slide_from_right default, fade for tabs/onboarding, slide_from_bottom for modals).
    - `initialRouteName` is `(tabs)` to ensure AuthGate handles onboarding redirects correctly.
- **UI/UX Patterns**:
    - **Editorial Design (2026 Redesign)**: Magazine-like headers with small uppercase eyebrows and large headlines. Primary CTAs are near-black pills. Horizontal padding standardized to 24px.
    - **Bottom Navigation**: Premium floating pill design with five icon-only tabs, animating on focus.
    - **Press Feedback**: `PressScale.tsx` for consistent, non-bouncy scaling feedback on CTAs.
- **Core Screens & Components**:
    - **Skill Tree (`app/(tabs)/tree.tsx`)**: Editorial layout with "YOUR JOURNEY" eyebrow, "Skill tree" headline, `CoursesButton` for course selection, course summary card, and a winding S/Z node tree. Node details are shown in an editorial `NodeSheet` bottom modal.
    - **Course Picker (`CoursePickerModal`)**: Fullscreen slide-in modal for course selection.
    - **Home Screen (`app/(tabs)/index.tsx`)**: Includes editorial stat cards (Daily Goal, Rank) and a horizontal `FlatList` carousel of premium course cards.
    - **AI Critique (`app/(tabs)/critique.tsx`)**: Chat-style UI with a redesigned hero section and composer that floats above the tab bar.
    - **Onboarding**: A 7-step editorial flow.
    - **Mascot**: `GraflyMascot` component (`components/GraflyMascot.tsx`) with various states. The Critique tab keeps the original star-shape `AiBot` avatar (rendered from `AI_BOT` / `assets/ai/bot.png`) for the mentor identity row and as the spinning typing indicator — that starfish/fan icon is the canonical mentor avatar and should not be swapped out for the octopus mascot.
    - **Brand Decoration**: `components/BrandSquiggle.tsx` exposes the curvy tube/wave/loop motif from the 2026 identity sheet as a low-opacity SVG that can be dropped onto any backdrop. `HomeBackdrop` weaves three drifting squiggle variants (loop, tube, wave) at 6–7% alpha behind content so the brand voice reads as watermark texture, not foreground noise.
    - **Brand Chips**: Home tab streak chip uses the brand cyan→cyanDeep gradient with brand-navy text/icon; coin chip uses lime→deeper-lime with brand-navy text. Both follow the brand sheet's canonical "navy on bright color" pairing (~5.9:1 AA pass) — white text/icons would fail contrast on the lighter cyan/lime stops.
- **Gamification**: Includes XP/level progression, coins, hearts (lesson only), streak (home only), shields, and XP boosters.
- **Lesson Engine**: Supports 12 question types (7 originals plus `spot_bad_design`, `choose_better_design`, `drag_drop_layout`, `five_second_test`, `find_the_cta`), with lesson data stored in `constants/lessons.ts`. Lessons can carry an optional `intro` (headline/body + good-vs-bad scene) shown via `LessonIntroCard` before the first question. New mini-game renderers + scene primitives live in `components/LessonScenes.tsx` and use only RN primitives + react-native-svg + reanimated.
- **Design Principles Course**: Six modules (Contrast, Typography, Spacing, Color, Hierarchy, UX Basics), each with 3-5 lessons. Players reach it via the new `app/course-intro.tsx` welcome screen (linked from a "NEW · COURSE WELCOME" card in the tree header for design-principles only). Each node sheet shows a per-module progress ring + completed-lesson checkmarks. Finishing the last lesson of a module triggers a `ModuleCompleteCelebration` banner on the summary screen.
- **Auth**: Onboarding-first authentication with no account required initially. AuthGate manages declarative routing based on `onboardingComplete` state. Google Sign-In is implemented with specific contract requirements for success handling. Hydration gate ensures `GameContext` is loaded before app renders.

## API Server (Express 5)
- Provides routes for health checks, AI critique (Gemma proxy), design retrieval, and TTS (ElevenLabs proxy).
- Utilizes environment variables for API keys and session secrets.

# External Dependencies

- **Monorepo Tool**: pnpm workspaces
- **Frontend Framework**: Expo (React Native), expo-router v6
- **Backend Framework**: Express 5
- **Database**: Supabase (for `game_state` sync and `critique_designs`)
- **AI/ML**: NVIDIA NIM (for AI Critique, specifically `google/gemma-3-27b-it`)
- **Text-to-Speech**: ElevenLabs (voice ID `MFZUKuGQUsGJPQjTS4wC`)
- **OAuth**: Google OAuth (via `supabase.auth.signInWithOAuth`, `expo-web-browser`, `expo-linking`)
- **Fonts**: Teshrin (custom TTFs)
- **UI Libraries**:
    - `expo-linear-gradient`
    - `expo-blur`
    - `react-native-keyboard-controller`
- **Expo Packages (in use)**: `expo-av`, `expo-image-picker`, `expo-blur`, `expo-haptics`.
- **Build Tool**: EAS Build (`eas-cli`) for Android builds.
