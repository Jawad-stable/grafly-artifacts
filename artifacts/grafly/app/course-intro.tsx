import React, { useMemo } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
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

interface CourseHighlight {
  icon: string;
  label: string;
  body: string;
}

const COURSE_HIGHLIGHTS: Record<string, CourseHighlight[]> = {
  "design-principles": [
    { icon: "eye-outline", label: "Train your eye", body: "Real screens, not theory." },
    { icon: "game-controller-outline", label: "Play, don't read", body: "Spot, tap, choose. Quick rounds." },
    { icon: "ribbon-outline", label: "6 modules · 18 lessons", body: "Built in the right order." },
  ],
};

const DEFAULT_HIGHLIGHTS: CourseHighlight[] = [
  { icon: "eye-outline", label: "Train your eye", body: "Hands-on, not theory." },
  { icon: "game-controller-outline", label: "Play, don't read", body: "Quick interactive rounds." },
  { icon: "ribbon-outline", label: "Earn as you go", body: "XP, coins, and streaks." },
];

export default function CourseIntroScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const params = useLocalSearchParams<{ courseId?: string }>();

  const course = useMemo(() => {
    const id = params.courseId ?? "design-principles";
    return COURSES.find((c) => c.id === id) ?? COURSES[0];
  }, [params.courseId]);

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
              Ready to think like a designer?
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.foreground, lineHeight: 20 }}>
              Train your eye. One quick module at a time.
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
                THE PATH
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
                  {node.lessons.length} LESSONS
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
