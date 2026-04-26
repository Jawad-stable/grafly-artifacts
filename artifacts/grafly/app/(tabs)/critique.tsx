import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  type LayoutChangeEvent,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  interpolate,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import {
  sendCritiqueMessage,
  type ChatMessage,
} from "@/services/aiCritique";
import { pickRandomLocalDesign, type LocalDesign } from "@/data/localDesigns";
import { PressScale } from "@/components/PressScale";
import { BOTTOM_BAR_WIDTH } from "@/constants/layout";
import { AI_BOT } from "@/constants/assets";

const SMOOTH = Easing.out(Easing.cubic);

// AI bot avatar. Renders the blue starfish/fan logo. When `spinning` is true
// it rotates continuously like a fan, used to signal that the AI is thinking.
function AiBot({ size, spinning = false }: { size: number; spinning?: boolean }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(rotation);
    if (spinning) {
      // Reset to 0 on the UI thread, then start a continuous repeating
      // rotation. Linear easing so the spin is even and fan-like.
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 900, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      // Ease back to the rest position when the bot stops thinking.
      rotation.value = withTiming(0, { duration: 220, easing: SMOOTH });
    }
    return () => {
      cancelAnimation(rotation);
    };
  }, [spinning]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Wrap the Image in an Animated.View — Animated.View reliably honours
  // transform styles on every platform (including web), whereas
  // Animated.Image can drop transforms on some renderers.
  return (
    <Animated.View
      style={[
        { width: size, height: size, alignItems: "center", justifyContent: "center" },
        animStyle,
      ]}
    >
      <Image
        source={AI_BOT}
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    </Animated.View>
  );
}

const XP_PER_SESSION = 20;
const COINS_PER_SESSION = 8;
const MIN_USER_TURNS_FOR_REWARD = 3;
const TYPEWRITER_SPEED_MS = 14;

const ONBOARDING_KEY = "grafly:critique_onboarding_seen_v1";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const OPENER_TEMPLATES: Array<(title: string) => string> = [
  (t) => `What is the first thing your eye lands on in "${t}", and why do you think the designer made that choice?`,
  (t) => `Spend a few seconds with "${t}". What feeling does it give you, and which visual element is doing most of the work?`,
  (t) => `If you had to describe "${t}" in three words, what would they be? Pick one and tell me why.`,
  (t) => `Looking at "${t}", what is the clearest visual hierarchy decision the designer made? Where does your eye go second?`,
  (t) => `What problem do you think "${t}" is trying to solve for the user, and how does the layout support that?`,
  (t) => `Critique "${t}" like a friendly mentor. What is one thing that works really well, and one thing you would push further?`,
  (t) => `Imagine you opened "${t}" for the first time. What action does the screen invite you to take, and how do you know?`,
  (t) => `In "${t}", how do color and typography work together to set the mood? Which one is leading?`,
  (t) => `What design principle (contrast, balance, rhythm, hierarchy) is most visible in "${t}"? Show me where.`,
  (t) => `If "${t}" had to lose one element to feel cleaner, which would you cut and why?`,
];

function pickOpener(title: string): string {
  const fn = OPENER_TEMPLATES[Math.floor(Math.random() * OPENER_TEMPLATES.length)];
  return fn(title);
}

interface TypewriterTextProps {
  text: string;
  active: boolean;
  style: any;
  onTick?: () => void;
  onDone?: () => void;
}

function TypewriterText({ text, active, style, onTick, onDone }: TypewriterTextProps) {
  const [shown, setShown] = useState(active ? "" : text);
  const indexRef = useRef(0);
  const tickRef = useRef(onTick);
  const doneRef = useRef(onDone);
  tickRef.current = onTick;
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setShown(text);
      return;
    }
    indexRef.current = 0;
    setShown("");
    const timer = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setShown(text);
        clearInterval(timer);
        doneRef.current?.();
        return;
      }
      setShown(text.slice(0, indexRef.current));
      tickRef.current?.();
    }, TYPEWRITER_SPEED_MS);
    return () => clearInterval(timer);
  }, [text, active]);

  return (
    <Text style={style}>
      {shown}
      {active && shown.length < text.length ? (
        <Text style={{ opacity: 0.55 }}>▍</Text>
      ) : null}
    </Text>
  );
}

type OnboardStep = {
  title: string;
  body: string;
  ring?: { left: number; top: number; w: number; h: number; radius: number };
  tooltip: { top?: number; bottom?: number };
};

