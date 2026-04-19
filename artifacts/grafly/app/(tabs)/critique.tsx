import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { submitCritique, type CritiqueFeedback } from "@/services/aiCritique";
import { voiceService } from "@/services/voiceService";

const CRITIQUE_PROMPTS = [
  {
    id: "p1",
    title: "Airbnb's Onboarding Flow",
    prompt:
      "Analyze Airbnb's mobile app onboarding experience. Consider the visual hierarchy, use of whitespace, typographic choices, color system, and how the design communicates trust and safety to first-time users. Evaluate what design decisions support or undermine the user's confidence in the platform.",
    image: "🏠",
  },
  {
    id: "p2",
    title: "Spotify's Now Playing Screen",
    prompt:
      "Critique the design of Spotify's Now Playing screen. Examine the balance between the album artwork and UI controls, the information hierarchy, contrast ratios, touch target sizing, and how the overall design creates an immersive listening experience while remaining functional.",
    image: "🎵",
  },
  {
    id: "p3",
    title: "Apple's App Store Card Design",
    prompt:
      "Evaluate the design language of Apple App Store's editorial cards. Analyze the typographic hierarchy, imagery usage, color application, grid structure, and how the editorial-style cards balance visual impact with readability and content discoverability.",
    image: "📱",
  },
];

const TIER_COLORS: Record<string, string> = {
  excellent: "#22DD88",
  good: "#00A4FA",
  needs_development: "#7A7A9A",
};

const TIER_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  needs_development: "Developing",
};

