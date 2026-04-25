import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { COURSES, getAllLessons } from "@/constants/lessons";
import { LOGO } from "@/constants/assets";
import { GraflyMascot } from "@/components/GraflyMascot";
import { AText } from "@/components/AText";
import { PressScale } from "@/components/PressScale";

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(" ")[0] || name;
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

function XPPopup() {
  const { state, dispatch } = useGame();
  const colors = useColors();
  const scale = useSharedValue(0.6);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (state.showXPPopup) {
      scale.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSequence(withTiming(0), withTiming(-60, { duration: 1000 }));
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
    <Animated.View style={[{
      position: "absolute", bottom: 120, alignSelf: "center",
      backgroundColor: colors.accent, borderRadius: 100,
      paddingHorizontal: 20, paddingVertical: 10,
      zIndex: 999, flexDirection: "row", alignItems: "center", gap: 6,
    }, animStyle]}>
      <Ionicons name="flash" size={18} color={colors.accentForeground} />
      <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.accentForeground }}>
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
      scale.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [state.showLevelUp]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!state.showLevelUp) return null;
  return (
    <Animated.View style={[{
      ...{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
      backgroundColor: colors.background + "E0",
      alignItems: "center", justifyContent: "center", zIndex: 9999,
    }]}>
      <Animated.View style={[{
        backgroundColor: colors.card, borderRadius: colors.radius,
        padding: 40, alignItems: "center", marginHorizontal: 32,
      }, animStyle]}>
        <View style={{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: colors.accent + "30",
          alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <Ionicons name="trophy" size={48} color={colors.accent} />
        </View>
        <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.accent, marginBottom: 8, letterSpacing: 2 }}>
          LEVEL UP
        </Text>
        <Text style={{ fontSize: 52, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 8 }}>
          {state.newLevel}
        </Text>
        <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginBottom: 28 }}>
          You are becoming a real designer.
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, borderRadius: colors.radius, paddingVertical: 16, paddingHorizontal: 40 }}
          onPress={() => dispatch({ type: "DISMISS_LEVEL_UP" })}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
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

  // Onboarding redirects are handled declaratively by AuthGate in _layout.tsx

  const allLessons = getAllLessons();
  const nextLesson = allLessons.find((l) => !state.completedLessons.includes(l.id));
  const nextNode = nextLesson
    ? COURSES.flatMap((c) => c.nodes).find((n) => n.lessons.some((l) => l.id === nextLesson?.id))
    : null;
  const nextCourse = nextNode ? COURSES.find((c) => c.id === nextNode.courseId) : null;

  const todayLessons = state.completedLessons.length;
  const dailyGoal = 3;
  const dailyProgress = Math.min(todayLessons / dailyGoal, 1);
  const xpProg = getXPProgress(state.xp);
  const xpPercent = Math.round((xpProg.current / xpProg.required) * 100);
  const userRank = state.weeklyXP >= 1050 ? 3 : state.weeklyXP >= 500 ? 5 : 12;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + 100;

  if (!state.onboardingComplete) return null;

  const SCREEN_W = Dimensions.get("window").width;
  const cardW = Math.min(SCREEN_W - 80, 300);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LevelUpOverlay />
      <XPPopup />

      {/* FIXED HEADER — minimal: logo + streak + coins */}
      <View style={{
        paddingTop: paddingTop + 12,
        paddingHorizontal: 24,
        paddingBottom: 0,
        backgroundColor: colors.background,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image source={LOGO.icon_colored} style={{ width: 28, height: 28 }} resizeMode="contain" />
            <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
              GRAFLY
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 4,
              backgroundColor: colors.card, borderRadius: 100,
              paddingHorizontal: 12, paddingVertical: 6,
              borderWidth: 1, borderColor: colors.border,
            }}>
              <Ionicons name="flame" size={14} color="#FF7B00" />
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {state.streak}
              </Text>
            </View>
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 4,
              backgroundColor: colors.card, borderRadius: 100,
              paddingHorizontal: 12, paddingVertical: 6,
              borderWidth: 1, borderColor: colors.border,
            }}>
              <Ionicons name="ellipse" size={11} color={colors.warning} />
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {state.coins}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial headline */}
        <Animated.View entering={FadeIn.delay(80)} style={{ paddingHorizontal: 24, marginTop: 18, marginBottom: 8 }}>
          <AText style={{
            fontSize: 44, fontFamily: "Nunito_800ExtraBold",
            color: colors.foreground, lineHeight: 48, letterSpacing: -1.2,
          }}>
            {getGreeting(state.username).split(",")[0]},
          </AText>
          <AText style={{
            fontSize: 44, fontFamily: "Nunito_800ExtraBold",
            color: colors.primary, lineHeight: 48, letterSpacing: -1.2, marginBottom: 10,
          }}>
            {state.username.split(" ")[0]}.
          </AText>
          <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 22 }}>
            {state.streak > 0
              ? `You are on a ${state.streak} day streak. Keep the spark alive.`
              : "Pick a lesson and start your streak today."}
          </Text>
        </Animated.View>

        {/* Pro upgrade banner — editorial card */}
        {!state.isPro && (
          <Animated.View entering={FadeIn.delay(140)} style={{ paddingHorizontal: 24, marginTop: 22 }}>
            <PressScale
              onPress={() => router.push("/paywall" as any)}
              style={{
                backgroundColor: colors.card, borderRadius: 22,
                paddingVertical: 14, paddingHorizontal: 16,
                flexDirection: "row", alignItems: "center", gap: 12,
                borderWidth: 1, borderColor: colors.border,
              }}
            >
              <View style={{
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: colors.accent,
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name="diamond" size={18} color={colors.accentForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  Upgrade Pro
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  Unlimited critique, no ads, all courses
                </Text>
              </View>
              <View style={{
                backgroundColor: colors.foreground, borderRadius: 100,
                paddingHorizontal: 14, paddingVertical: 7,
              }}>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                  Upgrade
                </Text>
              </View>
            </PressScale>
          </Animated.View>
        )}

        {/* Popular Courses — horizontal carousel (editorial cards) */}
        <Animated.View entering={FadeIn.delay(190)} style={{ marginTop: 28 }}>
          <View style={{ paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}>
              Popular courses
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/tree")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={COURSES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
            snapToInterval={cardW + 16}
            decelerationRate="fast"
            renderItem={({ item: course, index }) => {
              const totalLessons = course.nodes.flatMap((n) => n.lessons).length;
              const completedCount = course.nodes
                .flatMap((n) => n.lessons)
                .filter((l) => state.completedLessons.includes(l.id)).length;
              const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              const mascotStates = ["think", "celebrate", "idle", "correct", "oops"] as const;
              const mascotState = mascotStates[index % mascotStates.length];

              return (
                <PressScale
                  onPress={() => router.push({ pathname: "/(tabs)/tree", params: { courseId: course.id } })}
                  style={{
                    width: cardW, height: 290, borderRadius: 24,
                    backgroundColor: course.color,
                    overflow: "hidden",
                    shadowColor: course.color,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.16,
                    shadowRadius: 18,
                    elevation: 5,
                  }}
                >
                  {/* Top: category eyebrow (no pill) */}
                  <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Ionicons name={course.icon as any} size={12} color={colors.primaryForeground + "DD"} />
                      <Text style={{
                        fontSize: 10, fontFamily: "Nunito_800ExtraBold",
                        color: colors.primaryForeground + "DD", letterSpacing: 1.2,
                      }}>
                        {course.title.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Title block — fixed heights so every card matches */}
                  <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 24, fontFamily: "Nunito_800ExtraBold",
                        color: colors.primaryForeground, lineHeight: 28, letterSpacing: -0.5,
                        height: 28,
                      }}
                    >
                      {course.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 12, fontFamily: "Nunito_600SemiBold",
                        color: colors.primaryForeground + "CC", marginTop: 6, lineHeight: 17,
                        height: 34,
                      }}
                    >
                      {course.description}
                    </Text>
                  </View>

                  {/* Collage block: mascot + accent dot — flexes to fill remaining space */}
                  <View style={{ flex: 1, marginTop: 8, position: "relative", overflow: "hidden" }}>
                    {/* Accent dot */}
                    <View style={{
                      position: "absolute", left: 22, top: 14,
                      width: 28, height: 28, borderRadius: 14,
                      backgroundColor: colors.accent,
                    }} />
                    {/* Mascot */}
                    <View style={{
                      position: "absolute", right: 6, bottom: -8,
                      width: 130, height: 130, alignItems: "center", justifyContent: "center",
                    }}>
                      <GraflyMascot state={mascotState} size={120} />
                    </View>
                  </View>

                  {/* Footer strip with progress */}
                  <View style={{
                    paddingHorizontal: 18, paddingVertical: 12,
                    backgroundColor: colors.accentForeground + "22",
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
                      {completedCount}/{totalLessons} lessons
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
                      {progress}%
                    </Text>
                  </View>
                </PressScale>
              );
            }}
          />
        </Animated.View>

        {/* Continue Learning — high-contrast near-black editorial CTA card */}
        {nextLesson && nextCourse && (
          <Animated.View entering={FadeIn.delay(240)} style={{ paddingHorizontal: 24, marginTop: 28 }}>
            <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4, marginBottom: 14 }}>
              Pick up where you left off
            </Text>
            <PressScale
              onPress={() => router.push({ pathname: "/lesson", params: { nodeId: nextNode?.id ?? "" } })}
              style={{
                backgroundColor: colors.foreground, borderRadius: 28,
                padding: 22,
              }}
            >
              <View style={{
                backgroundColor: colors.accent, borderRadius: 100,
                paddingHorizontal: 12, paddingVertical: 5,
                alignSelf: "flex-start", marginBottom: 14,
              }}>
                <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: colors.accentForeground, letterSpacing: 1.2 }}>
                  CONTINUE LESSON
                </Text>
              </View>
              <Text style={{ fontSize: 24, fontFamily: "Nunito_800ExtraBold", color: colors.background, marginBottom: 4, lineHeight: 28, letterSpacing: -0.5 }}>
                {nextLesson.title}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.background + "AA", marginBottom: 18 }}>
                {nextCourse.title}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="flash" size={14} color={colors.accent} />
                    <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                      +{nextLesson.xpReward} XP
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="ellipse" size={11} color={colors.warning} />
                    <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                      +{nextLesson.coinReward}
                    </Text>
                  </View>
                </View>
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: colors.accent,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Ionicons name="arrow-forward" size={20} color={colors.accentForeground} />
                </View>
              </View>
            </PressScale>
          </Animated.View>
        )}

        {/* Daily Goal + Rank — editorial side-by-side cards */}
        <Animated.View entering={FadeIn.delay(290)} style={{ paddingHorizontal: 24, marginTop: 22, flexDirection: "row", gap: 12 }}>
          {/* Daily goal */}
          <View style={{
            flex: 1, backgroundColor: colors.card, borderRadius: 22,
            padding: 18,
            borderWidth: 1, borderColor: colors.border,
            justifyContent: "space-between",
            minHeight: 132,
          }}>
            <Text style={{
              fontSize: 11,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1.4,
            }}>
              DAILY GOAL
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 8 }}>
              <Text style={{
                fontSize: 38,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -1.2,
                lineHeight: 40,
              }}>
                {todayLessons}
              </Text>
              <Text style={{
                fontSize: 18,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                letterSpacing: -0.5,
              }}>
                /{dailyGoal}
              </Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <View style={{
                height: 4,
                borderRadius: 100,
                backgroundColor: colors.border,
                overflow: "hidden",
                marginBottom: 8,
              }}>
                <View style={{
                  height: "100%",
                  width: `${Math.min(100, dailyProgress * 100)}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 100,
                }} />
              </View>
              <Text style={{
                fontSize: 12,
                fontFamily: "Nunito_600SemiBold",
                color: colors.mutedForeground,
              }}>
                {todayLessons >= dailyGoal ? "Complete!" : `${dailyGoal - todayLessons} to go`}
              </Text>
            </View>
          </View>

          {/* Rank */}
          <PressScale
            onPress={() => router.push("/leaderboard")}
            style={{
              flex: 1, backgroundColor: colors.card, borderRadius: 22,
              padding: 18,
              borderWidth: 1, borderColor: colors.border,
              justifyContent: "space-between",
              minHeight: 132,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Text style={{
                fontSize: 11,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                letterSpacing: 1.4,
              }}>
                YOUR RANK
              </Text>
              <View style={{
                width: 28, height: 28, borderRadius: 10,
                backgroundColor: "#CD7F3222",
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name="medal" size={16} color="#CD7F32" />
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2, marginTop: 8 }}>
              <Text style={{
                fontSize: 22,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                letterSpacing: -0.5,
                lineHeight: 40,
              }}>
                #
              </Text>
              <Text style={{
                fontSize: 38,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -1.2,
                lineHeight: 40,
              }}>
                {userRank}
              </Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={{
                fontSize: 12,
                fontFamily: "Nunito_800ExtraBold",
                color: "#CD7F32",
                letterSpacing: 0.2,
              }}>
                Bronze division
              </Text>
              <Text style={{
                fontSize: 11,
                fontFamily: "Nunito_600SemiBold",
                color: colors.mutedForeground,
                marginTop: 2,
              }}>
                View leaderboard
              </Text>
            </View>
          </PressScale>
        </Animated.View>

        {/* XP progress strip */}
        <Animated.View entering={FadeIn.delay(340)} style={{ paddingHorizontal: 24, marginTop: 22 }}>
          <View style={{
            backgroundColor: colors.card, borderRadius: 22,
            padding: 18, borderWidth: 1, borderColor: colors.border,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: colors.accent,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Ionicons name="flash" size={16} color={colors.accentForeground} />
                </View>
                <View>
                  <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    Level {xpProg.level}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                    {xpProg.current} / {xpProg.required} XP
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
                Lvl {xpProg.level + 1}
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
              <View style={{ height: "100%", width: `${xpPercent}%`, backgroundColor: colors.foreground, borderRadius: 4 }} />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
