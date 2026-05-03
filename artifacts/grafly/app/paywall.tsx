import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { PressScale } from "@/components/PressScale";
import { GraflyMascot } from "@/components/GraflyMascot";
import { useT } from "@/hooks/useT";

type PlanId = "monthly" | "annual";

export default function PaywallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { dispatch } = useGame();
  const { t, isRTL } = useT();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("annual");
  const [purchasing, setPurchasing] = useState(false);

  const BENEFITS = [
    { icon: "infinite", title: t("pay.b1.title"), subtitle: t("pay.b1.sub") },
    { icon: "shield-checkmark", title: t("pay.b2.title"), subtitle: t("pay.b2.sub") },
    { icon: "flash", title: t("pay.b3.title"), subtitle: t("pay.b3.sub") },
    { icon: "lock-open", title: t("pay.b4.title"), subtitle: t("pay.b4.sub") },
    { icon: "star", title: t("pay.b5.title"), subtitle: t("pay.b5.sub") },
    { icon: "headset", title: t("pay.b6.title"), subtitle: t("pay.b6.sub") },
  ];

  const PLANS: {
    id: PlanId;
    label: string;
    price: string;
    period: string;
    caption: string;
    badge?: string;
  }[] = [
    {
      id: "annual",
      label: t("pay.annual"),
      price: "$39.99",
      period: t("pay.perYear"),
      caption: t("pay.annual.cap"),
      badge: t("pay.save"),
    },
    {
      id: "monthly",
      label: t("pay.monthly"),
      price: "$4.99",
      period: t("pay.perMonth"),
      caption: t("pay.monthly.cap"),
    },
  ];

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 24);

  async function handlePurchase() {
    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 1200));
    dispatch({ type: "SET_PRO", isPro: true });
    setPurchasing(false);
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  const activePlan = PLANS.find((p) => p.id === selectedPlan)!;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 24,
          paddingBottom: paddingBottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar with close */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1.5,
            }}
          >
            {t("pay.brand")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/");
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="close" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Editorial hero */}
        <Animated.View entering={FadeIn} style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 44,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              letterSpacing: -1.2,
              lineHeight: 46,
              marginBottom: 12,
            }}
          >
            {t("pay.headline")}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground,
              lineHeight: 24,
            }}
          >
            {t("pay.sub")}
          </Text>
        </Animated.View>

        {/* Editorial mascot card */}
        <Animated.View
          entering={FadeIn.delay(80)}
          style={{
            backgroundColor: colors.pink,
            borderRadius: 24,
            padding: 22,
            marginBottom: 28,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Icon name="star" size={14} color={colors.pinkForeground} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.pinkForeground,
                  letterSpacing: 1.4,
                }}
              >
                {t("pay.join")}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.pinkForeground,
                letterSpacing: -0.4,
                lineHeight: 26,
              }}
            >
              {t("pay.trial")}
            </Text>
          </View>
          <View
            style={{
              width: 96,
              height: 96,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraflyMascot state="celebrate" size={96} float />
          </View>
        </Animated.View>

        {/* Benefits */}
        <Animated.View entering={FadeIn.delay(160)} style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            {t("pay.what")}
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              letterSpacing: -0.4,
              marginBottom: 14,
            }}
          >
            {t("pay.everything")}
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: colors.radius.md,
              paddingHorizontal: 18,
              paddingVertical: 6,
            }}
          >
            {BENEFITS.map((b, i) => (
              <View
                key={b.icon}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  paddingVertical: 14,
                  borderBottomWidth: i < BENEFITS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.pink + "22",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={b.icon as any} size={20} color={colors.pink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Nunito_800ExtraBold",
                      color: colors.foreground,
                      marginBottom: 2,
                    }}
                  >
                    {b.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Nunito_600SemiBold",
                      color: colors.mutedForeground,
                    }}
                  >
                    {b.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Plan picker — stacked editorial cards */}
        <Animated.View entering={FadeIn.delay(240)} style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            {t("pay.choose")}
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              letterSpacing: -0.4,
              marginBottom: 14,
            }}
          >
            {t("pay.pickFits")}
          </Text>
          <View style={{ gap: 12 }}>
            {PLANS.map((plan) => {
              const selected = selectedPlan === plan.id;
              return (
                <PressScale
                  key={plan.id}
                  onPress={() => setSelectedPlan(plan.id)}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: colors.radius.md,
                    padding: 18,
                    borderWidth: 2,
                    borderColor: selected ? colors.foreground : colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: selected ? colors.foreground : colors.border,
                      backgroundColor: selected ? colors.foreground : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && (
                      <Icon name="checkmark" size={14} color={colors.background} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          fontFamily: "Nunito_800ExtraBold",
                          color: colors.foreground,
                          letterSpacing: -0.3,
                        }}
                      >
                        {plan.label}
                      </Text>
                      {plan.badge && (
                        <View
                          style={{
                            backgroundColor: colors.accent,
                            borderRadius: 100,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: "Nunito_800ExtraBold",
                              color: colors.accentForeground,
                              letterSpacing: 0.6,
                            }}
                          >
                            {plan.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Nunito_600SemiBold",
                        color: colors.mutedForeground,
                      }}
                    >
                      {plan.caption}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: "Nunito_800ExtraBold",
                        color: colors.foreground,
                        letterSpacing: -0.4,
                      }}
                    >
                      {plan.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Nunito_600SemiBold",
                        color: colors.mutedForeground,
                        marginTop: 2,
                      }}
                    >
                      {plan.period}
                    </Text>
                  </View>
                </PressScale>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky CTA footer */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 24,
          paddingTop: 14,
          paddingBottom: paddingBottom,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <PressScale
          style={{
            backgroundColor: colors.foreground,
            borderRadius: 100,
            paddingVertical: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            opacity: purchasing ? 0.7 : 1,
          }}
          onPress={handlePurchase}
          disabled={purchasing}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.background,
            }}
          >
            {purchasing
              ? t("pay.processing")
              : t("pay.startWith", { plan: activePlan.label, price: activePlan.price })}
          </Text>
          {!purchasing && (
            <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={18} color={colors.background} />
          )}
        </PressScale>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            textAlign: "center",
            marginTop: 10,
            lineHeight: 16,
          }}
        >
          {t("pay.legal")}
        </Text>
      </View>
    </View>
  );
}
