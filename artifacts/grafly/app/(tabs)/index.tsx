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
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  withSequence,
  FadeIn,
  interpolate,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { COURSES, getAllLessons } from "@/constants/lessons";
import { LOGO } from "@/constants/assets";
import { GraflyMascot } from "@/components/GraflyMascot";
import { HomeBackdrop } from "@/components/HomeBackdrop";
import { voiceService } from "@/services/voiceService";
import { AText } from "@/components/AText";
import { PressScale } from "@/components/PressScale";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
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

// Per-course decorative motifs that hint at what each course teaches.
// Positioned around the mascot zone (right side) so they read as floating
// stickers without crowding the title block on the left.
function TopicSprinkles({
  courseId,
  textColor,
  textMuted,
  accent,
}: {
  courseId: string;
  textColor: string;
  textMuted: string;
  accent: string;
}) {
  if (courseId === "design-principles") {
    // Composition shapes: triangle outline, circle, square — the
    // foundational primitives of layout / hierarchy / balance.
    return (
      <>
        {/* Triangle (made from rotated square) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 132, bottom: 138,
            width: 18, height: 18,
            borderLeftWidth: 1.5, borderTopWidth: 1.5,
            borderColor: textColor + "AA",
            transform: [{ rotate: "45deg" }],
          }}
        />
        {/* Outline circle */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 156, bottom: 110,
            width: 16, height: 16, borderRadius: 8,
            borderWidth: 1.5,
            borderColor: textColor + "AA",
          }}
        />
        {/* Filled square */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 130, bottom: 92,
            width: 12, height: 12, borderRadius: 2,
            backgroundColor: textColor + "55",
          }}
        />
        {/* Tiny scale glyph near mascot's head */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 30, top: 88, opacity: 0.55 }}
        >
          <Icon name="scale-outline" size={16} color={textMuted} />
        </View>
      </>
    );
  }

  if (courseId === "typography") {
    // Letterform sample: big "A" + small "a" + a baseline ruler tick.
    return (
      <>
        {/* Big A */}
        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 128, bottom: 116,
            fontSize: 38,
            lineHeight: 38,
            fontFamily: "Nunito_800ExtraBold",
            color: textColor,
            letterSpacing: -1.4,
          }}
        >
          A
        </Text>
        {/* Small a */}
        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 110, bottom: 116,
            fontSize: 22,
            lineHeight: 22,
            fontFamily: "Nunito_600SemiBold",
            color: textColor + "B0",
          }}
        >
          a
        </Text>
        {/* Baseline rule under the letters */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 102, bottom: 110,
            width: 50, height: 1.5,
            backgroundColor: textColor + "55",
          }}
        />
        {/* Tiny baseline tick */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 102, bottom: 104,
            width: 1.5, height: 5,
            backgroundColor: textColor + "55",
          }}
        />
        {/* Small text icon near mascot's head */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 30, top: 88, opacity: 0.55 }}
        >
          <Icon name="text-outline" size={16} color={textMuted} />
        </View>
      </>
    );
  }

  if (courseId === "ui-design") {
    // Mini phone frame with status dot, content lines, and a bottom dock.
    return (
      <>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 130, bottom: 108,
            width: 28, height: 44, borderRadius: 7,
            backgroundColor: textColor + "1F",
            borderWidth: 1.2,
            borderColor: textColor + "55",
            paddingHorizontal: 4, paddingTop: 6, paddingBottom: 4,
            justifyContent: "space-between",
          }}
        >
          {/* Notch / status pill */}
          <View
            style={{
              alignSelf: "center",
              width: 8, height: 2, borderRadius: 1,
              backgroundColor: textColor + "66",
            }}
          />
          {/* Two content lines */}
          <View>
            <View style={{ width: 16, height: 2, borderRadius: 1, backgroundColor: textColor + "77" }} />
            <View style={{ width: 11, height: 2, borderRadius: 1, backgroundColor: textColor + "55", marginTop: 2 }} />
          </View>
          {/* Tab dock */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: textColor + "88" }} />
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: textColor + "55" }} />
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: textColor + "55" }} />
          </View>
        </View>
        {/* Tiny phone glyph near mascot's head */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 30, top: 88, opacity: 0.55 }}
        >
          <Icon name="phone-portrait-outline" size={16} color={textMuted} />
        </View>
      </>
    );
  }

  if (courseId === "branding") {
    // Monogram tile + a small star spark for an identity feel.
    return (
      <>
        {/* Monogram badge */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 128, bottom: 122,
            width: 30, height: 30, borderRadius: 8,
            backgroundColor: textColor + "1F",
            borderWidth: 1.2,
            borderColor: textColor + "55",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Nunito_800ExtraBold",
              color: textColor,
              letterSpacing: -0.6,
            }}
          >
            G
          </Text>
        </View>
        {/* Floating diamond accent */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 156, bottom: 100, opacity: 0.85 }}
        >
          <Icon name="diamond-outline" size={14} color={textColor} />
        </View>
        {/* Tiny star spark near mascot's head */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 30, top: 88, opacity: 0.7 }}
        >
          <Icon name="star" size={14} color={accent} />
        </View>
      </>
    );
  }

  // Fallback: simple dotted spark for unknown courses
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", right: 30, top: 88, opacity: 0.55 }}
    >
      <Icon name="ellipse" size={10} color={textMuted} />
    </View>
  );
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
      voiceService.playLevelUp(state.newLevel);
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

