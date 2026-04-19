import {
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons, Feather } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { GameProvider, useGame } from "@/context/GameContext";
import { TESHRIN_FONTS } from "@/constants/fonts";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const { state } = useGame();
  const segments = useSegments();

  const inAuthGroup = segments[0] === "auth";
  const inOnboarding = segments[0] === "onboarding";

  useEffect(() => {}, [session, loading, state.onboardingComplete]);

  if (loading) return null;

  if (!session && !inAuthGroup) {
    return <Redirect href="/auth" />;
  }

  if (session && !state.onboardingComplete && !inOnboarding && inAuthGroup === false) {
    return <Redirect href="/onboarding" />;
  }

  if (session && state.onboardingComplete && (inAuthGroup || inOnboarding)) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson"
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="leaderboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="paywall"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
    ...TESHRIN_FONTS,
    ...Ionicons.font,
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
