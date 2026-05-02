import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import { GraflyMascot } from "@/components/GraflyMascot";
import { AText, ATextInput } from "@/components/AText";
import { useT } from "@/hooks/useT";
import { HomeBackdrop } from "@/components/HomeBackdrop";
import { BrandSquiggle } from "@/components/BrandSquiggle";
import { PressScale } from "@/components/PressScale";
import { LinearGradient } from "expo-linear-gradient";
import colorsConst from "@/constants/colors";
import { onBrand } from "@/constants/contrast";

const BRAND = colorsConst.brand;

// Pre-mix a foreground color over a solid background at a given alpha
// and return the resulting OPAQUE hex. Used everywhere the profile
// previously rendered alpha-tinted surfaces (e.g. cyan-on-bg cards) —
// switching to pre-mixed solids means the cards no longer blend with
// whatever decorative watermark or scrolled content sits behind them,
// so each tile reads as a clean, intentional brand color.
function mix(fg: string, bg: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const fr = parseInt(fg.slice(1, 3), 16);
  const fgG = parseInt(fg.slice(3, 5), 16);
  const fb = parseInt(fg.slice(5, 7), 16);
  const br = parseInt(bg.slice(1, 3), 16);
  const bgG = parseInt(bg.slice(3, 5), 16);
  const bb = parseInt(bg.slice(5, 7), 16);
  const r = Math.round(a * fr + (1 - a) * br);
  const g = Math.round(a * fgG + (1 - a) * bgG);
  const b = Math.round(a * fb + (1 - a) * bb);
  const toHex = (v: number) => v.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const ACHIEVEMENTS = [
  { id: "first-lesson", title: "First Step", icon: "book", color: "#00A4FA", condition: (s: any) => s.completedLessons.length >= 1 },
  { id: "week-streak", title: "On Fire", icon: "flame", color: "#FF7B00", condition: (s: any) => s.streakMax >= 7 },
  { id: "critic", title: "Critic", icon: "chatbubble-ellipses", color: "#FF7BD0", condition: (s: any) => s.critiqueCount >= 1 },
  { id: "level-5", title: "Rising", icon: "trending-up", color: "#22DD88", condition: (s: any) => s.level >= 5 },
  { id: "level-10", title: "Pro", icon: "diamond", color: "#E3ED43", condition: (s: any) => s.level >= 10 },
  { id: "coin-500", title: "Rich", icon: "coin", color: "#FFB800", condition: (s: any) => s.coins >= 500 },
  { id: "lessons-10", title: "Dedicated", icon: "ribbon", color: "#00A4FA", condition: (s: any) => s.completedLessons.length >= 10 },
  { id: "perfect", title: "Perfect", icon: "star", color: "#E3ED43", condition: (s: any) => s.perfectLessons.length >= 1 },
];

const DIVISION_INFO: Record<string, { label: string; color: string; icon: string }> = {
  bronze: { label: "Bronze", color: "#CD7F32", icon: "medal" },
  silver: { label: "Silver", color: "#C0C0C0", icon: "medal" },
  gold: { label: "Gold", color: "#FFB800", icon: "medal" },
  platinum: { label: "Platinum", color: "#00A4FA", icon: "medal" },
  diamond: { label: "Diamond", color: "#FF7BD0", icon: "diamond" },
};

function getDivision(weeklyXP: number): string {
  if (weeklyXP >= 5000) return "diamond";
  if (weeklyXP >= 2000) return "platinum";
  if (weeklyXP >= 1000) return "gold";
  if (weeklyXP >= 300) return "silver";
  return "bronze";
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const { state: profileState, updateProfile } = useProfile();
  const { signOut, user } = useAuth();
  const { t, dir } = useT();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profileState.username);

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + 100;

  const xpProg = getXPProgress(state.xp);
  const division = getDivision(state.weeklyXP);
  const divInfo = DIVISION_INFO[division];

  function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) {
      updateProfile({ username: trimmed });
    }
    setEditingName(false);
  }

  // Each stat gets its own tinted card background instead of all the
  // tiles sharing the same neutral card surface — this makes the grid
  // read as a vibrant gallery instead of a list.
  // `tile` is the bg behind the whole card, `border` rims it, `iconDot`
  // is the chip behind the icon. All three are PRE-MIXED solid hex
  // values (no alpha channel) so the surfaces don't blend with the
  // brand watermark sitting behind the scroll view.
  const bg = colors.background;
  const STATS = [
    { label: t("profile.totalXP"),   value: state.xp,                       icon: "flash",            color: colors.accent,  tile: mix(colors.accent,  bg, 0.188), border: mix(colors.accent,  bg, 0.30), iconDot: mix(colors.accent,  bg, 0.35), squiggle: "loop" as const },
    { label: t("profile.streak"),    value: state.streak,                   icon: "flame",            color: "#FF7B00",      tile: mix("#FF7B00",      bg, 0.13),  border: mix("#FF7B00",      bg, 0.30), iconDot: mix("#FF7B00",      bg, 0.30), squiggle: "tube" as const },
    { label: t("profile.maxStreak"), value: state.streakMax,                icon: "trending-up",      color: colors.success, tile: mix(colors.success, bg, 0.12),  border: mix(colors.success, bg, 0.30), iconDot: mix(colors.success, bg, 0.30), squiggle: "wave" as const },
    { label: t("profile.lessons"),   value: state.completedLessons.length,  icon: "checkmark-circle", color: colors.primary, tile: mix(colors.primary, bg, 0.12),  border: mix(colors.primary, bg, 0.30), iconDot: mix(colors.primary, bg, 0.30), squiggle: "loop" as const },
  ];

  // Pre-mixed solids that replace what used to be alpha-suffixed hex
  // (`color + "16"`, `color + "26"`, etc.) on the profile screen.
  // Each entry resolves to a fully opaque hex that LOOKS like the old
  // tint but doesn't actually blend with the watermark behind it.
  const SOLID = {
    // Identity card (cyan family)
    identityBg:     mix(colors.primary, bg, 0.09),
    identityBorder: mix(colors.primary, bg, 0.20),
    avatarBg:       mix(colors.primary, bg, 0.18),
    // Progress card (lime family)
    progressBg:     mix(colors.accent,  bg, 0.18),
    progressBorder: mix(colors.accent,  bg, 0.36),
    xpTrack:        mix(BRAND.navy,     bg, 0.12),
    // Settings rows
    settingIconBg:  mix(colors.primary, bg, 0.13),
    dangerIconBg:   mix(colors.destructive, bg, 0.13),
    // Switch trackColor when active (true)
    switchOnTrack:  mix(colors.primary, bg, 0.40),
  };

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.condition(state)).length;
  const xpPct = Math.min(100, Math.round((xpProg.current / xpProg.required) * 100));
  const placementLabel =
    state.placementLevel.charAt(0).toUpperCase() + state.placementLevel.slice(1);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Ambient brand watermark — same backdrop the home/tree/shop
          tabs use, so the profile feels like part of the same room
          instead of a flat settings screen. */}
      <HomeBackdrop
        foreground={colors.foreground}
        primary={colors.primary}
        accent={colors.accent}
      />
      <ScrollView
        contentContainerStyle={{ paddingTop: paddingTop + 12, paddingHorizontal: 24, paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial title with a small brand-cyan dot — same anchor
            pattern the Shop screen uses on its section headings. */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
              {t("profile.eyebrow")}
            </Text>
          </View>
          <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42, ...dir }}>
            {t("profile.title")}
          </Text>
        </View>

        {/* Identity card — soft cyan-tinted hero with a brand-squiggle
            flourish in the corner. Avatar circle is filled with a
            slightly deeper cyan tint so the mascot pops out of the card. */}
        <Animated.View
          entering={FadeIn}
          style={{
            backgroundColor: SOLID.identityBg,
            borderRadius: colors.radius.md,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            borderWidth: 1.5,
            borderColor: SOLID.identityBorder,
            overflow: "hidden",
          }}
        >
          {/* Brand squiggle flourish in the top-right corner */}
          <View pointerEvents="none" style={{ position: "absolute", top: -10, right: -16 }}>
            <BrandSquiggle variant="loop" width={140} height={88} color={colors.primary} opacity={0.16} drift delay={400} />
          </View>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: SOLID.avatarBg,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <GraflyMascot state="idle" size={88} />
          </View>
          <View style={{ flex: 1 }}>
            {editingName ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ATextInput
                  style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 20,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground,
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  maxLength={24}
                  onSubmitEditing={saveName}
                  onBlur={saveName}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={saveName} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Icon name="checkmark-circle" size={28} color={colors.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => { setNameInput(profileState.username); setEditingName(true); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
                accessibilityRole="button"
                accessibilityLabel="Edit username"
              >
                <AText
                  style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}
                  numberOfLines={1}
                >
                  {profileState.username}
                </AText>
                <Icon name="pencil" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                letterSpacing: 1.2,
              }}
            >
              LVL {xpProg.level} · {divInfo.label.toUpperCase()} · {placementLabel.toUpperCase()}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
              <Icon name={divInfo.icon as any} size={14} color={divInfo.color} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {t("profile.weeklyXP", { n: state.weeklyXP })}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Progress */}
        <Animated.View entering={FadeIn.delay(80)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
              {t("profile.progress")}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
              {xpPct}%
            </Text>
          </View>
          <View
            style={{
              backgroundColor: SOLID.progressBg,
              borderRadius: colors.radius.md,
              padding: 18,
              borderWidth: 1.5,
              borderColor: SOLID.progressBorder,
              overflow: "hidden",
            }}
          >
            {/* Lime-tinted brand squiggle in the corner */}
            <View pointerEvents="none" style={{ position: "absolute", bottom: -22, right: -10 }}>
              <BrandSquiggle variant="tube" width={92} height={130} color={BRAND.navy} opacity={0.08} drift delay={1200} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}>
                {t("profile.level", { n: xpProg.level })}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>
                {xpProg.current} / {xpProg.required} XP
              </Text>
            </View>
            {/* Gradient progress bar — cyan to lime, energetic */}
            <View style={{ height: 10, backgroundColor: SOLID.xpTrack, borderRadius: 5, overflow: "hidden" }}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: "100%", width: `${xpPct}%`, borderRadius: 5 }}
              />
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.foreground, marginTop: 10 }}>
              {t("profile.toLevel", { n: xpProg.required - xpProg.current, l: xpProg.level + 1 })}
            </Text>
          </View>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeIn.delay(130)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            {t("profile.numbers")}
          </Text>
          {/* 2x2 stat grid where each tile carries its own brand-color
              tint + a small drifting squiggle. Big numbers stay in
              navy foreground for AA contrast on the soft tints. */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {STATS.slice(0, 2).map((stat, idx) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: stat.tile,
                  borderRadius: colors.radius.md,
                  padding: 16,
                  alignItems: "flex-start",
                  borderWidth: 1.5,
                  borderColor: stat.border,
                  overflow: "hidden",
                }}
              >
                <View pointerEvents="none" style={{ position: "absolute", bottom: -14, right: -12 }}>
                  <BrandSquiggle variant={stat.squiggle} width={84} height={64} color={stat.color} opacity={0.18} drift delay={idx * 600} />
                </View>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: stat.iconDot,
                    alignItems: "center", justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: 1.2, marginTop: 2 }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {STATS.slice(2, 4).map((stat, idx) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: stat.tile,
                  borderRadius: colors.radius.md,
                  padding: 16,
                  alignItems: "flex-start",
                  borderWidth: 1.5,
                  borderColor: stat.border,
                  overflow: "hidden",
                }}
              >
                <View pointerEvents="none" style={{ position: "absolute", bottom: -14, right: -12 }}>
                  <BrandSquiggle variant={stat.squiggle} width={84} height={64} color={stat.color} opacity={0.18} drift delay={1200 + idx * 600} />
                </View>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: stat.iconDot,
                    alignItems: "center", justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: 1.2, marginTop: 2 }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeIn.delay(190)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <View>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
                {t("profile.achievements")}
              </Text>
              <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4, marginTop: 2 }}>
                {t("profile.badges")}
              </Text>
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
              {t("profile.unlocked", { n: unlockedCount, total: ACHIEVEMENTS.length })}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -24 }}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 10, paddingRight: 24 }}
          >
            {ACHIEVEMENTS.map((a) => {
              const unlocked = a.condition(state);
              return (
                <View
                  key={a.id}
                  style={{
                    width: 104,
                    // Unlocked tiles are FILLED with a SOLID light tint of
                    // their badge color (pre-mixed against the bg so it
                    // doesn't blend with the watermark behind the carousel).
                    backgroundColor: unlocked ? mix(a.color, bg, 0.15) : colors.card,
                    borderRadius: 18,
                    padding: 14,
                    alignItems: "center",
                    gap: 8,
                    borderWidth: 2,
                    borderColor: unlocked ? a.color : colors.border,
                    opacity: unlocked ? 1 : 0.6,
                    overflow: "hidden",
                  }}
                >
                  {unlocked && (
                    <View pointerEvents="none" style={{ position: "absolute", top: -10, right: -14 }}>
                      <BrandSquiggle variant="loop" width={70} height={44} color={a.color} opacity={0.22} drift delay={(ACHIEVEMENTS.indexOf(a) % 4) * 500} />
                    </View>
                  )}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: unlocked ? a.color : colors.muted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={a.icon as any} size={24} color={unlocked ? onBrand(a.color) : colors.mutedForeground} />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Nunito_800ExtraBold",
                      color: unlocked ? colors.foreground : colors.mutedForeground,
                      textAlign: "center",
                    }}
                  >
                    {a.title}
                  </Text>
                  {!unlocked && <Icon name="lock-closed" size={12} color={colors.mutedForeground} />}
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Settings — single nav row that pushes to the dedicated
            Settings page. The full controls (language tiles, theme
            mockup previews, voice toggle) live there now so this tab
            stays focused on identity + progress. */}
        <Animated.View entering={FadeIn.delay(240)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            {t("profile.settings")}
          </Text>
          <PressScale
            onPress={() => router.push("/settings")}
            style={{
              backgroundColor: colors.card,
              borderRadius: colors.radius.md,
              paddingHorizontal: 18,
              paddingVertical: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: SOLID.settingIconBg,
              alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="grid-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {t("settings.title")}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }}>
                {t("settings.subtitle")}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.mutedForeground} />
          </PressScale>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeIn.delay(290)} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            {t("profile.account")}
          </Text>

          {/* Upgrade-to-Pro CTA: deep-blue gradient pill with WHITE text +
              a white diamond icon, framed in PressScale. Follows the
              project rule "white on blue, navy on yellow". The gradient
              uses cyanDeep → a navy-blue stop (the SAME pattern the chat
              user-bubbles use) so white text passes WCAG AA on BOTH stops:
                • White on cyanDeep (#0078BB)  ≈ 4.79:1 (AA)
                • White on #1E4D8B             ≈ 8.2:1  (AA)
              Bright cyan #00A4FA was rejected here because white on it is
              only ~2.7:1 (AA fail). */}
          <PressScale
            onPress={() => router.push("/paywall" as any)}
            style={{ marginBottom: 10, borderRadius: 100, overflow: "hidden" }}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to Pro"
          >
            <LinearGradient
              colors={[colors.primaryDeep, "#1E4D8B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 100,
                paddingVertical: 18,
                paddingHorizontal: 22,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Icon name="diamond" size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
                {t("profile.upgrade")}
              </Text>
            </LinearGradient>
          </PressScale>

          {user ? (
            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius.md,
                paddingVertical: 16,
                paddingHorizontal: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={signOut}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: SOLID.dangerIconBg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="log-out-outline" size={18} color={colors.destructive} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    {t("profile.signout")}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }} numberOfLines={1}>
                    {user.email ?? t("profile.signedin")}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius.md,
                paddingVertical: 16,
                paddingHorizontal: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1.5,
                borderColor: colors.border,
              }}
              onPress={() => router.push("/auth")}
              activeOpacity={0.88}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: SOLID.settingIconBg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="cloud-upload-outline" size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    {t("profile.save")}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                    {t("profile.sync")}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
