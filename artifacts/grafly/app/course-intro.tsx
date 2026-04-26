import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES } from "@/constants/lessons";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";
import { onBrand } from "@/constants/contrast";

const VALUE_BEATS = [
  {
    icon: "eye-outline" as const,
    title: "Train your eye",
    body: "Spot the difference between forgettable and unforgettable in seconds.",
  },
  {
    icon: "hand-left-outline" as const,
    title: "Learn by doing",
    body: "Five interactive game types — drag, tap, time, compare. Zero passive reading.",
  },
  {
    icon: "bulb-outline" as const,
    title: "Understand the why",
    body: "Every rule lands with a real example so it actually sticks.",
  },
];

const PREVIEW_TYPES = [
  { label: "Spot the bad design", icon: "search-outline" as const, color: "#FF7BD0" },
  { label: "Pick the better design", icon: "swap-horizontal-outline" as const, color: "#00A4FA" },
  { label: "Stack the layout", icon: "layers-outline" as const, color: "#E3ED43" },
  { label: "5-second test", icon: "timer-outline" as const, color: "#A78BFA" },
  { label: "Find the primary CTA", icon: "locate-outline" as const, color: "#22DD88" },
];

function PreviewChip({ label, icon, color, delay }: typeof PREVIEW_TYPES[number] & { delay: number }) {
  const colors = useColors();
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(3, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(float);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(420)} style={animStyle}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 100,
          paddingVertical: 12,
          paddingHorizontal: 14,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: color + "26",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={16} color={color} />
        </View>
        <Text style={{ flex: 1, fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function CourseIntroScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const params = useLocalSearchParams<{ courseId?: string }>();

  const course = useMemo(() => {
    const id = params.courseId ?? "design-principles";
    return COURSES.find((c) => c.id === id) ?? COURSES[0];
  }, [params.courseId]);

  const totalLessons = course.nodes.flatMap((n) => n.lessons).length;
  const completedLessons = course.nodes
    .flatMap((n) => n.lessons)
    .filter((l) => state.completedLessons.includes(l.id)).length;
  const onCourse = onBrand(course.color);

  const firstNode = course.nodes[0];
  const firstUnstartedNode = course.nodes.find((n) =>
    n.lessons.some((l) => !state.completedLessons.includes(l.id)),
  ) ?? firstNode;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: paddingTop + 8,
          paddingHorizontal: 24,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <PressScale
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/(tabs)");
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 100,
            backgroundColor: colors.card,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="close" size={20} color={colors.foreground} />
        </PressScale>
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.mutedForeground,
            letterSpacing: 1.5,
          }}
        >
          COURSE WELCOME
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <Animated.View
          entering={FadeInDown.duration(560).easing(Easing.out(Easing.cubic))}
          style={{
            backgroundColor: course.color,
            borderRadius: 28,
            padding: 22,
            marginTop: 10,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#FFFFFF22",
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                backgroundColor: onCourse + "22",
                borderWidth: 1.5,
                borderColor: onCourse + "44",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={course.icon as any} size={28} color={onCourse} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Nunito_800ExtraBold",
                  color: onCourse + "CC",
                  letterSpacing: 1.6,
                  marginBottom: 3,
                }}
              >
                COURSE
              </Text>
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: "Nunito_900Black",
                  color: onCourse,
                  letterSpacing: -0.5,
                  lineHeight: 30,
                }}
              >
                {course.title}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Nunito_600SemiBold",
              color: onCourse + "EE",
              lineHeight: 22,
              marginBottom: 18,
            }}
          >
            {course.description}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                backgroundColor: onCourse + "22",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, fontFamily: "Nunito_900Black", color: onCourse }}>
                {course.nodes.length}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: onCourse + "DD", letterSpacing: 1 }}>
                MODULES
              </Text>
            </View>
            <View
              style={{
                backgroundColor: onCourse + "22",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, fontFamily: "Nunito_900Black", color: onCourse }}>
                {totalLessons}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: onCourse + "DD", letterSpacing: 1 }}>
                LESSONS
              </Text>
            </View>
            <View
              style={{
                backgroundColor: onCourse + "22",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, fontFamily: "Nunito_900Black", color: onCourse }}>5</Text>
              <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: onCourse + "DD", letterSpacing: 1 }}>
                GAMES
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Mascot welcome */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(520)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <GraflyMascot state="celebrate" size={84} float />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "Nunito_900Black",
                color: colors.foreground,
                lineHeight: 26,
              }}
            >
              Ready to think like a designer?
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                fontFamily: "Nunito_600SemiBold",
                color: colors.mutedForeground,
                lineHeight: 18,
              }}
            >
              I'll be right here cheering you on through every module.
            </Text>
          </View>
        </Animated.View>

        {/* Value beats */}
        <View style={{ marginBottom: 24 }}>
          {VALUE_BEATS.map((b, i) => (
            <Animated.View
              key={b.title}
              entering={FadeInDown.delay(220 + i * 90).duration(440)}
              style={{
                flexDirection: "row",
                gap: 14,
                padding: 16,
                backgroundColor: colors.card,
                borderRadius: 18,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: course.color + "22",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={b.icon} size={22} color={course.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground,
                    marginBottom: 4,
                  }}
                >
                  {b.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.mutedForeground,
                    lineHeight: 18,
                  }}
                >
                  {b.body}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Preview of game types */}
        <Animated.View entering={FadeIn.delay(500).duration(420)} style={{ marginBottom: 22 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1.5,
              marginBottom: 10,
            }}
          >
            FIVE GAME TYPES YOU'LL PLAY
          </Text>
          <View>
            {PREVIEW_TYPES.map((p, i) => (
              <PreviewChip key={p.label} {...p} delay={520 + i * 80} />
            ))}
          </View>
        </Animated.View>

        {/* Progress hint */}
        {completedLessons > 0 && (
          <Animated.View
            entering={FadeIn.delay(900)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 14,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Icon name="ribbon-outline" size={18} color={course.color} />
            <Text style={{ flex: 1, fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              You've already completed {completedLessons} of {totalLessons} lessons.
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Sticky CTA */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 14,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 8,
        }}
      >
        <PressScale
          onPress={() => {
            if (firstUnstartedNode) {
              router.replace({ pathname: "/lesson", params: { nodeId: firstUnstartedNode.id } });
            } else {
              router.replace({ pathname: "/(tabs)/tree", params: { courseId: course.id } });
            }
          }}
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
            {completedLessons > 0 ? "Keep going" : "Start the course"}
          </Text>
          <Icon name="arrow-forward" size={18} color={colors.background} />
        </PressScale>
        <PressScale
          onPress={() => router.replace({ pathname: "/(tabs)/tree", params: { courseId: course.id } })}
          style={{
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
            See the full skill tree
          </Text>
        </PressScale>
      </View>
    </View>
  );
}
