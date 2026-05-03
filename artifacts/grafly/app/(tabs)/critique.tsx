import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Icon } from "@/components/Icon";
import { PressScale } from "@/components/PressScale";
import { BrandSquiggle } from "@/components/BrandSquiggle";
import { AiBot } from "@/components/AiBot";
import { TypewriterText } from "@/components/TypewriterText";
import { CritiqueOnboarding } from "@/components/CritiqueOnboarding";
import { Skeleton } from "@/components/Skeleton";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/hooks/useT";
import { useGame } from "@/context/GameContext";
import {
  sendCritiqueMessage,
  type ChatMessage,
} from "@/services/aiCritique";
import {
  getDesignRemoteUrl,
  pickRandomLocalDesign,
  type LocalDesign,
} from "@/data/localDesigns";
import { getBottomBarWidth } from "@/constants/layout";
import {
  COINS_PER_SESSION,
  MIN_USER_TURNS_FOR_REWARD,
  ONBOARDING_KEY,
  getQuickPrompts,
  XP_PER_SESSION,
  pickOpener,
} from "@/constants/critique";

const SMOOTH = Easing.out(Easing.cubic);

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function CritiqueScreen() {
  const colors = useColors();
  const { t, lang } = useT();
  const QUICK_PROMPTS = getQuickPrompts(lang);
  const insets = useSafeAreaInsets();
  const { state, addXP, addCoins, dispatch } = useGame();
  // Live viewport width — drives the composer pill width so it
  // always matches the floating tab bar (which also recomputes from
  // the live viewport). Static `Dimensions.get` snapshots are stale
  // on Expo web inside a resizable canvas iframe.
  const { width: liveScreenW } = useWindowDimensions();
  const composerWidth = getBottomBarWidth(liveScreenW);

  const [design, setDesign] = useState<LocalDesign | null>(null);
  const [loadingDesign, setLoadingDesign] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [sessionsDone, setSessionsDone] = useState(0);
  const [rewardedThisDesign, setRewardedThisDesign] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((v) => {
        if (!cancelled && !v) setShowOnboarding(true);
      })
      .catch(() => {
        if (!cancelled) setShowOnboarding(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function dismissOnboarding() {
    setShowOnboarding(false);
    AsyncStorage.setItem(ONBOARDING_KEY, "1").catch(() => {});
  }

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const [animateIndex, setAnimateIndex] = useState(-1);
  // Monotonically increasing token. Bumped every time a fresh design
  // is loaded. Captured at the start of `handleSend` and re-checked
  // before the AI reply is applied, so a slow in-flight response from
  // an OLD design can't poison the chat for a NEW design that the
  // user shuffled to in the meantime.
  const requestToken = useRef(0);

  const maxSessions = state.isPro ? Infinity : 2;
  const limitReached = sessionsDone >= maxSessions;
  const userTurnCount = messages.filter((m) => m.role === "user").length;
  const chatStarted = userTurnCount > 0;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const tabBottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 62 + tabBottomPad;
  const tabBarBottomOffset = 12;
  const composerLift = tabBarHeight + tabBarBottomOffset + 12;

  // Static spacing constants used inside the pre-chat ScrollView.
  // They stay literals (rather than props) because they have to match
  // the actual padding/margin/gap values applied below in the JSX,
  // and they also drive `heroCardTop` for the onboarding ring's card
  // highlight.
  const SCROLL_PAD_TOP = 14;
  const SCROLL_PAD_BOTTOM = 12;
  const SCROLL_GAP = 10;
  const EYEBROW_MARGIN_TOP = -4;
  const EYEBROW_MARGIN_BOTTOM = 12;
  const CARD_MARGIN_BOTTOM = 10;
  const MENTOR_ROW_MARGIN_TOP = 6;
  const MENTOR_ROW_MARGIN_BOTTOM = 4;

  // Defaults so the very first paint (before onLayout fires) places
  // the onboarding ring close to its final spot. As soon as the real
  // measurements come in, the ring snaps to the exact card position.
  const HEADER_BLOCK_H_DEFAULT = 70;
  const EYEBROW_H_DEFAULT = 22;
  const [headerH, setHeaderH] = useState(HEADER_BLOCK_H_DEFAULT);
  const [eyebrowH, setEyebrowH] = useState(EYEBROW_H_DEFAULT);

  // Sizing policy: the photo always uses the full edge-to-edge width
  // (`SCREEN_W - 40` to account for the ScrollView's 20px horizontal
  // padding) and the height is the natural 5:4 derived from that
  // width. If the surrounding blocks ever push the column past the
  // viewport on a very small phone or with large text scaling, the
  // ScrollView absorbs the overflow gracefully — that is a better
  // outcome than shrinking the photo into a thumbnail.
  const heroCardWidth = SCREEN_W - 40;
  const heroCardHeight = Math.round(heroCardWidth * (5 / 4));
  // Single source of truth for where the card actually sits on
  // screen. Used by the onboarding ring so its highlight stays glued
  // to the card even when any block above changes height (text
  // scaling, longer text).
  const heroCardTop =
    headerH +
    SCROLL_PAD_TOP +
    EYEBROW_MARGIN_TOP +
    eyebrowH +
    EYEBROW_MARGIN_BOTTOM +
    SCROLL_GAP;
  const heroCardLeft = Math.round((SCREEN_W - heroCardWidth) / 2);

  // Stable layout callbacks. Each one only triggers a state update
  // when the new height differs from the previous by more than half a
  // pixel, to avoid render loops from sub-pixel layout jitter.
  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setHeaderH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);
  const onEyebrowLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setEyebrowH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);

  const sessionsLeft = Math.max(0, maxSessions - sessionsDone);

  function loadNewDesign() {
    // Bump the token so any in-flight reply from the previous design
    // is dropped instead of being appended to the fresh chat.
    requestToken.current += 1;
    setLoadingDesign(true);
    setMessages([]);
    setRewardedThisDesign(false);
    setAnimateIndex(-1);
    const d = pickRandomLocalDesign();
    setDesign(d);
    setMessages([{ role: "assistant", content: pickOpener(d.title, lang) }]);
    setLoadingDesign(false);
  }

  useEffect(() => {
    loadNewDesign();
  }, []);

  useEffect(() => {
    // Defer scroll-to-end by one tick so the new bubble has been laid
    // out before we scroll. Cleanup clears the timer so a fast
    // unmount (e.g. tab-switch) doesn't fire scrollToEnd on a stale
    // ref.
    const t = setTimeout(
      () => scrollRef.current?.scrollToEnd({ animated: true }),
      50,
    );
    return () => clearTimeout(t);
  }, [messages.length, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending || limitReached || !design) return;

    // Snapshot the current request token so we can detect if the user
    // shuffled to a new design while this AI request was in flight.
    // If they did, the response (and any error) is silently dropped.
    const myToken = requestToken.current;

    const isFirstUserMessage =
      messages.filter((m) => m.role === "user").length === 0;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    if (isFirstUserMessage) {
      dispatch({ type: "INCREMENT_CRITIQUE_COUNT" });
    }
    try {
      const reply = await sendCritiqueMessage({
        designTitle: design.title,
        designDescription: design.description,
        designImageUrl: getDesignRemoteUrl(design),
        messages: next,
      });
      if (myToken !== requestToken.current) return; // shuffled away
      const updated: ChatMessage[] = [
        ...next,
        { role: "assistant", content: reply },
      ];
      setMessages(updated);
      setAnimateIndex(updated.length - 1);

      const newUserTurns = next.filter((m) => m.role === "user").length;
      if (
        !rewardedThisDesign &&
        newUserTurns >= MIN_USER_TURNS_FOR_REWARD
      ) {
        addXP(XP_PER_SESSION);
        addCoins(COINS_PER_SESSION);
        setSessionsDone((s) => s + 1);
        setRewardedThisDesign(true);
      }
    } catch (err: any) {
      if (myToken !== requestToken.current) return; // shuffled away
      const msg = err?.message ?? t("crit.couldNotReach");
      const updated: ChatMessage[] = [
        ...next,
        {
          role: "assistant",
          content: t("crit.troubleReply", { msg }),
        },
      ];
      setMessages(updated);
      setAnimateIndex(updated.length - 1);
    } finally {
      if (myToken === requestToken.current) {
        setSending(false);
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Brand backdrop — same drifting squiggle motif as home, tree
          and shop. Sits behind everything at low alpha so the
          mentor screen feels part of the same Grafly visual world. */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <View style={{ position: "absolute", top: SCREEN_H * 0.12, left: -30 }}>
          <BrandSquiggle
            variant="loop"
            width={160}
            height={95}
            color={colors.brand.cyan}
            opacity={0.07}
            drift
            delay={300}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: SCREEN_H * 0.46,
            left: SCREEN_W - 110,
          }}
        >
          <BrandSquiggle
            variant="tube"
            width={110}
            height={180}
            color={colors.brand.pink}
            opacity={0.06}
            strokeWidth={5}
            drift
            delay={1600}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: SCREEN_H * 0.78,
            left: SCREEN_W * 0.18,
          }}
        >
          <BrandSquiggle
            variant="wave"
            width={210}
            height={34}
            color={colors.brand.lime}
            opacity={0.09}
            strokeWidth={4}
            drift
            delay={1000}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        {/* Compact editorial header */}
        <Animated.View
          entering={FadeInDown.duration(520).easing(Easing.out(Easing.cubic))}
          onLayout={onHeaderLayout}
          style={{
            paddingTop: paddingTop + 10,
            paddingHorizontal: 20,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Brand-colored eyebrow pill — replaces the old plain
                gray dot + label. Reads as a confident chip in the
                Grafly visual language. */}
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 100,
                backgroundColor: colors.brand.cyan + "1A",
                borderWidth: 1,
                borderColor: colors.brand.cyan + "55",
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: state.isPro
                    ? colors.success
                    : colors.brand.cyan,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.brand.cyanDeep,
                  letterSpacing: 1.4,
                }}
              >
                {t("crit.aiMentor")}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 30,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -0.8,
                lineHeight: 34,
                marginTop: 4,
              }}
            >
              {t("crit.critique")}
            </Text>
          </View>

          {/* Sessions-left chip — both states use a bright brand
              gradient so navy text passes AA in both directions
              (Pro is a light-cyan range, Free is lime). Avoids the
              "white on cyanDeep" 2.7:1 contrast trap. */}
          <LinearGradient
            colors={
              state.isPro
                ? ["#4FC3FF", colors.brand.cyan]
                : [colors.brand.lime, "#C7D11A"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 100,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              shadowColor: state.isPro ? colors.brand.cyan : colors.brand.lime,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.32,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Icon
              name={state.isPro ? "infinite" : "flash"}
              size={13}
              color={colors.brand.navy}
              weight="fill"
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.brand.navy,
                letterSpacing: -0.2,
              }}
            >
              {state.isPro ? t("crit.unlimited") : t("crit.left", { n: sessionsLeft })}
            </Text>
          </LinearGradient>

          <PressScale
            onPress={loadNewDesign}
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="shuffle" size={18} color={colors.foreground} />
          </PressScale>
        </Animated.View>

        {/* Compact pinned design pill (chat started) */}
        {design && chatStarted && (
          <Animated.View
            entering={FadeInDown.duration(420).easing(SMOOTH)}
            style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 }}
          >
            <Pressable
              onPress={() => setImageOpen(true)}
              style={{
                backgroundColor: colors.card,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Image
                source={design.source}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundColor: colors.muted,
                }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.mutedForeground,
                    letterSpacing: 1.4,
                    marginBottom: 2,
                  }}
                >
                  {t("crit.todayDesign")}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground,
                    letterSpacing: -0.3,
                  }}
                >
                  {design.title}
                </Text>
              </View>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 100,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="expand-outline" size={14} color={colors.foreground} />
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: SCROLL_PAD_TOP,
            paddingBottom: SCROLL_PAD_BOTTOM,
            gap: SCROLL_GAP,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {loadingDesign && (
            <View style={{ paddingVertical: 24, gap: 12 }}>
              <Skeleton width="100%" height={220} radius={20} />
              <Skeleton width="40%" height={14} />
              <Skeleton width="85%" height={14} />
              <Skeleton width="70%" height={14} />
            </View>
          )}

          {/* Pre-chat hero block: eyebrow row + 4:5 design card +
              mentor identity row. Hidden once the user sends their
              first message and the chat takes over. */}
          {design && !chatStarted && !loadingDesign && (
            <>
              {/* Eyebrow row — clean two-pill layout: brand pill on
                  the left names the section, soft right pill nudges
                  the user that the card is tappable. */}
              <Animated.View
                entering={FadeInDown.duration(440).easing(SMOOTH).delay(60)}
                onLayout={onEyebrowLayout}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: EYEBROW_MARGIN_BOTTOM,
                  marginTop: EYEBROW_MARGIN_TOP,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 100,
                    backgroundColor: colors.brand.cyan + "1A",
                    borderWidth: 1,
                    borderColor: colors.brand.cyan + "55",
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: colors.brand.cyan,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Nunito_800ExtraBold",
                      color: colors.brand.cyanDeep,
                      letterSpacing: 1.4,
                    }}
                  >
                    {t("crit.todayDesign")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                    borderRadius: 100,
                    backgroundColor: colors.muted,
                  }}
                >
                  <Icon
                    name="expand-outline"
                    size={11}
                    color={colors.mutedForeground}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: "Nunito_800ExtraBold",
                      color: colors.mutedForeground,
                      letterSpacing: 1.2,
                    }}
                  >
                    {t("crit.tapToStudy")}
                  </Text>
                </View>
              </Animated.View>

              {/* Edge-to-edge 4:5 hero card. Image fills the card,
                  with the title overlaid on a soft bottom gradient
                  so the card stays compact on small phones. */}
              <Animated.View
                entering={FadeInDown.duration(560).easing(SMOOTH).delay(120)}
                style={{
                  alignItems: "center",
                  marginBottom: CARD_MARGIN_BOTTOM,
                }}
              >
                <Pressable onPress={() => setImageOpen(true)}>
                  <View
                    style={{
                      width: heroCardWidth,
                      height: heroCardHeight,
                      borderRadius: 24,
                      overflow: "hidden",
                      backgroundColor: colors.muted,
                      borderWidth: 1,
                      borderColor: colors.border,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 14 },
                      shadowOpacity: 0.14,
                      shadowRadius: 24,
                      elevation: 8,
                    }}
                  >
                    <Image
                      source={design.source}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />

                    {/* Expand pill (top-right) */}
                    <View
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        paddingHorizontal: 11,
                        paddingVertical: 7,
                        borderRadius: 100,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon name="expand-outline" size={13} color="#FFFFFF" />
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Nunito_800ExtraBold",
                          color: "#FFFFFF",
                          letterSpacing: 0.8,
                        }}
                      >
                        {t("critique.expand")}
                      </Text>
                    </View>

                    {/* Bottom gradient + title overlay. Metadata
                        pills sit on the darker floor of the gradient
                        (alpha 0.88 + an extra solid pill backing) so
                        10px text reads AA on bright / variable
                        photographic backgrounds. */}
                    <LinearGradient
                      colors={["rgba(7,11,28,0)", "rgba(7,11,28,0.88)"]}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 124,
                        paddingHorizontal: 16,
                        paddingTop: 30,
                        paddingBottom: 14,
                        justifyContent: "flex-end",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            paddingHorizontal: 9,
                            paddingVertical: 4,
                            borderRadius: 100,
                            backgroundColor: "rgba(7,11,28,0.55)",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.28)",
                          }}
                        >
                          <View
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: 3,
                              backgroundColor: colors.brand.cyan,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: "Nunito_800ExtraBold",
                              color: "#FFFFFF",
                              letterSpacing: 1.3,
                            }}
                          >
                            {design.difficulty.toUpperCase()}
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingHorizontal: 9,
                            paddingVertical: 4,
                            borderRadius: 100,
                            backgroundColor: "rgba(7,11,28,0.55)",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.18)",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: "Nunito_800ExtraBold",
                              color: "rgba(255,255,255,0.92)",
                              letterSpacing: 1.4,
                            }}
                          >
                            IG POST  ·  4 : 5
                          </Text>
                        </View>
                      </View>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 19,
                          fontFamily: "Nunito_800ExtraBold",
                          color: "#FFFFFF",
                          letterSpacing: -0.4,
                          lineHeight: 23,
                        }}
                      >
                        {design.title}
                      </Text>
                    </LinearGradient>
                  </View>
                </Pressable>
              </Animated.View>

              {/* Mentor identity row — bare AiBot star (no circle
                  halo). Role tag is brand cyan with a small green
                  ONLINE dot inline next to the label. */}
              <Animated.View
                entering={FadeInDown.duration(480).easing(SMOOTH).delay(220)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginTop: MENTOR_ROW_MARGIN_TOP,
                  marginBottom: MENTOR_ROW_MARGIN_BOTTOM,
                }}
              >
                <AiBot size={36} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Nunito_800ExtraBold",
                      color: colors.foreground,
                      letterSpacing: -0.3,
                    }}
                  >
                    Grafly
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Nunito_800ExtraBold",
                        color: colors.brand.cyanDeep,
                        letterSpacing: 1.2,
                      }}
                    >
                      {t("crit.designMentor")}
                    </Text>
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.success,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Nunito_800ExtraBold",
                        color: colors.success,
                        letterSpacing: 1.2,
                      }}
                    >
                      {t("crit.online")}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            // User bubbles: white text on a deep-blue gradient
            // (cyanDeep -> deeper navy-blue). White on cyanDeep is
            // ~5.0:1 which passes AA — and matches the user's
            // request for white-on-blue rather than navy-on-bright.
            // Assistant bubbles keep the soft cyan-tinted off-white
            // background with navy text (14:1+).
            const bubbleFg = isUser ? "#FFFFFF" : "#21263F";
            const isOpener = !chatStarted && i === 0 && !isUser;
            return (
              <Animated.View
                key={i}
                entering={FadeInUp.duration(360).easing(SMOOTH)}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                }}
              >
                {isUser ? (
                  <LinearGradient
                    colors={[colors.brand.cyanDeep, "#1E4D8B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 22,
                      borderBottomRightRadius: 6,
                      shadowColor: colors.brand.cyanDeep,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.32,
                      shadowRadius: 10,
                      elevation: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 21,
                        fontFamily: "Nunito_600SemiBold",
                        color: bubbleFg,
                      }}
                    >
                      {m.content}
                    </Text>
                  </LinearGradient>
                ) : (
                  // Assistant bubble. The mentor star always sits
                  // ABOVE the bubble (in the identity row pre-chat,
                  // or as a small AiBot rendered just before each
                  // assistant message once chatting). The bubble
                  // corner closest to the star is sharp → TOP-LEFT.
                  // No drop shadow on assistant bubbles per request.
                  <>
                    {!isOpener && (
                      <View style={{ marginBottom: 6, marginLeft: 2 }}>
                        <AiBot size={22} />
                      </View>
                    )}
                    <View
                      style={{
                        backgroundColor: "#F2FBFE",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 22,
                        borderTopLeftRadius: 6,
                      }}
                    >
                      <TypewriterText
                        text={m.content}
                        active={i === animateIndex}
                        onTick={() =>
                          scrollRef.current?.scrollToEnd({ animated: false })
                        }
                        onDone={() => setAnimateIndex(-1)}
                        style={{
                          fontSize: 14,
                          lineHeight: 21,
                          fontFamily: "Nunito_600SemiBold",
                          color: bubbleFg,
                        }}
                      />
                    </View>
                  </>
                )}
              </Animated.View>
            );
          })}

          {sending && (
            // Typing indicator — matches the assistant bubble:
            // small spinning star ABOVE, sharp TOP-LEFT corner on
            // the bubble, no drop shadow.
            <View style={{ alignSelf: "flex-start" }}>
              <View style={{ marginBottom: 6, marginLeft: 2 }}>
                <AiBot size={22} spinning />
              </View>
              <View
                style={{
                  backgroundColor: "#F2FBFE",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 22,
                  borderTopLeftRadius: 6,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.brand.cyanDeep,
                    letterSpacing: 0.3,
                  }}
                >
                  {t("crit.thinking")}
                </Text>
              </View>
            </View>
          )}

          {rewardedThisDesign && (
            <Animated.View
              entering={FadeIn}
              style={{ alignSelf: "center", marginTop: 6 }}
            >
              <LinearGradient
                colors={[colors.brand.lime, "#C7D11A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  shadowColor: colors.brand.lime,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 4,
                }}
              >
                <Icon
                  name="flash"
                  size={14}
                  color={colors.brand.navy}
                  weight="fill"
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.brand.navy,
                    letterSpacing: 0.3,
                  }}
                >
                  {t("crit.xpEarned", { n: XP_PER_SESSION })}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </ScrollView>

        {/* Quick start prompt chips — shown only before the user has
            typed anything and before the chat has started. Tapping a
            chip pre-fills the composer and focuses it so the user
            can keep typing or hit send right away. Disappears the
            moment any text is in the input, so it never competes
            with the conversation. */}
        {!chatStarted &&
          !limitReached &&
          !loadingDesign &&
          input.trim().length === 0 && (
            <Animated.View
              entering={FadeInUp.duration(420).easing(SMOOTH).delay(280)}
              style={{ paddingTop: 4, paddingBottom: 6 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 22,
                  marginBottom: 8,
                }}
              >
                <Icon
                  name="flash"
                  size={12}
                  color={colors.brand.cyanDeep}
                  weight="fill"
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.brand.cyanDeep,
                    letterSpacing: 1.4,
                  }}
                >
                  {t("crit.quickStart")}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: colors.border,
                    opacity: 0.55,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Nunito_800ExtraBold",
                    color: colors.mutedForeground,
                    letterSpacing: 1.2,
                  }}
                >
                  {t("crit.tapPrefill")}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                keyboardShouldPersistTaps="handled"
              >
                {QUICK_PROMPTS.map((p) => (
                  <PressScale
                    key={p.label}
                    onPress={() => {
                      setInput(p.prompt);
                      inputRef.current?.focus();
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 7,
                      paddingHorizontal: 13,
                      paddingVertical: 10,
                      borderRadius: 100,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Icon
                      name={p.icon as any}
                      size={13}
                      color={colors.brand.cyanDeep}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Nunito_800ExtraBold",
                        color: colors.foreground,
                        letterSpacing: -0.1,
                      }}
                    >
                      {p.label}
                    </Text>
                  </PressScale>
                ))}
              </ScrollView>
            </Animated.View>
          )}

        {/* Composer */}
        {limitReached ? (
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: composerLift,
              paddingTop: 8,
            }}
          >
            <PressScale
              style={{
                backgroundColor: colors.foreground,
                borderRadius: 100,
                paddingVertical: 18,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
              }}
              onPress={() => router.push("/paywall" as any)}
            >
              <Icon name="star" size={18} color={colors.background} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.background,
                }}
              >
                {t("crit.unlockPro")}
              </Text>
            </PressScale>
          </View>
        ) : (
          <View
            style={{
              paddingTop: 8,
              paddingBottom: composerLift,
              backgroundColor: colors.background,
              alignItems: "center",
            }}
          >
            <View
              style={{
                // Live shared wrapper width: getBottomBarWidth(liveW).
                // The bottom tab bar uses the same helper, so the
                // input pill and the nav stay exactly the same width
                // and both re-center as the viewport resizes.
                width: composerWidth,
                backgroundColor: colors.card,
                borderRadius: 28,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 18,
                paddingTop: 12,
                paddingBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder={t("crit.sharePlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                multiline
                textAlignVertical="center"
                style={{
                  flex: 1,
                  paddingTop: Platform.OS === "ios" ? 8 : 6,
                  paddingBottom: 6,
                  paddingHorizontal: 0,
                  fontSize: 15,
                  lineHeight: 20,
                  fontFamily: "Nunito_600SemiBold",
                  color: colors.foreground,
                  maxHeight: 140,
                  minHeight: 28,
                  ...(Platform.OS === "web"
                    ? { outlineStyle: "none" as any }
                    : {}),
                }}
              />
              {/* Send button — cyan gradient when active so the
                  primary action is the most visible thing in the
                  composer. Falls back to a flat border tint when
                  empty / sending so users get a clear "ready vs not"
                  affordance. */}
              <PressScale
                onPress={handleSend}
                disabled={!input.trim() || sending}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  overflow: "hidden",
                  shadowColor:
                    input.trim() && !sending ? colors.brand.cyan : "transparent",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: input.trim() && !sending ? 4 : 0,
                }}
              >
                {input.trim() && !sending ? (
                  <LinearGradient
                    colors={[colors.brand.cyan, colors.brand.cyanDeep]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="arrow-up"
                      size={18}
                      color={colors.brand.navy}
                      weight="bold"
                    />
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="arrow-up"
                      size={18}
                      color={colors.mutedForeground}
                    />
                  </View>
                )}
              </PressScale>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* First-time onboarding walkthrough */}
      {showOnboarding && (
        <CritiqueOnboarding
          insets={insets}
          onClose={dismissOnboarding}
          cardRect={{
            left: heroCardLeft,
            top: heroCardTop,
            width: heroCardWidth,
            height: heroCardHeight,
          }}
        />
      )}

      {/* Full-image modal */}
      <Modal
        visible={imageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setImageOpen(false)}
      >
        <Pressable
          onPress={() => setImageOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {design && (
            <Image
              source={design.source}
              style={{ width: SCREEN_W, height: SCREEN_H * 0.85 }}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            onPress={() => setImageOpen(false)}
            style={{
              position: "absolute",
              top: insets.top + 12,
              right: 16,
              padding: 12,
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: 100,
            }}
          >
            <Icon name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </View>
  );
}
