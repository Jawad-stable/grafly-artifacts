import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type ShapeKind = "ring" | "circle" | "square" | "diamond" | "dotGrid";

type Shape = {
  kind: ShapeKind;
  right: number;
  top: number;
  size: number;
  alpha: string;
  loop: number;
  delay: number;
  amp?: number;
  drift?: number;
  rotate?: number;
  pulse?: boolean;
  useAccent?: boolean;
};

const SHAPES: Shape[] = [
  { kind: "ring",    right: 14,  top: 8,   size: 130, alpha: "1F", loop: 5200, delay: 0,    amp: 6,  drift: 4 },
  { kind: "ring",    right: 90,  top: -20, size: 80,  alpha: "26", loop: 4400, delay: 200,  amp: 8,  drift: -4 },
  { kind: "ring",    right: 138, top: 80,  size: 18,  alpha: "66", loop: 2800, delay: 600,  amp: 14, drift: 2 },
  { kind: "circle",  right: 130, top: 30,  size: 12,  alpha: "FF", loop: 2400, delay: 300,  amp: 12, useAccent: true, pulse: true },
  { kind: "square",  right: 95,  top: 128, size: 10,  alpha: "66", loop: 3400, delay: 700,  amp: 7,  rotate: 9000 },
  { kind: "diamond", right: 168, top: 30,  size: 12,  alpha: "55", loop: 3600, delay: 900,  amp: 10, rotate: -8000 },
  { kind: "dotGrid", right: 16,  top: 18,  size: 26,  alpha: "44", loop: 4000, delay: 500,  amp: 5,  drift: 3 },
];

function MotionShape({
  shape,
  onCard,
  accent,
}: {
  shape: Shape;
  onCard: string;
  accent: string;
}) {
  const t = useSharedValue(0);
  const r = useSharedValue(0);
  const p = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      shape.delay,
      withRepeat(
        withTiming(1, { duration: shape.loop, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    if (shape.rotate) {
      const dur = Math.abs(shape.rotate);
      const dir = shape.rotate > 0 ? 1 : -1;
      r.value = withDelay(
        shape.delay,
        withRepeat(
          withTiming(dir, { duration: dur, easing: Easing.linear }),
          -1,
          false,
        ),
      );
    }
    if (shape.pulse) {
      p.value = withDelay(
        shape.delay,
        withRepeat(
          withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        ),
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const amp = shape.amp ?? 8;
    const drift = shape.drift ?? 0;
    const ty = interpolate(t.value, [0, 1], [-amp, amp]);
    const tx = interpolate(t.value, [0, 1], [drift, -drift]);
    const rotDeg = shape.rotate
      ? `${interpolate(r.value, [-1, 0, 1], [-360, 0, 360])}deg`
      : "0deg";
    const scale = shape.pulse ? interpolate(p.value, [0, 1], [0.7, 1.25]) : 1;
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: rotDeg },
        { scale },
      ],
    };
  });

  const baseColor = shape.useAccent ? accent : onCard;
  const tint = `${baseColor}${shape.alpha}`;

  let body: React.ReactNode = null;
  if (shape.kind === "ring") {
    body = (
      <View
        style={{
          width: shape.size,
          height: shape.size,
          borderRadius: shape.size / 2,
          borderWidth: 2,
          borderColor: tint,
        }}
      />
    );
  } else if (shape.kind === "circle") {
    body = (
      <View
        style={{
          width: shape.size,
          height: shape.size,
          borderRadius: shape.size / 2,
          backgroundColor: tint,
        }}
      />
    );
  } else if (shape.kind === "square") {
    body = (
      <View
        style={{
          width: shape.size,
          height: shape.size,
          borderRadius: 3,
          backgroundColor: tint,
        }}
      />
    );
  } else if (shape.kind === "diamond") {
    body = (
      <View
        style={{
          width: shape.size,
          height: shape.size,
          borderRadius: 2,
          backgroundColor: tint,
          transform: [{ rotate: "45deg" }],
        }}
      />
    );
  } else if (shape.kind === "dotGrid") {
    const dotSize = 3;
    const cols = 3;
    const rows = 3;
    const gap = (shape.size - dotSize * cols) / (cols - 1);
    const dots: React.ReactNode[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push(
          <View
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              left: col * (dotSize + gap),
              top: row * (dotSize + gap),
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: tint,
            }}
          />,
        );
      }
    }
    body = <View style={{ width: shape.size, height: shape.size }}>{dots}</View>;
  }

  return (
    <Animated.View
      style={[
        { position: "absolute", right: shape.right, top: shape.top },
        animatedStyle,
      ]}
    >
      {body}
    </Animated.View>
  );
}

export function CourseCardMotion({
  onCard,
  accent,
}: {
  onCard: string;
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
      {SHAPES.map((shape, i) => (
        <MotionShape key={i} shape={shape} onCard={onCard} accent={accent} />
      ))}
    </View>
  );
}
