import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VOICE_PREF_KEY = "@grafly_voice_enabled";
const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "";

let currentSound: any = null;

async function isVoiceEnabled(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(VOICE_PREF_KEY);
    return val !== "false";
  } catch {
    return true;
  }
}

async function playAudioBuffer(base64Audio: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play().catch(() => {});
    } catch {}
    return;
  }

  try {
    const { Audio } = await import("expo-av");
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      } catch {}
      currentSound = null;
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: `data:audio/mpeg;base64,${base64Audio}` },
      { shouldPlay: true }
    );
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
      }
    });
  } catch {}
}

async function speak(text: string): Promise<void> {
  const enabled = await isVoiceEnabled();
  if (!enabled) return;
  if (!DOMAIN) return;

  try {
    const cacheKey = `@grafly_voice_${btoa(text).slice(0, 32)}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      await playAudioBuffer(cached);
      return;
    }

    const res = await fetch(`https://${DOMAIN}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return;
    const { audio } = (await res.json()) as { audio: string };
    if (audio) {
      await AsyncStorage.setItem(cacheKey, audio).catch(() => {});
      await playAudioBuffer(audio);
    }
  } catch {}
}

export const voiceService = {
  playStreakCelebration: () =>
    speak("You're on fire! Keep that streak alive."),
  playLevelUp: (level: number) =>
    speak(`Level ${level} unlocked. You're becoming a real designer.`),
  playLessonComplete: () =>
    speak("Lesson done. XP earned. You're moving forward."),
  playCorrectAnswer: () => speak("Exactly right."),
  playWrongAnswer: () => speak("Not quite — let's keep going."),
  playCritiqueReady: () =>
    speak("Your critique is ready. Let's see how you did."),
  playQualityTier: (tier: "excellent" | "good" | "needs_development") => {
    const lines: Record<string, string> = {
      excellent:
        "Outstanding critique. That's expert-level thinking.",
      good: "Solid work. You're developing a strong design eye.",
      needs_development:
        "Good effort. Every critique makes you sharper.",
    };
    return speak(lines[tier] ?? lines.good);
  },
};
