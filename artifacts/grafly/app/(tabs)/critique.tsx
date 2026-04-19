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
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from "react-native";
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

  const maxSessions = state.isPro ? Infinity : 2;
  const limitReached = sessionsDone >= maxSessions;
  const userTurnCount = messages.filter((m) => m.role === "user").length;

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  function loadNewDesign() {
    setLoadingDesign(true);
    setMessages([]);
    setRewardedThisDesign(false);
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
      setMessages([...next, { role: "assistant", content: reply }]);

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
      setMessages([...next, { role: "assistant", content: `Hmm, I had trouble responding. ${msg}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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

        {/* Design image card */}
        {design && (
          <Animated.View entering={FadeIn} style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            <Pressable
              onPress={() => setImageOpen(true)}
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                overflow: "hidden",
                flexDirection: "row",
                gap: 12,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={design.source}
                style={{ width: 70, height: 70, borderRadius: 12, backgroundColor: colors.muted }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }} numberOfLines={1}>
                  {design.title}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }} numberOfLines={2}>
                  Tap to view full size
                </Text>
              </View>
              <Ionicons name="expand-outline" size={20} color={colors.mutedForeground} />
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
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: "Nunito_600SemiBold",
                  color: m.role === "user" ? colors.primaryForeground : colors.foreground,
                }}
              >
                {m.content}
              </Text>
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
          <View style={{ paddingHorizontal: 20, paddingBottom: paddingBottom, paddingTop: 8 }}>
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
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: paddingBottom,
              backgroundColor: colors.background,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your thought..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 22,
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: 15,
                fontFamily: "Nunito_600SemiBold",
                color: colors.foreground,
                maxHeight: 120,
                minHeight: 44,
              }}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || sending}
              style={{
                backgroundColor: input.trim() && !sending ? colors.primary : colors.muted,
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.85}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={input.trim() && !sending ? colors.primaryForeground : colors.mutedForeground}
              />
            </TouchableOpacity>
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
