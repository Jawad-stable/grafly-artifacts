import React from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";

export type SceneElement =
  | {
      kind: "rect";
      x: number; y: number; w: number; h: number;
      color: string;
      radius?: number;
      borderColor?: string;
      borderWidth?: number;
    }
  | {
      kind: "text";
      x: number; y: number;
      w?: number;
      text: string;
      size: number;
      bold?: boolean;
      color: string;
      align?: "left" | "center" | "right";
      letterSpacing?: number;
    }
  | {
      kind: "circle";
      cx: number; cy: number; r: number;
      color: string;
      borderColor?: string;
      borderWidth?: number;
    }
  | {
      kind: "pill";
      x: number; y: number; w: number; h: number;
      label: string;
      bg: string;
      fg: string;
      size?: number;
      bold?: boolean;
    }
  | {
      kind: "avatar";
      cx: number; cy: number; r: number;
      color: string;
      initial?: string;
      initialColor?: string;
    }
  | {
      kind: "image";
      x: number; y: number; w: number; h: number;
      color: string;
      radius?: number;
      tone?: "warm" | "cool" | "neutral";
    };

export interface DesignScene {
  width: number;
  height: number;
  bg: string;
  elements: SceneElement[];
}

export interface SceneRegion {
  x: number; y: number; w: number; h: number;
  label?: string;
}

interface DesignSceneViewProps {
  scene: DesignScene;
  width?: number;
  regions?: SceneRegion[];
  onTapRegion?: (i: number) => void;
  highlightCorrectIdx?: number | null;
  selectedIdx?: number | null;
  showRegionsHint?: boolean;
  borderRadius?: number;
  borderColor?: string;
}

