import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
  Easing,
  withRepeat,
  cancelAnimation,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import type {
  Question,
  ScreenSpec,
  SceneBlock,
  LessonIntro,
} from "@/constants/lessons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/hooks/useT";
import { PressScale } from "@/components/PressScale";
import { Icon } from "@/components/Icon";

// ---------------------------------------------------------------------------
// Primitive renderers
// ---------------------------------------------------------------------------

function RenderBlock({
  block,
  onTap,
  highlightTapId,
}: {
  block: SceneBlock;
  onTap?: (tapId: string) => void;
  highlightTapId?: string | null;
}) {
  const fontFamily = (weight?: "bold" | "black" | "regular") => {
    if (weight === "black") return "Nunito_900Black";
    if (weight === "bold") return "Nunito_800ExtraBold";
    return "Nunito_600SemiBold";
  };

  const wrapTap = (tapId: string | undefined, content: React.ReactNode) => {
    if (!tapId || !onTap) return content;
    const isHighlighted = highlightTapId === tapId;
    return (
      <Pressable
        onPress={() => onTap(tapId)}
        style={{
          borderRadius: 10,
          ...(isHighlighted
            ? { borderWidth: 3, borderColor: "#22DD88", padding: 2 }
            : {}),
        }}
      >
        {content}
      </Pressable>
    );
  };

  switch (block.kind) {
    case "title": {
      const node = (
        <Text
          style={{
            fontFamily: fontFamily(block.weight ?? "bold"),
            fontSize: block.size ?? 22,
            color: block.color ?? "#21263F",
            textAlign: block.align ?? "left",
          }}
        >
          {block.text}
        </Text>
      );
      return <>{wrapTap(block.tapId, node)}</>;
    }
    case "subtitle": {
      const node = (
        <Text
          style={{
            fontFamily: fontFamily(block.weight ?? "regular"),
            fontSize: block.size ?? 15,
            color: block.color ?? "#646A88",
            opacity: block.opacity ?? 1,
            textAlign: block.align ?? "left",
          }}
        >
          {block.text}
        </Text>
      );
      return <>{wrapTap(block.tapId, node)}</>;
    }
    case "body": {
      const node = (
        <Text
          numberOfLines={block.lines}
          style={{
            fontFamily: fontFamily(block.weight ?? "regular"),
            fontSize: block.size ?? 14,
            color: block.color ?? "#21263F",
            opacity: block.opacity ?? 1,
            textAlign: block.align ?? "left",
            lineHeight: (block.size ?? 14) * 1.45,
          }}
        >
          {block.text}
        </Text>
      );
      return <>{wrapTap(block.tapId, node)}</>;
    }
    case "button": {
      const node = (
        <View
          style={{
            backgroundColor: block.outline ? "transparent" : block.bg,
            borderColor: block.outline ? block.bg : "transparent",
            borderWidth: block.outline ? 1.5 : 0,
            paddingVertical: block.large ? 14 : 11,
            paddingHorizontal: 18,
            borderRadius: block.rounded ?? 12,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito_800ExtraBold",
              fontSize: block.large ? 15 : 14,
              color: block.outline ? block.bg : block.fg,
            }}
          >
            {block.text}
          </Text>
        </View>
      );
      return <>{wrapTap(block.tapId, node)}</>;
    }
    case "tag":
      return (
        <View
          style={{
            backgroundColor: block.bg,
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 100,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 11, color: block.fg }}>
            {block.text}
          </Text>
        </View>
      );
    case "image": {
      const node = (
        <View
          style={{
            backgroundColor: block.bg,
            height: block.height,
            borderRadius: block.rounded ?? 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {block.emoji ? <Text style={{ fontSize: 32 }}>{block.emoji}</Text> : null}
        </View>
      );
      return <>{wrapTap(block.tapId, node)}</>;
    }
    case "spacer":
      return <View style={{ height: block.size }} />;
    case "row":
      return (
        <View
          style={{
            flexDirection: "row",
            gap: block.gap ?? 8,
            alignItems:
              block.align === "between"
                ? "center"
                : block.align === "end"
                ? "flex-end"
                : block.align === "start"
                ? "flex-start"
                : "center",
            justifyContent: block.align === "between" ? "space-between" : "flex-start",
          }}
        >
          {block.children.map((c, i) => (
            <View key={i} style={{ flex: c.kind === "button" ? 1 : undefined }}>
              <RenderBlock block={c} onTap={onTap} highlightTapId={highlightTapId} />
            </View>
          ))}
        </View>
      );
    case "card":
      return (
        <View
          style={{
            backgroundColor: block.bg ?? "#F5F6FA",
            padding: block.padding ?? 12,
            borderRadius: block.rounded ?? 14,
            borderWidth: block.border ? 1 : 0,
            borderColor: block.border ?? "transparent",
            gap: 6,
          }}
        >
          {block.children.map((c, i) => (
            <RenderBlock key={i} block={c} onTap={onTap} highlightTapId={highlightTapId} />
          ))}
        </View>
      );
    case "divider":
      return <View style={{ height: 1, backgroundColor: block.color ?? "#DDE1EE", marginVertical: 4 }} />;
    case "stat":
      return (
        <View
          style={{
            backgroundColor: block.bg ?? "#F5F6FA",
            padding: 12,
            borderRadius: 12,
            flex: 1,
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "#646A88" }}>
            {block.label}
          </Text>
          <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: block.fg ?? "#21263F" }}>
            {block.value}
          </Text>
        </View>
      );
    default:
      return null;
  }
}

