/**
 * Remote courses: fetch additional courses from Supabase at runtime so we can
 * publish new content WITHOUT shipping a new APK.
 *
 * Strategy:
 *   - On app start, try to fetch the `app_courses` table from Supabase.
 *   - Cache the result in AsyncStorage (offline + cold-start instant).
 *   - Merge with the bundled COURSES: remote rows with the same `id` override
 *     the bundled course; new ids are appended.
 *
 * Failure mode is safe: if Supabase is unreachable AND no cache exists, we
 * just use the bundled COURSES — the app keeps working exactly as before.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "./supabase";
import { COURSES, type Course } from "@/constants/lessons";

const CACHE_KEY = "@grafly_remote_courses_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

interface CachedPayload {
  fetchedAt: number;
  courses: Course[];
}

async function readCache(): Promise<CachedPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedPayload;
  } catch {
    return null;
  }
}

async function writeCache(courses: Course[]): Promise<void> {
  try {
    const payload: CachedPayload = { fetchedAt: Date.now(), courses };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // best-effort cache; ignore quota/serialization errors
  }
}

async function fetchFromSupabase(): Promise<Course[] | null> {
  try {
    const { data, error } = await supabase
      .from("app_courses")
      .select("id, order_idx, data, enabled")
      .eq("enabled", true)
      .order("order_idx", { ascending: true });
    if (error || !data) return null;
    return data
      .map((row: { data: Course }) => row.data)
      .filter((c): c is Course => !!c && typeof c.id === "string");
  } catch {
    return null;
  }
}

/**
 * Merge bundled + remote courses. Remote overrides bundled by id; new remote
 * courses are appended at the end so existing skill-tree positions stay stable.
 */
export function mergeCourses(bundled: Course[], remote: Course[]): Course[] {
  const remoteById = new Map(remote.map((c) => [c.id, c]));
  const merged: Course[] = bundled.map((c) => remoteById.get(c.id) ?? c);
  const bundledIds = new Set(bundled.map((c) => c.id));
  for (const c of remote) {
    if (!bundledIds.has(c.id)) merged.push(c);
  }
  return merged;
}

/**
 * Get the effective course list. Tries cache first for instant render, then
 * refreshes from Supabase in the background. Always falls back to bundled
 * COURSES so the app works offline / on first launch.
 */
export async function loadCourses(): Promise<Course[]> {
  const cached = await readCache();
  const cacheFresh =
    cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;

  // Kick off a background refresh whenever cache is missing or stale.
  if (!cacheFresh) {
    void (async () => {
      const fresh = await fetchFromSupabase();
      if (fresh) await writeCache(fresh);
    })();
  }

  if (cached) return mergeCourses(COURSES, cached.courses);
  // No cache yet — try a one-shot fetch with a short budget.
  const fresh = await Promise.race<Course[] | null>([
    fetchFromSupabase(),
    new Promise((resolve) => setTimeout(() => resolve(null), 1500)),
  ]);
  if (fresh) {
    await writeCache(fresh);
    return mergeCourses(COURSES, fresh);
  }
  return COURSES;
}
