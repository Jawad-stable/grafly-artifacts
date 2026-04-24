import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const { state: gameState } = useGame();
  const canSkip = gameState.onboardingComplete;

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error: err, completed } = await signInWithGoogle();
    setGoogleLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (!completed) return;
    router.replace("/(tabs)");
  };

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    if (mode === "signin") {
      const { error: err } = await signIn(email.trim(), password);
      setLoading(false);
      if (err) {
        setError(err);
      } else {
        router.replace("/(tabs)");
      }
    } else {
      const { error: err, needsConfirmation } = await signUp(email.trim(), password);
      setLoading(false);
      if (err) {
        setError(err);
      } else if (needsConfirmation) {
        Alert.alert(
          "Check your email",
          "We sent a confirmation link to " + email.trim() + ". Verify your email and then sign in.\n\nIf the email never arrives, ask the app admin to disable email confirmation in Supabase or set up an SMTP provider.",
        );
        setMode("signin");
      } else {
        // Email confirmation is off — user is signed in immediately
        router.replace("/(tabs)");
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 28,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {canSkip && (
            <PressScale
              onPress={() => router.back()}
              style={{ position: "absolute", top: insets.top + 12, left: 20, zIndex: 10, width: 40, height: 40, borderRadius: 100, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="close" size={20} color={colors.foreground} />
            </PressScale>
          )}

          <Animated.View
            entering={FadeInDown.duration(460).springify().damping(18)}
            style={{ marginBottom: 36 }}
          >
            <View style={{ alignItems: "flex-start", marginBottom: 18 }}>
              <GraflyMascot state="idle" size={88} />
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 6 }}>
              {mode === "signin" ? "WELCOME BACK" : "JOIN GRAFLY"}
            </Text>
            <Text style={{ fontSize: 44, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1.2, lineHeight: 48 }}>
              {mode === "signin" ? "Sign in." : "Create your account."}
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 10, lineHeight: 22 }}>
              {mode === "signin"
                ? "Pick up your design journey right where you left off."
                : "Start learning design through bite sized daily lessons."}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(460).springify().damping(18)} style={{ gap: 14 }}>
            <View>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.2 }}>
                EMAIL
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  fontSize: 16,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.foreground,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.2 }}>
                PASSWORD
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  fontSize: 16,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.foreground,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                }}
              />
            </View>

            {error ? (
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.destructive, textAlign: "center" }}>
                {error}
              </Text>
            ) : null}

            <PressScale
              onPress={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: colors.foreground,
                borderRadius: 100,
                paddingVertical: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                    {mode === "signin" ? "Sign in" : "Create account"}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.background} />
                </>
              )}
            </PressScale>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
                OR
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            <PressScale
              onPress={handleGoogle}
              disabled={googleLoading || loading}
              style={{
                backgroundColor: colors.card,
                borderRadius: 100,
                paddingVertical: 18,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
                borderWidth: 1.5,
                borderColor: colors.border,
                opacity: googleLoading ? 0.7 : 1,
              }}
            >
              {googleLoading ? (
                <ActivityIndicator color={colors.foreground} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={colors.foreground} />
                  <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                    Continue with Google
                  </Text>
                </>
              )}
            </PressScale>

            <PressScale
              onPress={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
              scaleTo={0.99}
              style={{ alignItems: "center", paddingVertical: 12, marginTop: 4 }}
            >
              <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <Text style={{ color: colors.primary, fontFamily: "Nunito_800ExtraBold" }}>
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </Text>
              </Text>
            </PressScale>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
