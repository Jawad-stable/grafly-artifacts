import { Btn, Card, Field, TextArea, TextInput, SectionHeader } from "./ui";
import { emptyLesson, moveItem, type LessonDoc, type ModuleDoc } from "@/lib/courseTypes";

export default function ModuleForm({
  module,
  onChange,
  onBack,
  onDelete,
  onOpenLesson,
}: {
  module: ModuleDoc;
  onChange: (next: ModuleDoc) => void;
  onBack: () => void;
  onDelete: () => void;
  onOpenLesson: (lessonId: string) => void;
}) {
  function set<K extends keyof ModuleDoc>(key: K, value: ModuleDoc[K]) {
    onChange({ ...module, [key]: value });
  }

  function addLesson() {
    const id = `${module.id}-l${module.lessons.length + 1}-${Math.random().toString(36).slice(2, 6)}`;
    const lesson: LessonDoc = emptyLesson(id);
    onChange({ ...module, lessons: [...module.lessons, lesson] });
    onOpenLesson(id);
  }

  function deleteLesson(idx: number) {
    if (!confirm(`Delete lesson "${module.lessons[idx].title}"?`)) return;
    onChange({ ...module, lessons: module.lessons.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Btn variant="ghost" size="sm" onClick={onBack}>← Back to course</Btn>
        <Btn variant="danger" size="sm" onClick={onDelete}>Delete module</Btn>
      </div>

      <Card className="p-4 space-y-3">
        <SectionHeader title="Module details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Module ID (slug)">
            <TextInput value={module.id} onChange={(e) => set("id", e.target.value)} className="font-mono" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Title">
              <TextInput value={module.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Icon (Ionicons name)" hint="e.g. contrast-outline, sparkles-outline">
            <TextInput value={module.icon} onChange={(e) => set("icon", e.target.value)} />
          </Field>
          <Field label="Prerequisites (comma-separated module IDs)">
            <TextInput
              value={module.prerequisites.join(", ")}
              onChange={(e) => set("prerequisites", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea rows={2} value={module.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </Card>

      <Card className="p-4 space-y-3">
        <SectionHeader
          title={`Lessons (${module.lessons.length})`}
          right={<Btn size="sm" variant="primary" onClick={addLesson}>+ Add lesson</Btn>}
        />
        {module.lessons.length === 0 && (
          <div className="text-sm text-muted-foreground">No lessons yet.</div>
        )}
        <div className="divide-y border rounded-md overflow-hidden">
          {module.lessons.map((l, i) => (
            <div key={`${l.id}-${i}`} className="flex items-center gap-2 px-3 py-2 hover:bg-accent/40">
              <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
              <button
                onClick={() => onOpenLesson(l.id)}
                className="flex-1 text-left min-w-0"
              >
                <div className="text-sm font-medium truncate">{l.title || "(untitled)"}</div>
                <div className="text-xs text-muted-foreground truncate">
                  <span className="font-mono">{l.id}</span> · {l.questions.length} q · {l.xpReward} XP
                </div>
              </button>
              <Btn size="sm" variant="ghost" onClick={() => onChange({ ...module, lessons: moveItem(module.lessons, i, i - 1) })}>↑</Btn>
              <Btn size="sm" variant="ghost" onClick={() => onChange({ ...module, lessons: moveItem(module.lessons, i, i + 1) })}>↓</Btn>
              <Btn size="sm" onClick={() => onOpenLesson(l.id)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => deleteLesson(i)}>×</Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
