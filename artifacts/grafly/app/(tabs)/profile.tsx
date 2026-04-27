import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { GraflyMascot } from "@/components/GraflyMascot";
import { AText, ATextInput } from "@/components/AText";
import { HomeBackdrop } from "@/components/HomeBackdrop";
import { BrandSquiggle } from "@/components/BrandSquiggle";
import { PressScale } from "@/components/PressScale";
import { LinearGradient } from "expo-linear-gradient";
import colorsConst from "@/constants/colors";
import { onBrand } from "@/constants/contrast";

const BRAND = colorsConst.brand;

const ACHIEVEMENTS = [
  { id: "first-lesson", title: "First Step", icon: "book", color: "#00A4FA", condition: (s: any) => s.completedLessons.length >= 1 },
  { id: "week-streak", title: "On Fire", icon: "flame", color: "#FF7B00", condition: (s: any) => s.streakMax >= 7 },
  { id: "critic", title: "Critic", icon: "chatbubble-ellipses", color: "#FF7BD0", condition: () => false },
  { id: "level-5", title: "Rising", icon: "trending-up", color: "#22DD88", condition: (s: any) => s.level >= 5 },
  { id: "level-10", title: "Pro", icon: "diamond", color: "#E3ED43", condition: (s: any) => s.level >= 10 },
  { id: "coin-500", title: "Rich", icon: "coin", color: "#FFB800", condition: (s: any) => s.coins >= 500 },
  { id: "lessons-10", title: "Dedicated", icon: "ribbon", color: "#00A4FA", condition: (s: any) => s.completedLessons.length >= 10 },
  { id: "perfect", title: "Perfect", icon: "star", color: "#E3ED43", condition: () => false },
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
  const { state, toggleVoice, updateProfile } = useGame();
  const { signOut, user } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.username);

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
  // `tile` is the tint behind the whole card, `color` is the icon color.
  const STATS = [
    { label: "Total XP",   value: state.xp,                          icon: "flash",             color: colors.accent, tile: colors.accent + "30",  squiggle: "loop" as const },
    { label: "Streak",     value: state.streak,                      icon: "flame",             color: "#FF7B00",     tile: "#FF7B0022",            squiggle: "tube" as const },
    { label: "Max Streak", value: state.streakMax,                   icon: "trending-up",       color: colors.success, tile: colors.success + "1F", squiggle: "wave" as const },
    { label: "Lessons",    value: state.completedLessons.length,     icon: "checkmark-circle",  color: colors.primary, tile: colors.primary + "1F", squiggle: "loop" as const },
  ];

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
              YOUR STUDIO
            </Text>
          </View>
          <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42 }}>
            Profile
          </Text>
        </View>

        {/* Identity card — soft cyan-tinted hero with a brand-squiggle
            flourish in the corner. Avatar circle is filled with a
            slightly deeper cyan tint so the mascot pops out of the card. */}
        <Animated.View
          entering={FadeIn}
          style={{
            backgroundColor: colors.primary + "16",
            borderRadius: colors.radius,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            borderWidth: 1.5,
            borderColor: colors.primary + "33",
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
              backgroundColor: colors.primary + "26",
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
                onPress={() => { setNameInput(state.username); setEditingName(true); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
                accessibilityRole="button"
                accessibilityLabel="Edit username"
              >
                <AText
                  style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}
                  numberOfLines={1}
                >
                  {state.username}
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
                {state.weeklyXP} XP this week
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Progress */}
        <Animated.View entering={FadeIn.delay(80)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
              PROGRESS
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
              {xpPct}%
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.accent + "26",
              borderRadius: colors.radius,
              padding: 18,
              borderWidth: 1.5,
              borderColor: colors.accent + "55",
              overflow: "hidden",
            }}
          >
            {/* Lime-tinted brand squiggle in the corner */}
            <View pointerEvents="none" style={{ position: "absolute", bottom: -22, right: -10 }}>
              <BrandSquiggle variant="tube" width={92} height={130} color={BRAND.navy} opacity={0.08} drift delay={1200} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}>
                Level {xpProg.level}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.foreground + "B0" }}>
                {xpProg.current} / {xpProg.required} XP
              </Text>
            </View>
            {/* Gradient progress bar — cyan to lime, energetic */}
            <View style={{ height: 10, backgroundColor: BRAND.navy + "1A", borderRadius: 5, overflow: "hidden" }}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: "100%", width: `${xpPct}%`, borderRadius: 5 }}
              />
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.foreground + "AA", marginTop: 10 }}>
              {xpProg.required - xpProg.current} XP to Level {xpProg.level + 1}
            </Text>
          </View>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeIn.delay(130)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            BY THE NUMBERS
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
                  borderRadius: colors.radius,
                  padding: 16,
                  alignItems: "flex-start",
                  borderWidth: 1.5,
                  borderColor: stat.color + "44",
                  overflow: "hidden",
                }}
              >
                <View pointerEvents="none" style={{ position: "absolute", bottom: -14, right: -12 }}>
                  <BrandSquiggle variant={stat.squiggle} width={84} height={64} color={stat.color} opacity={0.18} drift delay={idx * 600} />
                </View>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: stat.color + "33",
                    alignItems: "center", justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.foreground + "AA", letterSpacing: 1.2, marginTop: 2 }}>
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
                  borderRadius: colors.radius,
                  padding: 16,
                  alignItems: "flex-start",
                  borderWidth: 1.5,
                  borderColor: stat.color + "44",
                  overflow: "hidden",
                }}
              >
                <View pointerEvents="none" style={{ position: "absolute", bottom: -14, right: -12 }}>
                  <BrandSquiggle variant={stat.squiggle} width={84} height={64} color={stat.color} opacity={0.18} drift delay={1200 + idx * 600} />
                </View>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: stat.color + "33",
                    alignItems: "center", justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.foreground + "AA", letterSpacing: 1.2, marginTop: 2 }}>
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
                ACHIEVEMENTS
              </Text>
              <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4, marginTop: 2 }}>
                Badges
              </Text>
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
              {unlockedCount} of {ACHIEVEMENTS.length}
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
                    // Unlocked tiles are now FILLED with a soft tint of
                    // their badge color — much more colorful than the
                    // previous all-white card with a colored ring.
                    backgroundColor: unlocked ? a.color + "1F" : colors.card,
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

        {/* Preferences */}
        <Animated.View entering={FadeIn.delay(240)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            PREFERENCES
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              paddingHorizontal: 18,
              paddingVertical: 6,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.primary + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="volume-high-outline" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    Voice feedback
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                    Spoken critiques and lessons
                  </Text>
                </View>
              </View>
              <Switch
                value={state.voiceEnabled}
                onValueChange={toggleVoice}
                trackColor={{ false: colors.muted, true: colors.primary + "60" }}
                thumbColor={state.voiceEnabled ? colors.primary : colors.mutedForeground}
              />
            </View>
          </View>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeIn.delay(290)} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            ACCOUNT
          </Text>

          {/* Upgrade-to-Pro CTA: vibrant cyan→cyanDeep gradient pill
              with NAVY text + a navy diamond icon, framed in PressScale.
              Navy on cyan is ~6.1:1 (AA), navy on cyanDeep is ~3.5:1
              (AA-Large; the text is 16px ExtraBold which qualifies). */}
          <PressScale
            onPress={() => router.push("/paywall" as any)}
            style={{ marginBottom: 10, borderRadius: 100, overflow: "hidden" }}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to Pro"
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDeep]}
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
              <Icon name="diamond" size={18} color={BRAND.navy} />
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: BRAND.navy }}>
                Upgrade to Pro
              </Text>
            </LinearGradient>
          </PressScale>

          {user ? (
            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius,
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
                    backgroundColor: colors.destructive + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="log-out-outline" size={18} color={colors.destructive} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    Sign out
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }} numberOfLines={1}>
                    {user.email ?? "Signed in"}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius,
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
                    backgroundColor: colors.primary + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="cloud-upload-outline" size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    Save your progress
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                    Sign in to sync across devices
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
