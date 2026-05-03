import React, { useState } from "react";
import {
  View,
  FlatList,
  Platform,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { AText } from "@/components/AText";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { useProfile } from "@/context/ProfileContext";
import { PressScale } from "@/components/PressScale";
import { useT } from "@/hooks/useT";

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

// Podium ring colors — gold, silver, bronze.
// Hardcoded to map cleanly to the 1/2/3 medal metaphor that
// already exists across the app (DIVISION_COLORS, PODIUM_COLORS,
// CustomTabBar, etc).
const RANK_RING = {
  first: "#FFB800",
  second: "#B6BCD1",
  third: "#CD7F32",
};

type Rank = keyof typeof RANK_RING;

function avatarPalette(seed: string): { bg: string; fg: string } {
  // Use the existing palette to color initial avatars consistently.
  // We hash the seed to pick one of a few brand-aligned tints.
  const tints = [
    { bg: "#FFE0EE", fg: "#FF7BD0" },
    { bg: "#E1F4FF", fg: "#00A4FA" },
    { bg: "#FFF1C2", fg: "#E89B00" },
    { bg: "#D7F5E6", fg: "#1FB874" },
    { bg: "#EAE2FF", fg: "#7B6BFF" },
    { bg: "#FFE3D6", fg: "#F26B3A" },
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return tints[hash % tints.length];
}

function rankPillPalette(rank: number): { bg: string; fg: string } {
  // Cycle through brand colors so the rank pills feel alive,
  // but stay inside the project palette. Foregrounds tuned to
  // keep 13px text comfortably readable on the pastel ground.
  const cycle = [
    { bg: "#FFE3D6", fg: "#C84A1F" },
    { bg: "#FFF1C2", fg: "#A36A00" },
    { bg: "#FFE0EE", fg: "#C8479A" },
    { bg: "#E1F4FF", fg: "#0073B0" },
    { bg: "#D7F5E6", fg: "#138654" },
    { bg: "#EAE2FF", fg: "#5847CC" },
  ];
  return cycle[(rank - 1) % cycle.length];
}

function PodiumAvatar({
  user,
  rank,
  size,
}: {
  user: { name: string };
  rank: Rank;
  size: number;
}) {
  const palette = avatarPalette(user.name);
  const ring = RANK_RING[rank];
  const ringWidth = rank === "first" ? 4 : 3;
  const innerSize = size - ringWidth * 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ringWidth,
        borderColor: ring,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: palette.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AText
          style={{
            fontSize: rank === "first" ? 26 : 22,
            fontFamily: "Nunito_800ExtraBold",
            color: palette.fg,
            letterSpacing: 0.5,
          }}
        >
          {user.name.slice(0, 2).toUpperCase()}
        </AText>
      </View>
    </View>
  );
}

function MedalBadge({
  rank,
  number,
}: {
  rank: Rank;
  number: number;
}) {
  const ring = RANK_RING[rank];
  return (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: ring,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <AText
        style={{
          fontSize: 12,
          fontFamily: "Nunito_800ExtraBold",
          color: "#FFFFFF",
          lineHeight: 14,
        }}
      >
        {number}
      </AText>
    </View>
  );
}

function PodiumColumn({
  user,
  rank,
  size,
  highlight,
}: {
  user: { name: string; weeklyXP: number } | undefined;
  rank: Rank;
  size: number;
  highlight: boolean;
}) {
  const colors = useColors();
  const { t } = useT();
  if (!user) return <View style={{ flex: 1 }} />;
  const rankNumber = rank === "first" ? 1 : rank === "second" ? 2 : 3;

  return (
    <View style={{ flex: rank === "first" ? 1.15 : 1, alignItems: "center" }}>
      <View style={{ alignItems: "center", paddingTop: rank === "first" ? 0 : 18 }}>
        <View>
          <PodiumAvatar user={user} rank={rank} size={size} />
          <View
            style={{
              position: "absolute",
              bottom: -8,
              alignSelf: "center",
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <MedalBadge rank={rank} number={rankNumber} />
          </View>
        </View>
        <View style={{ height: 18 }} />
        <AText
          numberOfLines={1}
          style={{
            fontSize: rank === "first" ? 16 : 14,
            fontFamily: "Nunito_800ExtraBold",
            color: highlight ? colors.primary : colors.foreground,
            textAlign: "center",
            maxWidth: size + 20,
          }}
        >
          {user.name.split(" ").slice(0, 2).join(" ")}
        </AText>
        <AText
          style={{
            fontSize: 12,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            marginTop: 2,
          }}
        >
          {t("lb.xp", { n: user.weeklyXP })}
        </AText>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const { state: profileState } = useProfile();
  const { t, isRTL, dir } = useT();
  const [tab, setTab] = useState<"global" | "friends">("global");

  const paddingTop = insets.top + (Platform.OS === "web" ? 60 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 24);

  const displayUsers = tab === "global" ? GLOBAL_USERS : FRIENDS_USERS;
  const userEntry = {
    id: "me",
    name: profileState.username,
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
      {/* Header — back, title with flame, diamonds pill */}
      <Animated.View
        entering={FadeInDown.duration(520).easing(Easing.out(Easing.cubic))}
        style={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <PressScale
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/");
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={isRTL ? "arrow-forward" : "arrow-back"} size={20} color={colors.foreground} />
          </PressScale>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}>
            <AText
              style={{
                fontSize: 26,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -0.5,
              }}
            >
              {t("lb.title")}
            </AText>
            <Icon name="flame" size={22} color={"#F26B3A"} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: colors.card,
              borderRadius: 20,
            }}
          >
            <Icon name="diamond" size={16} color={colors.primary} />
            <AText
              style={{
                fontSize: 14,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
              }}
            >
              {state.weeklyXP}
            </AText>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.card,
            borderRadius: 100,
            padding: 5,
          }}
        >
          {(["global", "friends"] as const).map((tt) => (
            <PressScale
              key={tt}
              onPress={() => setTab(tt)}
              scaleTo={0.98}
              style={{
                flex: 1,
                backgroundColor: tab === tt ? colors.foreground : "transparent",
                borderRadius: 100,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <AText
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_800ExtraBold",
                  color: tab === tt ? colors.background : colors.mutedForeground,
                  letterSpacing: 0.3,
                }}
              >
                {tt === "global" ? t("lb.global") : t("lb.friends")}
              </AText>
            </PressScale>
          ))}
        </View>
      </Animated.View>

      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: paddingBottom + (!userInTop3 ? 88 : 0),
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 20 }}>
            {/* Podium — 2 / 1 / 3 */}
            <Animated.View
              entering={FadeIn.duration(420).easing(Easing.out(Easing.cubic))}
              style={{
                marginTop: 6,
                marginBottom: 22,
                paddingTop: 6,
                paddingBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <PodiumColumn
                  user={top3[1]}
                  rank="second"
                  size={78}
                  highlight={top3[1]?.name === profileState.username}
                />
                <PodiumColumn
                  user={top3[0]}
                  rank="first"
                  size={104}
                  highlight={top3[0]?.name === profileState.username}
                />
                <PodiumColumn
                  user={top3[2]}
                  rank="third"
                  size={78}
                  highlight={top3[2]?.name === profileState.username}
                />
              </View>
            </Animated.View>

            {/* Section divider */}
            <View
              style={{
                height: 1,
                backgroundColor: colors.border + "60",
                marginBottom: 14,
                marginHorizontal: 4,
              }}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          const rank = index + 4;
          const isMe = item.id === "me";
          const avatar = avatarPalette(item.name);
          const pill = rankPillPalette(rank);

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 30)
                .duration(380)
                .easing(Easing.out(Easing.cubic))}
              style={{
                marginHorizontal: 14,
                marginBottom: 4,
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: isMe ? colors.primary + "15" : "transparent",
                borderRadius: 18,
                borderWidth: isMe ? 1.25 : 0,
                borderColor: isMe ? colors.primary : "transparent",
              }}
            >
              {/* Avatar */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: avatar.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AText
                  style={{
                    fontSize: 16,
                    fontFamily: "Nunito_800ExtraBold",
                    color: avatar.fg,
                  }}
                >
                  {item.name.slice(0, 2).toUpperCase()}
                </AText>
              </View>

              {/* Name + points */}
              <View style={{ flex: 1 }}>
                <AText
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: "Nunito_800ExtraBold",
                    color: isMe ? colors.primary : colors.foreground,
                  }}
                >
                  {item.name}
                  {isMe ? " " + t("lb.you") : ""}
                </AText>
                <AText
                  style={{
                    fontSize: 12,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.mutedForeground,
                    marginTop: 1,
                  }}
                >
                  {t("lb.xp", { n: item.weeklyXP })}
                </AText>
              </View>

              {/* Rank pill */}
              <View
                style={{
                  minWidth: 36,
                  height: 32,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                  backgroundColor: pill.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AText
                  style={{
                    fontSize: 13,
                    fontFamily: "Nunito_800ExtraBold",
                    color: pill.fg,
                    lineHeight: 14,
                  }}
                >
                  {rank}
                </AText>
              </View>
            </Animated.View>
          );
        }}
      />

      {/* Sticky "(You)" bar — overlays the bottom so the user
          always sees their rank without scrolling. */}
      {!userInTop3 ? (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 14,
            paddingTop: 8,
            paddingBottom: insets.bottom + 8,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: colors.primary + "15",
              borderRadius: 18,
              borderWidth: 1.25,
              borderColor: colors.primary,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + "30",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AText
                style={{
                  fontSize: 16,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.primary,
                }}
              >
                {profileState.username.slice(0, 2).toUpperCase()}
              </AText>
            </View>
            <View style={{ flex: 1 }}>
              <AText
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.primary,
                }}
              >
                {profileState.username} {t("lb.you")}
              </AText>
              <AText
                style={{
                  fontSize: 12,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.mutedForeground,
                  marginTop: 1,
                }}
              >
                {t("lb.xp", { n: state.weeklyXP })}
              </AText>
            </View>
            <View
              style={{
                minWidth: 44,
                height: 32,
                paddingHorizontal: 10,
                borderRadius: 16,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AText
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.primaryForeground,
                  lineHeight: 14,
                }}
              >
                {userRank}
              </AText>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
