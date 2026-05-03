import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabase";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";
import { Skeleton, LoadingDots } from "@/components/Skeleton";
import { useT } from "@/hooks/useT";

export default function AuthCallbackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { session, loading, resolvingDeepLink } = useAuth();
  const { t, isRTL } = useT();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<"password" | "confirm" | null>(null);

  const handleSubmit = async () => {
    setError("");
    if (!password || password.length < 6) {
      setError(t("auth.err.pwShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("ac.err.match"));
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

  if (loading || resolvingDeepLink) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: insets.top + 80, gap: 16 }}>
        <Skeleton width={140} height={14} />
        <Skeleton width="80%" height={36} radius={10} />
        <Skeleton width="60%" height={36} radius={10} />
        <View style={{ height: 24 }} />
        <Skeleton width="100%" height={56} radius={14} />
        <Skeleton width="100%" height={56} radius={14} />
        <View style={{ height: 12 }} />
        <Skeleton width="100%" height={56} radius={100} />
      </View>
    );
  }

  // Link expired / no session
  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[colors.destructive + "1F", colors.destructive + "00"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360 }}
          pointerEvents="none"
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1, justifyContent: "center",
            paddingHorizontal: 24,
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(560).easing(Easing.out(Easing.cubic))}
            style={{ alignItems: "center", marginBottom: 24 }}
          >
            <View style={{
              width: 116, height: 116, borderRadius: 32,
              backgroundColor: colors.card,
              borderWidth: 1, borderColor: colors.border,
              alignItems: "center", justifyContent: "center",
              shadowColor: colors.destructive,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 6,
            }}>
              <GraflyMascot state="wrong" size={84} />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(80).duration(560).easing(Easing.out(Easing.cubic))}
            style={{ alignItems: "center", marginBottom: 28 }}
          >
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 6,
              paddingHorizontal: 12, paddingVertical: 6,
              borderRadius: 100,
              backgroundColor: colors.destructive + "1A",
              marginBottom: 14,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.destructive }} />
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.destructive, letterSpacing: 1.4,
              }}>
                {t("ac.expired")}
              </Text>
            </View>
            <Text style={{
              fontSize: 34, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, letterSpacing: -1,
              lineHeight: 38, textAlign: "center",
            }}>
              {t("ac.invalid")}
            </Text>
            <Text style={{
              fontSize: 15, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, marginTop: 12,
              lineHeight: 22, textAlign: "center", maxWidth: 320,
            }}>
              {t("ac.invalid.sub")}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(560).easing(Easing.out(Easing.cubic))}>
            <PressScale
              onPress={() => router.replace("/auth")}
              style={{
                backgroundColor: colors.foreground, borderRadius: 100,
                paddingVertical: 20, alignItems: "center",
                flexDirection: "row", justifyContent: "center", gap: 10,
                shadowColor: colors.foreground,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.background, letterSpacing: -0.2 }}>
                {t("auth.back.signin")}
              </Text>
              <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={18} color={colors.background} />
            </PressScale>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.success + "1F", colors.success + "00"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360 }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[colors.accent + "1F", colors.accent + "00"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute", top: 0, right: -60,
          width: 280, height: 280, borderRadius: 200,
        }}
        pointerEvents="none"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 24,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Mascot plate */}
          <Animated.View
            entering={FadeInDown.duration(560).easing(Easing.out(Easing.cubic))}
            style={{ alignItems: "center", marginBottom: 24 }}
          >
            <View style={{
              width: 116, height: 116, borderRadius: 32,
              backgroundColor: colors.card,
              borderWidth: 1, borderColor: colors.border,
              alignItems: "center", justifyContent: "center",
              shadowColor: colors.success,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 6,
            }}>
              <GraflyMascot state="celebrate" size={84} />
            </View>
          </Animated.View>

          {/* Headline */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(560).easing(Easing.out(Easing.cubic))}
            style={{ marginBottom: 28, alignItems: "center" }}
          >
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 6,
              paddingHorizontal: 12, paddingVertical: 6,
              borderRadius: 100,
              backgroundColor: colors.success + "1A",
              marginBottom: 14,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.success, letterSpacing: 1.4,
              }}>
                {t("ac.almostDone")}
              </Text>
            </View>
            <Text style={{
              fontSize: 38, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, letterSpacing: -1.2,
              lineHeight: 42, textAlign: "center",
            }}>
              {t("ac.setNew")}
            </Text>
            <Text style={{
              fontSize: 15, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, marginTop: 12,
              lineHeight: 22, textAlign: "center", maxWidth: 320,
            }}>
              {t("ac.setNew.sub")}
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.delay(160).duration(560).easing(Easing.out(Easing.cubic))}
            style={{ gap: 14 }}
          >
            <View>
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.4,
              }}>
                {t("ac.newPw")}
              </Text>
              <View style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: colors.card,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: focused === "password" ? colors.primary : colors.border,
                paddingHorizontal: 16,
              }}>
                <Icon
                  name="lock-closed-outline"
                  size={18}
                  color={focused === "password" ? colors.primary : colors.mutedForeground}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder={t("auth.password.placeholder")}
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.foreground,
                    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                  }}
                />
                <PressScale onPress={() => setShowPassword((s) => !s)} style={{ padding: 6 }} scaleTo={0.9}>
                  <Icon
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </PressScale>
              </View>
            </View>

            <View>
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.4,
              }}>
                {t("ac.confirmPw")}
              </Text>
              <View style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: colors.card,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: focused === "confirm" ? colors.primary : colors.border,
                paddingHorizontal: 16,
              }}>
                <Icon
                  name="shield-checkmark-outline"
                  size={18}
                  color={focused === "confirm" ? colors.primary : colors.mutedForeground}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  placeholder={t("ac.reenter")}
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.foreground,
                    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                  }}
                />
                <PressScale onPress={() => setShowConfirm((s) => !s)} style={{ padding: 6 }} scaleTo={0.9}>
                  <Icon
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </PressScale>
              </View>
            </View>

            {!!error && (
              <View style={{
                backgroundColor: colors.destructive + "1A",
                borderRadius: 14, padding: 12,
                borderWidth: 1, borderColor: colors.destructive + "55",
                flexDirection: "row", alignItems: "center", gap: 8,
              }}>
                <Icon name="alert-circle" size={16} color={colors.destructive} />
                <Text style={{
                  flex: 1, fontSize: 13, fontFamily: "Nunito_600SemiBold",
                  color: colors.destructive,
                }}>
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
                shadowColor: colors.foreground,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              {busy ? (
                <LoadingDots color={colors.background} />
              ) : (
                <>
                  <Text style={{
                    fontSize: 17, fontFamily: "Nunito_800ExtraBold",
                    color: colors.background, letterSpacing: -0.2,
                  }}>
                    {t("ac.update")}
                  </Text>
                  <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={18} color={colors.background} />
                </>
              )}
            </PressScale>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
