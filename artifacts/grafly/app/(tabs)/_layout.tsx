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

  // Active = soft tinted primary pill, hugging icon + label. No focus-state
  // motion — the pill simply renders in its active or inactive form so the
  // highlight always sits perfectly centered around the content.
  const activeBg = colors.primary + (isLight ? "1F" : "26");
  const activeFg = colors.primary;
  const inactiveIcon = isLight
    ? colors.primaryForeground + "B3"
    : colors.mutedForeground;

  return (
    <View style={styles.itemWrap}>
      <View
        style={[
          styles.pill,
          focused
            ? { backgroundColor: activeBg, paddingHorizontal: 14 }
            : { backgroundColor: "transparent", paddingHorizontal: 0 },
        ]}
      >
        <Icon
          name={name}
          size={22}
          color={focused ? activeFg : inactiveIcon}
          weight={focused ? "fill" : "bold"}
        />
        {focused && (
          <AText
            numberOfLines={1}
            style={[styles.label, { color: activeFg }]}
          >
            {label}
          </AText>
        )}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const bottomInset = insets.bottom;
  const tabBarHeight = 60;
  const tabBottom = Math.max(bottomInset, 16);
  const isLight = state.themeMode === "light";
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
          left: 16,
          right: 16,
          borderRadius: pillRadius,
          height: tabBarHeight,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 8,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isLight ? 0.12 : 0.35,
          shadowRadius: 20,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={80}
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
                    : colors.border + "66",
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
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  pill: {
    height: 40,
    minWidth: 40,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
