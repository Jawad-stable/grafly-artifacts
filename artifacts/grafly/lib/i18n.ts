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
  "common.continue": { en: "Continue", ar: "التالي" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.skip": { en: "SKIP", ar: "تخطّي" },
  "common.start": { en: "Start", ar: "ابدأ" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.done": { en: "Done", ar: "تم" },
  "common.true": { en: "True", ar: "صحيحة" },
  "common.false": { en: "False", ar: "خاطئة" },
  "common.or": { en: "OR", ar: "أو" },
  "common.of": { en: "of", ar: "من" },

  // ---------- Onboarding: Language ----------
  "onb.language.eyebrow": { en: "WELCOME", ar: "أهلاً بك" },
  "onb.language.headline": { en: "Choose your language", ar: "اختر لغتك" },
  "onb.language.sub": {
    en: "You can change this later in Settings.",
    ar: "يمكنك تغيير اللغة لاحقاً من الإعدادات.",
  },

  // ---------- Onboarding: Welcome ----------
  "onb.welcome.headline": {
    en: "Learn design\nby actually\ndesigning.",
    ar: "تعلّم التصميم\nبالممارسة،\nلا بالنظرية.",
  },
  "onb.welcome.tagline": {
    en: "Bite sized lessons. Real skills. No boring courses.",
    ar: "دروس قصيرة. مهارات حقيقية. لا دورات مملّة.",
  },
  "onb.theme.light": { en: "Light", ar: "فاتح" },
  "onb.theme.dark": { en: "Dark", ar: "داكن" },

  // ---------- Onboarding: Name ----------
  "onb.name.headline": { en: "What should we call you?", ar: "كيف نناديك؟" },
  "onb.name.label": { en: "YOUR NAME", ar: "اسمك" },
  "onb.name.placeholder": { en: "e.g. Alex", ar: "مثلاً: أحمد" },
  "onb.name.hint": {
    en: "We will use this on your profile and progress screens. You can change it later.",
    ar: "سيظهر اسمك في ملفك الشخصي وشاشات التقدّم، ويمكنك تغييره في أي وقت.",
  },

  // ---------- Onboarding: Goal ----------
  "onb.goal.headline": { en: "What do you want to achieve?", ar: "ما هدفك من التطبيق؟" },
  "onb.goal.basics": { en: "Learn design basics", ar: "أتعلّم أساسيات التصميم" },
  "onb.goal.improve": { en: "Improve my skills", ar: "أطوّر مهاراتي الحالية" },
  "onb.goal.portfolio": { en: "Build a portfolio", ar: "أبني معرض أعمالي" },
  "onb.goal.career": { en: "Start a design career", ar: "أبدأ مسيرتي في التصميم" },

  // ---------- Onboarding: Level ----------
  "onb.level.headline": { en: "What is your level?", ar: "ما مستواك في التصميم؟" },
  "onb.level.beginner": { en: "Beginner", ar: "مبتدئ" },
  "onb.level.beginner.desc": { en: "Just getting started", ar: "أبدأ من الصفر" },
  "onb.level.intermediate": { en: "Intermediate", ar: "متوسّط" },
  "onb.level.intermediate.desc": { en: "I know the basics", ar: "أُلمّ بالأساسيات" },
  "onb.level.advanced": { en: "Advanced", ar: "متقدّم" },
  "onb.level.advanced.desc": { en: "I have real experience", ar: "لديّ خبرة فعلية" },

  // ---------- Onboarding: Time ----------
  "onb.time.headline": { en: "How much time daily?", ar: "كم وقتاً تخصّص يومياً؟" },
  "onb.time.5": { en: "5 min", ar: "٥ دقائق" },
  "onb.time.5.desc": { en: "A quick warmup", ar: "إحماء سريع" },
  "onb.time.10": { en: "10 min", ar: "١٠ دقائق" },
  "onb.time.10.desc": { en: "A solid daily habit", ar: "عادة يومية ممتازة" },
  "onb.time.15": { en: "15+ min", ar: "١٥ دقيقة فأكثر" },
  "onb.time.15.desc": { en: "Serious progress", ar: "تقدّم ملموس" },

  // ---------- Onboarding: Step header ----------
  "onb.step": { en: "STEP {n} OF {total}", ar: "الخطوة {n} من {total}" },

  // ---------- Onboarding: Placement ----------
  "onb.placement.q": { en: "QUESTION {n} OF {total}", ar: "السؤال {n} من {total}" },
  "onb.placement.nice": { en: "Nice work!", ar: "أحسنت!" },
  "onb.placement.notQuite": { en: "Not quite", ar: "ليست الإجابة الصحيحة" },
  "onb.placement.seeResults": { en: "See results", ar: "عرض النتيجة" },

  // ---------- Onboarding: Results ----------
  "onb.results.eyebrow": { en: "YOU IMPROVED THE DESIGN", ar: "لقد طوّرت التصميم" },
  "onb.results.headline": { en: "Great work!", ar: "عمل رائع!" },
  "onb.results.sub": { en: "You are all set up", ar: "أنت جاهز للانطلاق" },
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
    ar: "كل محترف كان يوماً مبتدئاً. رحلتك تبدأ من هنا.",
  },
  "onb.level.beginner.desc2": {
    en: "You have the foundations. Let us build on them.",
    ar: "تمتلك الأساسيات، والآن لنبنِ عليها معاً.",
  },
  "onb.level.intermediate.desc2": {
    en: "Solid knowledge. Time to go deeper.",
    ar: "معرفة راسخة. حان وقت التعمّق أكثر.",
  },
  "onb.level.advanced.desc2": {
    en: "Impressive! You will move fast through the early levels.",
    ar: "رائع! ستجتاز المستويات الأولى بسرعة.",
  },
  "onb.level.expert.desc2": {
    en: "You already think like a designer. Let us refine your craft.",
    ar: "أنت تفكّر كمصمّم بالفعل. لنصقل أدواتك أكثر.",
  },

  // ---------- Onboarding: Auth ----------
  "auth.almost": { en: "ALMOST THERE", ar: "اقتربنا من النهاية" },
  "auth.forgot.eyebrow": { en: "FORGOT PASSWORD", ar: "نسيت كلمة المرور" },
  "auth.headline.save": { en: "Save your\nprogress", ar: "احفظ\nتقدّمك" },
  "auth.headline.reset": { en: "Reset password", ar: "إعادة تعيين كلمة المرور" },
  "auth.sub.signin": {
    en: "Sign in to keep your XP, streaks, and level on every device.",
    ar: "سجّل الدخول لتحتفظ بنقاطك وسلسلتك ومستواك على جميع أجهزتك.",
  },
  "auth.sub.signup": {
    en: "Create an account so your XP, streaks, and level follow you everywhere.",
    ar: "أنشئ حساباً لتنتقل نقاطك وسلسلتك ومستواك معك أينما ذهبت.",
  },
  "auth.sub.reset": {
    en: "Enter the email for your account and we will send you a reset link.",
    ar: "أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابط إعادة التعيين.",
  },
  "auth.signin": { en: "Sign in", ar: "تسجيل الدخول" },
  "auth.signup": { en: "Sign up", ar: "إنشاء حساب" },
  "auth.create": { en: "Create account", ar: "إنشاء حساب" },
  "auth.send.reset": { en: "Send reset link", ar: "إرسال رابط إعادة التعيين" },
  "auth.email": { en: "EMAIL", ar: "البريد الإلكتروني" },
  "auth.password": { en: "PASSWORD", ar: "كلمة المرور" },
  "auth.password.placeholder": { en: "Min. 6 characters", ar: "٦ أحرف على الأقل" },
  "auth.forgot": { en: "Forgot password?", ar: "هل نسيت كلمة المرور؟" },
  "auth.back.signin": { en: "Back to sign in", ar: "العودة إلى تسجيل الدخول" },
  "auth.google": { en: "Continue with Google", ar: "المتابعة عبر Google" },
  "auth.skip": { en: "Skip for now", ar: "تخطّي الآن" },

  // ---------- Tabs / Home ----------
  "home.greeting.morning": { en: "Good morning", ar: "صباح الخير" },
  "home.greeting.afternoon": { en: "Good afternoon", ar: "طاب نهارك" },
  "home.greeting.evening": { en: "Good evening", ar: "مساء الخير" },
  "home.streak.on": {
    en: "You are on a {n} day streak. Keep the spark alive.",
    ar: "سلسلتك مستمرّة منذ {n} يوماً. أبقِ الشعلة مشتعلة.",
  },
  "home.streak.start": {
    en: "Pick a lesson and start your streak today.",
    ar: "اختر درساً وابدأ سلسلتك من اليوم.",
  },
  "home.continue.title": { en: "Pick up where you left off", ar: "تابع من حيث توقّفت" },
  "home.continue.label": { en: "CONTINUE LESSON", ar: "متابعة الدرس" },
  "home.continue.progress": { en: "Continue Progress", ar: "أكمل تقدّمك" },
  "home.popular": { en: "Popular courses", ar: "الدورات الأكثر رواجاً" },
  "home.seeAll": { en: "See all", ar: "عرض الكل" },
  "home.upgrade.title": { en: "Upgrade Pro", ar: "الترقية إلى Pro" },
  "home.upgrade.sub": {
    en: "Unlimited critique, no ads, all courses",
    ar: "نقد بلا حدود، بدون إعلانات، وجميع الدورات",
  },
  "home.upgrade.cta": { en: "Upgrade", ar: "ترقية" },
  "home.levelup": { en: "LEVEL UP", ar: "ترقية المستوى" },
  "home.levelup.sub": {
    en: "You are becoming a real designer.",
    ar: "أصبحتَ مصمّماً حقيقياً.",
  },
  "home.levelup.cta": { en: "Keep Going", ar: "تابع التقدّم" },

  // ---------- Profile ----------
  "profile.eyebrow": { en: "YOUR STUDIO", ar: "مساحتك الإبداعية" },
  "profile.title": { en: "Profile", ar: "الملف الشخصي" },
  "profile.weeklyXP": { en: "{n} XP this week", ar: "{n} نقطة خبرة هذا الأسبوع" },
  "profile.progress": { en: "PROGRESS", ar: "التقدّم" },
  "profile.level": { en: "Level {n}", ar: "المستوى {n}" },
  "profile.toLevel": { en: "{n} XP to Level {l}", ar: "{n} نقطة للوصول إلى المستوى {l}" },
  "profile.numbers": { en: "BY THE NUMBERS", ar: "إحصائياتك" },
  "profile.totalXP": { en: "Total XP", ar: "إجمالي النقاط" },
  "profile.streak": { en: "Streak", ar: "السلسلة" },
  "profile.maxStreak": { en: "Max Streak", ar: "أطول سلسلة" },
  "profile.lessons": { en: "Lessons", ar: "الدروس" },
  "profile.achievements": { en: "ACHIEVEMENTS", ar: "الإنجازات" },
  "profile.badges": { en: "Badges", ar: "الشارات" },
  "profile.unlocked": { en: "{n} of {total}", ar: "{n} من {total}" },
  "profile.settings": { en: "SETTINGS", ar: "الإعدادات" },
  "profile.account": { en: "ACCOUNT", ar: "الحساب" },
  "profile.upgrade": { en: "Upgrade to Pro", ar: "الترقية إلى Pro" },
  "profile.signout": { en: "Sign out", ar: "تسجيل الخروج" },
  "profile.signedin": { en: "Signed in", ar: "مسجَّل الدخول" },
  "profile.save": { en: "Save your progress", ar: "احفظ تقدّمك" },
  "profile.sync": {
    en: "Sign in to sync across devices",
    ar: "سجّل الدخول لمزامنة بياناتك بين أجهزتك",
  },
  "profile.editName": { en: "Edit username", ar: "تعديل الاسم" },

  // ---------- Settings ----------
  "settings.title": { en: "Settings", ar: "الإعدادات" },
  "settings.subtitle": {
    en: "Personalize how Grafly looks and sounds.",
    ar: "خصّص شكل Grafly وصوته كما يناسبك.",
  },
  "settings.section.preferences": { en: "PREFERENCES", ar: "التفضيلات" },
  "settings.section.audio": { en: "AUDIO", ar: "الصوت" },
  "settings.open": { en: "Open settings", ar: "فتح الإعدادات" },
  "settings.language": { en: "Language", ar: "اللغة" },
  "settings.language.sub": { en: "App display language", ar: "لغة عرض التطبيق" },
  "settings.theme": { en: "Theme", ar: "المظهر" },
  "settings.theme.sub": { en: "Light or dark appearance", ar: "مظهر فاتح أو داكن" },
  "settings.voice": { en: "Voice feedback", ar: "التعليقات الصوتية" },
  "settings.voice.sub": {
    en: "Spoken critiques and lessons",
    ar: "نقد ودروس مسموعة",
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
