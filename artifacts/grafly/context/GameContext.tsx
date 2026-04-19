import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/context/AuthContext";

export type PlacementLevel =
  | "novice"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface GameState {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  streakMax: number;
  lastStreakDate: string;
  hearts: number;
  heartsLastRefill: string;
  streakShields: number;
  isPro: boolean;
  placementLevel: PlacementLevel;
  weeklyXP: number;
  weekStart: string;
  coursesCompleted: number;
  voiceEnabled: boolean;
  onboardingComplete: boolean;
  completedLessons: string[];
  username: string;
  showXPPopup: boolean;
  xpPopupAmount: number;
  showLevelUp: boolean;
  newLevel: number;
  xpBoosterActive: boolean;
  xpBoosterExpiry: string;
  themeMode: "light" | "dark";
  handle: string;
  profilePic: string;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  let required = 100;
  let total = 0;
  while (total + required <= xp) {
    total += required;
    level++;
    required = Math.floor(required * 1.3);
  }
  return level;
}

export function getXPProgress(xp: number): {
  current: number;
  required: number;
  level: number;
} {
  let level = 1;
  let required = 100;
  let total = 0;
  while (total + required <= xp) {
    total += required;
    level++;
    required = Math.floor(required * 1.3);
  }
  return { current: xp - total, required, level };
}

type Action =
  | { type: "ADD_XP"; amount: number }
  | { type: "ADD_COINS"; amount: number }
  | { type: "USE_COINS"; amount: number }
  | { type: "LOSE_HEART" }
  | { type: "REFILL_HEARTS" }
  | { type: "INCREMENT_STREAK" }
  | { type: "SET_PLACEMENT_LEVEL"; level: PlacementLevel }
  | { type: "COMPLETE_LESSON"; lessonId: string }
  | { type: "COMPLETE_ONBOARDING"; username: string; handle: string; profilePic: string }
  | { type: "UPDATE_PROFILE"; username?: string; handle?: string; profilePic?: string }
  | { type: "TOGGLE_VOICE" }
  | { type: "PURCHASE_SHIELD" }
  | { type: "ACTIVATE_BOOSTER" }
  | { type: "SET_PRO"; isPro: boolean }
  | { type: "DISMISS_XP_POPUP" }
  | { type: "DISMISS_LEVEL_UP" }
  | { type: "SET_THEME"; mode: "light" | "dark" }
  | { type: "RESTORE"; state: GameState };

const STORAGE_KEY = "@grafly_v1_state";

const initialState: GameState = {
  xp: 0,
  coins: 50,
  level: 1,
  streak: 0,
  streakMax: 0,
  lastStreakDate: "",
  hearts: 5,
  heartsLastRefill: new Date().toISOString(),
  streakShields: 0,
  isPro: false,
  placementLevel: "novice",
  weeklyXP: 0,
  weekStart: getWeekStart(),
  coursesCompleted: 0,
  voiceEnabled: true,
  onboardingComplete: false,
  completedLessons: [],
  username: "Designer",
  showXPPopup: false,
  xpPopupAmount: 0,
  showLevelUp: false,
  newLevel: 1,
  xpBoosterActive: false,
  xpBoosterExpiry: "",
  themeMode: "dark",
  handle: "",
  profilePic: "",
};

