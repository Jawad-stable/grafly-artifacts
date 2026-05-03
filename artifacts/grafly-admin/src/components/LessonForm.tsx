import { useMemo } from "react";
import { Btn, Card, Field, NumberInput, Select, TextArea, TextInput, SectionHeader } from "./ui";
import QuestionForm from "./QuestionForm";
import {
  ALL_QUESTION_TYPES,
  emptyQuestion,
  moveItem,
  type LessonDoc,
  type QuestionDoc,
  type QuestionType,
} from "@/lib/courseTypes";

export default function LessonForm({
  lesson,
  onChange,
  onBack,
  onDelete,
}: {
  lesson: LessonDoc;
  onChange: (next: LessonDoc) => void;
  onBack: () => void;
  onDelete: () => void;
}) {
  function set<K extends keyof LessonDoc>(key: K, value: LessonDoc[K]) {
    onChange({ ...lesson, [key]: value });
  }

  function setIntro(patch: Partial<NonNullable<LessonDoc["intro"]>>) {
    const intro = { headline: "", body: "", ...(lesson.intro ?? {}), ...patch };
    onChange({ ...lesson, intro });
  }

  function updateQuestion(idx: number, next: QuestionDoc) {
    const qs = lesson.questions.slice();
    qs[idx] = next;
    onChange({ ...lesson, questions: qs });
  }

  function addQuestion(type: QuestionType) {
    const id = `${lesson.id}-q${lesson.questions.length + 1}-${Math.random().toString(36).slice(2, 6)}`;
    onChange({ ...lesson, questions: [...lesson.questions, emptyQuestion(id, type)] });
  }

  function deleteQuestion(idx: number) {
    if (!confirm("Delete this question?")) return;
    onChange({ ...lesson, questions: lesson.questions.filter((_, i) => i !== idx) });
  }

  const introSceneJson = useMemo(
    () => (lesson.intro?.scene ? JSON.stringify(lesson.intro.scene, null, 2) : ""),
    [lesson.intro?.scene],
  );

  function applyIntroScene(text: string) {
    const trimmed = text.trim();
    if (!trimmed) {
      const intro = { ...(lesson.intro ?? { headline: "", body: "" }) };
      delete intro.scene;
      onChange({ ...lesson, intro });
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      setIntro({ scene: parsed });
    } catch {
      // ignore until valid
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Btn variant="ghost" size="sm" onClick={onBack}>← Back to module</Btn>
        <Btn variant="danger" size="sm" onClick={onDelete}>Delete lesson</Btn>
      </div>

      <Card className="p-4 space-y-3">
        <SectionHeader title="Lesson details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Lesson ID (slug)">
            <TextInput
              value={lesson.id}
              onChange={(e) => set("id", e.target.value)}
              className="font-mono"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Title">
              <TextInput value={lesson.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
          </div>
        </div>
        <Field label="Description">
          <TextArea rows={2} value={lesson.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="XP reward">
            <NumberInput value={lesson.xpReward} onChange={(e) => set("xpReward", Number(e.target.value))} />
          </Field>
          <Field label="Coin reward">
            <NumberInput value={lesson.coinReward} onChange={(e) => set("coinReward", Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Critique prompt (optional)">
          <TextArea
            rows={2}
            value={lesson.critiquePrompt ?? ""}
            onChange={(e) => set("critiquePrompt", e.target.value || undefined)}
          />
        </Field>
      </Card>

      <Card className="p-4 space-y-3">
        <SectionHeader
          title="Intro"
          right={
            lesson.intro ? (
              <Btn
                size="sm"
                variant="ghost"
                onClick={() => {
                  const next = { ...lesson };
                  delete next.intro;
                  onChange(next);
                }}
              >
                Remove intro
              </Btn>
            ) : (
              <Btn size="sm" onClick={() => setIntro({})}>+ Add intro</Btn>
            )
          }
        />
        {lesson.intro && (
          <>
            <Field label="Headline">
              <TextInput value={lesson.intro.headline} onChange={(e) => setIntro({ headline: e.target.value })} />
            </Field>
            <Field label="Body">
              <TextArea
                rows={3}
                value={lesson.intro.body}
                onChange={(e) => setIntro({ body: e.target.value })}
              />
            </Field>
            <details className="border rounded-md">
              <summary className="cursor-pointer text-xs px-3 py-2 bg-muted text-muted-foreground hover:bg-accent">
                Advanced — Intro scene (JSON)
              </summary>
              <div className="p-3">
                <TextArea
                  rows={8}
                  defaultValue={introSceneJson}
                  spellCheck={false}
                  onBlur={(e) => applyIntroScene(e.target.value)}
                  className="font-mono text-xs"
                  placeholder='{"kind":"good_vs_bad", ...}'
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Optional Scene DSL. Leave empty to remove. Saved when you click outside.
                </div>
              </div>
            </details>
          </>
        )}
      </Card>

      <Card className="p-4 space-y-3">
        <SectionHeader
          title={`Questions (${lesson.questions.length})`}
          right={
            <div className="flex items-center gap-2">
              <Select
                onChange={(e) => {
                  if (!e.target.value) return;
                  addQuestion(e.target.value as QuestionType);
                  e.target.value = "";
                }}
                defaultValue=""
                className="max-w-[180px]"
              >
                <option value="" disabled>+ Add question…</option>
                {ALL_QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
          }
        />
        {lesson.questions.length === 0 && (
          <div className="text-sm text-muted-foreground">No questions yet. Add one to get started.</div>
        )}
        <div className="space-y-3">
          {lesson.questions.map((q, i) => (
            <QuestionForm
              key={`${q.id}-${i}`}
              q={q}
              onChange={(next) => updateQuestion(i, next)}
              onDelete={() => deleteQuestion(i)}
              onMoveUp={() => onChange({ ...lesson, questions: moveItem(lesson.questions, i, i - 1) })}
              onMoveDown={() => onChange({ ...lesson, questions: moveItem(lesson.questions, i, i + 1) })}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
