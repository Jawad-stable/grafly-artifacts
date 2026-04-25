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
interface TabBarButtonProps {
  children?: React.ReactNode;
  onPress?: (e: any) => void;
  style?: any;
  accessibilityState?: { selected?: boolean };
}

// Crisp, deliberate press feedback for tab buttons.
// Scales subtly down on press in, springs back on release.
// No overshoot, no bounce — feels intentional, not cartoony.
function SpringTabButton({
  children,
  onPress,
  style,
}: TabBarButtonProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.92, {
          duration: 80,
          easing: Easing.out(Easing.quad),
        });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, {
          duration: 180,
          easing: Easing.out(Easing.cubic),
        });
      }}
      onPress={(e) => onPress?.(e)}
      style={style}
    >
      <Animated.View style={animStyle}>{children}</Animated.View>
    </Pressable>
  );
}

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
  // On light theme the bar is near-black, so use bright pill + white inactive icons
  const activePillBg = isLight ? colors.accent : colors.primary + "22";
  const activeIcon = isLight ? colors.accentForeground : colors.primary;
  const inactiveIcon = isLight ? colors.primaryForeground + "99" : colors.mutedForeground;
  return (
    <View style={styles.iconWrap}>
      {focused && (
        <View
          style={[
            styles.activePill,
            { backgroundColor: activePillBg },
          ]}
        />
      )}
      <Icon
        name={name}
        size={24}
        color={focused ? activeIcon : inactiveIcon}
        weight={focused ? "fill" : "bold"}
      />
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 62 + bottomPad;
  const tabBottom = Platform.OS === "web" ? 12 : 12;
  const isLight = state.themeMode === "light";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarButton: (props) => <SpringTabButton {...props} />,
        tabBarStyle: {
          position: "absolute",
          bottom: tabBottom,
          left: 20,
          right: 20,
          borderRadius: 32,
          height: tabBarHeight,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
        },
        tabBarBackground: () => (
          <>
            <BlurView
              intensity={85}
              tint={isLight ? "light" : "dark"}
              style={[StyleSheet.absoluteFill, { borderRadius: 32, overflow: "hidden" }]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isLight ? colors.foreground : colors.card + "CC",
                  borderRadius: 32,
                  borderWidth: isLight ? 0 : 1,
                  borderColor: colors.border + "50",
                },
              ]}
            />
          </>
        ),
        tabBarItemStyle: {
          paddingTop: 10,
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
  iconWrap: {
    width: 52,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activePill: {
    position: "absolute",
    width: 52,
    height: 36,
    borderRadius: 18,
  },
});
