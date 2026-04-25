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
import Animated, { FadeIn, FadeInDown, FadeInUp, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
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

const XP_PER_SESSION = 20;
const COINS_PER_SESSION = 8;
const MIN_USER_TURNS_FOR_REWARD = 3;
const TYPEWRITER_SPEED_MS = 14;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const HERO_HEIGHT_FULL = Math.min(Math.round(SCREEN_H * 0.46), 460);
const HERO_HEIGHT_COMPACT = Math.min(Math.round(SCREEN_H * 0.22), 200);

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

  const heroHeight = chatStarted ? HERO_HEIGHT_COMPACT : HERO_HEIGHT_FULL;

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
          }}>
            <Text style={{
              fontSize: 12, fontFamily: "Nunito_800ExtraBold",
              color: colors.foreground, letterSpacing: -0.2,
            }}>
              {state.isPro ? "Unlimited" : `${Math.max(0, maxSessions - sessionsDone)} left`}
            </Text>
          </View>

          <PressScale
            onPress={loadNewDesign}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: colors.foreground,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name="shuffle" size={20} color={colors.background} />
          </PressScale>
        </Animated.View>

        {/* Full-bleed hero design image */}
        {design && (
          <Animated.View
            key={chatStarted ? "compact" : "full"}
            entering={FadeIn.duration(320)}
            style={{ width: SCREEN_W, height: heroHeight, position: "relative" }}
          >
            <Pressable onPress={() => setImageOpen(true)} style={{ width: "100%", height: "100%" }}>
              <Image
                source={design.source}
                style={{ width: "100%", height: "100%", backgroundColor: colors.muted }}
                resizeMode="cover"
              />
              {/* Top gradient for the EXPAND pill legibility */}
              <LinearGradient
                colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)"]}
                style={{
                  position: "absolute", left: 0, right: 0, top: 0,
                  height: 90,
                }}
              />
              {/* Strong bottom gradient for title legibility */}
              <LinearGradient
                colors={[
                  "rgba(0,0,0,0)",
                  "rgba(0,0,0,0.55)",
                  "rgba(0,0,0,0.92)",
                ]}
                locations={[0, 0.45, 1]}
                style={{
                  position: "absolute", left: 0, right: 0, bottom: 0,
                  height: chatStarted ? "80%" : "60%",
                }}
              />
              {/* Top-right expand pill */}
              <View style={{
                position: "absolute", top: 14, right: 14,
                paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100,
                backgroundColor: "rgba(0,0,0,0.55)",
                flexDirection: "row", alignItems: "center", gap: 6,
              }}>
                <Icon name="expand-outline" size={14} color="#FFFFFF" />
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: "#FFFFFF", letterSpacing: 0.8,
                }}>
                  EXPAND
                </Text>
              </View>
              {/* Bottom title overlay */}
              <View style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                paddingHorizontal: 22, paddingBottom: 18, paddingTop: 24,
              }}>
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: "#FFFFFFCC", letterSpacing: 1.5, marginBottom: 4,
                }}>
                  TODAY'S DESIGN
                </Text>
                <Text
                  numberOfLines={chatStarted ? 1 : 2}
                  style={{
                    fontSize: chatStarted ? 18 : 24,
                    fontFamily: "Nunito_800ExtraBold",
                    color: "#FFFFFF", letterSpacing: -0.5, lineHeight: chatStarted ? 22 : 28,
                  }}
                >
                  {design.title}
                </Text>
                {!chatStarted && (
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 13, fontFamily: "Nunito_600SemiBold",
                      color: "#FFFFFFCC", marginTop: 4, lineHeight: 18,
                    }}
                  >
                    {design.description}
                  </Text>
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, gap: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {loadingDesign && (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {messages.map((m, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.duration(220)}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "86%",
                backgroundColor: m.role === "user" ? colors.primary : colors.card,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 22,
                borderBottomRightRadius: m.role === "user" ? 6 : 22,
                borderBottomLeftRadius: m.role === "assistant" ? 6 : 22,
                borderWidth: m.role === "assistant" ? 1 : 0,
                borderColor: colors.border,
                shadowColor: m.role === "user" ? colors.primary : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: m.role === "user" ? 0.15 : 0.04,
                shadowRadius: 6,
                elevation: m.role === "user" ? 3 : 1,
              }}
            >
              {m.role === "assistant" ? (
                <TypewriterText
                  text={m.content}
                  active={i === animateIndex}
                  onTick={() => scrollRef.current?.scrollToEnd({ animated: false })}
                  onDone={() => setAnimateIndex(-1)}
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.foreground,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.primaryForeground,
                  }}
                >
                  {m.content}
                </Text>
              )}
            </Animated.View>
          ))}

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
                gap: 8,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={colors.mutedForeground} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                Grafly is inking
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
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: composerLift,
              backgroundColor: colors.background,
            }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 28,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 18,
                paddingTop: 12,
                paddingBottom: 12,
                flexDirection: "row",
                alignItems: "flex-end",
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
                  marginBottom: 2,
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
