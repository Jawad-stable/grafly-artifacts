import React, { useMemo } from "react";
import { View, Text, ScrollView, Platform, Dimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Icon } from "@/components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES as RAW_COURSES } from "@/constants/lessons";
import { localizeCourse } from "@/lib/lessonsAr";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";
import { BrandSquiggle } from "@/components/BrandSquiggle";
import { onBrand } from "@/constants/contrast";
import { useT } from "@/hooks/useT";

interface CourseHighlight {
  icon: string;
  label: string;
  body: string;
}

const SCREEN_H = Dimensions.get("window").height;
const DISMISS_THRESHOLD = 140;

export default function CourseIntroScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const { t, isRTL, lang } = useT();
  const COURSES = useMemo(
    () => (lang === "en" ? RAW_COURSES : RAW_COURSES.map((c) => localizeCourse(c, lang))),
    [lang],
  );
  const params = useLocalSearchParams<{ courseId?: string }>();

  const COURSE_HIGHLIGHTS: Record<string, CourseHighlight[]> = {
    "design-principles": [
      { icon: "eye-outline", label: t("ci.h.eye"), body: t("ci.h.eye.b") },
      { icon: "game-controller-outline", label: t("ci.h.play"), body: t("ci.h.play.b") },
      { icon: "ribbon-outline", label: t("ci.h.ribbon"), body: t("ci.h.ribbon.b") },
    ],
  };

  const DEFAULT_HIGHLIGHTS: CourseHighlight[] = [
    { icon: "eye-outline", label: t("ci.h.eye"), body: t("ci.h.eye.b2") },
    { icon: "game-controller-outline", label: t("ci.h.play"), body: t("ci.h.play.b2") },
    { icon: "ribbon-outline", label: t("ci.h.earn"), body: t("ci.h.earn.b") },
  ];

  const course = useMemo(() => {
    const id = params.courseId ?? "design-principles";
    return COURSES.find((c) => c.id === id) ?? COURSES[0];
  }, [params.courseId, COURSES]);

  const highlights = COURSE_HIGHLIGHTS[course.id] ?? DEFAULT_HIGHLIGHTS;
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

  // ===== Swipe-down-to-dismiss =====
  // The whole screen translates with finger. Past the threshold on release,
  // we slide it the rest of the way out and pop the route. Below threshold,
  // it springs back. The drag handle and a fading scrim sell the affordance.
  const translateY = useSharedValue(0);

  function dismiss() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }

  const dismissPan = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetY(-12)
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 900) {
        translateY.value = withTiming(SCREEN_H, { duration: 240 }, () => {
          runOnJS(dismiss)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, DISMISS_THRESHOLD * 1.6],
      [0, 0.35],
      Extrapolation.CLAMP,
    ),
  }));

  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, 60],
      [0.6, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scaleX: interpolate(
          translateY.value,
          [0, 80],
          [1, 1.4],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Dimming scrim behind sheet — gives a "card lifting off" feel */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#000" },
          scrimStyle,
        ]}
      />

      <Animated.View style={[{ flex: 1, backgroundColor: colors.background }, sheetStyle]}>
        {/* Drag handle — wraps a tall hit area so users can grab anywhere
            near the top, not just the tiny pill itself. */}
        <GestureDetector gesture={dismissPan}>
          <View
            style={{
              paddingTop: paddingTop,
              paddingBottom: 4,
              alignItems: "center",
              backgroundColor: colors.background,
            }}
          >
            <Animated.View
              style={[
                {
                  width: 44,
                  height: 5,
                  borderRadius: 100,
                  backgroundColor: colors.mutedForeground,
                  marginTop: 6,
                },
                handleStyle,
              ]}
            />
          </View>
        </GestureDetector>

        {/* Header */}
        <View
          style={{
            paddingTop: 6,
            paddingHorizontal: 24,
            paddingBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <PressScale
            onPress={dismiss}
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
            {t("ci.eyebrow")}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero card */}
          <Animated.View
            entering={FadeInDown.duration(560)}
            style={{
              backgroundColor: course.color,
              borderRadius: 28,
              padding: 22,
              marginTop: 10,
              marginBottom: 24,
              overflow: "hidden",
            }}
          >
            <View pointerEvents="none" style={{ position: "absolute", right: -28, top: -22 }}>
              <BrandSquiggle
                variant="loop"
                width={200}
                height={130}
                color={onCourse}
                strokeWidth={7}
                opacity={0.18}
                drift
              />
            </View>
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
                  {t("ci.course")}
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
                  {t("ci.modules")}
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
                  {t("ci.lessons")}
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
                  {t("ci.games")}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Mascot welcome */}
          <Animated.View
            entering={FadeInDown.delay(120).duration(360)}
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
                {t("ci.ready")}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.foreground, lineHeight: 20 }}>
                {t("ci.train")}
              </Text>
            </View>
          </Animated.View>

          {/* Highlights */}
          <View style={{ gap: 10, marginBottom: 24 }}>
            {highlights.map((h, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(180 + i * 80).duration(360)}
                style={{
                  flexDirection: "row",
                  gap: 14,
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: course.color + "22", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={h.icon as any} size={22} color={course.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 2 }}>
                    {h.label}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 17 }}>
                    {h.body}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Module outline */}
          <Animated.View entering={FadeInDown.delay(420).duration(360)} style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, backgroundColor: course.color + "22" }}>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: course.color, letterSpacing: 1.4 }}>
                  {t("ci.path")}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>
            <View style={{ gap: 8 }}>
              {course.nodes.map((node, idx) => (
                <View
                  key={node.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 10,
                    borderBottomWidth: idx === course.nodes.length - 1 ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{
                    width: 30, height: 30, borderRadius: 15,
                    backgroundColor: course.color,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: onCourse }}>
                      {idx + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.2 }}>
                      {node.title}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }} numberOfLines={1}>
                      {node.description}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 0.4 }}>
                    {t("ci.lessonsCount", { n: node.lessons.length })}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Progress hint */}
          {completedLessons > 0 && (
            <Animated.View
              entering={FadeIn.delay(500)}
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
                {t("ci.alreadyDone", { done: completedLessons, total: totalLessons })}
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
              {completedLessons > 0 ? t("ci.keepGoing") : t("ci.start")}
            </Text>
            <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={18} color={colors.background} />
          </PressScale>
          <PressScale
            onPress={() => router.replace({ pathname: "/(tabs)/tree", params: { courseId: course.id } })}
            style={{
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
              {t("ci.fullTree")}
            </Text>
          </PressScale>
        </View>
      </Animated.View>
    </View>
  );
}
