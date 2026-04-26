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
      { translateY: interpolate(t.value, [0, 1], [-10, 10]) },
      { translateX: interpolate(t.value, [0, 1], [-6, 6]) },
      { scale: interpolate(t.value, [0, 1], [0.96, 1.05]) },
    ],
    opacity: interpolate(t.value, [0, 1], [alpha * 0.75, alpha]),
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
 * Skill-tree backdrop. Restrained, editorial — two soft course-color
 * glows for depth, plus a few drifting BrandSquiggle motifs from the
 * 2026 identity sheet so the page reads as recognizably Grafly without
 * the busy sparkles/dots/diamonds that used to crowd the screen.
 */
export function TreeBackdrop({
  courseColor,
  foreground,
  accent,
}: {
  courseColor: string;
  foreground: string;
  accent: string;
}) {
  // `foreground` is intentionally accepted to keep the API stable for
  // callers; the new layout doesn't render foreground-tinted noise.
  void foreground;

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
      {/* Two soft course-color glows for depth — the only ambient
          fills. Kept large and very low-amplitude so they read as
          atmosphere, not motion. */}
      <GlowBlob
        color={courseColor}
        size={420}
        top={-200}
        left={SCREEN_W / 2 - 210}
        alpha={0.12}
        loop={10000}
        delay={0}
      />
      <GlowBlob
        color={accent}
        size={260}
        top={SCREEN_H * 0.72}
        left={SCREEN_W - 110}
        alpha={0.07}
        loop={11000}
        delay={3200}
      />

      {/* Brand identity squiggle motifs — the curvy tube/wave/loop
          from the 2026 identity sheet, low-opacity so they read as
          watermark texture behind the node tree. */}
      <View style={{ position: "absolute", top: SCREEN_H * 0.22, left: -20 }}>
        <BrandSquiggle
          variant="loop"
          width={150}
          height={90}
          color={courseColor}
          opacity={0.09}
          strokeWidth={5}
          drift
          delay={400}
        />
      </View>
      <View style={{ position: "absolute", top: SCREEN_H * 0.5, left: SCREEN_W - 110 }}>
        <BrandSquiggle
          variant="tube"
          width={100}
          height={170}
          color={accent}
          opacity={0.08}
          strokeWidth={5}
          drift
          delay={1800}
        />
      </View>
      <View style={{ position: "absolute", top: SCREEN_H * 0.85, left: SCREEN_W * 0.5 - 100 }}>
        <BrandSquiggle
          variant="wave"
          width={220}
          height={36}
          color={courseColor}
          opacity={0.08}
          strokeWidth={4}
          drift
          delay={1100}
        />
      </View>
    </View>
  );
}
