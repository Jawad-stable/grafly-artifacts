import React from "react";
import { View, Text, ScrollView, Switch, Platform } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { PressScale } from "@/components/PressScale";
import { HomeBackdrop } from "@/components/HomeBackdrop";
import { BrandSquiggle } from "@/components/BrandSquiggle";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/context/ProfileContext";
import { useT } from "@/hooks/useT";
import { LANGUAGES } from "@/lib/i18n";
import colorsConst from "@/constants/colors";

const BRAND = colorsConst.brand;

function mix(fg: string, bg: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const fr = parseInt(fg.slice(1, 3), 16);
  const fgG = parseInt(fg.slice(3, 5), 16);
  const fb = parseInt(fg.slice(5, 7), 16);
  const br = parseInt(bg.slice(1, 3), 16);
  const bgG = parseInt(bg.slice(3, 5), 16);
  const bb = parseInt(bg.slice(5, 7), 16);
  const r = Math.round(a * fr + (1 - a) * br);
  const g = Math.round(a * fgG + (1 - a) * bgG);
  const b = Math.round(a * fb + (1 - a) * bb);
  const toHex = (v: number) => v.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state: profileState, toggleVoice, setTheme, setLanguage } = useProfile();
  const { t, isRTL, dir } = useT();

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 12);
  const paddingBottom = insets.bottom + 40;

  const bg = colors.background;
  const cardBorder = mix(colors.foreground, bg, 0.08);
  const tileIdle = colors.background;
  const tileBorder = mix(colors.foreground, bg, 0.12);
  const tileActiveBorder = colors.primary;
  const tileActiveBg = mix(colors.primary, bg, 0.08);
  const iconBg = mix(colors.primary, bg, 0.14);
  const switchOnTrack = mix(colors.primary, bg, 0.4);

  // Mini mockup preview palettes for the theme tiles. These mirror the
  // *actual* light/dark palettes from constants/colors.ts (BRAND.offWhite
  // and BRAND.navy) so the tile preview reads as a true sample of what
  // the user will get — not a generic black/white swatch.
  const lightPreview = {
    bg: BRAND.offWhite,
    surface: "#FFFFFF",
    text: BRAND.navy,
    muted: "#646A88",
    accent: BRAND.cyan,
    pop: BRAND.lime,
  };
  const darkPreview = {
    bg: BRAND.navy,
    surface: "#2D3355",
    text: "#DEE0ED",
    muted: "#969CBC",
    accent: BRAND.cyan,
    pop: BRAND.lime,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HomeBackdrop
        foreground={colors.foreground}
        primary={colors.primary}
        accent={colors.accent}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop,
          paddingHorizontal: 24,
          paddingBottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — back button + editorial title */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 6,
          }}
        >
          <PressScale
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/(tabs)");
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: cardBorder,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={isRTL ? "arrow-forward" : "arrow-back"}
              size={20}
              color={colors.foreground}
            />
          </PressScale>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground,
                  letterSpacing: 1.5,
                  ...dir,
                }}
              >
                {t("profile.eyebrow")}
              </Text>
            </View>
          </View>
        </View>

        <Animated.View entering={FadeIn.duration(280)} style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 44,
              lineHeight: 48,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              marginTop: 14,
              ...dir,
            }}
          >
            {t("settings.title")}
          </Text>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground,
              marginTop: 8,
              ...dir,
            }}
          >
            {t("settings.subtitle")}
          </Text>
        </Animated.View>

        {/* PREFERENCES section */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.mutedForeground,
            letterSpacing: 1.6,
            marginBottom: 12,
            ...dir,
          }}
        >
          {t("settings.section.preferences")}
        </Text>

        {/* LANGUAGE CARD */}
        <Animated.View
          entering={FadeInDown.delay(60).duration(360)}
          style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: cardBorder,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <View style={{ position: "absolute", top: -16, [isRTL ? "left" : "right"]: -16, opacity: 0.5 }}>
            <BrandSquiggle
              variant="loop"
              width={120}
              height={80}
              color={colors.primary}
              opacity={0.12}
            />
          </View>

          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="text-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.foreground,
                  ...dir,
                }}
              >
                {t("settings.language")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.mutedForeground,
                  marginTop: 2,
                  ...dir,
                }}
              >
                {t("settings.language.sub")}
              </Text>
            </View>
          </View>

          {/* Segmented pill — both languages live inside one rounded
              container, the active option is a filled cyan capsule that
              animates in. Reads as a single control rather than two
              competing tiles. */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: mix(colors.foreground, bg, 0.04),
              borderRadius: 999,
              padding: 4,
              borderWidth: 1,
              borderColor: tileBorder,
            }}
          >
            {LANGUAGES.map((l) => {
              const active = profileState.language === l.id;
              const sample = l.id === "ar" ? "أ" : "A";
              return (
                <PressScale
                  key={l.id}
                  onPress={() => setLanguage(l.id)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    backgroundColor: active ? colors.primary : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: active
                        ? mix(colors.background, colors.primary, 0.22)
                        : iconBg,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 26,
                        textAlign: "center",
                        textAlignVertical: "center",
                        includeFontPadding: false,
                        fontFamily: "Nunito_800ExtraBold",
                        color: active ? colors.primaryForeground : colors.primary,
                        writingDirection: l.id === "ar" ? "rtl" : "ltr",
                      }}
                    >
                      {sample}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Nunito_800ExtraBold",
                      color: active ? colors.primaryForeground : colors.foreground,
                      writingDirection: l.id === "ar" ? "rtl" : "ltr",
                    }}
                  >
                    {l.native}
                  </Text>
                </PressScale>
              );
            })}
          </View>

          {/* Helper hint under the pill — clarifies that switching to
              Arabic flips the layout direction (RTL) and reloads. */}
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
            }}
          >
            <Icon name="information-circle-outline" size={14} color={colors.mutedForeground} />
            <Text
              style={{
                flex: 1,
                fontSize: 12,
                lineHeight: 17,
                fontFamily: "Nunito_600SemiBold",
                color: colors.mutedForeground,
                ...dir,
              }}
            >
              {t("settings.language.hint")}
            </Text>
          </View>
        </Animated.View>

        {/* THEME CARD */}
        <Animated.View
          entering={FadeInDown.delay(120).duration(360)}
          style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: cardBorder,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name={profileState.themeMode === "dark" ? "moon" : "sunny"}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.foreground,
                  ...dir,
                }}
              >
                {t("settings.theme")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.mutedForeground,
                  marginTop: 2,
                  ...dir,
                }}
              >
                {t("settings.theme.sub")}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 12 }}>
            {(["light", "dark"] as const).map((m) => {
              const active = profileState.themeMode === m;
              const p = m === "light" ? lightPreview : darkPreview;
              return (
                <PressScale
                  key={m}
                  onPress={() => setTheme(m)}
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    backgroundColor: active ? tileActiveBg : tileIdle,
                    borderWidth: active ? 2 : 1,
                    borderColor: active ? tileActiveBorder : tileBorder,
                    padding: 12,
                    alignItems: "center",
                  }}
                >
                  {/* Mini mockup preview — a tiny home-screen sample using
                      the *real* light/dark palette so the user immediately
                      sees what the chosen theme will look like.            */}
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      borderRadius: 14,
                      backgroundColor: p.bg,
                      padding: 10,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: mix(p.text, p.bg, 0.12),
                    }}
                  >
                    {/* Status / eyebrow row */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: p.accent,
                        }}
                      />
                      <View
                        style={{
                          height: 4,
                          width: 36,
                          borderRadius: 2,
                          backgroundColor: p.muted,
                          opacity: 0.7,
                        }}
                      />
                    </View>

                    {/* Big headline + subline (the editorial title) */}
                    <View
                      style={{
                        height: 8,
                        width: "78%",
                        borderRadius: 3,
                        backgroundColor: p.text,
                        opacity: 0.95,
                        marginBottom: 5,
                      }}
                    />
                    <View
                      style={{
                        height: 5,
                        width: "55%",
                        borderRadius: 2,
                        backgroundColor: p.text,
                        opacity: 0.45,
                        marginBottom: 10,
                      }}
                    />

                    {/* Hero card with brand cyan square + two text lines */}
                    <View
                      style={{
                        borderRadius: 9,
                        backgroundColor: p.surface,
                        padding: 7,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 7,
                          backgroundColor: p.accent,
                        }}
                      />
                      <View style={{ flex: 1, gap: 3 }}>
                        <View
                          style={{
                            height: 5,
                            borderRadius: 2,
                            backgroundColor: p.text,
                            opacity: 0.85,
                          }}
                        />
                        <View
                          style={{
                            height: 4,
                            width: "65%",
                            borderRadius: 2,
                            backgroundColor: p.text,
                            opacity: 0.4,
                          }}
                        />
                      </View>
                      {/* Lime XP pill */}
                      <View
                        style={{
                          height: 12,
                          paddingHorizontal: 5,
                          borderRadius: 6,
                          backgroundColor: p.pop,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View style={{ width: 10, height: 3, borderRadius: 1.5, backgroundColor: BRAND.navy }} />
                      </View>
                    </View>

                    {/* CTA button row */}
                    <View
                      style={{
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: p.accent,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ width: 28, height: 4, borderRadius: 2, backgroundColor: BRAND.navy, opacity: 0.85 }} />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    <Icon
                      name={m === "light" ? "sunny" : "moon"}
                      size={14}
                      color={active ? colors.primary : colors.mutedForeground}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Nunito_800ExtraBold",
                        color: colors.foreground,
                      }}
                    >
                      {m === "light" ? t("onb.theme.light") : t("onb.theme.dark")}
                    </Text>
                  </View>

                  {active && (
                    <View
                      style={{
                        position: "absolute",
                        top: 16,
                        [isRTL ? "left" : "right"]: 16,
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="checkmark" size={13} color={colors.primaryForeground} />
                    </View>
                  )}
                </PressScale>
              );
            })}
          </View>
        </Animated.View>

        {/* AUDIO section */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.mutedForeground,
            letterSpacing: 1.6,
            marginTop: 12,
            marginBottom: 12,
            ...dir,
          }}
        >
          {t("settings.section.audio")}
        </Text>

        {/* VOICE CARD */}
        <Animated.View
          entering={FadeInDown.delay(180).duration(360)}
          style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: cardBorder,
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="volume-high-outline" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                ...dir,
              }}
            >
              {t("settings.voice")}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Nunito_600SemiBold",
                color: colors.mutedForeground,
                marginTop: 2,
                ...dir,
              }}
            >
              {t("settings.voice.sub")}
            </Text>
          </View>
          <Switch
            value={profileState.voiceEnabled}
            onValueChange={toggleVoice}
            trackColor={{ false: colors.muted, true: switchOnTrack }}
            thumbColor={profileState.voiceEnabled ? colors.primary : colors.mutedForeground}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
