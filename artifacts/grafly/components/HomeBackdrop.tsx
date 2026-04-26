import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { BrandSquiggle } from "./BrandSquiggle";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function useBreath(duration: number, delay: number = 0) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, []);
  return v;
}

function MicroDot({
  color,
  size,
  top,
  left,
  alpha,
  loop,
  delay,
  amp = 3,
}: {
  color: string;
  size: number;
  top: number;
  left: number;
  alpha: number;
  loop: number;
  delay: number;
  amp?: number;
}) {
  const t = useBreath(loop, delay);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(t.value, [0, 1], [-amp, amp]) }],
    opacity: interpolate(t.value, [0, 1], [alpha * 0.6, alpha]),
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

function MicroRing({
  color,
  size,
  top,
  left,
  alpha,
  loop,
  delay,
  amp = 2,
}: {
  color: string;
  size: number;
  top: number;
  left: number;
  alpha: number;
  loop: number;
  delay: number;
  amp?: number;
}) {
  const t = useBreath(loop, delay);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-amp, amp]) },
      { scale: interpolate(t.value, [0, 1], [0.96, 1.04]) },
    ],
  }));
  const aHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: `${color}${aHex}`,
        },
      ]}
    />
  );
}

function SoftGlow({
  color,
  size,
  top,
  left,
  alpha,
  loop,
  delay,
}: {
  color: string;
  size: number;
  top: number;
  left: number;
  alpha: number;
  loop: number;
  delay: number;
}) {
  const t = useBreath(loop, delay);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [alpha * 0.7, alpha]),
    transform: [{ scale: interpolate(t.value, [0, 1], [0.97, 1.03]) }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

/**
 * Ultra-subtle background — barely-visible micro motion. No more than a
 * few small elements; very low alphas; tiny amplitudes (2–4px); slow
 * loops (6–10s) so the screen feels alive without distracting.
 */
export function HomeBackdrop({
  foreground,
  primary,
  accent,
}: {
  foreground: string;
  primary: string;
  accent: string;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      {/* Two large, very faint glows behind the content */}
      <SoftGlow
        color={primary}
        size={340}
        top={-160}
        left={SCREEN_W - 180}
        alpha={0.06}
        loop={9000}
        delay={0}
      />
      <SoftGlow
        color={accent}
        size={280}
        top={SCREEN_H * 0.6}
        left={-120}
        alpha={0.05}
        loop={11000}
        delay={2400}
      />

      {/* Brand identity squiggle motifs — the curvy tube from the 2026
          identity sheet, rendered at very low opacity so they read as
          watermark texture, not foreground noise. */}
      <View pointerEvents="none" style={{ position: "absolute", top: SCREEN_H * 0.18, left: SCREEN_W - 170 }}>
        <BrandSquiggle variant="loop" width={170} height={100} color={primary} opacity={0.07} drift delay={400} />
      </View>
      <View pointerEvents="none" style={{ position: "absolute", top: SCREEN_H * 0.5, left: -28 }}>
        <BrandSquiggle variant="tube" width={110} height={180} color={accent} opacity={0.06} strokeWidth={5} drift delay={1800} />
      </View>
      <View pointerEvents="none" style={{ position: "absolute", top: SCREEN_H * 0.78, left: SCREEN_W * 0.5 - 80 }}>
        <BrandSquiggle variant="wave" width={200} height={32} color={primary} opacity={0.06} strokeWidth={4} drift delay={1100} />
      </View>

      {/* Sparse micro dots — quiet ambient drift */}
      <MicroDot color={foreground} size={3} top={140} left={26} alpha={0.12} loop={6200} delay={300} amp={2} />
      <MicroDot color={primary} size={4} top={210} left={SCREEN_W - 38} alpha={0.18} loop={7400} delay={900} amp={3} />
      <MicroDot color={foreground} size={2} top={SCREEN_H * 0.4} left={SCREEN_W * 0.5} alpha={0.1} loop={5600} delay={1500} amp={2} />
      <MicroDot color={foreground} size={3} top={SCREEN_H * 0.55} left={32} alpha={0.1} loop={6800} delay={2100} amp={3} />
      <MicroDot color={accent} size={3} top={SCREEN_H * 0.72} left={SCREEN_W - 50} alpha={0.16} loop={7000} delay={1200} amp={3} />
      <MicroDot color={foreground} size={2} top={SCREEN_H * 0.83} left={SCREEN_W * 0.35} alpha={0.1} loop={6000} delay={1800} amp={2} />

      {/* Tiny ring outlines */}
      <MicroRing color={foreground} size={14} top={SCREEN_H * 0.32} left={SCREEN_W - 70} alpha={0.1} loop={8000} delay={600} amp={2} />
      <MicroRing color={primary} size={10} top={SCREEN_H * 0.65} left={48} alpha={0.18} loop={7200} delay={1400} amp={2} />
      <MicroRing color={foreground} size={18} top={SCREEN_H * 0.88} left={SCREEN_W * 0.6} alpha={0.08} loop={9200} delay={2000} amp={2} />
    </View>
  );
}
