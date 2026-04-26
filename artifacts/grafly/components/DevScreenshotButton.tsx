import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, View, Text, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { PressScale } from "@/components/PressScale";
import { useColors } from "@/hooks/useColors";

type Status = "idle" | "capturing" | "done" | "error";

interface DevScreenshotButtonProps {
  /**
   * Ref to the View that should be captured. Should wrap the entire
   * screen content (the root navigator). The View MUST set
   * `collapsable={false}` so RN keeps the underlying native node.
   */
  targetRef: React.RefObject<View | null>;
}

/**
 * Floating "Export current screen as PNG" shortcut.
 *
 * Visible only when `__DEV__` is true — it never ships to the
 * production / TestFlight / App Store build.
 *
 * - On web: triggers a browser download of the PNG.
 * - On iOS / Android: opens the native share sheet so you can
 *   AirDrop / save / send the screenshot anywhere.
 *
 * Floating top-right so it doesn't overlap the bottom nav pill or
 * the composer. Tap and hold to scale, releases with a soft pop.
 */
export function DevScreenshotButton({ targetRef }: DevScreenshotButtonProps) {
  if (!__DEV__) return null;
  return <DevScreenshotButtonInner targetRef={targetRef} />;
}

function DevScreenshotButtonInner({ targetRef }: DevScreenshotButtonProps) {
  const colors = useColors();
  const [status, setStatus] = useState<Status>("idle");
  // Holds the "reset to idle" timer so we can clear it on unmount —
  // otherwise hot-reload + dev navigation can fire setStatus on an
  // already-unmounted component and log warnings.
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Distinct toast text for transient feedback. We can't reuse the
  // Status enum because "Sharing unavailable" is a soft failure that
  // shouldn't paint the button red — the capture itself succeeded.
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  // Subtle "captured!" toast pop, slides down from above the button.
  const toastOpacity = useSharedValue(0);
  const toastY = useSharedValue(-6);
  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastY.value }],
  }));

  const flashToast = useCallback(
    (ms = 1600) => {
      toastY.value = withSequence(
        withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: ms }),
        withTiming(-6, { duration: 220, easing: Easing.out(Easing.cubic) }),
      );
      toastOpacity.value = withSequence(
        withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: ms }),
        withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) }),
      );
    },
    [toastOpacity, toastY],
  );

  const triggerWebDownload = useCallback((dataUri: string) => {
    if (typeof document === "undefined") return;
    const a = document.createElement("a");
    a.href = dataUri;
    const stamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .slice(0, 19);
    a.download = `grafly_${stamp}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const onCapture = useCallback(async () => {
    if (status === "capturing") return;
    if (!targetRef.current) {
      setStatus("error");
      setToastMessage("Screenshot failed");
      flashToast(1400);
      return;
    }
    try {
      setStatus("capturing");
      if (Platform.OS === "web") {
        // On web, view-shot returns a `data:` URI we can download
        // directly via an anchor. No filesystem permissions needed.
        const dataUri = await captureRef(targetRef, {
          format: "png",
          quality: 1,
          result: "data-uri",
        });
        triggerWebDownload(dataUri);
        setStatus("done");
        setToastMessage("Saved to downloads");
      } else {
        // On native, view-shot writes a temp file and returns its
        // file:// URI. Hand it to the share sheet so the user can
        // save it to Photos, AirDrop, or send it anywhere.
        const fileUri = await captureRef(targetRef, {
          format: "png",
          quality: 1,
          result: "tmpfile",
        });
        const ok = await Sharing.isAvailableAsync();
        if (ok) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/png",
            dialogTitle: "Grafly screenshot",
            UTI: "public.png",
          });
          setStatus("done");
          setToastMessage("Ready to share");
        } else {
          // Capture itself succeeded but the OS has no share sheet
          // available. Surface that explicitly so the user isn't
          // left wondering where the screenshot went.
          console.warn(
            "[DevScreenshotButton] sharing unavailable, file at",
            fileUri,
          );
          setStatus("error");
          setToastMessage("Sharing unavailable");
        }
      }
      flashToast();
    } catch (err) {
      console.warn("[DevScreenshotButton] capture failed", err);
      setStatus("error");
      setToastMessage("Screenshot failed");
      flashToast(1800);
    } finally {
      // Reset to idle after a short delay so the icon can swap back.
      // Stash the timer in a ref so the unmount cleanup can clear it.
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStatus("idle"), 1200);
    }
  }, [flashToast, status, targetRef, triggerWebDownload]);

  const isError = status === "error";
  const isDone = status === "done";
  const isCapturing = status === "capturing";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: Platform.select({ web: 16, default: 56 }),
        right: 16,
        zIndex: 9999,
        alignItems: "flex-end",
      }}
    >
      <PressScale
        onPress={onCapture}
        disabled={isCapturing}
        accessibilityLabel="Export current screen as PNG"
        accessibilityHint="Captures the screen and downloads or shares a PNG. Visible in development only."
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isError
            ? "#FF7BD0"
            : isDone
              ? "#E3ED43"
              : colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        {isCapturing ? (
          <ActivityIndicator size="small" color={colors.foreground} />
        ) : (
          <Feather
            name={isError ? "alert-circle" : isDone ? "check" : "camera"}
            size={20}
            color={
              isError
                ? "#21263F"
                : isDone
                  ? "#21263F"
                  : colors.foreground
            }
          />
        )}
      </PressScale>

      <Animated.View
        pointerEvents="none"
        style={[
          {
            marginTop: 6,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            backgroundColor: "#21263F",
          },
          toastStyle,
        ]}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 11,
            fontFamily: "Nunito_800ExtraBold",
            letterSpacing: 0.4,
          }}
        >
          {(toastMessage || "Saved").toUpperCase()}
        </Text>
      </Animated.View>
    </View>
  );
}