export function RenderScreen({
  screen,
  onTap,
  highlightTapId,
}: {
  screen: ScreenSpec;
  onTap?: (tapId: string) => void;
  highlightTapId?: string | null;
}) {
  return (
    <View
      style={{
        backgroundColor: screen.bg,
        padding: screen.padding ?? 12,
        gap: 6,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {screen.blocks.map((b, i) => (
        <RenderBlock key={i} block={b} onTap={onTap} highlightTapId={highlightTapId} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Lesson intro card — shown once before the first question of every lesson
// ---------------------------------------------------------------------------

export function LessonIntroCard({
  intro,
  lessonTitle,
  accentColor,
  onContinue,
}: {
  intro: LessonIntro;
  lessonTitle: string;
  accentColor?: string;
  onContinue: () => void;
}) {
  const colors = useColors();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const accent = accentColor ?? colors.primary;

  return (
    <Animated.View entering={FadeIn.duration(280)} style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(420)}>
          <View
            style={{
              backgroundColor: accent + "22",
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 100,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Nunito_800ExtraBold",
                color: accent,
                letterSpacing: 1,
              }}
            >
              {t("scenes.lessonEyebrow", { title: lessonTitle.toUpperCase() })}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Nunito_900Black",
              color: colors.foreground,
              lineHeight: 34,
              marginBottom: 14,
            }}
          >
            {intro.headline}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground,
              lineHeight: 24,
              marginBottom: 22,
            }}
          >
            {intro.body}
          </Text>
        </Animated.View>

        {intro.scene && intro.scene.kind === "good_vs_bad" && (
          <Animated.View entering={FadeInDown.duration(500).delay(120)}>
            <View style={{ gap: 14 }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Icon name="checkmark-circle" size={18} color={colors.success} weight="fill" />
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.success, letterSpacing: 0.5 }}>
                    {t("scenes.good")}
                  </Text>
                </View>
                <RenderScreen screen={intro.scene.good} />
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 8, lineHeight: 17 }}>
                  {intro.scene.goodNote}
                </Text>
              </View>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Icon name="close-circle" size={18} color={colors.destructive} weight="fill" />
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.destructive, letterSpacing: 0.5 }}>
                    {t("scenes.bad")}
                  </Text>
                </View>
                <RenderScreen screen={intro.scene.bad} />
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 8, lineHeight: 17 }}>
                  {intro.scene.badNote}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Sticky bottom CTA — sibling of ScrollView so it pins to the bottom */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(280)}
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12) + 8,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <PressScale
          onPress={onContinue}
          style={{
            backgroundColor: colors.foreground,
            borderRadius: 100,
            paddingVertical: 18,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
            {t("scenes.letsGo")}
          </Text>
          <Icon name="arrow-forward" size={18} color={colors.background} />
        </PressScale>
      </Animated.View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Mini-game renderers
// ---------------------------------------------------------------------------

interface MiniGameProps {
  question: Question;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function SpotBadDesignRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const [tappedId, setTappedId] = useState<string | null>(null);
  if (!question.scene || question.scene.kind !== "spot_bad") return null;
  const { screen, prompt, targetTapId } = question.scene;

  function handleTap(id: string) {
    if (answered) return;
    setTappedId(id);
    onAnswer(id === targetTapId);
  }

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}
      <RenderScreen
        screen={screen}
        onTap={handleTap}
        highlightTapId={answered ? targetTapId : null}
      />
      {!answered && (
        <Text style={{ marginTop: 12, fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
          {t("scenes.tapAnyElement")}
        </Text>
      )}
      {answered && tappedId && tappedId !== targetTapId && (
        <Text style={{ marginTop: 10, fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.destructive, textAlign: "center" }}>
          {t("scenes.wrongSpot")}
        </Text>
      )}
    </Animated.View>
  );
}

export function ChooseBetterDesignRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const [picked, setPicked] = useState<0 | 1 | null>(null);
  if (!question.scene || question.scene.kind !== "ab_compare") return null;
  const { left, right, correctIndex, prompt, leftLabel, rightLabel } = question.scene;

  function pick(idx: 0 | 1) {
    if (answered) return;
    setPicked(idx);
    onAnswer(idx === correctIndex);
  }

  const Card = ({ idx, screen, label }: { idx: 0 | 1; screen: ScreenSpec; label: string }) => {
    const isPicked = picked === idx;
    const isCorrect = answered && idx === correctIndex;
    const isWrong = answered && isPicked && idx !== correctIndex;
    const ringColor = isCorrect ? colors.success : isWrong ? colors.destructive : "transparent";
    return (
      <PressScale onPress={() => pick(idx)} disabled={answered} style={{ marginBottom: 12 }}>
        <View
          style={{
            borderWidth: 3,
            borderColor: ringColor,
            borderRadius: 20,
            padding: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {label}
            </Text>
            {isCorrect && <Icon name="checkmark-circle" size={18} color={colors.success} weight="fill" />}
            {isWrong && <Icon name="close-circle" size={18} color={colors.destructive} weight="fill" />}
          </View>
          <RenderScreen screen={screen} />
        </View>
      </PressScale>
    );
  };

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}
      <Card idx={0} screen={left} label={leftLabel ?? t("scenes.optionA")} />
      <Card idx={1} screen={right} label={rightLabel ?? t("scenes.optionB")} />
    </Animated.View>
  );
}

export function DragDropLayoutRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const scene = question.scene;
  const initialOrder = useMemo(() => {
    if (!scene || scene.kind !== "drag_layout") return [];
    return scene.cards.map((c) => c.id);
  }, [scene]);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [movedId, setMovedId] = useState<string | null>(null);

  if (!scene || scene.kind !== "drag_layout") return null;
  const { cards, correctOrder, prompt } = scene;
  const cardById = Object.fromEntries(cards.map((c) => [c.id, c]));

  function move(id: string, dir: -1 | 1) {
    if (answered) return;
    const i = order.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = order.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setMovedId(id);
    setTimeout(() => setMovedId((m) => (m === id ? null : m)), 350);
  }

  function submit() {
    const correct = order.every((id, i) => id === correctOrder[i]);
    onAnswer(correct);
  }

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}
      <View style={{ gap: 10 }}>
        {order.map((id, i) => {
          const card = cardById[id];
          if (!card) return null;
          const moving = movedId === id;
          const isCorrectSpot = answered && correctOrder[i] === id;
          const isWrongSpot = answered && correctOrder[i] !== id;
          const tone =
            card.tone === "danger"
              ? colors.destructive
              : card.tone === "accent"
              ? colors.primary
              : colors.foreground;
          return (
            <DraggableCard
              key={id}
              moving={moving}
              isCorrectSpot={isCorrectSpot}
              isWrongSpot={isWrongSpot}
            >
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: tone,
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.muted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    {card.label}
                  </Text>
                  {card.sub && (
                    <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }}>
                      {card.sub}
                    </Text>
                  )}
                </View>
                {!answered && (
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <PressScale
                      onPress={() => move(id, -1)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: colors.muted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="chevron-up" size={16} color={colors.foreground} />
                    </PressScale>
                    <PressScale
                      onPress={() => move(id, 1)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: colors.muted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="chevron-down" size={16} color={colors.foreground} />
                    </PressScale>
                  </View>
                )}
                {answered && isCorrectSpot && <Icon name="checkmark-circle" size={20} color={colors.success} weight="fill" />}
                {answered && isWrongSpot && <Icon name="close-circle" size={20} color={colors.destructive} weight="fill" />}
              </View>
            </DraggableCard>
          );
        })}
      </View>

      {!answered && (
        <PressScale
          onPress={submit}
          style={{
            marginTop: 18,
            backgroundColor: colors.foreground,
            borderRadius: 100,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
            {t("scenes.lockInOrder")}
          </Text>
        </PressScale>
      )}
    </Animated.View>
  );
}

