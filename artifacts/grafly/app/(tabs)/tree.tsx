import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES, type SkillNode, type Course } from "@/constants/lessons";
import { PressScale } from "@/components/PressScale";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NODE_SIZE = 64;
const VERTICAL_GAP = 110;

const POSITIONS = ["left", "center", "right"] as const;
type NodePosition = (typeof POSITIONS)[number];

function getNodeX(pos: NodePosition): number {
  const innerW = Math.min(SCREEN_WIDTH - 48, 360);
  const center = innerW / 2;
  if (pos === "left") return center - 100;
  if (pos === "right") return center + 100;
  return center;
}

function CoursePill({
  course,
  selected,
  onPress,
}: {
  course: Course;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <PressScale
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 8,
        borderRadius: 100,
        backgroundColor: selected ? colors.foreground : colors.card,
        borderWidth: 1,
        borderColor: selected ? colors.foreground : colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <View style={{
        width: 20, height: 20, borderRadius: 6,
        backgroundColor: selected ? course.color : course.color + "30",
        alignItems: "center", justifyContent: "center",
      }}>
        <Ionicons name={course.icon as any} size={12} color={selected ? colors.background : course.color} />
      </View>
      <Text style={{
        fontSize: 13,
        fontFamily: "Nunito_800ExtraBold",
        color: selected ? colors.background : colors.foreground,
        letterSpacing: -0.2,
      }}>
        {course.title}
      </Text>
    </PressScale>
  );
}

