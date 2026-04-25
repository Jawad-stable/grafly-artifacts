import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { Icon, type IconName } from "@/components/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import type { PlacementLevel } from "@/context/GameContext";
import { shuffleOptions } from "@/utils/adaptive";
import { PLACEMENT_QUESTIONS } from "@/constants/lessons";
import { GraflyMascot } from "@/components/GraflyMascot";
import { LOGO } from "@/constants/assets";
import type { MascotState } from "@/constants/assets";
import { AText } from "@/components/AText";
import { PressScale } from "@/components/PressScale";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EASE = Easing.out(Easing.cubic);
const fadeIn = (delay = 0, duration = 300) =>
  FadeIn.delay(delay).duration(duration).easing(EASE);
const fadeInDown = (duration = 280) =>
  FadeInDown.duration(duration).easing(EASE);

type Step =
  | "welcome"
  | "name"
  | "goal"
  | "level"
  | "time"
  | "placement"
  | "results"
  | "signup";

type AuthMode = "signin" | "signup" | "reset";

type GoalId = "basics" | "improve" | "portfolio" | "career";
type SelfLevelId = "beginner" | "intermediate" | "advanced";
type TimeId = "5" | "10" | "15";

type GoalTone = "primary" | "success" | "pink" | "accent";

const GOALS: { id: GoalId; label: string; icon: IconName; tone: GoalTone }[] = [
  { id: "basics", label: "Learn design basics", icon: "book-outline", tone: "primary" },
  { id: "improve", label: "Improve my skills", icon: "trending-up", tone: "success" },
  { id: "portfolio", label: "Build a portfolio", icon: "briefcase-outline", tone: "pink" },
  { id: "career", label: "Start a design career", icon: "rocket-outline", tone: "accent" },
];

function getToneColor(palette: ReturnType<typeof useColors>, tone: GoalTone): string {
  switch (tone) {
    case "primary":
      return palette.primary;
    case "success":
      return palette.success;
    case "pink":
      return palette.pink;
    case "accent":
      return palette.accent;
  }
}

const LEVELS: { id: SelfLevelId; label: string; desc: string; emoji: string }[] = [
  { id: "beginner", label: "Beginner", desc: "Just getting started", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "I know the basics", emoji: "🚀" },
  { id: "advanced", label: "Advanced", desc: "I have real experience", emoji: "⚡" },
];

const TIMES: { id: TimeId; label: string; desc: string; icon: IconName }[] = [
  { id: "5", label: "5 min", desc: "A quick warmup", icon: "flash-outline" },
  { id: "10", label: "10 min", desc: "A solid daily habit", icon: "time-outline" },
  { id: "15", label: "15+ min", desc: "Serious progress", icon: "trophy-outline" },
];

function getPlacementLevel(score: number, total: number): PlacementLevel {
  const pct = score / total;
  if (pct >= 0.9) return "expert";
  if (pct >= 0.75) return "advanced";
  if (pct >= 0.55) return "intermediate";
  if (pct >= 0.35) return "beginner";
  return "novice";
}

const LEVEL_LABELS: Record<PlacementLevel, string> = {
  novice: "Novice Designer",
  beginner: "Beginner Designer",
  intermediate: "Intermediate Designer",
  advanced: "Advanced Designer",
  expert: "Expert Designer",
};

function getLevelColor(
  palette: ReturnType<typeof useColors>,
  level: PlacementLevel,
): string {
  switch (level) {
    case "novice":
      return palette.mutedForeground;
    case "beginner":
      return palette.primary;
    case "intermediate":
      return palette.success;
    case "advanced":
      return palette.accent;
    case "expert":
      return palette.pink;
  }
}

