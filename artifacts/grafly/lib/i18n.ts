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
  "settings.language.hint": {
    en: "Switching to Arabic flips the app to right-to-left and reloads.",
    ar: "لمّا تختار العربي بنقلب التطبيق من اليمين للشمال وبيعيد تحميل.",
  },
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

  // ---------- Leaderboard ----------
  "lb.title": { en: "Leaderboard", ar: "لوحة المتصدّرين" },
  "lb.global": { en: "Global", ar: "عالمياً" },
  "lb.friends": { en: "Friends", ar: "الأصحاب" },
  "lb.you": { en: "(You)", ar: "(أنت)" },
  "lb.xp": { en: "{n} XP", ar: "{n} نقطة" },

  // ---------- Paywall ----------
  "pay.brand": { en: "GRAFLY PRO", ar: "GRAFLY PRO" },
  "pay.headline": { en: "Become\nlimitless.", ar: "خلّيك\nبلا حدود." },
  "pay.sub": {
    en: "Your full design education. No daily caps, no locked lessons, no excuses.",
    ar: "كل تعليمك بالتصميم. لا حدود يومية، ولا دروس مقفولة، ولا أعذار.",
  },
  "pay.join": { en: "JOIN 12,000 PRO DESIGNERS", ar: "انضمّ لـ ١٢٬٠٠٠ مصمّم Pro" },
  "pay.trial": {
    en: "7 day free trial. Cancel anytime.",
    ar: "تجربة مجانية ٧ أيام. وألغِ وقت ما تحبّ.",
  },
  "pay.what": { en: "WHAT YOU GET", ar: "إيش راح تاخذ" },
  "pay.everything": { en: "Everything, unlocked", ar: "كل شي مفتوح" },
  "pay.b1.title": { en: "Unlimited AI critiques", ar: "نقد الذكاء الاصطناعي بلا حدود" },
  "pay.b1.sub": { en: "No daily caps on feedback", ar: "بدون أيّ حدود يومية" },
  "pay.b2.title": { en: "Streak shields", ar: "دروع السلسلة" },
  "pay.b2.sub": { en: "5 freezes per month", ar: "٥ تجميدات بالشهر" },
  "pay.b3.title": { en: "Bonus XP challenges", ar: "تحدّيات نقاط إضافية" },
  "pay.b3.sub": { en: "Exclusive Pro only quests", ar: "مهام حصرية للـ Pro" },
  "pay.b4.title": { en: "Early access", ar: "وصول مبكّر" },
  "pay.b4.sub": { en: "New courses before anyone else", ar: "دورات جديدة قبل الكلّ" },
  "pay.b5.title": { en: "Pro badge", ar: "شارة Pro" },
  "pay.b5.sub": { en: "Show it off on your profile", ar: "افتخر فيها بملفّك" },
  "pay.b6.title": { en: "Priority support", ar: "دعم أوّلوية" },
  "pay.b6.sub": { en: "Direct line to the team", ar: "خطّ مباشر مع الفريق" },
  "pay.choose": { en: "CHOOSE YOUR PLAN", ar: "اختر خطّتك" },
  "pay.pickFits": { en: "Pick what fits", ar: "خذ اللي يناسبك" },
  "pay.annual": { en: "Annual", ar: "سنوي" },
  "pay.monthly": { en: "Monthly", ar: "شهري" },
  "pay.perYear": { en: "per year", ar: "بالسنة" },
  "pay.perMonth": { en: "per month", ar: "بالشهر" },
  "pay.annual.cap": {
    en: "$3.33 per month, billed yearly",
    ar: "٣٫٣٣$ بالشهر، فاتورة سنوية",
  },
  "pay.monthly.cap": { en: "Cancel anytime", ar: "ألغِ وقت ما تبي" },
  "pay.save": { en: "SAVE 33%", ar: "وفّر ٣٣٪" },
  "pay.processing": { en: "Processing", ar: "جاري المعالجة" },
  "pay.startWith": { en: "Start with {plan} · {price}", ar: "ابدأ بخطّة {plan} · {price}" },
  "pay.legal": {
    en: "Cancel anytime. Billed through the App Store. Subscriptions auto renew until cancelled.",
    ar: "ألغِ وقت ما تبي. الفاتورة عبر متجر التطبيقات. الاشتراك يتجدّد تلقائياً إلى أن تلغيه.",
  },

  // ---------- Home (additions) ----------
  "home.todays": { en: "TODAY'S DESIGN", ar: "تصميم اليوم" },
  "home.tapStudy": { en: "TAP TO STUDY", ar: "اضغط لتدرس" },

  // ---------- Tree ----------
  "tree.courses": { en: "Courses", ar: "الدورات" },
  "tree.browse": { en: "BROWSE", ar: "تصفّح" },
  "tree.choose": { en: "Choose", ar: "اختر" },
  "tree.aCourse": { en: "a course.", ar: "دورتك." },
  "tree.percentDone": { en: "{n}% COMPLETE", ar: "{n}٪ مكتمل" },
  "tree.lessonsCount": { en: "{n} lessons", ar: "{n} درس" },
  "tree.moduleProgress": { en: "MODULE PROGRESS", ar: "تقدّم الوحدة" },
  "tree.mastered": {
    en: "Module mastered — practice anytime.",
    ar: "أتقنت الوحدة — تمرّن وقت ما تبي.",
  },
  "tree.brandNew": { en: "Brand new module. Let's begin.", ar: "وحدة جديدة كلّياً. يلا نبدأ." },
  "tree.toGo.one": { en: "{n} lesson to go.", ar: "باقي درس واحد." },
  "tree.toGo.many": { en: "{n} lessons to go.", ar: "باقي {n} دروس." },
  "tree.stat.lessons": { en: "LESSONS", ar: "الدروس" },
  "tree.stat.xp": { en: "XP", ar: "نقاط" },
  "tree.stat.coins": { en: "COINS", ar: "عملات" },
  "tree.practice": { en: "Practice again", ar: "تمرّن من جديد" },
  "tree.startLessons": { en: "Start lessons", ar: "ابدأ الدروس" },
  "tree.completePrev": { en: "Complete previous lessons", ar: "خلّص الدروس السابقة" },

  // ---------- Critique ----------
  "crit.aiMentor": { en: "AI MENTOR", ar: "مدرّب الذكاء" },
  "crit.critique": { en: "Critique", ar: "نقد" },
  "crit.todayDesign": { en: "TODAY'S DESIGN", ar: "تصميم اليوم" },
  "crit.tapToStudy": { en: "TAP TO STUDY", ar: "اضغط للدراسة" },
  "crit.designMentor": { en: "DESIGN MENTOR", ar: "مدرّب التصميم" },
  "crit.online": { en: "ONLINE", ar: "متصل" },
  "crit.title": { en: "Critique", ar: "النقد" },
  "crit.unlimited": { en: "Unlimited", ar: "بلا حدود" },
  "crit.left": { en: "{n} left", ar: "باقي {n}" },
  "crit.todays": { en: "TODAY'S DESIGN", ar: "تصميم اليوم" },
  "crit.tapStudy": { en: "TAP TO STUDY", ar: "اضغط لتدرس" },

  // ---------- Critique Onboarding ----------
  "critOb.step": { en: "{n} OF {total}", ar: "{n} من {total}" },
  "critOb.s1.t": { en: "Welcome to Critique", ar: "أهلاً بك في النقد" },
  "critOb.s1.b": {
    en: "Get personalized design feedback from Grafly. Here are a few quick tips to get you started.",
    ar: "خذ ملاحظات تصميم خاصّة فيك من Grafly. هاي شوية نصايح سريعة لتبدأ.",
  },
  "critOb.s2.t": { en: "Tap shuffle for a fresh design", ar: "اضغط الخلط لتصميم جديد" },
  "critOb.s2.b": {
    en: "The shuffle button at the top right loads a brand new design any time you want something new to critique.",
    ar: "زرّ الخلط فوق يجيبلك تصميم جديد كلّياً وقت ما تبي شي جديد تنتقده.",
  },
  "critOb.s3.t": { en: "Tap the photo to expand", ar: "اضغط الصورة لتكبّرها" },
  "critOb.s3.b": {
    en: "Tap any design image to open it full-screen and study every pixel up close.",
    ar: "اضغط على أيّ صورة تصميم لتفتحها بالشاشة كاملة وتدرس كل تفصيل.",
  },
  "critOb.s4.t": { en: "Chat to earn XP", ar: "حاكي وكسّب نقاط" },
  "critOb.s4.b": {
    en: "Type your observations in the message box. Three thoughtful exchanges earn you +{xp} XP and {coins} coins.",
    ar: "اكتب ملاحظاتك بالرسالة. ثلاث تبادلات مدروسة بتجيبلك +{xp} نقطة و{coins} عملة.",
  },
  "critOb.gotIt": { en: "Got it, let's go", ar: "تمام، يلا نبدأ" },
  "critOb.next": { en: "Next", ar: "التالي" },
  "critOb.skip": { en: "Skip", ar: "تخطّى" },

  // ---------- Shop ----------
  "shop.eyebrow": { en: "POWER UP", ar: "قوّي نفسك" },
  "shop.title": { en: "Shop", ar: "المتجر" },
  "shop.coins": { en: "{n} coins", ar: "{n} عملة" },
  "shop.section.power": { en: "POWER UPS", ar: "تعزيزات" },
  "shop.section.frames": { en: "AVATAR FRAMES", ar: "إطارات الصورة" },
  "shop.active": { en: "Active", ar: "مفعّل" },
  "shop.notEnough": { en: "Not enough coins", ar: "العملات ما تكفي" },
  "shop.purchased": { en: "{name} purchased!", ar: "اشتريت {name}!" },
  "shop.equipped": { en: "{name} equipped!", ar: "ركّبت {name}!" },
  "shop.item.shield": { en: "Streak Shield", ar: "درع السلسلة" },
  "shop.item.shield.sub": { en: "Protect a missed day", ar: "احمي يوم فاتك" },
  "shop.item.refill": { en: "Heart Refill", ar: "تعبئة قلوب" },
  "shop.item.refill.sub": { en: "Restore all 5 hearts", ar: "رجّع الـ ٥ قلوب" },
  "shop.item.booster": { en: "XP Booster", ar: "مضاعف نقاط" },
  "shop.item.booster.sub": { en: "Double XP for 24 hours", ar: "نقاط مضاعفة لـ ٢٤ ساعة" },
  "shop.item.blue": { en: "Blue Frame", ar: "إطار أزرق" },
  "shop.item.blue.sub": { en: "Avatar frame", ar: "إطار للصورة" },
  "shop.item.gold": { en: "Gold Frame", ar: "إطار ذهبي" },
  "shop.item.gold.sub": { en: "Rare avatar frame", ar: "إطار صورة نادر" },
  "shop.item.pink": { en: "Pink Frame", ar: "إطار وردي" },
  "shop.item.pink.sub": { en: "Exclusive avatar frame", ar: "إطار صورة حصري" },

  // ---------- Lesson ----------
  "lesson.true": { en: "True", ar: "صح" },
  "lesson.false": { en: "False", ar: "خطأ" },
  "lesson.tapOdd": { en: "Tap the odd one out", ar: "اضغط على الشاذّ" },
  "lesson.arrange": { en: "Arrange in the correct order", ar: "رتّبهم بالترتيب الصحيح" },
  "lesson.submitOrder": { en: "Submit order", ar: "أرسل الترتيب" },
  "lesson.tapMatch": {
    en: "Tap left then right to match pairs",
    ar: "اضغط يسار ثم يمين لتطابق الأزواج",
  },
  "lesson.checkMatches": { en: "Check matches", ar: "تحقق من المطابقات" },
  "lesson.fillBlank": { en: "Fill in the blank:", ar: "املأ الفراغ:" },
  "lesson.typeAnswer": { en: "Type your answer...", ar: "اكتب جوابك..." },
  "lesson.correctAnswer": { en: "Correct answer", ar: "الجواب الصحيح" },
  "lesson.submitAnswer": { en: "Submit answer", ar: "أرسل الجواب" },
  "lesson.tapCorrect": { en: "Tap the correct element", ar: "اضغط على العنصر الصحيح" },
  "lesson.correctAns": { en: "Correct answer: {a}", ar: "الجواب الصحيح: {a}" },
  "lesson.submitAns": { en: "Submit answer", ar: "أرسل الجواب" },
  "lesson.tapElement": { en: "Tap the correct element", ar: "اضغط على العنصر الصحيح" },
  "lesson.finish": { en: "Finish", ar: "إنهاء" },
  "lesson.continue": { en: "Continue", ar: "كمّل" },
  "lesson.outOfHearts": { en: "Out of hearts", ar: "خلصت القلوب" },
  "lesson.breather": {
    en: "Take a breather while we line up your options.",
    ar: "خذ نفس وإحنا نجهّزلك الخيارات.",
  },

  // ---------- Course intro ----------
  "ci.eyebrow": { en: "COURSE WELCOME", ar: "أهلاً بالدورة" },
  "ci.course": { en: "COURSE", ar: "دورة" },
  "ci.modules": { en: "MODULES", ar: "وحدات" },
  "ci.lessons": { en: "LESSONS", ar: "دروس" },
  "ci.games": { en: "GAMES", ar: "ألعاب" },
  "ci.ready": { en: "Ready to think like a designer?", ar: "جاهز تفكّر كمصمّم؟" },
  "ci.train": {
    en: "Train your eye. One quick module at a time.",
    ar: "درّب عينك. وحدة سريعة في كلّ مرّة.",
  },
  "ci.path": { en: "THE PATH", ar: "المسار" },
  "ci.lessonsCount": { en: "{n} LESSONS", ar: "{n} درس" },
  "ci.alreadyDone": {
    en: "You've already completed {done} of {total} lessons.",
    ar: "خلّصت {done} من {total} درس لحدّ هلّأ.",
  },
  "ci.keepGoing": { en: "Keep going", ar: "كمّل" },
  "ci.start": { en: "Start the course", ar: "ابدأ الدورة" },
  "ci.fullTree": { en: "See the full skill tree", ar: "شوف شجرة المهارات كاملة" },
  "ci.h.eye": { en: "Train your eye", ar: "درّب عينك" },
  "ci.h.eye.b": { en: "Real screens, not theory.", ar: "شاشات حقيقية، مش نظري." },
  "ci.h.eye.b2": { en: "Hands-on, not theory.", ar: "تطبيق، مش نظري." },
  "ci.h.play": { en: "Play, don't read", ar: "العب، لا تقرأ" },
  "ci.h.play.b": { en: "Spot, tap, choose. Quick rounds.", ar: "اكتشف، اضغط، اختر. جولات سريعة." },
  "ci.h.play.b2": { en: "Quick interactive rounds.", ar: "جولات تفاعلية سريعة." },
  "ci.h.ribbon": { en: "6 modules · 18 lessons", ar: "٦ وحدات · ١٨ درس" },
  "ci.h.ribbon.b": { en: "Built in the right order.", ar: "مبنية بالترتيب الصحيح." },
  "ci.h.earn": { en: "Earn as you go", ar: "اكسب وأنت تتعلّم" },
  "ci.h.earn.b": { en: "XP, coins, and streaks.", ar: "نقاط وعملات وسلاسل." },

  // ---------- Courses list ----------
  "courses.eyebrow": { en: "EXPLORE", ar: "استكشف" },
  "courses.title": { en: "Courses", ar: "الدورات" },
  "courses.summary": {
    en: "{done} of {total} lessons complete across {n} courses",
    ar: "{done} من {total} درس مكتمل عبر {n} دورة",
  },
  "courses.modulesLessons": {
    en: "{m} modules · {d}/{t} lessons",
    ar: "{m} وحدة · {d}/{t} درس",
  },

  // ---------- Auth (additions) ----------
  "auth.eyebrow.welcome": { en: "WELCOME BACK", ar: "أهلاً بعودتك" },
  "auth.eyebrow.join": { en: "JOIN GRAFLY", ar: "انضمّ لـ Grafly" },
  "auth.headline.signin": { en: "Sign in", ar: "تسجيل الدخول" },
  "auth.headline.signup": { en: "Create account", ar: "افتح حساب" },
  "auth.sub.signin2": {
    en: "Pick up your design journey right where you left off.",
    ar: "كمّل رحلتك بالتصميم من وين وقفت.",
  },
  "auth.sub.signup2": {
    en: "Start learning design through bite sized daily lessons.",
    ar: "ابدأ تتعلّم التصميم بدروس صغيرة كل يوم.",
  },
  "auth.sub.reset2": {
    en: "Enter your email and we will send you a reset link.",
    ar: "اكتب بريدك وراح نبعتلك رابط لإعادة التعيين.",
  },
  "auth.email.placeholder": { en: "you@example.com", ar: "you@example.com" },
  "auth.or.continue": { en: "OR CONTINUE WITH", ar: "أو كمّل بـ" },
  "auth.dont.have": { en: "Don't have an account? ", ar: "ما عندك حساب؟ " },
  "auth.have": { en: "Already have an account? ", ar: "عندك حساب مسبقاً؟ " },
  "auth.err.email": { en: "Please enter your email.", ar: "اكتب بريدك من فضلك." },
  "auth.err.both": { en: "Please enter your email and password.", ar: "اكتب بريدك وكلمة المرور." },
  "auth.err.pwShort": {
    en: "Password must be at least 6 characters.",
    ar: "كلمة المرور لازم ٦ أحرف على الأقل.",
  },
  "auth.notice.reset": {
    en: "Check your email for a reset link.",
    ar: "افحص بريدك، فيه رابط إعادة التعيين.",
  },
  "auth.confirmEmail.title": { en: "Check your email", ar: "افحص بريدك" },
  "auth.confirmEmail.body": {
    en: "We sent a confirmation link to {email}. Verify your email and then sign in.",
    ar: "بعتنالك رابط تأكيد لـ {email}. أكّد بريدك وبعدين سجّل دخول.",
  },
  "auth.resend": {
    en: "Resend confirmation email",
    ar: "إعادة إرسال إيميل التأكيد",
  },
  "auth.notice.resent": {
    en: "Confirmation email sent. Check your inbox (and spam).",
    ar: "بعتنا الإيميل من جديد. افحص الوارد (والـSpam).",
  },

  // ---------- Auth callback (reset) ----------
  "ac.expired": { en: "LINK EXPIRED", ar: "الرابط انتهى" },
  "ac.invalid": { en: "This link is no longer valid", ar: "الرابط هذا ما عاد شغّال" },
  "ac.invalid.sub": {
    en: "Reset links can only be used once and expire after a short time. Request a new one and try again.",
    ar: "روابط إعادة التعيين تستخدم مرّة وحدة وتنتهي بسرعة. اطلب واحد جديد وحاول.",
  },
  "ac.almostDone": { en: "ALMOST DONE", ar: "قرّبنا نخلّص" },
  "ac.setNew": { en: "Set a new password", ar: "اختر كلمة مرور جديدة" },
  "ac.setNew.sub": {
    en: "Pick a new password for your account. We will sign you in right after.",
    ar: "اختر كلمة مرور جديدة لحسابك. وراح ندخّلك مباشرة بعدها.",
  },
  "ac.newPw": { en: "NEW PASSWORD", ar: "كلمة المرور الجديدة" },
  "ac.confirmPw": { en: "CONFIRM PASSWORD", ar: "أكّد كلمة المرور" },
  "ac.reenter": { en: "Re-enter the password", ar: "اكتب كلمة المرور مرّة ثانية" },
  "ac.update": { en: "Update password", ar: "حدّث كلمة المرور" },
  "ac.err.match": { en: "Passwords do not match.", ar: "كلمتا المرور مش متطابقات." },

  // ---------- Not found ----------
  "nf.title": { en: "Oops!", ar: "أُوبس!" },
  "nf.notExist": { en: "This screen doesn't exist.", ar: "هاي الشاشة مش موجودة." },
  "nf.goHome": { en: "Go to home screen!", ar: "ارجع للرئيسية!" },

  // ---------- Home (additions 2) ----------
  "home.xpGain": { en: "+{n} XP", ar: "+{n} نقطة" },
  "home.dailyGoal": { en: "DAILY GOAL", ar: "هدف اليوم" },
  "home.complete": { en: "Complete!", ar: "خلّصت!" },
  "home.toGo": { en: "{n} to go", ar: "باقي {n}" },
  "home.yourRank": { en: "YOUR RANK", ar: "ترتيبك" },
  "home.bronzeDiv": { en: "Bronze division", ar: "قسم برونزي" },
  "home.viewLb": { en: "View leaderboard", ar: "شوف لوحة المتصدّرين" },
  "home.level": { en: "Level {n}", ar: "المستوى {n}" },
  "home.xpOf": { en: "{c} / {r} XP", ar: "{c} / {r} نقطة" },
  "home.lvlNext": { en: "Lvl {n}", ar: "مستوى {n}" },
  "home.lessonsSuffix": { en: "  lessons", ar: "  درس" },

  // ---------- Tree (additions) ----------
  "tree.notice": { en: "{n} of {total} lessons", ar: "{n} من {total} درس" },
  "tree.unlocked": { en: "Unlocked", ar: "مفتوحة" },
  "tree.locked": { en: "Locked", ar: "مقفولة" },
  "tree.completed": { en: "Completed", ar: "مكتملة" },
  "tree.review": { en: "Review", ar: "مراجعة" },
  "tree.start": { en: "Start", ar: "ابدأ" },
  "tree.continue": { en: "Continue", ar: "كمّل" },
  "tree.module": { en: "MODULE {n}", ar: "وحدة {n}" },
  "tree.lessonsLabel": { en: "Lessons", ar: "الدروس" },
  "tree.allCourses": { en: "All courses", ar: "كل الدورات" },
  "tree.changeCourse": { en: "Change course", ar: "غيّر الدورة" },
  "tree.coursePicker": { en: "Pick a course", ar: "اختر دورة" },
  "tree.close": { en: "Close", ar: "إغلاق" },

  // ---------- Critique (additions) ----------
  "crit.send": { en: "Send", ar: "إرسال" },
  "crit.placeholder": { en: "Share your thoughts…", ar: "شاركنا أفكارك…" },
  "crit.shuffle": { en: "Shuffle", ar: "خلط" },
  "crit.thinking": { en: "Grafly is Graflying ...", ar: "Grafly عم يفكّر..." },
  "crit.dailyLimit": { en: "Daily limit reached", ar: "وصلت الحدّ اليومي" },
  "crit.upgradeUnlimited": {
    en: "Upgrade to Pro for unlimited critiques.",
    ar: "ترقّى لـ Pro وخذ نقد بلا حدود.",
  },
  "crit.upgrade": { en: "Upgrade", ar: "ترقّى" },
  "crit.newDesign": { en: "New design", ar: "تصميم جديد" },
  "crit.youSaid": { en: "You", ar: "أنت" },
  "crit.mentor": { en: "Grafly", ar: "Grafly" },
  "crit.start": { en: "Start the conversation", ar: "ابدأ الحوار" },
  "crit.startSub": {
    en: "Tell Grafly what you notice in this design.",
    ar: "خبّر Grafly شو لاحظت بهالتصميم.",
  },
  "crit.error": {
    en: "Something went wrong. Please try again.",
    ar: "صار خطأ ما. حاول مرّة ثانية.",
  },
  "crit.earned": { en: "+{xp} XP · +{coins} coins", ar: "+{xp} نقطة · +{coins} عملة" },

  // ---------- Lesson (additions) ----------
  "lesson.q": { en: "Question {n} of {total}", ar: "سؤال {n} من {total}" },
  "lesson.exit": { en: "Exit lesson?", ar: "تخرج من الدرس؟" },
  "lesson.exitBody": {
    en: "Your progress in this lesson will be lost.",
    ar: "تقدّمك بالدرس راح يضيع.",
  },
  "lesson.cancel": { en: "Cancel", ar: "إلغاء" },
  "lesson.exitYes": { en: "Exit", ar: "خروج" },
  "lesson.correct": { en: "Nice!", ar: "تمام!" },
  "lesson.wrong": { en: "Not quite.", ar: "مش مظبوط." },
  "lesson.complete": { en: "Lesson complete!", ar: "خلّصت الدرس!" },
  "lesson.completeSub": {
    en: "You earned {xp} XP and {coins} coins.",
    ar: "كسبت {xp} نقطة و{coins} عملة.",
  },
  "lesson.again": { en: "Practice again", ar: "تمرّن من جديد" },
  "lesson.next": { en: "Next lesson", ar: "الدرس الجاي" },
  "lesson.back": { en: "Back to tree", ar: "ارجع للشجرة" },
  "lesson.heartLost": { en: "You lost a heart", ar: "خسرت قلب" },
  "lesson.heartsLeft": { en: "{n} hearts left", ar: "باقي {n} قلوب" },
  "lesson.outBody": {
    en: "Wait for hearts to refill or buy a refill from the shop.",
    ar: "استنّى القلوب ترجع أو اشتري تعبئة من المتجر.",
  },
  "lesson.shop": { en: "Open shop", ar: "افتح المتجر" },
  "lesson.skip": { en: "Skip", ar: "تخطّى" },
  "lesson.tapToContinue": { en: "Tap to continue", ar: "اضغط للمتابعة" },
  "lesson.choose": { en: "Choose the correct answer", ar: "اختر الإجابة الصحيحة" },

  // ---------- Tree (additions 2) ----------
  "tree.yourJourney": { en: "YOUR JOURNEY", ar: "رحلتك" },
  "tree.skillTree": { en: "Skill tree", ar: "شجرة المهارات" },
  "tree.newWelcome": { en: "NEW · COURSE WELCOME", ar: "جديد · ترحيب بالدورة" },
  "tree.seeLearn": { en: "See what you'll learn", ar: "شوف شو رح تتعلّم" },
  "tree.courseEyebrow": { en: "Course", ar: "دورة" },
  "tree.ofLessons": { en: "{n} OF {total} LESSONS", ar: "{n} من {total} درس" },
  "tree.keepGoing": { en: "KEEP GOING", ar: "كمّل" },
  "tree.thePath": { en: "THE PATH", ar: "المسار" },
  "tree.stages": { en: "{n} STAGES", ar: "{n} مرحلة" },
  "tree.startBadge": { en: "START", ar: "ابدأ" },
  "tree.finishBadge": { en: "FINISH", ar: "النهاية" },
  "tree.toGoSuffix": { en: "{n} lesson{s} to go.", ar: "باقي {n} درس." },

  // ---------- Critique (additions 2) ----------
  "crit.sharePlaceholder": { en: "Share your first thought...", ar: "اكتب أوّل ملاحظة..." },
  "crit.troubleReply": {
    en: "Hmm, I had trouble responding. {msg}",
    ar: "هممم، صار عندي مشكلة بالردّ. {msg}",
  },
  "crit.couldNotReach": {
    en: "Could not reach the AI mentor.",
    ar: "ما قدرت أوصل لمدرّب الذكاء.",
  },
  "crit.quickStart": { en: "QUICK START", ar: "بداية سريعة" },
  "crit.tapPrefill": { en: "TAP TO PREFILL", ar: "اضغط للتعبئة" },
  "crit.unlockPro": {
    en: "Unlock Pro for unlimited sessions",
    ar: "افتح Pro لتلاقي جلسات بلا حدود",
  },
  "crit.xpEarned": { en: "+{n} XP earned ✨", ar: "+{n} نقطة كسبت ✨" },

  // ---------- Lesson (additions 2) ----------
  "lesson.exitConfirmBody": {
    en: "Your progress for this lesson will be lost.",
    ar: "تقدّمك بهالدرس راح يضيع.",
  },
  "lesson.keepGoing": { en: "Keep going", ar: "كمّل" },
  "lesson.exitBtn": { en: "Exit", ar: "خروج" },
  "lesson.notFound": { en: "Lesson not found", ar: "الدرس مش موجود" },
  "lesson.goBack": { en: "Go Back", ar: "ارجع" },
  "lesson.perfect": { en: "Perfect lesson!", ar: "درس مثاليّ!" },
  "lesson.lessonComplete": { en: "Lesson complete!", ar: "خلّصت الدرس!" },
  "lesson.flawless": {
    en: "Flawless run through the {m} module — you've earned this one.",
    ar: "أتقنت وحدة {m} بدون أخطاء — هاي بتستاهلها.",
  },
  "lesson.wrapped": {
    en: "You wrapped the entire {m} module. The patterns are starting to click.",
    ar: "خلّصت وحدة {m} كاملة. الأنماط صارت تتّضح.",
  },
  "lesson.xpEarned": { en: "XP EARNED", ar: "نقاط مكتسبة" },
  "lesson.coinsLabel": { en: "COINS", ar: "عملات" },
  "lesson.heartsLeftLabel": { en: "HEARTS LEFT", ar: "قلوب باقية" },
  "lesson.perfectBonus": {
    en: "Perfect! +10 bonus XP for no mistakes",
    ar: "مثالي! +١٠ نقاط إضافية بدون أخطاء",
  },
  "lesson.nextLesson": { en: "Next lesson", ar: "الدرس الجاي" },
  "lesson.backHome": { en: "Back to home", ar: "ارجع للرئيسية" },
  "lesson.returnHome": { en: "Return home", ar: "الرجوع للرئيسية" },
  "lesson.correctTag": { en: "Correct!", ar: "صحّ!" },
  "lesson.notQuite": { en: "Not quite", ar: "مش مظبوط" },
  "lesson.finishBtn": { en: "Finish", ar: "إنهاء" },
  "lesson.continueBtn": { en: "Continue", ar: "كمّل" },
  "lesson.outOfHeartsTitle": { en: "Out of hearts", ar: "خلصت القلوب" },
  "lesson.breatherSub": {
    en: "Take a breather while we line up your options.",
    ar: "خذ نفس وإحنا نجهّزلك الخيارات.",
  },
  "lesson.q.mc": { en: "Choose the best answer", ar: "اختر أفضل إجابة" },
  "lesson.q.tf": { en: "True or false?", ar: "صح أم خطأ؟" },
  "lesson.q.spot": { en: "Spot the odd one out", ar: "اكتشف الشاذّ" },
  "lesson.q.tap": { en: "Tap the correct element", ar: "اضغط على العنصر الصحيح" },
  "lesson.q.arrange": { en: "Arrange in order", ar: "رتّب بالتسلسل" },
  "lesson.q.match": { en: "Match the pairs", ar: "طابق الأزواج" },
  "lesson.q.fill": { en: "Fill in the blank", ar: "املأ الفراغ" },
  "lesson.q.bad": { en: "Spot the bad design", ar: "اكتشف التصميم الضعيف" },
  "lesson.q.better": { en: "Pick the better design", ar: "اختر التصميم الأفضل" },
  "lesson.q.stack": { en: "Stack the layout", ar: "رتّب التخطيط" },
  "lesson.q.fivesec": { en: "5-second test", ar: "اختبار ٥ ثواني" },
  "lesson.q.cta": { en: "Find the primary CTA", ar: "حدّد الزرّ الأساسي" },
  "lesson.q.colormatch": { en: "Tap the matching color", ar: "اضغط على اللون المطابق" },
  "lesson.q.contrast": { en: "Tune the contrast", ar: "ظبّط التباين" },
  "lesson.q.palette": { en: "Build the palette", ar: "ابني الباليت" },
  "lesson.q.dragmatch": { en: "Drag to match", ar: "اسحب وطابق" },
  "lesson.q.fallback": { en: "Question", ar: "سؤال" },

  // ---------- In-lesson scene chrome ----------
  "scenes.lessonEyebrow":   { en: "LESSON · {title}", ar: "درس · {title}" },
  "scenes.letsGo":          { en: "Let's go", ar: "يلا نبدأ" },
  "scenes.tapAnyElement":   { en: "Tap any element to lock in your guess", ar: "اضغط على أي عنصر علشان تثبّت تخمينك" },
  "scenes.wrongSpot":       { en: "You tapped the wrong spot — the correct one is highlighted in green.", ar: "ضغطت على المكان الغلط — الصحّ مظلّل بالأخضر." },
  "scenes.optionA":         { en: "Option A", ar: "الخيار أ" },
  "scenes.optionB":         { en: "Option B", ar: "الخيار ب" },
  "scenes.lockInOrder":     { en: "Lock in this order", ar: "ثبّت هاد الترتيب" },
  "scenes.dm.tray":         { en: "DRAG ONTO A SLOT", ar: "اسحبها على مكانها" },
  "scenes.dm.lockIn":       { en: "Lock in my matches", ar: "ثبّت تطابقاتي" },
  "scenes.dm.dragHint":     { en: "Drag every chip into a slot", ar: "اسحب كل قطعة لمكانها" },
  "scenes.glance":          { en: "GLANCE — DON'T MEMORIZE", ar: "نظرة سريعة — بلا حفظ" },
  "scenes.skipAhead":       { en: "Skip ahead", ar: "تخطّى للأمام" },
  "scenes.showAgain":       { en: "Show me the screen again", ar: "ورجيني الشاشة مرّة ثانية" },
  "scenes.tapPrimaryFirst": { en: "Tap the element you'd press first", ar: "اضغط على العنصر يلي رح تضغطه أوّل شي" },
  "scenes.notQuiteCTA":     { en: "Not quite — the primary CTA is highlighted in green.", ar: "مش مظبوط — الزرّ الأساسي مظلّل بالأخضر." },
  "scenes.moduleComplete":  { en: "MODULE COMPLETE · {title}", ar: "خلصت الوحدة · {title}" },
  "scenes.good":            { en: "GOOD", ar: "منيح" },
  "scenes.bad":             { en: "BAD", ar: "ضعيف" },
  "scenes.target":          { en: "TARGET", ar: "الهدف" },
  "scenes.tapMatchingSwatch": { en: "Tap the swatch that matches the rule", ar: "اضغط على المربّع اللي بيطابق القاعدة" },
  "scenes.contrastRatio":   { en: "Contrast ratio", ar: "نسبة التباين" },
  "scenes.contrastPass":    { en: "PASSES WCAG", ar: "نجح WCAG" },
  "scenes.contrastFail":    { en: "TOO LOW", ar: "ضعيف جداً" },
  "scenes.contrastTarget":  { en: "Target: {ratio}:1", ar: "المطلوب: {ratio}:١" },
  "scenes.contrastDarker":  { en: "Darker", ar: "أغمق" },
  "scenes.contrastLighter": { en: "Lighter", ar: "أفتح" },
  "scenes.contrastLockIn":  { en: "Lock in this contrast", ar: "ثبّت هاد التباين" },
  "scenes.contrastNeedsMore": { en: "Push further until it passes", ar: "كمّل لما يعدّي" },
  "scenes.paletteBase":     { en: "BASE", ar: "اللون الأساسي" },
  "scenes.palettePickN":    { en: "Pick {n} swatches that complete the {rule}", ar: "اختار {n} ألوان لتكمّل {rule}" },
  "scenes.paletteSelected": { en: "{n} of {total} selected", ar: "محدّد {n} من {total}" },
  "scenes.paletteLockIn":   { en: "Lock in this palette", ar: "ثبّت هاد الباليت" },
  "scenes.paletteWrong":    { en: "Not quite — the matching swatches are highlighted in green.", ar: "مش مظبوط — الألوان الصح مظلّلة بالأخضر." },

  // ---------- Error fallback ----------
  "err.something": { en: "Something went wrong", ar: "صار خطأ ما" },
  "err.reload": { en: "Please reload the app to continue.", ar: "أعد تحميل التطبيق علشان تكمّل." },
  "err.tryAgain": { en: "Try Again", ar: "حاول مرّة ثانية" },
  "err.details": { en: "Error Details", ar: "تفاصيل الخطأ" },

  // ---------- Misc UI bits ----------
  "critique.expand": { en: "EXPAND", ar: "توسيع" },
  "onb.defaultName": { en: "Designer", ar: "مصمّم" },
  "auth.error.missingEmail": { en: "Please enter your email.", ar: "اكتب بريدك الإلكتروني." },
  "auth.error.missingCreds": { en: "Please enter your email and password.", ar: "اكتب بريدك وكلمة المرور." },
  "auth.error.weakPassword": { en: "Password must be at least 6 characters.", ar: "كلمة المرور لازم تكون 6 حروف على الأقل." },
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
