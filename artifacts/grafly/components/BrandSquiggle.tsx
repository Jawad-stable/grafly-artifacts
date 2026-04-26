import React, { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";

const SMOOTH = Easing.inOut(Easing.sin);

type SquiggleVariant = "loop" | "wave" | "tube";

interface BrandSquiggleProps {
  variant?: SquiggleVariant;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  style?: ViewStyle;
  drift?: boolean;
  delay?: number;
}

const PATHS: Record<SquiggleVariant, string> = {
  // Single curvy tube — echoes the looped paint-stroke motif from the
  // 2026 brand identity sheet (top-down swirl).
  loop:
    "M20 80 C 20 30, 70 10, 100 40 S 180 100, 160 50 S 90 5, 60 60 S 130 130, 180 90",
  // Long ribbon wave — used as a subtle horizontal underline / divider.
  wave:
    "M0 24 C 30 8, 60 40, 90 24 S 150 8, 180 24 S 240 40, 270 24 S 330 8, 360 24",
  // Vertical tube curl — the pinched S-shape from the brand sheet
  // sticker compositions.
  tube:
    "M50 10 C 90 30, 30 70, 70 100 S 110 160, 50 190",
};

const VIEWBOX: Record<SquiggleVariant, string> = {
  loop: "0 0 200 120",
  wave: "0 0 360 48",
  tube: "0 0 120 200",
};

/**
 * A reusable brand decoration — the curvy tube/squiggle motif from the
 * Grafly 2026 identity sheet. Renders as low-opacity SVG so it reads
 * as a watermark behind content, not a foreground element.
 *
 * `drift` adds a slow translate / scale breath so it feels alive,
 * matching the cadence of HomeBackdrop's MicroDots and SoftGlows.
 */
export function BrandSquiggle({
  variant = "loop",
  width = 160,
  height = 96,
  color = "#00A4FA",
  strokeWidth = 6,
  opacity = 0.08,
  style,
  drift = false,
  delay = 0,
}: BrandSquiggleProps) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (!drift) return;
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 9000, easing: SMOOTH }),
        -1,
        true,
      ),
    );
  }, [drift, delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(t.value, [0, 1], [-3, 3]) },
      { translateY: interpolate(t.value, [0, 1], [2, -2]) },
      { scale: interpolate(t.value, [0, 1], [0.98, 1.02]) },
    ],
  }));

  const Container: any = drift ? Animated.View : View;
  const containerStyle = drift ? [{ opacity }, animStyle, style] : [{ opacity }, style];

  return (
    <Container pointerEvents="none" style={containerStyle}>
      <Svg width={width} height={height} viewBox={VIEWBOX[variant]} fill="none">
        <Path
          d={PATHS[variant]}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Container>
  );
}
