import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Hooks — shared loop drivers
// ---------------------------------------------------------------------------

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

function useRotate(duration: number, delay: number = 0, dir: 1 | -1 = 1) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withTiming(dir, { duration: Math.abs(duration), easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, []);
  return v;
}

function useBlink(duration: number, delay: number = 0) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, []);
  return v;
}

// ---------------------------------------------------------------------------
// Layer wrapper
// ---------------------------------------------------------------------------

function MotionLayer({ children }: { children: React.ReactNode }) {
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
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Reusable atoms with built-in float / rotate
// ---------------------------------------------------------------------------

function FloatRing({
  right, top, size, color, alpha,
  loop, delay, amp = 8, drift = 0, rotateMs, borderWidth = 2,
}: {
  right: number; top: number; size: number; color: string; alpha: string;
  loop: number; delay: number; amp?: number; drift?: number; rotateMs?: number; borderWidth?: number;
}) {
  const t = useFloat(loop, delay);
  const r = useRotate(rotateMs ?? 1, delay, 1);
  const style = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [-amp, amp]);
    const tx = interpolate(t.value, [0, 1], [drift, -drift]);
    const rot = rotateMs ? `${interpolate(r.value, [0, 1], [0, 360])}deg` : "0deg";
    return { transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }] };
  });
  return (
    <Animated.View style={[{ position: "absolute", right, top }, style]}>
      <View
        style={{
          width: size, height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: `${color}${alpha}`,
        }}
      />
    </Animated.View>
  );
}

function FloatDot({
  right, top, size, color, alpha,
  loop, delay, amp = 8, drift = 0, pulse,
}: {
  right: number; top: number; size: number; color: string; alpha: string;
  loop: number; delay: number; amp?: number; drift?: number; pulse?: boolean;
}) {
  const t = useFloat(loop, delay);
  const p = useFloat(2400, delay + 100);
  const style = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [-amp, amp]);
    const tx = interpolate(t.value, [0, 1], [drift, -drift]);
    const scale = pulse ? interpolate(p.value, [0, 1], [0.7, 1.25]) : 1;
    return { transform: [{ translateX: tx }, { translateY: ty }, { scale }] };
  });
  return (
    <Animated.View style={[{ position: "absolute", right, top }, style]}>
      <View
        style={{
          width: size, height: size,
          borderRadius: size / 2,
          backgroundColor: `${color}${alpha}`,
        }}
      />
    </Animated.View>
  );
}

function FloatSquare({
  right, top, size, color, alpha,
  loop, delay, amp = 6, rotateMs, diamond,
}: {
  right: number; top: number; size: number; color: string; alpha: string;
  loop: number; delay: number; amp?: number; rotateMs?: number; diamond?: boolean;
}) {
  const t = useFloat(loop, delay);
  const r = useRotate(rotateMs ?? 1, delay, 1);
  const style = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [-amp, amp]);
    const baseRot = diamond ? 45 : 0;
    const spin = rotateMs ? interpolate(r.value, [0, 1], [0, 360]) : 0;
    return { transform: [{ translateY: ty }, { rotate: `${baseRot + spin}deg` }] };
  });
  return (
    <Animated.View style={[{ position: "absolute", right, top }, style]}>
      <View
        style={{
          width: size, height: size,
          borderRadius: 3,
          backgroundColor: `${color}${alpha}`,
        }}
      />
    </Animated.View>
  );
}

