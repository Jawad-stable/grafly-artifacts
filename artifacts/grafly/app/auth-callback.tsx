import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabase";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";

export default function AuthCallbackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { session, loading, resolvingDeepLink } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/(tabs)");
  };

  // Wait for both the initial session probe AND any in-flight deep-link
  // exchange (recovery email link) to settle before deciding whether to
  // show the form or the expired fallback.
  if (loading || resolvingDeepLink) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.foreground} />
      </View>
    );
  }

  // The recovery link did not establish a session — most often the link expired
  // or was already used. Send the user to the sign in screen.
  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }}>
          <View style={{ alignItems: "flex-start", marginBottom: 18 }}>
            <GraflyMascot state="wrong" size={88} />
          </View>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 6 }}>
            LINK EXPIRED
          </Text>
          <Text style={{ fontSize: 36, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 40, marginBottom: 12 }}>
            This link is no longer valid.
          </Text>
          <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 22, marginBottom: 24 }}>
            Reset links can only be used once and they expire after a short time. Request a new one and try again.
          </Text>
          <PressScale
            onPress={() => router.replace("/auth")}
            style={{
              backgroundColor: colors.foreground, borderRadius: 100,
              paddingVertical: 18, alignItems: "center",
              flexDirection: "row", justifyContent: "center", gap: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
              Back to sign in
            </Text>
            <Icon name="arrow-forward" size={18} color={colors.background} />
          </PressScale>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 24,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(460).springify().damping(18)}>
            <View style={{ alignItems: "flex-start", marginBottom: 18 }}>
              <GraflyMascot state="celebrate" size={88} />
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 6 }}>
              ALMOST DONE
            </Text>
            <Text style={{ fontSize: 40, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1.2, lineHeight: 44, marginBottom: 10 }}>
              Set a new password.
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 22, marginBottom: 28 }}>
              Pick a new password for your account. We will sign you in right after.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(460).springify().damping(18)} style={{ gap: 14 }}>
            <View>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.2 }}>
                NEW PASSWORD
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

            <View>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.2 }}>
                CONFIRM PASSWORD
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter the password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
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

            {!!error && (
              <View style={{
                backgroundColor: colors.destructive + "1F",
                borderRadius: 14, padding: 12,
                borderWidth: 1, borderColor: colors.destructive,
              }}>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.destructive, textAlign: "center" }}>
                  {error}
                </Text>
              </View>
            )}

            <PressScale
              onPress={handleSubmit}
              disabled={busy}
              style={{
                backgroundColor: colors.foreground, borderRadius: 100,
                paddingVertical: 20, alignItems: "center",
                flexDirection: "row", justifyContent: "center", gap: 10,
                marginTop: 8,
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                    Update password
                  </Text>
                  <Icon name="arrow-forward" size={18} color={colors.background} />
                </>
              )}
            </PressScale>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