function DraggableCard({
  moving,
  isCorrectSpot,
  isWrongSpot,
  children,
}: {
  moving: boolean;
  isCorrectSpot: boolean;
  isWrongSpot: boolean;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  useEffect(() => {
    if (moving) {
      scale.value = withSequence(
        withTiming(1.03, { duration: 130, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) }),
      );
      lift.value = withSequence(
        withTiming(8, { duration: 130 }),
        withTiming(0, { duration: 200 }),
      );
    }
  }, [moving]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: -lift.value }],
    shadowOpacity: 0.08 + (lift.value / 40),
    shadowRadius: 6 + (lift.value / 2),
    shadowOffset: { width: 0, height: 2 + lift.value / 4 },
    shadowColor: "#000",
    elevation: 2 + lift.value / 2,
  }));

  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      style={[
        animStyle,
        isCorrectSpot ? { borderRadius: 16, borderWidth: 0 } : null,
        isWrongSpot ? { opacity: 0.92 } : null,
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function FiveSecondTestRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const scene = question.scene;
  const [phase, setPhase] = useState<"preview" | "question">("preview");
  const [picked, setPicked] = useState<number | null>(null);

  const totalMs = scene && scene.kind === "five_sec" ? scene.durationMs ?? 5000 : 5000;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (phase === "preview") {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: totalMs,
        easing: Easing.linear,
      });
      const t = setTimeout(() => setPhase("question"), totalMs);
      return () => {
        clearTimeout(t);
        cancelAnimation(progress);
      };
    }
  }, [phase, totalMs]);

  if (!scene || scene.kind !== "five_sec") return null;
  const { screen, followUp } = scene;

  if (phase === "preview") {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <CountdownRing remainingMs={totalMs} totalMs={totalMs} progress={progress} />
          <Text style={{ marginTop: 6, fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1 }}>
            {t("scenes.glance")}
          </Text>
        </View>
        <RenderScreen screen={screen} />
        <PressScale
          onPress={() => setPhase("question")}
          style={{
            marginTop: 14,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 100,
            backgroundColor: colors.muted,
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {t("scenes.skipAhead")}
          </Text>
        </PressScale>
      </Animated.View>
    );
  }

  // Question phase
  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    onAnswer(i === followUp.correctIndex);
  }

  return (
    <Animated.View entering={FadeIn.duration(360)}>
      <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 16, lineHeight: 22 }}>
        {followUp.question}
      </Text>
      <View style={{ gap: 10 }}>
        {followUp.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = answered && i === followUp.correctIndex;
          const isWrong = answered && isPicked && i !== followUp.correctIndex;
          return (
            <PressScale
              key={i}
              disabled={answered}
              onPress={() => pick(i)}
              style={{
                backgroundColor: isCorrect
                  ? colors.success + "22"
                  : isWrong
                  ? colors.destructive + "22"
                  : colors.card,
                borderColor: isCorrect
                  ? colors.success
                  : isWrong
                  ? colors.destructive
                  : colors.border,
                borderWidth: 1.5,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ flex: 1, fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {opt}
              </Text>
              {isCorrect && <Icon name="checkmark-circle" size={20} color={colors.success} weight="fill" />}
              {isWrong && <Icon name="close-circle" size={20} color={colors.destructive} weight="fill" />}
            </PressScale>
          );
        })}
      </View>
      {answered && (
        <PressScale
          onPress={() => setPhase("preview")}
          style={{
            marginTop: 16,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 100,
            backgroundColor: colors.muted,
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Icon name="arrow-back" size={16} color={colors.foreground} />
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {t("scenes.showAgain")}
          </Text>
        </PressScale>
      )}
    </Animated.View>
  );
}

