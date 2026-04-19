import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "@/services/supabase";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const redirectTo = makeRedirectUri({ scheme: "grafly", path: "auth-callback" });

async function exchangeCodeFromUrl(url: string) {
  const parsed = Linking.parse(url);
  const params = (parsed.queryParams ?? {}) as Record<string, string | string[] | undefined>;
  // Some providers return tokens in the URL fragment instead of query
  const hashIndex = url.indexOf("#");
  if (hashIndex >= 0) {
    const fragment = url.slice(hashIndex + 1);
    for (const part of fragment.split("&")) {
      const [k, v] = part.split("=");
      if (k && v && !(k in params)) params[k] = decodeURIComponent(v);
    }
  }
  const code = typeof params.code === "string" ? params.code : undefined;
  const accessToken = typeof params.access_token === "string" ? params.access_token : undefined;
  const refreshToken = typeof params.refresh_token === "string" ? params.refresh_token : undefined;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return { error: error?.message ?? null };
  }
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return { error: error?.message ?? null };
  }
  return { error: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Handle deep links coming back from OAuth providers
    const handleUrl = ({ url }: { url: string }) => {
      exchangeCodeFromUrl(url);
    };
    const sub = Linking.addEventListener("url", handleUrl);
    Linking.getInitialURL().then((url) => { if (url) exchangeCodeFromUrl(url); });

    return () => {
      subscription.unsubscribe();
      sub.remove();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) return { error: error.message };
    if (!data?.url) return { error: "Failed to start Google sign-in." };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === "success" && result.url) {
      const { error: exErr } = await exchangeCodeFromUrl(result.url);
      return { error: exErr };
    }
    if (result.type === "cancel" || result.type === "dismiss") {
      return { error: null };
    }
    return { error: "Google sign-in did not complete." };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
