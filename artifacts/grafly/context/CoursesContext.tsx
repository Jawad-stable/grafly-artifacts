import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type Course,
  type Lesson,
  type SkillNode,
  type CurrentPosition,
} from "@/constants/lessons";
import { loadCourses, refreshCourses } from "@/services/remoteCourses";

interface CoursesContextValue {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Bound helpers — they read the live `courses` from context.
  getAllLessons: () => Lesson[];
  findNodeById: (nodeId: string) => SkillNode | undefined;
  findCourseByNodeId: (nodeId: string) => Course | undefined;
  getCurrentPosition: (completedLessons: string[]) => CurrentPosition;
}

const CoursesContext = createContext<CoursesContextValue | null>(null);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await loadCourses();
      if (fresh.length === 0) {
        setError("No courses available. Please check your connection and retry.");
      }
      setCourses(fresh);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    const fresh = await refreshCourses();
    if (fresh && fresh.length > 0) setCourses(fresh);
    else setError("Could not reach the course library. Check your connection.");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const getAllLessons = useCallback(
    (): Lesson[] => courses.flatMap((c) => c.nodes.flatMap((n) => n.lessons)),
    [courses],
  );

  const findNodeById = useCallback(
    (nodeId: string): SkillNode | undefined =>
      courses.flatMap((c) => c.nodes).find((n) => n.id === nodeId),
    [courses],
  );

  const findCourseByNodeId = useCallback(
    (nodeId: string): Course | undefined =>
      courses.find((c) => c.nodes.some((n) => n.id === nodeId)),
    [courses],
  );

  const getCurrentPosition = useCallback(
    (completedLessons: string[]): CurrentPosition => {
      for (let ci = 0; ci < courses.length; ci++) {
        const course = courses[ci];
        for (let ni = 0; ni < course.nodes.length; ni++) {
          const node = course.nodes[ni];
          const allDone = node.lessons.every((l) => completedLessons.includes(l.id));
          if (!allDone) {
            return {
              courseId: course.id,
              nodeId: node.id,
              courseIdx: ci,
              nodeIdx: ni,
              allComplete: false,
            };
          }
        }
      }
      const firstCourse = courses[0];
      const firstNode = firstCourse?.nodes[0];
      return {
        courseId: firstCourse?.id ?? "",
        nodeId: firstNode?.id ?? "",
        courseIdx: 0,
        nodeIdx: 0,
        allComplete: true,
      };
    },
    [courses],
  );

  const value = useMemo<CoursesContextValue>(
    () => ({
      courses,
      loading,
      error,
      refresh,
      getAllLessons,
      findNodeById,
      findCourseByNodeId,
      getCurrentPosition,
    }),
    [courses, loading, error, refresh, getAllLessons, findNodeById, findCourseByNodeId, getCurrentPosition],
  );

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export function useCourses(): CoursesContextValue {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error("useCourses must be used within CoursesProvider");
  return ctx;
}
