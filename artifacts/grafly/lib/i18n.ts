// Lightweight i18n. No library, no bundles. Just two flat dictionaries
// and a `t()` helper. Adds ~5 KB to the app, not megabytes.

export type Language = "en" | "ar";

export const LANGUAGES: { id: Language; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "ar", label: "Arabic", native: "العربية" },
];

// All UI chrome strings. Keep keys flat and descriptive. Anything not
// in the dictionary falls back to the English key, which means missing
// translations still render as readable English (graceful degradation).
// Arabic copy is hand-written, not machine translated. Tone is warm,
// concise, and slightly editorial — like a thoughtful product writer
// localising for an Arab audience. Diacritics (شدّة) are added only
// where they help reading (تقدّم، تعلّم، سلسلة), never as full tashkeel.
const dict = {
  // ---------- Common ----------
  "common.continue": { en: "Continue", ar: "كمّل" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.skip": { en: "SKIP", ar: "تخطّي" },
  "common.start": { en: "Start", ar: "يلا نبدأ" },
  "common.save": { en: "Save", ar: "احفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.done": { en: "Done", ar: "تمام" },
  "common.true": { en: "True", ar: "صح" },
  "common.false": { en: "False", ar: "خطأ" },
  "common.or": { en: "OR", ar: "أو" },
  "common.of": { en: "of", ar: "من" },

  // ---------- Onboarding: Language ----------
  "onb.language.eyebrow": { en: "WELCOME", ar: "أهلاً بك" },
  "onb.language.headline": { en: "Choose your language", ar: "اختر لغتك" },
  "onb.language.sub": {
    en: "You can change this later in Settings.",
    ar: "تقدر تغيّرها بعدين من الإعدادات.",
  },

  // ---------- Onboarding: Welcome ----------
  "onb.welcome.headline": {
    en: "Learn design\nby actually\ndesigning.",
    ar: "تعلّم التصميم\nوأنت تصمّم\nفعلاً.",
  },
  "onb.welcome.tagline": {
    en: "Bite sized lessons. Real skills. No boring courses.",
    ar: "دروس صغيرة. مهارات حقيقية. وداعاً للملل.",
  },
  "onb.theme.light": { en: "Light", ar: "فاتح" },
  "onb.theme.dark": { en: "Dark", ar: "داكن" },

  // ---------- Onboarding: Name ----------
  "onb.name.headline": { en: "What should we call you?", ar: "كيف نناديك؟" },
  "onb.name.label": { en: "YOUR NAME", ar: "اسمك" },
  "onb.name.placeholder": { en: "e.g. Alex", ar: "مثلاً: أحمد" },
  "onb.name.hint": {
    en: "We will use this on your profile and progress screens. You can change it later.",
    ar: "راح يطلع اسمك على ملفك وعلى شاشة تقدّمك، وتقدر تغيّره وقت ما تحبّ.",
  },

  // ---------- Onboarding: Goal ----------
  "onb.goal.headline": { en: "What do you want to achieve?", ar: "إيش اللي تحبّ توصلّه؟" },
  "onb.goal.basics": { en: "Learn design basics", ar: "أبدأ من أساسيات التصميم" },
  "onb.goal.improve": { en: "Improve my skills", ar: "أطوّر مهاراتي" },
  "onb.goal.portfolio": { en: "Build a portfolio", ar: "أبني معرض أعمالي" },
  "onb.goal.career": { en: "Start a design career", ar: "أشتغل بالتصميم" },

  // ---------- Onboarding: Level ----------
  "onb.level.headline": { en: "What is your level?", ar: "وين أنت بالتصميم؟" },
  "onb.level.beginner": { en: "Beginner", ar: "مبتدئ" },
  "onb.level.beginner.desc": { en: "Just getting started", ar: "لسّا بالبداية" },
  "onb.level.intermediate": { en: "Intermediate", ar: "متوسّط" },
  "onb.level.intermediate.desc": { en: "I know the basics", ar: "عارف الأساسيات" },
  "onb.level.advanced": { en: "Advanced", ar: "متقدّم" },
  "onb.level.advanced.desc": { en: "I have real experience", ar: "عندي خبرة حقيقية" },

  // ---------- Onboarding: Time ----------
  "onb.time.headline": { en: "How much time daily?", ar: "قدّيش بتقدر تعطي باليوم؟" },
  "onb.time.5": { en: "5 min", ar: "٥ دقائق" },
  "onb.time.5.desc": { en: "A quick warmup", ar: "إحماء خفيف" },
  "onb.time.10": { en: "10 min", ar: "١٠ دقائق" },
  "onb.time.10.desc": { en: "A solid daily habit", ar: "عادة يومية حلوة" },
  "onb.time.15": { en: "15+ min", ar: "١٥ فأكثر" },
  "onb.time.15.desc": { en: "Serious progress", ar: "بدّك تتقدّم بجدّ" },

  // ---------- Onboarding: Step header ----------
  "onb.step": { en: "STEP {n} OF {total}", ar: "الخطوة {n} من {total}" },

  // ---------- Onboarding: Placement ----------
  "onb.placement.q": { en: "QUESTION {n} OF {total}", ar: "السؤال {n} من {total}" },
  "onb.placement.nice": { en: "Nice work!", ar: "برافو عليك!" },
  "onb.placement.notQuite": { en: "Not quite", ar: "قريب… بس مش تماماً" },
  "onb.placement.seeResults": { en: "See results", ar: "شوف نتيجتك" },

  // ---------- Onboarding: Results ----------
  "onb.results.eyebrow": { en: "YOU IMPROVED THE DESIGN", ar: "أنت طوّرت التصميم" },
  "onb.results.headline": { en: "Great work!", ar: "أداء ممتاز!" },
  "onb.results.sub": { en: "You are all set up", ar: "كل شي جاهز، يلا نبدأ" },
  "onb.results.correct": { en: "Correct", ar: "إجابات صحيحة" },
  "onb.results.questions": { en: "Questions", ar: "الأسئلة" },
  "onb.results.score": { en: "Score", ar: "النتيجة" },
  "onb.level.novice": { en: "Novice Designer", ar: "مصمّم ناشئ" },
  "onb.level.beginner.label": { en: "Beginner Designer", ar: "مصمّم مبتدئ" },
  "onb.level.intermediate.label": { en: "Intermediate Designer", ar: "مصمّم متوسّط" },
  "onb.level.advanced.label": { en: "Advanced Designer", ar: "مصمّم متقدّم" },
  "onb.level.expert.label": { en: "Expert Designer", ar: "مصمّم محترف" },
  "onb.level.novice.desc": {
    en: "Every expert was once a beginner. Your journey starts now.",
    ar: "كل محترف بدأ من الصفر يوم ما. هلّأ دورك.",
  },
  "onb.level.beginner.desc2": {
    en: "You have the foundations. Let us build on them.",
    ar: "أساسياتك موجودة، خلّينا نبني فوقها.",
  },
  "onb.level.intermediate.desc2": {
    en: "Solid knowledge. Time to go deeper.",
    ar: "معرفتك قويّة. وقت نغوص أكثر.",
  },
  "onb.level.advanced.desc2": {
    en: "Impressive! You will move fast through the early levels.",
    ar: "ممتاز! راح تطير بالمستويات الأولى.",
  },
  "onb.level.expert.desc2": {
    en: "You already think like a designer. Let us refine your craft.",
    ar: "أنت أصلاً بتفكّر كمصمّم. خلّينا نشحذ أدواتك بس.",
  },

  // ---------- Onboarding: Auth ----------
  "auth.almost": { en: "ALMOST THERE", ar: "قرّبنا نخلّص" },
  "auth.forgot.eyebrow": { en: "FORGOT PASSWORD", ar: "نسيت الباسوورد" },
  "auth.headline.save": { en: "Save your\nprogress", ar: "احفظ\nتقدّمك" },
  "auth.headline.reset": { en: "Reset password", ar: "غيّر كلمة المرور" },
  "auth.sub.signin": {
    en: "Sign in to keep your XP, streaks, and level on every device.",
    ar: "سجّل دخولك علشان نقاطك وسلسلتك ومستواك يفضلوا معاك على أيّ جهاز.",
  },
  "auth.sub.signup": {
    en: "Create an account so your XP, streaks, and level follow you everywhere.",
    ar: "افتح حساب وخلّي نقاطك وسلسلتك ومستواك يمشوا معاك فين ما رحت.",
  },
  "auth.sub.reset": {
    en: "Enter the email for your account and we will send you a reset link.",
    ar: "اكتب بريدك وراح نبعتلك رابط لتغيير الباسوورد.",
  },
  "auth.signin": { en: "Sign in", ar: "تسجيل الدخول" },
  "auth.signup": { en: "Sign up", ar: "افتح حساب" },
  "auth.create": { en: "Create account", ar: "افتح حساب" },
  "auth.send.reset": { en: "Send reset link", ar: "ابعتلي الرابط" },
  "auth.email": { en: "EMAIL", ar: "البريد" },
  "auth.password": { en: "PASSWORD", ar: "كلمة المرور" },
  "auth.password.placeholder": { en: "Min. 6 characters", ar: "٦ أحرف على الأقل" },
  "auth.forgot": { en: "Forgot password?", ar: "ناسي الباسوورد؟" },
  "auth.back.signin": { en: "Back to sign in", ar: "ارجع لتسجيل الدخول" },
  "auth.google": { en: "Continue with Google", ar: "كمّل عبر Google" },
  "auth.skip": { en: "Skip for now", ar: "بعدين" },

  // ---------- Tabs / Home ----------
  "home.greeting.morning": { en: "Good morning", ar: "صباح الخير" },
  "home.greeting.afternoon": { en: "Good afternoon", ar: "نهارك سعيد" },
  "home.greeting.evening": { en: "Good evening", ar: "مساء الخير" },
  "home.streak.on": {
    en: "You are on a {n} day streak. Keep the spark alive.",
    ar: "سلسلتك صامدة من {n} يوم. خلّيها تكبر!",
  },
  "home.streak.start": {
    en: "Pick a lesson and start your streak today.",
    ar: "اختر درس وافتح سلسلتك من اليوم.",
  },
  "home.continue.title": { en: "Pick up where you left off", ar: "كمّل من وين وقفت" },
  "home.continue.label": { en: "CONTINUE LESSON", ar: "كمّل الدرس" },
  "home.continue.progress": { en: "Continue Progress", ar: "كمّل تقدّمك" },
  "home.popular": { en: "Popular courses", ar: "الدورات اللي الكلّ يحبّها" },
  "home.seeAll": { en: "See all", ar: "كلّها" },
  "home.upgrade.title": { en: "Upgrade Pro", ar: "ترقّى لـ Pro" },
  "home.upgrade.sub": {
    en: "Unlimited critique, no ads, all courses",
    ar: "نقد بلا حدود، صفر إعلانات، وكل الدورات",
  },
  "home.upgrade.cta": { en: "Upgrade", ar: "ترقّى" },
  "home.levelup": { en: "LEVEL UP", ar: "طلعت مستوى" },
  "home.levelup.sub": {
    en: "You are becoming a real designer.",
    ar: "صرت مصمّم حقيقي.",
  },
  "home.levelup.cta": { en: "Keep Going", ar: "كمّل!" },

  // ---------- Profile ----------
  "profile.eyebrow": { en: "YOUR STUDIO", ar: "ركنك الإبداعي" },
  "profile.title": { en: "Profile", ar: "ملفّك" },
  "profile.weeklyXP": { en: "{n} XP this week", ar: "{n} نقطة هالأسبوع" },
  "profile.progress": { en: "PROGRESS", ar: "تقدّمك" },
  "profile.level": { en: "Level {n}", ar: "المستوى {n}" },
  "profile.toLevel": { en: "{n} XP to Level {l}", ar: "{n} نقطة وتوصل للمستوى {l}" },
  "profile.numbers": { en: "BY THE NUMBERS", ar: "أرقامك" },
  "profile.totalXP": { en: "Total XP", ar: "مجموع النقاط" },
  "profile.streak": { en: "Streak", ar: "السلسلة" },
  "profile.maxStreak": { en: "Max Streak", ar: "أطول سلسلة" },
  "profile.lessons": { en: "Lessons", ar: "الدروس" },
  "profile.achievements": { en: "ACHIEVEMENTS", ar: "إنجازاتك" },
  "profile.badges": { en: "Badges", ar: "الشارات" },
  "profile.unlocked": { en: "{n} of {total}", ar: "{n} من {total}" },
  "profile.settings": { en: "SETTINGS", ar: "الإعدادات" },
  "profile.account": { en: "ACCOUNT", ar: "حسابك" },
  "profile.upgrade": { en: "Upgrade to Pro", ar: "ترقّى لـ Pro" },
  "profile.signout": { en: "Sign out", ar: "خروج" },
  "profile.signedin": { en: "Signed in", ar: "أنت داخل" },
  "profile.save": { en: "Save your progress", ar: "احفظ تقدّمك" },
  "profile.sync": {
    en: "Sign in to sync across devices",
    ar: "سجّل دخول وخلّي بياناتك على كل أجهزتك",
  },
  "profile.editName": { en: "Edit username", ar: "غيّر اسمك" },

  // ---------- Settings ----------
  "settings.title": { en: "Settings", ar: "الإعدادات" },
  "settings.subtitle": {
    en: "Personalize how Grafly looks and sounds.",
    ar: "ظبّط شكل Grafly وصوته على ذوقك.",
  },
  "settings.section.preferences": { en: "PREFERENCES", ar: "تفضيلاتك" },
  "settings.section.audio": { en: "AUDIO", ar: "الصوت" },
  "settings.open": { en: "Open settings", ar: "افتح الإعدادات" },
  "settings.language": { en: "Language", ar: "اللغة" },
  "settings.language.sub": { en: "App display language", ar: "لغة التطبيق" },
  "settings.theme": { en: "Theme", ar: "المظهر" },
  "settings.theme.sub": { en: "Light or dark appearance", ar: "فاتح أو داكن" },
  "settings.voice": { en: "Voice feedback", ar: "النقد الصوتي" },
  "settings.voice.sub": {
    en: "Spoken critiques and lessons",
    ar: "اسمع النقد والدروس بصوت",
  },

  // ---------- Achievements (titles only) ----------
  "ach.first": { en: "First Step", ar: "الخطوة الأولى" },
  "ach.fire": { en: "On Fire", ar: "متوقّد" },
  "ach.critic": { en: "Critic", ar: "ناقد" },
  "ach.rising": { en: "Rising", ar: "في صعود" },
  "ach.pro": { en: "Pro", ar: "محترف" },
  "ach.rich": { en: "Rich", ar: "ثريّ" },
  "ach.dedicated": { en: "Dedicated", ar: "ملتزم" },
  "ach.perfect": { en: "Perfect", ar: "متقن" },

  // ---------- Divisions ----------
  "div.bronze": { en: "Bronze", ar: "برونزي" },
  "div.silver": { en: "Silver", ar: "فضّي" },
  "div.gold": { en: "Gold", ar: "ذهبي" },
  "div.platinum": { en: "Platinum", ar: "بلاتيني" },
  "div.diamond": { en: "Diamond", ar: "ماسي" },
} as const;

export type TranslationKey = keyof typeof dict;

export function translate(
  lang: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const entry = dict[key];
  let str: string = entry ? (entry as Record<Language, string>)[lang] ?? entry.en : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.split(`{${k}}`).join(String(v));
    }
  }
  return str;
}

// Convenience: directional helpers used by components.
export function isRTL(lang: Language): boolean {
  return lang === "ar";
}

// React Native style fragment for text. Spread into Text style
// to get correct alignment + writing direction in Arabic without
// touching every layout in the app.
export function textDir(lang: Language) {
  return isRTL(lang)
    ? { writingDirection: "rtl" as const, textAlign: "right" as const }
    : { writingDirection: "ltr" as const, textAlign: "left" as const };
}
