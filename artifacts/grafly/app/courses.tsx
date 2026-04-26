import React from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeInDown, Easing } from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { COURSES } from "@/constants/lessons";
import { GraflyMascot } from "@/components/GraflyMascot";
import { PressScale } from "@/components/PressScale";
import { onBrand } from "@/constants/contrast";

export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();

  const paddingTop = insets.top + (Platform.OS === "web" ? 67 : 0);
  const paddingBottom = insets.bottom + (Platform.OS === "web" ? 34 : 24);

  const totalLessonsAll = COURSES.flatMap((c) => c.nodes.flatMap((n) => n.lessons)).length;
  const completedAll = COURSES
    .flatMap((c) => c.nodes.flatMap((n) => n.lessons))
    .filter((l) => state.completedLessons.includes(l.id)).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        entering={FadeInDown.duration(520).easing(Easing.out(Easing.cubic))}
        style={{
          paddingTop: paddingTop + 12,
          paddingHorizontal: 24,
          paddingBottom: 18,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <PressScale
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/");
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ width: 40, height: 40, borderRadius: 100, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="arrow-back" size={20} color={colors.foreground} />
          </PressScale>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: "Nunito_800ExtraBold", color: colors.mutedForeground, letterSpacing: 1.5 }}>
              EXPLORE
            </Text>
            <Text style={{ fontSize: 38, fontFamily: "Nunito_800ExtraBold", color: colors.foreground, letterSpacing: -1, lineHeight: 42 }}>
              Courses
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: colors.mutedForeground }}>
          {completedAll} of {totalLessonsAll} lessons complete across {COURSES.length} courses
        </Text>
      </Animated.View>

      <FlatList
        data={COURSES}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: paddingBottom, gap: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: course, index }) => {
          const totalLessons = course.nodes.flatMap((n) => n.lessons).length;
          const completedCount = course.nodes
            .flatMap((n) => n.lessons)
            .filter((l) => state.completedLessons.includes(l.id)).length;
          const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
          const mascotStates = ["think", "celebrate", "idle", "correct", "oops"] as const;
          const mascotState = mascotStates[index % mascotStates.length];
          const onCard = onBrand(course.color);

          return (
            <Animated.View entering={FadeIn.delay(80 + index * 60)}>
              <PressScale
                onPress={() => {
                  if (course.id === "design-principles") {
                    router.push({ pathname: "/course-intro", params: { courseId: course.id } });
                  } else {
                    router.push({ pathname: "/(tabs)/tree", params: { courseId: course.id } });
                  }
                }}
                style={{
                  height: 200,
                  borderRadius: 24,
                  backgroundColor: course.color,
                  overflow: "hidden",
                  shadowColor: course.color,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.16,
                  shadowRadius: 18,
                  elevation: 5,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Icon name={course.icon as any} size={12} color={onCard + "DD"} />
                      <Text style={{
                        fontSize: 10, fontFamily: "Nunito_800ExtraBold",
                        color: onCard + "DD", letterSpacing: 1.2,
                      }}>
                        COURSE
                      </Text>
                    </View>

                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 24, fontFamily: "Nunito_800ExtraBold",
                        color: onCard, lineHeight: 28, letterSpacing: -0.5,
                        marginTop: 8,
                      }}
                    >
                      {course.title}
                    </Text>
                    <Text
                      numberOfLines={3}
                      style={{
                        fontSize: 12, fontFamily: "Nunito_600SemiBold",
                        color: onCard + "CC", marginTop: 6, lineHeight: 17,
                      }}
                    >
                      {course.description}
                    </Text>
                  </View>

                  <View style={{ width: 130, position: "relative", overflow: "hidden" }}>
                    <View style={{
                      position: "absolute", left: 12, top: 14,
                      width: 24, height: 24, borderRadius: 12,
                      backgroundColor: colors.accent,
                    }} />
                    <View style={{
                      position: "absolute", right: 4, bottom: 4,
                      width: 130, height: 130, alignItems: "center", justifyContent: "center",
                    }}>
                      <GraflyMascot state={mascotState} size={120} />
                    </View>
                  </View>
                </View>

                <View style={{
                  paddingHorizontal: 18, paddingVertical: 12,
                  backgroundColor: onCard + "22",
                  gap: 8,
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: onCard }}>
                      {course.nodes.length} modules · {completedCount}/{totalLessons} lessons
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: onCard }}>
                      {progress}%
                    </Text>
                  </View>
                  {course.id === "design-principles" && course.nodes.length > 0 ? (
                    <View style={{ flexDirection: "row", gap: 4 }}>
                      {course.nodes.map((node) => {
                        const moduleTotal = node.lessons.length;
                        const moduleDone = node.lessons.filter((l) =>
                          state.completedLessons.includes(l.id)
                        ).length;
                        const ratio = moduleTotal > 0 ? moduleDone / moduleTotal : 0;
                        return (
                          <View
                            key={node.id}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: onCard + "33",
                              overflow: "hidden",
                            }}
                          >
                            <View
                              style={{
                                width: `${ratio * 100}%`,
                                height: "100%",
                                backgroundColor: onCard,
                                borderRadius: 2,
                              }}
                            />
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </PressScale>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
