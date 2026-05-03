import { useEffect, useState } from "react";
import { COURSES, type Course } from "@/constants/lessons";
import { loadCourses } from "@/services/remoteCourses";

/**
 * Returns the effective course list (bundled + any remote courses cached or
 * freshly fetched from Supabase). `loading` is true on the very first render
 * while the async resolve is in flight; subsequent renders hand back the
 * resolved list. The fallback is always the bundled COURSES, so the UI never
 * has to deal with `null`.
 */
export function useRemoteCourses(): { courses: Course[]; loading: boolean } {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    let mounted = true;
    loadCourses().then((c) => {
      if (mounted) setCourses(c);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { courses: courses ?? COURSES, loading: courses === null };
}
