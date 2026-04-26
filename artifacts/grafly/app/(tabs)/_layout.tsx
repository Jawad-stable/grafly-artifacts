import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
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
import { getBottomBarWidth } from "@/constants/layout";

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
  // Tab pill is intentionally dark in both themes, so inactive icons are
  // always rendered in translucent white for legibility regardless of theme.
  const inactiveColor = isLight ? "#FFFFFFAA" : "#FFFFFF99";

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
  const { state } = useGame();
  const isLight = state.themeMode === "light";

  // Live viewport width — recomputes when the device rotates or the
  // browser window resizes. Using useWindowDimensions instead of the
  // static Dimensions snapshot guarantees the bar re-centers as the
  // viewport changes (important on web inside a resizable iframe).
  const { width: SCREEN_W } = useWindowDimensions();

  // Floating pill. The width is computed from the LIVE viewport
  // (getBottomBarWidth) — the same function the critique composer
  // uses — so the nav and the input pill are always exactly the
  // same width AND both re-center when the viewport resizes.
  const tabBarHeight = 70;
  const tabBottom = Math.max(insets.bottom + 8, 22);
  const pillRadius = 35;
  const barWidth = getBottomBarWidth(SCREEN_W);
  // Explicit pixel offset for true horizontal centering on the actual
  // current viewport. Clamped to >= 0 so the bar never sits off-screen
  // on viewports narrower than barWidth.
  const tabBarLeft = Math.max((SCREEN_W - barWidth) / 2, 0);

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
          // Center horizontally with the classic absolute-positioning
          // trick: pin to 50%, then pull back by half the width. This
          // works reliably across iOS, Android and web — `alignSelf`
          // and `marginHorizontal: "auto"` are not honored on absolute
          // children in React Native. barWidth is computed live from
          // the same helper the composer pill uses so the two stay
          // flush across viewport sizes.
          width: barWidth,
          left: tabBarLeft,
          flexDirection: "row",
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
                  borderColor: isLight ? "#FFFFFF1F" : "#FFFFFF12",
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
                backgroundColor: isLight ? "#FFFFFF26" : "#FFFFFF1F",
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