function CountdownRing({
  totalMs,
  progress,
}: {
  remainingMs: number;
  totalMs: number;
  progress: SharedValue<number>;
}) {
  const colors = useColors();
  const r = 26;
  const c = 2 * Math.PI * r;
  const [secs, setSecs] = useState(Math.ceil(totalMs / 1000));

  useEffect(() => {
    setSecs(Math.ceil(totalMs / 1000));
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
      setSecs(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [totalMs]);

  return (
    <View style={{ width: 64, height: 64, alignItems: "center", justifyContent: "center" }}>
      <Svg width={64} height={64}>
        <Circle cx={32} cy={32} r={r} stroke={colors.muted} strokeWidth={5} fill="none" />
        <AnimatedRingArc r={r} c={c} progress={progress} color={colors.primary} />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 22, fontFamily: "Nunito_900Black", color: colors.foreground }}>
          {secs}
        </Text>
      </View>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function AnimatedRingArc({
  r,
  c,
  progress,
  color,
}: {
  r: number;
  c: number;
  progress: SharedValue<number>;
  color: string;
}) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - progress.value),
  }));
  return (
    <AnimatedCircle
      cx={32}
      cy={32}
      r={r}
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={c}
      animatedProps={animatedProps}
      transform="rotate(-90 32 32)"
    />
  );
}

