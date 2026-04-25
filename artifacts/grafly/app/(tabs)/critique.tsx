import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";
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
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  // Hero image: taller, capped higher, so the today's-design card feels
  // like a true featured slab rather than a thumbnail with a body block.
  const heroCardImageHeight = Math.min(Math.round(SCREEN_H * 0.44), 440);
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
            style={{ paddingHorizontal: 14, paddingTop: 4, paddingBottom: 8 }}
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
          contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 14, paddingBottom: 12, gap: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {loadingDesign && (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {/* Full hero card (chat not started) */}
          {design && !chatStarted && !loadingDesign && (
            <>
              {/* Eyebrow row matching tree.tsx pattern */}
              <Animated.View
                entering={FadeInDown.duration(440).easing(SMOOTH).delay(60)}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14, marginTop: -4 }}
              >
                <View style={{
                  paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100,
                  backgroundColor: colors.accent + "26",
                }}>
                  <Text style={{
                    fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                    color: colors.accent, letterSpacing: 1.4,
                  }}>
                    TODAY'S DESIGN
                  </Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: colors.mutedForeground, letterSpacing: 1.2,
                }}>
                  DAILY DROP
                </Text>
              </Animated.View>

              {/* Image-on-top card */}
              <Animated.View
                entering={FadeInDown.duration(560).easing(SMOOTH).delay(120)}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.08,
                  shadowRadius: 22,
                  elevation: 6,
                }}
              >
                <Pressable onPress={() => setImageOpen(true)}>
                  <View style={{ width: "100%", height: heroCardImageHeight, position: "relative" }}>
                    <Image
                      source={design.source}
                      style={{ width: "100%", height: "100%", backgroundColor: colors.muted }}
                      resizeMode="cover"
                    />
                    {/* Refined expand pill */}
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
                  </View>
                </Pressable>
                {/* Card body — slightly more breathing room and a larger
                    title so the body holds its own next to the bigger
                    hero image above. */}
                <View style={{ paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18 }}>
                  <Text style={{
                    fontSize: 22, fontFamily: "Nunito_800ExtraBold",
                    color: colors.foreground, letterSpacing: -0.6, lineHeight: 26,
                  }}>
                    {design.title}
                  </Text>
                  <Text style={{
                    fontSize: 14, fontFamily: "Nunito_600SemiBold",
                    color: colors.mutedForeground, marginTop: 8, lineHeight: 20,
                  }}>
                    {design.description}
                  </Text>
                  {/* Hint footer */}
                  <View style={{
                    marginTop: 16, paddingTop: 14,
                    borderTopWidth: 1, borderTopColor: colors.border,
                    flexDirection: "row", alignItems: "center", gap: 8,
                  }}>
                    <Icon name="flash" size={14} color={colors.accent} />
                    <Text style={{
                      fontSize: 12, fontFamily: "Nunito_600SemiBold",
                      color: colors.mutedForeground, flex: 1,
                    }}>
                      Chat with Grafly to earn +{XP_PER_SESSION} XP
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* Mentor identity row above the opener */}
              <Animated.View
                entering={FadeInDown.duration(480).easing(SMOOTH).delay(220)}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 22, marginBottom: 6 }}
              >
                <View style={{
                  width: 32, height: 32, borderRadius: 100,
                  backgroundColor: colors.primary + "1A",
                  borderWidth: 1, borderColor: colors.primary + "40",
                  alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <AiBot size={22} />
                </View>
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
            return (
              <Animated.View
                key={i}
                entering={FadeInUp.duration(360).easing(SMOOTH)}
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
