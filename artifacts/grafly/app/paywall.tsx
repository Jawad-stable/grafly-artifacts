import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

const BENEFITS = [
  { icon: "infinite", text: "Unlimited AI critiques per day" },
  { icon: "shield-checkmark", text: "5 streak shields per month" },
  { icon: "flash", text: "Exclusive bonus XP challenges" },
  { icon: "lock-open", text: "Early access to new courses" },
  { icon: "star", text: "Pro badge on your profile" },
  { icon: "headset", text: "Priority support from the team" },
];

const PLANS = [
  { id: "monthly", label: "Monthly", price: "$4.99", period: "/month", annualEquiv: "", popular: false },
  { id: "annual", label: "Annual", price: "$39.99", period: "/year", annualEquiv: "$3.33/mo", popular: true },
];

export default function PaywallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { dispatch } = useGame();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [purchasing, setPurchasing] = useState(false);

  const pillLeft = useSharedValue(4);

  useEffect(() => {
    pillLeft.value = withSpring(selectedPlan === "monthly" ? 4 : "50%" as any, { damping: 12 });
  }, [selectedPlan]);

  const pillStyle = useAnimatedStyle(() => ({
    left: pillLeft.value,
  }));

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 20);

  async function handlePurchase() {
    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 1200));
    dispatch({ type: "SET_PRO", isPro: true });
    setPurchasing(false);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 24,
          paddingBottom: paddingBottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Close button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignSelf: "flex-end", marginBottom: 16 }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close-circle" size={30} color={colors.mutedForeground} />
        </TouchableOpacity>

        {/* Hero */}
        <Animated.View entering={FadeIn} style={{ alignItems: "center", marginBottom: 28 }}>
          <LinearGradient
            colors={[colors.pink + "30", colors.primary + "20"]}
            style={{
              width: 88,
              height: 88,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              borderWidth: 2,
              borderColor: colors.pink + "50",
            }}
          >
            <Ionicons name="star" size={42} color={colors.pink} />
          </LinearGradient>
          <Text style={{ fontSize: 30, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, textAlign: "center", marginBottom: 8 }}>
            Grafly Pro
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", lineHeight: 24 }}>
            Unlock your full design education.{"\n"}No limits. No excuses.
          </Text>
        </Animated.View>

        {/* Benefits */}
        <Animated.View entering={FadeIn.delay(100)} style={{ marginBottom: 28 }}>
          {BENEFITS.map((b, i) => (
            <Animated.View
              key={b.icon}
              entering={FadeIn.delay(100 + i * 60)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                paddingVertical: 10,
                borderBottomWidth: i < BENEFITS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: colors.pink + "20",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name={b.icon as any} size={20} color={colors.pink} />
              </View>
              <Text style={{ flex: 1, fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>
                {b.text}
              </Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Plan Toggle */}
        <Animated.View entering={FadeIn.delay(200)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", backgroundColor: colors.card, borderRadius: 100, padding: 4, position: "relative" }}>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id as "monthly" | "annual")}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: "center",
                  zIndex: 1,
                }}
                activeOpacity={0.8}
              >
                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{
                      fontSize: 15,
                      fontFamily: "Nunito_800ExtraBold",
                      color: selectedPlan === plan.id ? colors.primaryForeground : colors.foreground,
                    }}>
                      {plan.price}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: "Nunito_600SemiBold",
                      color: selectedPlan === plan.id ? colors.primaryForeground + "CC" : colors.mutedForeground,
                    }}>
                      {plan.period}
                    </Text>
                  </View>
                  {plan.popular && (
                    <View style={{
                      backgroundColor: colors.accent,
                      borderRadius: 100,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginTop: 4,
                    }}>
                      <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: "#0F0F14" }}>
                        MOST POPULAR
                      </Text>
                    </View>
                  )}
                  {plan.annualEquiv && (
                    <Text style={{
                      fontSize: 11,
                      fontFamily: "Nunito_600SemiBold",
                      color: selectedPlan === plan.id ? colors.primaryForeground + "BB" : colors.mutedForeground,
                      marginTop: plan.popular ? 0 : 4,
                    }}>
                      {plan.annualEquiv}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {/* Sliding pill */}
            <Animated.View
              style={[{
                position: "absolute",
                top: 4,
                bottom: 4,
                width: "50%",
                backgroundColor: colors.primary,
                borderRadius: 100,
                zIndex: 0,
              }, pillStyle]}
            />
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeIn.delay(300)}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.pink,
              borderRadius: colors.radius,
              paddingVertical: 20,
              alignItems: "center",
              marginBottom: 14,
              shadowColor: colors.pink,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
            }}
            onPress={handlePurchase}
            disabled={purchasing}
            activeOpacity={0.88}
          >
            <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
              {purchasing ? "Processing..." : "Unlock Grafly Pro"}
            </Text>
          </TouchableOpacity>

          <Text style={{
            fontSize: 12,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            textAlign: "center",
            lineHeight: 18,
          }}>
            Cancel anytime. Billed through the App Store.{"\n"}Subscriptions auto-renew until cancelled.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
