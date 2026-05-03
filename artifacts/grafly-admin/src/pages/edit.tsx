import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  getCourse,
  updateCourse,
  deleteCourse,
  getStoredPassword,
  type CourseRow,
} from "@/lib/api";
import { Btn, Card, ColorSwatchInput, Field, NumberInput, SectionHeader, TextArea, TextInput } from "@/components/ui";
import LessonForm from "@/components/LessonForm";
import ModuleForm from "@/components/ModuleForm";
import { emptyModule, moveItem, type CourseDoc, type LessonDoc, type ModuleDoc } from "@/lib/courseTypes";

type View =
  | { kind: "course" }
  | { kind: "module"; moduleId: string }
  | { kind: "lesson"; moduleId: string; lessonId: string }
  | { kind: "raw" };

export default function EditCoursePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/courses/:id");
  const id = params?.id ? decodeURIComponent(params.id) : "";

  const [row, setRow] = useState<CourseRow | null>(null);
  const [doc, setDoc] = useState<CourseDoc | null>(null);
  const [orderIdx, setOrderIdx] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [view, setView] = useState<View>({ kind: "course" });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [rawText, setRawText] = useState("");

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
        setRow(c);
        setDoc(c.data as CourseDoc);
        setOrderIdx(c.order_idx);
        setEnabled(c.enabled);
        setRawText(JSON.stringify(c.data, null, 2));
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => { cancelled = true; };
  }, [id, setLocation]);

  function updateDoc(next: CourseDoc) {
    setDoc(next);
    setDirty(true);
  }

  function updateModule(moduleId: string, next: ModuleDoc) {
    if (!doc) return;
    updateDoc({ ...doc, nodes: doc.nodes.map((m) => (m.id === moduleId ? next : m)) });
  }

  function updateLesson(moduleId: string, lessonId: string, next: LessonDoc) {
    if (!doc) return;
    const nodes = doc.nodes.map((m) =>
      m.id !== moduleId
        ? m
        : { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? next : l)) },
    );
    updateDoc({ ...doc, nodes });
  }

  async function onSave() {
    if (!doc) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const updated = await updateCourse(id, {
        order_idx: orderIdx,
        enabled,
        data: doc,
      });
      setRow(updated);
      setDoc(updated.data as CourseDoc);
      setRawText(JSON.stringify(updated.data, null, 2));
      setDirty(false);
      setStatus("Saved");
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteCourse() {
    if (!confirm(`Delete course "${id}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      setLocation("/");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function applyRaw() {
    try {
      const parsed = JSON.parse(rawText);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        setError("Top-level JSON must be an object");
        return;
      }
      setError(null);
      updateDoc(parsed as CourseDoc);
      setStatus("Applied — click Save to persist");
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
    }
  }

  const breadcrumb = useMemo(() => {
    if (!doc) return null;
    const parts: { label: string; onClick?: () => void }[] = [
      { label: doc.title || id, onClick: () => setView({ kind: "course" }) },
    ];
    if (view.kind === "module" || view.kind === "lesson") {
      const m = doc.nodes.find((x) => x.id === view.moduleId);
      parts.push({ label: m?.title ?? view.moduleId, onClick: () => setView({ kind: "module", moduleId: view.moduleId }) });
    }
    if (view.kind === "lesson") {
      const m = doc.nodes.find((x) => x.id === view.moduleId);
      const l = m?.lessons.find((x) => x.id === view.lessonId);
      parts.push({ label: l?.title ?? view.lessonId });
    }
    if (view.kind === "raw") {
      parts.push({ label: "Raw JSON" });
    }
    return parts;
  }, [doc, view, id]);

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 text-sm">
            <Link href="/" className="text-muted-foreground hover:underline">Courses</Link>
            {breadcrumb?.map((b, i) => (
              <span key={i} className="flex items-center gap-2 min-w-0">
                <span className="text-muted-foreground">/</span>
                {b.onClick ? (
                  <button onClick={b.onClick} className="hover:underline truncate max-w-[200px]">
                    {b.label}
                  </button>
                ) : (
                  <span className="font-medium truncate max-w-[200px]">{b.label}</span>
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
            {status && <span className="text-xs text-emerald-600">{status}</span>}
            <Btn size="sm" onClick={() => setView({ kind: "raw" })}>Raw JSON</Btn>
            <Btn variant="primary" size="sm" onClick={onSave} disabled={saving || !doc}>
              {saving ? "Saving…" : "Save"}
            </Btn>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {!doc && !error && <div className="text-sm text-muted-foreground">Loading…</div>}
        {error && (
          <div className="p-3 rounded-md border border-destructive text-sm text-destructive bg-destructive/5">
            {error}
          </div>
        )}

        {doc && view.kind === "course" && (
          <CourseView
            doc={doc}
            orderIdx={orderIdx}
            enabled={enabled}
            onChangeDoc={updateDoc}
            onChangeOrder={(n) => { setOrderIdx(n); setDirty(true); }}
            onChangeEnabled={(v) => { setEnabled(v); setDirty(true); }}
            onOpenModule={(mid) => setView({ kind: "module", moduleId: mid })}
            onDeleteCourse={onDeleteCourse}
          />
        )}

        {doc && view.kind === "module" && (() => {
          const m = doc.nodes.find((x) => x.id === view.moduleId);
          if (!m) return <div className="text-sm text-muted-foreground">Module not found.</div>;
          return (
            <ModuleForm
              module={m}
              onChange={(next) => updateModule(view.moduleId, next)}
              onBack={() => setView({ kind: "course" })}
              onDelete={() => {
                if (!confirm(`Delete module "${m.title}" and all its lessons?`)) return;
                updateDoc({ ...doc, nodes: doc.nodes.filter((x) => x.id !== m.id) });
                setView({ kind: "course" });
              }}
              onOpenLesson={(lid) => setView({ kind: "lesson", moduleId: m.id, lessonId: lid })}
            />
          );
        })()}

        {doc && view.kind === "lesson" && (() => {
          const m = doc.nodes.find((x) => x.id === view.moduleId);
          const l = m?.lessons.find((x) => x.id === view.lessonId);
          if (!m || !l) return <div className="text-sm text-muted-foreground">Lesson not found.</div>;
          return (
            <LessonForm
              lesson={l}
              onChange={(next) => updateLesson(m.id, l.id, next)}
              onBack={() => setView({ kind: "module", moduleId: m.id })}
              onDelete={() => {
                if (!confirm(`Delete lesson "${l.title}"?`)) return;
                const nextModule: ModuleDoc = { ...m, lessons: m.lessons.filter((x) => x.id !== l.id) };
                updateModule(m.id, nextModule);
                setView({ kind: "module", moduleId: m.id });
              }}
            />
          );
        })()}

        {doc && view.kind === "raw" && (
          <Card className="p-4 space-y-3">
            <SectionHeader
              title="Raw JSON (entire course.data)"
              right={
                <div className="flex gap-2">
                  <Btn size="sm" onClick={() => { setRawText(JSON.stringify(doc, null, 2)); }}>
                    Reload from form
                  </Btn>
                  <Btn size="sm" variant="primary" onClick={applyRaw}>Apply to form</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setView({ kind: "course" })}>Done</Btn>
                </div>
              }
            />
            <TextArea
              rows={28}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              spellCheck={false}
              className="font-mono text-xs"
            />
            <div className="text-xs text-muted-foreground">
              Edit anything not exposed by the forms. "Apply to form" parses it back into the editor; then click "Save" to persist.
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

function CourseView({
  doc,
  orderIdx,
  enabled,
  onChangeDoc,
  onChangeOrder,
  onChangeEnabled,
  onOpenModule,
  onDeleteCourse,
}: {
  doc: CourseDoc;
  orderIdx: number;
  enabled: boolean;
  onChangeDoc: (next: CourseDoc) => void;
  onChangeOrder: (n: number) => void;
  onChangeEnabled: (v: boolean) => void;
  onOpenModule: (id: string) => void;
  onDeleteCourse: () => void;
}) {
  function set<K extends keyof CourseDoc>(key: K, value: CourseDoc[K]) {
    onChangeDoc({ ...doc, [key]: value });
  }

  function addModule() {
    const id = `${doc.id}-m${doc.nodes.length + 1}-${Math.random().toString(36).slice(2, 6)}`;
    onChangeDoc({ ...doc, nodes: [...doc.nodes, emptyModule(id, doc.id)] });
    onOpenModule(id);
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <SectionHeader title="Course details" right={<Btn size="sm" variant="danger" onClick={onDeleteCourse}>Delete course</Btn>} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Course ID (slug)">
            <TextInput value={doc.id} onChange={(e) => set("id", e.target.value)} className="font-mono" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Title">
              <TextInput value={doc.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Icon (Ionicons name)" hint="e.g. grid-outline, color-palette-outline">
            <TextInput value={doc.icon} onChange={(e) => set("icon", e.target.value)} />
          </Field>
          <Field label="Theme color (hex)">
            <ColorSwatchInput value={doc.color} onChange={(v) => set("color", v)} />
          </Field>
          <Field label="Order index">
            <NumberInput value={orderIdx} onChange={(e) => onChangeOrder(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Description">
          <TextArea rows={2} value={doc.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Enabled (visible in app)">
          <div className="h-9 flex items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onChangeEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="ml-2 text-sm">{enabled ? "Visible to users" : "Hidden"}</span>
          </div>
        </Field>
      </Card>

      <Card className="p-4 space-y-3">
        <SectionHeader
          title={`Modules (${doc.nodes.length})`}
          right={<Btn size="sm" variant="primary" onClick={addModule}>+ Add module</Btn>}
        />
        {doc.nodes.length === 0 && <div className="text-sm text-muted-foreground">No modules yet.</div>}
        <div className="divide-y border rounded-md overflow-hidden">
          {doc.nodes.map((m, i) => (
            <div key={`${m.id}-${i}`} className="flex items-center gap-2 px-3 py-2 hover:bg-accent/40">
              <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
              <button onClick={() => onOpenModule(m.id)} className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium truncate">{m.title || "(untitled)"}</div>
                <div className="text-xs text-muted-foreground truncate">
                  <span className="font-mono">{m.id}</span> · {m.lessons.length} lessons · icon: {m.icon}
                </div>
              </button>
              <Btn size="sm" variant="ghost" onClick={() => onChangeDoc({ ...doc, nodes: moveItem(doc.nodes, i, i - 1) })}>↑</Btn>
              <Btn size="sm" variant="ghost" onClick={() => onChangeDoc({ ...doc, nodes: moveItem(doc.nodes, i, i + 1) })}>↓</Btn>
              <Btn size="sm" onClick={() => onOpenModule(m.id)}>Edit</Btn>
              <Btn
                size="sm"
                variant="danger"
                onClick={() => {
                  if (!confirm(`Delete module "${m.title}" and all its lessons?`)) return;
                  onChangeDoc({ ...doc, nodes: doc.nodes.filter((x) => x.id !== m.id) });
                }}
              >
                ×
              </Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
