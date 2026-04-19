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
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  const xpProg = getXPProgress(state.xp);
  const division = getDivision(state.weeklyXP);
  const divInfo = DIVISION_INFO[division];

  const placementColors: Record<string, string> = {
    novice: "#8A90B0",
    beginner: "#00A4FA",
    intermediate: "#22DD88",
    advanced: "#E3ED43",
    expert: "#FF7BD0",
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: paddingTop + 12, paddingHorizontal: 20, paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header with mascot */}
        <Animated.View entering={FadeIn} style={{ alignItems: "center", marginBottom: 24 }}>
          <GraflyMascot state="idle" size={120} />
          <View style={{ marginTop: 16, alignItems: "center" }}>
            {editingName ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ATextInput
                  style={{
                    backgroundColor: colors.card, borderRadius: 12,
                    paddingHorizontal: 16, paddingVertical: 10,
                    fontSize: 20, fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground, borderWidth: 2, borderColor: colors.primary,
                    minWidth: 160, textAlign: "center",
                  }}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  maxLength={24}
                  onSubmitEditing={saveName}
                  onBlur={saveName}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={saveName}>
                  <Ionicons name="checkmark-circle" size={28} color={colors.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setNameInput(state.username); setEditingName(true); }} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <AText style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {state.username}
                </AText>
                <Ionicons name="pencil" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8, alignItems: "center" }}>
              <View style={{ backgroundColor: colors.primary + "20", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.primary }}>
                  LVL {xpProg.level}
                </Text>
              </View>
              <View style={{ backgroundColor: divInfo.color + "20", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: divInfo.color }}>
                  {divInfo.label}
                </Text>
              </View>
              <View style={{ backgroundColor: placementColors[state.placementLevel] + "20", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: placementColors[state.placementLevel] }}>
                  {state.placementLevel.charAt(0).toUpperCase() + state.placementLevel.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* XP Progress */}
        <Animated.View entering={FadeIn.delay(80)} style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              Level {xpProg.level}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              Level {xpProg.level + 1}
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
            <View style={{
              height: "100%",
              width: `${Math.round((xpProg.current / xpProg.required) * 100)}%`,
              backgroundColor: colors.accent, borderRadius: 4,
            }} />
          </View>
          <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", marginTop: 8 }}>
            {xpProg.current} / {xpProg.required} XP
          </Text>
        </Animated.View>

        {/* Stats 2x2 grid */}
        <Animated.View entering={FadeIn.delay(130)} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {STATS.slice(0, 2).map((stat) => (
              <View key={stat.label} style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 16, alignItems: "center" }}>
                <Ionicons name={stat.icon as any} size={22} color={stat.color} style={{ marginBottom: 6 }} />
                <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 10, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {STATS.slice(2, 4).map((stat) => (
              <View key={stat.label} style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 16, alignItems: "center" }}>
                <Ionicons name={stat.icon as any} size={22} color={stat.color} style={{ marginBottom: 6 }} />
                <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 10, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Achievements — horizontal scroll */}
        <Animated.View entering={FadeIn.delay(190)}>
          <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 12 }}>
            Achievements
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingRight: 20 }}>
            {ACHIEVEMENTS.map((a) => {
              const unlocked = a.condition(state);
              return (
                <View key={a.id} style={{
                  width: 100, backgroundColor: colors.card, borderRadius: 18,
                  padding: 14, alignItems: "center", gap: 6,
                  borderWidth: 2, borderColor: unlocked ? a.color : colors.border,
                  opacity: unlocked ? 1 : 0.5,
                }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: unlocked ? a.color + "25" : colors.muted,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Ionicons name={a.icon as any} size={22} color={unlocked ? a.color : colors.mutedForeground} />
                  </View>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: unlocked ? colors.foreground : colors.mutedForeground, textAlign: "center" }}>
                    {a.title}
                  </Text>
                  {!unlocked && <Ionicons name="lock-closed" size={12} color={colors.mutedForeground} />}
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeIn.delay(240)} style={{ marginTop: 24, gap: 10 }}>
          <View style={{
            backgroundColor: colors.card, borderRadius: colors.radius, padding: 18,
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Ionicons name="volume-high-outline" size={22} color={colors.primary} />
              <View>
                <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>Voice Feedback</Text>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>ElevenLabs audio</Text>
              </View>
            </View>
            <Switch
              value={state.voiceEnabled}
              onValueChange={toggleVoice}
              trackColor={{ false: colors.muted, true: colors.primary + "60" }}
              thumbColor={state.voiceEnabled ? colors.primary : colors.mutedForeground}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary, borderRadius: colors.radius,
              padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
            }}
            onPress={() => router.push("/paywall" as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="diamond" size={20} color={colors.primaryForeground} />
            <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
              Upgrade to Pro
            </Text>
          </TouchableOpacity>

          {user ? (
            <TouchableOpacity
              style={{
                backgroundColor: colors.card, borderRadius: colors.radius,
                padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
                borderWidth: 1.5, borderColor: colors.destructive + "40",
              }}
              onPress={signOut}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.destructive }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary, borderRadius: colors.radius,
                padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
              }}
              onPress={() => router.push("/auth")}
              activeOpacity={0.85}
            >
              <Ionicons name="cloud-upload-outline" size={20} color={colors.primaryForeground} />
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.primaryForeground }}>
                Save Your Progress
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
