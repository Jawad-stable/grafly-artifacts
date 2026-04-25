import type { PlacementLevel } from "@/context/GameContext";
import type { Lesson, Question } from "@/constants/lessons";

interface DifficultyProfile {
  min: number;
  max: number;
  order: "asc" | "desc";
  minKeep: number;
}

const PROFILES: Record<PlacementLevel, DifficultyProfile> = {
  novice:       { min: 1, max: 2, order: "asc",  minKeep: 2 },
  beginner:     { min: 1, max: 3, order: "asc",  minKeep: 2 },
  intermediate: { min: 2, max: 4, order: "asc",  minKeep: 2 },
  advanced:     { min: 3, max: 5, order: "desc", minKeep: 2 },
  expert:       { min: 4, max: 5, order: "desc", minKeep: 2 },
};

/**
 * Reorders and filters a lesson's questions to match the player's placement
 * level. Pros see harder questions first and skip the warm-ups; novices stay
 * in the easy band. Always returns at least `minKeep` questions when the
 * lesson has that many available, so a lesson never feels empty.
 */
export function adaptiveQuestions(
  lesson: Lesson,
  level: PlacementLevel
): Question[] {
  const profile = PROFILES[level] ?? PROFILES.intermediate;
  const all = lesson.questions ?? [];
  if (all.length === 0) return all;

  const inRange = all.filter((q) => {
    const d = q.difficulty ?? 3;
    return d >= profile.min && d <= profile.max;
  });

  // Top up if filtering would leave the lesson too thin — pull from
  // outside the band, preferring questions whose difficulty is closest
  // to the centre of the player's profile.
  const targetCount = Math.min(profile.minKeep, all.length);
  let kept = inRange.slice();
  if (kept.length < targetCount) {
    const centre = (profile.min + profile.max) / 2;
    const leftovers = all
      .filter((q) => !kept.includes(q))
      .sort(
        (a, b) =>
          Math.abs((a.difficulty ?? 3) - centre) -
          Math.abs((b.difficulty ?? 3) - centre)
      );
    while (kept.length < targetCount && leftovers.length > 0) {
      kept.push(leftovers.shift()!);
    }
  }

  // Sort by difficulty in the chosen direction; ties keep their authored order.
  const indexById = new Map<Question, number>(all.map((q, i) => [q, i]));
  const dir = profile.order === "asc" ? 1 : -1;
  kept.sort((a, b) => {
    const da = a.difficulty ?? 3;
    const db = b.difficulty ?? 3;
    if (da !== db) return (da - db) * dir;
    return (indexById.get(a) ?? 0) - (indexById.get(b) ?? 0);
  });

  return kept.map(shuffleOptions);
}

/**
 * Returns a copy of the question with multiple-choice options reshuffled and
 * the correct index remapped. No-op for question types whose option order is
 * meaningful (arrange_in_order, drag_to_match, fill_in_blank, etc.).
 */
export function shuffleOptions(q: Question): Question {
  if (!q.options || q.options.length <= 1) return q;
  if (typeof q.correctIndex !== "number") return q;
  if (q.type === "arrange_in_order") return q;

  const indices = q.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Skip the rare case where shuffling produced the same order — reroll once.
  const isUnchanged = indices.every((v, i) => v === i);
  if (isUnchanged && indices.length > 1) {
    [indices[0], indices[indices.length - 1]] = [indices[indices.length - 1], indices[0]];
  }

  const newOptions = indices.map((origIdx) => q.options![origIdx]);
  const newCorrect = indices.indexOf(q.correctIndex);

  return { ...q, options: newOptions, correctIndex: newCorrect };
}
