import { createClient } from "@supabase/supabase-js";
import type { Env } from "../types";

export function getSupabaseAdmin(env: Env) {
  if (!env.EXPO_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