function DotGrid({
  right, top, size, color, alpha, loop, delay, drift = 3,
}: {
  right: number; top: number; size: number; color: string; alpha: string;
  loop: number; delay: number; drift?: number;
}) {
  const t = useFloat(loop, delay);
  const style = useAnimatedStyle(() => {
    const tx = interpolate(t.value, [0, 1], [drift, -drift]);
    const ty = interpolate(t.value, [0, 1], [-3, 3]);
    return { transform: [{ translateX: tx }, { translateY: ty }] };
  });
  const dotSize = 3;
  const cols = 3;
  const rows = 3;
  const gap = (size - dotSize * cols) / (cols - 1);
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
            width: dotSize, height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: `${color}${alpha}`,
          }}
        />,
      );
    }
  }
  return (
    <Animated.View style={[{ position: "absolute", right, top, width: size, height: size }, style]}>
      {dots}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// 1. Design Principles — Balance scale + contrast pair
// ---------------------------------------------------------------------------

function BalanceScale({ onCard, accent }: { onCard: string; accent: string }) {
  const tilt = useFloat(3000, 0);
  const tiltStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(tilt.value, [0, 1], [-22, 22])}deg` }],
  }));
  return (
    <View style={{ position: "absolute", right: 80, top: 60, width: 0, height: 0 }}>
      {/* Triangle pivot — points UP, stays still while the bar tilts */}
      <View
        style={{
          position: "absolute",
          left: -11, top: -1,
          width: 0, height: 0,
          borderLeftWidth: 11,
          borderRightWidth: 11,
          borderBottomWidth: 16,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: `${onCard}BB`,
          borderStyle: "solid",
          transform: [{ rotate: "180deg" }],
        }}
      />
      {/* Base bar under triangle */}
      <View
        style={{
          position: "absolute",
          left: -18, top: 18,
          width: 36, height: 2, borderRadius: 1,
          backgroundColor: `${onCard}77`,
        }}
      />

      {/* Tilting bar with hangers + weights as children */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: -72, top: -3,
            width: 144, height: 4,
            borderRadius: 2,
            backgroundColor: `${onCard}EE`,
          },
          tiltStyle,
        ]}
      >
        {/* Left hanger line */}
        <View style={{ position: "absolute", left: 4, top: 4, width: 1.5, height: 16, backgroundColor: `${onCard}99` }} />
        {/* Right hanger line */}
        <View style={{ position: "absolute", right: 4, top: 4, width: 1.5, height: 16, backgroundColor: `${onCard}99` }} />
        {/* Circle weight on left end */}
        <View
          style={{
            position: "absolute",
            left: -8, top: 18,
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: accent,
          }}
        />
        {/* Square weight on right end */}
        <View
          style={{
            position: "absolute",
            right: -8, top: 18,
            width: 22, height: 22, borderRadius: 4,
            backgroundColor: `${onCard}EE`,
          }}
        />
      </Animated.View>
    </View>
  );
}

function ContrastPair({ onCard }: { onCard: string }) {
  const t = useFloat(1700, 0);
  const a = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [1, 0.08]),
    transform: [{ scale: interpolate(t.value, [0, 1], [1.05, 0.82]) }],
  }));
  const b = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.08, 1]),
    transform: [{ scale: interpolate(t.value, [0, 1], [0.82, 1.05]) }],
  }));
  return (
    <View style={{ position: "absolute", right: 12, top: 18, gap: 5 }}>
      <Animated.View style={[a, { width: 38, height: 10, borderRadius: 4, backgroundColor: `${onCard}EE` }]} />
      <Animated.View style={[b, { width: 38, height: 10, borderRadius: 4, backgroundColor: `${onCard}33` }]} />
    </View>
  );
}

function SymmetryDots({ onCard, accent }: { onCard: string; accent: string }) {
  // Two mirrored dots that drift in/out from a central axis, demonstrating symmetry.
  const t = useFloat(2400, 0);
  const left = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(t.value, [0, 1], [0, -16]) }],
    opacity: interpolate(t.value, [0, 1], [0.4, 1]),
  }));
  const right = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(t.value, [0, 1], [0, 16]) }],
    opacity: interpolate(t.value, [0, 1], [0.4, 1]),
  }));
  return (
    <View style={{ position: "absolute", right: 80, top: 122, width: 0, height: 0 }}>
      {/* Mirror axis */}
      <View style={{ position: "absolute", left: -0.5, top: -8, width: 1, height: 16, backgroundColor: `${onCard}55` }} />
      <Animated.View style={[left, { position: "absolute", left: -3, top: -3, width: 6, height: 6, borderRadius: 3, backgroundColor: accent }]} />
      <Animated.View style={[right, { position: "absolute", left: -3, top: -3, width: 6, height: 6, borderRadius: 3, backgroundColor: accent }]} />
    </View>
  );
}

function DesignPrinciplesMotion({ onCard, accent }: { onCard: string; accent: string }) {
  return (
    <MotionLayer>
      <FloatRing right={14} top={8} size={130} color={onCard} alpha="22" loop={5200} delay={0} amp={6} drift={4} />
      <FloatRing right={170} top={42} size={26} color={onCard} alpha="66" loop={2400} delay={400} amp={14} />
      <BalanceScale onCard={onCard} accent={accent} />
      <ContrastPair onCard={onCard} />
      <SymmetryDots onCard={onCard} accent={accent} />
      <FloatSquare right={166} top={102} size={12} color={onCard} alpha="77" loop={2600} delay={700} amp={10} rotateMs={9000} diamond />
    </MotionLayer>
  );
}

// ---------------------------------------------------------------------------
// 2. Typography — Floating glyphs, baseline + cursor
// ---------------------------------------------------------------------------

function Glyph({
  char, right, top, size, color, alpha, weight, loop, delay,
  amp = 8, rotate, italic,
}: {
  char: string; right: number; top: number; size: number;
  color: string; alpha: string; weight: "Nunito_600SemiBold" | "Nunito_800ExtraBold";
  loop: number; delay: number; amp?: number; rotate?: number; italic?: boolean;
}) {
  const t = useFloat(loop, delay);
  const r = useFloat(loop * 1.3, delay + 200);
  const style = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [-amp, amp]);
    const rot = rotate ? `${interpolate(r.value, [0, 1], [-rotate, rotate])}deg` : "0deg";
    return { transform: [{ translateY: ty }, { rotate: rot }] };
  });
  return (
    <Animated.View style={[{ position: "absolute", right, top }, style]}>
      <Text
        style={{
          fontFamily: weight,
          fontSize: size,
          color: `${color}${alpha}`,
          fontStyle: italic ? "italic" : "normal",
          lineHeight: size * 1.05,
          includeFontPadding: false,
        }}
      >
        {char}
      </Text>
    </Animated.View>
  );
}

function Cursor({ onCard }: { onCard: string }) {
  const b = useBlink(900, 0);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(b.value, [0, 0.5, 1], [1, 0.05, 1]),
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 56, top: 88,
          width: 2, height: 22,
          borderRadius: 1,
          backgroundColor: `${onCard}DD`,
        },
        style,
      ]}
    />
  );
}

function TypographyMotion({ onCard, accent }: { onCard: string; accent: string }) {
  return (
    <MotionLayer>
      {/* Baseline */}
      <View style={{ position: "absolute", right: 12, top: 110, width: 200, height: 1, backgroundColor: `${onCard}33` }} />
      {/* x-height tick */}
      <View style={{ position: "absolute", right: 12, top: 92, width: 200, height: 1, backgroundColor: `${onCard}1A` }} />

      <Glyph char="A" right={28}  top={28} size={56} color={onCard} alpha="22" weight="Nunito_800ExtraBold" loop={4400} delay={0}   amp={6}  rotate={4} />
      <Glyph char="g" right={92}  top={48} size={42} color={onCard} alpha="33" weight="Nunito_800ExtraBold" loop={3600} delay={300} amp={8}  rotate={3} italic />
      <Glyph char="T" right={150} top={26} size={28} color={onCard} alpha="55" weight="Nunito_600SemiBold" loop={3000} delay={600} amp={10} rotate={2} />
      <Glyph char="&" right={132} top={92} size={20} color={accent}  alpha="FF" weight="Nunito_800ExtraBold" loop={2400} delay={500} amp={12} />
      <Glyph char="i" right={186} top={68} size={20} color={onCard} alpha="66" weight="Nunito_600SemiBold" loop={2800} delay={800} amp={6}  rotate={3} />

      <Cursor onCard={onCard} />
    </MotionLayer>
  );
}

// ---------------------------------------------------------------------------
// 3. UI Design — Mock card, button, toggle, touch indicator
// ---------------------------------------------------------------------------

function MockCard({ onCard }: { onCard: string }) {
  const t = useFloat(3800, 0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(t.value, [0, 1], [-4, 4]) }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 18, top: 14,
          width: 92, height: 56,
          borderRadius: 10,
          backgroundColor: `${onCard}1F`,
          borderWidth: 1,
          borderColor: `${onCard}33`,
          padding: 8,
          gap: 6,
        },
        style,
      ]}
    >
      <View style={{ width: 50, height: 4, borderRadius: 2, backgroundColor: `${onCard}AA` }} />
      <View style={{ width: 70, height: 3, borderRadius: 2, backgroundColor: `${onCard}44` }} />
      <View style={{ width: 38, height: 3, borderRadius: 2, backgroundColor: `${onCard}33` }} />
    </Animated.View>
  );
}

function PillButton({ accent }: { accent: string }) {
  const t = useFloat(3200, 200);
  const p = useFloat(2400, 400);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-3, 3]) },
      { scale: interpolate(p.value, [0, 1], [0.96, 1.04]) },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 38, top: 84,
          width: 64, height: 18,
          borderRadius: 100,
          backgroundColor: accent,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <View style={{ width: 30, height: 3, borderRadius: 2, backgroundColor: "#0F0F1455" }} />
    </Animated.View>
  );
}

function ToggleSwitch({ onCard, accent }: { onCard: string; accent: string }) {
  const t = useFloat(2200, 0);
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: t.value > 0.5 ? `${accent}` : `${onCard}44`,
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(t.value, [0, 1], [0, 12]) }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 132, top: 32,
          width: 28, height: 16,
          borderRadius: 100,
          padding: 2,
        },
        trackStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            width: 12, height: 12, borderRadius: 6,
            backgroundColor: "#FFFFFFEE",
          },
          knobStyle,
        ]}
      />
    </Animated.View>
  );
}

function TouchPing({ accent }: { accent: string }) {
  const t = useFloat(1800, 0);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(t.value, [0, 1], [0.4, 1.4]) }],
    opacity: interpolate(t.value, [0, 1], [0.9, 0]),
  }));
  return (
    <View style={{ position: "absolute", right: 142, top: 96 }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: -12, top: -12,
            width: 28, height: 28,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: accent,
          },
          ringStyle,
        ]}
      />
      <View
        style={{
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: accent,
        }}
      />
    </View>
  );
}

function UIDesignMotion({ onCard, accent }: { onCard: string; accent: string }) {
  return (
    <MotionLayer>
      <FloatRing right={14} top={4} size={130} color={onCard} alpha="14" loop={5200} delay={0} amp={4} drift={3} />
      <MockCard onCard={onCard} />
      <ToggleSwitch onCard={onCard} accent={accent} />
      <PillButton accent={accent} />
      <TouchPing accent={accent} />
      <FloatDot right={186} top={104} size={6} color={onCard} alpha="88" loop={2800} delay={300} amp={8} />
    </MotionLayer>
  );
}

// ---------------------------------------------------------------------------
// 4. Branding — Rotating logo mark + orbiting elements + swatches
// ---------------------------------------------------------------------------

function LogoMark({ accent }: { accent: string }) {
  const r = useRotate(14000, 0, 1);
  const p = useFloat(3000, 0);
  const style = useAnimatedStyle(() => {
    const rot = interpolate(r.value, [0, 1], [0, 360]);
    const scale = interpolate(p.value, [0, 1], [0.94, 1.06]);
    return { transform: [{ rotate: `${rot + 45}deg` }, { scale }] };
  });
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 80 - 18, top: 50 - 18,
          width: 36, height: 36,
          borderRadius: 4,
          backgroundColor: accent,
        },
        style,
      ]}
    />
  );
}

function Orbit({
  radius, duration, delay, dotSize, dotColor, dotAlpha, startAngle,
}: {
  radius: number; duration: number; delay: number;
  dotSize: number; dotColor: string; dotAlpha: string; startAngle: number;
}) {
  const r = useRotate(duration, delay, 1);
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(r.value, [0, 1], [startAngle, startAngle + 360])}deg` }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 80, top: 50,
          width: 0, height: 0,
        },
        orbitStyle,
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: -dotSize / 2,
          top: -radius - dotSize / 2,
          width: dotSize, height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: `${dotColor}${dotAlpha}`,
        }}
      />
    </Animated.View>
  );
}

