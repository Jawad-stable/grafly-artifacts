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
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import {
  sendCritiqueMessage,
  type ChatMessage,
} from "@/services/aiCritique";
import { pickRandomLocalDesign, type LocalDesign } from "@/data/localDesigns";
import { GraflyMascot } from "@/components/GraflyMascot";

const XP_PER_SESSION = 20;
const COINS_PER_SESSION = 8;
const MIN_USER_TURNS_FOR_REWARD = 3;
// ms per character for the writing animation (lower = faster)
const TYPEWRITER_SPEED_MS = 14;

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
  // Index of the last assistant message that should run the writing animation.
  // -1 means no animation (e.g. the opener, or messages that already finished).
  const [animateIndex, setAnimateIndex] = useState(-1);

  const maxSessions = state.isPro ? Infinity : 2;
  const limitReached = sessionsDone >= maxSessions;
  const userTurnCount = messages.filter((m) => m.role === "user").length;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  // Match the tab bar layout in app/(tabs)/_layout.tsx so the composer
  // always clears the floating tab bar with breathing room.
  const tabBottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 10);
  const tabBarHeight = 62 + tabBottomPad;
  const tabBarBottomOffset = 12; // tabBarStyle.bottom in _layout.tsx
  const composerLift = tabBarHeight + tabBarBottomOffset + 12;

  function loadNewDesign() {
    setLoadingDesign(true);
    setMessages([]);
    setRewardedThisDesign(false);
    setAnimateIndex(-1);
    const d = pickRandomLocalDesign();
    setDesign(d);
    const opener = `Take a look at this design: ${d.title}. What is the first thing your eye lands on, and why do you think the designer made that choice?`;
    setMessages([{ role: "assistant", content: opener }]);
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
      // Animate this freshly arrived assistant message with a writing effect.
      setAnimateIndex(updated.length - 1);

      // Reward XP once per design after MIN_USER_TURNS_FOR_REWARD exchanges
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
        {/* Header */}
        <View style={{ paddingTop: paddingTop + 8, paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <GraflyMascot state={sending ? "think" : "idle"} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              Design Chat
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              {state.isPro ? "Unlimited sessions" : `${Math.max(0, maxSessions - sessionsDone)} of ${maxSessions} sessions left`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={loadNewDesign}
            style={{ backgroundColor: colors.card, padding: 10, borderRadius: 100 }}
            activeOpacity={0.8}
          >
            <Ionicons name="shuffle" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Design image card — shrinks to a compact strip once the chat starts */}
        {design && (
          <Animated.View
            key={userTurnCount > 0 ? "mini" : "full"}
            entering={FadeIn.duration(220)}
            style={{ paddingHorizontal: 20, paddingBottom: 12 }}
          >
            <Pressable
              onPress={() => setImageOpen(true)}
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                overflow: "hidden",
                flexDirection: userTurnCount > 0 ? "row" : "column",
                alignItems: userTurnCount > 0 ? "center" : "stretch",
              }}
            >
              <Image
                source={design.source}
                style={
                  userTurnCount > 0
                    ? { width: 64, height: 64, backgroundColor: colors.muted }
                    : { width: "100%", height: 220, backgroundColor: colors.muted }
                }
                resizeMode="cover"
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: userTurnCount > 0 ? 10 : 12,
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: userTurnCount > 0 ? 13 : 15,
                      fontFamily: "Nunito_800ExtraBold",
                      color: colors.foreground,
                    }}
                    numberOfLines={1}
                  >
                    {design.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: userTurnCount > 0 ? 11 : 12,
                      fontFamily: "Nunito_600SemiBold",
                      color: colors.mutedForeground,
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    Tap to view full size
                  </Text>
                </View>
                <Ionicons name="expand-outline" size={userTurnCount > 0 ? 18 : 20} color={colors.mutedForeground} />
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: 10 }}
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
                maxWidth: "85%",
                backgroundColor: m.role === "user" ? colors.primary : colors.card,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 18,
                borderBottomRightRadius: m.role === "user" ? 4 : 18,
                borderBottomLeftRadius: m.role === "assistant" ? 4 : 18,
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
                    lineHeight: 20,
                    fontFamily: "Nunito_600SemiBold",
                    color: colors.foreground,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
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
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 18,
                borderBottomLeftRadius: 4,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={colors.mutedForeground} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                Grafly is thinking
              </Text>
            </View>
          )}

          {rewardedThisDesign && (
            <Animated.View entering={FadeIn} style={{ alignSelf: "center", marginTop: 4, backgroundColor: colors.success + "20", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 }}>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.success }}>
                +{XP_PER_SESSION} XP earned
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Composer */}
        {limitReached ? (
          <View style={{ paddingHorizontal: 20, paddingBottom: composerLift, paddingTop: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.pink + "20",
                borderRadius: colors.radius,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={() => router.push("/paywall" as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="star" size={18} color={colors.pink} />
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.pink }}>
                Unlock Pro for unlimited sessions
              </Text>
            </TouchableOpacity>
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
                borderRadius: 26,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 16,
                paddingTop: 10,
                paddingBottom: 10,
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 8,
                ...(Platform.OS === "web"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                    }
                  : {}),
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
              <TouchableOpacity
                onPress={handleSend}
                disabled={!input.trim() || sending}
                style={{
                  backgroundColor:
                    input.trim() && !sending ? colors.foreground : colors.border,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="arrow-up"
                  size={18}
                  color={
                    input.trim() && !sending ? colors.background : colors.mutedForeground
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Full-image modal */}
      <Modal visible={imageOpen} transparent animationType="fade" onRequestClose={() => setImageOpen(false)}>
        <Pressable
          onPress={() => setImageOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.92)", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          {design && (
            <Image
              source={design.source}
              style={{ width: "100%", height: "80%" }}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            onPress={() => setImageOpen(false)}
            style={{ position: "absolute", top: insets.top + 12, right: 16, padding: 10, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 100 }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          {design && (
            <View style={{ position: "absolute", bottom: insets.bottom + 24, left: 24, right: 24 }}>
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: "#fff", textAlign: "center" }}>
                {design.title}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: 4 }}>
                {design.description}
              </Text>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
