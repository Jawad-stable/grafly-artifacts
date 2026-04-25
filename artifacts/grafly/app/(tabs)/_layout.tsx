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

  // Active = soft tinted primary pill with primary-colored icon + label,
  // outlined with a hairline primary border. Inactive = muted icon + label.
  const activeBg = colors.primary + (isLight ? "1F" : "26");
  const activeBorder = colors.primary + (isLight ? "3D" : "55");
  const activeFg = colors.primary;
  const inactiveFg = isLight
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
      { scale: 0.85 + progress.value * 0.15 },
    ],
  }));

  const iconColor = focused ? activeFg : inactiveFg;
  const labelColor = focused ? activeFg : inactiveFg;

  return (
    <View style={styles.itemWrap}>
      <View style={styles.pillWrap}>
        <Animated.View
          style={[
            styles.pillBg,
            {
              backgroundColor: activeBg,
              borderWidth: 1,
              borderColor: activeBorder,
            },
            pillStyle,
          ]}
        />
        <View style={styles.pillContent}>
          <Icon
            name={name}
            size={20}
            color={iconColor}
            weight={focused ? "fill" : "bold"}
          />
          <AText
            numberOfLines={1}
            style={[
              styles.label,
              { color: labelColor },
            ]}
          >
            {label}
          </AText>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const bottomInset = insets.bottom;
  const tabBarHeight = 70;
  const tabBottom = Math.max(bottomInset, Platform.OS === "web" ? 18 : 14);
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
          left: 14,
          right: 14,
          borderRadius: pillRadius,
          height: tabBarHeight,
          paddingBottom: 0,
          paddingHorizontal: 6,
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
                { borderRadius: pillRadius, overflow: "hidden" },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isLight
                    ? colors.foreground + "F2"
                    : colors.card + "D9",
                  borderRadius: pillRadius,
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
                left: 24,
                right: 24,
                height: 1,
                backgroundColor: isLight ? "#FFFFFF22" : "#FFFFFF12",
                borderRadius: 1,
              }}
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
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  pillWrap: {
    height: 56,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 6,
  },
  pillBg: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 4,
    right: 4,
    borderRadius: 999,
  },
  pillContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