function NodeItem({
  node, course, isCompleted, isLocked, posX, onPress,
}: {
  node: SkillNode; course: Course; isCompleted: boolean;
  isLocked: boolean; posX: number; onPress: () => void;
}) {
  const colors = useColors();
  const nodeColor = isCompleted ? colors.success : isLocked ? colors.muted : course.color;

  return (
    <View style={{
      position: "absolute",
      left: posX - (NODE_SIZE + 80) / 2,
      width: NODE_SIZE + 80,
      alignItems: "center",
    }}>
      <PressScale
        onPress={onPress}
        disabled={isLocked}
        style={{
          width: NODE_SIZE, height: NODE_SIZE,
          borderRadius: NODE_SIZE / 2,
          backgroundColor: isLocked ? colors.muted + "30" : isCompleted ? colors.success : colors.card,
          borderWidth: 2,
          borderColor: isLocked ? colors.border : nodeColor,
          alignItems: "center", justifyContent: "center",
        }}
      >
        {isCompleted
          ? <Ionicons name="checkmark" size={28} color={colors.primaryForeground} />
          : isLocked
          ? <Ionicons name="lock-closed" size={20} color={colors.mutedForeground} />
          : <Ionicons name={node.icon as any} size={26} color={nodeColor} />
        }
      </PressScale>
      <Text style={{
        fontSize: 11,
        fontFamily: "Nunito_800ExtraBold",
        color: isLocked ? colors.mutedForeground : colors.foreground,
        marginTop: 10,
        textAlign: "center",
        maxWidth: 100,
        letterSpacing: -0.1,
      }} numberOfLines={2}>
        {node.title}
      </Text>
    </View>
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
      <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} activeOpacity={1} onPress={onClose} />
      <View style={{
        backgroundColor: colors.card,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: insets.bottom + 24,
      }}>
        <View style={{ width: 44, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: "center", marginBottom: 24 }} />

        {/* Editorial eyebrow + headline */}
        <Text style={{
          fontSize: 12,
          fontFamily: "Nunito_800ExtraBold",
          color: course.color,
          letterSpacing: 1.5,
          marginBottom: 6,
          textTransform: "uppercase",
        }}>
          {course.title}
        </Text>
        <Text style={{
          fontSize: 28,
          fontFamily: "Nunito_800ExtraBold",
          color: colors.foreground,
          letterSpacing: -0.8,
          lineHeight: 32,
          marginBottom: 14,
        }}>
          {node.title}
        </Text>
        <Text style={{
          fontSize: 15,
          fontFamily: "Nunito_600SemiBold",
          color: colors.mutedForeground,
          lineHeight: 22,
          marginBottom: 22,
        }}>
          {node.description}
        </Text>

        {/* Stats row */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {[
            { val: node.lessons.length, label: "LESSONS", icon: null, iconColor: null },
            { val: totalXP, label: "XP", icon: "flash", iconColor: colors.accent },
            { val: totalCoins, label: "COINS", icon: "ellipse", iconColor: colors.warning },
          ].map((s) => (
            <View key={s.label} style={{
              flex: 1,
              backgroundColor: colors.background,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}>
              {s.icon && <Ionicons name={s.icon as any} size={14} color={s.iconColor!} style={{ marginBottom: 2 }} />}
              <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -0.5 }}>{s.val}</Text>
              <Text style={{ fontSize: 10, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Lesson list */}
        <View style={{ marginBottom: 20 }}>
          {node.lessons.map((lesson, i) => (
            <View key={lesson.id} style={{
              flexDirection: "row", alignItems: "center", gap: 12,
              paddingVertical: 12,
              borderTopWidth: i === 0 ? 1 : 0, borderBottomWidth: 1, borderColor: colors.border,
            }}>
              <Text style={{
                fontSize: 11,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.mutedForeground,
                width: 22,
              }}>
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Text style={{ flex: 1, fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.foreground }}>{lesson.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Ionicons name="flash" size={12} color={colors.accent} />
                <Text style={{ fontSize: 12, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground }}>+{lesson.xpReward}</Text>
              </View>
            </View>
          ))}
        </View>

        {!isLocked ? (
          <PressScale
            onPress={() => { onClose(); router.push({ pathname: "/lesson", params: { nodeId: node.id } }); }}
            style={{
              backgroundColor: colors.foreground,
              borderRadius: 100, paddingVertical: 20, alignItems: "center",
              flexDirection: "row", justifyContent: "center", gap: 10,
            }}
          >
            <Text style={{
              fontSize: 17,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.background,
              letterSpacing: -0.3,
            }}>
              {isCompleted ? "Practice again" : "Start lessons"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.background} />
          </PressScale>
        ) : (
          <View style={{
            backgroundColor: colors.muted,
            borderRadius: 100,
            paddingVertical: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}>
            <Ionicons name="lock-closed" size={18} color={colors.mutedForeground} />
            <Text style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: -0.2 }}>
              Complete previous lessons
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
  const params = useLocalSearchParams<{ courseId?: string }>();
  const courseListRef = useRef<FlatList>(null);

  const initialIdx = (() => {
    if (params.courseId) {
      const i = COURSES.findIndex((c) => c.id === params.courseId);
      if (i >= 0) return i;
    }
    return 0;
  })();

  const [selectedCourseIdx, setSelectedCourseIdx] = useState(initialIdx);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Sync selection if param changes (deep links / route updates)
  useEffect(() => {
    if (params.courseId) {
      const i = COURSES.findIndex((c) => c.id === params.courseId);
      if (i >= 0 && i !== selectedCourseIdx) {
        setSelectedCourseIdx(i);
      }
    }
  }, [params.courseId]);

  const course = COURSES[selectedCourseIdx];
  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 100);

  // Compute progress for this course
  const allLessonIdsInCourse = course.nodes.flatMap((n) => n.lessons.map((l) => l.id));
  const completedInCourse = allLessonIdsInCourse.filter((id) => state.completedLessons.includes(id)).length;
  const totalInCourse = allLessonIdsInCourse.length;
  const courseProgress = totalInCourse > 0 ? Math.round((completedInCourse / totalInCourse) * 100) : 0;

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
  const innerW = Math.min(SCREEN_WIDTH - 48, 360);
  const treeHeight = nodes.length * VERTICAL_GAP + 60;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Editorial header */}
      <View style={{ paddingTop: paddingTop + 12, paddingHorizontal: 24, paddingBottom: 18 }}>
        <Text style={{
          fontSize: 13,
          fontFamily: "Nunito_800ExtraBold",
          color: colors.mutedForeground,
          letterSpacing: 1.5,
          marginBottom: 6,
        }}>
          YOUR JOURNEY
        </Text>
        <Text style={{
          fontSize: 38,
          fontFamily: "Nunito_800ExtraBold",
          color: colors.foreground,
          letterSpacing: -1,
          marginBottom: 20,
          lineHeight: 42,
        }}>
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
            <CoursePill
              course={c}
              selected={idx === selectedCourseIdx}
              onPress={() => handleCourseSelect(idx)}
            />
          )}
          onScrollToIndexFailed={() => { /* fallback: do nothing */ }}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={course.id}
          entering={FadeIn.duration(220)}
          style={{ paddingHorizontal: 24 }}
        >
          {/* Editorial course summary */}
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 20,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <View style={{
                width: 44, height: 44, borderRadius: 14,
                backgroundColor: course.color + "22",
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name={course.icon as any} size={22} color={course.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: "Nunito_800ExtraBold",
                  color: course.color,
                  letterSpacing: 1.4,
                  marginBottom: 2,
                  textTransform: "uppercase",
                }}>
                  Course
                </Text>
                <Text style={{
                  fontSize: 18,
                  fontFamily: "Nunito_800ExtraBold",
                  color: colors.foreground,
                  letterSpacing: -0.4,
                }}>
                  {course.title}
                </Text>
              </View>
              <Text style={{
                fontSize: 22,
                fontFamily: "Nunito_800ExtraBold",
                color: colors.foreground,
                letterSpacing: -0.5,
              }}>
                {courseProgress}%
              </Text>
            </View>
            <Text style={{
              fontSize: 13,
              fontFamily: "Nunito_600SemiBold",
              color: colors.mutedForeground,
              lineHeight: 19,
              marginBottom: 14,
            }}>
              {course.description}
            </Text>
            {/* Progress bar */}
            <View style={{
              height: 6,
              borderRadius: 100,
              backgroundColor: colors.border,
              overflow: "hidden",
            }}>
              <View style={{
                height: "100%",
                width: `${courseProgress}%`,
                backgroundColor: course.color,
                borderRadius: 100,
              }} />
            </View>
            <Text style={{
              fontSize: 11,
              fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground,
              letterSpacing: 1,
              marginTop: 10,
            }}>
              {completedInCourse} OF {totalInCourse} LESSONS
            </Text>
          </View>

          {/* Section eyebrow above tree */}
          <Text style={{
            fontSize: 11,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.mutedForeground,
            letterSpacing: 1.4,
            marginBottom: 12,
          }}>
            THE PATH
          </Text>

          {/* Winding node tree */}
          <Animated.View
            entering={FadeInDown.duration(280).delay(60)}
            style={{ height: treeHeight, position: "relative", alignSelf: "center", width: innerW }}
          >
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
                    strokeWidth={2}
                    strokeDasharray={isCompleted ? undefined : "6,6"}
                    fill="none"
                  />
                );
              })}
            </Svg>

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
          </Animated.View>
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
