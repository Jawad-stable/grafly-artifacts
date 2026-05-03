import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";
import { GoogleLogo } from "@/components/GoogleLogo";
import { LoadingDots } from "@/components/Skeleton";
import { useT } from "@/hooks/useT";

type Mode = "signin" | "signup" | "reset";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, signInWithGoogle, resetPassword, resendConfirmation } = useAuth();
  const { state: gameState } = useGame();
  const { t, isRTL } = useT();
  const canSkip = gameState.onboardingComplete;

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  // When sign-in fails because the email is not yet confirmed, expose a
  // one-tap "resend confirmation email" affordance so the user is never stuck.
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) return;
    setResending(true);
    const { error: err } = await resendConfirmation(email.trim());
    setResending(false);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setNotice(t("auth.notice.resent"));
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setNotice("");
    setNeedsConfirm(false);
  };

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

  const handleSubmit = async () => {
    setError("");
    setNotice("");
    if (mode === "reset") {
      if (!email.trim()) {
        setError(t("auth.err.email"));
        return;
      }
      setLoading(true);
      const { error: err } = await resetPassword(email.trim());
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      setNotice(t("auth.notice.reset"));
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError(t("auth.err.both"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.err.pwShort"));
      return;
    }
    setLoading(true);
    if (mode === "signin") {
      const { error: err } = await signIn(email.trim(), password);
      setLoading(false);
      if (err) {
        setError(err);
        // Detect the "email not confirmed" case so we can surface the
        // resend-confirmation button right next to the error.
        const lower = err.toLowerCase();
        setNeedsConfirm(lower.includes("not confirmed") || lower.includes("email_not_confirmed"));
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
          t("auth.confirmEmail.title"),
          t("auth.confirmEmail.body", { email: email.trim() }),
        );
        switchMode("signin");
        setNeedsConfirm(true);
      } else {
        router.replace("/(tabs)");
      }
    }
  };

  const eyebrow =
    mode === "signin" ? t("auth.eyebrow.welcome") :
    mode === "signup" ? t("auth.eyebrow.join") : t("auth.forgot.eyebrow");
  const headline =
    mode === "signin" ? t("auth.headline.signin") :
    mode === "signup" ? t("auth.headline.signup") : t("auth.headline.reset");
  const subhead =
    mode === "signin" ? t("auth.sub.signin2")
    : mode === "signup" ? t("auth.sub.signup2")
    : t("auth.sub.reset2");

  const ctaLabel =
    mode === "signin" ? t("auth.signin") :
    mode === "signup" ? t("auth.create") : t("auth.send.reset");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Decorative hero gradient blob */}
      <LinearGradient
        colors={[colors.primary + "26", colors.primary + "00"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 360,
        }}
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

      {/* Floating close button (pinned to viewport, not the scroll content).
          Uses a plain Pressable so the position+size styles live on the actual
          hit-test box — wrapping in PressScale would put the styles on an inner
          Animated.View, which on web leaves the Pressable's box at 0x0 and
          breaks click handling. */}
      {canSkip && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          onPress={() => {
            // Always send the user back to the main app — `router.back()` can
            // silently no-op when the navigation stack is shallow, which would
            // leave the user trapped on this screen.
            router.replace("/(tabs)");
          }}
          style={({ pressed }) => ({
            position: "absolute",
            top: insets.top + 12,
            right: 16,
            zIndex: 50,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Icon name="close" size={20} color={colors.foreground} />
        </Pressable>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingTop: insets.top + 56,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Mascot plate */}
          <Animated.View
            entering={FadeInDown.duration(560).easing(Easing.out(Easing.cubic))}
            style={{ alignItems: "center", marginBottom: 24 }}
          >
            <View
              style={{
                width: 116, height: 116, borderRadius: 32,
                backgroundColor: colors.card,
                borderWidth: 1, borderColor: colors.border,
                alignItems: "center", justifyContent: "center",
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.18,
                shadowRadius: 24,
                elevation: 6,
              }}
            >
              <GraflyMascot
                state={mode === "reset" ? "idle" : mode === "signup" ? "celebrate" : "idle"}
                size={84}
              />
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
              backgroundColor: colors.primary + "1A",
              marginBottom: 14,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.primary, letterSpacing: 1.4,
              }}>
                {eyebrow}
              </Text>
            </View>
            <Text style={{
              fontSize: 40, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, letterSpacing: -1.2,
              lineHeight: 44, textAlign: "center",
            }}>
              {headline}
            </Text>
            <Text style={{
              fontSize: 15, fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground, marginTop: 12,
              lineHeight: 22, textAlign: "center", maxWidth: 320,
            }}>
              {subhead}
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.delay(160).duration(560).easing(Easing.out(Easing.cubic))}
            style={{ gap: 14 }}
          >
            {/* Email */}
            <View>
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.4,
              }}>
                {t("auth.email")}
              </Text>
              <View style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: colors.card,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: focused === "email" ? colors.primary : colors.border,
                paddingHorizontal: 16,
              }}>
                <Icon
                  name="mail-outline"
                  size={18}
                  color={focused === "email" ? colors.primary : colors.mutedForeground}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder={t("auth.email.placeholder")}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
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
              </View>
            </View>

            {/* Password */}
            {mode !== "reset" && (
              <View>
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground, marginBottom: 8, letterSpacing: 1.4,
                }}>
                  {t("auth.password")}
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
                  <PressScale
                    onPress={() => setShowPassword((s) => !s)}
                    style={{ padding: 6 }}
                    scaleTo={0.9}
                  >
                    <Icon
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={colors.mutedForeground}
                    />
                  </PressScale>
                </View>
              </View>
            )}

            {mode === "signin" && (
              <PressScale
                onPress={() => switchMode("reset")}
                scaleTo={0.98}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                style={{ alignSelf: "flex-end", paddingVertical: 12, paddingHorizontal: 12 }}
              >
                <Text style={{
                  fontSize: 13, fontFamily: "Nunito_800ExtraBold",
                  color: colors.primary, letterSpacing: -0.2,
                }}>
                  {t("auth.forgot")}
                </Text>
              </PressScale>
            )}

            {error ? (
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
            ) : null}

            {needsConfirm && mode !== "reset" ? (
              <PressScale
                onPress={handleResend}
                disabled={resending}
                accessibilityRole="button"
                accessibilityLabel={t("auth.resend")}
                style={{
                  backgroundColor: colors.primary + "14",
                  borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
                  borderWidth: 1, borderColor: colors.primary + "55",
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: resending ? 0.7 : 1,
                }}
              >
                {resending ? (
                  <LoadingDots color={colors.primary} />
                ) : (
                  <>
                    <Icon name="mail-unread-outline" size={16} color={colors.primary} />
                    <Text style={{
                      fontSize: 13, fontFamily: "Nunito_800ExtraBold",
                      color: colors.primary, letterSpacing: -0.2,
                    }}>
                      {t("auth.resend")}
                    </Text>
                  </>
                )}
              </PressScale>
            ) : null}

            {notice ? (
              <View style={{
                backgroundColor: colors.success + "1F",
                borderRadius: 14, padding: 12,
                borderWidth: 1, borderColor: colors.success + "55",
                flexDirection: "row", alignItems: "center", gap: 8,
              }}>
                <Icon name="checkmark-circle" size={16} color={colors.success} />
                <Text style={{
                  flex: 1, fontSize: 13, fontFamily: "Nunito_600SemiBold",
                  color: colors.success,
                }}>
                  {notice}
                </Text>
              </View>
            ) : null}

            {/* Primary CTA */}
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
                shadowColor: colors.foreground,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              {loading ? (
                <LoadingDots color={colors.background} />
              ) : (
                <>
                  <Text style={{
                    fontSize: 17, fontFamily: "Nunito_800ExtraBold",
                    color: colors.background, letterSpacing: -0.2,
                  }}>
                    {ctaLabel}
                  </Text>
                  <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={18} color={colors.background} />
                </>
              )}
            </PressScale>

            {mode !== "reset" && (
              <View style={{
                flexDirection: "row", alignItems: "center",
                gap: 12, marginVertical: 14,
              }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground, letterSpacing: 1.5,
                }}>
                  {t("auth.or.continue")}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>
            )}

            {mode !== "reset" && (
              <PressScale
                onPress={handleGoogle}
                disabled={googleLoading || loading}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 100,
                  paddingVertical: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 12,
                  borderWidth: 1,
                  borderColor: "#DADCE0",
                  opacity: googleLoading ? 0.7 : 1,
                }}
              >
                {googleLoading ? (
                  <LoadingDots color="#3C4043" />
                ) : (
                  <>
                    <GoogleLogo size={20} />
                    <Text style={{
                      fontSize: 15, fontFamily: "Nunito_800ExtraBold",
                      color: "#3C4043", letterSpacing: -0.2,
                    }}>
                      {t("auth.google")}
                    </Text>
                  </>
                )}
              </PressScale>
            )}

            {mode === "reset" ? (
              <PressScale
                onPress={() => switchMode("signin")}
                scaleTo={0.99}
                style={{
                  alignItems: "center", paddingVertical: 14, marginTop: 4,
                  flexDirection: "row", justifyContent: "center", gap: 6,
                }}
              >
                <Icon name={isRTL ? "arrow-forward" : "arrow-back"} size={16} color={colors.mutedForeground} />
                <Text style={{
                  fontSize: 14, fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground,
                }}>
                  {t("auth.back.signin")}
                </Text>
              </PressScale>
            ) : (
              <PressScale
                onPress={() => switchMode(mode === "signin" ? "signup" : "signin")}
                scaleTo={0.99}
                style={{ alignItems: "center", paddingVertical: 12, marginTop: 4 }}
              >
                <Text style={{
                  fontSize: 14, fontFamily: "Nunito_600SemiBold",
                  color: colors.mutedForeground,
                }}>
                  {mode === "signin" ? t("auth.dont.have") : t("auth.have")}
                  <Text style={{ color: colors.primary, fontFamily: "Nunito_800ExtraBold" }}>
                    {mode === "signin" ? t("auth.signup") : t("auth.signin")}
                  </Text>
                </Text>
              </PressScale>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
