import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  TextInput,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { GraflyMascot } from "@/components/GraflyMascot";
import { AText, ATextInput } from "@/components/AText";

const ACHIEVEMENTS = [
  { id: "first-lesson", title: "First Step", icon: "book", color: "#00A4FA", condition: (s: any) => s.completedLessons.length >= 1 },
  { id: "week-streak", title: "On Fire", icon: "flame", color: "#FF7B00", condition: (s: any) => s.streakMax >= 7 },
  { id: "critic", title: "Critic", icon: "chatbubble-ellipses", color: "#FF7BD0", condition: () => false },
  { id: "level-5", title: "Rising", icon: "trending-up", color: "#22DD88", condition: (s: any) => s.level >= 5 },
  { id: "level-10", title: "Pro", icon: "diamond", color: "#E3ED43", condition: (s: any) => s.level >= 10 },
  { id: "coin-500", title: "Rich", icon: "ellipse", color: "#FFB800", condition: (s: any) => s.coins >= 500 },
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

  const STATS = [
    { label: "Total XP", value: state.xp, icon: "flash", color: colors.accent },
    { label: "Streak", value: state.streak, icon: "flame", color: "#FF7B00" },
    { label: "Max Streak", value: state.streakMax, icon: "trending-up", color: colors.success },
    { label: "Lessons", value: state.completedLessons.length, icon: "checkmark-circle", color: colors.primary },
  ];

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.condition(state)).length;
  const xpPct = Math.min(100, Math.round((xpProg.current / xpProg.required) * 100));
  const placementLabel =
    state.placementLevel.charAt(0).toUpperCase() + state.placementLevel.slice(1);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: paddingTop + 12, paddingHorizontal: 24, paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial title */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 4 }}>
            YOUR STUDIO
          </Text>
          <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42 }}>
            Profile
          </Text>
        </View>

        {/* Identity card — left aligned editorial */}
        <Animated.View
          entering={FadeIn}
          style={{
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.muted,
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
                  <Ionicons name="checkmark-circle" size={28} color={colors.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => { setNameInput(state.username); setEditingName(true); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <AText
                  style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}
                  numberOfLines={1}
                >
                  {state.username}
                </AText>
                <Ionicons name="pencil" size={14} color={colors.mutedForeground} />
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
              <Ionicons name={divInfo.icon as any} size={14} color={divInfo.color} />
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
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              padding: 18,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.4 }}>
                Level {xpProg.level}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {xpProg.current} / {xpProg.required} XP
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
              <View
                style={{
                  height: "100%",
                  width: `${xpPct}%`,
                  backgroundColor: colors.accent,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 10 }}>
              {xpProg.required - xpProg.current} XP to Level {xpProg.level + 1}
            </Text>
          </View>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeIn.delay(130)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 10 }}>
            BY THE NUMBERS
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {STATS.slice(0, 2).map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  padding: 16,
                  alignItems: "flex-start",
                }}
              >
                <Ionicons name={stat.icon as any} size={20} color={stat.color} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.2, marginTop: 2 }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {STATS.slice(2, 4).map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  padding: 16,
                  alignItems: "flex-start",
                }}
              >
                <Ionicons name={stat.icon as any} size={20} color={stat.color} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.6 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.2, marginTop: 2 }}>
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
                    backgroundColor: colors.card,
                    borderRadius: 18,
                    padding: 14,
                    alignItems: "center",
                    gap: 8,
                    borderWidth: 2,
                    borderColor: unlocked ? a.color : colors.border,
                    opacity: unlocked ? 1 : 0.55,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: unlocked ? a.color + "25" : colors.muted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={a.icon as any} size={24} color={unlocked ? a.color : colors.mutedForeground} />
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
                  {!unlocked && <Ionicons name="lock-closed" size={12} color={colors.mutedForeground} />}
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
                  <Ionicons name="volume-high-outline" size={18} color={colors.primary} />
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

          <TouchableOpacity
            style={{
              backgroundColor: colors.foreground,
              borderRadius: 100,
              paddingVertical: 18,
              paddingHorizontal: 22,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 10,
            }}
            onPress={() => router.push("/paywall" as any)}
            activeOpacity={0.88}
          >
            <Ionicons name="diamond" size={18} color={colors.accent} />
            <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
              Upgrade to Pro
            </Text>
          </TouchableOpacity>

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
                  <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
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
              <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
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
                  <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />
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
              <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
