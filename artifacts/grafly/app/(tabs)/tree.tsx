import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES, type SkillNode, type Course } from "@/constants/lessons";
import { PressScale } from "@/components/PressScale";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NODE_SIZE = 68;
const VERTICAL_GAP = 118;

const POSITIONS = ["left", "center", "right"] as const;
type NodePosition = (typeof POSITIONS)[number];

function getNodeX(pos: NodePosition): number {
  const innerW = Math.min(SCREEN_WIDTH - 48, 360);
  const center = innerW / 2;
  if (pos === "left") return center - 100;
  if (pos === "right") return center + 100;
  return center;
}

const TIER_PALETTE = ["#00A4FA", "#FF7BD0", "#E3ED43", "#FFB800", "#22DD88", "#A78BFA"];

// Returns a readable foreground color for text/icons rendered on top of `hex`.
// Compares WCAG relative-luminance contrast ratios for the dark navy and white
// candidates, then picks the higher one. This keeps mid-saturation colors like
// blue (#00A4FA) and pink (#FF7BD0) readable, not just the very-light ones.
function relLuminance(hex: string): number {
  const c = hex.replace("#", "").slice(0, 6);
  if (c.length < 6) return 1;
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLin(parseInt(c.slice(0, 2), 16));
  const g = toLin(parseInt(c.slice(2, 4), 16));
  const b = toLin(parseInt(c.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}
function getContrastOn(hex: string): string {
  const navy = "#21263F";
  const white = "#FFFFFF";
  return contrastRatio(navy, hex) >= contrastRatio(white, hex) ? navy : white;
}

function tierColor(idx: number, fallback: string): string {
  if (idx === 0) return fallback;
  return TIER_PALETTE[idx % TIER_PALETTE.length];
}

function CoursesButton({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  return (
    <PressScale
      onPress={onPress}
      style={{
        height: 52,
        borderRadius: 100,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 18,
        gap: 10,
      }}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon name="apps" size={20} color={colors.foreground} />
      </View>
      <Text style={{
        fontSize: 15,
        fontFamily: "Nunito_800ExtraBold",
        color: colors.foreground,
        letterSpacing: -0.3,
      }}>
        Courses
      </Text>
    </PressScale>
  );
}

function CoursePickerModal({
  visible,
  onClose,
  selectedCourseIdx,
  onSelect,
  completedLessons,
}: {
  visible: boolean;
  onClose: () => void;
  selectedCourseIdx: number;
  onSelect: (idx: number) => void;
  completedLessons: string[];
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Top bar with X close */}
        <View style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 24,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Text style={{
            fontSize: 13,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.mutedForeground,
            letterSpacing: 1.5,
          }}>
            BROWSE
          </Text>
          <PressScale
            onPress={onClose}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="close" size={22} color={colors.foreground} />
          </PressScale>
        </View>

        {/* Editorial headline */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <Text style={{
            fontSize: 44,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.foreground,
            letterSpacing: -1.2,
            lineHeight: 48,
          }}>
            Choose
          </Text>
          <Text style={{
            fontSize: 44,
            fontFamily: "Nunito_800ExtraBold",
            color: colors.foreground,
            letterSpacing: -1.2,
            lineHeight: 48,
          }}>
            a course.
          </Text>
        </View>

        {/* Course list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {COURSES.map((c, idx) => {
            const isSelected = idx === selectedCourseIdx;
            const totalLessonsInCourse = c.nodes.flatMap((n) => n.lessons).length;
            const completedInCourse = c.nodes
              .flatMap((n) => n.lessons)
              .filter((l) => completedLessons.includes(l.id)).length;
            const progress = totalLessonsInCourse > 0
              ? Math.round((completedInCourse / totalLessonsInCourse) * 100)
              : 0;

            return (
              <PressScale
                key={c.id}
                onPress={() => onSelect(idx)}
                style={{
                  backgroundColor: isSelected ? colors.foreground : colors.card,
                  borderRadius: 22,
                  padding: 18,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.foreground : colors.border,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <View style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: isSelected ? c.color : c.color + "22",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icon
                    name={c.icon as any}
                    size={26}
                    color={isSelected ? colors.background : c.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: "Nunito_800ExtraBold",
                    color: c.color,
                    letterSpacing: 1.3,
                    marginBottom: 2,
                    textTransform: "uppercase",
                  }}>
                    {progress}% COMPLETE
                  </Text>
                  <Text style={{
                    fontSize: 17,
                    fontFamily: "Nunito_800ExtraBold",
                    color: isSelected ? colors.background : colors.foreground,
                    letterSpacing: -0.4,
                    marginBottom: 2,
                  }}>
                    {c.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: "Nunito_600SemiBold",
                    color: isSelected ? colors.background : colors.mutedForeground,
                    opacity: isSelected ? 0.7 : 1,
                  }} numberOfLines={1}>
                    {totalLessonsInCourse} lessons
                  </Text>
                </View>
                {isSelected && (
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon name="checkmark" size={18} color={colors.foreground} />
                  </View>
                )}
              </PressScale>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

function NodeItem({
  node, course, isCompleted, isLocked, posX, onPress, tint,
}: {
  node: SkillNode; course: Course; isCompleted: boolean;
  isLocked: boolean; posX: number; onPress: () => void; tint: string;
}) {
  const colors = useColors();
  const fillColor = isCompleted ? colors.success : isLocked ? colors.muted : tint;
  const haloSize = NODE_SIZE + 24;

  return (
    <View style={{
      position: "absolute",
      left: posX - (NODE_SIZE + 80) / 2,
      width: NODE_SIZE + 80,
      alignItems: "center",
    }}>
      <View style={{ width: haloSize, height: haloSize, alignItems: "center", justifyContent: "center" }}>
        {!isLocked && (
          <View style={{
            position: "absolute",
            width: haloSize, height: haloSize, borderRadius: haloSize / 2,
            backgroundColor: fillColor + "26",
          }} />
        )}
        <PressScale
          onPress={onPress}
          disabled={isLocked}
          style={{
            width: NODE_SIZE, height: NODE_SIZE,
            borderRadius: NODE_SIZE / 2,
            backgroundColor: isLocked ? colors.muted + "33" : fillColor,
            borderWidth: isLocked ? 2 : 3,
            borderColor: isLocked ? colors.border : "#FFFFFF",
            alignItems: "center", justifyContent: "center",
            shadowColor: isLocked ? "transparent" : fillColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isLocked ? 0 : 0.35,
            shadowRadius: 12,
            elevation: isLocked ? 0 : 6,
          }}
        >
          {isCompleted
            ? <Icon name="checkmark" size={30} color={getContrastOn(fillColor)} />
            : isLocked
            ? <Icon name="lock-closed" size={22} color={colors.mutedForeground} />
            : <Icon name={node.icon as any} size={28} color={getContrastOn(fillColor)} />
          }
        </PressScale>
      </View>
      <View style={{
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
        backgroundColor: isLocked ? "transparent" : fillColor + "1A",
        borderWidth: isLocked ? 1 : 0,
        borderColor: colors.border,
      }}>
        <Text style={{
          fontSize: 11,
          fontFamily: "Nunito_800ExtraBold",
          color: isLocked ? colors.mutedForeground : colors.foreground,
          textAlign: "center",
          maxWidth: 110,
          letterSpacing: -0.1,
        }} numberOfLines={2}>
          {node.title}
        </Text>
      </View>
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
              {s.icon && <Icon name={s.icon as any} size={14} color={s.iconColor!} style={{ marginBottom: 2 }} />}
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
                <Icon name="flash" size={12} color={colors.accent} />
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
            <Icon name="arrow-forward" size={18} color={colors.background} />
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
            <Icon name="lock-closed" size={18} color={colors.mutedForeground} />
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
  const [pickerVisible, setPickerVisible] = useState(false);

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
  const paddingBottom = insets.bottom + 100;

  // Compute progress for this course
  const allLessonIdsInCourse = course.nodes.flatMap((n) => n.lessons.map((l) => l.id));
  const completedInCourse = allLessonIdsInCourse.filter((id) => state.completedLessons.includes(id)).length;
  const totalInCourse = allLessonIdsInCourse.length;
  const courseProgress = totalInCourse > 0 ? Math.round((completedInCourse / totalInCourse) * 100) : 0;
  const onCourse = getContrastOn(course.color);

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
    setPickerVisible(false);
  }

  const nodes = course.nodes;
  const innerW = Math.min(SCREEN_WIDTH - 48, 360);
  const treeHeight = nodes.length * VERTICAL_GAP + 60;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Editorial header with hamburger */}
      <View style={{
        paddingTop: paddingTop + 12,
        paddingHorizontal: 24,
        paddingBottom: 18,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <View style={{ flex: 1 }}>
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
            lineHeight: 42,
          }}>
            Skill tree
          </Text>
        </View>
        <View style={{ paddingTop: 18 }}>
          <CoursesButton onPress={() => setPickerVisible(true)} />
        </View>
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
          {/* Vibrant filled course summary */}
          <View style={{
            backgroundColor: course.color,
            borderRadius: 28,
            padding: 22,
            marginBottom: 28,
            overflow: "hidden",
            shadowColor: course.color,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.28,
            shadowRadius: 20,
            elevation: 8,
          }}>
            {/* Decorative blobs */}
            <View style={{
              position: "absolute", right: -40, top: -40,
              width: 160, height: 160, borderRadius: 80,
              backgroundColor: "#FFFFFF22",
            }} />
            <View style={{
              position: "absolute", right: 30, bottom: -50,
              width: 110, height: 110, borderRadius: 55,
              backgroundColor: colors.accent + "55",
            }} />

            <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 18,
                backgroundColor: onCourse + "22",
                borderWidth: 1.5,
                borderColor: onCourse + "44",
                alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={course.icon as any} size={28} color={onCourse} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: "Nunito_800ExtraBold",
                  color: onCourse + "CC",
                  letterSpacing: 1.6,
                  marginBottom: 3,
                  textTransform: "uppercase",
                }}>
                  Course
                </Text>
                <Text style={{
                  fontSize: 20,
                  fontFamily: "Nunito_800ExtraBold",
                  color: onCourse,
                  letterSpacing: -0.5,
                  lineHeight: 24,
                }}>
                  {course.title}
                </Text>
              </View>
              <View style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 14,
                backgroundColor: onCourse,
              }}>
                <Text style={{
                  fontSize: 22,
                  fontFamily: "Nunito_800ExtraBold",
                  color: course.color,
                  letterSpacing: -0.6,
                }}>
                  {courseProgress}%
                </Text>
              </View>
            </View>
            <Text style={{
              fontSize: 13,
              fontFamily: "Nunito_600SemiBold",
              color: onCourse + "DD",
              lineHeight: 19,
              marginBottom: 18,
            }}>
              {course.description}
            </Text>
            {/* Vibrant progress bar */}
            <View style={{
              height: 8,
              borderRadius: 100,
              backgroundColor: onCourse + "26",
              overflow: "hidden",
            }}>
              <View style={{
                height: "100%",
                width: `${courseProgress}%`,
                backgroundColor: onCourse,
                borderRadius: 100,
              }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <Text style={{
                fontSize: 11,
                fontFamily: "Nunito_800ExtraBold",
                color: onCourse + "CC",
                letterSpacing: 1.2,
              }}>
                {completedInCourse} OF {totalInCourse} LESSONS
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Icon name="flame" size={14} color={onCourse} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: "Nunito_800ExtraBold",
                  color: onCourse,
                  letterSpacing: 0.4,
                }}>
                  KEEP GOING
                </Text>
              </View>
            </View>
          </View>

          {/* Section eyebrow above tree */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100,
              backgroundColor: course.color + "26",
            }}>
              <Text style={{
                fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                color: course.color, letterSpacing: 1.4,
              }}>
                THE PATH
              </Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{
              fontSize: 11, fontFamily: "Nunito_800ExtraBold",
              color: colors.mutedForeground, letterSpacing: 1.2,
            }}>
              {nodes.length} STAGES
            </Text>
          </View>

          {/* Winding node tree */}
          <Animated.View
            entering={FadeInDown.duration(280).delay(60)}
            style={{ height: treeHeight + 90, position: "relative", alignSelf: "center", width: innerW }}
          >
            {/* START badge */}
            <View style={{
              position: "absolute", top: 0, left: 0, right: 0, alignItems: "center", zIndex: 2,
            }}>
              <View style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100,
                backgroundColor: course.color,
                flexDirection: "row", alignItems: "center", gap: 6,
                shadowColor: course.color, shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
              }}>
                <Icon name="rocket-outline" size={14} color={onCourse} />
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: onCourse, letterSpacing: 1.4,
                }}>
                  START
                </Text>
              </View>
            </View>

            <Svg
              width={innerW}
              height={treeHeight}
              style={{ position: "absolute", top: 40, left: 0 }}
            >
              <Defs>
                {nodes.map((node, idx) => {
                  if (idx === nodes.length - 1) return null;
                  const cFrom = isNodeCompleted(node) ? colors.success : tierColor(idx, course.color);
                  const cTo = isNodeCompleted(nodes[idx + 1]) ? colors.success : tierColor(idx + 1, course.color);
                  return (
                    <LinearGradient key={`g-${node.id}`} id={`grad-${node.id}`} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={cFrom} stopOpacity="0.9" />
                      <Stop offset="1" stopColor={cTo} stopOpacity="0.9" />
                    </LinearGradient>
                  );
                })}
              </Defs>
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
                const nextLocked = isNodeLocked(nodes[idx + 1]) && !isNodeCompleted(nodes[idx + 1]);
                const dimmed = nextLocked && !isCompleted;
                return (
                  <Path
                    key={node.id}
                    d={`M ${x1} ${y1} C ${x1} ${cpY} ${x2} ${cpY} ${x2} ${y2}`}
                    stroke={dimmed ? colors.border : `url(#grad-${node.id})`}
                    strokeWidth={dimmed ? 2 : 5}
                    strokeDasharray={dimmed ? "6,6" : undefined}
                    strokeLinecap="round"
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
              const tint = tierColor(idx, course.color);
              return (
                <View
                  key={node.id}
                  style={{ position: "absolute", top: idx * VERTICAL_GAP + 70, left: 0, right: 0, alignItems: "center" }}
                >
                  <NodeItem
                    node={node}
                    course={course}
                    isCompleted={completed}
                    isLocked={locked}
                    posX={posX}
                    tint={tint}
                    onPress={() => { setSelectedNode(node); setSheetVisible(true); }}
                  />
                </View>
              );
            })}

            {/* FINISH badge */}
            <View style={{
              position: "absolute", bottom: 0, left: 0, right: 0, alignItems: "center", zIndex: 2,
            }}>
              <View style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100,
                backgroundColor: courseProgress === 100 ? colors.success : colors.foreground,
                flexDirection: "row", alignItems: "center", gap: 6,
                shadowColor: courseProgress === 100 ? colors.success : colors.foreground,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
              }}>
                <Icon name="trophy" size={14} color={courseProgress === 100 ? "#FFFFFF" : colors.background} />
                <Text style={{
                  fontSize: 11, fontFamily: "Nunito_800ExtraBold",
                  color: courseProgress === 100 ? "#FFFFFF" : colors.background, letterSpacing: 1.4,
                }}>
                  FINISH
                </Text>
              </View>
            </View>
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

      <CoursePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        selectedCourseIdx={selectedCourseIdx}
        onSelect={handleCourseSelect}
        completedLessons={state.completedLessons}
      />
    </View>
  );
}
