import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useCallback } from "react";
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
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
interface TabBarButtonProps {
  children?: React.ReactNode;
  onPress?: (e: any) => void;
  style?: any;
  accessibilityState?: { selected?: boolean };
}

function SpringTabButton({
  children,
  onPress,
  style,
}: TabBarButtonProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.22, { damping: 7, stiffness: 350 }),
      withSpring(1, { damping: 13 })
    );
    onPress?.({} as any);
  }, [onPress]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={style}
    >
      <Animated.View style={animStyle}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

function TabIcon({
  name,
  outlineName,
  focused,
}: {
  name: string;
  outlineName: string;
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
      <Ionicons
        name={(focused ? name : outlineName) as any}
        size={24}
        color={focused ? activeIcon : inactiveIcon}
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
            <TabIcon name="home" outlineName="home-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="git-network" outlineName="git-network-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="critique"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="color-filter" outlineName="color-filter-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cart" outlineName="cart-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-circle" outlineName="person-circle-outline" focused={focused} />
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
