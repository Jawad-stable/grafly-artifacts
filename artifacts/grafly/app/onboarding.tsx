import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import type { PlacementLevel } from "@/context/GameContext";
import { PLACEMENT_QUESTIONS } from "@/constants/lessons";
import { GraflyMascot } from "@/components/GraflyMascot";
import type { MascotState } from "@/constants/assets";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
type Step = "welcome" | "setup" | "placement" | "results";

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

const LEVEL_COLORS: Record<PlacementLevel, string> = {
  novice: "#8A90B0",
  beginner: "#00A4FA",
  intermediate: "#22DD88",
  advanced: "#E3ED43",
  expert: "#FF7BD0",
};

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

  const [step, setStep] = useState<Step>("welcome");
  const [username, setUsername] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answerSelected, setAnswerSelected] = useState<number | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [placementResult, setPlacementResult] = useState<PlacementLevel>("novice");
  const [mascotState, setMascotState] = useState<MascotState>("idle");

  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    if (step === "placement") {
      progressWidth.value = withTiming(((currentQ + 1) / PLACEMENT_QUESTIONS.length) * 100, { duration: 400 });
    }
  }, [currentQ, step]);

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }));

  function handleAnswer(answer: number | boolean) {
    if (showFeedback) return;
    setAnswerSelected(answer);
    setShowFeedback(true);

    const q = PLACEMENT_QUESTIONS[currentQ];
    const correct = q.type === "true_false" ? answer === q.correctBool : answer === q.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      setMascotState("correct");
    } else {
      setMascotState("wrong");
    }

    setTimeout(() => {
      const nextQ = currentQ + 1;
      setMascotState("think");
      if (nextQ >= PLACEMENT_QUESTIONS.length) {
        const finalScore = correct ? score + 1 : score;
        const level = getPlacementLevel(finalScore, PLACEMENT_QUESTIONS.length);
        setPlacementResult(level);
        setStep("results");
        setMascotState("celebrate");
      } else {
        setCurrentQ(nextQ);
        setAnswerSelected(null);
        setShowFeedback(false);
      }
    }, 900);
  }

  function handleFinish() {
    completeOnboarding(username.trim() || "Designer", placementResult);
    router.replace("/(tabs)");
  }

  const padTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const padBottom = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  if (step === "welcome") {
    return (
      <LinearGradient colors={[colors.background, colors.secondary]} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          <Animated.View
            entering={FadeIn.delay(100)}
            style={{ flexDirection: "row", justifyContent: "center", paddingHorizontal: 28, paddingTop: 12 }}
          >
            <View style={{
              flexDirection: "row", backgroundColor: colors.card, borderRadius: 100,
              padding: 4, borderWidth: 1, borderColor: colors.border,
            }}>
              {(["light", "dark"] as const).map((mode) => {
                const active = state.themeMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setTheme(mode)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: "row", alignItems: "center", gap: 6,
                      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
                      backgroundColor: active ? colors.primary : "transparent",
                    }}
                  >
                    <Ionicons
                      name={mode === "light" ? "sunny" : "moon"}
                      size={16}
                      color={active ? colors.primaryForeground : colors.mutedForeground}
                    />
                    <Text style={{
                      fontSize: 13, fontFamily: "Nunito_800ExtraBold",
                      color: active ? colors.primaryForeground : colors.mutedForeground,
                    }}>
                      {mode === "light" ? "Light" : "Dark"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}>
            <GraflyMascot state="celebrate" size={150} float />
            <Animated.Text entering={FadeIn.delay(300)} style={{
              fontSize: 32, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, textAlign: "center", marginBottom: 12, marginTop: 20,
            }}>
              Welcome to Grafly
            </Animated.Text>
            <Animated.Text entering={FadeIn.delay(500)} style={{
              fontSize: 16, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, textAlign: "center", lineHeight: 24, marginBottom: 48,
            }}>
              Design education, gamified.
              {"\n"}Learn real skills one lesson at a time.
            </Animated.Text>
            <Animated.View entering={FadeIn.delay(700)} style={{ width: "100%" }}>
              <TouchableOpacity
                style={{ backgroundColor: colors.primary, borderRadius: colors.radius, paddingVertical: 18, alignItems: "center", width: "100%" }}
                onPress={() => setStep("setup")}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
                  Get Started
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingVertical: 16, alignItems: "center", marginTop: 12 }}
                onPress={() => { setMascotState("think"); setStep("placement"); }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  Already a designer? Skip ahead
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (step === "setup") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          <Animated.View entering={SlideInRight} style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}>
            <GraflyMascot state="think" size={130} />
            <Text style={{
              fontSize: 28, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, textAlign: "center", marginBottom: 10, marginTop: 20,
            }}>
              What is your name?
            </Text>
            <Text style={{
              fontSize: 15, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, textAlign: "center", marginBottom: 28,
            }}>
              Your name in the Grafly community
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.card, borderRadius: colors.radius,
                paddingHorizontal: 20, paddingVertical: 18,
                fontSize: 18, fontFamily: "Nunito_600SemiBold",
                color: colors.foreground, borderWidth: 2, borderColor: colors.border,
                width: "100%", marginBottom: 32,
              }}
              value={username}
              onChangeText={setUsername}
              placeholder="Your name or handle"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              maxLength={24}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[{
                backgroundColor: colors.primary, borderRadius: colors.radius,
                paddingVertical: 18, alignItems: "center", width: "100%",
              }, !username.trim() && { opacity: 0.5 }]}
              onPress={() => { setMascotState("think"); setStep("placement"); }}
              activeOpacity={0.85}
              disabled={!username.trim()}
            >
              <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
                {username.trim() ? `Continue as ${username.trim()}` : "Enter your name"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  if (step === "placement") {
    const q = PLACEMENT_QUESTIONS[currentQ];
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          <View style={{ height: 6, backgroundColor: colors.muted, marginHorizontal: 24, marginTop: 20, marginBottom: 8, borderRadius: 3, overflow: "hidden" }}>
            <Animated.View style={[{ height: "100%", backgroundColor: colors.primary, borderRadius: 3 }, progressAnimStyle]} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              Question {currentQ + 1} of {PLACEMENT_QUESTIONS.length}
            </Text>
            <GraflyMascot state={mascotState} size={52} />
          </View>
          <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
            <Text style={{
              fontSize: 20, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, textAlign: "center",
              lineHeight: 28, marginBottom: 28,
            }}>
              {q.question}
            </Text>

            {q.type === "multiple_choice" && q.options && (
              <Animated.View entering={FadeIn}>
                {q.options.map((opt, i) => {
                  let borderColor = colors.border;
                  let bg = colors.card;
                  if (showFeedback && i === q.correctIndex) { borderColor = colors.success; bg = colors.success + "20"; }
                  else if (showFeedback && answerSelected === i && i !== q.correctIndex) { borderColor = colors.destructive; bg = colors.destructive + "20"; }
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{ backgroundColor: bg, borderRadius: colors.radius, paddingVertical: 18, paddingHorizontal: 20, marginBottom: 12, borderWidth: 2, borderColor }}
                      onPress={() => handleAnswer(i)}
                      activeOpacity={0.8}
                      disabled={showFeedback}
                    >
                      <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            )}

            {q.type === "true_false" && (
              <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                {[true, false].map((val) => {
                  let borderColor = colors.border;
                  let bg = colors.card;
                  let textColor = colors.foreground;
                  if (showFeedback && val === q.correctBool) { borderColor = colors.success; bg = colors.success + "20"; textColor = colors.success; }
                  else if (showFeedback && answerSelected === val && val !== q.correctBool) { borderColor = colors.destructive; bg = colors.destructive + "20"; textColor = colors.destructive; }
                  return (
                    <TouchableOpacity
                      key={String(val)}
                      style={{ flex: 1, borderRadius: colors.radius, paddingVertical: 24, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor, backgroundColor: bg }}
                      onPress={() => handleAnswer(val)}
                      activeOpacity={0.8}
                      disabled={showFeedback}
                    >
                      <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: textColor }}>
                        {val ? "True" : "False"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {showFeedback && (
              <Animated.View entering={FadeIn} style={{ marginTop: 20, backgroundColor: colors.card, borderRadius: colors.radius, padding: 16 }}>
                <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 20 }}>
                  {q.explanation}
                </Text>
              </Animated.View>
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </View>
    );
  }

  if (step === "results") {
    const levelColor = LEVEL_COLORS[placementResult];
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingTop: padTop, paddingBottom: padBottom }}>
          <Animated.View entering={FadeIn} style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}>
            <GraflyMascot state="celebrate" size={150} float />
            <Text style={{
              fontSize: 28, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, textAlign: "center", marginBottom: 8, marginTop: 20,
            }}>
              {username.trim() ? `Great work, ${username.trim().split(" ")[0]}!` : "Great work!"}
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 20 }}>
              Your placement test is complete
            </Text>

            <View style={{ paddingHorizontal: 20, paddingVertical: 8, borderRadius: 100, marginBottom: 20, backgroundColor: levelColor }}>
              <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: "#21263F" }}>
                {LEVEL_LABELS[placementResult]}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 28, width: "100%" }}>
              {[
                { num: score, label: "Correct" },
                { num: PLACEMENT_QUESTIONS.length, label: "Questions" },
                { num: `${Math.round((score / PLACEMENT_QUESTIONS.length) * 100)}%`, label: "Score" },
              ].map((s) => (
                <View key={s.label} style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 16, alignItems: "center" }}>
                  <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>{s.num}</Text>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }}>{s.label.toUpperCase()}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
              {LEVEL_DESC[placementResult]}
            </Text>

            <TouchableOpacity
              style={{ backgroundColor: colors.primary, borderRadius: colors.radius, paddingVertical: 18, alignItems: "center", width: "100%" }}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
                Start Learning
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return null;
}
