import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs([
  "Unable to activate keep awake",
]);

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { GameProvider, useGame } from "@/context/GameContext";
import { TESHRIN_FONTS } from "@/constants/fonts";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const { state, hydrated } = useGame();
  const segments = useSegments();

  const inAuthGroup = segments[0] === "auth";
  const inOnboarding = segments[0] === "onboarding";
  const inAuthCallback = segments[0] === "auth-callback";

  // Wait until persisted state has loaded before deciding where to send the user.
  if (loading || !hydrated) return null;

  // Onboarding first — no account required to start playing.
  // The recovery callback (set new password from email link) must be reachable
  // even if onboarding has not been completed yet.
  if (!state.onboardingComplete && !inOnboarding && !inAuthGroup && !inAuthCallback) {
    return <Redirect href="/onboarding" />;
  }

  // After onboarding, never bounce people back into onboarding
  if (state.onboardingComplete && inOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <AuthGate>
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          // Subtle native push transition — clean, editorial, not jarring.
          animation: "slide_from_right",
          animationDuration: 220,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen
          name="lesson"
          options={{ headerShown: false, presentation: "fullScreenModal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="course-intro"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="leaderboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="paywall"
          options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Alias the existing Nunito_* family names to Teshrin so every screen
    // that hardcodes `fontFamily: "Nunito_..."` automatically renders Teshrin.
    Nunito_600SemiBold: require("../assets/fonts/Teshrin_Medium.ttf"),
    Nunito_800ExtraBold: require("../assets/fonts/Teshrin_Bold.ttf"),
    ...TESHRIN_FONTS,
    ...Feather.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AuthProvider>
                <GameProvider>
                  <RootLayoutNav />
                </GameProvider>
              </AuthProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
