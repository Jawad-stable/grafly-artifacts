import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { PressScale } from "@/components/PressScale";

const GLOBAL_USERS = [
  { id: "1", name: "Aria Chen", weeklyXP: 1580, streak: 21, level: 12, division: "diamond" },
  { id: "2", name: "Jude Okafor", weeklyXP: 1420, streak: 14, level: 10, division: "diamond" },
  { id: "3", name: "Sophie Müller", weeklyXP: 1280, streak: 18, level: 9, division: "platinum" },
  { id: "4", name: "Kai Nakamura", weeklyXP: 960, streak: 7, level: 8, division: "platinum" },
  { id: "5", name: "Lena Rossi", weeklyXP: 840, streak: 12, level: 7, division: "gold" },
  { id: "6", name: "Omar Faris", weeklyXP: 720, streak: 5, level: 6, division: "gold" },
  { id: "7", name: "Priya Nair", weeklyXP: 610, streak: 8, level: 5, division: "silver" },
  { id: "8", name: "Felix Braun", weeklyXP: 490, streak: 3, level: 4, division: "silver" },
  { id: "9", name: "Mia Laurent", weeklyXP: 380, streak: 6, level: 4, division: "silver" },
  { id: "10", name: "Ben Torres", weeklyXP: 280, streak: 2, level: 3, division: "bronze" },
];

const FRIENDS_USERS = [
  { id: "f1", name: "Alex Kim", weeklyXP: 540, streak: 9, level: 5, division: "silver" },
  { id: "f2", name: "Jordan Lee", weeklyXP: 320, streak: 4, level: 3, division: "bronze" },
  { id: "f3", name: "Sam Rivera", weeklyXP: 180, streak: 2, level: 2, division: "bronze" },
];

