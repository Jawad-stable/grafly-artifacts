import { Hono } from "hono";
import type { Env } from "../types";

type AuthEnv = Env & {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const APP_SCHEME = "grafly://auth-callback";

function callbackUrl(requestUrl: string) {
  return `${new URL(requestUrl).origin}/auth/google/callback`;
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function hmacVerify(secret: string, data: string, sig: string): Promise<boolean> {
  return (await hmacSign(secret, data)) === sig;
}

const auth = new Hono<{ Bindings: AuthEnv }>();

auth.get("/auth/google", async (c) => {
  const nonce = `${Date.now()}:${crypto.randomUUID()}`;
  const sig = await hmacSign(c.env.GOOGLE_CLIENT_SECRET, nonce);
  const state = `${btoa(nonce)}.${sig}`;

  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", c.env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", callbackUrl(c.req.url));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "select_account");

  return c.redirect(url.toString());
});

auth.get("/auth/google/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const errorParam = c.req.query("error");

  if (errorParam) {
    return c.redirect(`${APP_SCHEME}?error=${encodeURIComponent(errorParam)}`);
  }

  if (!code || !state) {
    return c.redirect(`${APP_SCHEME}?error=missing_params`);
  }

  // Verify HMAC state to prevent CSRF
  const parts = state.split(".");
  if (parts.length !== 2) {
    return c.redirect(`${APP_SCHEME}?error=invalid_state`);
  }
  const nonce = atob(parts[0]);
  const valid = await hmacVerify(c.env.GOOGLE_CLIENT_SECRET, nonce, parts[1]);
  if (!valid) {
    return c.redirect(`${APP_SCHEME}?error=invalid_state`);
  }
  // Reject states older than 10 minutes
  const ts = parseInt(nonce.split(":")[0], 10);
  if (Date.now() - ts > 10 * 60 * 1000) {
    return c.redirect(`${APP_SCHEME}?error=state_expired`);
  }

  // Exchange code for Google tokens
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl(c.req.url),
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json<{ id_token?: string; error?: string }>();
  if (!tokenRes.ok || !tokenData.id_token) {
    return c.redirect(`${APP_SCHEME}?error=google_token_failed`);
  }

  // Exchange Google ID token for Supabase session
  const supabaseUrl = c.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnon = c.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

  const sbRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=id_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseAnon,
      "Authorization": `Bearer ${supabaseAnon}`,
    },
    body: JSON.stringify({ provider: "google", id_token: tokenData.id_token }),
  });

  const session = await sbRes.json<{
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  }>();

  if (!sbRes.ok || !session.access_token) {
    const msg = session.error_description ?? session.error ?? "supabase_auth_failed";
    return c.redirect(`${APP_SCHEME}?error=${encodeURIComponent(msg)}`);
  }

  return c.redirect(
    `${APP_SCHEME}#access_token=${session.access_token}&refresh_token=${session.refresh_token ?? ""}&token_type=bearer`
  );
});

export default auth;