function CritiqueOnboarding({
  insets,
  onClose,
  cardRect,
}: {
  insets: { top: number; bottom: number };
  onClose: () => void;
  cardRect: { left: number; top: number; width: number; height: number };
}) {
  const colors = useColors();
  const [step, setStep] = useState(0);

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, []);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.18]) }],
    opacity: interpolate(pulse.value, [0, 1], [0.95, 0.45]),
  }));

  const headerTop = insets.top + (Platform.OS === "web" ? 67 : 0) + 10;
  const tabBottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 62 + tabBottomPad;
  const composerY = SCREEN_H - tabBarHeight - 12 - 70;

  // Tooltip for the card step sits below the card, with a small gap.
  const cardTooltipTop = Math.min(
    cardRect.top + cardRect.height + 18,
    SCREEN_H - 280,
  );

  const STEPS: OnboardStep[] = [
    {
      title: "Welcome to Critique",
      body: "Get personalized design feedback from Grafly. Here are a few quick tips to get you started.",
      tooltip: { top: SCREEN_H * 0.32 },
    },
    {
      title: "Tap shuffle for a fresh design",
      body: "The shuffle button at the top right loads a brand new design any time you want something new to critique.",
      ring: { left: SCREEN_W - 60, top: headerTop + 18, w: 44, h: 44, radius: 100 },
      tooltip: { top: headerTop + 90 },
    },
    {
      title: "Tap the photo to expand",
      body: "Tap any design image to open it full-screen and study every pixel up close.",
      ring: {
        left: cardRect.left,
        top: cardRect.top,
        w: cardRect.width,
        h: cardRect.height,
        radius: 24,
      },
      tooltip: { top: cardTooltipTop },
    },
    {
      title: "Chat to earn XP",
      body: `Type your observations in the message box. Three thoughtful exchanges earn you +${XP_PER_SESSION} XP and ${COINS_PER_SESSION} coins.`,
      ring: { left: 16, top: composerY, w: SCREEN_W - 32, h: 64, radius: 28 },
      tooltip: { bottom: tabBarHeight + 120 },
    },
  ];

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Dim backdrop — tap-through disabled to focus on the tooltip */}
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(7, 11, 28, 0.78)",
        }}
      />

      {/* Pulsing highlight ring */}
      {current.ring && (
        <Animated.View
          pointerEvents="none"
          style={[
            ringStyle,
            {
              position: "absolute",
              left: current.ring.left,
              top: current.ring.top,
              width: current.ring.w,
              height: current.ring.h,
              borderRadius: current.ring.radius,
              borderWidth: 3,
              borderColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 14,
              elevation: 8,
            },
          ]}
        />
      )}

      {/* Step counter chip */}
      <Animated.View
        key={`chip-${step}`}
        entering={FadeIn.duration(220)}
        style={{
          position: "absolute",
          top: insets.top + 14,
          alignSelf: "center",
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 100,
            backgroundColor: "rgba(255,255,255,0.16)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.22)",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Nunito_800ExtraBold",
              color: "#FFFFFF",
              letterSpacing: 1.4,
            }}
          >
            {step + 1} OF {STEPS.length}
          </Text>
        </View>
      </Animated.View>

      {/* Tooltip card */}
      <Animated.View
        key={`card-${step}`}
        entering={FadeInUp.duration(360).easing(Easing.out(Easing.cubic))}
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          ...(current.tooltip.top !== undefined
            ? { top: current.tooltip.top }
            : { bottom: current.tooltip.bottom }),
          backgroundColor: colors.card,
          borderRadius: 22,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.35,
          shadowRadius: 30,
          elevation: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 100,
              backgroundColor: colors.accent + "26",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="bulb" size={16} color={colors.accent} />
          </View>
          <Text
            style={{
              fontSize: 17,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground,
              letterSpacing: -0.3,
              flex: 1,
            }}
          >
            {current.title}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily: "Nunito_600SemiBold",
            color: colors.mutedForeground,
            marginBottom: 18,
          }}
        >
          {current.body}
        </Text>

        {/* Step dots */}
        <View style={{ flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 14 }}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === step ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === step ? colors.accent : colors.border,
              }}
            />
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {!isLast && (
            <Pressable
              onPress={onClose}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground,
                  letterSpacing: 0.3,
                }}
              >
                Skip
              </Text>
            </Pressable>
          )}
          <View style={{ flex: 1 }} />
          <PressScale
            onPress={next}
            style={{
              backgroundColor: colors.foreground,
              paddingHorizontal: 22,
              paddingVertical: 13,
              borderRadius: 100,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.background,
                letterSpacing: 0.2,
              }}
            >
              {isLast ? "Got it, let's go" : "Next"}
            </Text>
            <Icon
              name={isLast ? "checkmark" : "arrow-forward"}
              size={15}
              color={colors.background}
            />
          </PressScale>
        </View>
      </Animated.View>
    </View>
  );
}

