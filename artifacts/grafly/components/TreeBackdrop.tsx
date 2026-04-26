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

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function useFloat(duration: number, delay: number = 0) {
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

function useRotateLoop(duration: number, delay: number = 0, dir: 1 | -1 = 1) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withTiming(360 * dir, { duration, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, []);
  return v;
}

function GlowBlob({
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
  const t = useFloat(loop, delay);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-14, 14]) },
      { translateX: interpolate(t.value, [0, 1], [-8, 8]) },
      { scale: interpolate(t.value, [0, 1], [0.94, 1.08]) },
    ],
    opacity: interpolate(t.value, [0, 1], [alpha * 0.7, alpha]),
  }));
  return (
    <Animated.View
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

function FloatingRing({
  color,
  size,
  top,
  left,
  alpha,
  loop,
  delay,
  amp = 12,
  thickness = 1.5,
}: {
  color: string;
  size: number;
  top: number;
  left: number;
  alpha: number;
  loop: number;
  delay: number;
  amp?: number;
  thickness?: number;
}) {
  const t = useFloat(loop, delay);
  const r = useRotateLoop(loop * 4, delay, 1);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-amp, amp]) },
      { translateX: interpolate(t.value, [0, 1], [amp / 2, -amp / 2]) },
      { rotate: `${r.value}deg` },
    ],
  }));
  const aHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: `${color}${aHex}`,
        },
      ]}
    />
  );
}

function FloatingDot({
  color,
  size,
  top,
  left,
  alpha,
  loop,
  delay,
  amp = 10,
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
  const t = useFloat(loop, delay);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-amp, amp]) },
      { scale: interpolate(t.value, [0, 1], [0.85, 1.15]) },
    ],
    opacity: interpolate(t.value, [0, 1], [alpha * 0.6, alpha]),
  }));
  return (
    <Animated.View
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

function FloatingDiamond({
  color,
  size,
  top,
  left,
  alpha,
  loop,
  delay,
  amp = 12,
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
  const t = useFloat(loop, delay);
  const r = useRotateLoop(loop * 3, delay, -1);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-amp, amp]) },
      { rotate: `${45 + r.value * 0.25}deg` },
    ],
    opacity: interpolate(t.value, [0, 1], [alpha * 0.6, alpha]),
  }));
  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: 3,
        },
      ]}
    />
  );
}

function Twinkle({
  color,
  top,
  left,
  loop,
  delay,
  size = 4,
}: {
  color: string;
  top: number;
  left: number;
  loop: number;
  delay: number;
  size?: number;
}) {
  const t = useFloat(loop, delay);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.15, 0.85]),
    transform: [{ scale: interpolate(t.value, [0, 1], [0.6, 1.4]) }],
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
        },
      ]}
    >
      {/* Cross-shaped sparkle */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: size / 2 - 0.5,
          width: size,
          height: 1,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: size / 2 - 0.5,
          top: 0,
          width: 1,
          height: size,
          backgroundColor: color,
        }}
      />
    </Animated.View>
  );
}

function DotCluster({
  color,
  top,
  left,
  cols,
  rows,
  alpha,
  dotSize = 2.5,
  gap = 9,
}: {
  color: string;
  top: number;
  left: number;
  cols: number;
  rows: number;
  alpha: number;
  dotSize?: number;
  gap?: number;
}) {
  const aHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: c * (dotSize + gap),
            top: r * (dotSize + gap),
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: `${color}${aHex}`,
          }}
        />,
      );
    }
  }
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        left,
        width: cols * (dotSize + gap),
        height: rows * (dotSize + gap),
      }}
    >
      {dots}
    </View>
  );
}

export function TreeBackdrop({
  courseColor,
  foreground,
  accent,
}: {
  courseColor: string;
  foreground: string;
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
      {/* Big soft glow blobs in course color */}
      <GlowBlob
        color={courseColor}
        size={460}
        top={-220}
        left={SCREEN_W / 2 - 230}
        alpha={0.16}
        loop={9000}
        delay={0}
      />
      <GlowBlob
        color={courseColor}
        size={320}
        top={SCREEN_H * 0.42}
        left={-140}
        alpha={0.09}
        loop={11000}
        delay={2200}
      />
      <GlowBlob
        color={accent}
        size={260}
        top={SCREEN_H * 0.68}
        left={SCREEN_W - 110}
        alpha={0.1}
        loop={10000}
        delay={4000}
      />

      {/* Floating decorative shapes */}
      <FloatingRing
        color={foreground}
        size={70}
        top={140}
        left={16}
        alpha={0.08}
        loop={5400}
        delay={400}
        amp={14}
        thickness={1.5}
      />
      <FloatingRing
        color={courseColor}
        size={36}
        top={SCREEN_H * 0.55}
        left={28}
        alpha={0.32}
        loop={5800}
        delay={1600}
        amp={12}
        thickness={2}
      />
      <FloatingRing
        color={foreground}
        size={22}
        top={SCREEN_H * 0.78}
        left={SCREEN_W - 70}
        alpha={0.18}
        loop={4600}
        delay={2400}
        amp={9}
      />

      <FloatingDot
        color={courseColor}
        size={9}
        top={210}
        left={SCREEN_W - 36}
        alpha={0.5}
        loop={3200}
        delay={300}
      />
      <FloatingDot
        color={foreground}
        size={6}
        top={SCREEN_H * 0.48}
        left={SCREEN_W - 60}
        alpha={0.25}
        loop={4400}
        delay={800}
      />
      <FloatingDot
        color={courseColor}
        size={5}
        top={SCREEN_H * 0.62}
        left={36}
        alpha={0.45}
        loop={3800}
        delay={2000}
      />
      <FloatingDot
        color={accent}
        size={7}
        top={SCREEN_H * 0.86}
        left={SCREEN_W * 0.4}
        alpha={0.4}
        loop={4200}
        delay={1100}
      />

      <FloatingDiamond
        color={foreground}
        size={12}
        top={SCREEN_H * 0.4}
        left={32}
        alpha={0.16}
        loop={6800}
        delay={1200}
      />
      <FloatingDiamond
        color={courseColor}
        size={16}
        top={SCREEN_H * 0.75}
        left={SCREEN_W - 64}
        alpha={0.32}
        loop={6200}
        delay={2200}
        amp={12}
      />
      <FloatingDiamond
        color={accent}
        size={10}
        top={SCREEN_H * 0.28}
        left={SCREEN_W - 100}
        alpha={0.35}
        loop={5400}
        delay={1800}
      />

      {/* Twinkling sparkles */}
      <Twinkle color={foreground} top={300} left={120} loop={1800} delay={0} size={5} />
      <Twinkle color={courseColor} top={SCREEN_H * 0.36} left={SCREEN_W - 90} loop={2200} delay={600} size={6} />
      <Twinkle color={foreground} top={SCREEN_H * 0.58} left={90} loop={1600} delay={1200} size={4} />
      <Twinkle color={accent} top={SCREEN_H * 0.7} left={SCREEN_W * 0.55} loop={2000} delay={400} size={5} />
      <Twinkle color={foreground} top={SCREEN_H * 0.82} left={SCREEN_W * 0.18} loop={1900} delay={1400} size={4} />

      {/* Dotted grid clusters */}
      <DotCluster
        color={foreground}
        top={70}
        left={SCREEN_W - 80}
        cols={4}
        rows={3}
        alpha={0.12}
      />
      <DotCluster
        color={foreground}
        top={SCREEN_H - 320}
        left={20}
        cols={3}
        rows={4}
        alpha={0.1}
      />
    </View>
  );
}
