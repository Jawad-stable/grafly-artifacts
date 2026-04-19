import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { voiceService } from "@/services/voiceService";
import { COURSES, findNodeById, type Question, type Lesson } from "@/constants/lessons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function MCQuestion({
  question,
  onAnswer,
  answered,
  selectedIndex,
}: {
  question: Question;
  onAnswer: (index: number) => void;
  answered: boolean;
  selectedIndex: number | null;
}) {
  const colors = useColors();
  if (!question.options) return null;

  return (
    <View style={{ gap: 12 }}>
      {question.options.map((opt, i) => {
        let borderColor = colors.border;
        let bg = colors.card;
        let textColor = colors.foreground;
        let rightIcon: "checkmark-circle" | "close-circle" | null = null;

        if (answered) {
          if (i === question.correctIndex) {
            borderColor = colors.success;
            bg = colors.success + "15";
            textColor = colors.success;
            rightIcon = "checkmark-circle";
          } else if (i === selectedIndex && i !== question.correctIndex) {
            borderColor = colors.destructive;
            bg = colors.destructive + "15";
            textColor = colors.destructive;
            rightIcon = "close-circle";
          }
        }

        return (
          <TouchableOpacity
            key={i}
            style={{
              backgroundColor: bg,
              borderRadius: colors.radius,
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderWidth: 2,
              borderColor,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
            onPress={() => !answered && onAnswer(i)}
            disabled={answered}
            activeOpacity={0.8}
          >
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: answered && i === question.correctIndex ? colors.success : "transparent",
            }}>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: answered && i === question.correctIndex ? "#fff" : textColor }}>
                {["A", "B", "C", "D"][i]}
              </Text>
            </View>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: "Nunito_600SemiBold", color: textColor, lineHeight: 22 }}>
              {opt}
            </Text>
            {rightIcon && (
              <Ionicons
                name={rightIcon}
                size={22}
                color={rightIcon === "checkmark-circle" ? colors.success : colors.destructive}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TFQuestion({
  question,
  onAnswer,
  answered,
  selectedBool,
}: {
  question: Question;
  onAnswer: (val: boolean) => void;
  answered: boolean;
  selectedBool: boolean | null;
}) {
  const colors = useColors();

  return (
    <View style={{ flexDirection: "row", gap: 14 }}>
      {[true, false].map((val) => {
        let borderColor = colors.border;
        let bg = colors.card;
        let textColor = colors.foreground;

        if (answered) {
          if (val === question.correctBool) {
            borderColor = colors.success;
            bg = colors.success + "15";
            textColor = colors.success;
          } else if (val === selectedBool && val !== question.correctBool) {
            borderColor = colors.destructive;
            bg = colors.destructive + "15";
            textColor = colors.destructive;
          }
        }

        return (
          <TouchableOpacity
            key={String(val)}
            style={{
              flex: 1,
              backgroundColor: bg,
              borderRadius: colors.radius,
              paddingVertical: 28,
              borderWidth: 2,
              borderColor,
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onPress={() => !answered && onAnswer(val)}
            disabled={answered}
            activeOpacity={0.8}
          >
            <Ionicons
              name={val ? "checkmark-circle" : "close-circle"}
              size={32}
              color={textColor}
            />
            <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: textColor }}>
              {val ? "True" : "False"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function LessonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { nodeId } = useLocalSearchParams<{ nodeId: string }>();
  const { state, loseHeart, completeLesson } = useGame();

  const node = nodeId ? findNodeById(nodeId) : null;
  const course = node ? COURSES.find((c) => c.id === node.courseId) : null;

  const allLessons: Lesson[] = node?.lessons ?? [];

  const [lessonIdx, setLessonIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const currentLesson = allLessons[lessonIdx];
  const questions = currentLesson?.questions ?? [];
  const currentQ = questions[questionIdx];
  const totalQuestions = questions.length;

  const feedbackBg = useSharedValue("transparent" as any);
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const progressWidth = ((questionIdx) / Math.max(totalQuestions, 1)) * 100;

  async function handleAnswer(answer: number | boolean) {
    if (answered) return;

    const correct =
      currentQ.type === "true_false"
        ? (answer as boolean) === currentQ.correctBool
        : (answer as number) === currentQ.correctIndex;

    setAnswered(true);
    setIsCorrect(correct);
    if (currentQ.type === "multiple_choice") setSelectedIndex(answer as number);
    if (currentQ.type === "true_false") setSelectedBool(answer as boolean);

    if (correct) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      voiceService.playCorrectAnswer();
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      loseHeart();
      setHeartsLost((h) => h + 1);
      voiceService.playWrongAnswer();

      if (state.hearts - 1 <= 0) {
        setTimeout(() => router.replace("/paywall" as any), 1000);
        return;
      }
    }

    setTimeout(() => {
      advance(correct);
    }, 900);
  }

  function advance(wasCorrect: boolean) {
    const nextQ = questionIdx + 1;

    if (nextQ >= totalQuestions) {
      const lessonXP = currentLesson.xpReward + (wasCorrect && heartsLost === 0 ? 10 : 0);
      const lessonCoins = currentLesson.coinReward;
      setXpEarned((x) => x + lessonXP);
      setCoinsEarned((c) => c + lessonCoins);
      completeLesson(currentLesson.id, lessonXP, lessonCoins);

      const nextLesson = lessonIdx + 1;
      if (nextLesson >= allLessons.length) {
        setAllDone(true);
      }
      setShowSummary(true);
    } else {
      setQuestionIdx(nextQ);
      setAnswered(false);
      setSelectedIndex(null);
      setSelectedBool(null);
      setIsCorrect(null);
    }
  }

  function continueAfterSummary() {
    const nextLesson = lessonIdx + 1;
    if (nextLesson >= allLessons.length) {
      router.back();
      return;
    }
    setLessonIdx(nextLesson);
    setQuestionIdx(0);
    setAnswered(false);
    setSelectedIndex(null);
    setSelectedBool(null);
    setIsCorrect(null);
    setShowSummary(false);
    setXpEarned(0);
    setCoinsEarned(0);
    setHeartsLost(0);
  }

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  if (!node || !currentLesson) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
          Lesson not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: colors.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showSummary) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Animated.View
          entering={FadeIn}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 28,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
          }}
        >
          <View style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: colors.success + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}>
            <Ionicons name="checkmark-circle" size={52} color={colors.success} />
          </View>

          <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, textAlign: "center", marginBottom: 8 }}>
            {allDone ? "Node Complete!" : "Lesson Complete!"}
          </Text>
          <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 36 }}>
            {currentLesson.title}
          </Text>

          <View style={{ flexDirection: "row", gap: 14, marginBottom: 36, width: "100%" }}>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, alignItems: "center" }}>
              <Ionicons name="flash" size={24} color={colors.accent} style={{ marginBottom: 6 }} />
              <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                +{xpEarned}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>XP EARNED</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, alignItems: "center" }}>
              <Ionicons name="ellipse" size={22} color="#FFB800" style={{ marginBottom: 6 }} />
              <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                +{coinsEarned}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>COINS</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, alignItems: "center" }}>
              <Ionicons name="flame" size={22} color="#FF7B00" style={{ marginBottom: 6 }} />
              <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {state.streak}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>DAY STREAK</Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              paddingVertical: 18,
              width: "100%",
              alignItems: "center",
            }}
            onPress={continueAfterSummary}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
              {allDone ? "Back to Tree" : "Next Lesson"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        paddingTop: paddingTop + 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={26} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Hearts */}
          <View style={{ flexDirection: "row", gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < state.hearts ? "heart" : "heart-outline"}
                size={20}
                color={i < state.hearts ? "#FF4757" : colors.muted}
              />
            ))}
          </View>

          <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
            {questionIdx + 1}/{totalQuestions}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{ height: 6, backgroundColor: colors.muted, borderRadius: 3, overflow: "hidden" }}>
          <Animated.View style={{
            height: "100%",
            width: `${progressWidth}%`,
            backgroundColor: course?.color ?? colors.primary,
            borderRadius: 3,
          }} />
        </View>
      </View>

      {/* Question */}
      <Animated.View style={[{ flex: 1 }, shakeStyle]}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: paddingBottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn} key={`${lessonIdx}-${questionIdx}`}>
            <View style={{
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignSelf: "flex-start",
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1 }}>
                {currentLesson.title.toUpperCase()}
              </Text>
            </View>

            <Text style={{
              fontSize: 22,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              lineHeight: 30,
              marginBottom: 28,
            }}>
              {currentQ.question}
            </Text>

            {currentQ.type === "multiple_choice" && (
              <MCQuestion
                question={currentQ}
                onAnswer={handleAnswer}
                answered={answered}
                selectedIndex={selectedIndex}
              />
            )}

            {currentQ.type === "true_false" && (
              <TFQuestion
                question={currentQ}
                onAnswer={handleAnswer}
                answered={answered}
                selectedBool={selectedBool}
              />
            )}

            {currentQ.type === "image_id" && (
              <MCQuestion
                question={currentQ}
                onAnswer={handleAnswer}
                answered={answered}
                selectedIndex={selectedIndex}
              />
            )}

            {answered && isCorrect !== null && (
              <Animated.View
                entering={FadeIn}
                style={{
                  marginTop: 20,
                  backgroundColor: isCorrect ? colors.success + "15" : colors.destructive + "15",
                  borderRadius: colors.radius,
                  padding: 16,
                  borderLeftWidth: 3,
                  borderLeftColor: isCorrect ? colors.success : colors.destructive,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Ionicons
                    name={isCorrect ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={isCorrect ? colors.success : colors.destructive}
                  />
                  <Text style={{
                    fontSize: 15,
                    fontFamily: "Nunito_800ExtraBold",
                    color: isCorrect ? colors.success : colors.destructive,
                  }}>
                    {isCorrect ? "Correct!" : "Not quite"}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.mutedForeground,
                  lineHeight: 20,
                }}>
                  {currentQ.explanation}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
