import React from "react";
import { View, Text } from "react-native";
import { useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useCourses } from "@/context/CoursesContext";
import { Skeleton } from "@/components/Skeleton";
import { PressScale } from "@/components/PressScale";
import { Icon } from "@/components/Icon";

/**
 * Blocks the app shell until courses have loaded from Supabase. Surfaces a
 * retry screen when the remote is unreachable AND we have no cached payload.
 * Once we have at least one course, children render and any background
 * refresh happens silently.
 *
 * Pass-through for auth / onboarding / auth-callback routes so an
 * unauthenticated user can still sign in (or recover their password) even
 * when the course library is unreachable.
 */
const PASSTHROUGH_ROOTS = new Set(["auth", "auth-callback", "onboarding"]);

export function CoursesGate({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { courses, loading, error, refresh } = useCourses();

  // Auth / onboarding never need course data — let them through unconditionally.
  if (PASSTHROUGH_ROOTS.has(segments[0] ?? "")) return <>{children}</>;

  // Have data → always render the app, even if a background refresh failed.
  if (courses.length > 0) return <>{children}</>;

  // First-load skeleton.
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: insets.top + 60, gap: 16 }}>
        <Skeleton width={140} height={14} />
        <Skeleton width="80%" height={36} radius={10} />
        <Skeleton width="55%" height={36} radius={10} />
        <View style={{ height: 16 }} />
        <Skeleton width="100%" height={120} radius={20} />
        <Skeleton width="100%" height={200} radius={24} />
        <Skeleton width="100%" height={200} radius={24} />
      </View>
    );
  }

  // No data and not loading → genuine failure. Show retry.
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        gap: 16,
      }}
    >
      <View
        style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: colors.destructive + "1F",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon name="alert-circle" size={32} color={colors.destructive} />
      </View>
      <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, textAlign: "center" }}>
        Couldn't load courses
      </Text>
      <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, textAlign: "center", lineHeight: 20 }}>
        {error ?? "Check your internet connection and try again."}
      </Text>
      <PressScale
        onPress={() => { void refresh(); }}
        style={{
          marginTop: 8,
          backgroundColor: colors.foreground,
          paddingHorizontal: 28, paddingVertical: 14,
          borderRadius: 100,
          flexDirection: "row", alignItems: "center", gap: 8,
        }}
      >
        <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
          Retry
        </Text>
      </PressScale>
    </View>
  );
}
