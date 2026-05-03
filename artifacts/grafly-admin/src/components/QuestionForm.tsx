import { useMemo } from "react";
import { Btn, Card, Field, NumberInput, Select, TextArea, TextInput, SectionHeader } from "./ui";
import { ALL_QUESTION_TYPES, SIMPLE_QUESTION_TYPES, type QuestionDoc, type QuestionType } from "@/lib/courseTypes";

function patch<T extends object>(obj: T, p: Partial<T>): T {
  return { ...obj, ...p };
}

export default function QuestionForm({
  q,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  q: QuestionDoc;
  onChange: (next: QuestionDoc) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const isSimple = SIMPLE_QUESTION_TYPES.includes(q.type);

  const advancedJson = useMemo(() => {
    const { id, type, question, explanation, difficulty, options, correctIndex, correctBool, template, blanks, acceptedAnswers, ...rest } = q;
    void id; void type; void question; void explanation; void difficulty;
    void options; void correctIndex; void correctBool; void template; void blanks; void acceptedAnswers;
    return JSON.stringify(rest, null, 2);
  }, [q]);

  function applyAdvanced(text: string) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return;
      const cleaned: QuestionDoc = {
        id: q.id,
        type: q.type,
        question: q.question,
        explanation: q.explanation,
        difficulty: q.difficulty,
        ...(q.options !== undefined && { options: q.options }),
        ...(q.correctIndex !== undefined && { correctIndex: q.correctIndex }),
        ...(q.correctBool !== undefined && { correctBool: q.correctBool }),
        ...(q.template !== undefined && { template: q.template }),
        ...(q.blanks !== undefined && { blanks: q.blanks }),
        ...(q.acceptedAnswers !== undefined && { acceptedAnswers: q.acceptedAnswers }),
        ...parsed,
      };
      onChange(cleaned);
    } catch {
      // ignore until valid
    }
  }

  function changeType(newType: QuestionType) {
    const next: QuestionDoc = { ...q, type: newType };
    if (newType === "multiple_choice") {
      next.options = q.options ?? ["", "", "", ""];
      next.correctIndex = q.correctIndex ?? 0;
      delete next.correctBool;
    } else if (newType === "true_false") {
      next.correctBool = q.correctBool ?? true;
      delete next.options;
      delete next.correctIndex;
    } else if (newType === "fill_in_blank") {
      next.template = q.template ?? "____";
      next.blanks = q.blanks ?? [""];
      next.acceptedAnswers = q.acceptedAnswers ?? [""];
    }
    onChange(next);
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs font-mono text-muted-foreground shrink-0">{q.id}</span>
          <Select value={q.type} onChange={(e) => changeType(e.target.value as QuestionType)} className="max-w-[200px]">
            {ALL_QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Btn size="sm" variant="ghost" onClick={onMoveUp} title="Move up">↑</Btn>
          <Btn size="sm" variant="ghost" onClick={onMoveDown} title="Move down">↓</Btn>
          <Btn size="sm" variant="danger" onClick={onDelete}>Delete</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-3">
          <Field label="Question prompt">
            <TextArea
              rows={2}
              value={q.question}
              onChange={(e) => onChange(patch(q, { question: e.target.value }))}
            />
          </Field>
        </div>
        <Field label="Difficulty (1–5)">
          <NumberInput
            min={1}
            max={5}
            value={q.difficulty}
            onChange={(e) => onChange(patch(q, { difficulty: Math.max(1, Math.min(5, Number(e.target.value))) as 1 | 2 | 3 | 4 | 5 }))}
          />
        </Field>
      </div>

      <Field label="Explanation (shown after answering)">
        <TextArea
          rows={2}
          value={q.explanation}
          onChange={(e) => onChange(patch(q, { explanation: e.target.value }))}
        />
      </Field>

      {q.type === "multiple_choice" && (
        <div>
          <SectionHeader
            title="Options"
            right={
              <Btn
                size="sm"
                onClick={() => onChange(patch(q, { options: [...(q.options ?? []), ""] }))}
              >
                + Add option
              </Btn>
            }
          />
          <div className="space-y-2">
            {(q.options ?? []).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctIndex === i}
                  onChange={() => onChange(patch(q, { correctIndex: i }))}
                  title="Correct answer"
                  className="h-4 w-4"
                />
                <TextInput
                  value={opt}
                  onChange={(e) => {
                    const next = [...(q.options ?? [])];
                    next[i] = e.target.value;
                    onChange(patch(q, { options: next }));
                  }}
                  placeholder={`Option ${i + 1}`}
                />
                <Btn
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const next = (q.options ?? []).filter((_, j) => j !== i);
                    let newIdx = q.correctIndex ?? 0;
                    if (newIdx === i) newIdx = 0;
                    else if (newIdx > i) newIdx -= 1;
                    onChange(patch(q, { options: next, correctIndex: newIdx }));
                  }}
                >
                  ×
                </Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {q.type === "true_false" && (
        <Field label="Correct answer">
          <div className="flex items-center gap-4 h-9">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={q.correctBool === true}
                onChange={() => onChange(patch(q, { correctBool: true }))}
              />
              True
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={q.correctBool === false}
                onChange={() => onChange(patch(q, { correctBool: false }))}
              />
              False
            </label>
          </div>
        </Field>
      )}

      {q.type === "fill_in_blank" && (
        <div className="space-y-3">
          <Field label="Template (use ____ for blanks)">
            <TextInput
              value={q.template ?? ""}
              onChange={(e) => onChange(patch(q, { template: e.target.value }))}
            />
          </Field>
          <Field label="Accepted answers (comma-separated)">
            <TextInput
              value={(q.acceptedAnswers ?? []).join(", ")}
              onChange={(e) => onChange(patch(q, {
                acceptedAnswers: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              }))}
            />
          </Field>
        </div>
      )}

      {!isSimple && (
        <div className="text-xs p-3 rounded-md border bg-muted text-muted-foreground">
          This question type uses a custom interactive scene. Edit type-specific fields in the Advanced JSON below.
        </div>
      )}

      <details className="border rounded-md">
        <summary className="cursor-pointer text-xs px-3 py-2 bg-muted text-muted-foreground hover:bg-accent">
          Advanced (extra fields & scene JSON)
        </summary>
        <div className="p-3">
          <TextArea
            rows={8}
            defaultValue={advancedJson}
            spellCheck={false}
            onBlur={(e) => applyAdvanced(e.target.value)}
            className="font-mono text-xs"
            placeholder="{}"
          />
          <div className="text-xs text-muted-foreground mt-1">
            Anything not handled by the form above (e.g. <code>scene</code>, <code>pairs</code>, <code>correctOrder</code>). Saved when you click outside the box.
          </div>
        </div>
      </details>
    </Card>
  );
}