function FeedbackCard({
  title,
  items,
  color,
  delay,
  icon,
}: {
  title: string;
  items: string[];
  color: string;
  delay: number;
  icon: string;
}) {
  const colors = useColors();
  return (
    <Animated.View
      entering={SlideInUp.delay(delay).springify()}
      style={{
        backgroundColor: colors.card,
        borderRadius: colors.radius,
        padding: 20,
        marginBottom: 14,
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Ionicons name={icon as any} size={18} color={color} />
        <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
          {title}
        </Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginTop: 7, flexShrink: 0 }} />
          <Text style={{ flex: 1, fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 21 }}>
            {item}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}

export default function CritiqueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, addXP, addCoins } = useGame();

  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<CritiqueFeedback | null>(null);
  const [sessionsDone, setSessionsDone] = useState(0);

  const maxSessions = state.isPro ? Infinity : 2;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const isReady = wordCount >= 50;
  const limitReached = sessionsDone >= maxSessions;

  const submitScale = useSharedValue(1);
  const submitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  const prompt = CRITIQUE_PROMPTS[selectedPromptIdx];

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  async function handleSubmit() {
    if (!isReady || loading || limitReached) return;

    submitScale.value = withSpring(0.96, { damping: 10 }, () => {
      submitScale.value = withSpring(1);
    });

    setLoading(true);
    try {
      const result = await submitCritique(prompt.prompt, text);
      setFeedback(result);
      setSessionsDone((s) => s + 1);

      const xpReward = result.quality_tier === "excellent" ? 25 : result.quality_tier === "good" ? 15 : 10;
      addXP(xpReward);
      addCoins(5);

      await voiceService.playCritiqueReady();
      setTimeout(() => {
        voiceService.playQualityTier(result.quality_tier);
      }, 1500);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Could not get critique. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function resetCritique() {
    setFeedback(null);
    setText("");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 20,
          paddingBottom: paddingBottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              AI Critique
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              Write your analysis. Get expert feedback.
            </Text>
          </View>
          {!state.isPro && (
            <View style={{ backgroundColor: colors.card, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
                {maxSessions - sessionsDone}/{maxSessions} left
              </Text>
            </View>
          )}
        </View>

        {/* Prompt selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {CRITIQUE_PROMPTS.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => { setSelectedPromptIdx(i); resetCritique(); }}
              style={{
                backgroundColor: i === selectedPromptIdx ? colors.primary : colors.card,
                borderRadius: colors.radius,
                paddingHorizontal: 16,
                paddingVertical: 10,
                maxWidth: 160,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 13,
                fontFamily: "Nunito_800ExtraBold",
                color: i === selectedPromptIdx ? colors.primaryForeground : colors.foreground,
              }} numberOfLines={2}>
                {p.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Prompt card */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          padding: 20,
          marginBottom: 16,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Text style={{ fontSize: 32 }}>{prompt.image}</Text>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {prompt.title}
            </Text>
          </View>
          <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 21 }}>
            {prompt.prompt}
          </Text>
        </View>

        {/* Input */}
        {!feedback && (
          <Animated.View entering={FadeIn}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                Your Critique
              </Text>
              <Text style={{
                fontSize: 13,
                fontFamily: "Nunito_600SemiBold",
                color: isReady ? colors.success : colors.mutedForeground,
              }}>
                {wordCount}/50 words{isReady ? " ✓" : " min"}
              </Text>
            </View>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Begin your critique here. Analyze the design's hierarchy, color use, typography, spacing, and overall effectiveness. Consider what works and why, and what could be improved..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              style={{
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                padding: 18,
                fontSize: 15,
                fontFamily: "Nunito_600SemiBold",
                color: colors.foreground,
                borderWidth: 2,
                borderColor: isReady ? colors.primary : colors.border,
                minHeight: 180,
                textAlignVertical: "top",
                marginBottom: 16,
              }}
            />

            {limitReached ? (
              <TouchableOpacity
                style={{ backgroundColor: colors.pink + "20", borderRadius: colors.radius, paddingVertical: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
                onPress={() => router.push("/paywall" as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="star" size={18} color={colors.pink} />
                <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.pink }}>
                  Unlock Grafly Pro for unlimited critiques
                </Text>
              </TouchableOpacity>
            ) : (
              <Animated.View style={submitStyle}>
                <TouchableOpacity
                  style={{
                    backgroundColor: isReady ? colors.primary : colors.muted,
                    borderRadius: colors.radius,
                    paddingVertical: 18,
                    alignItems: "center",
                  }}
                  onPress={handleSubmit}
                  disabled={!isReady || loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color={isReady ? colors.primaryForeground : colors.mutedForeground} />
                  ) : (
                    <Text style={{
                      fontSize: 17,
                      fontFamily: "Nunito_800ExtraBold",
                      color: isReady ? colors.primaryForeground : colors.mutedForeground,
                    }}>
                      {isReady ? "Submit for AI Critique" : `${50 - wordCount} more words needed`}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}

            {loading && (
              <Animated.View entering={FadeIn} style={{ alignItems: "center", paddingVertical: 24, gap: 12 }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                  Grafly is analysing your critique...
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Feedback */}
        {feedback && (
          <Animated.View entering={FadeIn}>
            {/* Quality Tier Badge */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <View style={{
                backgroundColor: TIER_COLORS[feedback.quality_tier] + "20",
                borderRadius: 100,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 1.5,
                borderColor: TIER_COLORS[feedback.quality_tier],
              }}>
                <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: TIER_COLORS[feedback.quality_tier] }}>
                  {TIER_LABELS[feedback.quality_tier]}
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {feedback.quality_tier === "excellent" ? "+25 XP" : feedback.quality_tier === "good" ? "+15 XP" : "+10 XP"} earned
              </Text>
            </View>

            <FeedbackCard
              title="Strengths"
              items={feedback.strengths}
              color={colors.success}
              delay={0}
              icon="checkmark-circle-outline"
            />
            <FeedbackCard
              title="Areas to Develop"
              items={feedback.development_areas}
              color="#FFB800"
              delay={150}
              icon="arrow-up-circle-outline"
            />
            <FeedbackCard
              title="Expert Critique Example"
              items={[feedback.suggested_critique]}
              color={colors.primary}
              delay={300}
              icon="bulb-outline"
            />

            <TouchableOpacity
              style={{ backgroundColor: colors.card, borderRadius: colors.radius, paddingVertical: 16, alignItems: "center", marginTop: 8 }}
              onPress={resetCritique}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                Try Another Prompt
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
