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
import { AText } from "@/components/AText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

// Subtle press feedback for tab buttons.
// Soft scale-in, calm release, no overshoot.
// Forwards all React Navigation tab button props (accessibility,
// onLongPress, testID, etc) to the underlying Pressable so selected
// state is announced and long-press / blur behavior keeps working.
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
        scale.value = withTiming(0.94, {
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

function TabPill({
  name,
  label,
  focused,
}: {
  name: IconName;
  label: string;
  focused: boolean;
}) {
  const colors = useColors();
  const { state } = useGame();
  const isLight = state.themeMode === "light";

  // Active = filled primary pill with white icon + white label.
  // Inactive = muted icon only.
  const activeBg = colors.primary;
  const activeFg = colors.primaryForeground;
  const inactiveIcon = isLight
    ? colors.primaryForeground + "B3"
    : colors.mutedForeground;

  const progress = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scaleX: 0.6 + progress.value * 0.4 },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    marginLeft: progress.value * 6,
    maxWidth: progress.value * 90,
  }));

  // Animate horizontal padding so inactive tabs don't reserve
  // label space (compact icon-only on narrow widths).
  const contentStyle = useAnimatedStyle(() => ({
    paddingHorizontal: 4 + progress.value * 8,
  }));

  const iconColor = focused ? activeFg : inactiveIcon;

  return (
    <View style={styles.itemWrap}>
      <View style={styles.pillWrap}>
        <Animated.View
          style={[
            styles.pillBg,
            { backgroundColor: activeBg },
            pillStyle,
          ]}
        />
        <Animated.View style={[styles.pillContent, contentStyle]}>
          <Icon
            name={name}
            size={22}
            color={iconColor}
            weight={focused ? "fill" : "bold"}
          />
          <Animated.View style={[styles.labelBox, labelStyle]}>
            <AText
              numberOfLines={1}
              style={[
                styles.label,
                { color: activeFg },
              ]}
            >
              {label}
            </AText>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 66 + bottomPad;
  const tabBottom = 14;
  const isLight = state.themeMode === "light";

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
          left: 16,
          right: 16,
          borderRadius: 28,
          height: tabBarHeight,
          paddingBottom: bottomPad,
          paddingHorizontal: 8,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: isLight ? 0.18 : 0.45,
          shadowRadius: 28,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={90}
              tint={isLight ? "light" : "dark"}
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: 28, overflow: "hidden" },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isLight
                    ? colors.foreground + "F2"
                    : colors.card + "D9",
                  borderRadius: 28,
                  borderWidth: 1,
                  borderColor: isLight
                    ? "#FFFFFF14"
                    : colors.border + "55",
                },
              ]}
            />
            {/* Hairline highlight on top edge for depth */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                left: 18,
                right: 18,
                height: 1,
                backgroundColor: isLight ? "#FFFFFF22" : "#FFFFFF12",
                borderRadius: 1,
              }}
            />
          </View>
        ),
        tabBarItemStyle: {
          paddingTop: 8,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabPill name="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabPill name="git-network" label="Learn" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="critique"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabPill name="color-filter" label="Critique" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabPill name="cart" label="Shop" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabPill name="person-circle" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pillWrap: {
    height: 40,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 4,
  },
  pillBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 22,
  },
  pillContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  labelBox: {
    overflow: "hidden",
    flexShrink: 1,
  },
  label: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
