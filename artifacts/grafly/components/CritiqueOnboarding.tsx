import React, { useEffect, useState } from "react";
import { Dimensions, Platform, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { PressScale } from "@/components/PressScale";
import { useColors } from "@/hooks/useColors";
import { COINS_PER_SESSION, XP_PER_SESSION } from "@/constants/critique";
import { useT } from "@/hooks/useT";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type OnboardStep = {
  title: string;
  body: string;
  ring?: { left: number; top: number; w: number; h: number; radius: number };
  tooltip: { top?: number; bottom?: number };
};

// First-run walkthrough for the critique tab. Four steps:
//   1. welcome
//   2. shuffle button (top-right of the header)
//   3. design card (full-bleed photo)
//   4. composer / chat to earn XP
//
// The ring positions for steps 2 and 4 are derived from the device
// dims + safe-area insets. Step 3 receives the live measured
// position of the design card via `cardRect` so the highlight stays
// glued to the card even when surrounding text scaling shifts it.
export function CritiqueOnboarding({
  insets,
  onClose,
  cardRect,
}: {
  insets: { top: number; bottom: number };
  onClose: () => void;
  cardRect: { left: number; top: number; width: number; height: number };
}) {
  const colors = useColors();
  const { t } = useT();
  const [step, setStep] = useState(0);

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, []);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.18]) }],
    opacity: interpolate(pulse.value, [0, 1], [0.95, 0.45]),
  }));

  const headerTop = insets.top + (Platform.OS === "web" ? 67 : 0) + 10;
  const tabBottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 62 + tabBottomPad;
  const composerY = SCREEN_H - tabBarHeight - 12 - 70;

  // Tooltip for the card step sits below the card, with a small gap.
  const cardTooltipTop = Math.min(
    cardRect.top + cardRect.height + 18,
    SCREEN_H - 280,
  );

  const STEPS: OnboardStep[] = [
    {
      title: t("critOb.s1.t"),
      body: t("critOb.s1.b"),
      tooltip: { top: SCREEN_H * 0.32 },
    },
    {
      title: t("critOb.s2.t"),
      body: t("critOb.s2.b"),
      ring: {
        left: SCREEN_W - 60,
        top: headerTop + 18,
        w: 44,
        h: 44,
        radius: 100,
      },
      tooltip: { top: headerTop + 90 },
    },
    {
      title: t("critOb.s3.t"),
      body: t("critOb.s3.b"),
      ring: {
        left: cardRect.left,
        top: cardRect.top,
        w: cardRect.width,
        h: cardRect.height,
        radius: 24,
      },
      tooltip: { top: cardTooltipTop },
    },
    {
      title: t("critOb.s4.t"),
      body: t("critOb.s4.b", { xp: XP_PER_SESSION, coins: COINS_PER_SESSION }),
      ring: { left: 16, top: composerY, w: SCREEN_W - 32, h: 64, radius: 28 },
      tooltip: { bottom: tabBarHeight + 120 },
    },
  ];

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Dim backdrop — tap-through disabled to focus on the tooltip */}
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(7, 11, 28, 0.78)",
        }}
      />

      {/* Pulsing highlight ring */}
      {current.ring && (
        <Animated.View
          pointerEvents="none"
          style={[
            ringStyle,
            {
              position: "absolute",
              left: current.ring.left,
              top: current.ring.top,
              width: current.ring.w,
              height: current.ring.h,
              borderRadius: current.ring.radius,
              borderWidth: 3,
              borderColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 14,
              elevation: 8,
            },
          ]}
        />
      )}

      {/* Step counter chip */}
      <Animated.View
        key={`chip-${step}`}
        entering={FadeIn.duration(220)}
        style={{
          position: "absolute",
          top: insets.top + 14,
          alignSelf: "center",
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 100,
            backgroundColor: "rgba(255,255,255,0.16)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.22)",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Nunito_800ExtraBold",
              color: "#FFFFFF",
              letterSpacing: 1.4,
            }}
          >
            {t("critOb.step", { n: step + 1, total: STEPS.length })}
          </Text>
        </View>
      </Animated.View>

      {/* Tooltip card */}
      <Animated.View
        key={`card-${step}`}
        entering={FadeInUp.duration(360).easing(Easing.out(Easing.cubic))}
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          ...(current.tooltip.top !== undefined
            ? { top: current.tooltip.top }
            : { bottom: current.tooltip.bottom }),
          backgroundColor: colors.card,
          borderRadius: 22,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.35,
          shadowRadius: 30,
          elevation: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 100,
              backgroundColor: colors.accent + "26",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="bulb" size={16} color={colors.accent} />
          </View>
          <Text
            style={{
              fontSize: 17,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              letterSpacing: -0.3,
              flex: 1,
            }}
          >
            {current.title}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            marginBottom: 18,
          }}
        >
          {current.body}
        </Text>

        {/* Step dots */}
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === step ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === step ? colors.accent : colors.border,
              }}
            />
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {!isLast && (
            <Pressable
              onPress={onClose}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground,
                  letterSpacing: 0.3,
                }}
              >
                {t("critOb.skip")}
              </Text>
            </Pressable>
          )}
          <View style={{ flex: 1 }} />
          <PressScale
            onPress={next}
            style={{
              backgroundColor: colors.foreground,
              paddingHorizontal: 22,
              paddingVertical: 13,
              borderRadius: 100,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.background,
                letterSpacing: 0.2,
              }}
            >
              {isLast ? t("critOb.gotIt") : t("critOb.next")}
            </Text>
            <Icon
              name={isLast ? "checkmark" : "arrow-forward"}
              size={15}
              color={colors.background}
            />
          </PressScale>
        </View>
      </Animated.View>
    </View>
  );
}
