import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { GraflyMascot } from "@/components/GraflyMascot";

interface ShopItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  cost: number;
  type: "shield" | "refill" | "booster" | "cosmetic";
}

const SHOP_ITEMS: ShopItem[] = [
  { id: "streak-shield", name: "Streak Shield", subtitle: "Protect a missed day", icon: "shield-checkmark", iconColor: "#00A4FA", cost: 50, type: "shield" },
  { id: "energy-refill", name: "Heart Refill", subtitle: "Restore all 5 hearts", icon: "heart", iconColor: "#FF4757", cost: 100, type: "refill" },
  { id: "xp-booster", name: "XP Booster", subtitle: "Double XP for 24 hours", icon: "flash", iconColor: "#E3ED43", cost: 200, type: "booster" },
  { id: "avatar-blue", name: "Blue Frame", subtitle: "Avatar frame", icon: "person-circle", iconColor: "#00A4FA", cost: 150, type: "cosmetic" },
  { id: "avatar-gold", name: "Gold Frame", subtitle: "Rare avatar frame", icon: "person-circle", iconColor: "#FFB800", cost: 300, type: "cosmetic" },
  { id: "avatar-pink", name: "Pink Frame", subtitle: "Exclusive avatar frame", icon: "person-circle", iconColor: "#FF7BD0", cost: 400, type: "cosmetic" },
];

function ShopCard({ item, onBuy }: { item: ShopItem; onBuy: (item: ShopItem) => void }) {
  const colors = useColors();
  const { state } = useGame();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const owned = state.xpBoosterActive && item.type === "booster";
  const canAfford = state.coins >= item.cost;

  function handlePress() {
    scale.value = withSequence(
      withSpring(0.95, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    onBuy(item);
  }

  return (
    <Animated.View style={[{
      backgroundColor: colors.card, borderRadius: colors.radius,
      padding: 18, marginBottom: 12,
      flexDirection: "row", alignItems: "center", gap: 16,
      borderWidth: owned ? 2 : 1,
      borderColor: owned ? item.iconColor : colors.border,
    }, anim]}>
      <View style={{
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: item.iconColor + "20",
        alignItems: "center", justifyContent: "center",
      }}>
        <Ionicons name={item.icon as any} size={26} color={item.iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 2 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
          {item.subtitle}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={owned || !canAfford}
        style={{
          flexDirection: "row", alignItems: "center", gap: 5,
          backgroundColor: owned ? colors.success + "20" : canAfford ? colors.accent : colors.muted,
          borderRadius: 100,
          paddingHorizontal: 14, paddingVertical: 8,
        }}
      >
        {!owned && <Ionicons name="ellipse" size={12} color={canAfford ? colors.accentForeground : colors.mutedForeground} />}
        <Text style={{
          fontSize: 14, fontFamily: "Nunito_800ExtraBold",
          color: owned ? colors.success : canAfford ? colors.accentForeground : colors.mutedForeground,
        }}>
          {owned ? "Active" : item.cost}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, purchaseShield, refillHearts, purchaseBooster } = useGame();
  const [toast, setToast] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<"idle" | "celebrate" | "oops">("idle");

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuy(item: ShopItem) {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let success = false;
    if (item.type === "shield") success = purchaseShield();
    else if (item.type === "refill") success = refillHearts();
    else if (item.type === "booster") success = purchaseBooster();
    else {
      if (state.coins >= item.cost) {
        success = true;
        showToast(`${item.name} equipped!`);
      }
    }

    if (item.type !== "cosmetic") {
      if (success) {
        setMascotState("celebrate");
        showToast(`${item.name} purchased!`);
      } else {
        setMascotState("oops");
        showToast("Not enough coins");
      }
      setTimeout(() => setMascotState("idle"), 2000);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: paddingTop + 12, paddingHorizontal: 24, paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial header */}
        <Animated.View entering={FadeIn} style={{ marginBottom: 22 }}>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 4 }}>
            POWER UP
          </Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42 }}>
                Shop
              </Text>
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10,
                backgroundColor: colors.foreground, borderRadius: 100,
                paddingHorizontal: 14, paddingVertical: 8, alignSelf: "flex-start",
              }}>
                <Ionicons name="ellipse" size={12} color={colors.warning} />
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                  {state.coins} coins
                </Text>
              </View>
            </View>
            <GraflyMascot state={mascotState} size={90} />
          </View>
        </Animated.View>

        {/* Power-ups */}
        <Animated.View entering={FadeIn.delay(80)}>
          <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 10, letterSpacing: 1 }}>
            POWER UPS
          </Text>
          {SHOP_ITEMS.filter((i) => i.type !== "cosmetic").map((item) => (
            <ShopCard key={item.id} item={item} onBuy={handleBuy} />
          ))}
        </Animated.View>

        {/* Cosmetics */}
        <Animated.View entering={FadeIn.delay(160)}>
          <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 10, marginTop: 8, letterSpacing: 1 }}>
            AVATAR FRAMES
          </Text>
          {SHOP_ITEMS.filter((i) => i.type === "cosmetic").map((item) => (
            <ShopCard key={item.id} item={item} onBuy={handleBuy} />
          ))}
        </Animated.View>
      </ScrollView>

      {/* Toast */}
      {toast && (
        <Animated.View
          entering={FadeIn}
          style={{
            position: "absolute",
            bottom: 120,
            alignSelf: "center",
            backgroundColor: colors.card,
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {toast}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