const LEVEL_DESC: Record<PlacementLevel, string> = {
  novice: "Every expert was once a beginner. Your journey starts now.",
  beginner: "You have the foundations. Let us build on them.",
  intermediate: "Solid knowledge. Time to go deeper.",
  advanced: "Impressive! You will move fast through the early levels.",
  expert: "You already think like a designer. Let us refine your craft.",
};

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, completeOnboarding, setTheme } = useGame();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const [step, setStep] = useState<Step>("welcome");
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [selfLevel, setSelfLevel] = useState<SelfLevelId | null>(null);
  const [dailyTime, setDailyTime] = useState<TimeId | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answerSelected, setAnswerSelected] = useState<number | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState(false);
  const [placementResult, setPlacementResult] = useState<PlacementLevel>("novice");
  const [mascotState, setMascotState] = useState<MascotState>("idle");

  // Auth panel (signup step) state
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  const placementProgress = useSharedValue(0);

  React.useEffect(() => {
    if (step === "placement") {
      placementProgress.value = withTiming(
        ((currentQ + 1) / PLACEMENT_QUESTIONS.length) * 100,
        { duration: 400, easing: EASE },
      );
    }
  }, [currentQ, step]);

  const placementQ = useMemo(
    () => shuffleOptions(PLACEMENT_QUESTIONS[currentQ]),
    [currentQ],
  );

  const placementProgressStyle = useAnimatedStyle(() => ({
    width: `${placementProgress.value}%` as any,
  }));

  function handleAnswer(answer: number | boolean) {
    if (showFeedback) return;
    setAnswerSelected(answer);
    setShowFeedback(true);
    const q = PLACEMENT_QUESTIONS[currentQ];
    const correct = q.type === "true_false" ? answer === q.correctBool : answer === q.correctIndex;
    setLastWasCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      setMascotState("correct");
    } else {
      setMascotState("wrong");
    }
  }

  function handleContinueQuestion() {
    const nextQ = currentQ + 1;
    setMascotState("think");
    if (nextQ >= PLACEMENT_QUESTIONS.length) {
      const level = getPlacementLevel(score, PLACEMENT_QUESTIONS.length);
      setPlacementResult(level);
      setStep("results");
      setMascotState("celebrate");
    } else {
      setCurrentQ(nextQ);
      setAnswerSelected(null);
      setShowFeedback(false);
    }
  }

  function handleSkipPlacement() {
    setPlacementResult("novice");
    setStep("results");
    setMascotState("celebrate");
  }

  const displayName = username.trim() || "Designer";

  function finishWithoutAccount() {
    completeOnboarding(displayName, placementResult, "", "");
  }

  async function finishWithGoogle() {
    setAuthError("");
    setAuthNotice("");
    setGoogleBusy(true);
    const { error, completed } = await signInWithGoogle();
    setGoogleBusy(false);
    if (error) {
      setAuthError(error);
      return;
    }
    if (!completed) return;
    completeOnboarding(displayName, placementResult, "", "");
  }

  async function finishWithEmail() {
    setAuthError("");
    setAuthNotice("");
    if (authMode === "reset") {
      if (!authEmail.trim()) {
        setAuthError("Please enter your email.");
        return;
      }
      setAuthBusy(true);
      const { error } = await resetPassword(authEmail.trim());
      setAuthBusy(false);
      if (error) {
        setAuthError(error);
        return;
      }
      setAuthNotice("Check your email for a reset link.");
      return;
    }
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please enter your email and password.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    setAuthBusy(true);
    if (authMode === "signin") {
      const { error } = await signIn(authEmail.trim(), authPassword);
      setAuthBusy(false);
      if (error) {
        setAuthError(error);
        return;
      }
      completeOnboarding(displayName, placementResult, "", "");
    } else {
      const { error, needsConfirmation } = await signUp(authEmail.trim(), authPassword);
      setAuthBusy(false);
      if (error) {
        setAuthError(error);
        return;
      }
      if (needsConfirmation) {
        setAuthNotice("We sent a confirmation link to " + authEmail.trim() + ". Verify your email then sign in.");
        setAuthMode("signin");
        setAuthPassword("");
        return;
      }
      completeOnboarding(displayName, placementResult, "", "");
    }
  }

  function switchAuthMode(next: AuthMode) {
    setAuthMode(next);
    setAuthError("");
    setAuthNotice("");
  }

  const padTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const padBottom = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  // ============================================================
  // 1. WELCOME
  // ============================================================
  if (step === "welcome") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          {/* Theme toggle pill */}
          <Animated.View
            entering={fadeIn(100)}
            style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 24, paddingTop: 8 }}
          >
            <View style={{
              flexDirection: "row", backgroundColor: colors.card, borderRadius: 100,
              padding: 4, borderWidth: 1, borderColor: colors.border,
            }}>
              {(["light", "dark"] as const).map((mode) => {
                const active = state.themeMode === mode;
                return (
                  <PressScale
                    key={mode}
                    onPress={() => setTheme(mode)}
                    style={{
                      flexDirection: "row", alignItems: "center", gap: 6,
                      paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100,
                      backgroundColor: active ? colors.foreground : "transparent",
                    }}
                  >
                    <Icon
                      name={mode === "light" ? "sunny" : "moon"}
                      size={14}
                      color={active ? colors.background : colors.mutedForeground}
                    />
                    <Text style={{
                      fontSize: 12, fontFamily: "Nunito_800ExtraBold",
                      color: active ? colors.background : colors.mutedForeground,
                    }}>
                      {mode === "light" ? "Light" : "Dark"}
                    </Text>
                  </PressScale>
                );
              })}
            </View>
          </Animated.View>

          {/* Editorial header */}
          <View style={{ paddingHorizontal: 28, marginTop: 16 }}>
            <Animated.View entering={fadeIn(200)} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Image source={LOGO.icon_colored} style={{ width: 26, height: 26 }} resizeMode="contain" />
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
                GRAFLY
              </Text>
            </Animated.View>
            <Animated.Text entering={fadeIn(300)} style={{
              fontSize: 44, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, lineHeight: 48, letterSpacing: -1.2,
            }}>
              Learn design{"\n"}by actually{"\n"}designing.
            </Animated.Text>
          </View>

          {/* Collage hero */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}>
            <View style={{ width: 280, height: 280, alignItems: "center", justifyContent: "center" }}>
              <Animated.View
                entering={fadeIn(380)}
                style={{
                  position: "absolute", top: 30, left: 10,
                  width: 180, height: 180, borderRadius: 90,
                  backgroundColor: colors.accent,
                }}
              />
              <Animated.View
                entering={fadeIn(450)}
                style={{
                  position: "absolute", bottom: 30, right: 0,
                  width: 130, height: 80, borderRadius: 24,
                  backgroundColor: colors.pink, transform: [{ rotate: "-8deg" }],
                }}
              />
              <Animated.View
                entering={fadeIn(520)}
                style={{
                  position: "absolute", top: 0, right: 30,
                  width: 64, height: 64, borderRadius: 18,
                  backgroundColor: colors.primary, transform: [{ rotate: "12deg" }],
                }}
              />
              <Animated.View entering={fadeIn(600)}>
                <GraflyMascot state="celebrate" size={200} float />
              </Animated.View>
            </View>
          </View>

          {/* Tagline + CTA */}
          <View style={{ paddingHorizontal: 28, paddingBottom: 8 }}>
            <Animated.Text entering={fadeIn(700)} style={{
              fontSize: 16, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, lineHeight: 24, marginBottom: 24,
            }}>
              Bite sized lessons. Real skills. No boring courses.
            </Animated.Text>
            <Animated.View entering={fadeIn(800)}>
              <PressScale
                style={{
                  backgroundColor: colors.foreground, borderRadius: 100,
                  paddingVertical: 20, alignItems: "center", width: "100%",
                  flexDirection: "row", justifyContent: "center", gap: 10,
                }}
                onPress={() => setStep("name")}
              >
                <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                  Start
                </Text>
                <Icon name="arrow-forward" size={20} color={colors.background} />
              </PressScale>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }

  // Personalization steps share a header / progress / footer pattern
  const personalizeSteps: Step[] = ["name", "goal", "level", "time"];
  if (personalizeSteps.includes(step)) {
    const idx = personalizeSteps.indexOf(step);
    const totalP = personalizeSteps.length;
    const onBack = idx === 0
      ? () => setStep("welcome")
      : () => setStep(personalizeSteps[idx - 1]);

    let canContinue = false;
    let onContinue = () => {};
    let eyebrow = "";
    let headline = "";
    let content: React.ReactNode = null;

    if (step === "name") {
      canContinue = username.trim().length > 0;
      onContinue = () => setStep("goal");
      eyebrow = `STEP ${idx + 1} OF ${totalP}`;
      headline = "What should we call you?";
      content = (
        <View style={{ gap: 14 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.mutedForeground,
            letterSpacing: 1.2,
          }}>
            YOUR NAME
          </Text>
          <TextInput
            value={username}
            onChangeText={(v) => setUsername(v.slice(0, 24))}
            placeholder="e.g. Alex"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={24}
            returnKeyType="done"
            onSubmitEditing={() => { if (username.trim().length > 0) setStep("goal"); }}
            style={{
              backgroundColor: colors.card,
              borderRadius: 22,
              paddingHorizontal: 20,
              paddingVertical: 20,
              fontSize: 20,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              borderWidth: 2,
              borderColor: username.trim().length > 0 ? colors.foreground : colors.border,
              letterSpacing: -0.3,
              ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
            }}
          />
          <Text style={{
            fontSize: 13,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            lineHeight: 20,
            paddingHorizontal: 4,
          }}>
            We will use this on your profile and progress screens. You can change it later.
          </Text>
        </View>
      );
    } else if (step === "goal") {
      canContinue = goal !== null;
      onContinue = () => setStep("level");
      eyebrow = `STEP ${idx + 1} OF ${totalP}`;
      headline = "What do you want to achieve?";
      content = (
        <View style={{ gap: 12 }}>
          {GOALS.map((g) => {
            const selected = goal === g.id;
            const toneColor = getToneColor(colors, g.tone);
            return (
              <PressScale
                key={g.id}
                onPress={() => setGoal(g.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: 18,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: selected ? colors.foreground : colors.border,
                  backgroundColor: selected ? colors.foreground : colors.card,
                }}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: selected ? colors.background : toneColor + "1F",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={g.icon} size={24} color={toneColor} />
                </View>
                <Text style={{
                  flex: 1,
                  fontSize: 17,
                  fontFamily: "Nunito_800ExtraBold",
                  color: selected ? colors.background : colors.foreground,
                  letterSpacing: -0.3,
                }}>
                  {g.label}
                </Text>
                {selected && (
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: colors.background,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark" size={18} color={colors.foreground} />
                  </View>
                )}
              </PressScale>
            );
          })}
        </View>
      );
    } else if (step === "level") {
      canContinue = selfLevel !== null;
      onContinue = () => setStep("time");
      eyebrow = `STEP ${idx + 1} OF ${totalP}`;
      headline = "What is your level?";
      content = (
        <View style={{ gap: 12 }}>
          {LEVELS.map((lv) => {
            const selected = selfLevel === lv.id;
            return (
              <PressScale
                key={lv.id}
                onPress={() => setSelfLevel(lv.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: 20,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: selected ? colors.foreground : colors.border,
                  backgroundColor: selected ? colors.foreground : colors.card,
                }}
              >
                <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold" }}>{lv.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: "Nunito_800ExtraBold",
                    color: selected ? colors.background : colors.foreground,
                    letterSpacing: -0.3,
                  }}>
                    {lv.label}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    fontFamily: "Nunito_600SemiBold",
                    color: selected ? colors.background : colors.mutedForeground,
                    marginTop: 2,
                  }}>
                    {lv.desc}
                  </Text>
                </View>
                {selected && (
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: colors.background,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark" size={18} color={colors.foreground} />
                  </View>
                )}
              </PressScale>
            );
          })}
        </View>
      );
    } else if (step === "time") {
      canContinue = dailyTime !== null;
      onContinue = () => { setMascotState("think"); setStep("placement"); };
      eyebrow = `STEP ${idx + 1} OF ${totalP}`;
      headline = "How much time daily?";
      content = (
        <View style={{ gap: 12 }}>
          {TIMES.map((t) => {
            const selected = dailyTime === t.id;
            return (
              <PressScale
                key={t.id}
                onPress={() => setDailyTime(t.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: 20,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: selected ? colors.foreground : colors.border,
                  backgroundColor: selected ? colors.foreground : colors.card,
                }}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: selected ? colors.background : colors.muted,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={t.icon} size={24} color={selected ? colors.foreground : colors.foreground} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: "Nunito_800ExtraBold",
                    color: selected ? colors.background : colors.foreground,
                    letterSpacing: -0.3,
                  }}>
                    {t.label}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    fontFamily: "Nunito_600SemiBold",
                    color: selected ? colors.background : colors.mutedForeground,
                    marginTop: 2,
                  }}>
                    {t.desc}
                  </Text>
                </View>
                {selected && (
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: colors.background,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark" size={18} color={colors.foreground} />
                  </View>
                )}
              </PressScale>
            );
          })}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          {/* Top bar: back + progress dots */}
          <View style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}>
            <PressScale
              onPress={onBack}
              style={{
                width: 40, height: 40, borderRadius: 100,
                backgroundColor: colors.card,
                borderWidth: 1, borderColor: colors.border,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon name="arrow-back" size={18} color={colors.foreground} />
            </PressScale>
            <View style={{ flex: 1, height: 4, borderRadius: 100, backgroundColor: colors.border, overflow: "hidden" }}>
              <View style={{
                height: "100%",
                width: `${((idx + 1) / totalP) * 100}%`,
                backgroundColor: colors.foreground,
                borderRadius: 100,
              }} />
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View key={step} entering={fadeInDown(280)}>
              <Text style={{
                fontSize: 12,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                letterSpacing: 1.5,
                marginBottom: 8,
              }}>
                {eyebrow}
              </Text>
              <Text style={{
                fontSize: 36,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -1,
                lineHeight: 40,
                marginBottom: 28,
              }}>
                {headline}
              </Text>
              {content}
            </Animated.View>
          </ScrollView>

          <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
            <PressScale
              onPress={onContinue}
              disabled={!canContinue}
              style={{
                backgroundColor: colors.foreground, borderRadius: 100,
                paddingVertical: 20, alignItems: "center", width: "100%",
                flexDirection: "row", justifyContent: "center", gap: 10,
                opacity: canContinue ? 1 : 0.35,
              }}
            >
              <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                Continue
              </Text>
              <Icon name="arrow-forward" size={20} color={colors.background} />
            </PressScale>
          </View>
        </View>
      </View>
    );
  }

  // ============================================================
  // 5. PLACEMENT TEST
  // ============================================================
  if (step === "placement") {
    const q = placementQ;
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          {/* Top bar */}
          <View style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}>
            <PressScale
              onPress={() => { if (currentQ === 0) setStep("time"); }}
              disabled={currentQ !== 0}
              style={{
                width: 40, height: 40, borderRadius: 100,
                backgroundColor: colors.card,
                borderWidth: 1, borderColor: colors.border,
                alignItems: "center", justifyContent: "center",
                opacity: currentQ === 0 ? 1 : 0.35,
              }}
            >
              <Icon name="arrow-back" size={18} color={colors.foreground} />
            </PressScale>
            <View style={{ flex: 1, height: 4, borderRadius: 100, backgroundColor: colors.border, overflow: "hidden" }}>
              <Animated.View style={[{
                height: "100%",
                backgroundColor: colors.primary,
                borderRadius: 100,
              }, placementProgressStyle]} />
            </View>
            <PressScale onPress={handleSkipPlacement}>
              <Text style={{
                fontSize: 12,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                letterSpacing: 1,
              }}>
                SKIP
              </Text>
            </PressScale>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View key={currentQ} entering={fadeInDown(260)}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <Text style={{
                  fontSize: 12,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground,
                  letterSpacing: 1.5,
                }}>
                  QUESTION {currentQ + 1} OF {PLACEMENT_QUESTIONS.length}
                </Text>
                <GraflyMascot state={mascotState} size={88} float />
              </View>

              <Text style={{
                fontSize: 26,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -0.6,
                lineHeight: 32,
                marginBottom: 28,
              }}>
                {q.question}
              </Text>

              {q.type === "multiple_choice" && q.options && (
                <View style={{ gap: 10 }}>
                  {q.options.map((opt, i) => {
                    let borderColor = colors.border;
                    let bg = colors.card;
                    let textColor = colors.foreground;
                    if (showFeedback && i === q.correctIndex) {
                      borderColor = colors.success; bg = colors.success + "20"; textColor = colors.foreground;
                    } else if (showFeedback && answerSelected === i && i !== q.correctIndex) {
                      borderColor = colors.destructive; bg = colors.destructive + "20"; textColor = colors.foreground;
                    }
                    return (
                      <PressScale
                        key={i}
                        onPress={() => handleAnswer(i)}
                        disabled={showFeedback}
                        style={{
                          backgroundColor: bg,
                          borderRadius: 18,
                          paddingVertical: 18,
                          paddingHorizontal: 20,
                          borderWidth: 2,
                          borderColor,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: textColor }}>
                          {opt}
                        </Text>
                      </PressScale>
                    );
                  })}
                </View>
              )}

              {q.type === "true_false" && (
                <View style={{
                  flexDirection: "row",
                  alignSelf: "stretch",
                  width: "100%",
                  gap: 14,
                }}>
                  {[true, false].map((val) => {
                    const isCorrectAnswer = showFeedback && val === q.correctBool;
                    const isWrongPick = showFeedback && answerSelected === val && val !== q.correctBool;
                    let borderColor = colors.border;
                    let bg = colors.card;
                    let textColor = colors.foreground;
                    if (isCorrectAnswer) {
                      borderColor = colors.success; bg = colors.success + "18"; textColor = colors.success;
                    } else if (isWrongPick) {
                      borderColor = colors.destructive; bg = colors.destructive + "18"; textColor = colors.destructive;
                    }
                    return (
                      <PressScale
                        key={String(val)}
                        onPress={() => handleAnswer(val)}
                        disabled={showFeedback}
                        style={{
                          flex: 1,
                          minHeight: 130,
                          borderRadius: 22,
                          paddingVertical: 32,
                          paddingHorizontal: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          borderWidth: 2,
                          borderColor,
                          backgroundColor: bg,
                        }}
                      >
                        {(isCorrectAnswer || isWrongPick) ? (
                          <Icon name={isCorrectAnswer ? "checkmark-circle" : "close-circle"} size={30} color={textColor} />
                        ) : null}
                        <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: textColor, letterSpacing: 0.3 }}>
                          {val ? "True" : "False"}
                        </Text>
                      </PressScale>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          </ScrollView>

          {showFeedback && (
            <Animated.View
              entering={fadeIn(0, 200)}
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                paddingHorizontal: 20, paddingTop: 18,
                paddingBottom: padBottom + 20,
                backgroundColor: (lastWasCorrect ? colors.success : colors.destructive) + "E6",
                borderTopLeftRadius: 28, borderTopRightRadius: 28,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icon
                  name={lastWasCorrect ? "checkmark-circle" : "close-circle"}
                  size={22}
                  color={colors.destructiveForeground}
                />
                <Text style={{
                  fontSize: 16, fontFamily: "Nunito_800ExtraBold",
                  color: colors.destructiveForeground,
                }}>
                  {lastWasCorrect ? "Nice work!" : "Not quite"}
                </Text>
              </View>
              <Text style={{
                fontSize: 14, fontFamily: "Nunito_600SemiBold",
                color: colors.destructiveForeground, lineHeight: 20, marginBottom: 14,
              }}>
                {q.explanation}
              </Text>
              <PressScale
                style={{
                  backgroundColor: colors.destructiveForeground,
                  borderRadius: 100, paddingVertical: 16, alignItems: "center",
                  flexDirection: "row", justifyContent: "center", gap: 8,
                }}
                onPress={handleContinueQuestion}
              >
                <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: lastWasCorrect ? colors.success : colors.destructive }}>
                  {currentQ + 1 >= PLACEMENT_QUESTIONS.length ? "See results" : "Continue"}
                </Text>
                <Icon name="arrow-forward" size={18} color={lastWasCorrect ? colors.success : colors.destructive} />
              </PressScale>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }

  // ============================================================
  // 6. RESULTS / REWARD
  // ============================================================
  if (step === "results") {
    const levelColor = getLevelColor(colors, placementResult);
    const xpEarned = score * 10;
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom, paddingHorizontal: 28 }}>
          <Animated.View entering={fadeIn(0, 320)} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <GraflyMascot state="celebrate" size={140} float />

            <Text style={{
              fontSize: 13,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1.5,
              marginTop: 24,
              marginBottom: 8,
            }}>
              YOU IMPROVED THE DESIGN
            </Text>

            <AText style={{
              fontSize: 44,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              textAlign: "center",
              letterSpacing: -1.2,
              lineHeight: 48,
              marginBottom: 6,
            }}>
              Great work!
            </AText>

            <Text style={{
              fontSize: 15,
              fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground,
              textAlign: "center",
              marginBottom: 24,
            }}>
              You are all set up
            </Text>

            {/* XP reward chip */}
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 18, paddingVertical: 10,
              borderRadius: 100,
              backgroundColor: colors.accent,
              marginBottom: 16,
            }}>
              <Icon name="flash" size={18} color={colors.accentForeground} />
              <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.accentForeground }}>
                +{xpEarned} XP
              </Text>
            </View>

            {/* Level badge */}
            <View style={{
              paddingHorizontal: 18, paddingVertical: 8,
              borderRadius: 100, marginBottom: 24,
              backgroundColor: levelColor,
            }}>
              <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.accentForeground }}>
                {LEVEL_LABELS[placementResult]}
              </Text>
            </View>

            {/* Stats row */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 24, width: "100%" }}>
              {[
                { num: String(score), label: "Correct" },
                { num: String(PLACEMENT_QUESTIONS.length), label: "Questions" },
                { num: `${Math.round((score / PLACEMENT_QUESTIONS.length) * 100)}%`, label: "Score" },
              ].map((s) => (
                <View key={s.label} style={{
                  flex: 1, backgroundColor: colors.card,
                  borderRadius: 18, padding: 14, alignItems: "center",
                  borderWidth: 1, borderColor: colors.border,
                }}>
                  <Text style={{ fontSize: 24, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                    {s.num}
                  </Text>
                  <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, marginTop: 4, letterSpacing: 1 }}>
                    {s.label.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{
              fontSize: 14, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, textAlign: "center",
              marginBottom: 28, lineHeight: 20,
            }}>
              {LEVEL_DESC[placementResult]}
            </Text>
          </Animated.View>

          <PressScale
            style={{
              backgroundColor: colors.foreground, borderRadius: 100,
              paddingVertical: 20, alignItems: "center", width: "100%",
              flexDirection: "row", justifyContent: "center", gap: 10,
            }}
            onPress={() => setStep("signup")}
          >
            <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
              Continue
            </Text>
            <Icon name="arrow-forward" size={20} color={colors.background} />
          </PressScale>
        </View>
      </View>
    );
  }

  // ============================================================
  // 7. SOFT SIGNUP
  // ============================================================
  if (step === "signup") {
    const busy = authBusy || googleBusy;
    const headline = authMode === "reset" ? "Reset password" : "Save your\nprogress";
    const eyebrow = authMode === "reset" ? "FORGOT PASSWORD" : "ALMOST THERE";
    const sub =
      authMode === "reset"
        ? "Enter the email for your account and we will send you a reset link."
        : authMode === "signin"
        ? "Sign in to keep your XP, streaks, and level on every device."
        : "Create an account so your XP, streaks, and level follow you everywhere.";
    const primaryLabel =
      authMode === "reset" ? "Send reset link" : authMode === "signin" ? "Sign in" : "Create account";

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: padTop,
              paddingBottom: padBottom + 12,
              paddingHorizontal: 28,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={fadeIn(0, 320)} style={{ flex: 1, justifyContent: "center" }}>
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <View style={{
                  width: 72, height: 72, borderRadius: 22,
                  backgroundColor: colors.accent,
                  alignItems: "center", justifyContent: "center",
                  marginBottom: 18,
                }}>
                  <Icon
                    name={authMode === "reset" ? "mail" : "cloud-upload"}
                    size={34}
                    color={colors.accentForeground}
                  />
                </View>

                <Text style={{
                  fontSize: 12,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground,
                  letterSpacing: 1.5,
                  marginBottom: 6,
                }}>
                  {eyebrow}
                </Text>
                <Text style={{
                  fontSize: 32,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.foreground,
                  textAlign: "center",
                  letterSpacing: -1,
                  lineHeight: 36,
                  marginBottom: 10,
                }}>
                  {headline}
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.mutedForeground,
                  textAlign: "center",
                  lineHeight: 20,
                  paddingHorizontal: 8,
                }}>
                  {sub}
                </Text>
              </View>

              {authMode !== "reset" && (
                <View style={{
                  flexDirection: "row",
                  backgroundColor: colors.card,
                  borderRadius: 100,
                  padding: 4,
                  marginBottom: 18,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignSelf: "center",
                }}>
                  {(["signin", "signup"] as const).map((m) => {
                    const active = authMode === m;
                    return (
                      <PressScale
                        key={m}
                        onPress={() => switchAuthMode(m)}
                        style={{
                          paddingHorizontal: 22,
                          paddingVertical: 9,
                          borderRadius: 100,
                          backgroundColor: active ? colors.foreground : "transparent",
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontFamily: "Nunito_800ExtraBold",
                          color: active ? colors.background : colors.mutedForeground,
                          letterSpacing: 0.2,
                        }}>
                          {m === "signin" ? "Sign in" : "Sign up"}
                        </Text>
                      </PressScale>
                    );
                  })}
                </View>
              )}

              <View style={{ gap: 12 }}>
                <View>
                  <Text style={{
                    fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                    color: colors.mutedForeground, letterSpacing: 1.2, marginBottom: 6,
                  }}>
                    EMAIL
                  </Text>
                  <TextInput
                    value={authEmail}
                    onChangeText={setAuthEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType={authMode === "reset" ? "done" : "next"}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 18,
                      paddingHorizontal: 18,
                      paddingVertical: 14,
                      fontSize: 15,
                      fontFamily: "Nunito_600SemiBold",
                      color: colors.foreground,
                      borderWidth: 1.5,
                      borderColor: colors.border,
                      ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                    }}
                  />
                </View>

                {authMode !== "reset" && (
                  <View>
                    <Text style={{
                      fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                      color: colors.mutedForeground, letterSpacing: 1.2, marginBottom: 6,
                    }}>
                      PASSWORD
                    </Text>
                    <TextInput
                      value={authPassword}
                      onChangeText={setAuthPassword}
                      placeholder="Min. 6 characters"
                      placeholderTextColor={colors.mutedForeground}
                      secureTextEntry
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={finishWithEmail}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 18,
                        paddingHorizontal: 18,
                        paddingVertical: 14,
                        fontSize: 15,
                        fontFamily: "Nunito_600SemiBold",
                        color: colors.foreground,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                      }}
                    />
                  </View>
                )}

                {authMode === "signin" && (
                  <PressScale
                    onPress={() => switchAuthMode("reset")}
                    scaleTo={0.98}
                    style={{ alignSelf: "flex-end", paddingVertical: 4, paddingHorizontal: 4 }}
                  >
                    <Text style={{
                      fontSize: 13, fontFamily: "Nunito_800ExtraBold",
                      color: colors.primary, letterSpacing: -0.2,
                    }}>
                      Forgot password?
                    </Text>
                  </PressScale>
                )}

                {!!authError && (
                  <View style={{
                    backgroundColor: colors.destructive + "1F",
                    borderRadius: 14, padding: 12,
                    borderWidth: 1, borderColor: colors.destructive,
                  }}>
                    <Text style={{
                      fontSize: 13, fontFamily: "Nunito_600SemiBold",
                      color: colors.destructive, textAlign: "center",
                    }}>
                      {authError}
                    </Text>
                  </View>
                )}

                {!!authNotice && (
                  <View style={{
                    backgroundColor: colors.success + "1F",
                    borderRadius: 14, padding: 12,
                    borderWidth: 1, borderColor: colors.success,
                  }}>
                    <Text style={{
                      fontSize: 13, fontFamily: "Nunito_600SemiBold",
                      color: colors.success, textAlign: "center",
                    }}>
                      {authNotice}
                    </Text>
                  </View>
                )}

                <PressScale
                  onPress={finishWithEmail}
                  disabled={busy}
                  style={{
                    backgroundColor: colors.foreground, borderRadius: 100,
                    paddingVertical: 18, alignItems: "center", width: "100%",
                    flexDirection: "row", justifyContent: "center", gap: 10,
                    marginTop: 4,
                    opacity: busy ? 0.6 : 1,
                  }}
                >
                  {authBusy ? (
                    <ActivityIndicator size="small" color={colors.background} />
                  ) : (
                    <>
                      <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                        {primaryLabel}
                      </Text>
                      <Icon name="arrow-forward" size={18} color={colors.background} />
                    </>
                  )}
                </PressScale>

                {authMode === "reset" ? (
                  <PressScale
                    onPress={() => switchAuthMode("signin")}
                    disabled={busy}
                    style={{ paddingVertical: 14, alignItems: "center", width: "100%" }}
                  >
                    <Text style={{
                      fontSize: 14, fontFamily: "Nunito_800ExtraBold",
                      color: colors.mutedForeground, letterSpacing: -0.2,
                    }}>
                      Back to sign in
                    </Text>
                  </PressScale>
                ) : (
                  <>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 8 }}>
                      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                      <Text style={{
                        fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                        color: colors.mutedForeground, letterSpacing: 1.5,
                      }}>
                        OR
                      </Text>
                      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                    </View>

                    <PressScale
                      onPress={finishWithGoogle}
                      disabled={busy}
                      style={{
                        backgroundColor: colors.card, borderRadius: 100,
                        paddingVertical: 16, alignItems: "center", width: "100%",
                        flexDirection: "row", justifyContent: "center", gap: 12,
                        borderWidth: 1.5, borderColor: colors.border,
                        opacity: busy ? 0.6 : 1,
                      }}
                    >
                      {googleBusy ? (
                        <ActivityIndicator size="small" color={colors.foreground} />
                      ) : (
                        <>
                          <Icon name="logo-google" size={20} color={colors.foreground} />
                          <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                            Continue with Google
                          </Text>
                        </>
                      )}
                    </PressScale>

                    <PressScale
                      onPress={finishWithoutAccount}
                      disabled={busy}
                      style={{ paddingVertical: 14, alignItems: "center", width: "100%" }}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: "Nunito_800ExtraBold",
                        color: colors.mutedForeground,
                        letterSpacing: -0.2,
                      }}>
                        Skip for now
                      </Text>
                    </PressScale>
                  </>
                )}
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return null;
}
