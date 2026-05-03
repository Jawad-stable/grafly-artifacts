import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 14, radius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.55, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: colors.muted,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function LoadingDots({ color, size = 8 }: { color: string; size?: number }) {
  const a = useSharedValue(0.3);
  const b = useSharedValue(0.3);
  const c = useSharedValue(0.3);

  useEffect(() => {
    const cfg = { duration: 360, easing: Easing.inOut(Easing.ease) };
    const make = (sv: typeof a, delay: number) => {
      setTimeout(() => {
        sv.value = withRepeat(
          withSequence(withTiming(1, cfg), withTiming(0.3, cfg)),
          -1,
          true,
        );
      }, delay);
    };
    make(a, 0);
    make(b, 120);
    make(c, 240);
  }, []);

  const sa = useAnimatedStyle(() => ({ opacity: a.value }));
  const sb = useAnimatedStyle(() => ({ opacity: b.value }));
  const sc = useAnimatedStyle(() => ({ opacity: c.value }));
  const dot = { width: size, height: size, borderRadius: size / 2, backgroundColor: color };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: size * 0.6 }}>
      <Animated.View style={[dot, sa]} />
      <Animated.View style={[dot, sb]} />
      <Animated.View style={[dot, sc]} />
    </View>
  );
}