export function DesignSceneView({
  scene,
  width,
  regions,
  onTapRegion,
  highlightCorrectIdx,
  selectedIdx,
  showRegionsHint,
  borderRadius = 18,
  borderColor,
}: DesignSceneViewProps) {
  const [measuredW, setMeasuredW] = React.useState<number | null>(null);
  const containerW = width ?? measuredW ?? 0;
  const aspect = scene.width / scene.height;

  function onLayout(e: LayoutChangeEvent) {
    if (!width) setMeasuredW(e.nativeEvent.layout.width);
  }

  const wPx = (p: number) => (p / 100) * containerW;
  const hPx = (p: number) => (p / 100) * (containerW / aspect);

  const showAnswer = highlightCorrectIdx !== null && highlightCorrectIdx !== undefined;

  return (
    <View
      onLayout={onLayout}
      style={{
        width: width ?? "100%",
        aspectRatio: aspect,
        backgroundColor: scene.bg,
        borderRadius,
        overflow: "hidden",
        position: "relative",
        borderWidth: borderColor ? 1 : 0,
        borderColor,
      }}
    >
      {containerW > 0 && scene.elements.map((el, i) => {
        switch (el.kind) {
          case "rect":
            return (
              <View
                key={`e-${i}`}
                style={{
                  position: "absolute",
                  left: wPx(el.x), top: hPx(el.y),
                  width: wPx(el.w), height: hPx(el.h),
                  backgroundColor: el.color,
                  borderRadius: el.radius ?? 0,
                  borderColor: el.borderColor,
                  borderWidth: el.borderWidth ?? 0,
                }}
              />
            );
          case "text":
            return (
              <Text
                key={`e-${i}`}
                numberOfLines={3}
                style={{
                  position: "absolute",
                  left: wPx(el.x), top: hPx(el.y),
                  width: el.w !== undefined ? wPx(el.w) : undefined,
                  fontSize: el.size,
                  fontFamily: el.bold ? "Nunito_800ExtraBold" : "Nunito_600SemiBold",
                  color: el.color,
                  textAlign: el.align ?? "left",
                  letterSpacing: el.letterSpacing,
                  lineHeight: el.size * 1.18,
                }}
              >
                {el.text}
              </Text>
            );
          case "circle": {
            const dPx = wPx(el.r * 2);
            return (
              <View
                key={`e-${i}`}
                style={{
                  position: "absolute",
                  left: wPx(el.cx) - dPx / 2,
                  top: hPx(el.cy) - dPx / 2,
                  width: dPx, height: dPx, borderRadius: dPx / 2,
                  backgroundColor: el.color,
                  borderColor: el.borderColor,
                  borderWidth: el.borderWidth ?? 0,
                }}
              />
            );
          }
          case "pill": {
            const pillH = hPx(el.h);
            return (
              <View
                key={`e-${i}`}
                style={{
                  position: "absolute",
                  left: wPx(el.x), top: hPx(el.y),
                  width: wPx(el.w), height: pillH,
                  backgroundColor: el.bg,
                  borderRadius: pillH / 2,
                  alignItems: "center", justifyContent: "center",
                  paddingHorizontal: 8,
                }}
              >
                <Text style={{
                  fontFamily: el.bold ? "Nunito_800ExtraBold" : "Nunito_600SemiBold",
                  fontSize: el.size ?? 11,
                  color: el.fg,
                }} numberOfLines={1}>
                  {el.label}
                </Text>
              </View>
            );
          }
          case "avatar": {
            const dPx = wPx(el.r * 2);
            return (
              <View
                key={`e-${i}`}
                style={{
                  position: "absolute",
                  left: wPx(el.cx) - dPx / 2,
                  top: hPx(el.cy) - dPx / 2,
                  width: dPx, height: dPx, borderRadius: dPx / 2,
                  backgroundColor: el.color,
                  alignItems: "center", justifyContent: "center",
                }}
              >
                {el.initial ? (
                  <Text style={{
                    fontSize: dPx * 0.42,
                    fontFamily: "Nunito_800ExtraBold",
                    color: el.initialColor ?? "#FFFFFF",
                  }}>
                    {el.initial}
                  </Text>
                ) : null}
              </View>
            );
          }
          case "image": {
            const tone = el.tone ?? "neutral";
            const dot =
              tone === "warm" ? "#FFB80055" :
              tone === "cool" ? "#0078BB55" :
              "#FFFFFF55";
            return (
              <View
                key={`e-${i}`}
                style={{
                  position: "absolute",
                  left: wPx(el.x), top: hPx(el.y),
                  width: wPx(el.w), height: hPx(el.h),
                  backgroundColor: el.color,
                  borderRadius: el.radius ?? 8,
                  overflow: "hidden",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <View style={{
                  width: "30%",
                  aspectRatio: 1,
                  borderRadius: 999,
                  backgroundColor: dot,
                }} />
              </View>
            );
          }
        }
      })}

      {containerW > 0 && regions?.map((r, i) => {
        const correct = showAnswer && highlightCorrectIdx === i;
        const wrong = showAnswer && selectedIdx === i && highlightCorrectIdx !== i;
        const dim = showAnswer && !correct && !wrong;
        return (
          <Pressable
            key={`r-${i}`}
            onPress={() => onTapRegion?.(i)}
            disabled={showAnswer}
            style={{
              position: "absolute",
              left: wPx(r.x), top: hPx(r.y),
              width: wPx(r.w), height: hPx(r.h),
              borderRadius: 12,
              borderWidth: showAnswer ? (correct || wrong ? 3 : 0) : (showRegionsHint ? 1.5 : 0),
              borderStyle: !showAnswer && showRegionsHint ? "dashed" : "solid",
              borderColor: correct
                ? "#22DD88"
                : wrong
                ? "#DC2A3A"
                : !showAnswer && showRegionsHint
                ? "#FFFFFFAA"
                : "transparent",
              backgroundColor: correct
                ? "#22DD8830"
                : wrong
                ? "#DC2A3A30"
                : "transparent",
              opacity: dim ? 0.4 : 1,
            }}
          />
        );
      })}
    </View>
  );
}
