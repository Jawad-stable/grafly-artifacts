import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { createCourse } from "@/lib/api";

const TEMPLATE = {
  title: "New Course",
  description: "",
  modules: [],
};

export default function NewCoursePage() {
  const [, setLocation] = useLocation();
  const [id, setId] = useState("");
  const [orderIdx, setOrderIdx] = useState(100);
  const [enabled, setEnabled] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(TEMPLATE, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const parseError = useMemo(() => {
    try {
      const v = JSON.parse(jsonText);
      if (typeof v !== "object" || v === null || Array.isArray(v)) {
        return "Top-level JSON must be an object";
      }
      return null;
    } catch (err) {
      return (err as Error).message;
    }
  }, [jsonText]);

  async function onCreate() {
    if (parseError) return;
    if (!id.trim()) {
      setError("ID is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const data = JSON.parse(jsonText);
      const created = await createCourse({
        id: id.trim(),
        order_idx: orderIdx,
        enabled,
        data,
      });
      setLocation(`/courses/${encodeURIComponent(created.id)}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              ← Courses
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-lg font-semibold">New course</h1>
          </div>
          <button
            onClick={onCreate}
            disabled={saving || !!parseError || !id.trim()}
            className="text-sm h-9 px-4 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {error && (
          <div className="p-3 rounded-md border border-destructive text-sm text-destructive bg-destructive/5">
            {error}
          </div>
        )}
        <div className="bg-card border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm space-y-1">
            <div className="text-muted-foreground">Course ID (slug)</div>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. layout-fundamentals"
              className="w-full h-9 px-3 rounded-md border bg-background text-sm font-mono"
            />
          </label>
          <label className="text-sm space-y-1">
            <div className="text-muted-foreground">Order index</div>
            <input
              type="number"
              value={orderIdx}
              onChange={(e) => setOrderIdx(Number(e.target.value))}
              className="w-full h-9 px-3 rounded-md border bg-background text-sm"
            />
          </label>
          <label className="text-sm space-y-1">
            <div className="text-muted-foreground">Enabled</div>
            <div className="h-9 flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="ml-2 text-sm">
                {enabled ? "Visible in app" : "Hidden (recommended for drafts)"}
              </span>
            </div>
          </label>
        </div>
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b text-sm text-muted-foreground bg-muted flex justify-between">
            <span>course.data (JSONB)</span>
            <span className={parseError ? "text-destructive" : "text-emerald-600"}>
              {parseError ? `Invalid: ${parseError}` : "Valid JSON"}
            </span>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            className="w-full h-[60vh] p-4 font-mono text-xs bg-background resize-none focus:outline-none"
          />
        </div>
      </main>
    </div>
  );
}
