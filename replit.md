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
    - **AI Critique (`app/(tabs)/critique.tsx`)**: Chat-style UI with a redesigned hero section and composer that floats above the tab bar. Mentor voice (server-side `SYSTEM_PROMPT` in `artifacts/api-server/src/routes/critique.ts`) is warm and friend-like — opens with "Hey!" / "Oh nice!" / "Mmm, love this", uses 1–3 small emojis per reply (🙂 ✨ 💡 🎨 👀 ✍️ 💛 👏 🔥 🌿 ☀️ 📐), and is told to lay messages out as 1–3 short paragraphs separated by blank lines (not one wall of text). Wrap-up replies may use a soft two-line summary pattern ("✨ What's working: …" / "💡 Try next time: …"). Plain text only — no markdown — but `\n\n` paragraph breaks are encouraged and render natively in the bubble. Frontend `OPENER_TEMPLATES` were rewritten to match this voice (warm greeting + question on its own line). Opener bubble height is measured at runtime via `onLayout`, so longer multi-paragraph openers don't break the pre-chat layout math.
      - **Visual identity** (post-2026-rebrand): the screen wears the same drifting brand-squiggle backdrop as home/tree/shop. The "AI MENTOR" eyebrow is a brand-cyan tinted pill with cyanDeep text. The sessions-left chip is a lime gradient (or light-cyan when Pro) with navy text and a colored shadow — both states use a bright range so navy text passes WCAG AA. Mentor identity row shows the bare AiBot star (no halo circle) with the name "Grafly" and a "DESIGN MENTOR · ONLINE" tag in brand cyan / success green. **User bubbles** are a deep-blue gradient (`cyanDeep` → `#1E4D8B`) with **white text** + colored shadow — white passes AA on both stops (~5:1 on cyanDeep, ~10:1 on the navy-blue end). **Assistant bubbles** use a soft cyan-tinted off-white (`#F2FBFE`) with **no left accent stripe and no drop shadow**; the corner closest to the mentor star is always sharp TOP-LEFT because the star always sits ABOVE the bubble — in the mentor identity row for the pre-chat opener, or as a small AiBot avatar rendered just before each assistant message once chatting starts. Typing indicator follows the same shape language (small spinning star above + sharp top-left bubble + no shadow). Reward toast is a lime gradient pill with navy text and a sparkle. Composer send button switches to a cyan gradient with a colored shadow when input is non-empty.
    - **Onboarding**: A 7-step editorial flow. The final-step "Skip for now" exit is rendered in `colors.foreground` with an underline (not muted) so users recognize it as a real exit path next to the prominent account-creation CTA.
    - **Lesson exit guard (`app/lesson.tsx`)**: A central `confirmExit` callback wraps both close-button presses and the Android hardware-back press. Mid-lesson it shows a confirm dialog ("Exit lesson? Your progress for this lesson will be lost."); on the summary or pre-question intro card it exits silently. Out-of-hearts uses a ref-tracked `setTimeout` that pushes the user to the paywall after a 1.6s "Out of hearts" overlay, and an unmount cleanup + early-clear in `confirmExit` prevents the redirect from firing after the user has navigated away.
    - **Mascot**: `GraflyMascot` component (`components/GraflyMascot.tsx`) with various states. The Critique tab keeps the original star-shape `AiBot` avatar (rendered from `AI_BOT` / `assets/ai/bot.png`) for the mentor identity row and as the spinning typing indicator — that starfish/fan icon is the canonical mentor avatar and should not be swapped out for the octopus mascot.
    - **Brand Decoration**: `components/BrandSquiggle.tsx` exposes the curvy tube/wave/loop motif from the 2026 identity sheet as a low-opacity SVG that can be dropped onto any backdrop. `HomeBackdrop` weaves three drifting squiggle variants (loop, tube, wave) at 6–7% alpha behind content so the brand voice reads as watermark texture, not foreground noise. `TreeBackdrop` was simplified from ~20 ambient elements (sparkles, dot clusters, diamonds, twinkles) down to two soft course-color glows + three drifting BrandSquiggle motifs — much more professional and brand-recognizable. The "See what you'll learn" course-welcome card on the design-principles tree is a vibrant filled card in the course color with a sparkle icon, larger headline, brand-squiggle flourishes, and a circular arrow chip. The **Shop screen** uses the same brand watermark backdrop (cyan loop + pink tube + lime wave at ~8% alpha) and renders each item as a vibrant filled card in its `iconColor` — title/subtitle/icon recolored via `onBrand()` for AA-safe contrast, with a subtle BrandSquiggle flourish in the corner of every card. Coin balance pill matches the home-tab pattern (lime gradient with navy text). Section headings get a small brand-color dot for visual anchoring. **Decorative card blobs replaced with squiggles**: the home-screen course-card "DriftingBlobs" component (3 large drifting circles per card) and the course-intro hero card's white circle blob were both replaced with BrandSquiggle motifs (loop + tube + loop on the home cards using the card's `lightTint`/`deepTint`; a single loop in `onCourse` color on the course-intro hero). The squiggle's built-in `drift` + `delay` props provide the same per-card desync the manual reanimated plumbing used to do, so neighboring cards still breathe out of phase.
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
- **Expo Packages (in use)**: `expo-av`, `expo-image-picker`, `expo-blur`, `expo-haptics`, `expo-sharing` (dev screenshot share sheet on native).
- **Screen capture**: `react-native-view-shot` powers the floating dev-only screenshot button (`components/DevScreenshotButton.tsx`, mounted in `app/_layout.tsx`). Visible only when `__DEV__`. Web → triggers a PNG download; iOS/Android → opens the native share sheet. The capture target is a `View ref` with `collapsable={false}` wrapping `<RootLayoutNav />`.
- **Build Tool**: EAS Build (`eas-cli`) for Android builds.
