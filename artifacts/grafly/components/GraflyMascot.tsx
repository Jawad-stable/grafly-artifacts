import React, { useEffect } from "react";
import { Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { MASCOT, type MascotState } from "@/constants/assets";

interface GraflyMascotProps {
  state?: MascotState;
  size?: number;
  float?: boolean;
}

const SMOOTH_OUT = Easing.out(Easing.cubic);
const SMOOTH_IN_OUT = Easing.inOut(Easing.cubic);

export function GraflyMascot({
  state = "idle",
  size = 120,
  float = false,
}: GraflyMascotProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 360, easing: SMOOTH_OUT });

    if (float) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 1400, easing: SMOOTH_IN_OUT }),
          withTiming(0, { duration: 1400, easing: SMOOTH_IN_OUT })
        ),
        -1,
        true
      );
    } else {
      translateY.value = withTiming(0, { duration: 320, easing: SMOOTH_OUT });
    }

    if (state === "celebrate") {
      rotate.value = withSequence(
        withTiming(-4, { duration: 220, easing: SMOOTH_IN_OUT }),
        withTiming(4, { duration: 220, easing: SMOOTH_IN_OUT }),
        withTiming(0, { duration: 220, easing: SMOOTH_OUT })
      );
      scale.value = withSequence(
        withTiming(1.06, { duration: 260, easing: SMOOTH_OUT }),
        withTiming(1, { duration: 320, easing: SMOOTH_OUT })
      );
    } else if (state === "oops") {
      translateY.value = withSequence(
        withTiming(-6, { duration: 220, easing: SMOOTH_OUT }),
        withTiming(0, { duration: 320, easing: SMOOTH_OUT })
      );
    } else if (state === "correct") {
      scale.value = withSequence(
        withTiming(1.08, { duration: 220, easing: SMOOTH_OUT }),
        withTiming(1, { duration: 320, easing: SMOOTH_OUT })
      );
    } else if (state === "wrong") {
      rotate.value = withSequence(
        withTiming(-4, { duration: 160, easing: SMOOTH_IN_OUT }),
        withTiming(4, { duration: 160, easing: SMOOTH_IN_OUT }),
        withTiming(0, { duration: 220, easing: SMOOTH_OUT })
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
