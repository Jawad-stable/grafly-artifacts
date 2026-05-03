// Critique-tab constants. Extracted from app/(tabs)/critique.tsx so the
// screen file can focus on layout + lifecycle, and the constants can be
// re-used by sub-components (CritiqueOnboarding references the reward
// numbers in its tooltip copy, etc.).

import type { Language } from "@/lib/i18n";

export const XP_PER_SESSION = 20;
export const COINS_PER_SESSION = 8;
export const MIN_USER_TURNS_FOR_REWARD = 3;
export const TYPEWRITER_SPEED_MS = 14;

export const ONBOARDING_KEY = "grafly:critique_onboarding_seen_v1";

export interface QuickPrompt {
  label: string;
  icon: string;
  prompt: string;
}

const QUICK_PROMPTS_EN: QuickPrompt[] = [
  { label: "First impression", icon: "flash", prompt: "First impression: " },
  {
    label: "Color & contrast",
    icon: "color-filter",
    prompt: "How is color and contrast working here? ",
  },
  {
    label: "Hierarchy",
    icon: "layers-outline",
    prompt: "Walk me through the visual hierarchy. ",
  },
  {
    label: "Typography",
    icon: "text-outline",
    prompt: "Critique the typography choices. ",
  },
  {
    label: "Layout",
    icon: "grid-outline",
    prompt: "How does the layout balance the elements? ",
  },
  {
    label: "What to improve",
    icon: "pencil",
    prompt: "If you could change one thing, what would it be and why? ",
  },
];

const QUICK_PROMPTS_AR: QuickPrompt[] = [
  { label: "أوّل انطباع", icon: "flash", prompt: "أوّل انطباع: " },
  {
    label: "اللون والتباين",
    icon: "color-filter",
    prompt: "كيف اللون والتباين شغّالين هون؟ ",
  },
  {
    label: "التسلسل",
    icon: "layers-outline",
    prompt: "خلّيك معي بالتسلسل البصري خطوة خطوة. ",
  },
  {
    label: "الخطوط",
    icon: "text-outline",
    prompt: "ناقدلي خيارات الخطوط. ",
  },
  {
    label: "التخطيط",
    icon: "grid-outline",
    prompt: "كيف التخطيط موازن بين العناصر؟ ",
  },
  {
    label: "شو نطوّر",
    icon: "pencil",
    prompt: "لو بتقدر تغيّر شي واحد بس، شو بيكون وليش؟ ",
  },
];

export function getQuickPrompts(lang: Language): QuickPrompt[] {
  return lang === "ar" ? QUICK_PROMPTS_AR : QUICK_PROMPTS_EN;
}

// Backwards-compat export in case anything imports the EN list directly.
export const QUICK_PROMPTS = QUICK_PROMPTS_EN;

const OPENERS_EN: Array<(title: string) => string> = [
  (t) =>
    `Take ten seconds with "${t}" before you read anything else.\n\nWhere does your eye land first, and what do you think pulled it there?`,
  (t) =>
    `Here's "${t}".\n\nWhat feeling does it give you in the first second — before you start analyzing it?`,
  (t) =>
    `Three words for "${t}". The first ones that come to mind, not the polished ones.\n\nWhich of the three is the design earning hardest right now?`,
  (t) =>
    `Look at "${t}" and trace your eye's path: first stop, second stop, third stop.\n\nWhat's the designer using to lead you between them?`,
  (t) =>
    `What problem is "${t}" actually solving for whoever opens it?\n\nThe layout will tell you, if you watch how it's prioritising things.`,
  (t) =>
    `One thing in "${t}" that's working confidently. One thing that still feels like it's figuring itself out.\n\nWhich is which, in your read?`,
  (t) =>
    `If "${t}" had to lose one element to feel cleaner, which would you cut?\n\nAnd what would the screen quietly gain without it?`,
  (t) =>
    `In "${t}", color and typography are splitting the work somehow.\n\nWhich one is doing the heavier lifting — and is that the right call?`,
  (t) =>
    `Of contrast, hierarchy, rhythm, and balance — which one is loudest in "${t}" right now?\n\nPoint me to where you see it.`,
  (t) =>
    `"${t}" is quietly asking the viewer to do something.\n\nWhat action, and what's making the invitation feel obvious (or not)?`,
  (t) =>
    `Cover the bottom half of "${t}" with your hand for a moment. Then the top half.\n\nWhich half could stand on its own, and which one needs the other?`,
  (t) =>
    `If "${t}" landed in your feed at thumbnail size, what would still survive?\n\nThat's usually the real design — the rest is supporting cast.`,
];

const OPENERS_AR: Array<(title: string) => string> = [
  (t) =>
    `خذ عشر ثواني مع "${t}" قبل ما تقرأ أي شي.\n\nوين عينك بتروح أوّل إشي، وشو اللي شدّ عينك لهناك؟`,
  (t) =>
    `هاد "${t}".\n\nشو الإحساس اللي بيعطيك إيّاه بأوّل ثانية — قبل ما تبلّش تحلّله؟`,
  (t) =>
    `ثلاث كلمات عن "${t}". أوّل اللي بتيجي ببالك، مش المنمّقة.\n\nمن هالثلاثة، أي كلمة التصميم مستحقّها أكتر حالياً؟`,
  (t) =>
    `طالع "${t}" وتتبّع طريق عينك: محطّة أولى، ثانية، ثالثة.\n\nشو المصمّم مستخدم ليوديك من وحدة للثانية؟`,
  (t) =>
    `شو المشكلة اللي "${t}" فعلاً عم يحلّها لأي حدا بيفتحه؟\n\nالتخطيط رح يقلّك، إذا انتبهت كيف عم يرتّب أولوياته.`,
  (t) =>
    `إشي بـ"${t}" شغّال بثقة. وإشي لسّا حاسس حالو عم يدوّر على نفسه.\n\nمن قراءتك، أيّ هاد وأيّ هاد؟`,
  (t) =>
    `لو "${t}" لازم يخسر عنصر واحد ليصير أنضف، شو بتشيل؟\n\nوشو الشاشة بهدوء رح تربح من غيره؟`,
  (t) =>
    `بـ"${t}" اللون والخطوط عم يقتسموا الشغل بطريقة معيّنة.\n\nأيّ وحدة عم تشيل الحمل الأكبر — وهاد القرار الصح؟`,
  (t) =>
    `من التباين، التسلسل، الإيقاع، والتوازن — أيّ وحدة الأعلى صوتاً بـ"${t}" هلأ؟\n\nورجيني وين شايفها.`,
  (t) =>
    `"${t}" عم يطلب من اللي شايفه يعمل شي بهدوء.\n\nشو هاد الشي، وشو اللي عم يخلّي الدعوة واضحة (أو لأ)؟`,
  (t) =>
    `غطّي النصف التحتاني من "${t}" بإيدك للحظة. وبعدين النصف الفوقاني.\n\nأيّ نصف بيقدر يقف لحالو، وأيّ واحد محتاج التاني؟`,
  (t) =>
    `لو "${t}" نزل بصورة مصغّرة على فيدك، شو اللي بيظل واصل؟\n\nهاد عادةً التصميم الحقيقي — الباقي ممثّلين مساعدين.`,
];

// Pick a random opener for the supplied design title. Pure function so
// the screen can call it from inside loadNewDesign without pulling in
// the openers list directly.
export function pickOpener(title: string, lang: Language = "en"): string {
  const list = lang === "ar" ? OPENERS_AR : OPENERS_EN;
  const fn = list[Math.floor(Math.random() * list.length)];
  return fn(title);
}
