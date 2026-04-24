import React from "react";
import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface PressScaleProps extends Omit<PressableProps, "style" | "children"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
}

/**
 * Subtle press feedback wrapper.
 * Scales down to 0.97 on press in (90ms), eases back to 1 on press out (180ms).
 * Pure timing curves — guaranteed no overshoot above 1.0, feels deliberate and editorial.
 */
export function PressScale({
  children,
  style,
  scaleTo = 0.97,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: PressScaleProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e) => {
        scale.value = withTiming(scaleTo, {
          duration: 90,
          easing: Easing.out(Easing.quad),
        });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, {
          duration: 180,
          easing: Easing.out(Easing.cubic),
        });
        onPressOut?.(e);
      }}
      {...rest}
    >
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
