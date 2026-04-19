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
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { GraflyMascot } from "@/components/GraflyMascot";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    setGoogleLoading(false);
    if (err) setError(err);
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
    const { error: err } = mode === "signin"
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);
    setLoading(false);
    if (err) {
      setError(err);
    } else if (mode === "signup") {
      Alert.alert("Check your email", "We sent a confirmation link. Please verify your email before signing in.");
      setMode("signin");
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
          <Animated.View entering={FadeIn} style={{ alignItems: "center", marginBottom: 40 }}>
            <GraflyMascot state="idle" size={100} />
            <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginTop: 16 }}>
              {mode === "signin" ? "Welcome back" : "Join Grafly"}
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 6, textAlign: "center" }}>
              {mode === "signin"
                ? "Sign in to continue your design journey"
                : "Create an account to start learning design"}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(100)} style={{ gap: 14 }}>
            <View>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 6 }}>
                Email
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
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.foreground,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginBottom: 6 }}>
                Password
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
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.foreground,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                }}
              />
            </View>

            {error ? (
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.destructive, textAlign: "center" }}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 4,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: "#fff" }}>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 8 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                OR
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            <TouchableOpacity
              onPress={handleGoogle}
              disabled={googleLoading || loading}
              style={{
                backgroundColor: colors.card,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
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
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
              style={{ alignItems: "center", paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <Text style={{ color: colors.primary }}>
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
