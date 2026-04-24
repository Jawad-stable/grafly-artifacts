import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Platform,
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
import Svg, { Path } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES, type SkillNode, type Course } from "@/constants/lessons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NODE_SIZE = 70;
const VERTICAL_GAP = 110;

const POSITIONS = ["left", "center", "right"] as const;
type NodePosition = (typeof POSITIONS)[number];

function getNodeX(pos: NodePosition): number {
  const innerW = Math.min(SCREEN_WIDTH - 40, 360);
  const center = innerW / 2;
  if (pos === "left") return center - 100;
  if (pos === "right") return center + 100;
  return center;
}

function CourseCard({
  course,
  selected,
  onPress,
}: {
  course: Course;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(selected ? 1 : 0.95);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  React.useEffect(() => {
    scale.value = withSpring(selected ? 1 : 0.95, { damping: 14 });
  }, [selected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={[{
        width: 130,
        borderRadius: 20,
        padding: 16,
        marginRight: 12,
        backgroundColor: selected ? course.color + "22" : colors.card,
        borderWidth: 2,
        borderColor: selected ? course.color : colors.border,
        alignItems: "center",
        gap: 8,
        shadowColor: selected ? course.color : "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: selected ? 0.3 : 0.1,
        shadowRadius: 12,
        elevation: selected ? 8 : 2,
      }, anim]}>
        <View style={{
          width: 44, height: 44, borderRadius: 14,
          backgroundColor: course.color + "30",
          alignItems: "center", justifyContent: "center",
        }}>
          <Ionicons name={course.icon as any} size={22} color={course.color} />
        </View>
        <Text style={{
          fontSize: 12, fontFamily: "Nunito_800ExtraBold",
          color: selected ? course.color : colors.foreground,
          textAlign: "center",
        }}>
          {course.title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function NodeItem({
  node, course, isCompleted, isLocked, posX, onPress,
}: {
  node: SkillNode; course: Course; isCompleted: boolean;
  isLocked: boolean; posX: number; onPress: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(isLocked ? 0.85 : 1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  React.useEffect(() => {
    scale.value = withSpring(isLocked ? 0.85 : 1, { damping: 13 });
  }, [isLocked]);

  const nodeColor = isCompleted ? colors.success : isLocked ? colors.muted : course.color;

  return (
    <Animated.View style={[{
      position: "absolute",
      left: posX - NODE_SIZE / 2,
      width: NODE_SIZE + 80,
      alignItems: "center",
    }, anim]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isLocked}
        activeOpacity={0.8}
        style={{
          width: NODE_SIZE, height: NODE_SIZE,
          borderRadius: NODE_SIZE / 2,
          backgroundColor: isLocked ? colors.muted + "40" : nodeColor + "20",
          borderWidth: 3, borderColor: nodeColor,
          alignItems: "center", justifyContent: "center",
          shadowColor: isLocked ? "transparent" : nodeColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isLocked ? 0 : 0.5,
          shadowRadius: 12,
          elevation: isLocked ? 0 : 6,
        }}
      >
        {isCompleted
          ? <Ionicons name="checkmark-circle" size={30} color={colors.success} />
          : isLocked
          ? <Ionicons name="lock-closed" size={22} color={colors.mutedForeground} />
          : <Ionicons name={node.icon as any} size={26} color={nodeColor} />
        }
      </TouchableOpacity>
      <Text style={{
        fontSize: 11, fontFamily: "Nunito_800ExtraBold",
        color: isLocked ? colors.mutedForeground : colors.foreground,
        marginTop: 8, textAlign: "center", maxWidth: 90,
      }} numberOfLines={2}>
        {node.title}
      </Text>
    </Animated.View>
  );
}

function NodeSheet({ node, course, isCompleted, isLocked, visible, onClose }: {
  node: SkillNode | null; course: Course | null;
  isCompleted: boolean; isLocked: boolean;
  visible: boolean; onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  if (!node || !course) return null;
  const totalXP = node.lessons.reduce((s, l) => s + l.xpReward, 0);
  const totalCoins = node.lessons.reduce((s, l) => s + l.coinReward, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      <View style={{
        backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 28, paddingBottom: insets.bottom + 20,
      }}>
        <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: "center", marginBottom: 20 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: course.color + "20", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={node.icon as any} size={26} color={course.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>{node.title}</Text>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>{course.title}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 15, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, lineHeight: 22, marginBottom: 20 }}>
          {node.description}
        </Text>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          {[
            { val: node.lessons.length, label: "LESSONS", icon: null, iconColor: null },
            { val: totalXP, label: "XP", icon: "flash", iconColor: colors.accent },
            { val: totalCoins, label: "COINS", icon: "ellipse", iconColor: colors.warning },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: 14, alignItems: "center" }}>
              {s.icon && <Ionicons name={s.icon as any} size={14} color={s.iconColor!} />}
              <Text style={{ fontSize: 20, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>{s.val}</Text>
              <Text style={{ fontSize: 10, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>{s.label}</Text>
            </View>
          ))}
        </View>
        {node.lessons.map((lesson, i) => (
          <View key={lesson.id} style={{
            flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10,
            borderTopWidth: i === 0 ? 1 : 0, borderBottomWidth: 1, borderColor: colors.border,
          }}>
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={{ flex: 1, fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>{lesson.title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="flash" size={12} color={colors.accent} />
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>+{lesson.xpReward}</Text>
            </View>
          </View>
        ))}
        {!isLocked ? (
          <TouchableOpacity
            style={{
              backgroundColor: isCompleted ? colors.success : colors.foreground,
              borderRadius: 100, paddingVertical: 20, alignItems: "center", marginTop: 20,
              flexDirection: "row", justifyContent: "center", gap: 10,
            }}
            onPress={() => { onClose(); router.push({ pathname: "/lesson", params: { nodeId: node.id } }); }}
            activeOpacity={0.88}
          >
            <Text style={{ fontSize: 17, fontFamily: "Nunito_800ExtraBold", color: isCompleted ? colors.primaryForeground : colors.background }}>
              {isCompleted ? "Practice again" : "Start lessons"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={isCompleted ? colors.primaryForeground : colors.background} />
          </TouchableOpacity>
        ) : (
          <View style={{ backgroundColor: colors.muted, borderRadius: colors.radius, paddingVertical: 18, alignItems: "center", marginTop: 20, flexDirection: "row", justifyContent: "center", gap: 8 }}>
            <Ionicons name="lock-closed" size={18} color={colors.mutedForeground} />
            <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>Complete previous lessons</Text>
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
  const courseListRef = useRef<FlatList>(null);

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
      const prereq = course.nodes.find((n) => n.id === prereqId);
      return prereq && !isNodeCompleted(prereq);
    });
  }

  function handleCourseSelect(idx: number) {
    setSelectedCourseIdx(idx);
    courseListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
  }

  const nodes = course.nodes;
  const innerW = Math.min(SCREEN_WIDTH - 40, 360);
  const treeHeight = nodes.length * VERTICAL_GAP + 60;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header — editorial */}
      <View style={{ paddingTop: paddingTop + 12, paddingHorizontal: 24, paddingBottom: 16 }}>
        <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5, marginBottom: 4 }}>
          YOUR JOURNEY
        </Text>
        <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, marginBottom: 18, lineHeight: 42 }}>
          Skill tree
        </Text>
        <FlatList
          ref={courseListRef}
          data={COURSES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingRight: 24 }}
          style={{ marginHorizontal: -24, paddingLeft: 24 }}
          renderItem={({ item: c, index: idx }) => (
            <CourseCard
              course={c}
              selected={idx === selectedCourseIdx}
              onPress={() => handleCourseSelect(idx)}
            />
          )}
          getItemLayout={(_, index) => ({ length: 142, offset: 142 * index, index })}
        />
      </View>

      {/* Tree with S/Z path */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn} style={{ paddingHorizontal: 20 }}>
          {/* Course info strip */}
          <View style={{
            backgroundColor: course.color + "15", borderRadius: colors.radius,
            padding: 16, marginBottom: 24,
            flexDirection: "row", alignItems: "center", gap: 12,
          }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: course.color + "30", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={course.icon as any} size={22} color={course.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: colors.foreground }}>{course.title}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground, marginTop: 2 }} numberOfLines={2}>
                {course.description}
              </Text>
            </View>
          </View>

          {/* Winding node tree */}
          <View style={{ height: treeHeight, position: "relative" }}>
            {/* SVG curves connecting nodes */}
            <Svg
              width={innerW}
              height={treeHeight}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {nodes.map((node, idx) => {
                if (idx === nodes.length - 1) return null;
                const posA = POSITIONS[idx % 3];
                const posB = POSITIONS[(idx + 1) % 3];
                const x1 = getNodeX(posA);
                const y1 = idx * VERTICAL_GAP + NODE_SIZE / 2 + 30;
                const x2 = getNodeX(posB);
                const y2 = (idx + 1) * VERTICAL_GAP + NODE_SIZE / 2 + 30;
                const cpY = (y1 + y2) / 2;
                const isCompleted = isNodeCompleted(node);
                return (
                  <Path
                    key={node.id}
                    d={`M ${x1} ${y1} C ${x1} ${cpY} ${x2} ${cpY} ${x2} ${y2}`}
                    stroke={isCompleted ? colors.success : colors.border}
                    strokeWidth={3}
                    strokeDasharray={isCompleted ? undefined : "8,5"}
                    fill="none"
                  />
                );
              })}
            </Svg>

            {/* Nodes */}
            {nodes.map((node, idx) => {
              const pos = POSITIONS[idx % 3];
              const posX = getNodeX(pos);
              const completed = isNodeCompleted(node);
              const locked = isNodeLocked(node);
              return (
                <View
                  key={node.id}
                  style={{ position: "absolute", top: idx * VERTICAL_GAP + 30, left: 0, right: 0, alignItems: "center" }}
                >
                  <NodeItem
                    node={node}
                    course={course}
                    isCompleted={completed}
                    isLocked={locked}
                    posX={posX}
                    onPress={() => { setSelectedNode(node); setSheetVisible(true); }}
                  />
                </View>
              );
            })}
          </View>
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
