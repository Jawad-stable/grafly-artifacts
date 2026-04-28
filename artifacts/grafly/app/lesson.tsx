import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  BackHandler,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
  SlideInDown,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { voiceService } from "@/services/voiceService";
import { COURSES, findNodeById, type Question, type Lesson } from "@/constants/lessons";
import { adaptiveQuestions } from "@/utils/adaptive";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";
import {
  LessonIntroCard,
  ModuleCompleteCelebration,
  SpotBadDesignRenderer,
  ChooseBetterDesignRenderer,
  DragDropLayoutRenderer,
  FiveSecondTestRenderer,
  FindTheCTARenderer,
} from "@/components/LessonScenes";
import type { MascotState } from "@/constants/assets";

function MultipleChoice({
  question, onAnswer, answered, selectedIndex,
}: {
  question: Question; onAnswer: (i: number) => void;
  answered: boolean; selectedIndex: number | null;
}) {
  const colors = useColors();
  if (!question.options) return null;
  return (
    <View style={{ gap: 12 }}>
      {question.options.map((opt, i) => {
        let borderColor = colors.border;
        let bg = colors.card;
        let textColor = colors.foreground;
        let icon: "checkmark-circle" | "close-circle" | null = null;

        if (answered) {
          if (i === question.correctIndex) { borderColor = colors.success; bg = colors.success + "18"; textColor = colors.success; icon = "checkmark-circle"; }
          else if (i === selectedIndex) { borderColor = colors.destructive; bg = colors.destructive + "18"; textColor = colors.destructive; icon = "close-circle"; }
        }

        return (
          <TouchableOpacity
            key={i}
            style={{ backgroundColor: bg, borderRadius: colors.radius.md, paddingVertical: 18, paddingHorizontal: 20, borderWidth: 2, borderColor, flexDirection: "row", alignItems: "center", gap: 12 }}
            onPress={() => !answered && onAnswer(i)}
            disabled={answered}
            activeOpacity={0.8}
          >
            <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor, alignItems: "center", justifyContent: "center", backgroundColor: answered && i === question.correctIndex ? colors.success : "transparent" }}>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: answered && i === question.correctIndex ? "#fff" : textColor }}>
                {["A", "B", "C", "D"][i]}
              </Text>
            </View>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: "Nunito_600SemiBold", color: textColor, lineHeight: 22 }}>{opt}</Text>
            {icon && <Icon name={icon} size={22} color={icon === "checkmark-circle" ? colors.success : colors.destructive} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TrueFalse({
  question, onAnswer, answered, selectedBool,
}: {
  question: Question; onAnswer: (v: boolean) => void;
  answered: boolean; selectedBool: boolean | null;
}) {
  const colors = useColors();
  return (
    <View style={{
      flexDirection: "row",
      alignSelf: "stretch",
      width: "100%",
      gap: 14,
    }}>
      {[true, false].map((val) => {
        const isCorrectAnswer = answered && val === question.correctBool;
        const isWrongPick = answered && val === selectedBool && val !== question.correctBool;
        let borderColor = colors.border;
        let bg = colors.card;
        let textColor = colors.foreground;
        if (isCorrectAnswer) {
          borderColor = colors.success;
          bg = colors.success + "18";
          textColor = colors.success;
        } else if (isWrongPick) {
          borderColor = colors.destructive;
          bg = colors.destructive + "18";
          textColor = colors.destructive;
        }
        return (
          <TouchableOpacity
            key={String(val)}
            style={{
              flex: 1,
              backgroundColor: bg,
              borderRadius: 22,
              paddingVertical: 32,
              paddingHorizontal: 12,
              borderWidth: 2,
              borderColor,
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              minHeight: 130,
            }}
            onPress={() => !answered && onAnswer(val)}
            disabled={answered}
            activeOpacity={0.85}
          >
            {(isCorrectAnswer || isWrongPick) ? (
              <Icon name={isCorrectAnswer ? "checkmark-circle" : "close-circle"} size={30} color={textColor} />
            ) : null}
            <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: textColor, letterSpacing: 0.3 }}>
              {val ? "True" : "False"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SpotTheDifference({
  question, onAnswer, answered, selectedIndex,
}: {
  question: Question; onAnswer: (i: number) => void;
  answered: boolean; selectedIndex: number | null;
}) {
  const colors = useColors();
  if (!question.options) return null;
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 4 }}>
        Tap the odd one out
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {question.options.map((opt, i) => {
          let borderColor = colors.border;
          let bg = colors.card;
          let textColor = colors.foreground;
          if (answered) {
            if (i === question.correctIndex) { borderColor = colors.success; bg = colors.success + "18"; textColor = colors.success; }
            else if (i === selectedIndex) { borderColor = colors.destructive; bg = colors.destructive + "18"; textColor = colors.destructive; }
          }
          return (
            <TouchableOpacity
              key={i}
              style={{ width: "47%", borderRadius: colors.radius.md, paddingVertical: 22, paddingHorizontal: 16, borderWidth: 2, borderColor, backgroundColor: bg, alignItems: "center" }}
              onPress={() => !answered && onAnswer(i)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: textColor, textAlign: "center" }}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ArrangeInOrder({
  question, onAnswer,
}: {
  question: Question; onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
}) {
  const colors = useColors();
  const items = question.options ?? [];
  const [order, setOrder] = useState<number[]>(items.map((_, i) => i));
  const [submitted, setSubmitted] = useState(false);

  function moveUp(pos: number) {
    if (pos === 0 || submitted) return;
    const newOrder = [...order];
    [newOrder[pos - 1], newOrder[pos]] = [newOrder[pos], newOrder[pos - 1]];
    setOrder(newOrder);
  }
  function moveDown(pos: number) {
    if (pos === order.length - 1 || submitted) return;
    const newOrder = [...order];
    [newOrder[pos + 1], newOrder[pos]] = [newOrder[pos], newOrder[pos + 1]];
    setOrder(newOrder);
  }
  function submit() {
    if (submitted) return;
    setSubmitted(true);
    const correctOrder = question.correctOrder ?? items.map((_, i) => i);
    const correct = order.every((val, idx) => val === correctOrder[idx]);
    onAnswer(correct);
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 4 }}>
        Arrange in the correct order
      </Text>
      {order.map((itemIdx, pos) => (
        <View key={itemIdx} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius.md, padding: 16, flex: 1, borderWidth: 2, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>{items[itemIdx]}</Text>
          </View>
          <View style={{ gap: 6 }}>
            <TouchableOpacity onPress={() => moveUp(pos)} disabled={pos === 0 || submitted} style={{ opacity: pos === 0 || submitted ? 0.3 : 1 }}>
              <Icon name="chevron-up" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => moveDown(pos)} disabled={pos === order.length - 1 || submitted} style={{ opacity: pos === order.length - 1 || submitted ? 0.3 : 1 }}>
              <Icon name="chevron-down" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {!submitted && (
        <TouchableOpacity
          style={{ backgroundColor: colors.foreground, borderRadius: 100, paddingVertical: 18, alignItems: "center", marginTop: 6, flexDirection: "row", justifyContent: "center", gap: 10 }}
          onPress={submit}
          activeOpacity={0.88}
        >
          <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
            Submit order
          </Text>
          <Icon name="arrow-forward" size={18} color={colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function DragToMatch({
  question, onAnswer,
}: {
  question: Question; onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
}) {
  const colors = useColors();
  const pairs = question.pairs ?? [];
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const shuffledRight = React.useMemo(() => pairs.map((_, i) => i).sort(() => Math.random() - 0.5), []);

  function handleLeft(i: number) {
    if (submitted) return;
    setSelected(i === selected ? null : i);
  }

  function handleRight(j: number) {
    if (selected === null || submitted) return;
    setMatched((m) => ({ ...m, [selected]: j }));
    setSelected(null);
  }

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    const correct = pairs.every((_, i) => matched[i] === i);
    onAnswer(correct);
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 4 }}>
        Tap left then right to match pairs
      </Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1, gap: 10 }}>
          {pairs.map((pair, i) => {
            const isSelected = selected === i;
            const isMatched = matched[i] !== undefined;
            const correct = submitted && matched[i] === i;
            const wrong = submitted && isMatched && matched[i] !== i;
            return (
              <TouchableOpacity
                key={i}
                style={{ borderRadius: 14, padding: 14, borderWidth: 2, backgroundColor: isSelected ? colors.primary + "20" : correct ? colors.success + "18" : wrong ? colors.destructive + "18" : colors.card, borderColor: isSelected ? colors.primary : correct ? colors.success : wrong ? colors.destructive : isMatched ? colors.primary + "80" : colors.border }}
                onPress={() => handleLeft(i)}
                disabled={submitted}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.foreground, textAlign: "center" }}>{pair.left}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          {shuffledRight.map((rightIdx) => {
            const isMatchedBySelected = Object.values(matched).includes(rightIdx);
            return (
              <TouchableOpacity
                key={rightIdx}
                style={{ borderRadius: 14, padding: 14, borderWidth: 2, backgroundColor: isMatchedBySelected ? colors.primary + "20" : colors.card, borderColor: isMatchedBySelected ? colors.primary : colors.border }}
                onPress={() => handleRight(rightIdx)}
                disabled={submitted || selected === null}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.foreground, textAlign: "center" }}>{pairs[rightIdx].right}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {!submitted && pairs.every((_, i) => matched[i] !== undefined) && (
        <TouchableOpacity
          style={{ backgroundColor: colors.foreground, borderRadius: 100, paddingVertical: 18, alignItems: "center", marginTop: 6, flexDirection: "row", justifyContent: "center", gap: 10 }}
          onPress={submit}
          activeOpacity={0.88}
        >
          <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>Check matches</Text>
          <Icon name="arrow-forward" size={18} color={colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function FillInBlank({
  question, onAnswer,
}: {
  question: Question; onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
}) {
  const colors = useColors();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (submitted || !value.trim()) return;
    setSubmitted(true);
    const normalized = value.trim().toLowerCase();
    const correct = (question.acceptedAnswers ?? [question.blanks?.[0] ?? ""]).some(
      (a) => a.toLowerCase() === normalized
    );
    onAnswer(correct);
  }

  const isCorrect = submitted && (question.acceptedAnswers ?? [question.blanks?.[0] ?? ""]).some(
    (a) => a.toLowerCase() === value.trim().toLowerCase()
  );

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", lineHeight: 22 }}>
        {question.template ?? "Fill in the blank:"}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Type your answer..."
        placeholderTextColor={colors.mutedForeground}
        editable={!submitted}
        style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius.sm,
          paddingHorizontal: 20, paddingVertical: 16,
          fontSize: 18, fontFamily: "Nunito_800ExtraBold",
          color: submitted ? (isCorrect ? colors.success : colors.destructive) : colors.foreground,
          borderWidth: 2,
          borderColor: submitted ? (isCorrect ? colors.success : colors.destructive) : colors.border,
          textAlign: "center",
        }}
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      {submitted && !isCorrect && (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
          Correct answer: {question.blanks?.[0] ?? question.acceptedAnswers?.[0]}
        </Text>
      )}
      {!submitted && (
        <TouchableOpacity
          style={{ backgroundColor: value.trim() ? colors.foreground : colors.muted, borderRadius: 100, paddingVertical: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}
          onPress={submit}
          disabled={!value.trim()}
          activeOpacity={0.88}
        >
          <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: value.trim() ? colors.background : colors.mutedForeground }}>
            Submit answer
          </Text>
          {value.trim() ? <Icon name="arrow-forward" size={18} color={colors.background} /> : null}
        </TouchableOpacity>
      )}
    </View>
  );
}

function TapElement({
  question, onAnswer, answered, selectedIndex,
}: {
  question: Question; onAnswer: (i: number) => void;
  answered: boolean; selectedIndex: number | null;
}) {
  const colors = useColors();
  if (!question.options) return null;
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
        Tap the correct element
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {question.options.map((opt, i) => {
          let borderColor = colors.border;
          let bg = colors.card;
          let textColor = colors.foreground;
          if (answered) {
            if (i === question.correctIndex) { borderColor = colors.success; bg = colors.success + "18"; textColor = colors.success; }
            else if (i === selectedIndex) { borderColor = colors.destructive; bg = colors.destructive + "18"; textColor = colors.destructive; }
          }
          return (
            <TouchableOpacity
              key={i}
              style={{ borderRadius: 14, paddingVertical: 18, paddingHorizontal: 20, borderWidth: 2, borderColor, backgroundColor: bg, minWidth: "45%" }}
              onPress={() => !answered && onAnswer(i)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: textColor, textAlign: "center" }}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function QuestionRenderer({
  question, onAnswer, answered, selectedIndex, selectedBool,
}: {
  question: Question; onAnswer: (answer: number | boolean) => void;
  answered: boolean; selectedIndex: number | null; selectedBool: boolean | null;
}) {
  switch (question.type) {
    case "multiple_choice":
      return <MultipleChoice question={question} onAnswer={onAnswer as (i: number) => void} answered={answered} selectedIndex={selectedIndex} />;
    case "true_false":
      return <TrueFalse question={question} onAnswer={onAnswer as (v: boolean) => void} answered={answered} selectedBool={selectedBool} />;
    case "spot_the_difference":
      return <SpotTheDifference question={question} onAnswer={onAnswer as (i: number) => void} answered={answered} selectedIndex={selectedIndex} />;
    case "tap_the_element":
      return <TapElement question={question} onAnswer={onAnswer as (i: number) => void} answered={answered} selectedIndex={selectedIndex} />;
    case "arrange_in_order":
      return <ArrangeInOrder question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "drag_to_match":
      return <DragToMatch question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "fill_in_blank":
      return <FillInBlank question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "spot_bad_design":
      return <SpotBadDesignRenderer question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "choose_better_design":
      return <ChooseBetterDesignRenderer question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "drag_drop_layout":
      return <DragDropLayoutRenderer question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "five_second_test":
      return <FiveSecondTestRenderer question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    case "find_the_cta":
      return <FindTheCTARenderer question={question} onAnswer={(c) => onAnswer(c ? 0 : -1)} answered={answered} />;
    default:
      return <MultipleChoice question={question} onAnswer={onAnswer as (i: number) => void} answered={answered} selectedIndex={selectedIndex} />;
  }
}

export default function LessonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { nodeId } = useLocalSearchParams<{ nodeId: string }>();
  const { state, loseHeart, completeLesson, dispatch } = useGame();

  const node = nodeId ? findNodeById(nodeId) : null;
  const course = node ? COURSES.find((c) => c.id === node.courseId) : null;
  const allLessons: Lesson[] = node?.lessons ?? [];

  const [lessonIdx, setLessonIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [outOfHearts, setOutOfHearts] = useState(false);
  const paywallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending paywall redirect if the screen unmounts. Without
  // this, a user who left the lesson via Android back during the overlay
  // would still get teleported to the paywall from another screen.
  useEffect(() => {
    return () => {
      if (paywallTimerRef.current) {
        clearTimeout(paywallTimerRef.current);
        paywallTimerRef.current = null;
      }
    };
  }, []);

  const currentLesson = allLessons[lessonIdx];
  const questions = useMemo(
    () => (currentLesson ? adaptiveQuestions(currentLesson, state.placementLevel) : []),
    [currentLesson, state.placementLevel],
  );
  const currentQ = questions[questionIdx];
  const totalQuestions = questions.length;

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const progressPercent = totalQuestions > 0 ? (questionIdx / totalQuestions) * 100 : 0;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);

  // Centralized exit guard. If the user is mid-lesson (not on the summary,
  // not on the intro card before the first question), confirm before
  // dropping their progress. On the summary screen, just exit immediately
  // because there is nothing to lose.
  const confirmExit = useCallback(() => {
    const onSafeScreen =
      showSummary || (!!currentLesson?.intro && !introDismissed && questionIdx === 0);
    const exitNow = () => {
      if (paywallTimerRef.current) {
        clearTimeout(paywallTimerRef.current);
        paywallTimerRef.current = null;
      }
      if (router.canGoBack()) router.back();
      else router.replace("/");
    };
    // Once the out-of-hearts overlay is up, the lesson is effectively
    // already over. Skip the confirmation dialog and just leave cleanly.
    if (outOfHearts || onSafeScreen) {
      exitNow();
      return;
    }
    if (Platform.OS === "web") {
      const ok =
        typeof window !== "undefined"
          ? window.confirm("Exit lesson? Your progress for this lesson will be lost.")
          : true;
      if (ok) exitNow();
      return;
    }
    Alert.alert(
      "Exit lesson?",
      "Your progress for this lesson will be lost.",
      [
        { text: "Keep going", style: "cancel" },
        { text: "Exit", style: "destructive", onPress: exitNow },
      ],
      { cancelable: true },
    );
  }, [showSummary, currentLesson, introDismissed, questionIdx, outOfHearts]);

  // Intercept Android hardware back so it can't silently nuke lesson
  // progress. iOS uses the swipe gesture, which is opt-in and feels
  // more deliberate, so we leave that alone.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmExit();
      return true;
    });
    return () => sub.remove();
  }, [confirmExit]);

  if (!node || !currentLesson || !currentQ) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <GraflyMascot state="oops" size={120} />
        <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginTop: 20 }}>
          Lesson not found
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/");
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function getCorrect(q: Question, answer: number | boolean): boolean {
    if (q.type === "true_false") return (answer as boolean) === q.correctBool;
    if (
      q.type === "arrange_in_order" ||
      q.type === "drag_to_match" ||
      q.type === "fill_in_blank" ||
      q.type === "spot_bad_design" ||
      q.type === "choose_better_design" ||
      q.type === "drag_drop_layout" ||
      q.type === "five_second_test" ||
      q.type === "find_the_cta"
    ) return (answer as number) === 0;
    return (answer as number) === q.correctIndex;
  }

  async function handleAnswer(answer: number | boolean) {
    if (answered) return;
    const correct = getCorrect(currentQ, answer);

    setAnswered(true);
    setIsCorrect(correct);
    if (currentQ.type === "multiple_choice" || currentQ.type === "spot_the_difference" || currentQ.type === "tap_the_element") {
      setSelectedIndex(answer as number);
    }
    if (currentQ.type === "true_false") setSelectedBool(answer as boolean);

    if (correct) {
      setMascotState("correct");
      if (Platform.OS !== "web") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      voiceService.playCorrectAnswer();
    } else {
      setMascotState("wrong");
      if (Platform.OS !== "web") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-12, { duration: 60 }), withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      loseHeart();
      setHeartsLost((h) => h + 1);
      voiceService.playWrongAnswer();
      if (state.hearts - 1 <= 0) {
        setOutOfHearts(true);
        if (paywallTimerRef.current) clearTimeout(paywallTimerRef.current);
        paywallTimerRef.current = setTimeout(() => {
          paywallTimerRef.current = null;
          router.replace("/paywall" as any);
        }, 1600);
        return;
      }
    }
  }

  function handleNext() {
    if (!answered || isCorrect === null) return;
    setMascotState("think");
    advance(isCorrect);
  }

  function advance(wasCorrect: boolean) {
    const nextQ = questionIdx + 1;
    if (nextQ >= totalQuestions) {
      const lessonXP = currentLesson.xpReward + (!wasCorrect || heartsLost > 0 ? 0 : 10);
      const lessonCoins = currentLesson.coinReward;
      setXpEarned((x) => x + lessonXP);
      setCoinsEarned((c) => c + lessonCoins);
      completeLesson(currentLesson.id, lessonXP, lessonCoins);
      if (wasCorrect && heartsLost === 0) {
        dispatch({ type: "ADD_PERFECT_LESSON", lessonId: currentLesson.id });
      }
      const nextLesson = lessonIdx + 1;
      const moduleDone = nextLesson >= allLessons.length;
      if (moduleDone) setAllDone(true);
      setShowSummary(true);
      setMascotState(heartsLost === 0 ? "celebrate" : "correct");

      // Voice feedback on summary appearance — module-complete takes precedence.
      if (moduleDone && node) {
        voiceService.playModuleComplete(node.title);
      } else if (heartsLost === 0) {
        voiceService.playPerfectLesson();
      } else {
        voiceService.playLessonComplete();
      }
    } else {
      setQuestionIdx(nextQ);
      setAnswered(false);
      setSelectedIndex(null);
      setSelectedBool(null);
      setIsCorrect(null);
    }
  }

  function handleNextLesson() {
    const nextLessonIdx = lessonIdx + 1;
    if (nextLessonIdx < allLessons.length) {
      setLessonIdx(nextLessonIdx);
      setQuestionIdx(0);
      setIntroDismissed(false);
      setAnswered(false);
      setSelectedIndex(null);
      setSelectedBool(null);
      setIsCorrect(null);
      setShowSummary(false);
      setHeartsLost(0);
      setMascotState("think");
    } else {
      router.replace("/(tabs)");
    }
  }

  if (showSummary) {
    const perfect = heartsLost === 0;
    const moduleJustCompleted = allDone; // last lesson of this node finished
    const moduleCelebrationMsg = perfect
      ? `Flawless run through the ${node.title} module — you've earned this one.`
      : `You wrapped the entire ${node.title} module. The patterns are starting to click.`;
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: paddingTop + 20, paddingHorizontal: 24, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn} style={{ alignItems: "center", marginBottom: 32 }}>
            <GraflyMascot state={perfect ? "celebrate" : "correct"} size={140} float={perfect} />
            <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginTop: 20, marginBottom: 8, textAlign: "center" }}>
              {perfect ? "Perfect lesson!" : "Lesson complete!"}
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
              {currentLesson.title}
            </Text>
          </Animated.View>

          {moduleJustCompleted && (
            <ModuleCompleteCelebration
              moduleTitle={node.title}
              message={moduleCelebrationMsg}
              accentColor={course?.color}
            />
          )}

          {/* Rewards */}
          <Animated.View entering={FadeIn.delay(150)} style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius.md, padding: 20, alignItems: "center", gap: 8 }}>
              <Icon name="flash" size={28} color={colors.accent} />
              <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                +{xpEarned}
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                XP EARNED
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius.md, padding: 20, alignItems: "center", gap: 8 }}>
              <Icon name="coin" size={26} color={colors.warning} weight="fill" />
              <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                +{coinsEarned}
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                COINS
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius.md, padding: 20, alignItems: "center", gap: 8 }}>
              <Icon name="heart" size={26} color={perfect ? colors.success : colors.destructive} />
              <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {state.hearts}
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                HEARTS LEFT
              </Text>
            </View>
          </Animated.View>

          {/* Perfect bonus */}
          {perfect && (
            <Animated.View entering={FadeIn.delay(300)} style={{ backgroundColor: colors.accent + "20", borderRadius: colors.radius.md, padding: 16, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Icon name="star" size={22} color={colors.accent} />
              <Text style={{ flex: 1, fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                Perfect! +10 bonus XP for no mistakes
              </Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeIn.delay(400)} style={{ gap: 12 }}>
            {!allDone && (
              <PressScale
                style={{ backgroundColor: colors.foreground, borderRadius: 100, paddingVertical: 20, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}
                onPress={handleNextLesson}
              >
                <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                  Next lesson
                </Text>
                <Icon name="arrow-forward" size={18} color={colors.background} />
              </PressScale>
            )}
            <PressScale
              style={{ backgroundColor: allDone ? colors.foreground : colors.card, borderRadius: 100, paddingVertical: 20, alignItems: "center", borderWidth: allDone ? 0 : 1, borderColor: colors.border }}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: allDone ? colors.background : colors.foreground }}>
                {allDone ? "Back to home" : "Return home"}
              </Text>
            </PressScale>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  const QUESTION_TYPE_LABELS: Record<string, string> = {
    multiple_choice: "Choose the best answer",
    true_false: "True or false?",
    spot_the_difference: "Spot the odd one out",
    tap_the_element: "Tap the correct element",
    arrange_in_order: "Arrange in order",
    drag_to_match: "Match the pairs",
    fill_in_blank: "Fill in the blank",
    spot_bad_design: "Spot the bad design",
    choose_better_design: "Pick the better design",
    drag_drop_layout: "Stack the layout",
    five_second_test: "5-second test",
    find_the_cta: "Find the primary CTA",
  };

  // Lesson intro card — shown once before the very first question
  if (currentLesson.intro && !introDismissed && questionIdx === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ paddingTop: paddingTop + 8, paddingHorizontal: 24, paddingBottom: 12, flexDirection: "row", alignItems: "center", gap: 14 }}>
          <PressScale
            onPress={confirmExit}
            style={{ width: 38, height: 38, borderRadius: 100, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="close" size={20} color={colors.foreground} />
          </PressScale>
          <View style={{ flex: 1, height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${(lessonIdx / Math.max(1, allLessons.length)) * 100}%`, backgroundColor: course?.color ?? colors.primary, borderRadius: 4 }} />
          </View>
          <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
            {lessonIdx + 1}/{allLessons.length}
          </Text>
        </View>
        <LessonIntroCard
          intro={currentLesson.intro}
          lessonTitle={currentLesson.title}
          accentColor={course?.color}
          onContinue={() => setIntroDismissed(true)}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: paddingTop + 8, paddingHorizontal: 24, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <PressScale
            onPress={confirmExit}
            style={{ width: 38, height: 38, borderRadius: 100, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="close" size={20} color={colors.foreground} />
          </PressScale>

          {/* Progress bar */}
          <View style={{ flex: 1, height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
            <Animated.View style={{ height: "100%", width: `${progressPercent}%`, backgroundColor: course?.color ?? colors.primary, borderRadius: 4 }} />
          </View>

          {/* Hearts — ONLY on lesson screen */}
          <View style={{ flexDirection: "row", gap: 3 }}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name={i < state.hearts ? "heart" : "heart-outline"}
                size={18}
                color={i < state.hearts ? colors.destructive : colors.muted}
              />
            ))}
          </View>
        </View>
      </View>

      <Animated.View style={[shakeStyle, { flex: 1, minHeight: 0 }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mascot + question type label.
              Mascot bumped from 64 → 96 so it reads as the visual
              anchor of each question (per user: "make the mascot a bit
              bigger, make it noticeable"). The row keeps gap:12 and
              alignItems:center so the label block stays vertically
              centered against the larger mascot. */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <GraflyMascot state={mascotState} size={96} />
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: colors.card, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5, alignSelf: "flex-start", marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1 }}>
                  {(QUESTION_TYPE_LABELS[currentQ.type] ?? "Question").toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {currentLesson.title}
              </Text>
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              {questionIdx + 1}/{totalQuestions}
            </Text>
          </View>

          {/* Question */}
          <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 24, lineHeight: 32 }}>
            {currentQ.question}
          </Text>

          {/* Question component — keyed by question id so per-question local state resets between questions */}
          <QuestionRenderer
            key={currentQ.id}
            question={currentQ}
            onAnswer={handleAnswer}
            answered={answered}
            selectedIndex={selectedIndex}
            selectedBool={selectedBool}
          />
        </ScrollView>
      </Animated.View>

      {/* Sticky bottom feedback + CTA panel — Duolingo-style */}
      {answered && (isCorrect || state.hearts > 0) && (
        <Animated.View
          entering={SlideInDown.duration(260)}
          style={{
            backgroundColor: (isCorrect ? colors.success : colors.destructive) + "F2",
            paddingHorizontal: 24,
            paddingTop: 18,
            paddingBottom: 18 + Math.max(insets.bottom - 4, 0),
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          {/* Result label */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: currentQ.explanation ? 8 : 14 }}>
            <Icon
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={20}
              color={colors.destructiveForeground}
            />
            <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.destructiveForeground }}>
              {isCorrect ? "Correct!" : "Not quite"}
            </Text>
          </View>

          {/* Explanation (optional) */}
          {currentQ.explanation && (
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Nunito_600SemiBold",
                color: colors.destructiveForeground,
                lineHeight: 20,
                marginBottom: 14,
              }}
            >
              {currentQ.explanation}
            </Text>
          )}

          {/* Continue / Finish */}
          <PressScale
            onPress={handleNext}
            style={{
              backgroundColor: colors.background,
              borderRadius: 100,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Nunito_800ExtraBold",
                color: isCorrect ? colors.success : colors.destructive,
                letterSpacing: 0.4,
              }}
            >
              {questionIdx + 1 >= totalQuestions ? "Finish" : "Continue"}
            </Text>
            <Icon
              name="arrow-forward"
              size={18}
              color={isCorrect ? colors.success : colors.destructive}
            />
          </PressScale>
        </Animated.View>
      )}

      {/* Out-of-hearts overlay — gives the user a moment to register
          WHY they are about to be sent to the paywall, instead of a
          silent teleport. (Nielsen: visibility of system status.) */}
      {outOfHearts && (
        <Animated.View
          entering={FadeIn.duration(180)}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: colors.foreground + "E6",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
          pointerEvents="auto"
        >
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 24,
            paddingVertical: 28,
            paddingHorizontal: 24,
            alignItems: "center",
            gap: 10,
            width: "100%",
            maxWidth: 320,
          }}>
            <View style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="heart-outline" size={22} color={colors.destructive} />
              ))}
            </View>
            <Text style={{
              fontSize: 22,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              letterSpacing: -0.5,
              textAlign: "center",
            }}>
              Out of hearts
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground,
              textAlign: "center",
              lineHeight: 20,
            }}>
              Take a breather while we line up your options.
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
