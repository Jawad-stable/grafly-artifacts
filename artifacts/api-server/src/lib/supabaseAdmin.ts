import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env["EXPO_PUBLIC_SUPABASE_URL"] ?? "";
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";

let client: SupabaseClient | null = null;
if (url && serviceKey) {
  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabaseAdmin = client;
