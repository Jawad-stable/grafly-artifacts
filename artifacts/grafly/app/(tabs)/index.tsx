import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { COURSES, getAllLessons } from "@/constants/lessons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Aria Chen", xp: 1240, isUser: false },
  { rank: 2, name: "Jude Okafor", xp: 1180, isUser: false },
  { rank: 3, name: "Sophie Müller", xp: 1050, isUser: false },
  { rank: 4, name: "You", xp: 0, isUser: true },
];

function CircularProgress({
  size,
  progress,
  color,
  children,
}: {
  size: number;
  progress: number;
  color: string;
  children?: React.ReactNode;
}) {
  const colors = useColors();
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - Math.min(progress, 1) * circ;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.muted} strokeWidth={10} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

function XPPopup() {
  const { state, dispatch } = useGame();
  const colors = useColors();
  const scale = useSharedValue(0.6);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (state.showXPPopup) {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSequence(
        withTiming(0),
        withTiming(-60, { duration: 1000 })
      );
      const t = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => dispatch({ type: "DISMISS_XP_POPUP" }), 300);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [state.showXPPopup]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!state.showXPPopup) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 120,
          alignSelf: "center",
          backgroundColor: colors.accent,
          borderRadius: 100,
          paddingHorizontal: 20,
          paddingVertical: 10,
          zIndex: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
        animStyle,
      ]}
    >
      <Ionicons name="flash" size={18} color="#0F0F14" />
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Nunito_800ExtraBold",
          color: "#0F0F14",
        }}
      >
        +{state.xpPopupAmount} XP
      </Text>
    </Animated.View>
  );
}