// Soft, looping drift for the three decorative blob shapes inside each
// course card. Three independent shared values run on different periods
// so the motion never lines up — the cards feel quietly alive without
// any single beat. Per-card index seeds the starting offset so two
// cards next to each other never breathe in lockstep.
//
// Constraints: only withTiming + Easing.out(Easing.cubic). withRepeat
// in yoyo mode (third arg `true`) gives a smooth back-and-forth using
// only that single easing curve.
const SOFT = Easing.out(Easing.cubic);
function DriftingBlobs({
  lightTint,
  deepTint,
  index,
}: {
  lightTint: string;
  deepTint: string;
  index: number;
}) {
  const t1 = useSharedValue(0);
  const t2 = useSharedValue(0);
  const t3 = useSharedValue(0);

  useEffect(() => {
    // Different periods + per-card delays so motions stay desynced.
    const phase = (index % 4) * 600;
    t1.value = withDelay(phase, withRepeat(withTiming(1, { duration: 7200, easing: SOFT }), -1, true));
    t2.value = withDelay(phase + 300, withRepeat(withTiming(1, { duration: 9000, easing: SOFT }), -1, true));
    t3.value = withDelay(phase + 800, withRepeat(withTiming(1, { duration: 11200, easing: SOFT }), -1, true));
  }, [index, t1, t2, t3]);

  // Top-right large blob: soft drift down-left, slight scale up.
  const blob1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(t1.value, [0, 1], [0, -10]) },
      { translateY: interpolate(t1.value, [0, 1], [0, 8]) },
      { scale: interpolate(t1.value, [0, 1], [1, 1.06]) },
    ],
    opacity: interpolate(t1.value, [0, 1], [0.42, 0.5]),
  }));

  // Mid-right small blob: drift down-right, slight scale down then up.
  const blob2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(t2.value, [0, 1], [0, 8]) },
      { translateY: interpolate(t2.value, [0, 1], [0, -10]) },
      { scale: interpolate(t2.value, [0, 1], [1, 0.94]) },
    ],
    opacity: interpolate(t2.value, [0, 1], [0.22, 0.32]),
  }));

  // Bottom-left large blob: drift up-right, slight scale up.
  const blob3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(t3.value, [0, 1], [0, 12]) },
      { translateY: interpolate(t3.value, [0, 1], [0, -8]) },
      { scale: interpolate(t3.value, [0, 1], [1, 1.05]) },
    ],
    opacity: interpolate(t3.value, [0, 1], [0.48, 0.55]),
  }));

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: -90, right: -70,
            width: 240, height: 240, borderRadius: 120,
            backgroundColor: lightTint,
          },
          blob1,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 30, right: -40,
            width: 140, height: 140, borderRadius: 70,
            backgroundColor: lightTint,
          },
          blob2,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            bottom: -70, left: -50,
            width: 180, height: 180, borderRadius: 90,
            backgroundColor: deepTint,
          },
          blob3,
        ]}
      />
    </>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useGame();

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
      {/* Ultra-subtle ambient backdrop — barely-visible micro motion */}
      <HomeBackdrop
        foreground={colors.foreground}
        primary={colors.primary}
        accent={colors.accent}
      />

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
            <LinearGradient
              colors={["#5CC4FC", "#0078BB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                flexDirection: "row", alignItems: "center", gap: 4,
                borderRadius: 100,
                paddingHorizontal: 12, paddingVertical: 6,
              }}
            >
              <Icon name="flame" size={14} color="#FFFFFF" weight="fill" />
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
                {state.streak}
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={["#5CC4FC", "#0078BB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                flexDirection: "row", alignItems: "center", gap: 4,
                borderRadius: 100,
                paddingHorizontal: 12, paddingVertical: 6,
              }}
            >
              <Icon name="coin" size={14} color="#FFFFFF" weight="fill" />
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
                {state.coins}
              </Text>
            </LinearGradient>
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

        {/* Pro upgrade banner — editorial card. Hidden once the user
            taps the small X (persisted via proBannerDismissed). */}
        {!state.isPro && !state.proBannerDismissed && (
          <Animated.View entering={FadeIn.delay(140)} style={{ paddingHorizontal: 24, marginTop: 22 }}>
            <View style={{ position: "relative" }}>
              <PressScale
                onPress={() => router.push("/paywall" as any)}
                style={{
                  backgroundColor: colors.card, borderRadius: 22,
                  paddingVertical: 14,
                  // Extra right padding so the upgrade pill never sits
                  // under the dismiss X in the corner.
                  paddingLeft: 16, paddingRight: 36,
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
              {/* Dismiss X — sibling of the PressScale and absolutely
                  positioned, so its tap is captured first by the touch
                  responder and never bubbles to the upgrade press. */}
              <Pressable
                onPress={() => dispatch({ type: "DISMISS_PRO_BANNER" })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Dismiss Pro upgrade banner"
                style={{
                  position: "absolute",
                  top: 8, right: 8,
                  width: 22, height: 22, borderRadius: 11,
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: colors.muted,
                }}
              >
                <Icon name="close" size={12} color={colors.mutedForeground} />
              </Pressable>
            </View>
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
              // sharing the same Grafly visual language.
              const baseColor = course.color;
              const lightTint = tintHex(baseColor, 0.32);
              const darkTint = tintHex(baseColor, -0.28);
              const deepTint = tintHex(baseColor, -0.45);

              // Strict rule: every card uses either NAVY (#21263F) or WHITE
              // for text + accents based on the card's luminance, so contrast
              // always lands on the safe side. Yellow cards → navy text.
              // Blue / pink / dark cards → white text.
              const NAVY = "#21263F";
              const isLightCard = relLuminance(baseColor) > 0.55;
              const textColor = isLightCard ? NAVY : "#FFFFFF";
              const textSoft = isLightCard ? `${NAVY}B0` : "#FFFFFFB8";
              const textMuted = isLightCard ? `${NAVY}80` : "#FFFFFFB0";
              // Accent: keep yellow on dark cards; on yellow cards, use navy
              // so the underline + handles + progress fill remain readable.
              const accent = isLightCard ? NAVY : "#FFD84D";
              const pillBg = isLightCard ? `${NAVY}1F` : "#FFFFFF26";
              const handleStroke = isLightCard ? `${NAVY}80` : "#FFFFFF80";

              // Grid line color is a deliberate complementary hue per card:
              //   yellow card → blue grid lines
              //   pink card   → white grid lines
              //   blue card   → yellow grid lines
              // Detected from the base color's RGB channels so any new course
              // color picks a sensible complementary line.
              const r = parseInt(baseColor.slice(1, 3), 16);
              const b = parseInt(baseColor.slice(5, 7), 16);
              const lineHue = isLightCard
                ? "#00A4FA"   // light/yellow → blue
                : r > b
                  ? "#FFFFFF" // pink/warm    → white
                  : "#FFD84D"; // blue/cool    → yellow
              const lineColor = `${lineHue}26`; // ~15% opacity, clearly visible

              const courseLabel = `COURSE ${String(index + 1).padStart(2, "0")}`;

              return (
                <PressScale
                  onPress={() => router.push({ pathname: "/(tabs)/tree", params: { courseId: course.id } })}
                  style={{
                    width: cardW, height: cardH, borderRadius: 26,
                    backgroundColor: baseColor,
                    overflow: "hidden",
                    shadowColor: baseColor,
                    shadowOffset: { width: 0, height: 14 },
                    shadowOpacity: 0.3,
                    shadowRadius: 24,
                    elevation: 7,
                  }}
                >
                  {/* Layer 1: per-course 3-stop gradient (light → base → dark) */}
                  <LinearGradient
                    pointerEvents="none"
                    colors={[lightTint, baseColor, darkTint]}
                    locations={[0, 0.55, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.6, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Layer 2: soft curved blob shapes — large rounded forms
                      reading as cinematic depth, mirroring the reference.
                      DriftingBlobs gives them a slow, looped, organic
                      motion so the cards feel alive without distracting. */}
                  <DriftingBlobs lightTint={lightTint} deepTint={deepTint} index={index} />

                  {/* Layer 3: faint Figma-style grid overlay (kept very subtle) */}
                  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                    {[40, 80, 120, 160, 200, 240, 280].map((y) => (
                      <View
                        key={`h${y}`}
                        style={{
                          position: "absolute", left: 0, right: 0, top: y,
                          height: StyleSheet.hairlineWidth,
                          backgroundColor: lineColor,
                        }}
                      />
                    ))}
                    {[40, 80, 120, 160, 200, 240, 280].map((x) => (
                      <View
                        key={`v${x}`}
                        style={{
                          position: "absolute", top: 0, bottom: 0, left: x,
                          width: StyleSheet.hairlineWidth,
                          backgroundColor: lineColor,
                        }}
                      />
                    ))}
                  </View>

                  {/* Layer 4: 9-dot pattern, top-right corner — small static
                      tool-palette flourish. Sits above where the mascot ends. */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: 26, right: 24,
                      width: 26,
                      flexDirection: "row", flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <View
                        key={i}
                        style={{
                          width: 4, height: 4, borderRadius: 2,
                          backgroundColor: textMuted,
                        }}
                      />
                    ))}
                  </View>

                  {/* Layer 5: mascot with Figma-style selection ring,
                      yellow square corner handles, white midpoint circles,
                      and a soft glow halo behind. Larger zone (152) so the
                      selection box is the visual anchor of the right half. */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      right: 14, bottom: 90,
                      width: 152, height: 152,
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {/* Soft glow halo */}
                    <View
                      style={{
                        position: "absolute",
                        width: 132, height: 132, borderRadius: 66,
                        backgroundColor: lightTint,
                        opacity: 0.4,
                      }}
                    />
                    {/* The mascot itself */}
                    <GraflyMascot state={mascotState} size={120} />
                  </View>

                  {/* Layer 5b: per-topic sprinkles around the mascot.
                      Each course gets motifs that hint at what it teaches:
                        Design Principles → composition shapes
                        Typography        → letterform "Aa" + baseline
                        UI Design         → mini phone wireframe
                        Branding          → monogram + star mark */}
                  <TopicSprinkles
                    courseId={course.id}
                    textColor={textColor}
                    textMuted={textMuted}
                    accent={accent}
                  />

                  {/* Soft accent blob beside the mascot — kept across all
                      courses as a unifying flourish */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      right: 118, bottom: 112,
                      width: 26, height: 20, borderRadius: 13,
                      backgroundColor: accent,
                      opacity: 0.9,
                      transform: [{ rotate: "-12deg" }],
                      shadowColor: accent,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 6,
                      elevation: 3,
                    }}
                  />

                  {/* Layer 6: top text block — pill eyebrow, big 2-line title,
                      accent underline, refined subtitle */}
                  <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
                    {/* Eyebrow as a pill */}
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

                    {/* Big two-line title with subtle text shadow */}
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 30,
                        lineHeight: 34,
                        marginTop: 16,
                        fontFamily: "Nunito_800ExtraBold",
                        color: textColor,
                        letterSpacing: -0.9,
                        textShadowColor: "#00000026",
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 4,
                        maxWidth: "62%",
                      }}
                    >
                      {course.title}
                    </Text>

                    {/* Accent underline */}
                    <View
                      style={{
                        width: 44,
                        height: 3,
                        marginTop: 10,
                        borderRadius: 2,
                        backgroundColor: accent,
                        shadowColor: accent,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.7,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    />

                    {/* Subtitle */}
                    <Text
                      numberOfLines={3}
                      style={{
                        fontSize: 13,
                        lineHeight: 18,
                        marginTop: 14,
                        fontFamily: "Nunito_600SemiBold",
                        color: textSoft,
                        maxWidth: "58%",
                      }}
                    >
                      {course.description}
                    </Text>
                  </View>

                  {/* Spacer pushes footer to the bottom */}
                  <View style={{ flex: 1 }} />

                  {/* Layer 7: glassmorphism footer with thin progress bar */}
                  <View>
                    {/* Glass strip */}
                    <View
                      style={{
                        position: "relative",
                        paddingHorizontal: 22,
                        paddingVertical: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        overflow: "hidden",
                      }}
                    >
                      <BlurView
                        intensity={Platform.OS === "ios" ? 30 : 50}
                        tint={isLightCard ? "light" : "dark"}
                        style={StyleSheet.absoluteFill}
                      />
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          { backgroundColor: deepTint + "66" },
                        ]}
                      />
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

                    {/* Thin progress line at the very bottom edge */}
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
                          shadowColor: accent,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.9,
                          shadowRadius: 4,
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
