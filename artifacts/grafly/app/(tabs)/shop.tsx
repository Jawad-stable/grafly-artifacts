import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  cost: number;
  type: "shield" | "refill" | "booster" | "cosmetic";
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "streak-shield",
    name: "Streak Shield",
    description: "Protects your streak for one missed day. Max 3.",
    icon: "shield-checkmark",
    iconColor: "#00A4FA",
    cost: 50,
    type: "shield",
  },
  {
    id: "energy-refill",
    name: "Energy Refill",
    description: "Restore all 5 hearts instantly.",
    icon: "heart",
    iconColor: "#FF4757",
    cost: 100,
    type: "refill",
  },
  {
    id: "xp-booster",
    name: "XP Booster 2x",
    description: "Double your XP earnings for 24 hours.",
    icon: "flash",
    iconColor: "#E3ED43",
    cost: 200,
    type: "booster",
  },
  {
    id: "avatar-blue",
    name: "Blue Frame",
    description: "Exclusive blue avatar frame for your profile.",
    icon: "person-circle",
    iconColor: "#00A4FA",
    cost: 150,
    type: "cosmetic",
  },
  {
    id: "avatar-gold",
    name: "Gold Frame",
    description: "Premium gold avatar frame — rare and sought after.",
    icon: "person-circle",
    iconColor: "#FFB800",
    cost: 300,
    type: "cosmetic",
  },
  {
    id: "avatar-pink",
    name: "Pink Frame",
    description: "Vibrant pink frame for standout profiles.",
    icon: "person-circle",
    iconColor: "#FF7BD0",
    cost: 250,
    type: "cosmetic",
  },
];

function ItemCard({ item, onPress }: { item: ShopItem; onPress: () => void }) {
  const colors = useColors();
  const { state } = useGame();
  const scale = useSharedValue(1);
  const canAfford = state.coins >= item.cost;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          padding: 18,
          marginBottom: 12,
          borderWidth: 1.5,
          borderColor: canAfford ? colors.border : colors.border + "50",
          opacity: canAfford ? 1 : 0.6,
        }}
        onPress={() => {
          scale.value = withSpring(0.97, { damping: 10 }, () => {
            scale.value = withSpring(1);
          });
          onPress();
        }}
        activeOpacity={0.85}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
          <View style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: item.iconColor + "20",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Ionicons name={item.icon as any} size={26} color={item.iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 4 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 18, marginBottom: 12 }}>
              {item.description}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="ellipse" size={13} color="#FFB800" />
                <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                  {item.cost}
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  coins
                </Text>
              </View>
              <View style={{
                backgroundColor: canAfford ? colors.primary : colors.muted,
                borderRadius: 100,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}>
                <Text style={{
                  fontSize: 13,
                  fontFamily: "Nunito_800ExtraBold",
                  color: canAfford ? colors.primaryForeground : colors.mutedForeground,
                }}>
                  {canAfford ? "Buy" : "Not enough"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, purchaseShield, purchaseBooster, refillHearts, addCoins } = useGame();

  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  function handlePurchase(item: ShopItem) {
    let success = false;
    let message = "";

    switch (item.type) {
      case "shield":
        if (state.streakShields >= 3) {
          Alert.alert("Max Shields", "You already have 3 streak shields.");
          return;
        }
        success = purchaseShield();
        message = "Streak Shield activated!";
        break;
      case "refill":
        success = refillHearts();
        message = "Hearts restored to full!";
        break;
      case "booster":
        success = purchaseBooster();
        message = "XP Booster active for 24 hours!";
        break;
      case "cosmetic":
        if (state.coins < item.cost) {
          success = false;
        } else {
          addCoins(-item.cost);
          success = true;
          message = `${item.name} unlocked!`;
        }
        break;
    }

    if (!success) {
      Alert.alert("Not Enough Coins", `You need ${item.cost} coins to buy this item.`);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Purchased!", message);
    }
    setConfirmItem(null);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        paddingTop: paddingTop + 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <View>
          <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            Shop
          </Text>
          <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
            Spend coins, boost your learning
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.card,
          borderRadius: 100,
          paddingHorizontal: 14,
          paddingVertical: 8,
        }}>
          <Ionicons name="ellipse" size={14} color="#FFB800" />
          <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
            {state.coins}
          </Text>
        </View>
      </View>

      {/* Pro banner */}
      {!state.isPro && (
        <Animated.View entering={FadeIn} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.pink + "15",
              borderRadius: colors.radius,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 1.5,
              borderColor: colors.pink + "50",
            }}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            <Ionicons name="star" size={24} color={colors.pink} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                Unlock Grafly Pro
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                Unlimited critiques + extra shields from $4.99/mo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.pink} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <FlatList
        data={SHOP_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: paddingBottom }}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => setConfirmItem(item)} />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Confirm Modal */}
      <Modal
        visible={!!confirmItem}
        animationType="slide"
        transparent
        onRequestClose={() => setConfirmItem(null)}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setConfirmItem(null)} />
        {confirmItem && (
          <View style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 28,
            paddingBottom: insets.bottom + 20,
          }}>
            <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: "center", marginBottom: 24 }} />
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: confirmItem.iconColor + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}>
                <Ionicons name={confirmItem.icon as any} size={34} color={confirmItem.iconColor} />
              </View>
              <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 6 }}>
                {confirmItem.name}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", lineHeight: 20 }}>
                {confirmItem.description}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
              <Ionicons name="ellipse" size={16} color="#FFB800" />
              <Text style={{ fontSize: 24, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {confirmItem.cost} coins
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: state.coins >= confirmItem.cost ? colors.primary : colors.muted,
                borderRadius: colors.radius,
                paddingVertical: 18,
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() => handlePurchase(confirmItem)}
              activeOpacity={0.85}
            >
              <Text style={{
                fontSize: 17,
                fontFamily: "Nunito_800ExtraBold",
                color: state.coins >= confirmItem.cost ? colors.primaryForeground : colors.mutedForeground,
              }}>
                Confirm Purchase
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmItem(null)} style={{ paddingVertical: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}
