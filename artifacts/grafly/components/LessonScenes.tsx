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
              LESSON · {lessonTitle.toUpperCase()}
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
                    GOOD
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
                    BAD
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
            Let's go
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
          Tap any element to lock in your guess
        </Text>
      )}
      {answered && tappedId && tappedId !== targetTapId && (
        <Text style={{ marginTop: 10, fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.destructive, textAlign: "center" }}>
          You tapped the wrong spot — the correct one is highlighted in green.
        </Text>
      )}
    </Animated.View>
  );
}

export function ChooseBetterDesignRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
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
      <Card idx={0} screen={left} label={leftLabel ?? "Option A"} />
      <Card idx={1} screen={right} label={rightLabel ?? "Option B"} />
    </Animated.View>
  );
}

export function DragDropLayoutRenderer({ question, answered, onAnswer }: MiniGameProps) {
  const colors = useColors();
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
            Lock in this order
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
            GLANCE — DON'T MEMORIZE
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
            Skip ahead
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
            Show me the screen again
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
          Tap the element you'd press first
        </Text>
      )}
      {answered && tappedId && tappedId !== correctTapId && (
        <Text style={{ marginTop: 10, fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.destructive, textAlign: "center" }}>
          Not quite — the primary CTA is highlighted in green.
        </Text>
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
          MODULE COMPLETE · {moduleTitle.toUpperCase()}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, lineHeight: 19 }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