function LevelUpOverlay() {
  const { state, dispatch } = useGame();
  const colors = useColors();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (state.showLevelUp) {
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [state.showLevelUp]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!state.showLevelUp) return null;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: "#0F0F14CC",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            padding: 40,
            alignItems: "center",
            marginHorizontal: 32,
          },
          animStyle,
        ]}
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: colors.accent + "30",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="trophy" size={48} color={colors.accent} />
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Nunito_600SemiBold",
            color: colors.accent,
            marginBottom: 8,
            letterSpacing: 2,
          }}
        >
          LEVEL UP
        </Text>
        <Text
          style={{
            fontSize: 48,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.foreground,
            marginBottom: 8,
          }}
        >
          {state.newLevel}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          You're becoming a real designer.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
            paddingVertical: 16,
            paddingHorizontal: 40,
          }}
          onPress={() => dispatch({ type: "DISMISS_LEVEL_UP" })}
          activeOpacity={0.85}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.primaryForeground,
            }}
          >
            Keep Going
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();

  useEffect(() => {
    if (!state.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [state.onboardingComplete]);

  const flameScale = useSharedValue(1);
  useEffect(() => {
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);
  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const allLessons = getAllLessons();
  const nextLesson = allLessons.find((l) => !state.completedLessons.includes(l.id));
  const nextNode = nextLesson
    ? COURSES.flatMap((c) => c.nodes).find((n) =>
        n.lessons.some((l) => l.id === nextLesson?.id)
      )
    : null;
  const nextCourse = nextNode
    ? COURSES.find((c) => c.id === nextNode.courseId)
    : null;

  const todayLessons = state.completedLessons.length;
  const dailyGoal = 3;
  const dailyProgress = Math.min(todayLessons / dailyGoal, 1);
  const xpProg = getXPProgress(state.xp);

  const userRank = state.weeklyXP >= 1050 ? 3 : state.weeklyXP >= 500 ? 5 : 12;

  const paddingTop =
    insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 84);

  if (!state.onboardingComplete) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LevelUpOverlay />
      <XPPopup />

      {/* HEADER */}
      <View
        style={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.background,
        }}
      >
        {/* Streak */}
        <Animated.View style={[{ flexDirection: "row", alignItems: "center", gap: 4 }, flameStyle]}>
          <Ionicons name="flame" size={24} color="#FF7B00" />
          <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {state.streak}
          </Text>
        </Animated.View>

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

        {/* XP + Coins */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.card, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Ionicons name="flash" size={14} color={colors.accent} />
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {state.xp}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.card, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Ionicons name="ellipse" size={12} color="#FFB800" />
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {state.coins}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Animated.View entering={FadeIn.delay(100)}>
          <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 4 }}>
            Hey, {state.username}
          </Text>
          <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 24 }}>
            {state.streak > 0 ? `${state.streak}-day streak — you're on a roll!` : "Start your learning streak today."}
          </Text>
        </Animated.View>

        {/* Daily Goal + XP Progress */}
        <Animated.View entering={FadeIn.delay(150)}>
          <View style={{
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            padding: 20,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}>
            <CircularProgress size={88} progress={dailyProgress} color={colors.primary}>
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {todayLessons}/{dailyGoal}
              </Text>
            </CircularProgress>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 4 }}>
                Daily Goal
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 12 }}>
                {todayLessons >= dailyGoal ? "Goal complete!" : `${dailyGoal - todayLessons} lesson${dailyGoal - todayLessons !== 1 ? "s" : ""} to go`}
              </Text>
              {/* Level bar */}
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                    LVL {xpProg.level}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                    {xpProg.current}/{xpProg.required} XP
                  </Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.muted, borderRadius: 3, overflow: "hidden" }}>
                  <View
                    style={{
                      height: "100%",
                      width: `${Math.round((xpProg.current / xpProg.required) * 100)}%`,
                      backgroundColor: colors.accent,
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Continue Learning */}
        {nextLesson && nextCourse && (
          <Animated.View entering={FadeIn.delay(200)}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: "/lesson", params: { nodeId: nextNode?.id ?? "" } })}
            >
              <LinearGradient
                colors={[colors.primary + "CC", colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: colors.radius,
                  padding: 20,
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <View style={{
                      backgroundColor: "#FFFFFF30",
                      borderRadius: 100,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      alignSelf: "flex-start",
                      marginBottom: 10,
                    }}>
                      <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFFCC", letterSpacing: 1 }}>
                        CONTINUE LEARNING
                      </Text>
                    </View>
                    <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF", marginBottom: 4 }}>
                      {nextLesson.title}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "#FFFFFFBB" }}>
                      {nextCourse.title}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="flash" size={14} color="#FFFFFF" />
                        <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
                          +{nextLesson.xpReward} XP
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="ellipse" size={11} color="#FFB800" />
                        <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
                          +{nextLesson.coinReward} coins
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#FFFFFF30",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 16,
                  }}>
                    <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Weekly Rank */}
        <Animated.View entering={FadeIn.delay(250)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/leaderboard")}
            style={{
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              padding: 20,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#CD7F3220",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}>
              <Ionicons name="medal" size={26} color="#CD7F32" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 2 }}>
                #{userRank} This Week
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {state.weeklyXP} XP — Bronze Division
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.primary }}>
                View
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Courses Overview */}
        <Animated.View entering={FadeIn.delay(300)}>
          <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 14 }}>
            All Courses
          </Text>
          {COURSES.map((course) => {
            const totalLessons = course.nodes.flatMap((n) => n.lessons).length;
            const completedCount = course.nodes
              .flatMap((n) => n.lessons)
              .filter((l) => state.completedLessons.includes(l.id)).length;
            const progress = totalLessons > 0 ? completedCount / totalLessons : 0;

            return (
              <TouchableOpacity
                key={course.id}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  padding: 16,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => router.push("/(tabs)/tree")}
                activeOpacity={0.8}
              >
                <View style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: course.color + "25",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Ionicons name={course.icon as any} size={22} color={course.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 4 }}>
                    {course.title}
                  </Text>
                  <View style={{ height: 4, backgroundColor: colors.muted, borderRadius: 2, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${Math.round(progress * 100)}%`, backgroundColor: course.color, borderRadius: 2 }} />
                  </View>
                </View>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  {completedCount}/{totalLessons}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