const DIVISION_COLORS: Record<string, string> = {
  diamond: "#FF7BD0",
  platinum: "#00A4FA",
  gold: "#FFB800",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

const PODIUM_ICONS = ["trophy", "medal", "ribbon"];
const PODIUM_COLORS = ["#FFB800", "#C0C0C0", "#CD7F32"];

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const [tab, setTab] = useState<"global" | "friends">("global");

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 24);

  const displayUsers = tab === "global" ? GLOBAL_USERS : FRIENDS_USERS;
  const userEntry = {
    id: "me",
    name: state.username,
    weeklyXP: state.weeklyXP,
    streak: state.streak,
    level: state.level,
    division: "bronze",
  };

  const allUsers = [...displayUsers, userEntry].sort((a, b) => b.weeklyXP - a.weeklyXP);
  const userRank = allUsers.findIndex((u) => u.id === "me") + 1;
  const top3 = allUsers.slice(0, 3);
  const rest = allUsers.slice(3);
  const userInTop3 = userRank <= 3;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Editorial header */}
      <Animated.View
        entering={FadeInDown.duration(520).easing(Easing.out(Easing.cubic))}
        style={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 24,
          paddingBottom: 18,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <PressScale
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ width: 40, height: 40, borderRadius: 100, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="arrow-back" size={20} color={colors.foreground} />
          </PressScale>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
              THIS WEEK
            </Text>
            <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42 }}>
              Leaderboard
            </Text>
          </View>
        </View>

        {/* Tabs — editorial near-black active pill */}
        <View style={{ flexDirection: "row", backgroundColor: colors.card, borderRadius: 100, padding: 5 }}>
          {(["global", "friends"] as const).map((t) => (
            <PressScale
              key={t}
              onPress={() => setTab(t)}
              scaleTo={0.98}
              style={{
                flex: 1,
                backgroundColor: tab === t ? colors.foreground : "transparent",
                borderRadius: 100,
                paddingVertical: 11,
                alignItems: "center",
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: "Nunito_800ExtraBold",
                color: tab === t ? colors.background : colors.mutedForeground,
                letterSpacing: 0.3,
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </PressScale>
          ))}
        </View>
      </Animated.View>

      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: paddingBottom }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 24 }}>
            {/* Podium */}
            <Animated.View entering={FadeIn} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 0 }}>
                {/* 2nd place */}
                {top3[1] && (
                  <View style={{ alignItems: "center", flex: 1 }}>
                    <View style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: PODIUM_COLORS[1] + "25",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                      borderWidth: 2,
                      borderColor: PODIUM_COLORS[1],
                    }}>
                      <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: PODIUM_COLORS[1] }}>
                        {top3[1].name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, textAlign: "center", marginBottom: 4 }} numberOfLines={1}>
                      {top3[1].name}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                      {top3[1].weeklyXP} XP
                    </Text>
                    <View style={{
                      backgroundColor: PODIUM_COLORS[1] + "20",
                      height: 60,
                      width: "100%",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: PODIUM_COLORS[1] }}>2</Text>
                    </View>
                  </View>
                )}

                {/* 1st place */}
                {top3[0] && (
                  <View style={{ alignItems: "center", flex: 1.2 }}>
                    <Icon name="trophy" size={22} color={PODIUM_COLORS[0]} style={{ marginBottom: 4 }} />
                    <View style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: PODIUM_COLORS[0] + "25",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                      borderWidth: 3,
                      borderColor: PODIUM_COLORS[0],
                    }}>
                      <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: PODIUM_COLORS[0] }}>
                        {top3[0].name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, textAlign: "center", marginBottom: 4 }} numberOfLines={1}>
                      {top3[0].name}
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                      {top3[0].weeklyXP} XP
                    </Text>
                    <View style={{
                      backgroundColor: PODIUM_COLORS[0] + "20",
                      height: 88,
                      width: "100%",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: PODIUM_COLORS[0] }}>1</Text>
                    </View>
                  </View>
                )}

                {/* 3rd place */}
                {top3[2] && (
                  <View style={{ alignItems: "center", flex: 1 }}>
                    <View style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: PODIUM_COLORS[2] + "25",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                      borderWidth: 2,
                      borderColor: PODIUM_COLORS[2],
                    }}>
                      <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: PODIUM_COLORS[2] }}>
                        {top3[2].name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, textAlign: "center", marginBottom: 4 }} numberOfLines={1}>
                      {top3[2].name}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                      {top3[2].weeklyXP} XP
                    </Text>
                    <View style={{
                      backgroundColor: PODIUM_COLORS[2] + "20",
                      height: 44,
                      width: "100%",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: PODIUM_COLORS[2] }}>3</Text>
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>
          </View>
        }
        renderItem={({ item, index }) => {
          const rank = index + 4;
          const isMe = item.id === "me";
          const divColor = DIVISION_COLORS[item.division ?? "bronze"];

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 35).duration(420).easing(Easing.out(Easing.cubic))}
              style={{
                marginHorizontal: 24,
                marginBottom: 10,
                backgroundColor: isMe ? colors.primary + "15" : colors.card,
                borderRadius: colors.radius,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                borderWidth: isMe ? 1.5 : 0,
                borderColor: isMe ? colors.primary : "transparent",
              }}
            >
              <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, width: 28, textAlign: "center" }}>
                {rank}
              </Text>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isMe ? colors.primary + "30" : colors.muted,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: isMe ? colors.primary : colors.foreground }}>
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: isMe ? colors.primary : colors.foreground }}>
                  {item.name}
                  {isMe ? " (You)" : ""}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  Lv.{item.level} · {item.streak}d streak
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Icon name="flash" size={13} color={colors.accent} />
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {item.weeklyXP}
                </Text>
              </View>
            </Animated.View>
          );
        }}
        ListFooterComponent={
          !userInTop3 ? (
            <View style={{
              marginHorizontal: 24,
              marginTop: 8,
              marginBottom: paddingBottom,
              backgroundColor: colors.primary + "15",
              borderRadius: colors.radius,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}>
              <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.primary, width: 28, textAlign: "center" }}>
                #{userRank}
              </Text>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary + "30",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.primary }}>
                  {state.username.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.primary }}>
                  {state.username} (You)
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  Lv.{state.level} · {state.streak}d streak
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Icon name="flash" size={13} color={colors.accent} />
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {state.weeklyXP}
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}