function stripUIState(state: GameState) {
  const { showXPPopup, xpPopupAmount, showLevelUp, ...rest } = state;
  return rest;
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "ADD_XP": {
      const isBoosterActive =
        state.xpBoosterActive && new Date(state.xpBoosterExpiry) > new Date();
      const earned = isBoosterActive ? action.amount * 2 : action.amount;
      const newXP = state.xp + earned;
      const newLevel = getLevelFromXP(newXP);
      const leveledUp = newLevel > state.level;
      const bonusCoins = leveledUp ? 25 : 0;
      return {
        ...state,
        xp: newXP,
        coins: state.coins + bonusCoins,
        level: newLevel,
        weeklyXP: state.weeklyXP + earned,
        showXPPopup: true,
        xpPopupAmount: earned,
        showLevelUp: leveledUp,
        newLevel: leveledUp ? newLevel : state.newLevel,
      };
    }
    case "ADD_COINS":
      return { ...state, coins: state.coins + action.amount };
    case "USE_COINS":
      return { ...state, coins: Math.max(0, state.coins - action.amount) };
    case "LOSE_HEART":
      return { ...state, hearts: Math.max(0, state.hearts - 1) };
    case "REFILL_HEARTS":
      return {
        ...state,
        hearts: 5,
        heartsLastRefill: new Date().toISOString(),
      };
    case "INCREMENT_STREAK": {
      const today = new Date().toDateString();
      if (state.lastStreakDate === today) return state;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive =
        state.lastStreakDate === yesterday.toDateString();
      const newStreak = isConsecutive ? state.streak + 1 : 1;
      const milestoneCoins =
        newStreak === 7 ? 50 : newStreak === 30 ? 100 : newStreak === 100 ? 200 : 0;
      return {
        ...state,
        streak: newStreak,
        streakMax: Math.max(state.streakMax, newStreak),
        lastStreakDate: today,
        coins: state.coins + milestoneCoins,
      };
    }
    case "SET_PLACEMENT_LEVEL":
      return { ...state, placementLevel: action.level };
    case "COMPLETE_LESSON":
      if (state.completedLessons.includes(action.lessonId)) return state;
      return {
        ...state,
        completedLessons: [...state.completedLessons, action.lessonId],
      };
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        onboardingComplete: true,
        username: action.username,
        handle: action.handle,
        profilePic: action.profilePic,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        username: action.username ?? state.username,
        handle: action.handle ?? state.handle,
        profilePic: action.profilePic ?? state.profilePic,
      };
    case "TOGGLE_VOICE":
      return { ...state, voiceEnabled: !state.voiceEnabled };
    case "PURCHASE_SHIELD":
      return {
        ...state,
        streakShields: Math.min(3, state.streakShields + 1),
        coins: state.coins - 50,
      };
    case "ACTIVATE_BOOSTER": {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      return {
        ...state,
        xpBoosterActive: true,
        xpBoosterExpiry: expiry.toISOString(),
        coins: state.coins - 200,
      };
    }
    case "SET_PRO":
      return { ...state, isPro: action.isPro };
    case "DISMISS_XP_POPUP":
      return { ...state, showXPPopup: false, xpPopupAmount: 0 };
    case "DISMISS_LEVEL_UP":
      return { ...state, showLevelUp: false };
    case "SET_THEME":
      return { ...state, themeMode: action.mode };
    case "RESTORE":
      return { ...initialState, ...action.state };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  hydrated: boolean;
  dispatch: React.Dispatch<Action>;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  useCoins: (amount: number) => boolean;
  loseHeart: () => void;
  completeLesson: (lessonId: string, xp: number, coins: number) => void;
  completeOnboarding: (
    username: string,
    placementLevel: PlacementLevel,
    handle?: string,
    profilePic?: string,
  ) => void;
  updateProfile: (data: { username?: string; handle?: string; profilePic?: string }) => void;
  toggleVoice: () => void;
  purchaseShield: () => boolean;
  purchaseBooster: () => boolean;
  refillHearts: () => boolean;
  setTheme: (mode: "light" | "dark") => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useAuth();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Load state: prefer Supabase when signed in, fallback to AsyncStorage
  useEffect(() => {
    async function loadState() {
      if (user) {
        const { data, error } = await supabase
          .from("game_state")
          .select("state")
          .eq("user_id", user.id)
          .single();
        if (!error && data?.state) {
          dispatch({ type: "RESTORE", state: { ...initialState, ...data.state } });
          initializedRef.current = true;
          setHydrated(true);
          return;
        }
      }
      // Fallback to AsyncStorage
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<GameState>;
          dispatch({ type: "RESTORE", state: { ...initialState, ...parsed } });
        } catch (_) {}
      }
      initializedRef.current = true;
      setHydrated(true);
    }
    initializedRef.current = false;
    setHydrated(false);
    loadState();
  }, [user?.id]);

  // Sync state changes to AsyncStorage + Supabase (debounced 1.5s)
  useEffect(() => {
    if (!initializedRef.current) return;
    const toSave = stripUIState(state);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

    if (user) {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(async () => {
        await supabase.from("game_state").upsert({
          user_id: user.id,
          state: toSave,
          updated_at: new Date().toISOString(),
        });
      }, 1500);
    }
  }, [state, user?.id]);

  const addXP = (amount: number) => dispatch({ type: "ADD_XP", amount });
  const addCoins = (amount: number) => dispatch({ type: "ADD_COINS", amount });

  const useCoins = (amount: number): boolean => {
    if (state.coins < amount) return false;
    dispatch({ type: "USE_COINS", amount });
    return true;
  };

  const loseHeart = () => dispatch({ type: "LOSE_HEART" });

  const completeLesson = (lessonId: string, xp: number, coins: number) => {
    dispatch({ type: "COMPLETE_LESSON", lessonId });
    dispatch({ type: "INCREMENT_STREAK" });
    addXP(xp);
    addCoins(coins);
    const isFirstOfDay = state.lastStreakDate !== new Date().toDateString();
    if (isFirstOfDay) addCoins(10);
  };

  const completeOnboarding = (
    username: string,
    placementLevel: PlacementLevel,
    handle: string = "",
    profilePic: string = "",
  ) => {
    dispatch({ type: "SET_PLACEMENT_LEVEL", level: placementLevel });
    dispatch({ type: "COMPLETE_ONBOARDING", username, handle, profilePic });
  };

  const updateProfile = (data: { username?: string; handle?: string; profilePic?: string }) =>
    dispatch({ type: "UPDATE_PROFILE", ...data });

  const toggleVoice = () => dispatch({ type: "TOGGLE_VOICE" });

  const purchaseShield = (): boolean => {
    if (state.coins < 50 || state.streakShields >= 3) return false;
    dispatch({ type: "PURCHASE_SHIELD" });
    return true;
  };

  const purchaseBooster = (): boolean => {
    if (state.coins < 200) return false;
    dispatch({ type: "ACTIVATE_BOOSTER" });
    return true;
  };

  const setTheme = (mode: "light" | "dark") => dispatch({ type: "SET_THEME", mode });

  const refillHearts = (): boolean => {
    if (state.coins < 100) return false;
    dispatch({ type: "USE_COINS", amount: 100 });
    dispatch({ type: "REFILL_HEARTS" });
    return true;
  };

  return (
    <GameContext.Provider
      value={{
        state,
        hydrated,
        dispatch,
        addXP,
        addCoins,
        useCoins,
        loseHeart,
        completeLesson,
        completeOnboarding,
        toggleVoice,
        purchaseShield,
        purchaseBooster,
        refillHearts,
        setTheme,
        updateProfile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
