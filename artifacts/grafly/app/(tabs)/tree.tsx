import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES, type SkillNode, type Course } from "@/constants/lessons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NODE_SIZE = 64;

function NodeItem({
  node,
  course,
  isCompleted,
  isLocked,
  isFirst,
  onPress,
}: {
  node: SkillNode;
  course: Course;
  isCompleted: boolean;
  isLocked: boolean;
  isFirst: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(0.85);

  React.useEffect(() => {
    if (!isLocked) {
      scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    }
  }, [isLocked]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const nodeColor = isCompleted
    ? colors.success
    : isLocked
    ? colors.muted
    : course.color;

  return (
    <Animated.View style={[{ alignItems: "center" }, animStyle]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isLocked}
        activeOpacity={0.8}
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: NODE_SIZE / 2,
          backgroundColor: isLocked ? colors.muted : nodeColor + "20",
          borderWidth: 3,
          borderColor: nodeColor,
          alignItems: "center",
          justifyContent: "center",
          ...((!isLocked && !isCompleted) && {
            shadowColor: nodeColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 6,
          }),
        }}
      >
        {isCompleted ? (
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
        ) : isLocked ? (
          <Ionicons name="lock-closed" size={22} color={colors.mutedForeground} />
        ) : (
          <Ionicons name={node.icon as any} size={24} color={nodeColor} />
        )}
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Nunito_800ExtraBold",
          color: isLocked ? colors.mutedForeground : colors.foreground,
          marginTop: 8,
          textAlign: "center",
          maxWidth: 90,
        }}
        numberOfLines={2}
      >
        {node.title}
      </Text>
    </Animated.View>
  );
}

function NodeSheet({
  node,
  course,
  isCompleted,
  isLocked,
  visible,
  onClose,
}: {
  node: SkillNode | null;
  course: Course | null;
  isCompleted: boolean;
  isLocked: boolean;
  visible: boolean;
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  if (!node || !course) return null;

  const totalXP = node.lessons.reduce((s, l) => s + l.xpReward, 0);
  const totalCoins = node.lessons.reduce((s, l) => s + l.coinReward, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      <View
        style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: 28,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <View style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: course.color + "20",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Ionicons name={node.icon as any} size={26} color={course.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {node.title}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
              {course.title}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 22, marginBottom: 20 }}>
          {node.description}
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: 14, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
              {node.lessons.length}
            </Text>
            <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>LESSONS</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: 14, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="flash" size={16} color={colors.accent} />
              <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {totalXP}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>XP REWARD</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: 14, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="ellipse" size={12} color="#FFB800" />
              <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {totalCoins}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>COINS</Text>
          </View>
        </View>

        {node.lessons.map((lesson, i) => (
          <View
            key={lesson.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingVertical: 10,
              borderTopWidth: i === 0 ? 1 : 0,
              borderBottomWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={{ flex: 1, fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>
              {lesson.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="flash" size={12} color={colors.accent} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                +{lesson.xpReward}
              </Text>
            </View>
          </View>
        ))}

        {!isLocked && (
          <TouchableOpacity
            style={{
              backgroundColor: isCompleted ? colors.success : colors.primary,
              borderRadius: colors.radius,
              paddingVertical: 18,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={() => {
              onClose();
              router.push({ pathname: "/lesson", params: { nodeId: node.id } });
            }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: "#FFFFFF" }}>
              {isCompleted ? "Practice Again" : "Start Lessons"}
            </Text>
          </TouchableOpacity>
        )}

        {isLocked && (
          <View style={{
            backgroundColor: colors.muted,
            borderRadius: colors.radius,
            paddingVertical: 18,
            alignItems: "center",
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}>
            <Ionicons name="lock-closed" size={18} color={colors.mutedForeground} />
            <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>
              Complete previous lessons first
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default function TreeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();

  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const course = COURSES[selectedCourseIdx];
  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  function isNodeCompleted(node: SkillNode): boolean {
    return node.lessons.every((l) => state.completedLessons.includes(l.id));
  }

  function isNodeLocked(node: SkillNode): boolean {
    return node.prerequisites.some((prereqId) => {
      const prereqNode = course.nodes.find((n) => n.id === prereqId);
      return prereqNode && !isNodeCompleted(prereqNode);
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: paddingTop + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 28, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, marginBottom: 16 }}>
          Skill Tree
        </Text>

        {/* Course selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {COURSES.map((c, idx) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setSelectedCourseIdx(idx)}
              style={{
                backgroundColor: idx === selectedCourseIdx ? c.color : colors.card,
                borderRadius: 100,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: "Nunito_800ExtraBold",
                color: idx === selectedCourseIdx ? "#0F0F14" : colors.mutedForeground,
              }}>
                {c.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tree */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: paddingBottom, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn} style={{ alignItems: "center", paddingHorizontal: 20 }}>
          {/* Course header */}
          <View style={{
            backgroundColor: course.color + "15",
            borderRadius: colors.radius,
            padding: 20,
            marginBottom: 32,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}>
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: course.color + "30",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Ionicons name={course.icon as any} size={26} color={course.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>
                {course.title}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
                {course.description}
              </Text>
            </View>
          </View>

          {/* Nodes */}
          {course.nodes.map((node, idx) => {
            const completed = isNodeCompleted(node);
            const locked = isNodeLocked(node);
            const isLast = idx === course.nodes.length - 1;

            return (
              <View key={node.id} style={{ alignItems: "center", width: "100%" }}>
                <NodeItem
                  node={node}
                  course={course}
                  isCompleted={completed}
                  isLocked={locked}
                  isFirst={idx === 0}
                  onPress={() => {
                    setSelectedNode(node);
                    setSheetVisible(true);
                  }}
                />

                {!isLast && (
                  <View style={{ height: 48, alignItems: "center", justifyContent: "center" }}>
                    <Svg width={4} height={48}>
                      <Line
                        x1="2" y1="0" x2="2" y2="48"
                        stroke={completed ? colors.success : colors.border}
                        strokeWidth={3}
                        strokeDasharray={completed ? undefined : "6,4"}
                      />
                    </Svg>
                  </View>
                )}
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>

      <NodeSheet
        node={selectedNode}
        course={selectedNode ? COURSES.find((c) => c.id === selectedNode.courseId) ?? null : null}
        isCompleted={selectedNode ? isNodeCompleted(selectedNode) : false}
        isLocked={selectedNode ? isNodeLocked(selectedNode) : false}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}
