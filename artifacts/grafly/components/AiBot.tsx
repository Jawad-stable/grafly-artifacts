import React, { useEffect } from "react";
import { Image } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AI_BOT } from "@/constants/assets";

const SMOOTH = Easing.out(Easing.cubic);

// AI bot avatar. Renders the blue starfish/fan logo. When `spinning`
// is true it rotates continuously like a fan, used to signal that
// the AI is "thinking" while a request is in flight.
export function AiBot({
  size,
  spinning = false,
}: {
  size: number;
  spinning?: boolean;
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(rotation);
    if (spinning) {
      // Reset to 0 on the UI thread, then start a continuous repeating
      // rotation. Linear easing so the spin is even and fan-like.
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 900, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      // Ease back to the rest position when the bot stops thinking.
      rotation.value = withTiming(0, { duration: 220, easing: SMOOTH });
    }
    return () => {
      cancelAnimation(rotation);
    };
  }, [spinning]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Wrap the Image in an Animated.View — Animated.View reliably honours
  // transform styles on every platform (including web), whereas
  // Animated.Image can drop transforms on some renderers.
  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        animStyle,
      ]}
    >
      <Image
        source={AI_BOT}
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    </Animated.View>
  );
}
