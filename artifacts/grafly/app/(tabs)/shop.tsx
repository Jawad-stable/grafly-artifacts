import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { GraflyMascot } from "@/components/GraflyMascot";
import { BrandSquiggle } from "@/components/BrandSquiggle";
import { LinearGradient } from "expo-linear-gradient";
import { onBrand } from "@/constants/contrast";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

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

/**
 * Vibrant shop card. Each card is filled in its item's brand color so
 * the shop reads as a colorful storefront, matching the home-tab course
 * cards and the design-principles welcome card. Text colors are picked
 * via onBrand() so contrast is AA on every fill (lime/yellow → navy,
 * cyan/red/pink → white).
 */
function ShopCard({ item, onBuy }: { item: ShopItem; onBuy: (item: ShopItem) => void }) {
  const colors = useColors();
  const { state } = useGame();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const owned = state.xpBoosterActive && item.type === "booster";
  const canAfford = state.coins >= item.cost;
  const fg = onBrand(item.iconColor); // navy on bright, white on dark
  const isLight = fg === "#FFFFFF";

  function handlePress() {
    scale.value = withSequence(
      withTiming(0.97, { duration: 90, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) })
    );
    onBuy(item);
  }

  return (
    <Animated.View
      style={[
        {
          backgroundColor: item.iconColor,
          borderRadius: 22,
          padding: 18,
          marginBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          overflow: "hidden",
          shadowColor: item.iconColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.28,
          shadowRadius: 14,
          elevation: 5,
        },
        anim,
      ]}
    >
      {/* Brand squiggle flourish — placed top-LEFT behind the icon
          chip so the price pill on the right has clean, uncluttered
          space and stays readable. */}
      <View pointerEvents="none" style={{ position: "absolute", left: -22, top: -14 }}>
        <BrandSquiggle
          variant="loop"
          width={120}
          height={75}
          color={fg}
          opacity={isLight ? 0.13 : 0.16}
          strokeWidth={4}
        />
      </View>

      {/* Translucent icon chip on top of the colored card */}
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: fg + "26",
          borderWidth: 1,
          borderColor: fg + "55",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={item.icon as any} size={26} color={fg} weight="fill" />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: "Nunito_800ExtraBold",
            color: fg,
            letterSpacing: -0.3,
            marginBottom: 2,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Nunito_600SemiBold",
            color: fg + "CC",
          }}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Price pill — uniformly high contrast and lifted off the
          colored card with a shadow so the price never gets lost.
          Coin icon and number share the same color (navy on light
          pill, white on dark pill) so the whole pill reads as one
          confident block instead of two competing brand colors. */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={owned || !canAfford}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: owned ? fg + "33" : canAfford ? fg : fg + "30",
          borderRadius: 100,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderWidth: owned ? 1 : 0,
          borderColor: owned ? fg + "66" : "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: canAfford && !owned ? 0.18 : 0,
          shadowRadius: 6,
          elevation: canAfford && !owned ? 4 : 0,
        }}
      >
        {owned ? (
          <>
            <Icon name="checkmark" size={15} color={fg} weight="bold" />
            <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: fg }}>
              Active
            </Text>
          </>
        ) : (
          <>
            {/* Pill text color = the OPPOSITE of the card foreground.
                Light pill (white) → navy text. Dark pill (navy) →
                white text. Always 12:1+ contrast, never blends with
                the squiggle. */}
            {(() => {
              const onPill = canAfford
                ? (isLight ? "#21263F" : "#FFFFFF")
                : fg + "AA";
              return (
                <>
                  <Icon name="coin" size={15} color={onPill} weight="fill" />
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Nunito_800ExtraBold",
                      color: onPill,
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.cost}
                  </Text>
                </>
              );
            })()}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * Section heading with a small brand color dot — gives each section
 * (Power-ups vs Avatar Frames) a distinct visual anchor.
 */
function SectionHeading({ label, dotColor, mt = 0 }: { label: string; dotColor: string; mt?: number }) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        marginTop: mt,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: dotColor,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Nunito_800ExtraBold",
          color: colors.mutedForeground,
          letterSpacing: 1.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, purchaseShield, refillHearts, purchaseBooster } = useGame();
  const [toast, setToast] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<"idle" | "celebrate" | "oops">("idle");

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + 100;

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
      {/* Brand backdrop — three drifting squiggle motifs at low alpha,
          matching the home/tree treatment so the shop feels part of
          the same visual world. */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}
      >
        <View style={{ position: "absolute", top: SCREEN_H * 0.18, left: -24 }}>
          <BrandSquiggle variant="loop" width={150} height={90} color={colors.brand.cyan} opacity={0.08} drift delay={400} />
        </View>
        <View style={{ position: "absolute", top: SCREEN_H * 0.55, left: SCREEN_W - 100 }}>
          <BrandSquiggle variant="tube" width={100} height={170} color={colors.brand.pink} opacity={0.07} strokeWidth={5} drift delay={1800} />
        </View>
        <View style={{ position: "absolute", top: SCREEN_H * 0.82, left: SCREEN_W * 0.45 - 100 }}>
          <BrandSquiggle variant="wave" width={200} height={32} color={colors.brand.lime} opacity={0.1} strokeWidth={4} drift delay={1100} />
        </View>
      </View>

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
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42 }}>
                Shop
              </Text>
              {/* Coin balance pill — same brand pattern as the home
                  tab streak/coin chips: lime gradient with navy text,
                  AA-safe and instantly recognizable as Grafly. */}
              <LinearGradient
                colors={[colors.brand.lime, "#C7D11A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 12,
                  borderRadius: 100,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  alignSelf: "flex-start",
                  shadowColor: colors.brand.lime,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Icon name="coin" size={14} color={colors.brand.navy} weight="fill" />
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.brand.navy }}>
                  {state.coins} coins
                </Text>
              </LinearGradient>
            </View>
            <GraflyMascot state={mascotState} size={96} />
          </View>
        </Animated.View>

        {/* Power-ups */}
        <Animated.View entering={FadeIn.delay(80)}>
          <SectionHeading label="POWER UPS" dotColor={colors.brand.cyan} />
          {SHOP_ITEMS.filter((i) => i.type !== "cosmetic").map((item) => (
            <ShopCard key={item.id} item={item} onBuy={handleBuy} />
          ))}
        </Animated.View>

        {/* Cosmetics */}
        <Animated.View entering={FadeIn.delay(160)}>
          <SectionHeading label="AVATAR FRAMES" dotColor={colors.brand.pink} mt={10} />
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
            backgroundColor: colors.foreground,
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
            {toast}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
