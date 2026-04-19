import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { MASCOT, type MascotState } from "@/constants/assets";

interface GraflyMascotProps {
  state?: MascotState;
  size?: number;
  float?: boolean;
}

export function GraflyMascot({
  state = "idle",
  size = 120,
  float = false,
}: GraflyMascotProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });

    if (float) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        true
      );
    } else {
      translateY.value = withSpring(0, { damping: 14 });
    }

    if (state === "celebrate") {
      rotate.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 120 }),
          withTiming(8, { duration: 120 }),
          withTiming(0, { duration: 120 })
        ),
        3,
        false
      );
    } else if (state === "oops") {
      translateY.value = withSequence(
        withSpring(-10, { damping: 8 }),
        withSpring(4, { damping: 10 }),
        withSpring(0, { damping: 14 })
      );
    } else if (state === "correct") {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    } else if (state === "wrong") {
      rotate.value = withSequence(
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(0, { duration: 80 })
      );
    }
  }, [state, float]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animStyle]}>
      <Image
        source={MASCOT[state]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
