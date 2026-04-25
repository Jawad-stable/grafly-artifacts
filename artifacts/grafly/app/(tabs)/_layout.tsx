import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Icon, type IconName } from "@/components/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

// Subtle press feedback for tab buttons.
// Soft scale-in, calm release, no overshoot.
function PressTabButton(props: any) {
  const { children, onPressIn, onPressOut, style, ...rest } = props;
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withTiming(0.92, {
          duration: 90,
          easing: Easing.out(Easing.cubic),
        });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        onPressOut?.(e);
      }}
      style={[style, { flex: 1 }]}
    >
      <Animated.View style={[{ flex: 1 }, animStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// A single tab cell. Icon-only. Active state = filled icon in primary color
// with a small primary indicator dot directly below it. No labels in the bar
// — the screen's own header provides the section name.
function TabIcon({
  name,
  focused,
}: {
  name: IconName;
  focused: boolean;
}) {
  const colors = useColors();
  const { state } = useGame();
  const isLight = state.themeMode === "light";

  const activeColor = colors.primary;
  const inactiveColor = isLight
    ? colors.primaryForeground + "B3"
    : colors.mutedForeground;

  return (
    <View style={styles.cell}>
      <Icon
        name={name}
        size={24}
        color={focused ? activeColor : inactiveColor}
        weight={focused ? "fill" : "regular"}
      />
      {focused && (
        <View
          style={[
            styles.indicator,
            { backgroundColor: activeColor },
          ]}
        />
      )}
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const isLight = state.themeMode === "light";

  const tabBarHeight = 58;
  const tabBottom = Math.max(insets.bottom, 16);
  const pillRadius = tabBarHeight / 2;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarButton: (props) => <PressTabButton {...props} />,
        tabBarStyle: {
          position: "absolute",
          bottom: tabBottom,
          left: 20,
          right: 20,
          borderRadius: pillRadius,
          height: tabBarHeight,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 6,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isLight ? 0.1 : 0.4,
          shadowRadius: 24,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={Platform.OS === "ios" ? 60 : 90}
              tint={isLight ? "light" : "dark"}
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: pillRadius, overflow: "hidden" },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isLight
                    ? colors.foreground + "F2"
                    : colors.card + "E6",
                  borderRadius: pillRadius,
                  borderWidth: 1,
                  borderColor: isLight
                    ? colors.primaryForeground + "1A"
                    : colors.border + "55",
                },
              ]}
            />
          </View>
        ),
        tabBarItemStyle: {
          paddingTop: 0,
          paddingBottom: 0,
          height: tabBarHeight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="git-network" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="critique"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="color-filter" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cart" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-circle" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 100,
  },
});
