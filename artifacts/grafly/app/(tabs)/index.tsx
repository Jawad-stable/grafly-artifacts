import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { COURSES, getAllLessons } from "@/constants/lessons";
import { LOGO } from "@/constants/assets";
import { GraflyMascot } from "@/components/GraflyMascot";
import { AText } from "@/components/AText";
import { PressScale } from "@/components/PressScale";
import { LinearGradient } from "expo-linear-gradient";
import { relLuminance } from "@/constants/contrast";

// Mix a hex color toward white (amount > 0) or black (amount < 0).
// Used to derive a 3-stop gradient from each course's base color so
// every card keeps its own hue while sharing the same depth treatment.
function tintHex(hex: string, amount: number): string {
  const c = hex.replace("#", "").slice(0, 6);
  if (c.length < 6) return hex;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const mix = (v: number) =>
    amount >= 0
      ? Math.round(v + (255 - v) * amount)
      : Math.round(v * (1 + amount));
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

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
      <Icon name="flash" size={18} color={colors.accentForeground} />
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
          <Icon name="trophy" size={48} color={colors.accent} />
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
  // Wider card for a balanced, near-square composition that matches the
  // reference. Side gutters reduced from 80 → 56 so the card breathes more.
  const cardW = Math.min(SCREEN_W - 56, 360);
  const cardH = 286;

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
              <Icon name="flame" size={14} color="#FF7B00" />
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
              <Icon name="ellipse" size={11} color={colors.warning} />
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
                <Icon name="diamond" size={18} color={colors.accentForeground} />
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
            <TouchableOpacity onPress={() => router.push("/courses" as any)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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

              // Per-course palette derived from the course's own base color
              // so every card stays distinct (blue, yellow, pink, etc.) while
              // sharing the same Grafly visual language. The premium look
              // leans on a single subtle tonal gradient + one soft glow,
              // letting the mascot and typography do the heavy lifting.
              const baseColor = course.color;
              const lightTint = tintHex(baseColor, 0.22);
              const deepTint = tintHex(baseColor, -0.32);

              // Strict rule: every card uses either NAVY (#21263F) or WHITE
              // for text + accents based on the card's luminance, so contrast
              // always lands on the safe side. Yellow cards → navy text.
              // Blue / pink / dark cards → white text.
              const NAVY = "#21263F";
              const isLightCard = relLuminance(baseColor) > 0.55;
              const textColor = isLightCard ? NAVY : "#FFFFFF";
              const textMuted = isLightCard ? `${NAVY}99` : "#FFFFFFB0";
              // Accent: keep yellow on dark cards; on yellow cards, use navy
              // so the underline + progress fill remain readable.
              const accent = isLightCard ? NAVY : "#FFD84D";
              const pillBg = isLightCard ? `${NAVY}14` : "#FFFFFF1F";

              const courseLabel = `COURSE ${String(index + 1).padStart(2, "0")}`;

              return (
                <PressScale
                  onPress={() => router.push({ pathname: "/(tabs)/tree", params: { courseId: course.id } })}
                  style={{
                    width: cardW, height: cardH, borderRadius: 28,
                    backgroundColor: baseColor,
                    overflow: "hidden",
                    shadowColor: baseColor,
                    shadowOffset: { width: 0, height: 18 },
                    shadowOpacity: 0.32,
                    shadowRadius: 28,
                    elevation: 8,
                  }}
                >
                  {/* Layer 1: subtle tonal gradient — single soft sweep from
                      a lifted top-left toward a slightly deeper bottom-right.
                      Replaces the busy 3-stop gradient with something that
                      feels closer to a premium product card. */}
                  <LinearGradient
                    pointerEvents="none"
                    colors={[lightTint, baseColor, deepTint]}
                    locations={[0, 0.6, 1]}
                    start={{ x: 0.15, y: 0 }}
                    end={{ x: 0.85, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Layer 2: a single soft glow behind the mascot. One light
                      source, no extra blobs — the depth comes from the
                      gradient + this halo, nothing else. */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      right: -60, bottom: -40,
                      width: 240, height: 240, borderRadius: 120,
                      backgroundColor: lightTint,
                      opacity: 0.4,
                    }}
                  />

                  {/* Layer 3: mascot, anchored to the bottom-right. No
                      selection ring, no halo box, no sticker sprinkles —
                      just the character as the hero element. */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      right: 18, bottom: 78,
                      width: 132, height: 132,
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <GraflyMascot state={mascotState} size={130} />
                  </View>

                  {/* Layer 4: text block — pill eyebrow, big title,
                      thin accent underline. Subtitle removed for a calmer,
                      more premium hierarchy. */}
                  <View style={{ paddingHorizontal: 24, paddingTop: 26 }}>
                    {/* Eyebrow pill */}
                    <View
                      style={{
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 100,
                        backgroundColor: pillBg,
                      }}
                    >
                      <Icon name={course.icon as any} size={12} color={textColor} />
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Nunito_800ExtraBold",
                          color: textColor,
                          letterSpacing: 1.6,
                        }}
                      >
                        {courseLabel}
                      </Text>
                    </View>

                    {/* Title — generous line-height, no text shadow */}
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 28,
                        lineHeight: 32,
                        marginTop: 18,
                        fontFamily: "Nunito_800ExtraBold",
                        color: textColor,
                        letterSpacing: -0.7,
                        maxWidth: "62%",
                      }}
                    >
                      {course.title}
                    </Text>

                    {/* Thin accent underline */}
                    <View
                      style={{
                        width: 36,
                        height: 3,
                        marginTop: 14,
                        borderRadius: 2,
                        backgroundColor: accent,
                      }}
                    />
                  </View>

                  {/* Spacer pushes the footer to the bottom */}
                  <View style={{ flex: 1 }} />

                  {/* Layer 5: footer — flat tonal strip with lessons + percent
                      and a hairline progress bar. No blur, no extra shadows. */}
                  <View>
                    <View
                      style={{
                        paddingHorizontal: 22,
                        paddingVertical: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: deepTint + "66",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Nunito_800ExtraBold",
                          color: textColor,
                          letterSpacing: 0.4,
                        }}
                      >
                        <Text>{completedCount}/{totalLessons}</Text>
                        <Text style={{ color: textMuted, fontFamily: "Nunito_600SemiBold" }}>  lessons</Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Nunito_800ExtraBold",
                          color: textColor,
                          letterSpacing: 0.4,
                        }}
                      >
                        {progress}%
                      </Text>
                    </View>

                    {/* Hairline progress bar */}
                    <View
                      style={{
                        height: 3,
                        backgroundColor: textColor + "1F",
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${Math.max(progress, 0)}%`,
                          height: "100%",
                          backgroundColor: accent,
                        }}
                      />
                    </View>
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
                    <Icon name="flash" size={14} color={colors.accent} />
                    <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                      +{nextLesson.xpReward} XP
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Icon name="ellipse" size={11} color={colors.warning} />
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
                  <Icon name="arrow-forward" size={20} color={colors.accentForeground} />
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
                <Icon name="medal" size={16} color="#CD7F32" />
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
                  <Icon name="flash" size={16} color={colors.accentForeground} />
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
