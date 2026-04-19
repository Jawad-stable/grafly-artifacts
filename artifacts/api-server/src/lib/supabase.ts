import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env["EXPO_PUBLIC_SUPABASE_URL"] ?? "";
const anonKey = process.env["EXPO_PUBLIC_SUPABASE_ANON_KEY"] ?? "";

let client: SupabaseClient | null = null;
if (url && anonKey) {
  client = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export const supabase = client;