function Swatches({ onCard, accent }: { onCard: string; accent: string }) {
  const t = useFloat(3200, 0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(t.value, [0, 1], [-3, 3]) }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 50, top: 110,
          flexDirection: "row",
          gap: 4,
        },
        style,
      ]}
    >
      <View style={{ width: 14, height: 6, borderRadius: 3, backgroundColor: accent }} />
      <View style={{ width: 14, height: 6, borderRadius: 3, backgroundColor: `${onCard}AA` }} />
      <View style={{ width: 14, height: 6, borderRadius: 3, backgroundColor: `${onCard}44` }} />
    </Animated.View>
  );
}

function BrandingMotion({ onCard, accent }: { onCard: string; accent: string }) {
  return (
    <MotionLayer>
      {/* Soft halo behind logo */}
      <FloatRing right={36} top={6} size={88} color={onCard} alpha="22" loop={4400} delay={0} amp={5} />
      <FloatRing right={50} top={20} size={60} color={onCard} alpha="33" loop={3600} delay={300} amp={4} />

      <LogoMark accent={accent} />

      {/* 3 orbiting dots at different radii / speeds */}
      <Orbit radius={42} duration={9000}  delay={0}    dotSize={6} dotColor={accent} dotAlpha="FF" startAngle={0} />
      <Orbit radius={50} duration={12000} delay={400}  dotSize={5} dotColor={onCard} dotAlpha="AA" startAngle={130} />
      <Orbit radius={36} duration={7000}  delay={200}  dotSize={4} dotColor={onCard} dotAlpha="88" startAngle={245} />

      {/* Wordmark line */}
      <View
        style={{
          position: "absolute",
          right: 50, top: 100,
          width: 64, height: 2,
          borderRadius: 1,
          backgroundColor: `${onCard}66`,
        }}
      />
      <Swatches onCard={onCard} accent={accent} />
    </MotionLayer>
  );
}