export default function CritiqueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, addXP, addCoins } = useGame();

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
  const [animateIndex, setAnimateIndex] = useState(-1);

  const maxSessions = state.isPro ? Infinity : 2;
  const limitReached = sessionsDone >= maxSessions;
  const userTurnCount = messages.filter((m) => m.role === "user").length;
  const chatStarted = userTurnCount > 0;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const tabBottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 62 + tabBottomPad;
  const tabBarBottomOffset = 12;
  const composerLift = tabBarHeight + tabBarBottomOffset + 12;

  // Compact 4:5 social-media style card. We size the card so the entire
  // pre-chat view (header + eyebrow + card + mentor row + opener bubble
  // + composer) fits on screen without forcing a scroll. The card width
  // is the smaller of "edge-to-edge minus padding" and "what fits in
  // the available vertical space at a 4:5 aspect", then the height is
  // derived from that width so the aspect stays exactly 4:5.
  //
  // The heights of the surrounding blocks (header, eyebrow, mentor row,
  // opener bubble) are MEASURED at runtime via onLayout instead of being
  // hardcoded estimates. That way the layout self-corrects on uncommon
  // phone sizes, with system text scaling, or whenever any block grows
  // (e.g. a longer opener message). The composer is implicitly accounted
  // for: the ScrollView is `flex: 1`, so its measured height already
  // excludes the header above and composer below.
  //
  // The static spacing constants below (paddings / margins / gaps) are
  // pixel values that don't change with content / font scaling, so they
  // remain literals — they have to match the actual styles applied
  // inside the ScrollView's pre-chat content tree.
  const SCROLL_PAD_TOP = 14; // ScrollView contentContainerStyle.paddingTop
  const SCROLL_PAD_BOTTOM = 12; // ScrollView contentContainerStyle.paddingBottom
  const SCROLL_GAP = 10; // ScrollView contentContainerStyle.gap (between siblings)
  const EYEBROW_MARGIN_TOP = -4;
  const EYEBROW_MARGIN_BOTTOM = 12;
  const CARD_MARGIN_BOTTOM = 10;
  const MENTOR_ROW_MARGIN_TOP = 6;
  const MENTOR_ROW_MARGIN_BOTTOM = 4;
  // Sum of every static piece of vertical spacing inside the ScrollView
  // that surrounds the four measured blocks (eyebrow, card, mentor row,
  // opener bubble). Gap applies between every adjacent pair of children.
  const STATIC_SCROLL_OVERHEAD =
    SCROLL_PAD_TOP +
    EYEBROW_MARGIN_TOP +
    EYEBROW_MARGIN_BOTTOM +
    SCROLL_GAP + // eyebrow → card wrapper
    CARD_MARGIN_BOTTOM +
    SCROLL_GAP + // card wrapper → mentor row
    MENTOR_ROW_MARGIN_TOP +
    MENTOR_ROW_MARGIN_BOTTOM +
    SCROLL_GAP + // mentor row → opener bubble
    SCROLL_PAD_BOTTOM;

  // Sensible defaults so the very first paint (before onLayout has fired)
  // sizes the card close to its final value. Once measurements come in,
  // the card snaps to the exact correct size.
  const HEADER_BLOCK_H_DEFAULT = 70;
  const EYEBROW_H_DEFAULT = 22;
  const MENTOR_ROW_H_DEFAULT = 50;
  const OPENER_BUBBLE_H_DEFAULT = 96;
  const COMPOSER_BLOCK_H_DEFAULT = 86;

  const [headerH, setHeaderH] = useState(HEADER_BLOCK_H_DEFAULT);
  const [scrollH, setScrollH] = useState(0);
  const [eyebrowH, setEyebrowH] = useState(EYEBROW_H_DEFAULT);
  const [mentorRowH, setMentorRowH] = useState(MENTOR_ROW_H_DEFAULT);
  const [openerBubbleH, setOpenerBubbleH] = useState(OPENER_BUBBLE_H_DEFAULT);

  // First-paint fallback for the available ScrollView height: derived from
  // the screen dims and the default header / composer estimates. As soon
  // as the ScrollView's onLayout fires, we use the real measured value.
  const fallbackScrollH = Math.max(
    0,
    SCREEN_H -
      paddingTop -
      HEADER_BLOCK_H_DEFAULT -
      composerLift -
      COMPOSER_BLOCK_H_DEFAULT,
  );
  const effectiveScrollH = scrollH > 0 ? scrollH : fallbackScrollH;

  const cardWidthByEdge = SCREEN_W - 40; // ScrollView paddingHorizontal: 20 each side
  const cardHeightByEdge = cardWidthByEdge * (5 / 4);
  // How much height the card itself can occupy inside the ScrollView once
  // every other block above/below it (and their static spacing) is
  // subtracted from the measured ScrollView height.
  const cardHeightByHeight = Math.max(
    0,
    effectiveScrollH -
      STATIC_SCROLL_OVERHEAD -
      eyebrowH -
      mentorRowH -
      openerBubbleH,
  );
  // Soft minimum so on very tall screens the card still has visual presence.
  // We deliberately cap the floor at `cardHeightByHeight` so it CAN'T force
  // the content to overflow / scroll — on the smallest phones with large
  // text scaling, the card is allowed to shrink below this minimum so the
  // "always fits" guarantee wins over visual-presence.
  const MIN_CARD_W = 140;
  const MIN_CARD_H = MIN_CARD_W * (5 / 4);
  const safeMinH = Math.min(MIN_CARD_H, cardHeightByHeight);
  const heroCardHeight = Math.round(
    Math.max(safeMinH, Math.min(cardHeightByEdge, cardHeightByHeight)),
  );
  const heroCardWidth = Math.round(heroCardHeight * (4 / 5));
  // Single source of truth for where the card actually sits on screen.
  // Used by the onboarding ring so its highlight stays glued to the card
  // even when any block above changes height (text scaling, longer text).
  const heroCardTop =
    headerH +
    SCROLL_PAD_TOP +
    EYEBROW_MARGIN_TOP +
    eyebrowH +
    EYEBROW_MARGIN_BOTTOM +
    SCROLL_GAP;
  const heroCardLeft = Math.round((SCREEN_W - heroCardWidth) / 2);

  // Stable layout callbacks. Each one only triggers a state update when
  // the new height differs from the previous by more than half a pixel,
  // to avoid render loops from sub-pixel layout jitter.
  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setHeaderH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);
  const onScrollLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setScrollH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);
  const onEyebrowLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setEyebrowH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);
  const onMentorRowLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setMentorRowH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);
  const onOpenerBubbleLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setOpenerBubbleH((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);
  const sessionsLeft = Math.max(0, maxSessions - sessionsDone);

  function loadNewDesign() {
    setLoadingDesign(true);
    setMessages([]);
    setRewardedThisDesign(false);
    setAnimateIndex(-1);
    const d = pickRandomLocalDesign();
    setDesign(d);
    setMessages([{ role: "assistant", content: pickOpener(d.title) }]);
    setLoadingDesign(false);
  }

  useEffect(() => {
    loadNewDesign();
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending || limitReached || !design) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const reply = await sendCritiqueMessage({
        designTitle: design.title,
        designDescription: design.description,
        messages: next,
      });
      const updated: ChatMessage[] = [...next, { role: "assistant", content: reply }];
      setMessages(updated);
      setAnimateIndex(updated.length - 1);

      const newUserTurns = next.filter((m) => m.role === "user").length;
      if (!rewardedThisDesign && newUserTurns >= MIN_USER_TURNS_FOR_REWARD) {
        addXP(XP_PER_SESSION);
        addCoins(COINS_PER_SESSION);
        setSessionsDone((s) => s + 1);
        setRewardedThisDesign(true);
      }
    } catch (err: any) {
      const msg = err?.message ?? "Could not reach the AI mentor.";
      const updated: ChatMessage[] = [
        ...next,
        { role: "assistant", content: `Hmm, I had trouble responding. ${msg}` },
      ];
      setMessages(updated);
      setAnimateIndex(updated.length - 1);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: state.isPro ? colors.success : colors.accent,
              }} />
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground, letterSpacing: 1.4,
              }}>
                AI MENTOR
              </Text>
            </View>
            <Text style={{
              fontSize: 30, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, letterSpacing: -0.8, lineHeight: 34,
              marginTop: 2,
            }}>
              Critique
            </Text>
          </View>

          <View style={{
            paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 100, backgroundColor: colors.card,
            borderWidth: 1, borderColor: colors.border,
            flexDirection: "row", alignItems: "center", gap: 6,
          }}>
            <Icon
              name={state.isPro ? "infinite" : "flash"}
              size={13}
              color={state.isPro ? colors.success : colors.accent}
            />
            <Text style={{
              fontSize: 12, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, letterSpacing: -0.2,
            }}>
              {state.isPro ? "Unlimited" : `${sessionsLeft} left`}
            </Text>
          </View>

          <PressScale
            onPress={loadNewDesign}
            style={{
              width: 40, height: 40, borderRadius: 100,
              backgroundColor: colors.card,
              borderWidth: 1, borderColor: colors.border,
              alignItems: "center", justifyContent: "center",
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
                style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: colors.muted }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 10, fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground, letterSpacing: 1.4, marginBottom: 2,
                }}>
                  TODAY'S DESIGN
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14, fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground, letterSpacing: -0.3,
                  }}
                >
                  {design.title}
                </Text>
              </View>
              <View style={{
                width: 32, height: 32, borderRadius: 100,
                backgroundColor: colors.background,
                borderWidth: 1, borderColor: colors.border,
                alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="expand-outline" size={14} color={colors.foreground} />
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          onLayout={onScrollLayout}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: SCROLL_PAD_TOP, paddingBottom: SCROLL_PAD_BOTTOM, gap: SCROLL_GAP }}
          keyboardShouldPersistTaps="handled"
        >
          {loadingDesign && (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {/* Compact 4:5 social-media card (chat not started). Sized so
              the entire pre-chat view fits without scrolling — the
              title sits on a gradient overlay on the image itself
              instead of in a separate body block, and the longer
              description has been moved into the expand modal. */}
          {design && !chatStarted && !loadingDesign && (
            <>
              {/* Eyebrow row */}
              <Animated.View
                entering={FadeInDown.duration(440).easing(SMOOTH).delay(60)}
                onLayout={onEyebrowLayout}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: EYEBROW_MARGIN_BOTTOM, marginTop: EYEBROW_MARGIN_TOP }}
              >
                <View style={{
                  paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100,
                  backgroundColor: colors.primary + "1F",
                }}>
                  <Text style={{
                    fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                    color: colors.primary, letterSpacing: 1.4,
                  }}>
                    TODAY'S DESIGN
                  </Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground, letterSpacing: 1.2,
                }}>
                  4 : 5  •  SOCIAL
                </Text>
              </Animated.View>

              {/* 4:5 card, centered. Image fills the entire card, with
                  the title overlaid on a soft bottom gradient so the
                  card stays compact. */}
              <Animated.View
                entering={FadeInDown.duration(560).easing(SMOOTH).delay(120)}
                style={{ alignItems: "center", marginBottom: CARD_MARGIN_BOTTOM }}
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
                    <View style={{
                      position: "absolute", top: 12, right: 12,
                      paddingHorizontal: 11, paddingVertical: 7, borderRadius: 100,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      flexDirection: "row", alignItems: "center", gap: 6,
                    }}>
                      <Icon name="expand-outline" size={13} color="#FFFFFF" />
                      <Text style={{
                        fontSize: 10, fontFamily: "Nunito_800ExtraBold",
                        color: "#FFFFFF", letterSpacing: 0.8,
                      }}>
                        EXPAND
                      </Text>
                    </View>

                    {/* Bottom gradient + title overlay */}
                    <LinearGradient
                      colors={["rgba(7,11,28,0)", "rgba(7,11,28,0.85)"]}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 110,
                        paddingHorizontal: 16,
                        paddingTop: 28,
                        paddingBottom: 14,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text style={{
                        fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                        color: "rgba(255,255,255,0.7)", letterSpacing: 1.4,
                        marginBottom: 4,
                      }}>
                        {design.difficulty.toUpperCase()}  •  IG POST
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 18, fontFamily: "Nunito_800ExtraBold",
                          color: "#FFFFFF", letterSpacing: -0.4, lineHeight: 22,
                        }}
                      >
                        {design.title}
                      </Text>
                    </LinearGradient>
                  </View>
                </Pressable>
              </Animated.View>

              {/* Mentor identity row above the opener — compact */}
              <Animated.View
                entering={FadeInDown.duration(480).easing(SMOOTH).delay(220)}
                onLayout={onMentorRowLayout}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: MENTOR_ROW_MARGIN_TOP, marginBottom: MENTOR_ROW_MARGIN_BOTTOM }}
              >
                <AiBot size={28} />
                <View>
                  <Text style={{
                    fontSize: 13, fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground, letterSpacing: -0.2,
                  }}>
                    Grafly
                  </Text>
                  <Text style={{
                    fontSize: 10, fontFamily: "Nunito_800ExtraBold",
                    color: colors.mutedForeground, letterSpacing: 1,
                  }}>
                    DESIGN MENTOR
                  </Text>
                </View>
              </Animated.View>
            </>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const bubbleBg = isUser ? "#00A4FA" : "#FFFFFF";
            const bubbleFg = isUser ? "#FFFFFF" : "#21263F";
            // The first assistant message in the pre-chat view IS the
            // opener bubble — measure its real height so the card sizing
            // math self-corrects when the opener text is long / scaled.
            const isOpener = !chatStarted && i === 0 && !isUser;
            return (
              <Animated.View
                key={i}
                entering={FadeInUp.duration(360).easing(SMOOTH)}
                onLayout={isOpener ? onOpenerBubbleLayout : undefined}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  backgroundColor: bubbleBg,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 22,
                  borderBottomRightRadius: isUser ? 6 : 22,
                  borderBottomLeftRadius: !isUser ? 6 : 22,
                  borderWidth: 0,
                  shadowColor: isUser ? "#00A4FA" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isUser ? 0.15 : 0.06,
                  shadowRadius: 6,
                  elevation: isUser ? 3 : 1,
                }}
              >
                {!isUser ? (
                  <TypewriterText
                    text={m.content}
                    active={i === animateIndex}
                    onTick={() => scrollRef.current?.scrollToEnd({ animated: false })}
                    onDone={() => setAnimateIndex(-1)}
                    style={{
                      fontSize: 14,
                      lineHeight: 21,
                      fontFamily: "Nunito_600SemiBold",
                      color: bubbleFg,
                    }}
                  />
                ) : (
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
                )}
              </Animated.View>
            );
          })}

          {sending && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.card,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 22,
                borderBottomLeftRadius: 6,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <AiBot size={22} spinning />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                Grafly is Graflying ...
              </Text>
            </View>
          )}

          {rewardedThisDesign && (
            <Animated.View entering={FadeIn} style={{
              alignSelf: "center", marginTop: 6,
              backgroundColor: colors.success + "20",
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100,
              flexDirection: "row", alignItems: "center", gap: 6,
            }}>
              <Icon name="flash" size={14} color={colors.success} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.success, letterSpacing: 0.2 }}>
                +{XP_PER_SESSION} XP earned
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Composer */}
        {limitReached ? (
          <View style={{ paddingHorizontal: 20, paddingBottom: composerLift, paddingTop: 8 }}>
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
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.background }}>
                Unlock Pro for unlimited sessions
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
                // Single shared wrapper width: BOTTOM_BAR_WIDTH from
                // constants/layout.ts. The bottom tab bar uses the same
                // constant, so the input pill and the nav line up exactly.
                width: BOTTOM_BAR_WIDTH,
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
                value={input}
                onChangeText={setInput}
                placeholder="Message Grafly..."
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
                  ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
                }}
              />
              <PressScale
                onPress={handleSend}
                disabled={!input.trim() || sending}
                style={{
                  backgroundColor:
                    input.trim() && !sending ? colors.foreground : colors.border,
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
                  color={
                    input.trim() && !sending ? colors.background : colors.mutedForeground
                  }
                />
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
      <Modal visible={imageOpen} transparent animationType="fade" onRequestClose={() => setImageOpen(false)}>
        <Pressable
          onPress={() => setImageOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)", alignItems: "center", justifyContent: "center" }}
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
              position: "absolute", top: insets.top + 12, right: 16,
              padding: 12, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 100,
            }}
          >
            <Icon name="close" size={22} color="#fff" />
          </TouchableOpacity>
          {design && (
            <View style={{ position: "absolute", bottom: insets.bottom + 28, left: 24, right: 24 }}>
              <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: "#fff", textAlign: "center", letterSpacing: -0.4 }}>
                {design.title}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: 6, lineHeight: 19 }}>
                {design.description}
              </Text>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
