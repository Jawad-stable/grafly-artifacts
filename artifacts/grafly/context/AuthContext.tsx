import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/services/supabase";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // True while we are exchanging a deep-link (OAuth or password recovery) for a session.
  resolvingDeepLink: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; completed: boolean }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const redirectTo = Linking.createURL("auth-callback");

async function exchangeCodeFromUrl(url: string): Promise<{ error: string | null; session: Session | null }> {
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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    return { error: error?.message ?? null, session: data?.session ?? null };
  }
  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return { error: error?.message ?? null, session: data?.session ?? null };
  }
  return { error: "OAuth callback missing credentials.", session: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // We use a ref counter for in-flight deep-link exchanges so overlapping
  // invocations (e.g. cold-start initial URL + an immediate "url" event) do
  // not race each other when toggling a single boolean.
  const inFlightRef = useRef(0);
  const [inFlightCount, setInFlightCount] = useState(0);
  const resolvingDeepLink = inFlightCount > 0;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Handle deep links coming back from OAuth providers / password recovery emails.
    const looksLikeAuthLink = (url: string) => {
      const lower = url.toLowerCase();
      return (
        lower.includes("auth-callback") ||
        lower.includes("code=") ||
        lower.includes("access_token=") ||
        lower.includes("type=recovery")
      );
    };

    const beginExchange = () => {
      inFlightRef.current += 1;
      setInFlightCount(inFlightRef.current);
    };
    const endExchange = () => {
      inFlightRef.current = Math.max(0, inFlightRef.current - 1);
      setInFlightCount(inFlightRef.current);
    };

    const processUrl = async (url: string) => {
      if (!looksLikeAuthLink(url)) return;
      beginExchange();
      try {
        const { session: nextSession } = await exchangeCodeFromUrl(url);
        // Immediately set the session so consumers do not race with the
        // onAuthStateChange callback timing.
        if (nextSession) setSession(nextSession);
      } finally {
        endExchange();
      }
    };

    const handleUrl = ({ url }: { url: string }) => { processUrl(url); };
    const sub = Linking.addEventListener("url", handleUrl);
    Linking.getInitialURL().then((url) => { if (url) processUrl(url); });

    return () => {
      subscription.unsubscribe();
      sub.remove();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message, needsConfirmation: false };
    // If a session is returned, email confirmation is disabled and the user is in
    const needsConfirmation = !data.session;
    return { error: null, needsConfirmation };
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
    if (error) return { error: error.message, completed: false };
    if (!data?.url) return { error: "Failed to start Google sign-in.", completed: false };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === "success" && result.url) {
      const { error: exErr } = await exchangeCodeFromUrl(result.url);
      return { error: exErr, completed: !exErr };
    }
    if (result.type === "cancel" || result.type === "dismiss") {
      return { error: null, completed: false };
    }
    return { error: "Google sign-in did not complete.", completed: false };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, resolvingDeepLink, signUp, signIn, signInWithGoogle, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
