import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
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
  withRepeat,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import type { PlacementLevel } from "@/context/GameContext";
import { PLACEMENT_QUESTIONS } from "@/constants/lessons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Step = "welcome" | "setup" | "placement" | "results";

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useGame();

  const [step, setStep] = useState<Step>("welcome");
  const [username, setUsername] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answerSelected, setAnswerSelected] = useState<number | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [placementResult, setPlacementResult] = useState<PlacementLevel>("novice");

  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const feedbackScale = useSharedValue(1);

  React.useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  React.useEffect(() => {
    if (step === "placement") {
      progressWidth.value = withTiming(
        ((currentQ + 1) / PLACEMENT_QUESTIONS.length) * 100,
        { duration: 400 }
      );
    }
  }, [currentQ, step]);

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }));

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
    novice: "#7A7A9A",
    beginner: "#00A4FA",
    intermediate: "#22DD88",
    advanced: "#E3ED43",
    expert: "#FF7BD0",
  };

  const LEVEL_DESC: Record<PlacementLevel, string> = {
    novice: "Every expert was once a beginner. Your journey starts now.",
    beginner: "You have the foundations. Let's build on them.",
    intermediate: "Solid knowledge — time to go deeper.",
    advanced: "Impressive! You'll move fast through the early levels.",
    expert: "You already think like a designer. Let's refine your craft.",
  };

  function handleAnswer(answer: number | boolean) {
    if (showFeedback) return;
    setAnswerSelected(answer);
    setShowFeedback(true);

    const q = PLACEMENT_QUESTIONS[currentQ];
    const correct =
      q.type === "true_false"
        ? answer === q.correctBool
        : answer === q.correctIndex;

    if (correct) setScore((s) => s + 1);

    feedbackScale.value = withSequence(
      withSpring(1.05, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );

    setTimeout(() => {
      const nextQ = currentQ + 1;
      if (nextQ >= PLACEMENT_QUESTIONS.length) {
        const finalScore = correct ? score + 1 : score;
        const level = getPlacementLevel(finalScore, PLACEMENT_QUESTIONS.length);
        setPlacementResult(level);
        setStep("results");
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

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safe: {
      flex: 1,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
    },
    center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 28,
    },
    logoText: {
      fontSize: 52,
      fontFamily: "Nunito_800ExtraBold",
      color: colors.primaryForeground,
      lineHeight: 60,
    },
    title: {
      fontSize: 32,
      fontFamily: "Nunito_800ExtraBold",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Nunito_600SemiBold",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 48,
    },
    btn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 18,
      paddingHorizontal: 48,
      alignItems: "center",
      width: "100%",
    },
    btnText: {
      fontSize: 18,
      fontFamily: "Nunito_800ExtraBold",
      color: colors.primaryForeground,
    },
    btnSecondary: {
      backgroundColor: "transparent",
      borderRadius: colors.radius,
      paddingVertical: 16,
      paddingHorizontal: 48,
      alignItems: "center",
      marginTop: 12,
    },
    btnSecondaryText: {
      fontSize: 16,
      fontFamily: "Nunito_600SemiBold",
      color: colors.mutedForeground,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      paddingHorizontal: 20,
      paddingVertical: 18,
      fontSize: 18,
      fontFamily: "Nunito_600SemiBold",
      color: colors.foreground,
      borderWidth: 2,
      borderColor: colors.border,
      width: "100%",
      marginBottom: 32,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      marginHorizontal: 24,
      marginTop: 24,
      marginBottom: 8,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    qCard: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    qNum: {
      fontSize: 13,
      fontFamily: "Nunito_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
      textAlign: "center",
    },
    qText: {
      fontSize: 20,
      fontFamily: "Nunito_800ExtraBold",
      color: colors.foreground,
      textAlign: "center",
      lineHeight: 28,
      marginBottom: 32,
    },
    option: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    optionText: {
      fontSize: 16,
      fontFamily: "Nunito_600SemiBold",
      color: colors.foreground,
    },
    tfRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    tfBtn: {
      flex: 1,
      borderRadius: colors.radius,
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
    },
    tfText: {
      fontSize: 20,
      fontFamily: "Nunito_800ExtraBold",
    },
    levelBadge: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 100,
      marginBottom: 20,
    },
    levelBadgeText: {
      fontSize: 14,
      fontFamily: "Nunito_800ExtraBold",
      color: "#0F0F14",
    },
    statsRow: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 40,
      width: "100%",
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      alignItems: "center",
    },
    statNum: {
      fontSize: 28,
      fontFamily: "Nunito_800ExtraBold",
      color: colors.foreground,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: "Nunito_600SemiBold",
      color: colors.mutedForeground,
      marginTop: 2,
    },
  });

  if (step === "welcome") {
    return (
      <LinearGradient
        colors={[colors.background, colors.secondary + "80"]}
        style={s.container}
      >
        <View style={s.safe}>
          <View style={s.center}>
            <Animated.View style={[s.logo, logoAnimStyle]}>
              <Text style={s.logoText}>G</Text>
            </Animated.View>
            <Animated.Text entering={FadeIn.delay(300)} style={s.title}>
              Welcome to Grafly
            </Animated.Text>
            <Animated.Text entering={FadeIn.delay(500)} style={s.subtitle}>
              Design education, gamified.{"\n"}Learn real skills — one lesson at a time.
            </Animated.Text>
            <Animated.View entering={FadeIn.delay(700)} style={{ width: "100%" }}>
              <TouchableOpacity
                style={s.btn}
                onPress={() => setStep("setup")}
                activeOpacity={0.85}
              >
                <Text style={s.btnText}>Get Started</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.btnSecondary}
                onPress={() => setStep("placement")}
                activeOpacity={0.7}
              >
                <Text style={s.btnSecondaryText}>Already a designer? Take the placement test</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (step === "setup") {
    return (
      <View style={s.container}>
        <View style={s.safe}>
          <Animated.View entering={SlideInRight} style={s.center}>
            <Ionicons
              name="person-circle-outline"
              size={72}
              color={colors.primary}
              style={{ marginBottom: 20 }}
            />
            <Text style={s.title}>What should we call you?</Text>
            <Text style={[s.subtitle, { marginBottom: 28 }]}>
              This is your name in the Grafly community.
            </Text>
            <TextInput
              style={s.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Your name or handle"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              maxLength={24}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[s.btn, !username.trim() && { opacity: 0.5 }]}
              onPress={() => setStep("placement")}
              activeOpacity={0.85}
              disabled={!username.trim()}
            >
              <Text style={s.btnText}>
                {username.trim() ? `Continue as ${username.trim()}` : "Enter your name to continue"}
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
      <View style={s.container}>
        <View style={s.safe}>
          <View style={s.progressBar}>
            <Animated.View style={[s.progressFill, progressAnimStyle]} />
          </View>
          <Text style={s.qNum}>
            Placement Test • Question {currentQ + 1}
          </Text>
          <ScrollView style={s.qCard} showsVerticalScrollIndicator={false}>
            <Text style={s.qText}>{q.question}</Text>

            {q.type === "multiple_choice" && q.options && (
              <Animated.View entering={FadeIn}>
                {q.options.map((opt, i) => {
                  let borderColor = colors.border;
                  let bg = colors.card;
                  if (showFeedback && i === q.correctIndex) {
                    borderColor = colors.success;
                    bg = colors.success + "20";
                  } else if (
                    showFeedback &&
                    answerSelected === i &&
                    i !== q.correctIndex
                  ) {
                    borderColor = colors.destructive;
                    bg = colors.destructive + "20";
                  }
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[s.option, { borderColor, backgroundColor: bg }]}
                      onPress={() => handleAnswer(i)}
                      activeOpacity={0.8}
                      disabled={showFeedback}
                    >
                      <Text style={s.optionText}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            )}

            {q.type === "true_false" && (
              <View style={s.tfRow}>
                {[true, false].map((val) => {
                  let borderColor = colors.border;
                  let bg = colors.card;
                  let textColor = colors.foreground;
                  if (showFeedback && val === q.correctBool) {
                    borderColor = colors.success;
                    bg = colors.success + "20";
                    textColor = colors.success;
                  } else if (
                    showFeedback &&
                    answerSelected === val &&
                    val !== q.correctBool
                  ) {
                    borderColor = colors.destructive;
                    bg = colors.destructive + "20";
                    textColor = colors.destructive;
                  }
                  return (
                    <TouchableOpacity
                      key={String(val)}
                      style={[s.tfBtn, { borderColor, backgroundColor: bg }]}
                      onPress={() => handleAnswer(val)}
                      activeOpacity={0.8}
                      disabled={showFeedback}
                    >
                      <Text style={[s.tfText, { color: textColor }]}>
                        {val ? "True" : "False"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {showFeedback && (
              <Animated.View
                entering={FadeIn}
                style={{
                  marginTop: 20,
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.mutedForeground,
                    lineHeight: 20,
                  }}
                >
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
      <View style={s.container}>
        <View style={s.safe}>
          <Animated.View entering={FadeIn} style={s.center}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: levelColor + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                borderWidth: 3,
                borderColor: levelColor,
              }}
            >
              <Ionicons name="trophy" size={52} color={levelColor} />
            </View>

            <Text style={s.title}>
              {username.trim() ? `Nice work, ${username.trim()}!` : "Nice work!"}
            </Text>
            <Text style={[s.subtitle, { marginBottom: 24 }]}>
              Your placement test is complete.
            </Text>

            <View style={[s.levelBadge, { backgroundColor: levelColor }]}>
              <Text style={s.levelBadgeText}>{LEVEL_LABELS[placementResult]}</Text>
            </View>

            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={s.statNum}>{score}</Text>
                <Text style={s.statLabel}>CORRECT</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statNum}>{PLACEMENT_QUESTIONS.length}</Text>
                <Text style={s.statLabel}>QUESTIONS</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statNum}>
                  {Math.round((score / PLACEMENT_QUESTIONS.length) * 100)}%
                </Text>
                <Text style={s.statLabel}>SCORE</Text>
              </View>
            </View>

            <Text
              style={[
                s.subtitle,
                { color: colors.mutedForeground, marginBottom: 36 },
              ]}
            >
              {LEVEL_DESC[placementResult]}
            </Text>

            <TouchableOpacity
              style={s.btn}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={s.btnText}>Start Learning</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return null;
}
