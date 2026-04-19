import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, getXPProgress } from "@/context/GameContext";

const ACHIEVEMENTS = [
  { id: "first-lesson", title: "First Step", desc: "Complete your first lesson", icon: "book", condition: (s: any) => s.completedLessons.length >= 1 },
  { id: "week-streak", title: "On Fire", desc: "Reach a 7-day streak", icon: "flame", condition: (s: any) => s.streakMax >= 7 },
  { id: "first-critique", title: "Critic", desc: "Submit your first AI critique", icon: "chatbubble-ellipses", condition: (s: any) => false },
  { id: "level-5", title: "Rising Designer", desc: "Reach Level 5", icon: "trending-up", condition: (s: any) => s.level >= 5 },
  { id: "level-10", title: "Pro Designer", desc: "Reach Level 10", icon: "diamond", condition: (s: any) => s.level >= 10 },
  { id: "coin-500", title: "Coin Collector", desc: "Accumulate 500 coins", icon: "ellipse", condition: (s: any) => s.coins >= 500 },
  { id: "lessons-10", title: "Dedicated", desc: "Complete 10 lessons", icon: "ribbon", condition: (s: any) => s.completedLessons.length >= 10 },
  { id: "perfect", title: "Perfect Score", desc: "Complete a quiz without errors", icon: "star", condition: (s: any) => false },
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
  const { state, toggleVoice } = useGame();

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  const xpProg = getXPProgress(state.xp);
  const division = getDivision(state.weeklyXP);
  const divInfo = DIVISION_INFO[division];
  const initials = state.username.slice(0, 2).toUpperCase();

  const placementColors: Record<string, string> = {
    novice: "#7A7A9A",
    beginner: "#00A4FA",
    intermediate: "#22DD88",
    advanced: "#E3ED43",
    expert: "#FF7BD0",
  };
  const placementLabel: Record<string, string> = {
    novice: "Novice",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 20,
          paddingBottom: paddingBottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <Animated.View entering={FadeIn} style={{ alignItems: "center", marginBottom: 28 }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: colors.primary + "25",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            borderWidth: 3,
            borderColor: colors.primary,
          }}>
            <Text style={{ fontSize: 32, fontFamily: "Nunito_800ExtraBold", color: colors.primary }}>
              {initials}
            </Text>
          </View>
          <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 4 }}>
            {state.username}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ backgroundColor: colors.primary + "20", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.primary }}>
                LVL {xpProg.level}
              </Text>
            </View>
            <View style={{ backgroundColor: placementColors[state.placementLevel] + "20", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: placementColors[state.placementLevel] }}>
                {placementLabel[state.placementLevel]}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* XP Progress */}
        <Animated.View entering={FadeIn.delay(100)} style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              Level {xpProg.level} → {xpProg.level + 1}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              {xpProg.current}/{xpProg.required} XP
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
            <View style={{
              height: "100%",
              width: `${Math.round((xpProg.current / xpProg.required) * 100)}%`,
              backgroundColor: colors.accent,
              borderRadius: 4,
            }} />
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeIn.delay(150)} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              { label: "Total XP", value: state.xp, icon: "flash", color: colors.accent },
              { label: "Streak", value: state.streak, icon: "flame", color: "#FF7B00" },
              { label: "Max Streak", value: state.streakMax, icon: "trending-up", color: colors.success },
              { label: "Completed", value: state.completedLessons.length, icon: "checkmark-circle", color: colors.primary },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                padding: 12,
                alignItems: "center",
              }}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 10, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center" }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Division */}
        <Animated.View entering={FadeIn.delay(200)} style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          padding: 18,
          marginBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}>
          <View style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: divInfo.color + "20",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Ionicons name={divInfo.icon as any} size={28} color={divInfo.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {divInfo.label} Division
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              {state.weeklyXP} XP this week
            </Text>
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeIn.delay(250)}>
          <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 14 }}>
            Achievements
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {ACHIEVEMENTS.map((a) => {
              const unlocked = a.condition(state);
              return (
                <View
                  key={a.id}
                  style={{
                    width: "48%",
                    backgroundColor: colors.card,
                    borderRadius: colors.radius,
                    padding: 14,
                    opacity: unlocked ? 1 : 0.45,
                    borderWidth: unlocked ? 1.5 : 0,
                    borderColor: unlocked ? colors.accent + "60" : "transparent",
                  }}
                >
                  <Ionicons
                    name={a.icon as any}
                    size={24}
                    color={unlocked ? colors.accent : colors.mutedForeground}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: unlocked ? colors.foreground : colors.mutedForeground, marginBottom: 2 }}>
                    {a.title}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 16 }}>
                    {a.desc}
                  </Text>
                  {!unlocked && (
                    <View style={{ position: "absolute", top: 12, right: 12 }}>
                      <Ionicons name="lock-closed" size={14} color={colors.mutedForeground} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeIn.delay(300)}>
          <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 14 }}>
            Settings
          </Text>

          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, overflow: "hidden" }}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                <Ionicons name="volume-high" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  Voice Feedback
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  AI voice encouragement & feedback
                </Text>
              </View>
              <Switch
                value={state.voiceEnabled}
                onValueChange={toggleVoice}
                trackColor={{ false: colors.muted, true: colors.primary + "80" }}
                thumbColor={state.voiceEnabled ? colors.primary : colors.mutedForeground}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", padding: 18 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accent + "20", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  Streak Shields
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  {state.streakShields}/3 shields active
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {Array.from({ length: state.streakShields }).map(() => "🛡").join("") || "—"}
              </Text>
            </View>
          </View>

          {!state.isPro && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.pink + "15",
                borderRadius: colors.radius,
                padding: 18,
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                borderWidth: 1.5,
                borderColor: colors.pink + "40",
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="star" size={22} color={colors.pink} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  Upgrade to Grafly Pro
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  Unlimited critiques + premium features
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.pink} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
