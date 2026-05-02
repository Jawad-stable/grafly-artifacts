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
const dict = {
  // ---------- Common ----------
  "common.continue": { en: "Continue", ar: "متابعة" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.skip": { en: "SKIP", ar: "تخطي" },
  "common.start": { en: "Start", ar: "ابدأ" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.done": { en: "Done", ar: "تم" },
  "common.true": { en: "True", ar: "صحيح" },
  "common.false": { en: "False", ar: "خطأ" },
  "common.or": { en: "OR", ar: "أو" },
  "common.of": { en: "of", ar: "من" },

  // ---------- Onboarding: Language ----------
  "onb.language.eyebrow": { en: "WELCOME", ar: "مرحباً" },
  "onb.language.headline": { en: "Choose your language", ar: "اختر لغتك" },
  "onb.language.sub": {
    en: "You can change this later in Settings.",
    ar: "يمكنك تغيير ذلك لاحقاً من الإعدادات.",
  },

  // ---------- Onboarding: Welcome ----------
  "onb.welcome.headline": {
    en: "Learn design\nby actually\ndesigning.",
    ar: "تعلم التصميم\nبالتصميم\nالفعلي.",
  },
  "onb.welcome.tagline": {
    en: "Bite sized lessons. Real skills. No boring courses.",
    ar: "دروس قصيرة. مهارات حقيقية. بدون دورات مملة.",
  },
  "onb.theme.light": { en: "Light", ar: "فاتح" },
  "onb.theme.dark": { en: "Dark", ar: "داكن" },

  // ---------- Onboarding: Name ----------
  "onb.name.headline": { en: "What should we call you?", ar: "ماذا نناديك؟" },
  "onb.name.label": { en: "YOUR NAME", ar: "اسمك" },
  "onb.name.placeholder": { en: "e.g. Alex", ar: "مثال: أحمد" },
  "onb.name.hint": {
    en: "We will use this on your profile and progress screens. You can change it later.",
    ar: "سنستخدم هذا في ملفك الشخصي وشاشات التقدم. يمكنك تغييره لاحقاً.",
  },

  // ---------- Onboarding: Goal ----------
  "onb.goal.headline": { en: "What do you want to achieve?", ar: "ما الذي تريد تحقيقه؟" },
  "onb.goal.basics": { en: "Learn design basics", ar: "تعلم أساسيات التصميم" },
  "onb.goal.improve": { en: "Improve my skills", ar: "تطوير مهاراتي" },
  "onb.goal.portfolio": { en: "Build a portfolio", ar: "بناء معرض أعمال" },
  "onb.goal.career": { en: "Start a design career", ar: "بدء مسيرة في التصميم" },

  // ---------- Onboarding: Level ----------
  "onb.level.headline": { en: "What is your level?", ar: "ما هو مستواك؟" },
  "onb.level.beginner": { en: "Beginner", ar: "مبتدئ" },
  "onb.level.beginner.desc": { en: "Just getting started", ar: "أبدأ للتو" },
  "onb.level.intermediate": { en: "Intermediate", ar: "متوسط" },
  "onb.level.intermediate.desc": { en: "I know the basics", ar: "أعرف الأساسيات" },
  "onb.level.advanced": { en: "Advanced", ar: "متقدم" },
  "onb.level.advanced.desc": { en: "I have real experience", ar: "لدي خبرة حقيقية" },

  // ---------- Onboarding: Time ----------
  "onb.time.headline": { en: "How much time daily?", ar: "كم من الوقت يومياً؟" },
  "onb.time.5": { en: "5 min", ar: "5 دقائق" },
  "onb.time.5.desc": { en: "A quick warmup", ar: "إحماء سريع" },
  "onb.time.10": { en: "10 min", ar: "10 دقائق" },
  "onb.time.10.desc": { en: "A solid daily habit", ar: "عادة يومية جيدة" },
  "onb.time.15": { en: "15+ min", ar: "+15 دقيقة" },
  "onb.time.15.desc": { en: "Serious progress", ar: "تقدم جاد" },

  // ---------- Onboarding: Step header ----------
  "onb.step": { en: "STEP {n} OF {total}", ar: "الخطوة {n} من {total}" },

  // ---------- Onboarding: Placement ----------
  "onb.placement.q": { en: "QUESTION {n} OF {total}", ar: "سؤال {n} من {total}" },
  "onb.placement.nice": { en: "Nice work!", ar: "أحسنت!" },
  "onb.placement.notQuite": { en: "Not quite", ar: "ليس تماماً" },
  "onb.placement.seeResults": { en: "See results", ar: "عرض النتيجة" },

  // ---------- Onboarding: Results ----------
  "onb.results.eyebrow": { en: "YOU IMPROVED THE DESIGN", ar: "لقد طورت تصميمك" },
  "onb.results.headline": { en: "Great work!", ar: "عمل رائع!" },
  "onb.results.sub": { en: "You are all set up", ar: "أنت جاهز تماماً" },
  "onb.results.correct": { en: "Correct", ar: "صحيح" },
  "onb.results.questions": { en: "Questions", ar: "أسئلة" },
  "onb.results.score": { en: "Score", ar: "النتيجة" },
  "onb.level.novice": { en: "Novice Designer", ar: "مصمم مبتدئ" },
  "onb.level.beginner.label": { en: "Beginner Designer", ar: "مصمم متعلم" },
  "onb.level.intermediate.label": { en: "Intermediate Designer", ar: "مصمم متوسط" },
  "onb.level.advanced.label": { en: "Advanced Designer", ar: "مصمم متقدم" },
  "onb.level.expert.label": { en: "Expert Designer", ar: "مصمم خبير" },
  "onb.level.novice.desc": {
    en: "Every expert was once a beginner. Your journey starts now.",
    ar: "كل خبير كان مبتدئاً يوماً ما. رحلتك تبدأ الآن.",
  },
  "onb.level.beginner.desc2": {
    en: "You have the foundations. Let us build on them.",
    ar: "لديك الأساسيات. لنبنِ عليها.",
  },
  "onb.level.intermediate.desc2": {
    en: "Solid knowledge. Time to go deeper.",
    ar: "معرفة قوية. حان وقت التعمق.",
  },
  "onb.level.advanced.desc2": {
    en: "Impressive! You will move fast through the early levels.",
    ar: "مذهل! ستتقدم بسرعة في المستويات الأولى.",
  },
  "onb.level.expert.desc2": {
    en: "You already think like a designer. Let us refine your craft.",
    ar: "أنت تفكر كمصمم بالفعل. لنصقل مهاراتك.",
  },

  // ---------- Onboarding: Auth ----------
  "auth.almost": { en: "ALMOST THERE", ar: "اقتربنا" },
  "auth.forgot.eyebrow": { en: "FORGOT PASSWORD", ar: "نسيت كلمة المرور" },
  "auth.headline.save": { en: "Save your\nprogress", ar: "احفظ\nتقدمك" },
  "auth.headline.reset": { en: "Reset password", ar: "إعادة تعيين كلمة المرور" },
  "auth.sub.signin": {
    en: "Sign in to keep your XP, streaks, and level on every device.",
    ar: "سجّل الدخول للحفاظ على نقاطك وسلسلتك ومستواك على جميع الأجهزة.",
  },
  "auth.sub.signup": {
    en: "Create an account so your XP, streaks, and level follow you everywhere.",
    ar: "أنشئ حساباً لتتبعك نقاطك وسلسلتك ومستواك في كل مكان.",
  },
  "auth.sub.reset": {
    en: "Enter the email for your account and we will send you a reset link.",
    ar: "أدخل البريد الإلكتروني لحسابك وسنرسل لك رابط إعادة التعيين.",
  },
  "auth.signin": { en: "Sign in", ar: "تسجيل الدخول" },
  "auth.signup": { en: "Sign up", ar: "إنشاء حساب" },
  "auth.create": { en: "Create account", ar: "إنشاء حساب" },
  "auth.send.reset": { en: "Send reset link", ar: "إرسال رابط الإعادة" },
  "auth.email": { en: "EMAIL", ar: "البريد الإلكتروني" },
  "auth.password": { en: "PASSWORD", ar: "كلمة المرور" },
  "auth.password.placeholder": { en: "Min. 6 characters", ar: "6 أحرف على الأقل" },
  "auth.forgot": { en: "Forgot password?", ar: "نسيت كلمة المرور؟" },
  "auth.back.signin": { en: "Back to sign in", ar: "العودة لتسجيل الدخول" },
  "auth.google": { en: "Continue with Google", ar: "المتابعة باستخدام جوجل" },
  "auth.skip": { en: "Skip for now", ar: "تخطي الآن" },

  // ---------- Tabs / Home ----------
  "home.greeting.morning": { en: "Good morning", ar: "صباح الخير" },
  "home.greeting.afternoon": { en: "Good afternoon", ar: "مساء الخير" },
  "home.greeting.evening": { en: "Good evening", ar: "مساء الخير" },
  "home.streak.on": {
    en: "You are on a {n} day streak. Keep the spark alive.",
    ar: "أنت في سلسلة من {n} يوم. حافظ على الشعلة.",
  },
  "home.streak.start": {
    en: "Pick a lesson and start your streak today.",
    ar: "اختر درساً وابدأ سلسلتك اليوم.",
  },
  "home.continue.title": { en: "Pick up where you left off", ar: "تابع من حيث توقفت" },
  "home.continue.label": { en: "CONTINUE LESSON", ar: "متابعة الدرس" },
  "home.continue.progress": { en: "Continue Progress", ar: "تابع تقدمك" },
  "home.popular": { en: "Popular courses", ar: "الدورات الشائعة" },
  "home.seeAll": { en: "See all", ar: "عرض الكل" },
  "home.upgrade.title": { en: "Upgrade Pro", ar: "الترقية للنسخة المحترفة" },
  "home.upgrade.sub": {
    en: "Unlimited critique, no ads, all courses",
    ar: "نقد غير محدود، بدون إعلانات، كل الدورات",
  },
  "home.upgrade.cta": { en: "Upgrade", ar: "ترقية" },
  "home.levelup": { en: "LEVEL UP", ar: "ارتفاع المستوى" },
  "home.levelup.sub": {
    en: "You are becoming a real designer.",
    ar: "أنت تصبح مصمماً حقيقياً.",
  },
  "home.levelup.cta": { en: "Keep Going", ar: "استمر" },

  // ---------- Profile ----------
  "profile.eyebrow": { en: "YOUR STUDIO", ar: "استوديوك" },
  "profile.title": { en: "Profile", ar: "الملف الشخصي" },
  "profile.weeklyXP": { en: "{n} XP this week", ar: "{n} نقطة هذا الأسبوع" },
  "profile.progress": { en: "PROGRESS", ar: "التقدم" },
  "profile.level": { en: "Level {n}", ar: "المستوى {n}" },
  "profile.toLevel": { en: "{n} XP to Level {l}", ar: "{n} نقطة للمستوى {l}" },
  "profile.numbers": { en: "BY THE NUMBERS", ar: "بالأرقام" },
  "profile.totalXP": { en: "Total XP", ar: "النقاط الإجمالية" },
  "profile.streak": { en: "Streak", ar: "السلسلة" },
  "profile.maxStreak": { en: "Max Streak", ar: "أطول سلسلة" },
  "profile.lessons": { en: "Lessons", ar: "الدروس" },
  "profile.achievements": { en: "ACHIEVEMENTS", ar: "الإنجازات" },
  "profile.badges": { en: "Badges", ar: "الشارات" },
  "profile.unlocked": { en: "{n} of {total}", ar: "{n} من {total}" },
  "profile.settings": { en: "SETTINGS", ar: "الإعدادات" },
  "profile.account": { en: "ACCOUNT", ar: "الحساب" },
  "profile.upgrade": { en: "Upgrade to Pro", ar: "الترقية للنسخة المحترفة" },
  "profile.signout": { en: "Sign out", ar: "تسجيل الخروج" },
  "profile.signedin": { en: "Signed in", ar: "مسجل الدخول" },
  "profile.save": { en: "Save your progress", ar: "احفظ تقدمك" },
  "profile.sync": {
    en: "Sign in to sync across devices",
    ar: "سجّل الدخول للمزامنة بين الأجهزة",
  },
  "profile.editName": { en: "Edit username", ar: "تعديل الاسم" },

  // ---------- Settings ----------
  "settings.language": { en: "Language", ar: "اللغة" },
  "settings.language.sub": { en: "App display language", ar: "لغة عرض التطبيق" },
  "settings.theme": { en: "Theme", ar: "السمة" },
  "settings.theme.sub": { en: "Light or dark appearance", ar: "مظهر فاتح أو داكن" },
  "settings.voice": { en: "Voice feedback", ar: "ردود صوتية" },
  "settings.voice.sub": {
    en: "Spoken critiques and lessons",
    ar: "نقد ودروس منطوقة",
  },

  // ---------- Achievements (titles only) ----------
  "ach.first": { en: "First Step", ar: "الخطوة الأولى" },
  "ach.fire": { en: "On Fire", ar: "ملتهب" },
  "ach.critic": { en: "Critic", ar: "ناقد" },
  "ach.rising": { en: "Rising", ar: "صاعد" },
  "ach.pro": { en: "Pro", ar: "محترف" },
  "ach.rich": { en: "Rich", ar: "ثري" },
  "ach.dedicated": { en: "Dedicated", ar: "مجتهد" },
  "ach.perfect": { en: "Perfect", ar: "متقن" },

  // ---------- Divisions ----------
  "div.bronze": { en: "Bronze", ar: "برونزي" },
  "div.silver": { en: "Silver", ar: "فضي" },
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