// ---------------------------------------------------------------------------
// 5. Golden Ratio — Concentric rings + nested squares breathing in φ
// ---------------------------------------------------------------------------

function BreathingRing({
  centerX, centerY, size, color, alpha, loop, delay,
}: {
  centerX: number; centerY: number; size: number;
  color: string; alpha: string; loop: number; delay: number;
}) {
  const t = useFloat(loop, delay);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(t.value, [0, 1], [0.92, 1.08]) }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: centerX - size / 2,
          top: centerY - size / 2,
          width: size, height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: `${color}${alpha}`,
        },
        style,
      ]}
    />
  );
}

function NestedSquares({ onCard }: { onCard: string }) {
  const r = useRotate(16000, 0, 1);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(r.value, [0, 1], [0, 360])}deg` }],
  }));
  return (
    <Animated.View style={[{ position: "absolute", right: 14, top: 14, width: 36, height: 36 }, style]}>
      {/* Outer */}
      <View style={{ position: "absolute", inset: 0, borderRadius: 4, borderWidth: 1.5, borderColor: `${onCard}55` }} />
      {/* Inner — 36 / 1.618 ≈ 22 */}
      <View style={{ position: "absolute", left: 0, top: 0, width: 22, height: 22, borderRadius: 3, borderWidth: 1.5, borderColor: `${onCard}77` }} />
      {/* Inner-most — 22 / 1.618 ≈ 14 */}
      <View style={{ position: "absolute", left: 22, top: 22, width: 14, height: 14, borderRadius: 2, backgroundColor: `${onCard}66` }} />
    </Animated.View>
  );
}

function PhiSpiralDots({ onCard, accent }: { onCard: string; accent: string }) {
  // 7 dots placed along a logarithmic spiral around the same center as the rings.
  // Center is at right: 80, top: 70 (matches BreathingRing centers).
  const PHI = 1.618;
  const cx = 80;
  const cy = 70;
  const points = Array.from({ length: 7 }, (_, i) => {
    const angle = i * (Math.PI / 4); // 45° steps
    const radius = 8 * Math.pow(PHI, i * 0.32);
    const dx = Math.cos(angle) * radius;
    const dy = -Math.sin(angle) * radius;
    return { dx, dy, idx: i };
  });
  return (
    <View style={{ position: "absolute", right: cx, top: cy, width: 0, height: 0 }}>
      {points.map(({ dx, dy, idx }) => (
        <SpiralDot key={idx} dx={dx} dy={dy} index={idx} onCard={onCard} accent={accent} />
      ))}
    </View>
  );
}

function SpiralDot({
  dx, dy, index, onCard, accent,
}: {
  dx: number; dy: number; index: number; onCard: string; accent: string;
}) {
  const t = useFloat(2400 + index * 220, index * 140);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: dx },
      { translateY: dy },
      { scale: interpolate(t.value, [0, 1], [0.6, 1.2]) },
    ],
    opacity: interpolate(t.value, [0, 1], [0.5, 1]),
  }));
  const isAccent = index === 0;
  const size = isAccent ? 6 : 4;
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: -size / 2, top: -size / 2,
          width: size, height: size,
          borderRadius: size / 2,
          backgroundColor: isAccent ? accent : `${onCard}AA`,
        },
        style,
      ]}
    />
  );
}

function GoldenRatioMotion({ onCard, accent }: { onCard: string; accent: string }) {
  // Concentric rings centered at (right:80, top:70). Sizes follow φ.
  return (
    <MotionLayer>
      <BreathingRing centerX={80} centerY={70} size={120} color={onCard} alpha="1A" loop={5200} delay={0} />
      <BreathingRing centerX={80} centerY={70} size={74}  color={onCard} alpha="2A" loop={4400} delay={300} />
      <BreathingRing centerX={80} centerY={70} size={46}  color={onCard} alpha="3F" loop={3600} delay={600} />
      <BreathingRing centerX={80} centerY={70} size={28}  color={onCard} alpha="66" loop={2800} delay={900} />
      <NestedSquares onCard={onCard} />
      <PhiSpiralDots onCard={onCard} accent={accent} />
    </MotionLayer>
  );
}

// ---------------------------------------------------------------------------
// Default fallback (used if a course has no themed motion yet)
// ---------------------------------------------------------------------------

function DefaultMotion({ onCard, accent }: { onCard: string; accent: string }) {
  return (
    <MotionLayer>
      <FloatRing right={14}  top={8}   size={130} color={onCard} alpha="1F" loop={5200} delay={0}   amp={6}  drift={4} />
      <FloatRing right={90}  top={-20} size={80}  color={onCard} alpha="26" loop={4400} delay={200} amp={8}  drift={-4} />
      <FloatRing right={138} top={80}  size={18}  color={onCard} alpha="66" loop={2800} delay={600} amp={14} drift={2} />
      <FloatDot  right={130} top={30}  size={12}  color={accent} alpha="FF" loop={2400} delay={300} amp={12} pulse />
      <FloatSquare right={95}  top={128} size={10} color={onCard} alpha="66" loop={3400} delay={700} amp={7}  rotateMs={9000} />
      <FloatSquare right={168} top={30}  size={12} color={onCard} alpha="55" loop={3600} delay={900} amp={10} rotateMs={-8000 as any} diamond />
      <DotGrid right={16} top={18} size={26} color={onCard} alpha="44" loop={4000} delay={500} drift={3} />
    </MotionLayer>
  );
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export function CourseCardMotion({
  courseId,
  onCard,
  accent,
}: {
  courseId: string;
  onCard: string;
  accent: string;
}) {
  switch (courseId) {
    case "design-principles":
      return <DesignPrinciplesMotion onCard={onCard} accent={accent} />;
    case "typography":
      return <TypographyMotion onCard={onCard} accent={accent} />;
    case "ui-design":
      return <UIDesignMotion onCard={onCard} accent={accent} />;
    case "branding":
      return <BrandingMotion onCard={onCard} accent={accent} />;
    case "golden-ratio":
      return <GoldenRatioMotion onCard={onCard} accent={accent} />;
    default:
      return <DefaultMotion onCard={onCard} accent={accent} />;
  }
}
