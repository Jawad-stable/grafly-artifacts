export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_in_blank"
  | "image_id"
  | "spot_the_difference"
  | "tap_the_element"
  | "arrange_in_order"
  | "drag_to_match"
  | "spot_bad_design"
  | "choose_better_design"
  | "drag_drop_layout"
  | "five_second_test"
  | "find_the_cta"
  | "color_match"
  | "contrast_check"
  | "palette_build"
  | "drag_match";

export const SIMPLE_QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "true_false",
  "fill_in_blank",
];

export const ALL_QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "image_id",
  "spot_the_difference",
  "tap_the_element",
  "arrange_in_order",
  "drag_to_match",
  "spot_bad_design",
  "choose_better_design",
  "drag_drop_layout",
  "five_second_test",
  "find_the_cta",
  "color_match",
  "contrast_check",
  "palette_build",
  "drag_match",
];

export interface QuestionDoc {
  id: string;
  type: QuestionType;
  question: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  options?: string[];
  correctIndex?: number;
  correctBool?: boolean;
  template?: string;
  blanks?: string[];
  acceptedAnswers?: string[];
  scene?: unknown;
  [k: string]: unknown;
}

export interface LessonIntroDoc {
  headline: string;
  body: string;
  scene?: unknown;
}

export interface LessonDoc {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  questions: QuestionDoc[];
  intro?: LessonIntroDoc;
  critiquePrompt?: string;
  [k: string]: unknown;
}

export interface ModuleDoc {
  id: string;
  title: string;
  icon: string;
  description: string;
  courseId: string;
  prerequisites: string[];
  lessons: LessonDoc[];
  [k: string]: unknown;
}

export interface CourseDoc {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  nodes: ModuleDoc[];
  [k: string]: unknown;
}

export function emptyQuestion(id: string, type: QuestionType = "multiple_choice"): QuestionDoc {
  const base: QuestionDoc = {
    id,
    type,
    question: "",
    explanation: "",
    difficulty: 2,
  };
  if (type === "multiple_choice") {
    base.options = ["", "", "", ""];
    base.correctIndex = 0;
  } else if (type === "true_false") {
    base.correctBool = true;
  } else if (type === "fill_in_blank") {
    base.template = "____ is the answer";
    base.blanks = [""];
    base.acceptedAnswers = [""];
  }
  return base;
}

export function emptyLesson(id: string): LessonDoc {
  return {
    id,
    title: "New lesson",
    description: "",
    xpReward: 10,
    coinReward: 5,
    questions: [],
    intro: { headline: "", body: "" },
  };
}

export function emptyModule(id: string, courseId: string): ModuleDoc {
  return {
    id,
    title: "New module",
    icon: "sparkles-outline",
    description: "",
    courseId,
    prerequisites: [],
    lessons: [],
  };
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
