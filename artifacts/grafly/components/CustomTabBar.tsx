import { BlurView } from "expo-blur";
import { router, usePathname } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const TABS = [
  { name: "index", path: "/(tabs)", icon: "home", iconOutline: "home-outline" },
  { name: "tree", path: "/(tabs)/tree", icon: "git-network", iconOutline: "git-network-outline" },
  { name: "critique", path: "/(tabs)/critique", icon: "color-filter", iconOutline: "color-filter-outline" },
  { name: "shop", path: "/(tabs)/shop", icon: "cart", iconOutline: "cart-outline" },
  { name: "profile", path: "/(tabs)/profile", icon: "person-circle", iconOutline: "person-circle-outline" },
] as const;

function TabButton({
  tab,
  isActive,
  onPress,
}: {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const pillOpacity = useSharedValue(isActive ? 1 : 0);
  const pillScale = useSharedValue(isActive ? 1 : 0.6);

  useEffect(() => {
    pillOpacity.value = withTiming(isActive ? 1 : 0, { duration: 200 });
    pillScale.value = withSpring(isActive ? 1 : 0.6, { damping: 14 });
  }, [isActive]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isActive ? 1 : 0.4,
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
    transform: [{ scale: pillScale.value }],
  }));

  function handlePress() {
    scale.value = withSequence(
      withSpring(1.22, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 12 })
    );
    onPress();
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabInner, containerStyle]}>
        <Animated.View
          style={[
            styles.pill,
            { backgroundColor: colors.primary + "20" },
            pillStyle,
          ]}
        />
        <Ionicons
          name={(isActive ? tab.icon : tab.iconOutline) as any}
          size={24}
          color={isActive ? colors.primary : colors.mutedForeground}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CustomTabBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  function isTabActive(tab: (typeof TABS)[number]) {
    if (tab.name === "index") {
      return pathname === "/" || pathname === "/(tabs)" || pathname === "/(tabs)/index";
    }
    return pathname.includes(tab.name);
  }

  function navigate(tab: (typeof TABS)[number]) {
    if (tab.name === "index") {
      router.replace("/(tabs)" as any);
    } else {
      router.replace(tab.path as any);
    }
  }

  const bottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 8);

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Platform.OS === "web" ? 16 : 16,
          marginHorizontal: 20,
          borderRadius: 32,
          paddingBottom: bottomPad,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 16,
        },
      ]}
    >
      <BlurView
        intensity={80}
        tint="dark"
        style={[StyleSheet.absoluteFill, { borderRadius: 32, overflow: "hidden" }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.card + "D0",
            borderRadius: 32,
            borderWidth: 1,
            borderColor: colors.border + "60",
          },
        ]}
      />
      <View style={styles.row}>
        {TABS.map((tab) => (
          <TabButton
            key={tab.name}
            tab={tab}
            isActive={isTabActive(tab)}
            onPress={() => navigate(tab)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabInner: {
    width: 52,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pill: {
    position: "absolute",
    width: 52,
    height: 36,
    borderRadius: 18,
  },
});