export function FindTheCTARenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const [tappedId, setTappedId] = useState<string | null>(null);
  if (!question.scene || question.scene.kind !== "find_cta") return null;
  const { screen, prompt, correctTapId } = question.scene;

  function handleTap(id: string) {
    if (answered) return;
    setTappedId(id);
    onAnswer(id === correctTapId);
  }

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}
      <RenderScreen
        screen={screen}
        onTap={handleTap}
        highlightTapId={answered ? correctTapId : null}
      />
      {!answered && (
        <Text style={{ marginTop: 12, fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
          {t("scenes.tapPrimaryFirst")}
        </Text>
      )}
      {answered && tappedId && tappedId !== correctTapId && (
        <Text style={{ marginTop: 10, fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.destructive, textAlign: "center" }}>
          {t("scenes.notQuiteCTA")}
        </Text>
      )}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Color math helpers — used by the Color Theory mini-games. All math is
// self-contained so the games work offline / without any extra deps.
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const safe = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(safe.slice(0, 2), 16),
    g: parseInt(safe.slice(2, 4), 16),
    b: parseInt(safe.slice(4, 6), 16),
  };
}
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function relLum({ r, g, b }: { r: number; g: number; b: number }): number {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
function contrastRatio(a: string, b: string): number {
  const la = relLum(hexToRgb(a));
  const lb = relLum(hexToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
// step in [-100, 100]: negative mixes toward black, positive toward white.
function shiftLightness(hex: string, step: number): string {
  const { r, g, b } = hexToRgb(hex);
  const t = Math.abs(step) / 100;
  if (step >= 0) return rgbToHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t);
  return rgbToHex(r * (1 - t), g * (1 - t), b * (1 - t));
}

// ---------------------------------------------------------------------------
// Color Match — tap the swatch that satisfies a color rule (matches a target
// hue, the complement of a base, the warmest of a set, etc.).
// ---------------------------------------------------------------------------

export function ColorMatchRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const [picked, setPicked] = useState<number | null>(null);
  if (!question.scene || question.scene.kind !== "color_match") return null;
  const { targetHex, targetLabel, choices, correctIndex, prompt } = question.scene;

  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    onAnswer(i === correctIndex);
  }

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}

      {/* Target swatch — large, labeled, with hex */}
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 8 }}>
          {targetLabel ?? t("scenes.target")}
        </Text>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            backgroundColor: targetHex,
            borderWidth: 2,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: contrastRatio(targetHex, "#FFFFFF") >= 3 ? "#FFFFFF" : "#21263F", letterSpacing: 1 }}>
            {targetHex.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Choices — 2 columns */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        {choices.map((hex, i) => {
          const isPicked = picked === i;
          const isCorrect = answered && i === correctIndex;
          const isWrong = answered && isPicked && i !== correctIndex;
          const ringColor = isCorrect
            ? colors.success
            : isWrong
            ? colors.destructive
            : isPicked
            ? colors.primary
            : "transparent";
          return (
            <PressScale
              key={i}
              onPress={() => pick(i)}
              disabled={answered}
              style={{ width: "47%" }}
            >
              <View
                style={{
                  borderWidth: 3,
                  borderColor: ringColor,
                  borderRadius: 18,
                  padding: 4,
                }}
              >
                <View
                  style={{
                    height: 100,
                    borderRadius: 14,
                    backgroundColor: hex,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: contrastRatio(hex, "#FFFFFF") >= 3 ? "#FFFFFF" : "#21263F", letterSpacing: 1 }}>
                    {hex.toUpperCase()}
                  </Text>
                </View>
              </View>
              {isCorrect && (
                <View style={{ position: "absolute", top: -8, right: -8, backgroundColor: colors.success, borderRadius: 14, padding: 2 }}>
                  <Icon name="checkmark-circle" size={22} color={colors.background} weight="fill" />
                </View>
              )}
              {isWrong && (
                <View style={{ position: "absolute", top: -8, right: -8, backgroundColor: colors.destructive, borderRadius: 14, padding: 2 }}>
                  <Icon name="close-circle" size={22} color={colors.background} weight="fill" />
                </View>
              )}
            </PressScale>
          );
        })}
      </View>

      {!answered && (
        <Text style={{ marginTop: 14, fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
          {t("scenes.tapMatchingSwatch")}
        </Text>
      )}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Contrast Check — live WCAG ratio computation. Player adjusts text lightness
// with -/+ steppers and sees the ratio update in real time. Lock-in is
// gated by the target ratio.
// ---------------------------------------------------------------------------

export function ContrastCheckRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [lockedStep, setLockedStep] = useState<number | null>(null);
  if (!question.scene || question.scene.kind !== "contrast_check") return null;
  const { bgHex, startTextHex, sampleHeading, sampleBody, targetMinRatio, prompt } =
    question.scene;

  const currentTextHex = useMemo(
    () => shiftLightness(startTextHex, lockedStep ?? step),
    [startTextHex, step, lockedStep],
  );
  const ratio = useMemo(() => contrastRatio(currentTextHex, bgHex), [currentTextHex, bgHex]);
  const passes = ratio >= targetMinRatio;

  function nudge(delta: number) {
    if (answered) return;
    setStep((s) => Math.max(-100, Math.min(100, s + delta)));
  }

  function lockIn() {
    if (answered) return;
    setLockedStep(step);
    onAnswer(passes);
  }

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}

      {/* Live preview card — text recolors as you nudge */}
      <View
        style={{
          backgroundColor: bgHex,
          borderRadius: 18,
          padding: 22,
          gap: 8,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: currentTextHex, lineHeight: 28 }}>
          {sampleHeading}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: currentTextHex, lineHeight: 20 }}>
          {sampleBody}
        </Text>
      </View>

      {/* Ratio readout + pass badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderRadius: 14,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1 }}>
            {t("scenes.contrastRatio").toUpperCase()}
          </Text>
          <Text style={{ fontSize: 24, fontFamily: "Nunito_900Black", color: colors.foreground, marginTop: 2 }}>
            {ratio.toFixed(2)}:1
          </Text>
          <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }}>
            {t("scenes.contrastTarget", { ratio: targetMinRatio.toFixed(1) })}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 100,
            backgroundColor: passes ? colors.success + "22" : colors.destructive + "22",
            borderWidth: 1.5,
            borderColor: passes ? colors.success : colors.destructive,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: passes ? colors.success : colors.destructive, letterSpacing: 1 }}>
            {passes ? t("scenes.contrastPass") : t("scenes.contrastFail")}
          </Text>
        </View>
      </View>

      {/* +/- steppers */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
        <PressScale
          onPress={() => nudge(-10)}
          disabled={answered}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 14,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: answered ? 0.6 : 1,
          }}
        >
          <Icon name="remove" size={18} color={colors.foreground} />
          <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {t("scenes.contrastDarker")}
          </Text>
        </PressScale>
        <PressScale
          onPress={() => nudge(10)}
          disabled={answered}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 14,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: answered ? 0.6 : 1,
          }}
        >
          <Icon name="add" size={18} color={colors.foreground} />
          <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {t("scenes.contrastLighter")}
          </Text>
        </PressScale>
      </View>

      {!answered && (
        <PressScale
          onPress={lockIn}
          disabled={!passes}
          style={{
            backgroundColor: passes ? colors.foreground : colors.muted,
            borderRadius: 100,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: passes ? colors.background : colors.mutedForeground }}>
            {passes ? t("scenes.contrastLockIn") : t("scenes.contrastNeedsMore")}
          </Text>
        </PressScale>
      )}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Palette Build — multi-select N swatches that complete a harmony rule
