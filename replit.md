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
- **Font**: Teshrin (custom TTFs in `assets/fonts/`) — Regular, Medium, Bold. The legacy family names `Nunito_600SemiBold` and `Nunito_800ExtraBold` are aliased in `app/_layout.tsx`'s `useFonts` to Teshrin Medium / Bold so existing `fontFamily: "Nunito_..."` references render Teshrin without per-file edits. `@expo-google-fonts/nunito` is no longer imported.
- **Theme**: Dark-first (`constants/colors.ts`) — background #21263F, primary #00A4FA, accent #E3ED43, pink #FF7BD0
- **Navigation**: Floating frosted-glass tab bar with subtle non-bouncy press feedback + Stack screens with custom transitions (slide_from_right default, fade for tabs/onboarding, slide_from_bottom for lesson/paywall modals)
- **Press feedback**: `components/PressScale.tsx` — Pressable wrapper that scales to 0.97 onPressIn (90ms) then eases back to 1.0 (180ms cubic out). Pure timing curves, no overshoot. Used on all primary CTAs across the app for an editorial, deliberate feel.
- **Editorial design pattern (2026 redesign)**: All major screens (auth, leaderboard, critique, lesson, home, onboarding, paywall, skill tree) use a magazine-like editorial header: small uppercase eyebrow (13px Nunito_800ExtraBold mutedForeground letterSpacing 1.5) above a 38–44px Nunito_800ExtraBold headline (letterSpacing -1). Primary CTAs are near-black pills (bg=foreground, text=background, borderRadius=100, with Ionicons arrow-forward). Horizontal padding standardized to 24 across redesigned screens.
- **Skill tree screen** (`app/(tabs)/tree.tsx`): editorial layout with eyebrow "YOUR JOURNEY" + "Skill tree" headline, a `CoursesButton` pill (height 52, borderRadius 100, card bg, 1px border, Ionicons "apps" 2x2 grid icon + "Courses" label) in the top-right that opens a fullscreen `CoursePickerModal` for course selection, course summary card with progress bar and percentage, "THE PATH" eyebrow above the winding S/Z node tree, and an editorial NodeSheet bottom modal (course color eyebrow + node title headline + 3 stat cards + numbered lesson list "01"/"02" + near-black CTA pill). Reads `courseId` query param via `useLocalSearchParams` to pre-select the right course. All bouncy spring animations removed.
- **Course summary card spec** (top of tree.tsx ScrollView): card padding 22, border radius 24, 1px border. Top row (gap 14, marginBottom 16): 52x52 rounded-square icon (radius 16) with `course.color + "1F"` tint and 26px course icon | column with uppercase "COURSE" eyebrow in `course.color` (letterSpacing 1.6) and 19px title (letterSpacing -0.5, lineHeight 22) | large 30px right-aligned `{progress}%` (letterSpacing -1) in foreground. Below: 13px description (mutedForeground, lineHeight 19, marginBottom 18). Below: 4px thin progress bar (border bg, course.color fill). Caption: "X OF Y LESSONS" 11px ExtraBold mutedForeground letterSpacing 1.2 marginTop 12. Matches editorial reference design.
- **Course picker** (`CoursePickerModal` inside `tree.tsx`): fullscreen slide-in modal with safe-area aware top bar containing "BROWSE" eyebrow + X close button, large 2-line "Choose / a course." headline, and a vertical scrollable list of all courses. Each row shows course icon square + "X% COMPLETE" eyebrow + course name + lesson count. Selected row is filled foreground with a checkmark badge. Tapping a row selects the course and closes the modal.
- **Course routing**: Home page Popular Courses cards each pass their own `courseId` to `/(tabs)/tree` so each course routes to its own tree (previously all defaulted to Design Principles).
- **Home stat cards** (`app/(tabs)/index.tsx` Daily Goal + Rank): editorial side-by-side cards (minHeight 132, padding 18, card bg, 1px border, 22 radius). Daily Goal shows uppercase "DAILY GOAL" eyebrow + large baseline-aligned `count`/`goal` headline (38/18) + thin horizontal primary-color progress bar + "X to go"/"Complete!" meta. Rank shows "YOUR RANK" eyebrow with small bronze-tinted medal accent in top-right, "#" + large rank number headline, then "Bronze division" (#CD7F32) + "View leaderboard" hint. Replaces previous centered CircularProgress + large medal-circle layout. CircularProgress component and its react-native-svg imports removed (no longer used).
- **No-bounce policy**: All UI scale/slide animations use `withTiming` with `Easing.out(Easing.cubic)` — never `withSpring` (which can overshoot). The mascot (`GraflyMascot`) is the one exception — its bounciness is intentional character.
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
- **Editorial visual system** (Apr 2026): light theme is now the default (`themeMode: "light"` in GameContext). Aesthetic = magazine/collage: beige bg (`colors.background` #F5F6FA), big bold headlines (38–56px Nunito_800ExtraBold with negative letter-spacing), uppercase eyebrow labels (`colors.mutedForeground`, letterSpacing 1.5), near-black pill CTAs (`backgroundColor: colors.foreground`, `borderRadius: 100`, arrow-forward Ionicon, text in `colors.background`), rounded course cards on Home using a horizontal `FlatList` carousel with `course.color` backgrounds and `GraflyMascot` collage. Tab bar is theme-aware: near-black with yellow accent active pill in light mode (`app/(tabs)/_layout.tsx`). For text/overlays on vivid colored cards, use `colors.primaryForeground` (always #FFFFFF) and `colors.accentForeground` (always dark navy) rather than raw hex.
- **Secrets policy**: never write API keys to files; always use the secrets vault. NVIDIA key was once shared in chat — needs rotation.

- **Initial route**: `Stack` in `app/_layout.tsx` sets `initialRouteName="(tabs)"` so the AuthGate's onboarding redirect kicks in for new users (otherwise expo-router defaults to the first declared screen — previously `auth`, which made "Welcome back" appear first).
- **Dev-only LogBox filter**: `app/_layout.tsx` ignores the harmless "Unable to activate keep awake" warning that fires on some Android devices (e.g. MIUI/Xiaomi) in Expo Go.

## Android Build (EAS Cloud)

- **Builder**: EAS Build (`eas-cli` is a devDep of `@workspace/grafly`). Auth via the `EXPO_TOKEN` secret (Expo account `jawadkh`).
- **EAS project**: `@jawadkh/grafly`, projectId `9e4690ce-72f5-4ca8-b905-99e34bb71364` (recorded in `app.json` under `extra.eas.projectId` + `owner`).
- **Profiles** (`artifacts/grafly/eas.json`):
  - `development` — internal APK with dev client.
  - `preview` — internal APK for sharing/install (this is what we use).
  - `production` — AAB with `autoIncrement` for Play Store later.
- **Android config** (`app.json`):
  - `android.package = "com.jawadkh.grafly"`.
  - `android.build.abiFilters = ["arm64-v8a"]` — 64-bit ARM only (covers all phones from ~2019, including the user's Xiaomi 11 Lite / Android 14). To re-enable 32-bit phones, add `"armeabi-v7a"`.
  - `expo-build-properties` plugin enables `enableProguardInReleaseBuilds` + `enableShrinkResourcesInReleaseBuilds` for size reduction.
- **Removed packages** (unused, dropped to shrink APK): `expo-glass-effect`, `expo-location`, `expo-symbols`. Kept (in use): `expo-av` (voice service), `expo-image-picker` (onboarding), `expo-blur` (tab bar), `expo-haptics` (lesson/shop).
- **Font shrink**: only Teshrin Regular/Medium/Bold are bundled; the unused weights (Hairline/Thin/ExtraLight/Light/Black .ttfs) still live in `assets/fonts/` but are NOT loaded.
- **Latest APK build**: `cb418a25-99c9-4cb1-9dc0-78ae34e6e16d` — ~88.8 MB (down from 95.4 MB pre-shrink). URL: `https://expo.dev/artifacts/eas/r6JLjhFZHy4CrneUctzd7H.apk`. Build page: `https://expo.dev/accounts/jawadkh/projects/grafly/builds/cb418a25-99c9-4cb1-9dc0-78ae34e6e16d`.
- **Rebuild command** (from `artifacts/grafly`): `pnpm exec eas build --platform android --profile preview --non-interactive`.

## Pending User Actions

1. Disable "Confirm email" in Supabase Auth → Providers → Email (default SMTP is rate-limited).
2. Configure Google OAuth: Google Cloud OAuth Client ID + redirect `https://ylvkpbfzyyruacabgfhc.supabase.co/auth/v1/callback`; Supabase allow list must include `grafly://auth-callback`.
3. Rotate the NVIDIA API key.
4. (Optional) Run the provided SQL to create `critique_designs` table + `critique-designs` storage bucket to swap from local to user-managed designs.
5. (Optional) After verifying icons render correctly in Expo Go post cache-clear, consider switching the EAS preview profile from `internal` to a smaller production-style build with feature trims (drop expo-av/image-picker/blur) if a sub-70MB APK is desired.

## GitHub

Repo: `Jawad-stable/grafly` (last full push commit `64a479b` — merged via `-s ours` because remote had unrelated history).

## Key Commands

- `pnpm --filter @workspace/grafly run dev` — start Expo dev server
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure details.
