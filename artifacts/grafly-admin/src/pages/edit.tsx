import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { getCourse, updateCourse, deleteCourse, getStoredPassword, type CourseRow } from "@/lib/api";

export default function EditCoursePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/courses/:id");
  const id = params?.id ? decodeURIComponent(params.id) : "";

  const [course, setCourse] = useState<CourseRow | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [orderIdx, setOrderIdx] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getStoredPassword()) {
      setLocation("/login");
      return;
    }
    if (!id) return;
    let cancelled = false;
    getCourse(id)
      .then((c) => {
        if (cancelled) return;
        setCourse(c);
        setJsonText(JSON.stringify(c.data, null, 2));
        setOrderIdx(c.order_idx);
        setEnabled(c.enabled);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [id, setLocation]);

  const parseError = useMemo(() => {
    if (!jsonText) return "Empty";
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

  async function onSave() {
    if (parseError) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const data = JSON.parse(jsonText);
      const updated = await updateCourse(id, {
        order_idx: orderIdx,
        enabled,
        data,
      });
      setCourse(updated);
      setStatus("Saved");
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete course "${id}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      setLocation("/");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function onFormat() {
    try {
      const v = JSON.parse(jsonText);
      setJsonText(JSON.stringify(v, null, 2));
    } catch {
      // leave as-is
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              ← Courses
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-lg font-semibold truncate font-mono">{id}</h1>
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <span className="text-sm text-emerald-600">{status}</span>
            )}
            <button
              onClick={onFormat}
              className="text-sm h-9 px-3 rounded-md border hover:bg-accent"
            >
              Format JSON
            </button>
            <button
              onClick={onDelete}
              className="text-sm h-9 px-3 rounded-md border border-destructive text-destructive hover:bg-destructive/10"
            >
              Delete
            </button>
            <button
              onClick={onSave}
              disabled={saving || !!parseError}
              className="text-sm h-9 px-4 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {!course && !error && (
          <div className="text-sm text-muted-foreground">Loading…</div>
        )}
        {error && (
          <div className="p-3 rounded-md border border-destructive text-sm text-destructive bg-destructive/5">
            {error}
          </div>
        )}
        {course && (
          <>
            <div className="bg-card border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {enabled ? "Visible in app" : "Hidden"}
                  </span>
                </div>
              </label>
              <div className="text-sm space-y-1">
                <div className="text-muted-foreground">JSON status</div>
                <div className="h-9 flex items-center text-sm">
                  {parseError ? (
                    <span className="text-destructive">Invalid: {parseError}</span>
                  ) : (
                    <span className="text-emerald-600">Valid JSON</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b text-sm text-muted-foreground bg-muted">
                course.data (JSONB)
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                spellCheck={false}
                className="w-full h-[70vh] p-4 font-mono text-xs bg-background resize-none focus:outline-none"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