// from a base color. Lock-in checks the selected set against the answer.
// ---------------------------------------------------------------------------

export function PaletteBuildRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
  const { t } = useT();
  const [selected, setSelected] = useState<number[]>([]);
  if (!question.scene || question.scene.kind !== "palette_build") return null;
  const { baseHex, baseLabel, choices, correctIndices, selectCount, ruleLabel, prompt } =
    question.scene;

  function toggle(i: number) {
    if (answered) return;
    setSelected((cur) => {
      if (cur.includes(i)) return cur.filter((x) => x !== i);
      if (cur.length >= selectCount) return cur;
      return [...cur, i];
    });
  }

  function lockIn() {
    if (answered) return;
    const correctSet = new Set(correctIndices);
    const selSet = new Set(selected);
    const ok =
      correctSet.size === selSet.size &&
      [...correctSet].every((i) => selSet.has(i));
    onAnswer(ok);
  }

  const ready = selected.length === selectCount;

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      {prompt ? (
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
          {prompt}
        </Text>
      ) : null}

      {/* Base swatch */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16, backgroundColor: colors.card, borderRadius: 14, padding: 12 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            backgroundColor: baseHex,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
            {baseLabel ?? t("scenes.paletteBase")}
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginTop: 2 }}>
            {baseHex.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 10, textAlign: "center" }}>
        {t("scenes.palettePickN", { n: selectCount, rule: ruleLabel })}
      </Text>

      {/* Choices grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        {choices.map((hex, i) => {
          const isSel = selected.includes(i);
          const isCorrect = answered && correctIndices.includes(i);
          const isWrongSel = answered && isSel && !correctIndices.includes(i);
          const ringColor = isCorrect
            ? colors.success
            : isWrongSel
            ? colors.destructive
            : isSel
            ? colors.primary
            : "transparent";
          return (
            <PressScale
              key={i}
              onPress={() => toggle(i)}
              disabled={answered}
              style={{ width: "30.5%" }}
            >
              <View
                style={{
                  borderWidth: 3,
                  borderColor: ringColor,
                  borderRadius: 14,
                  padding: 3,
                }}
              >
                <View
                  style={{
                    height: 70,
                    borderRadius: 10,
                    backgroundColor: hex,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSel && !answered && (
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
                      <Icon name="checkmark" size={14} color={colors.primary} />
                    </View>
                  )}
                  {isCorrect && (
                    <Icon name="checkmark-circle" size={22} color="#FFFFFF" weight="fill" />
                  )}
                </View>
              </View>
            </PressScale>
          );
        })}
      </View>

      <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 12 }}>
        {t("scenes.paletteSelected", { n: selected.length, total: selectCount })}
      </Text>

      {!answered && (
        <PressScale
          onPress={lockIn}
          disabled={!ready}
          style={{
            backgroundColor: ready ? colors.foreground : colors.muted,
            borderRadius: 100,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: ready ? colors.background : colors.mutedForeground }}>
            {t("scenes.paletteLockIn")}
          </Text>
        </PressScale>
      )}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Module-complete celebration overlay (shown on the lesson summary screen
// when finishing the LAST lesson of a module)
// ---------------------------------------------------------------------------

export function ModuleCompleteCelebration({
  moduleTitle,
  message,
  accentColor,
}: {
  moduleTitle: string;
  message: string;
  accentColor?: string;
}) {
  const colors = useColors();
  const { t } = useT();
  const accent = accentColor ?? colors.accent;
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(pulse);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[
        animStyle,
        {
          backgroundColor: accent + "22",
          borderRadius: 20,
          padding: 18,
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          borderWidth: 1.5,
          borderColor: accent,
        },
      ]}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="trophy" size={24} color={colors.background} weight="fill" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: accent, letterSpacing: 1 }}>
          {t("scenes.moduleComplete", { title: moduleTitle.toUpperCase() })}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, lineHeight: 19 }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
