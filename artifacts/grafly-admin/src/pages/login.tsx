import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ok = await login(password);
      if (!ok) {
        setError("Invalid password");
      } else {
        setLocation("/");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-card rounded-lg shadow-sm border p-6 space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Grafly Admin</h1>
          <p className="text-sm text-muted-foreground">
            Enter the admin password to manage course content.
          </p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          autoFocus
          className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
