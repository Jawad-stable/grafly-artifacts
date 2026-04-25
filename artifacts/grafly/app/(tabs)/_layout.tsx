import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { Icon, type IconName } from "@/components/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

const SMOOTH = Easing.out(Easing.cubic);

// Bouncy, soft press feedback for tab buttons.
// Quick scale-down on press in, slightly slower release on press out.
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
        scale.value = withTiming(0.9, {
          duration: 110,
          easing: SMOOTH,
        });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        // Light overshoot back to 1 for a satisfying release.
        scale.value = withSequence(
          withTiming(1.04, { duration: 160, easing: SMOOTH }),
          withTiming(1, { duration: 140, easing: SMOOTH }),
        );
        onPressOut?.(e);
      }}
      style={[
        style,
        { flex: 1, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            alignSelf: "stretch",
            alignItems: "center",
            justifyContent: "center",
          },
          animStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

// A single tab cell. Icon-only. Active state = filled icon in primary color,
// soft cyan glow halo behind it, slight scale-up, and a small dot indicator
// directly below. Inactive = muted icon with lower opacity.
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
    ? colors.primaryForeground + "AA"
    : "#FFFFFF99";

  const scale = useSharedValue(focused ? 1.12 : 1);
  const glow = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.12 : 1, {
      duration: 260,
      easing: SMOOTH,
    });
    glow.value = withTiming(focused ? 1 : 0, {
      duration: 260,
      easing: SMOOTH,
    });
  }, [focused]);

  const iconBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  return (
    <View style={styles.cell}>
      <View style={styles.iconStack}>
        {/* Soft cyan/primary glow halo behind the active icon */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              backgroundColor: activeColor + "26",
              shadowColor: activeColor,
            },
            glowStyle,
          ]}
        />
        <Animated.View style={iconBoxStyle}>
          <Icon
            name={name}
            size={24}
            color={focused ? activeColor : inactiveColor}
            weight={focused ? "fill" : "regular"}
          />
        </Animated.View>
      </View>
      {/* Indicator dot directly below the active icon */}
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: activeColor, shadowColor: activeColor },
          glowStyle,
        ]}
      />
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { state } = useGame();
  const isLight = state.themeMode === "light";

  // Responsive sizing with a hard width cap. The bar must never stretch to
  // screen width and must never touch the left or right edges.
  // - On phones it sits at ~80% of width.
  // - On anything wider it is locked at maxBarWidth, and the gutters grow to
  //   absorb the extra space, keeping it perfectly centered.
  // - minSideGutter guarantees AT LEAST this many pixels of breathing room
  //   on every screen size, no matter how narrow.
  // Note: in React Native, an absolutely positioned tab bar centers most
  // reliably via equal `left` and `right` insets; this is mathematically
  // identical to `alignSelf: 'center'` with a fixed width.
  const minSideGutter = 24;
  const maxBarWidth = 380;
  const idealWidth = Math.min(
    screenWidth * 0.8,
    maxBarWidth,
    screenWidth - minSideGutter * 2,
  );
  const sideGutter = (screenWidth - idealWidth) / 2;

  const tabBarHeight = 64;
  // Lift the bar off the bottom edge for a true floating feel.
  const tabBottom = Math.max(insets.bottom + 8, 22);
  const pillRadius = 34;

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
          // Equal left/right offsets keep the bar perfectly centered.
          left: sideGutter,
          right: sideGutter,
          borderRadius: pillRadius,
          height: tabBarHeight,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 14,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: isLight ? 0.14 : 0.5,
          shadowRadius: 32,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={Platform.OS === "ios" ? 70 : 95}
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
                    : colors.card + "F2",
                  borderRadius: pillRadius,
                  borderWidth: 1,
                  borderColor: isLight
                    ? colors.primaryForeground + "1F"
                    : "#FFFFFF12",
                },
              ]}
            />
            {/* Subtle inner highlight along the top edge for depth */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                left: 16,
                right: 16,
                height: 1,
                backgroundColor: isLight
                  ? colors.primaryForeground + "26"
                  : "#FFFFFF1F",
                borderRadius: 1,
              }}
            />
          </View>
        ),
        tabBarItemStyle: {
          // Each of the 5 tab slots is an equal-width column with its child
          // content perfectly centered. No padding offsets, no manual spacing.
          flex: 1,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 0,
          height: tabBarHeight,
          alignItems: "center",
          justifyContent: "center",
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
    // Fill the parent slot completely so the icon is dead-centered both
    // horizontally and vertically inside its equal-width column.
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  iconStack: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 6,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3,
  },
});
