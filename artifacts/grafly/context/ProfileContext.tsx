import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { I18nManager, DevSettings, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setVoiceEnabled } from "@/services/voiceService";

export type Language = "en" | "ar";

// Sync the native RTL flag with the chosen language. Returns true when the
// flag actually changed and the app needs to reload to flip layout. We never
// reload synchronously — callers decide when to trigger DevSettings.reload().
function syncNativeRTL(language: Language): boolean {
  const shouldBeRTL = language === "ar";
  if (I18nManager.isRTL === shouldBeRTL) return false;
  try {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  } catch {
    // forceRTL can throw on web; safe to ignore — web uses CSS direction.
  }
  return true;
}

function reloadApp() {
  // DevSettings.reload works in Expo Go and dev builds. On web (no native
  // bridge) and production standalone builds without expo-updates, fall back
  // to a noop — the user can manually relaunch and the persisted flag will
  // take effect on the next cold start.
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.location.reload();
    return;
  }
  try {
    DevSettings.reload();
  } catch {
    // No-op: standalone production build without expo-updates installed.
  }
}

export interface ProfileState {
  username: string;
  handle: string;
  profilePic: string;
  voiceEnabled: boolean;
  themeMode: "light" | "dark";
  proBannerDismissed: boolean;
  language: Language;
}

type Action =
  | { type: "UPDATE_PROFILE"; username?: string; handle?: string; profilePic?: string }
  | { type: "TOGGLE_VOICE" }
  | { type: "SET_THEME"; mode: "light" | "dark" }
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "DISMISS_PRO_BANNER" }
  | { type: "RESTORE"; state: ProfileState };

const STORAGE_KEY = "grafly_profile";

const initialState: ProfileState = {
  username: "Designer",
  handle: "",
  profilePic: "",
  voiceEnabled: true,
  themeMode: "light",
  proBannerDismissed: false,
  language: "en",
};

function migrateState(persisted: unknown): ProfileState {
  if (typeof persisted !== "object" || persisted === null) return initialState;
  return { ...initialState, ...(persisted as Partial<ProfileState>) };
}

function reducer(state: ProfileState, action: Action): ProfileState {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        username: action.username ?? state.username,
        handle: action.handle ?? state.handle,
        profilePic: action.profilePic ?? state.profilePic,
      };
    case "TOGGLE_VOICE":
      return { ...state, voiceEnabled: !state.voiceEnabled };
    case "SET_THEME":
      return { ...state, themeMode: action.mode };
    case "SET_LANGUAGE":
      return { ...state, language: action.language };
    case "DISMISS_PRO_BANNER":
      return { ...state, proBannerDismissed: true };
    case "RESTORE":
      return { ...initialState, ...action.state };
    default:
      return state;
  }
}

interface ProfileContextType {
  state: ProfileState;
  hydrated: boolean;
  dispatch: React.Dispatch<Action>;
  updateProfile: (data: { username?: string; handle?: string; profilePic?: string }) => void;
  toggleVoice: () => void;
  setTheme: (mode: "light" | "dark") => void;
  setLanguage: (language: Language) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadState() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      let restored: ProfileState = initialState;
      if (saved) {
        try {
          restored = migrateState(JSON.parse(saved));
        } catch (_) {}
      }
      // Sync native RTL flag BEFORE marking hydrated. If the persisted
      // language disagrees with the current I18nManager state (e.g. user
      // picked Arabic last session, app was just cold-launched in LTR),
      // flip the flag and reload so the whole tree mounts in the correct
      // direction.
      if (syncNativeRTL(restored.language)) {
        reloadApp();
        return;
      }
      if (!cancelled) {
        dispatch({ type: "RESTORE", state: restored });
        setHydrated(true);
      }
    }
    loadState();
    return () => { cancelled = true; };
  }, []);

  // Mirror voiceEnabled into the AsyncStorage key voiceService reads.
  // Gated on hydration so the default `true` does not overwrite a persisted
  // `false` before AsyncStorage finishes restoring.
  useEffect(() => {
    if (!hydrated) return;
    setVoiceEnabled(state.voiceEnabled);
  }, [state.voiceEnabled, hydrated]);

  // Persist to AsyncStorage after hydration. After the write resolves,
  // check whether the native RTL flag needs to flip — if so, reload so the
  // entire layout (flexDirection, paddings, margins) re-mounts mirrored.
  // Doing the reload AFTER the persist guarantees the new language survives
  // the relaunch.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        if (syncNativeRTL(state.language)) {
          // Defer one tick to let any pending renders/dispatches settle.
          setTimeout(reloadApp, 50);
        }
      });
    return () => { cancelled = true; };
  }, [state, hydrated]);

  const updateProfile = (data: { username?: string; handle?: string; profilePic?: string }) =>
    dispatch({ type: "UPDATE_PROFILE", ...data });
  const toggleVoice = () => dispatch({ type: "TOGGLE_VOICE" });
  const setTheme = (mode: "light" | "dark") => dispatch({ type: "SET_THEME", mode });
  // setLanguage just dispatches — the persist effect above handles writing
  // to storage and triggering the reload once the write resolves. This
  // avoids any race between two concurrent writes and avoids using a stale
  // closure-captured `state` snapshot.
  const setLanguage = (language: Language) => dispatch({ type: "SET_LANGUAGE", language });

  return (
    <ProfileContext.Provider
      value={{ state, hydrated, dispatch, updateProfile, toggleVoice, setTheme, setLanguage }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
