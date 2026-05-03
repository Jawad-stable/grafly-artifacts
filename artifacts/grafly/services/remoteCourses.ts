/**
 * Remote courses: Supabase is the SINGLE source of truth for course content.
 * The bundled COURSES constant is no longer used as fallback content; the
 * `app_courses` table in Supabase holds every course.
 *
 * Strategy:
 *   - On startup, hand back any cached payload immediately for instant UX.
 *   - Always kick off a background refresh from Supabase.
 *   - If neither cache nor remote yields rows, return an empty list and let
 *     the UI surface a retry state. We never silently fall back to bundled
 *     content.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "./supabase";
import type { Course } from "@/constants/lessons";

const CACHE_KEY = "@grafly_remote_courses_v2";
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
 * Get the effective course list. Returns cached data immediately when fresh,
 * otherwise blocks on a one-shot remote fetch (with a budget) and caches it.
 * Returns an empty array if the remote is unreachable AND no cache exists —
 * the UI is responsible for showing a retry state.
 */
export async function loadCourses(): Promise<Course[]> {
  const cached = await readCache();
  const cacheFresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;

  if (cached && cacheFresh) {
    // Refresh in the background so the next launch is fully up-to-date.
    void (async () => {
      const fresh = await fetchFromSupabase();
      if (fresh && fresh.length > 0) await writeCache(fresh);
    })();
    return cached.courses;
  }

  // No fresh cache — try a one-shot fetch with a short budget.
  const fresh = await Promise.race<Course[] | null>([
    fetchFromSupabase(),
    new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
  ]);
  if (fresh && fresh.length > 0) {
    await writeCache(fresh);
    return fresh;
  }

  // Last resort: return whatever stale cache we have, even if expired.
  if (cached) return cached.courses;
  return [];
}

/**
 * Force a fresh fetch from Supabase, bypassing cache. Used by the retry
 * button in the UI when courses fail to load on first launch.
 */
export async function refreshCourses(): Promise<Course[] | null> {
  const fresh = await fetchFromSupabase();
  if (fresh && fresh.length > 0) {
    await writeCache(fresh);
    return fresh;
  }
  return null;
}

/**
 * Mint a short-lived signed URL for an image in the private `course-assets`
 * bucket.
 */
const SIGNED_TTL_SEC = 60 * 60; // 1 hour
const REFRESH_BEFORE_MS = 60 * 1000; // re-sign 1 min before expiry

interface SignedEntry {
  url: string;
  expiresAt: number;
}
const signedCache = new Map<string, SignedEntry>();

export async function getCourseAssetUrl(path: string): Promise<string | null> {
  const now = Date.now();
  const hit = signedCache.get(path);
  if (hit && hit.expiresAt - REFRESH_BEFORE_MS > now) return hit.url;
  try {
    const { data, error } = await supabase.storage
      .from("course-assets")
      .createSignedUrl(path, SIGNED_TTL_SEC);
    if (error || !data?.signedUrl) return null;
    signedCache.set(path, {
      url: data.signedUrl,
      expiresAt: now + SIGNED_TTL_SEC * 1000,
    });
    return data.signedUrl;
  } catch {
    return null;
  }
}
