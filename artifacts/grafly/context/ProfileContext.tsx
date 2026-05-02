import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setVoiceEnabled } from "@/services/voiceService";

export type Language = "en" | "ar";

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
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!cancelled) dispatch({ type: "RESTORE", state: migrateState(parsed) });
        } catch (_) {}
      }
      if (!cancelled) setHydrated(true);
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

  // Persist to AsyncStorage after hydration.
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const updateProfile = (data: { username?: string; handle?: string; profilePic?: string }) =>
    dispatch({ type: "UPDATE_PROFILE", ...data });
  const toggleVoice = () => dispatch({ type: "TOGGLE_VOICE" });
  const setTheme = (mode: "light" | "dark") => dispatch({ type: "SET_THEME", mode });
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
