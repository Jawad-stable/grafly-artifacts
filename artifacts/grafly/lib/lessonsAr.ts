// Arabic translations for lesson content (lessons.ts) and PLACEMENT_QUESTIONS.
// Pattern: a flat English -> Arabic dictionary that's deep-applied to lesson
// objects at render time. This keeps the canonical English source untouched
// (analytics, IDs, adaptive logic all stay stable) while giving Arabic users
// fully localised content.
//
// Tone: warm, conversational, lightly Levantine — not stiff MSA. The same
// voice as lib/i18n.ts (e.g. "كمّل" instead of "متابعة", "يلا نبدأ" instead
// of "ابدأ"). When a string has no Arabic entry, we fall back to the
// English source so missing copy degrades gracefully.

import type { Language } from "./i18n";
import type {
  Question,
  Lesson,
  SkillNode,
  Course,
  LessonIntro,
  SceneBlock,
  ScreenSpec,
} from "@/constants/lessons";

// ---------------------------------------------------------------------------
// Dictionary
// ---------------------------------------------------------------------------

const EN_AR: Record<string, string> = {
  // ===== Drag-match scenes =====
  "Drag each color into the role it plays in a 60-30-10 system.":
    "اسحب كل لون لدوره في نظام ٦٠-٣٠-١٠.",
  "The off-white sits behind everything (60%). The mid-grey carries support text and chrome (30%). The pink is the loud accent — saved for the one action you want users to take (10%).":
    "الأوف-وايت بيقعد ورا كل شي (٦٠٪). الرمادي بيحمل النصوص الثانوية والإطار (٣٠٪). الزهري هو اللمسة الجريئة — محجوز للإكشن الوحيد يلي بدّك المستخدم يضغطه (١٠٪).",
  "Drag the swatches into 60%, 30%, and 10%.":
    "اسحب الألوان لخانات ٦٠٪، ٣٠٪، و١٠٪.",
  "60% — Surface": "٦٠٪ — السطح",
  "30% — Support": "٣٠٪ — الداعم",
  "10% — Action": "١٠٪ — الأكشن",
  "The dominant tone": "اللون المسيطر",
  "Text and chrome": "النصوص والإطار",
  "The one bold color": "اللون الجريء الوحيد",
  "Off-white": "أوف-وايت",
  "Mid-grey": "رمادي وسط",
  "Brand pink": "زهري البراند",
  "Match each semantic role to its universal color.":
    "طابق كل دور دلالي مع اللون العالمي تبعه.",
  "Across cultures and platforms, green = success, amber = warning, red = danger. Get this wrong and users panic when they shouldn't — or stay calm when they shouldn't.":
    "بكل الثقافات والمنصات: أخضر = نجاح، أصفر = تحذير، أحمر = خطر. إذا غلطت، المستخدم رح يخاف بمكان مش لازم — أو رح يهدا بمكان لازم يخاف فيه.",
  "Drag each role onto the matching swatch.":
    "اسحب كل دور على المربّع المطابق.",
  "Amber": "كهرماني",
  "Universal calm signal": "إشارة الطمأنينة العالمية",
  "Universal caution signal": "إشارة الحذر العالمية",
  "Universal stop signal": "إشارة التوقّف العالمية",
  "Success": "نجاح",
  "Warning": "تحذير",
  "Danger": "خطر",

  // ===== Course / module / lesson titles + descriptions =====
  "Design Principles": "مبادئ التصميم",
  "Six modules, real mini-games, and the why behind every rule of good design.":
    "ست وحدات، ألعاب صغيرة حقيقية، والسبب وراء كل قاعدة من قواعد التصميم الجيد.",
  "Contrast": "التباين",
  "Make the right thing impossible to miss.":
    "خلّي الشي الصح ما يفوت على عين حدا.",
  "Why Contrast Matters": "ليش التباين مهم",
  "The single biggest readability lever you have.":
    "أقوى أداة بإيدك لتسهيل القراءة.",
  "Spot the Bad Design": "لاقي التصميم الغلط",
  "Find the contrast problem in a real-looking screen.":
    "لاقي مشكلة التباين بشاشة شكلها حقيقي.",
  "Choose the Better Design": "اختار التصميم الأحسن",
  "Pick the version that actually works.": "اختار النسخة اللي فعلاً بتشتغل.",
  "Typography": "الخط والطباعة",
  "Set type that earns trust at a glance.":
    "صفّ خطّك بطريقة تكسب الثقة من أول نظرة.",
  "Type Has a Job": "كل خط إله شغلة",
  "Headlines lead. Body explains. Labels orient.":
    "العناوين بتقود. النص بيشرح. الليبلز بتدلّ.",
  "Pick the Better Headline": "اختار العنوان الأحسن",
  "Two headlines, one is doing its job.":
    "عنوانين، وحدة بس عم تأدي شغلتها.",
  "Stack the Hierarchy": "رتّب التسلسل",
  "Reorder the blocks so the most important one leads.":
    "رتّب البلوكات بحيث يكون الأهم بالمقدمة.",
  "Spacing": "المسافات",
  "Whitespace isn't empty — it's structure.":
    "الفراغ مو فاضي — هو هيكل التصميم.",
  "Whitespace Works": "الفراغ بيشتغل",
  "Why breathing room is a design tool.":
    "ليش مساحة التنفس أداة تصميم.",
  "Spot the Spacing Mistake": "لاقي غلطة المسافات",
  "Find the cramped element.": "لاقي العنصر المخنوق.",
  "Reorder for Clarity": "رتّب للوضوح",
  "Group these list items by relationship.":
    "جمّع عناصر القائمة حسب علاقتها ببعضها.",
  "Color": "اللون",
  "Use color with intent — not as decoration.":
    "استعمل اللون بنيّة — مش زينة.",
  "Color Has a Job": "اللون إله شغلة",
  "Brand, mood, and meaning, all at once.":
    "هويّة، ومزاج، ومعنى — كلها مع بعض.",
  "Pick the Right Palette": "اختار الباليت المناسب",
  "Two takes on the same brand.": "نسختين لنفس البراند.",
  "The right color can carry the brand.": "اللون الصح بيحمل البراند لحاله.",
  "5-Second Brand Recall": "تذكّر البراند بـ ٥ ثواني",
  "Glance, then answer.": "بصّة سريعة، وبعدين جاوب.",
  "Hierarchy": "التسلسل البصري",
  "Tell the eye where to go, in what order.":
    "دلّ العين وين تروح، وبأي ترتيب.",
  "The Eye Path": "مسار العين",
  "Most layouts have a 'first read.' Yours should too.":
    "أغلب التصاميم إلها «قراية أولى». تصميمك لازم يكون عنده وحدة كمان.",
  "Find the CTA": "لاقي زرّ الأكشن",
  "Tap the primary action on this fake screen.":
    "اضغط على الأكشن الأساسي بهالشاشة التجريبية.",
  "Order the Layout": "رتّب التصميم",
  "Sequence sections of a landing page.": "رتّب أقسام صفحة الهبوط.",
  "UX Basics": "أساسيات تجربة الاستخدام",
  "Design the path, not just the picture.":
    "صمّم المسار، مش بس الصورة.",
  "Users Scan, Not Read": "المستخدم بيمرّق نظره، ما بيقرا",
  "Build for skim, not study.": "صمّم لشخص بيطلّ، مش لشخص بيدرس.",
  "5-Second First Impression": "الانطباع الأول بـ ٥ ثواني",
  "Glance at this landing screen, then answer.":
    "طلّ على شاشة الهبوط هاي، وبعدين جاوب.",
  "Spot the UX Trap": "لاقي فخ تجربة الاستخدام",
  "Find the friction in this checkout step.":
    "لاقي الاحتكاك بخطوة الدفع هاي.",

  // Course 2: Typography
  "Master type to communicate with clarity and style.":
    "أتقن الخطوط لتوصل فكرتك بوضوح وأناقة.",
  "Type Basics": "أساسيات الخطوط",
  "The foundational vocabulary of typography.":
    "المفردات الأساسية بعالم الخطوط.",
  "Serif vs Sans-Serif": "Serif مقابل Sans-Serif",
  "Understand the two main type families.":
    "افهم العيلتين الأساسيتين بعالم الخطوط.",
  "Type Scale": "مقياس الخطوط",
  "Create consistent typographic rhythm and scale.":
    "اعمل إيقاع ومقياس ثابت لخطوطك.",
  "Modular Scale": "المقياس النمطي",
  "Build harmonious type systems with mathematical ratios.":
    "ابني نظام خطوط متناسق بنسب رياضية.",
  "Font Pairing": "توليف الخطوط",
  "Combine typefaces for powerful visual contrast.":
    "ركّب الخطوط ببعض لتباين بصري قوي.",
  "The Art of Pairing": "فنّ التوليف",
  "Learn how to choose complementary typefaces.":
    "تعلّم كيف تختار خطوط بتكمّل بعضها.",

  // Course 3: UI Design
  "UI Design": "تصميم الواجهات",
  "Build beautiful, functional digital interfaces.":
    "ابني واجهات رقمية حلوة وعمليّة.",
  "Grid Systems": "أنظمة الشبكة",
  "Structure your layouts with mathematical precision.":
    "نظّم تصاميمك بدقّة رياضية.",
  "Columns & Gutters": "الأعمدة والمسافات",
  "Master the building blocks of grid-based layout.":
    "أتقن لبنات تصميم الشبكات.",
  "UI Patterns": "أنماط الواجهات",
  "Learn proven solutions to common UI problems.":
    "تعلّم حلول مجرّبة لمشاكل الواجهات الشائعة.",
  "Navigation Patterns": "أنماط التنقّل",
  "Design navigation that users understand instinctively.":
    "صمّم تنقّل المستخدم بيفهمه بالفطرة.",

  // Course 4: Branding
  "Branding": "بناء الهويّة",
  "Craft identities that resonate and endure.":
    "اصنع هويّات بتترك أثر وبتدوم.",
  "Brand Identity": "الهويّة البصرية",
  "The core elements that define a brand.":
    "العناصر الأساسية اللي بتعرّف البراند.",
  "What Makes a Brand": "شو اللي بيصنع البراند",
  "Understand brand identity beyond just a logo.":
    "افهم الهويّة أبعد من مجرد لوغو.",

  // ===== Course 6: Color Theory (NEW) =====
  "Color Theory": "نظرية الألوان",
  "Learn color by actually picking, mixing, and tuning it.":
    "تعلّم الألوان من خلال إنك تختار وتمزج وتظبّط فعلاً.",
  "Color Foundations": "أساسيات اللون",
  "Hue, saturation, lightness — the building blocks.":
    "اللون، التشبّع، السطوع — اللبنات الأساسية.",
  "Hue, Saturation, Lightness": "اللون والتشبّع والسطوع",
  "Three dials describe every color you'll ever use.":
    "تلت أزرار بتوصف أي لون رح تستعمله بحياتك.",
  "Warm vs Cool": "دافئ مقابل بارد",
  "Half the wheel feels hot. The other half feels calm.":
    "نص العجلة بيحسّ سخن. والنص التاني بيحسّ هادي.",
  "Color Wheel & Harmony": "عجلة الألوان والتناسق",
  "Use the wheel to build palettes that just work.":
    "استعمل العجلة علشان تبني باليتات بتشتغل لحالها.",
  "Complementary Colors": "الألوان المكمّلة",
  "Opposite sides of the wheel. Maximum punch.":
    "الجهتين المقابلتين بالعجلة. أقصى قوّة.",
  "Analogous Harmony": "التناسق المتجاور",
  "Three neighbours on the wheel. Calm, cohesive.":
    "تلت جيران بالعجلة. هادي ومتماسك.",
  "Contrast & Accessibility": "التباين وسهولة الوصول",
  "Color choices that real users can actually read.":
    "خيارات ألوان المستخدمين الحقيقيين بقدروا يقروها فعلاً.",
  "WCAG in Plain English": "WCAG بلغة مفهومة",
  "The rules every product designer should know cold.":
    "القواعد اللي كل مصمّم منتجات لازم يحفظها غيب.",
  "Hands-on Contrast": "تباين عملي",
  "Tune two real cards until they ship-ready.":
    "ظبّط كرتين حقيقيتين لحدّ ما يكونوا جاهزين للنشر.",
  "Brand Color Systems": "أنظمة ألوان البراند",
  "Turn one brand color into a working palette.":
    "حوّل لون براند واحد لباليت متكامل بيشتغل.",
  "The 60-30-10 Rule": "قاعدة ٦٠-٣٠-١٠",
  "A simple recipe for balanced color.":
    "وصفة بسيطة لتوازن الألوان.",
  "Semantic Colors": "الألوان الدلالية",
  "Colors that mean something — across every product.":
    "ألوان إلها معنى — بكل المنتجات.",

  // Course 6 intros
  "Every color is three dials.": "كل لون عبارة عن تلت أزرار.",
  "Hue is the family (red, blue, green). Saturation is how vivid. Lightness is how bright. Master the three and you can tune any color on demand.":
    "اللون هو العيلة (أحمر، أزرق، أخضر). التشبّع كم اللون قوي. السطوع كم بيلمع. أتقن التلاتة وبتقدر تظبّط أي لون متى ما بدّك.",
  "Color has temperature.": "اللون إله حرارة.",
  "Reds, oranges and yellows feel warm and energetic. Blues, greens and purples feel cool and calm. Designers use this to set mood before words ever land.":
    "الأحمر والبرتقالي والأصفر بيحسّوا دافيين ونشيطين. الأزرق والأخضر والبنفسجي بيحسّوا باردين وهاديين. المصمّمين بيستعملوا هاد علشان يحدّدوا المزاج قبل ما الكلمات توصل.",
  "Opposites attract — loudly.": "المتعاكسات بتنجذب — بصوت عالي.",
  "Complementary colors sit across from each other on the wheel. They create the strongest possible vibration. Use sparingly — they fight if both go full strength.":
    "الألوان المكمّلة بتقعد قبال بعضها بالعجلة. بتعمل أقوى اهتزاز ممكن. استعملها بحرص — بتتشاجر إذا الاتنين راحوا بكامل قوّتهن.",
  "Neighbours sing together.": "الجيران بيغنّوا سوا.",
  "Analogous palettes pick three colors that sit next to each other on the wheel. They feel calm and unified — perfect for backgrounds, gradients, and moods.":
    "الباليت المتجاورة بتختار تلت ألوان جنب بعضها بالعجلة. بتحسّ هادية وموحّدة — مثالية للخلفيات والتدرّجات والمزاج.",
  "Pretty doesn't ship. Readable does.": "الحلو ما بينشر. المقروء بينشر.",
  "WCAG is the worldwide standard for color contrast. Body text needs at least 4.5:1. Big headlines can get away with 3:1. Anything below fails real users.":
    "WCAG هو المعيار العالمي لتباين الألوان. نصّ المحتوى لازم على الأقل ٤٫٥:١. العناوين الكبيرة بتمشي بـ ٣:١. أقل من هيك بيفشل مع المستخدمين الحقيقيين.",
  "Designers fix contrast every day.": "المصمّمين بيصلّحوا التباين كل يوم.",
  "This is the most common edit you'll make in real product work. Train the muscle now.":
    "هاد أكثر تعديل رح تعمله بشغل المنتجات الحقيقي. درّب العضلة هلّأ.",
  "60% calm. 30% support. 10% punch.": "٦٠٪ هدوء. ٣٠٪ دعم. ١٠٪ قوّة.",
  "Most great interfaces follow the 60-30-10 rule: a dominant neutral, a secondary tone, and a tiny dose of brand accent. The accent only works because the rest is restrained.":
    "أغلب الواجهات الحلوة بتتبع قاعدة ٦٠-٣٠-١٠: لون حيادي مهيمن، لون ثانوي، وجرعة صغيرة من لون البراند. اللمسة المميّزة بتشتغل بس لأنه الباقي محتشم.",
  "Some colors come with meaning attached.": "في ألوان بتجي ومعها معنى.",
  "Red means stop or destroy. Green means go or success. Yellow means caution. Use them on purpose — and never use red for a non-destructive button.":
    "الأحمر معناه قف أو ادمّر. الأخضر معناه امشي أو نجاح. الأصفر معناه احذر. استعملها بقصد — وما تستعمل الأحمر أبداً لزرّ غير مدمّر.",

  // Course 6 prompts + questions
  "Which property describes whether a color is red, blue, or green?":
    "أي خاصية بتوصف إذا اللون أحمر، أزرق، أو أخضر؟",
  "Saturation": "التشبّع",
  "Hue": "اللون (Hue)",
  "Lightness": "السطوع",
  "Opacity": "الشفافية",
  "Tap the most saturated swatch.": "اضغط على المربّع الأكثر تشبّعاً.",
  "Three are muted versions of one base. Pick the original.":
    "تلاتة منهن نسخ خافتة من لون واحد. اختار الأصلي.",
  "Lowering a color's saturation moves it toward grey.":
    "تخفيض تشبّع اللون بيقرّبه من الرمادي.",
  "Tap the coolest swatch.": "اضغط على المربّع الأبرد.",
  "Which swatch feels coldest to the eye?":
    "أي مربّع بيحسّ أبرد للعين؟",
  "Why do designers often pick a warm accent on a cool background?":
    "ليش المصمّمين كتير بيختاروا لمسة دافية على خلفية باردة؟",
  "Warm colors are always brighter": "الألوان الدافية دايماً أبرق",
  "It's a brand convention required by Apple": "تقليد براند مطلوب من Apple",
  "Temperature contrast makes the accent pop without needing huge saturation":
    "تباين الحرارة بيخلّي اللمسة تطلّ بدون الحاجة لتشبّع عالي",
  "Cool backgrounds are easier to print": "الخلفيات الباردة أسهل للطباعة",
  "Tap the complement of this orange.":
    "اضغط على المكمّل لهاد البرتقالي.",
  "Which swatch sits directly opposite the target on the wheel?":
    "أي مربّع بيقعد قبال الهدف مباشرةً بالعجلة؟",
  "Pairing two complementary colors at 100% saturation usually feels comfortable to read.":
    "جمع لونين مكمّلين بتشبّع ١٠٠٪ عادةً بيحسّ مريح للقراية.",
  "Pick the two analogous neighbours of this teal.":
    "اختار الجيرانين المتجاورين لهاد التركواز.",
  "Build an analogous trio with this teal.":
    "ابني ثلاثي متجاور مع هاد التركواز.",
  "Which palette type uses three colors evenly spaced around the wheel?":
    "أي نوع باليت بيستعمل تلت ألوان بمسافات متساوية حول العجلة؟",
  "Analogous": "متجاورة",
  "Complementary": "مكمّلة",
  "Triadic": "ثلاثية",
  "Monochromatic": "أحادية اللون",
  "What's the minimum WCAG AA contrast ratio for body text?":
    "شو أقل نسبة تباين بـ WCAG AA لنصّ المحتوى؟",
  "Tune this CTA text until it passes WCAG AA.":
    "ظبّط نصّ زرّ الأكشن لحدّ ما يعدّي WCAG AA.",
  "The label is too pale on the pink. Push it lighter until it passes.":
    "الليبل باهت على الزهر. خلّيه أفتح لحدّ ما يعدّي.",
  "Push this body copy until it passes on a dark background.":
    "ادفع نصّ المحتوى لحدّ ما يعدّي على خلفية غامقة.",
  "The body text is too dim against the navy. Lighten it.":
    "نصّ المحتوى خافت قبال الأزرق الغامق. خفّفه.",
  "Tune the header until it clears the AA-large bar (3:1).":
    "ظبّط العنوان لحدّ ما يعدّي حدّ النصوص الكبيرة AA (٣:١).",
  "Push the headline darker until it passes the large-text bar.":
    "خلّي العنوان أغمق لحدّ ما يعدّي حدّ النصوص الكبيرة.",
  "In the 60-30-10 rule, what should the 10% color be used for?":
    "بقاعدة ٦٠-٣٠-١٠، شو لازم يستعمل لون الـ ١٠٪؟",
  "Backgrounds and large surfaces": "الخلفيات والأسطح الكبيرة",
  "Body text and section dividers": "نصوص المحتوى وفواصل الأقسام",
  "Primary actions and accents that need attention":
    "الأكشن الأساسي واللمسات اللي بدها انتباه",
  "Borders around every component": "إطارات حوالين كل عنصر",
  "Pick the swatch that should be the 10% accent.":
    "اختار المربّع اللي لازم يكون لمسة الـ ١٠٪.",
  "Three are neutrals. One is the accent. Tap the accent.":
    "تلاتة حياديين. وحد لمسة مميّزة. اضغط على اللمسة.",
  "Tap the swatch you'd use for a 'Delete' button.":
    "اضغط على المربّع اللي بتستعمله لزرّ «احذف».",
  "Which color sends 'this is irreversible — be sure'?":
    "أي لون بيوصل «هاد ما بيرجع — تأكّد»؟",
  "Build a semantic set: success, warning, and danger.":
    "ابني مجموعة دلالية: نجاح، تحذير، وخطر.",
  "Pick the three colors that carry universal meaning.":
    "اختار التلت ألوان اللي بتحمل معنى عالمي.",

  // Labels used in Color Theory scenes (also referenced by other new scenes)
  "TARGET": "الهدف",
  "MOST SATURATED": "الأكثر تشبّعاً",
  "COOLEST": "الأبرد",
  "WARMEST OF THE SET": "الأدفأ بالمجموعة",
  "COMPLEMENT OF": "المكمّل لـ",
  "BASE TEAL": "تركواز أساسي",
  "BRAND COLOR": "لون البراند",
  "PRODUCT NAVY": "أزرق المنتج",
  "10% ACCENT ROLE": "دور الـ ١٠٪",
  "DESTRUCTIVE ACTION": "أكشن مدمّر",
  "neutral support": "دعم حيادي",
  "analogous harmony": "تناسق متجاور",
  "semantic states": "حالات دلالية",
  "Find the exact target hue.": "لاقي اللون المطلوب بالضبط.",
  "Which one feels the warmest to the eye?":
    "أي وحدة بتحسّ أدفأ للعين؟",
  "Brand color set. Which two neutrals support it without fighting it?":
    "لون البراند جاهز. أي حياديين بدعموه بدون ما يتشاجروا معاه؟",

  // Design Principles new lessons
  "Tune Until It Passes": "ظبّط لحدّ ما يعدّي",
  "Adjust the text until WCAG accepts it.":
    "ظبّط النصّ لحدّ ما يقبله WCAG.",
  "Don't guess — measure.": "ما تخمّن — قِس.",
  "Pros don't eyeball contrast. They measure it. Nudge the text until the ratio crosses 4.5:1.":
    "المحترفين ما بيقدّروا التباين بالنظر. بيقيسوه. حرّك النصّ لحدّ ما النسبة تعدّي ٤٫٥:١.",
  "Push the body text until it passes WCAG AA.":
    "ادفع نصّ المحتوى لحدّ ما يعدّي WCAG AA.",
  "The body text is too pale. Make it darker until WCAG accepts it.":
    "نصّ المحتوى باهت. خلّيه أغمق لحدّ ما يقبله WCAG.",
  "Spot the Brand Color": "لاقي لون البراند",
  "Learn to recognize a hue at a glance.":
    "تعلّم تعرف اللون بنظرة سريعة.",
  "Designers see hue, not just 'blue.'": "المصمّمين بيشوفوا اللون، مش بس «أزرق».",
  "Two blues can feel completely different. Train your eye to find the exact one.":
    "في أزرقين بيقدروا يحسّوا مختلفين كلياً. درّب عينك علشان تلاقي بالضبط اللي بدّك إيّاه.",
  "Tap the swatch that matches the target.":
    "اضغط على المربّع اللي بيطابق الهدف.",
  "Pick the warmest swatch.": "اختار المربّع الأدفأ.",
  "Build the Palette": "ابني الباليت",
  "Pick the supporting colors that work with the brand.":
    "اختار الألوان الداعمة اللي بتشتغل مع البراند.",
  "Color systems beat color picks.": "أنظمة الألوان بتتفوّق على اختيارات الألوان.",
  "A brand is a system, not a single color. Pick the two supporting tones that hold the brand together.":
    "البراند نظام، مش لون واحد. اختار اللونين الداعمين اللي بمسكوا البراند سوا.",
  "Pick the two neutrals that complete this brand system.":
    "اختار الحياديين اللي بكمّلوا نظام البراند.",

  // Typography intros + new lesson
  "Two families, two voices.": "عيلتين، صوتين.",
  "Serifs whisper editorial trust. Sans-serifs speak modern clarity. The right choice sets the tone before a single word is read.":
    "خطوط Serif بتهمس بثقة تحريرية. Sans-serif بتحكي بوضوح حديث. الاختيار الصح بيحدّد المزاج قبل ما تنقرا كلمة وحدة.",
  "Pairs aren't twins.": "الأزواج مش توأم.",
  "Two fonts on a page should feel like a duet — different enough to give each a job, similar enough to belong together.":
    "خطّين بنفس الصفحة لازم يحسّوا زي ثنائي — مختلفين كفاية علشان كل واحد يكون عنده شغلة، ومتشابهين كفاية علشان ينتموا لبعض.",
  "Pick the Stronger Headline": "اختار العنوان الأقوى",
  "Spot the pairing that earns its hierarchy.":
    "لاقي التوليفة اللي بتستحقّ تسلسلها.",
  "Hierarchy is a duet.": "التسلسل ثنائي.",
  "Headline + body is the most-used pair on the planet. Pick the take that uses contrast on purpose.":
    "العنوان + النصّ هو الزوج الأكثر استعمالاً بالعالم. اختار النسخة اللي بتستعمل التباين بقصد.",
  "Which headline pair carries more confidence?":
    "أي توليفة عناوين بتحمل ثقة أكبر؟",
  "Same words, two pairings. Pick the one with intentional contrast.":
    "نفس الكلمات، توليفتين. اختار اللي تباينه مقصود.",
  "Drag tasks across days. We'll keep your weekend free.":
    "اسحب المهام بين الأيام. منخلّي عطلتك فاضية.",
  "Pick up where you left off — your draft is saved.":
    "كمّل من وين وقفت — مسوّدتك محفوظة.",
  "Free for the first 14 days": "مجاني أوّل ١٤ يوم",
  "Big numbers, easy reads": "أرقام كبيرة، قراية سهلة",
  "Trends at a glance.": "الاتجاهات بنظرة سريعة.",

  // Course 6 explanations
  "Hue is the color family — its position on the color wheel. Saturation and lightness modify it.":
    "اللون (Hue) هو عيلة اللون — موقعه على عجلة الألوان. التشبّع والسطوع بيعدّلوا عليه.",
  "Saturation = how vivid the color is. The pure pink pops because it has no grey mixed in.":
    "التشبّع = كم اللون قوي. الزهر الصافي بيلفت النظر لأنه ما فيه رمادي مخلوط معه.",
  "Saturation is the dial between full color and pure grey. Drop it all the way and any hue becomes grey.":
    "التشبّع هو الزرّ بين اللون الكامل والرمادي الصافي. نزّله للآخر وأي لون بيصير رمادي.",
  "Cool colors live on the blue/green/purple side of the wheel. The teal sits squarely there.":
    "الألوان الباردة بتسكن جهة الأزرق/الأخضر/البنفسجي بالعجلة. التركواز موجود هناك بالضبط.",
  "Temperature contrast is one of the strongest ways to make an element jump forward — it works even when saturation is restrained.":
    "تباين الحرارة من أقوى الطرق لتقفّز عنصر للأمام — بيشتغل حتى لو التشبّع محتشم.",
  "Orange's complement is blue. They sit directly opposite on the wheel and create the strongest contrast.":
    "مكمّل البرتقالي هو الأزرق. بيقعدوا قبال بعضهم مباشرةً بالعجلة وبعملوا أقوى تباين.",
  "Two full-saturation complements vibrate hard and cause eye strain. Pros pull one color's saturation down so the other can lead.":
    "لونين مكمّلين بتشبّع كامل بيهتزّوا بقوّة وبيتعبوا العين. المحترفين بيخفّضوا تشبّع لون علشان التاني يقود.",
  "Analogous colors live next to each other on the wheel. The blue and the green are the teal's wheel neighbours; the pink and yellow are far away.":
    "الألوان المتجاورة بتسكن جنب بعضها بالعجلة. الأزرق والأخضر هنّي جيران التركواز؛ الزهر والأصفر بعاد عنه.",
  "Triadic palettes pick three colors equally spaced (120° apart). They feel vibrant and balanced — think red/yellow/blue.":
    "الباليت الثلاثية بتختار تلت ألوان بمسافات متساوية (١٢٠° بين كل اتنين). بتحسّ نابضة ومتوازنة — فكّر بأحمر/أصفر/أزرق.",
  "4.5:1 is the AA bar for body text. Large text (18pt+) can drop to 3:1. AAA bumps body text to 7:1.":
    "٤٫٥:١ هو حدّ AA لنصّ المحتوى. النصوص الكبيرة (١٨pt+) ممكن تنزل لـ ٣:١. AAA بيرفع نصّ المحتوى لـ ٧:١.",
  "When text sits in the same brightness range as its background, contrast collapses. Pushing the label darker pulls it away from the pink's luminance until it clears 4.5:1.":
    "لمّا النصّ يكون بنفس مدى سطوع الخلفية، التباين بينهار. خلّي الليبل أغمق علشان يبتعد عن سطوع الزهر لحدّ ما يعدّي ٤٫٥:١.",
  "This label is barely readable on the pink. Push it darker until it clears WCAG AA.":
    "الليبل بالكاد ينقرى على الزهر. خلّيه أغمق لحدّ ما يعدّي WCAG AA.",
  "On dark backgrounds you usually need to lighten the text — pure white isn't always required, but you need to clear 4.5:1.":
    "على الخلفيات الغامقة عادةً لازم تفتّح النصّ — الأبيض الصافي مش دايماً مطلوب، بس لازم تعدّي ٤٫٥:١.",
  "Large headline text only needs 3:1 to pass AA. The bar is lower because big shapes are easier to read.":
    "نصّ العنوان الكبير بس بدّه ٣:١ علشان يعدّي AA. الحدّ أوطى لأنه الأشكال الكبيرة أسهل للقراية.",
  "The 10% is your loudest color — reserved for the action you want users to take. Spread it everywhere and it loses meaning.":
    "الـ ١٠٪ هو لونك الأعلى صوتاً — محفوظ للأكشن اللي بدّك المستخدمين يعملوه. وزّعه بكل مكان وبيفقد معناه.",
  "Neutrals make up the 60% and 30%. The saturated brand pink is the 10% — used only for the primary action.":
    "الحياديين بيشكّلوا الـ ٦٠٪ والـ ٣٠٪. زهر البراند المشبّع هو الـ ١٠٪ — مستعمَل بس للأكشن الأساسي.",
  "Red signals destruction across cultures and platforms. Use it for delete, archive, and similar irreversible actions.":
    "الأحمر بيشير للدمار عبر كل الثقافات والمنصّات. استعمله للحذف والأرشفة والأكشن اللي ما بترجع.",
  "Green = success, yellow/amber = warning, red = danger. The blues and pinks are brand colors, not semantic ones.":
    "أخضر = نجاح، أصفر/كهرماني = تحذير، أحمر = خطر. الأزرق والزهر ألوان براند، مش دلالية.",

  // New Design Principles + Typography lesson explanations
  "4.5:1 is the AA bar for body text. Below it, real users — especially in sunlight — start to lose words.":
    "٤٫٥:١ هو حدّ AA لنصّ المحتوى. أقل منّه، المستخدمين الحقيقيين — خاصةً تحت الشمس — بيبلّشوا يضيّعوا كلمات.",
  "Same family of blues, but only one is a true cyan. Look for the cooler, greener tilt.":
    "نفس عيلة الأزرق، بس واحد بس هو سيان حقيقي. دوّر على الميلان الأبرد والأخضر شوي.",
  "Reds, oranges and warm yellows feel hot. The terracotta is the warmest of these.":
    "الأحمر والبرتقالي والأصفر الدافي بيحسّوا سخنين. الترّاكوتا هو الأدفأ بهدول.",
  "A brand needs a near-black for text and a near-white for surfaces. Saturated greens and pinks would fight the brand color.":
    "البراند بدّه لون قريب للأسود للنصّ وقريب للأبيض للأسطح. الأخضر والزهر المشبّعين رح يتشاجروا مع لون البراند.",
  "B wins. A heavy headline with quiet body copy creates a clear first read. Two equal weights flatten the page.":
    "B بيكسب. عنوان ثقيل مع نصّ هادي بيعمل قراية أولى واضحة. وزنين متساويين بيسطّحوا الصفحة.",


  "Pros don't eyeball contrast. They measure it. The text only ships when the ratio is in the green.":
    "المحترفين ما بيقدّروا التباين بالعين. بيقيسوه. النصّ بس بينشر لمّا النسبة تصير بالأخضر.",
  "Hue training is muscle memory. The more you do it, the faster you spot a brand color in the wild.":
    "تدريب اللون ذاكرة عضلية. كل ما تتمرّن أكتر، كل ما لقيت لون البراند بالشارع أسرع.",
  "Warmth lives in the red/orange/yellow side of the wheel. The amber sits squarely there.":
    "الدفا بيسكن جهة الأحمر/البرتقالي/الأصفر بالعجلة. الكهرماني موجود هناك بالضبط.",
  "A brand needs supporting neutrals — not more saturated colors fighting for attention. Pick the two that calm the system.":
    "البراند بدّه حياديين داعمين — مش ألوان مشبّعة أكتر بتتقاتل على الانتباه. اختار اللي بهدّوا النظام.",
  "Same words, two pairings. The version with bold weight + clear size jump carries the hierarchy you want.":
    "نفس الكلمات، توليفتين. النسخة بالخطّ العريض + قفزة الحجم الواضحة بتحمل التسلسل اللي بدّك إيّاه.",

  // Module-unlock messages for Color Theory
  "Color foundations unlocked. The dials are yours.":
    "أساسيات الألوان فُتحت. الأزرار صارت بإيدك.",
  "Color wheel unlocked. Harmony on demand.":
    "عجلة الألوان فُتحت. تناسق متى ما بدّك.",
  "Contrast unlocked. Real users can read your work.":
    "التباين فُتح. المستخدمين الحقيقيين بقدروا يقروا شغلك.",
  "Brand systems unlocked. One color, full palette.":
    "أنظمة البراند فُتحت. لون واحد، باليت كامل.",

  // Course 5: Golden Ratio
  "The Golden Ratio": "النسبة الذهبية",
  "Unlock nature's most beautiful proportion.":
    "افتح أحلى نسبة بالطبيعة.",
  "Phi & Beauty": "ϕ والجمال",
  "Discover the mathematical basis of aesthetic harmony.":
    "اكتشف الأساس الرياضي للتناسق الجمالي.",
  "The Golden Ratio Explained": "شرح النسبة الذهبية",
  "What is phi and why do humans find it beautiful?":
    "شو هي ϕ وليش الإنسان بيشوفها حلوة؟",
  "Applying Phi": "تطبيق ϕ",
  "Use the golden ratio in real design work.":
    "استعمل النسبة الذهبية بشغل تصميم حقيقي.",
  "Golden Ratio in Layout": "النسبة الذهبية بالتصميم",
  "Structure compositions using phi-based proportions.":
    "ابني تصاميمك بنسب مبنية على ϕ.",

  // ===== Lesson intro headlines / bodies =====
  "Contrast is how design speaks.": "التباين هو لغة التصميم.",
  "Without it, everything blends. With it, the eye knows where to land first.":
    "بدونه، كل شي بيذوب ببعضه. معه، العين بتعرف على وين تنزل أول شي.",
  "High contrast: the headline pops, the action is unmissable.":
    "تباين عالي: العنوان بيطلّ، والأكشن ما بيفوت.",
  "Low contrast: the eye gets lost, and nothing feels primary.":
    "تباين خفيف: العين بتضيع، وما في إشي بيحسّ إنه الأساس.",
  "Train your eye.": "درّب عينك.",
  "One element on this screen would fail in production. Tap it.":
    "في عنصر بهالشاشة ما رح يمرق بالإنتاج. اضغط عليه.",
  "Two takes. One winner.": "نسختين. وحدة بس بتفوز.",
  "Same content, two takes. Pick the one that earned its hierarchy.":
    "نفس المحتوى، نسختين. اختار اللي تسلسلها واضح.",
  "Every text style is a promise.": "كل ستايل خط هو وعد.",
  "Bigger says 'start here.' Smaller says 'detail.' Match sizes to priorities.":
    "الكبير بقول «ابدأ من هون». الصغير بقول «تفصيل». طبّق الحجم حسب الأولوية.",
  "Three sizes, clear roles — eye lands on the headline first.":
    "تلت أحجام، أدوار واضحة — العين بتنزل عالعنوان أول شي.",
  "Everything is the same size. The page has no entry point.":
    "كل شي بنفس الحجم. الصفحة ما إلها مدخل.",
  "Headlines earn the rest of the page.":
    "العناوين بتكسب باقي الصفحة.",
  "If the headline doesn't land, no one reads the body.":
    "إذا العنوان ما وصل، ما حدا رح يقرا النص.",
  "Order is hierarchy.": "الترتيب هو التسلسل.",
  "Order matters before fonts do. Sort these the way a user scans.":
    "الترتيب بيجي قبل الخط. رتّبهن بالطريقة اللي المستخدم بيمرّقهن فيها.",
  "Space is a tool, not leftover.": "الفراغ أداة، مش بقايا.",
  "Whitespace groups, separates, and lets the eye rest.":
    "الفراغ بيجمّع، وبيفرّق، وبيخلّي العين ترتاح.",
  "Generous spacing: each item has room. Easy to scan.":
    "مسافات كريمة: كل عنصر إله مساحته. سهل تمرّق نظرك.",
  "No spacing: items collide. The eye doesn't know where one ends.":
    "بدون مسافات: العناصر بتتلطّش. العين ما بتعرف وين بيخلص العنصر.",
  "When spacing breaks, hierarchy breaks.":
    "لمّا تنكسر المسافات، بينكسر التسلسل.",
  "Look at this card. One element is suffocating. Tap it.":
    "طلّ على هالكرت. في عنصر عم يختنق. اضغط عليه.",
  "Order tells a story.": "الترتيب بيحكي قصّة.",
  "Settings screens with no logic feel chaotic. Drag these into a sensible flow.":
    "شاشات الإعدادات بدون منطق بتحسّها فوضى. رتّبهن بتسلسل معقول.",
  "Color is a signal, not paint.": "اللون إشارة، مش دهان.",
  "Red stops. Green goes. Your brand color means 'tap here.' Every color does a job.":
    "الأحمر بوقّف. الأخضر بيمرّق. لون البراند بقول «اضغط هون». كل لون إله شغلة.",
  "One brand color, used only for primary actions. Easy to find what to tap.":
    "لون براند واحد، بس للأكشن الأساسي. سهل تلاقي شو تضغط.",
  "Color used everywhere — nothing stands out, and the brand color loses meaning.":
    "لون بكل مكان — ما في شي بيلفت، ولون البراند بيفقد معناه.",
  "The right color can carry the brand.\n\n":
    "اللون الصح بيحمل البراند لحاله.",
  "Same product, two palettes. Pick the one that feels considered.":
    "نفس المنتج، باليتين. اختار اللي بيحسّ إنه مدروس.",
  "First impressions are real.": "الانطباع الأول حقيقي.",
  "We'll flash a screen for five seconds. Glance — then we'll ask what stuck.":
    "رح نطلّع شاشة بـ ٥ ثواني. طلّ بسرعة — وبعدين نسألك شو ضلّ بعقلك.",
  "Glance at this screen, then answer.":
    "طلّ على هالشاشة، وبعدين جاوب.",
  "The lime headline is biggest and brightest — that's where the eye lands first.":
    "العنوان اللون الليموني أكبر وأبرق — هون العين بتنزل أول شي.",
  "Every screen has a first read.": "كل شاشة إلها قراية أولى.",
  "The eye lands somewhere first. Hierarchy makes that landing intentional.":
    "العين بتنزل بمكان أول شي. التسلسل بيخلّي النزول هاد مقصود.",
  "Clear first-read: big number, then label, then context.":
    "قراية أولى واضحة: رقم كبير، بعدين الليبل، بعدين السياق.",
  "Three competing emphasis levels — none of them wins.":
    "تلت مستويات تأكيد عم تتنافس — ولا وحدة عم تفوز.",
  "A real screen has one main action.":
    "الشاشة الحقيقية إلها أكشن واحد رئيسي.",
  "Hierarchy makes the next step obvious. Tap what the user should do first.":
    "التسلسل بيخلّي الخطوة الجاي واضحة. اضغط شو لازم المستخدم يعمل أول شي.",
  "Order is half of hierarchy.": "الترتيب نصف التسلسل.",
  "Section order shapes the story. Sort these into a flow that converts.":
    "ترتيب الأقسام بيشكّل القصّة. رتّبهن بمسار بيحوّل.",
  "Nobody reads the whole screen.": "ما حدا بيقرا الشاشة كلها.",
  "Users scan, they don't read. If they can't find it fast, you've lost them.":
    "المستخدمين بيمرّقوا نظرهم، ما بيقروا. إذا ما لقوا الشي بسرعة، خسرتهم.",
  "Scannable: big label, clear value, obvious action.":
    "سهلة التصفّح: ليبل كبير، قيمة واضحة، أكشن مفهوم.",
  "Wall of text: no entry point, no escape route.":
    "حيط من النصّ: لا مدخل ولا مخرج.",
  "Five seconds decide the rest.": "الخمس ثواني هي اللي بتقرّر.",
  "First impressions form in under five seconds. Glance, then we'll ask what stuck.":
    "الانطباع الأول بيتشكّل بأقل من ٥ ثواني. طلّ بسرعة، وبعدين نسألك شو ضلّ بعقلك.",
  "Glance at this landing page, then answer.":
    "طلّ على صفحة الهبوط هاي، وبعدين جاوب.",
  "One message lands first. The huge 'Plan your week' headline is what people remember.":
    "رسالة وحدة بتنزل أول شي. العنوان الضخم «نظّم أسبوعك» هو اللي الناس بتتذكّره.",
  "Friction kills good intentions.": "الاحتكاك بيقتل النوايا الحلوة.",
  "Friction kills conversions. Find the trap on this checkout screen.":
    "الاحتكاك بيقتل التحويلات. لاقي الفخ بشاشة الدفع هاي.",

  // ===== Question prompts =====
  "What does contrast primarily do for a layout?":
    "شو الشغلة الأساسية للتباين بالتصميم؟",
  "WCAG AA requires body text to hit at least which contrast ratio?":
    "WCAG AA بتطلب إنه نصّ المحتوى يكون عنده تباين على الأقل قدّ شو؟",
  "Tap the element with a contrast problem.":
    "اضغط على العنصر اللي عنده مشكلة تباين.",
  "One of these is unreadable for a lot of users. Tap it.":
    "وحدة من هدول صعبة على كتير ناس يقروها. اضغط عليها.",
  "When fixing a low-contrast button, the safest move is to:":
    "لمّا تصلّح زرّ تباينه ضعيف، أأمن خطوة:",
  "Which onboarding screen leads the eye better?":
    "أي شاشة أونبوردنغ بتقود العين أحسن؟",
  "Same content, different contrast choices. Pick the stronger one.":
    "نفس المحتوى، خيارات تباين مختلفة. اختار الأقوى.",
  "What's the main job of a typographic hierarchy?":
    "شو الشغلة الأساسية للتسلسل الطباعي؟",
  "Body text usually reads best between 14 and 18px on mobile.":
    "نصّ المحتوى عادةً بيكون أحسن قراية بين ١٤ و١٨ بكسل عالموبايل.",
  "A comfortable line height for body text is about:":
    "ارتفاع السطر المريح لنصّ المحتوى تقريباً:",
  "Which headline treatment carries more confidence?":
    "أي معالجة عنوان بتحمل ثقة أكبر؟",
  "Mixing 4+ fonts on one screen usually strengthens hierarchy.":
    "خلط ٤ خطوط أو أكثر بنفس الشاشة عادةً بيقوّي التسلسل.",
  "Order this product card so the eye lands the right way.":
    "رتّب كرت المنتج بحيث تنزل العين بالطريق الصح.",
  "Tap the arrows to put these blocks in the order a buyer would scan them.":
    "اضغط على الأسهم لترتيب البلوكات بنفس ترتيب ما المشتري بيمرّق نظره.",
  "Whitespace between two elements primarily signals:":
    "الفراغ بين عنصرين بيشير أساساً لـ:",
  "Items in the same group should have less space between them than between groups.":
    "العناصر بنفس المجموعة لازم يكون بينها مسافة أقل من المسافة بين المجموعات.",
  "A consistent spacing scale (4, 8, 12, 16, 24…) helps because:":
    "مقياس مسافات ثابت (٤، ٨، ١٢، ١٦، ٢٤…) بيساعد لأنه:",
  "Tap the element with a spacing problem.":
    "اضغط على العنصر اللي عنده مشكلة مسافات.",
  "Something here doesn't have enough room. Tap it.":
    "في إشي هون ما إله مساحة كافية. اضغط عليه.",
  "Order these settings the way a user would expect them.":
    "رتّب الإعدادات بالطريقة اللي المستخدم بيتوقّعها.",
  "Tap the arrows to put settings in the order users expect.":
    "اضغط على الأسهم لترتيب الإعدادات بالشكل اللي المستخدم بيتوقّعه.",
  "Why use only one accent color for primary actions?":
    "ليش نستعمل لون مميّز واحد بس للأكشن الأساسي؟",
  "Red is generally associated with destructive or warning actions.":
    "الأحمر عادةً بيرمز لأكشن مدمّر أو تحذير.",
  "A solid neutral palette usually contains:":
    "الباليت الحيادي القوي عادةً فيه:",
  "Which palette feels more like a real product?":
    "أي باليت بيحسّ إنه منتج حقيقي أكثر؟",
  "What was the dominant brand color?":
    "شو كان لون البراند المهيمن؟",
  "Visual hierarchy primarily uses what to lead the eye?":
    "التسلسل البصري بيستعمل شو أساساً ليقود العين؟",
  "If everything on a screen is bold, hierarchy gets stronger.":
    "إذا كل شي بالشاشة بولد، التسلسل بيقوى.",
  "Which is usually the strongest position for the most important element?":
    "وين عادةً أقوى مكان للعنصر الأهم؟",
  "Tap the primary call-to-action.": "اضغط على الأكشن الأساسي.",
  "Where's the next step? Tap it.": "وين الخطوة الجاي؟ اضغط عليها.",
  "A screen should usually have one primary action, with secondary actions visibly quieter.":
    "الشاشة عادةً لازم يكون فيها أكشن أساسي واحد، والأكشنات الثانوية أهدى بشكل واضح.",
  "Order these landing-page sections from top to bottom.":
    "رتّب أقسام صفحة الهبوط من فوق لتحت.",
  "Order these from top of the page to bottom.":
    "رتّبهن من فوق الصفحة لتحت.",
  "What's the single biggest UX win in most layouts?":
    "شو أكبر فوز بتجربة الاستخدام بأغلب التصاميم؟",
  "A user's first action on a screen should be obvious within a few seconds.":
    "أول أكشن للمستخدم على الشاشة لازم يكون واضح بثواني.",
  "An empty state is best treated as:":
    "الحالة الفارغة الأفضل التعامل معها كـ:",
  "What was the main thing that screen wanted you to do?":
    "شو الشي الأساسي اللي الشاشة بدّها ياك تعمله؟",
  "Tap the element that adds unnecessary friction.":
    "اضغط على العنصر اللي بيضيف احتكاك بدون داعي.",
  "Something here will cost conversions. Tap it.":
    "في إشي هون رح يخسّر التحويلات. اضغط عليه.",
  "On a destructive screen, the safer pattern is:":
    "بالشاشة المدمّرة، النمط الأأمن هو:",
  "Serif typefaces are characterized by:": "خطوط Serif بتتميّز بـ:",
  "Sans-serif fonts are generally considered more modern and clean than serif fonts.":
    "خطوط Sans-serif عادةً بتنحسب أحدث وأنظف من خطوط Serif.",
  "For long-form digital reading, which is recommended?":
    "للقراءة الرقمية الطويلة، شو المُنصح فيه؟",
  "Mixing a serif headline with a sans-serif body text is a classic typographic pairing.":
    "خلط عنوان Serif مع نصّ Sans-serif توليفة طباعية كلاسيكية.",
  "The Major Third type scale uses a ratio of:":
    "مقياس الخطوط Major Third بيستعمل نسبة:",
  "A modular scale ensures typographic sizes are related by a consistent ratio.":
    "المقياس النمطي بيضمن إنه أحجام الخطوط مرتبطة بنسبة ثابتة.",
  "Line height (leading) for body text should typically be:":
    "ارتفاع السطر لنصّ المحتوى عادةً لازم يكون:",
  "The most important rule when pairing fonts is:":
    "أهم قاعدة وقت توليف الخطوط:",
  "Using two fonts from the same superfamily (e.g., Roboto and Roboto Slab) is a safe pairing strategy.":
    "استعمال خطّين من نفس العيلة الكبيرة (مثل Roboto و Roboto Slab) استراتيجية توليف آمنة.",
  "In a standard 12-column grid, content spanning 6 columns occupies:":
    "بشبكة معيارية ١٢ عمود، المحتوى اللي بياخد ٦ أعمدة بيحتلّ:",
  "Gutters are the spaces between grid columns.":
    "الـ Gutters هي المسافات بين أعمدة الشبكة.",
  "Which grid system is most commonly used in mobile UI design?":
    "أي نظام شبكة الأكثر استعمالاً بتصميم واجهات الموبايل؟",
  "A bottom tab bar in mobile apps is optimal for:":
    "شريط التابز التحتاني بتطبيقات الموبايل مثالي لـ:",
  "The hamburger menu is the most accessible navigation pattern for mobile.":
    "قائمة الهامبرغر أكثر نمط تنقّل سهل الوصول عالموبايل.",
  "Which navigation pattern is best for deep content hierarchies on mobile?":
    "أي نمط تنقّل الأفضل للتسلسلات العميقة عالموبايل؟",
  "Brand identity is best described as:": "الهويّة البصرية الأفضل وصفها كـ:",
  "A strong brand identity must remain completely static and never evolve.":
    "الهويّة القوية لازم تضلّ ثابتة تماماً وما تتطوّر أبداً.",
  "Which element is considered the anchor of most brand identity systems?":
    "أي عنصر بينحسب أساس أغلب أنظمة الهويّة البصرية؟",
  "The golden ratio (phi) is approximately equal to:":
    "النسبة الذهبية (ϕ) تقريباً بتساوي:",
  "The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13...) approximates the golden ratio.":
    "متتالية فيبوناتشي (١، ١، ٢، ٣، ٥، ٨، ١٣...) بتقرّب من النسبة الذهبية.",
  "The golden rectangle has proportions of:":
    "المستطيل الذهبي إله نسب:",
  "Which of these logo designs is said to use golden ratio proportions?":
    "أي لوغو من هدول بيقولوا إنه بيستعمل نسب النسبة الذهبية؟",
  "To apply the golden ratio to a 1000px wide layout, the main column should be approximately:":
    "لتطبيق النسبة الذهبية على تصميم عرضه ١٠٠٠ بكسل، العمود الأساسي لازم يكون تقريباً:",
  "The rule of thirds is an approximation of the golden ratio.":
    "قاعدة الأثلاث تقريب للنسبة الذهبية.",
  "Which design principle refers to the perceived 'heaviness' of elements in a composition?":
    "أي مبدأ تصميم بيشير لـ«ثقل» العناصر بالتصميم؟",
  "A typeface classified as 'italic' is the same as one classified as 'oblique'.":
    "الخط المصنّف «italic» نفس الخط المصنّف «oblique».",
  "The Gestalt principle of 'proximity' states that:":
    "مبدأ الـ Gestalt اللي اسمه «التقارب» بقول إنه:",
  "In color theory, complementary colors sit opposite each other on the color wheel.":
    "بنظرية الألوان، الألوان المكمّلة بتقعد قبال بعضها بعجلة الألوان.",
  "What is kerning in typography?": "شو الـ Kerning بالخطوط؟",
  "A 'hero' section in web design refers to:":
    "قسم الـ «Hero» بتصميم الويب بيشير لـ:",
  "CMYK is the color model used for screen/digital design.":
    "CMYK هو نظام الألوان المستعمل لتصميم الشاشات/الرقمي.",
  "The '60-30-10 rule' in color design refers to:":
    "«قاعدة ٦٠-٣٠-١٠» بتصميم الألوان بتشير لـ:",
  "What does 'affordance' mean in UX/product design?":
    "شو معنى «affordance» بتصميم تجربة الاستخدام؟",
  "Whitespace (or negative space) is wasted space that should be filled with content.":
    "الفراغ (أو المساحة السلبية) مساحة ضايعة لازم تنملا بمحتوى.",

  // ===== Multiple choice options =====
  "Makes the screen look busy": "بتخلّي الشاشة شكلها مزدحمة",
  "Tells the eye what's most important": "بتقول للعين شو الأهم",
  "Adds extra colors for variety": "بتضيف ألوان زيادة للتنويع",
  "Slows the user down on purpose": "بتبطّئ المستخدم عن قصد",
  "2:1": "٢:١",
  "3:1": "٣:١",
  "4.5:1": "٤٫٥:١",
  "7:1": "٧:١",
  "Add a subtle border around it": "ضيف إطار خفيف حواليه",
  "Make the fill darker and the text white": "خلّي التعبية أغمق والنصّ أبيض",
  "Increase the corner radius": "زوّد انحناء الزوايا",
  "Use a lighter shade of the brand color":
    "استعمل درجة أفتح من لون البراند",
  "A": "أ",
  "B": "ب",
  "Show off the font you bought": "تستعرض الخط اللي اشتريته",
  "Tell the reader where to look first, second, third":
    "تقول للقارئ على وين يطلّ أول، تاني، تالت",
  "Fill the page with variety": "تعبّي الصفحة بتنويع",
  "Match a competitor's look": "تشابه شكل المنافس",
  "1.0× the font size": "١٫٠× حجم الخط",
  "1.2× the font size": "١٫٢× حجم الخط",
  "1.5× the font size": "١٫٥× حجم الخط",
  "2.5× the font size": "٢٫٥× حجم الخط",
  "That you ran out of content": "إنه المحتوى خلص معك",
  "That those elements are unrelated, or that one is finished":
    "إنه العناصر هاي مش مرتبطة، أو إنه وحدة منهن خلصت",
  "That the screen needs more padding everywhere":
    "إنه الشاشة بدها حشو زيادة بكل مكان",
  "That the design isn't done yet": "إنه التصميم لسا ما خلص",
  "It looks more mathematical": "بيطلع شكله رياضي أكتر",
  "It removes guesswork and creates visual rhythm":
    "بيشيل التخمين وبيعمل إيقاع بصري",
  "It makes the file size smaller": "بيصغّر حجم الملف",
  "It's required by accessibility": "مطلوب حسب معايير سهولة الوصول",
  "Because designers like minimalism": "لأنه المصمّمين بيحبّوا البساطة",
  "So the user instantly knows where to tap":
    "ليعرف المستخدم على طول وين يضغط",
  "Because more colors cost more to print": "لأنه ألوان أكتر بتكلّف أكتر بالطباعة",
  "It's required by app stores": "مطلوب من متاجر التطبيقات",
  "One grey": "رمادي واحد",
  "5–6 greys at different values": "٥-٦ درجات رمادي بقيم مختلفة",
  "Only pure black and pure white": "أسود وأبيض نقي بس",
  "Every color in the rainbow at low saturation":
    "كل ألوان قوس قزح بتشبّع منخفض",
  "Green": "أخضر",
  "Pink": "زهري",
  "Yellow / lime": "أصفر / ليموني",
  "Orange": "برتقالي",
  "Animations": "حركات",
  "Differences in size, weight, color, and position":
    "اختلافات بالحجم والوزن واللون والموقع",
  "More text": "نصّ أكتر",
  "Drop shadows on everything": "ظلال على كل شي",
  "Bottom-right corner": "الزاوية اليمين السفلى",
  "Top-left or upper-center, where reading begins":
    "الشمال العلوي أو الوسط العلوي، وين بتبدأ القراية",
  "Anywhere with a drop shadow": "أي مكان فيه ظلّ",
  "Inside a footer": "جوّا الفوتر",
  "Adding more animations": "إضافة حركات أكتر",
  "Reducing the words and amplifying the structure":
    "تقليل الكلمات وتعزيز الهيكل",
  "Using more fonts": "استعمال خطوط أكتر",
  "Filling every pixel with information": "تعبية كل بكسل بمعلومات",
  "Wasted space — fill it with marketing":
    "مساحة ضايعة — عبّيها بإعلانات",
  "An invitation to take the first action":
    "دعوة لاتخاذ الخطوة الأولى",
  "An error to apologize for": "غلطة لازم تعتذر عنها",
  "A reason to hide the screen": "سبب لتخبّي الشاشة",
  "Read a long article": "تقرا مقال طويل",
  "Plan your week": "تنظّم أسبوعك",
  "Buy a hardware product": "تشتري منتج مادي",
  "Sign up for a newsletter": "تشترك بنشرة بريدية",
  "Two equally bold buttons side-by-side":
    "زرّين بنفس القوّة جنب بعض",
  "Primary action prominent, destructive action quiet or separated":
    "الأكشن الأساسي بارز، والمدمّر هادي أو منفصل",
  "Hide the destructive action behind a long-press":
    "تخبّي الأكشن المدمّر ورا ضغطة طويلة",
  "Use the same color for both buttons": "تستعمل نفس اللون للزرّين",
  "Clean, stroke-free letterforms": "حروف نظيفة بدون زخارف",
  "Small decorative strokes at letter ends":
    "زخارف صغيرة بأطراف الحروف",
  "All-caps styling": "كل الحروف كبيرة",
  "Variable line widths only": "عرض السطور متغيّر بس",
  "Display fonts only": "خطوط Display بس",
  "Script fonts": "خطوط Script",
  "High-legibility sans-serif or readable serif":
    "Sans-serif واضح أو Serif سهل القراية",
  "Condensed typefaces": "خطوط مضغوطة",
  "1.125": "١٫١٢٥",
  "1.250": "١٫٢٥٠",
  "1.333": "١٫٣٣٣",
  "1.618": "١٫٦١٨",
  "Equal to font size (1x)": "مساوي لحجم الخط (١×)",
  "1.4–1.6x the font size": "١٫٤-١٫٦× حجم الخط",
  "2.0–2.5x the font size": "٢٫٠-٢٫٥× حجم الخط",
  "0.8x the font size": "٠٫٨× حجم الخط",
  "Use fonts from different centuries":
    "استعمل خطوط من قرون مختلفة",
  "Create clear contrast while maintaining harmony":
    "اعمل تباين واضح مع الحفاظ على التناسق",
  "Always use three or more fonts":
    "استعمل دايماً ٣ خطوط أو أكتر",
  "Match exactly — use fonts from the same family only":
    "طابق تماماً — استعمل خطوط من نفس العيلة بس",
  "25% of the container": "٢٥٪ من الحاوية",
  "50% of the container": "٥٠٪ من الحاوية",
  "75% of the container": "٧٥٪ من الحاوية",
  "100% of the container": "١٠٠٪ من الحاوية",
  "24-column grid": "شبكة ٢٤ عمود",
  "12-column grid": "شبكة ١٢ عمود",
  "4-column grid": "شبكة ٤ أعمدة",
  "Baseline grid only": "شبكة Baseline بس",
  "More than 7 primary sections": "أكتر من ٧ أقسام أساسية",
  "2–5 primary destinations": "٢-٥ وجهات أساسية",
  "Only single-page apps": "تطبيقات صفحة وحدة بس",
  "E-commerce checkout flows": "مسارات دفع التجارة الإلكترونية",
  "Bottom tab bar": "شريط التابز التحتاني",
  "Floating action button": "زرّ أكشن عائم",
  "Push navigation stack": "ستاك تنقّل Push",
  "Breadcrumb trail": "مسار Breadcrumb",
  "Just the logo and color palette": "اللوغو والألوان بس",
  "The complete visual and verbal expression of a brand":
    "التعبير البصري واللفظي الكامل للبراند",
  "The company's marketing budget": "ميزانية التسويق للشركة",
  "The product's packaging only": "تغليف المنتج بس",
  "Brand photography": "تصوير البراند",
  "Color palette": "الباليت",
  "The logo": "اللوغو",
  "Website layout": "تصميم الموقع",
  "1.414": "١٫٤١٤",
  "2.718": "٢٫٧١٨",
  "3.141": "٣٫١٤١",
  "1:2": "١:٢",
  "1:1.618": "١:١٫٦١٨",
  "2:3": "٢:٣",
  "3:4": "٣:٤",
  "Twitter (early bird)": "تويتر (الطير القديم)",
  "Apple logo": "لوغو أبل",
  "Microsoft logo": "لوغو مايكروسوفت",
  "Amazon logo": "لوغو أمازون",
  "500px": "٥٠٠ بكسل",
  "618px": "٦١٨ بكسل",
  "750px": "٧٥٠ بكسل",
  "800px": "٨٠٠ بكسل",
  "Visual rhythm": "إيقاع بصري",
  "Visual weight": "ثقل بصري",
  "Typographic contrast": "تباين طباعي",
  "Color temperature": "حرارة اللون",
  "Similar elements appear related": "العناصر المتشابهة بتبيّن مرتبطة",
  "Elements close together appear grouped":
    "العناصر القريبة من بعضها بتبيّن مجموعة",
  "Enclosed elements form a unit": "العناصر المحاطة بتشكّل وحدة",
  "The mind fills in missing information": "العقل بيكمّل المعلومات الناقصة",
  "The space between lines of text": "المسافة بين سطور النصّ",
  "The thickness of a letterform's stroke": "سماكة خطّ الحرف",
  "Adjusting space between specific letter pairs":
    "ضبط المسافة بين أزواج محددة من الحروف",
  "The height of capital letters": "ارتفاع الحروف الكبيرة",
  "The navigation bar": "شريط التنقّل",
  "The prominent header area at the top of the page":
    "منطقة الهيدر البارزة بأعلى الصفحة",
  "The footer content": "محتوى الفوتر",
  "A featured product card": "كرت منتج مميّز",
  "Frame rates for animation": "معدّلات إطارات الحركة",
  "Proportional color distribution (dominant, secondary, accent)":
    "توزيع نسبي للألوان (مهيمن، ثانوي، مميّز)",
  "Grid column ratios": "نسب أعمدة الشبكة",
  "A typeface classification system": "نظام تصنيف خطوط",
  "The cost of a design tool subscription":
    "كلفة اشتراك أداة تصميم",
  "Visual cues that suggest how an element can be interacted with":
    "إشارات بصرية بتقترح كيف بنتفاعل مع العنصر",
  "The loading performance of an interface": "أداء تحميل الواجهة",
  "Color contrast accessibility rating": "تقييم سهولة الوصول لتباين الألوان",

  // ===== Explanations =====
  "Contrast is signal — it tells the eye where to start.":
    "التباين إشارة — بقول للعين من وين تبدأ.",
  "Contrast can come from size, weight, or shape — not just color.":
    "التباين بيجي من الحجم والوزن والشكل — مش بس من اللون.",
  "Size and weight carry contrast too. Mix them to feel layered.":
    "الحجم والوزن بيحملوا تباين كمان. اخلطهن لتحسّ بطبقات.",
  "4.5:1 is the floor. Below it, body text gets unreadable for many.":
    "٤٫٥:١ هو الحد الأدنى. تحته، نصّ المحتوى بيصير مش مقروء لكتير ناس.",
  "'Save changes' is under 2:1 — way too quiet for a primary action.":
    "«احفظ التغييرات» تحت ٢:١ — هادي كتير لأكشن أساسي.",
  "Dark fill + white text is the cleanest way past 4.5:1.":
    "تعبية غامقة + نصّ أبيض هي أنظف طريقة لتعدية ٤٫٥:١.",
  "B wins. One dark CTA + muted text = clear path. Two bold buttons split attention.":
    "ب ربحت. أكشن غامق واحد + نصّ هادي = مسار واضح. زرّين قويين بيقسموا الانتباه.",
  "Hierarchy is a roadmap — headline, subhead, body, no thinking required.":
    "التسلسل خارطة طريق — عنوان، عنوان فرعي، نصّ، بدون تفكير.",
  "14–18px is the sweet spot. Smaller cramps, bigger shouts.":
    "١٤-١٨ بكسل هي النقطة الحلوة. أصغر بيخنق، أكبر بيصرخ.",
  "~1.5 breathes without falling apart. 1.0 is a wall, 2.5 disconnects.":
    "حوالي ١٫٥ بتتنفّس بدون ما تتفكّك. ١٫٠ حيط، و٢٫٥ بيقطع التواصل.",
  "B wins. Headline is 2–3× the body — a clear lead.":
    "ب ربحت. العنوان ٢-٣× النصّ — قيادة واضحة.",
  "Two font families, max. Hierarchy is size and weight — not more typefaces.":
    "عيلتين خطوط، حد أقصى. التسلسل بالحجم والوزن — مش بكثرة الخطوط.",
  "Name → price → description → action. Buttons first ask users to commit blind.":
    "الاسم → السعر → الوصف → الأكشن. الأزرار بالبداية بتطلب من المستخدم يلتزم وهو أعمى.",
  "Proximity = relationship. Close items group, distant items separate.":
    "التقارب = علاقة. القريب بيتجمّع، البعيد بينفصل.",
  "Tight inside groups, loose between them. No contrast, no structure.":
    "ضيّق جوّا المجموعة، واسع بينها. بدون تباين، بدون هيكل.",
  "A scale answers every spacing choice. Same rhythm = designed system.":
    "المقياس بيجاوب على كل خيار مسافة. نفس الإيقاع = نظام مصمّم.",
  "'Continue' has no breathing room. A primary action needs space around it.":
    "«كمّل» ما عنده مساحة تنفس. الأكشن الأساسي بدّه مساحة حواليه.",
  "Profile → notifications → privacy → sign out. Sign out up top invites accidents.":
    "البروفايل → الإشعارات → الخصوصية → تسجيل الخروج. تسجيل الخروج بالأعلى بيفتح الباب للأخطاء.",
  "Accent everywhere = accent nowhere. Reserve it for the primary action.":
    "اللون المميّز بكل مكان = بلا مكان. خبّيه للأكشن الأساسي.",
  "Red reads as caution. Reserve it for delete, error, or stop.":
    "الأحمر بقرا كتحذير. خبّيه للحذف، الخطأ، أو الوقف.",
  "Real interfaces need 5–6 greys: backgrounds, surfaces, dividers, two text shades.":
    "الواجهات الحقيقية بدها ٥-٦ درجات رمادي: خلفيات، أسطح، فواصل، ودرجتين للنصّ.",
  "B commits: one accent, neutral background. A spreads three colors — nothing leads.":
    "ب ملتزمة: لون مميّز واحد، خلفية حيادية. أ بتفرّق ٣ ألوان — ما في إشي بيقود.",
  "The lime headline is biggest and brightest — it lands first.":
    "العنوان الليموني أكبر وأبرق — هو اللي بينزل أول شي.",
  "Hierarchy is contrast — bigger, bolder, brighter, higher.":
    "التسلسل تباين — أكبر، أقوى، أبرق، أعلى.",
  "If everything's bold, nothing is. Hierarchy needs a high–low contrast.":
    "إذا كل شي بولد، ما في شي بولد. التسلسل بدّه تباين عالي-منخفض.",
  "Left-to-right eyes start top-left. Put the important thing where they land.":
    "العين اللي بتقرا من الشمال للّيمين بتبدأ من الشمال العلوي. حطّ المهم هناك.",
  "'Start free trial' wins — solid fill, brand color, top of the zone.":
    "«ابدأ التجربة المجانية» بتفوز — تعبية كاملة، لون البراند، أعلى المنطقة.",
  "Two loud buttons split attention. Pick one primary, demote the other to outline.":
    "زرّين قويين بيقسموا الانتباه. اختار واحد أساسي، وحوّل التاني لإطار.",
  "Hero → proof → features → CTA. Features first asks for details before users know the product.":
    "الهيرو → الإثبات → المزايا → الأكشن. المزايا قبل بتطلب تفاصيل قبل ما المستخدم يعرف المنتج.",
  "Cut copy, surface structure. Most UX wins are 'remove enough,' not 'add more.'":
    "قصّ النصّ، أبرز الهيكل. أغلب فوزات تجربة الاستخدام هي «شيل كفاية»، مش «ضيف أكتر».",
  "Find-it-fast or lose them. Loud primary action, quiet secondary ones.":
    "لقاه بسرعة أو خسرته. أكشن أساسي قوي، وثانوي هادي.",
  "Empty states are the cheapest onboarding. Show what success looks like, give one action.":
    "الحالات الفارغة أرخص أونبوردنغ. ورجي شو شكل النجاح، واعطي أكشن واحد.",
  "Headline says it, button reinforces it. Same job, twice — message lands.":
    "العنوان بقولها، والزرّ بيأكّدها. نفس الشغلة مرتين — الرسالة بتوصل.",
  "'Cancel' is loud red beside 'Pay now' — one wrong tap loses everything. Destructive actions should be quieter.":
    "«إلغاء» أحمر قوي جنب «ادفع هلأ» — ضغطة غلط وحدة بتخسّر كل شي. الأكشنات المدمّرة لازم تكون أهدى.",
  "Destructive actions deserve respect, not equal billing. Demote them to outline or move them out.":
    "الأكشنات المدمّرة بتستحق احترام، مش مكانة مساوية. حوّلها لإطار أو طلّعها برّا.",
  "Serifs are the small decorative strokes or feet at the ends of letterforms, found in fonts like Times New Roman and Georgia.":
    "الـ Serifs هي الزخارف أو الأرجل الصغيرة بأطراف الحروف، موجودة بخطوط مثل Times New Roman و Georgia.",
  "Sans-serif fonts lack the traditional decorative strokes of serifs, giving them a cleaner, more modern appearance — hence their popularity in digital UI design.":
    "خطوط Sans-serif ما عندها الزخارف التقليدية للـ Serifs، فبتطلع أنظف وأحدث — وهاد سبب شعبيتها بتصميم الواجهات الرقمية.",
  "Long-form digital content performs best with fonts optimized for screen legibility — high-quality sans-serifs or screen-optimized serifs designed at reading sizes.":
    "المحتوى الرقمي الطويل بيشتغل أفضل مع خطوط محسّنة للقراية على الشاشة — Sans-serifs عالية الجودة أو Serifs مصمّمة لأحجام القراية.",
  "Pairing a serif for headlines with a sans-serif for body text creates strong contrast and is a beloved typographic convention used in editorial and web design.":
    "توليف Serif للعناوين مع Sans-serif للنصّ بيعمل تباين قوي وهو تقليد محبوب بالتصميم التحريري والويب.",
  "The Major Third scale uses a 1.250 ratio, creating gentle progression between type sizes — ideal for body-heavy content with modest hierarchy needs.":
    "مقياس Major Third بيستعمل نسبة ١٫٢٥٠، وبيعمل تدرّج لطيف بين أحجام الخطوط — مثالي لمحتوى نصّي مع احتياجات تسلسل بسيطة.",
  "Modular scales use a consistent multiplier ratio between each size step, creating mathematical harmony throughout a type system.":
    "المقاييس النمطية بتستعمل نسبة ضرب ثابتة بين كل خطوة حجم، وبتعمل تناسق رياضي بنظام الخطوط كله.",
  "A line height of 1.4–1.6x the font size provides comfortable reading rhythm. Too tight feels cramped; too loose breaks paragraph cohesion.":
    "ارتفاع سطر ١٫٤-١٫٦× حجم الخط بيعطي إيقاع قراية مريح. الأضيق بيحسّ مخنوق، والأوسع بيكسر تماسك الفقرة.",
  "Great font pairings balance contrast (different enough to feel intentional) with harmony (complementary in personality, proportion, or period).":
    "التوليفات العظيمة بتوازن بين التباين (مختلفة كفاية لتحسّ إنها مقصودة) والتناسق (مكمّلة بالشخصية، النسب، أو الحقبة).",
  "Superfamily pairings are reliable because the fonts share proportions and character, ensuring visual cohesion while providing serif/sans contrast.":
    "توليفات العيلة الكبيرة موثوقة لأنه الخطوط بتشترك بالنسب والشخصية، وبتضمن تماسك بصري مع توفير تباين Serif/Sans.",
  "6 columns out of 12 equals exactly 50% of the container width, making 12-column grids ideal for creating clean halves, thirds, and quarters.":
    "٦ أعمدة من ١٢ بتساوي تماماً ٥٠٪ من عرض الحاوية، فشبكات ١٢ عمود مثالية لعمل أنصاف وأثلاث وأرباع نظيفة.",
  "Gutters define the spacing between columns, preventing content from touching and creating breathing room throughout the layout.":
    "الـ Gutters بتحدّد المسافة بين الأعمدة، وبتمنع المحتوى من التلامس، وبتعمل مساحة تنفس بكل التصميم.",
  "Mobile screens typically use a 4-column grid due to their narrow width, which maps cleanly to full-width, half-width, and quarter-width components.":
    "شاشات الموبايل عادةً بتستعمل شبكة ٤ أعمدة بسبب عرضها الضيّق، وبتنطبق تماماً على عناصر بعرض كامل، نصف، وربع.",
  "Bottom tab bars work best for 2–5 primary destinations. More than 5 tabs become hard to reach and visually cluttered; fewer than 2 doesn't warrant a tab bar.":
    "أشرطة التابز التحتانية بتشتغل أفضل لـ ٢-٥ وجهات أساسية. أكتر من ٥ تابز بتصير صعبة الوصول ومزدحمة بصرياً؛ وأقل من ٢ ما بستاهل شريط أصلاً.",
  "Hamburger menus hide navigation, reducing discoverability. Studies show bottom tab bars lead to higher engagement because options are always visible.":
    "قوائم الهامبرغر بتخبّي التنقّل، وبتقلّل من الاكتشاف. الدراسات بتورجي إنه أشرطة التابز التحتانية بتقود لتفاعل أعلى لأنه الخيارات دايماً ظاهرة.",
  "Push navigation (drill-down stacks) handles deep hierarchies well on mobile, allowing users to navigate forward and back through content levels.":
    "تنقّل Push (ستاكات الغوص) بيتعامل مع التسلسلات العميقة منيح عالموبايل، وبيخلّي المستخدم يتنقّل قدّام وورا بين مستويات المحتوى.",
  "Brand identity is the holistic system of visual, verbal, and experiential elements that communicate who a brand is — logo, color, typography, tone, imagery, and more.":
    "الهويّة البصرية هي النظام الشامل من العناصر البصرية واللفظية والتجريبية اللي بتوصل مين هو البراند — لوغو، لون، خطوط، نبرة، صور، وأكتر.",
  "Strong brands evolve while maintaining their core essence. Consider Google, Apple, and Nike — all have updated their identities significantly while staying recognizable.":
    "البراندات القوية بتتطوّر مع الحفاظ على جوهرها. شوف غوغل، أبل، ونايكي — كلهم حدّثوا هويّاتهم بشكل كبير وضلّوا معروفين.",
  "The logo is the cornerstone of brand identity — it's the most compact symbol of the brand and informs the visual language of all other elements.":
    "اللوغو هو حجر الأساس للهويّة — هو أكثر رمز مكثّف للبراند وبيحدّد اللغة البصرية لكل العناصر التانية.",
  "Phi (φ) ≈ 1.618. This irrational number appears throughout nature and has been used by artists and architects for millennia to create aesthetically pleasing proportions.":
    "ϕ ≈ ١٫٦١٨. هالرقم غير النسبي بيظهر بكل الطبيعة، واستعمله الفنانين والمعماريين لآلاف السنين لعمل نسب جميلة.",
  "Dividing any Fibonacci number by the previous one approaches 1.618 as the sequence progresses. This is why the golden spiral appears in nautilus shells and sunflowers.":
    "قسمة أي رقم فيبوناتشي على اللي قبله بتقترب من ١٫٦١٨ كل ما تقدّمت المتتالية. هاد السبب اللي بيخلّي الحلزون الذهبي يظهر بأصداف النوتيلوس وعبّاد الشمس.",
  "A golden rectangle has width-to-height ratio of 1:1.618. If you remove a square from it, the remaining rectangle has the same golden ratio — infinitely recursive.":
    "المستطيل الذهبي عنده نسبة عرض لارتفاع ١:١٫٦١٨. إذا شلت مربع منه، المستطيل المتبقّي عنده نفس النسبة الذهبية — تكرار لا نهائي.",
  "The Apple logo's proportions are famously analyzed through golden ratio geometry, with many of its circular curves and spacing based on phi-derived measurements.":
    "نسب لوغو أبل مشهور إنها بتنحلّل بهندسة النسبة الذهبية، وكتير من منحنياته الدائرية ومسافاته مبنية على قياسات مشتقّة من ϕ.",
  "1000 ÷ 1.618 ≈ 618px. The primary content column would be 618px with a 382px sidebar — a classic golden ratio layout.":
    "١٠٠٠ ÷ ١٫٦١٨ ≈ ٦١٨ بكسل. عمود المحتوى الأساسي بيكون ٦١٨ بكسل مع شريط جانبي ٣٨٢ بكسل — تصميم نسبة ذهبية كلاسيكي.",
  "The rule of thirds (dividing into 1/3 and 2/3) approximates the golden ratio (0.382 and 0.618), making it a practical shortcut for achieving phi-like compositions.":
    "قاعدة الأثلاث (التقسيم لـ ١/٣ و٢/٣) بتقرّب من النسبة الذهبية (٠٫٣٨٢ و٠٫٦١٨)، وبتخلّيها اختصار عملي لعمل تصاميم شبيهة بـ ϕ.",
  "Visual weight is the perceived heaviness or lightness of elements based on size, color, texture, and placement.":
    "الثقل البصري هو إحساسنا بثقل أو خفّة العناصر حسب الحجم، اللون، الملمس، والموقع.",
  "Italic is a specially drawn version of a typeface; oblique is simply the roman version slanted mechanically. They look similar but are technically different.":
    "Italic نسخة مرسومة خصيصاً من الخط؛ Oblique هي ببساطة النسخة الرومانية مايلة ميكانيكياً. شكلهن متشابه بس تقنياً مختلفين.",
  "Proximity holds that objects near each other are perceived as related, which is why menu items are grouped and spacing separates unrelated content.":
    "التقارب بقول إنه الأشياء القريبة من بعضها بتنحسّ مرتبطة، وهاد ليش عناصر القايمة بتتجمّع والمسافات بتفرّق المحتوى غير المرتبط.",
  "Complementary colors (red/green, blue/orange, yellow/purple) create maximum contrast when placed together, making each color appear more vibrant.":
    "الألوان المكمّلة (أحمر/أخضر، أزرق/برتقالي، أصفر/بنفسجي) بتعمل أقصى تباين لمّا تنحطّ مع بعض، وبتخلّي كل لون يبيّن أحيى.",
  "Kerning is the process of adjusting space between specific pairs of letters (like 'AV' or 'WA') to achieve optically even spacing.":
    "الـ Kerning هو ضبط المسافة بين أزواج محدّدة من الحروف (مثل «AV» أو «WA») للوصول لمسافة متساوية بصرياً.",
  "The hero section is the large prominent area at the top of a webpage — typically the first thing users see, often containing a headline, subhead, and CTA.":
    "قسم الـ Hero هو المنطقة الكبيرة البارزة بأعلى صفحة الويب — عادةً أول شي بيشوفه المستخدم، وفيه عنوان، عنوان فرعي، وأكشن.",
  "RGB is the color model for screens (Red, Green, Blue light mixing). CMYK (Cyan, Magenta, Yellow, Key/Black) is used for print production.":
    "RGB هو نظام الألوان للشاشات (خلط ضوء أحمر، أخضر، أزرق). CMYK (سماوي، أرجواني، أصفر، أسود) مستعمل لإنتاج الطباعة.",
  "The 60-30-10 rule: 60% dominant color (backgrounds), 30% secondary color (cards/surfaces), 10% accent color (CTAs, highlights) — a formula for balanced palettes.":
    "قاعدة ٦٠-٣٠-١٠: ٦٠٪ لون مهيمن (خلفيات)، ٣٠٪ لون ثانوي (كروت/أسطح)، ١٠٪ لون مميّز (أكشنات، تمييز) — وصفة لباليتات متوازنة.",
  "Affordance describes visual properties that suggest interaction possibilities. A button looks pressable; a slider looks draggable. Good affordances reduce cognitive load.":
    "الـ Affordance بيوصف الخصائص البصرية اللي بتقترح إمكانيات التفاعل. الزرّ شكله بدّك تضغطه؛ السلايدر شكله بدّك تسحبه. التلميحات الحلوة بتقلّل العبء الذهني.",
  "Whitespace is a powerful design tool that improves readability, creates focus, suggests elegance, and reduces cognitive load. Premium brands use whitespace deliberately.":
    "الفراغ أداة تصميم قوية بتحسّن القراية، بتعمل تركيز، بتوحي بالأناقة، وبتقلّل العبء الذهني. البراندات المميّزة بتستعمل الفراغ عن قصد.",

  // ===== Scene mock UI strings =====
  "Welcome back": "أهلاً بعودتك",
  "Your dashboard is ready.": "لوحة التحكّم جاهزة.",
  "Open dashboard": "افتح اللوحة",
  "Account settings": "إعدادات الحساب",
  "Email": "الإيميل",
  "Plan": "الخطّة",
  "Pro": "Pro",
  "Cancel": "إلغاء",
  "Save changes": "احفظ التغييرات",
  "Get started": "ابدأ",
  "Build your first project today.": "ابني أول مشروعك اليوم.",
  "Create project": "أنشئ مشروع",
  "Browse templates": "تصفّح القوالب",
  "New in Grafly": "جديد بـ Grafly",
  "Faster lessons, better feedback":
    "دروس أسرع، وملاحظات أفضل",
  "We rebuilt the lesson engine to react in under 50ms — taps feel instant.":
    "أعدنا بناء محرّك الدروس ليتفاعل بأقل من ٥٠ مللي ثانية — الضغطات بتحسّ فورية.",
  "Design that ships.": "تصميم بينزل للسوق.",
  "From idea to production in one tool.":
    "من الفكرة للإنتاج بأداة وحدة.",
  "Add to cart": "أضف للسلّة",
  "Primary action": "أكشن أساسي",
  "Hand-bound notebook": "دفتر مجلّد يدوياً",
  "Body description": "وصف",
  "Field Journal": "دفتر ميداني",
  "Product name": "اسم المنتج",
  "$28": "٢٨$",
  "Price": "السعر",
  "Inbox": "الوارد",
  "12 unread messages": "١٢ رسالة ما بعد مقروءة",
  "Drafts": "المسودات",
  "3 saved": "٣ محفوظة",
  "Verify your email": "أكّد إيميلك",
  "We sent a code to your inbox. Enter it to keep going.":
    "بعتنالك كود على إيميلك. أدخله لتكمّل.",
  "Continue": "كمّل",
  "Sign out": "تسجيل خروج",
  "Destructive": "مدمّر",
  "Notifications": "الإشعارات",
  "App behavior": "سلوك التطبيق",
  "Profile": "البروفايل",
  "Identity": "الهويّة",
  "Privacy": "الخصوصية",
  "Account": "الحساب",
  "Your trip": "رحلتك",
  "3 days in Lisbon": "٣ أيام بلشبونة",
  "Book now": "احجز هلأ",
  "Today's plan": "خطّة اليوم",
  "3 tasks left": "٣ مهام متبقّية",
  "Start": "ابدأ",
  "Lift Off": "إقلاع",
  "Your weekly product roadmap, in one place.":
    "خارطة طريق منتجك الأسبوعية، بمكان واحد.",
  "Launch dashboard": "افتح اللوحة",
  "REVENUE": "الإيرادات",
  "$48,210": "٤٨٬٢١٠$",
  "+12% from last month": "+١٢٪ عن الشهر اللي راح",
  "Build faster.": "ابني أسرع.",
  "Design, prototype, and ship — all in one place.":
    "صمّم، جرّب، وانشر — كلها بمكان واحد.",
  "Start free trial": "ابدأ التجربة المجانية",
  "Sign in": "سجّل دخول",
  "Learn more": "اعرف أكتر",
  "Free shipping": "شحن مجاني",
  "On orders over $50.": "للطلبات فوق ٥٠$.",
  "Shop now": "تسوّق هلأ",
  "We are excited to announce that you may be eligible for our free shipping promotion which applies to qualifying orders over $50 placed between today and the end of this month, subject to terms and conditions.":
    "يسعدنا نعلن إنه يمكن تكون مؤهّل لعرض الشحن المجاني تبعنا اللي بينطبق على الطلبات المؤهّلة فوق ٥٠$ المقدّمة بين اليوم وآخر الشهر، حسب الشروط والأحكام.",
  "Plan your week.": "نظّم أسبوعك.",
  "Three minutes on Monday. The rest of your week, sorted.":
    "تلت دقايق يوم الإثنين. وباقي أسبوعك، مرتّب.",
  "Try it free": "جرّبه مجاناً",
  "No credit card needed": "بدون كرت ائتمان",
  "Confirm payment": "أكّد الدفع",
  "Total: $48.00": "المجموع: ٤٨٫٠٠$",
  "Pay now": "ادفع هلأ",
  "designer@grafly.app": "designer@grafly.app",

  // ===== Module unlock messages =====
  "Contrast unlocked. Your designs will pop.":
    "فتحت التباين. تصاميمك رح تطلّ.",
  "Typography unlocked. Your words now carry weight.":
    "فتحت الخطوط. كلماتك صارت تحمل ثقل.",
  "Spacing unlocked. Your layouts can breathe.":
    "فتحت المسافات. تصاميمك صارت تتنفّس.",
  "Color unlocked. Palettes that work for you.":
    "فتحت اللون. باليتات بتشتغل لمصلحتك.",
  "Hierarchy unlocked. Guide every eye.":
    "فتحت التسلسل. اقد كل عين.",
  "UX basics down. Your screens feel obvious.":
    "أساسيات تجربة الاستخدام بإيدك. شاشاتك صارت تحسّها واضحة.",

  // ===== Course: Design with AI =====
  "Design with AI": "التصميم بالذكاء الاصطناعي",
  "Four modules on using AI tools the way designers -- not users -- actually do.":
    "أربع وحدات بتعلّمك تستخدم أدوات الذكاء الاصطناعي مثل المصمّمين — مش مثل المستخدم العادي.",

  // -- Module: Prompting --
  "Prompting": "كتابة البرومبت",
  "Write prompts that get what you actually mean.":
    "اكتب برومبتات بتجيب يلي قصدك فعلاً.",

  "What Makes a Good Prompt": "شو يلي بيخلّي البرومبت كويس",
  "Vague in, vague out. Specific in, useful out.":
    "ضبابي بتدخل، ضبابي بيطلع. دقيق بتدخل، مفيد بيطلع.",
  "AI mirrors your clarity.": "الذكاء الاصطناعي بيعكس وضوحك.",
  "A bad prompt gets you something. A good prompt gets you what you need.":
    "البرومبت الضعيف بيجيبلك شي. البرومبت الكويس بيجيبلك يلي بدّك ياه.",
  "Which part of a prompt does the most work?":
    "أيّ جزء من البرومبت بيشتغل أكتر؟",
  "Style + constraints collapse the search space. The model can't guess your taste -- you have to describe it.":
    "الستايل + القيود بتضيّق خيارات النموذج. الذكاء الاصطناعي ما بيقدر يحزر ذوقك — لازم توصفه أنت.",
  "The greeting ('Please can you...')": "التحية ('لو سمحت ممكن...')",
  "The style and constraint details": "تفاصيل الستايل والقيود",
  "The length of the message": "طول الرسالة",
  "Using all-caps for emphasis": "استخدام أحرف كبيرة للتأكيد",
  "A longer prompt is always better than a short one.":
    "البرومبت الطويل دايماً أحسن من القصير.",
  "Length doesn't matter -- precision does. A 10-word prompt with the right constraints beats a 100-word ramble.":
    "الطول مش مهم — الدقّة هي المهمّة. برومبت من ١٠ كلمات بقيود صحيحة بيتفوّق على ١٠٠ كلمة بدون تركيز.",
  "Adding a style reference like 'flat, no shadows' to a prompt mainly helps because:":
    "ليش إضافة مرجع ستايل مثل 'flat, no shadows' للبرومبت بتفيد؟",
  "Style references are shorthand. 'Flat, no shadows' maps to: minimal, clean, geometric. One phrase does heavy lifting.":
    "مراجع الستايل هي اختصار. 'Flat, no shadows' بتعني: بسيط، نظيف، هندسي. عبارة وحدة بتشيل حمل كبير.",
  "It makes the prompt longer": "بتطوّل البرومبت",
  "It gives the AI a shared visual vocabulary to anchor to":
    "بتعطي الذكاء الاصطناعي قاموس بصري مشترك يثبّت عليه",
  "It tells the AI which designer to copy exactly":
    "بتخبر الذكاء الاصطناعي أيّ مصمّم يقلّد بالظبط",
  "It prevents the AI from generating images":
    "بتمنع الذكاء الاصطناعي من توليد الصور",

  "Spot the Weak Prompt": "لاقي البرومبت الضعيف",
  "One of these prompts will waste your time. Tap it.":
    "واحد من هالبرومبتات رح يضيّع وقتك. ضغط عليه.",
  "Weak prompts cost more than one round.":
    "البرومبتات الضعيفة بتكلّفك أكتر من جولة وحدة.",
  "Every bad prompt is a revision cycle you didn't plan for.":
    "كل برومبت ضعيف هو دورة تعديل ما حسبت حسابها.",
  "Tap the prompt that will waste the most iterations.":
    "ضغط على البرومبت يلي رح يضيّع أكتر عدد من الجولات.",
  "Prompt B has no subject, style, or constraint. 'Nice and modern' means something different to every AI -- and every client.":
    "البرومبت B ما إله موضوع ولا ستايل ولا قيود. 'حلو وعصري' بيعني شي مختلف لكل ذكاء اصطناعي — ولكل عميل.",
  "Make it look nice and modern.": "خلّيه شكله حلو وعصري.",
  "Hero section for a SaaS design tool. Dark background, bold white headline, single teal CTA button, no images.":
    "هيدر لأداة تصميم SaaS. خلفية داكنة، عنوان أبيض عريض، زرّ أكشن واحد لون تركواز، بدون صور.",
  "Design a hero section that looks professional and catches the eye with a good vibe.":
    "صمّم هيدر شكله احترافي وبيلفت النظر وعنده فايب حلو.",
  "Which constraint reduces AI output variance the most?":
    "أيّ قيد بيقلّل تغيّر النتائج عند الذكاء الاصطناعي أكتر؟",
  "Color and style references are the tightest anchors you have. They narrow the output space from millions of possibilities to dozens.":
    "مراجع اللون والستايل هي أقوى مرابط بإيدك. بتضيّق فضاء النتائج من ملايين الاحتمالات لعشرات.",
  "Saying 'please' and 'thank you'": "قول 'لو سمحت' و'شكراً'",
  "Specifying a color palette or style reference":
    "تحديد باليت لوني أو مرجع ستايل",
  "Writing the prompt in uppercase": "كتابة البرومبت بأحرف كبيرة",
  "Adding 'high quality' at the end": "إضافة 'high quality' بالآخر",

  "Build the Prompt": "ركّب البرومبت",
  "Drag the parts into the right order for maximum clarity.":
    "اسحب الأجزاء بالترتيب الصح للحصول على أوضح نتيجة.",
  "A prompt is an architecture.": "البرومبت هو هيكل.",
  "Subject first. Then style. Then constraints. That sequence always wins.":
    "الموضوع أولاً. بعدين الستايل. بعدين القيود. هالترتيب دايماً بيربح.",
  "Stack these prompt components in the order that produces the clearest output.":
    "رتّب مكوّنات البرومبت بالترتيب يلي بينتج عنه أوضح مخرجات.",
  "Subject anchors the AI. Tone sets the feeling. Style defines the look. Constraints prevent the wrong turns.":
    "الموضوع بيثبّت الذكاء الاصطناعي. النبرة بتحدّد الإحساس. الستايل بيحدّد الشكل. القيود بتمنع المنعطفات الغلط.",
  "Tap the arrows to put these prompt blocks in the most effective order.":
    "ضغط على الأسهم لترتيب بلوكات البرومبت بأكتر ترتيب فعّال.",
  "Subject": "الموضوع",
  "Tone / emotion": "النبرة / الإحساس",
  "Visual style": "الستايل البصري",
  "Constraints": "القيود",

  "Choose the Better Prompt": "اختار البرومبت الأحسن",
  "Two prompts, same goal. One gets there in one round.":
    "برومبتين، نفس الهدف. واحد منهم بيوصل بجولة وحدة.",
  "One will cost you. One won't.": "واحد رح يكلّفك. والتاني لأ.",
  "Both prompts target the same output. Only one is built to ship fast.":
    "البرومبتين بيستهدفوا نفس النتيجة. بس واحد منهم مصنوع ليطلع للسوق بسرعة.",
  "Which prompt gets you a usable result fastest?":
    "أيّ برومبت بيوصلك لنتيجة قابلة للاستخدام بأسرع وقت؟",
  "B specifies background, headline treatment, CTA, and bans images. A says nothing -- 'good vibe' is the designer's job to define, not the AI's to guess.":
    "B بيحدّد الخلفية ومعالجة العنوان وزرّ الأكشن وبيمنع الصور. A ما بيقول شي — 'فايب حلو' شغلة المصمّم يحدّدها، مش الذكاء الاصطناعي يحزرها.",
  "Choose a prompt": "اختار برومبت",

  // -- Module: Image Generation --
  "Image Generation": "توليد الصور",
  "Generate, critique, and direct AI visuals with a designer's eye.":
    "ولّد ونقّد ووجّه الصور المنتَجة بالذكاء الاصطناعي بعين مصمّم.",

  "How AI Sees Your Words": "كيف الذكاء الاصطناعي بيشوف كلماتك",
  "Words map to pixels -- and the map is imperfect.":
    "الكلمات بتنرسم على بكسلات — والخريطة مش مثالية.",
  "AI doesn't visualize. It predicts.":
    "الذكاء الاصطناعي ما بيتخيّل. هو بيتنبّأ.",
  "Image models work by predicting the most likely pixels for your words. Know the gap.":
    "نماذج الصور بتشتغل بالتنبّؤ بأكتر بكسلات محتملة لكلماتك. اعرف الفجوة.",
  "Why do AI image models often get hands wrong?":
    "ليش نماذج الصور بالذكاء الاصطناعي بتغلط بالأيادي كتير؟",
  "Hand structure is highly variable. Statistically, the model predicts 'hand-like' rather than 'correct hand.' It's a data gap, not a bug.":
    "تركيب الأيدي بيتغيّر كتير. إحصائياً، النموذج بيتنبّأ بـ'شكل يشبه الأيد' مش بـ'أيد صحيحة'. هاي فجوة بالداتا، مش باگ.",
  "They weren't trained on hand photos": "ما اتدرّبوا على صور أيادي",
  "Hands are complex and hard to represent consistently in training data":
    "الأيادي معقّدة وصعب تمثيلها بشكل ثابت بالداتا التدريبية",
  "Hands are too small to render at low resolution":
    "الأيادي صغيرة كتير ليتمّ رسمها بدقّة منخفضة",
  "The model skips body parts by design":
    "النموذج بيتجاوز أعضاء الجسم بتصميمه",
  "Specifying a camera angle ('top-down' or 'close-up') makes AI image outputs more predictable.":
    "تحديد زاوية الكاميرا ('من فوق' أو 'قريبة') بيخلّي مخرجات الذكاء الاصطناعي أكتر قابلية للتنبّؤ.",
  "Camera terms are part of the model's training vocabulary. They constrain composition reliably -- and reliably is what you want.":
    "مصطلحات الكاميرا جزء من قاموس تدريب النموذج. بتقيّد التكوين بشكل موثوق — والموثوقية هي يلي بدّك ياها.",
  "Which addition to an image prompt most reliably improves composition quality?":
    "أيّ إضافة لبرومبت الصورة بتحسّن جودة التكوين بشكل موثوق أكتر؟",
  "'Studio photography, f/2.8, soft natural light' maps to well-composed training images. 'Ultra realistic' is noise -- everything was labeled that.":
    "'Studio photography, f/2.8, soft natural light' بتنرسم على صور تدريب منسّقة منيح. 'Ultra realistic' هي ضجيج — كل شي اتسمّى هيك.",
  "'ultra realistic'": "'ultra realistic'",
  "A photography style or camera descriptor": "ستايل تصوير أو وصف كاميرا",
  "'8K resolution'": "'8K resolution'",
  "Repeating the main subject twice": "تكرار الموضوع الرئيسي مرّتين",

  "5-Second AI Review": "مراجعة الذكاء الاصطناعي بـ٥ ثواني",
  "Glance at this AI-generated layout, then answer.":
    "بصّ على هالتصميم المولّد بالذكاء الاصطناعي، بعدين جاوب.",
  "Your gut reads AI artifacts instantly.":
    "حدسك بيقرأ آثار الذكاء الاصطناعي بثواني.",
  "Something is off in seconds. The skill is naming what.":
    "بثواني بتحسّ في شي غلط. المهارة هي إنّك تسمّي شو هو.",
  "Look at this AI-generated hero section, then answer.":
    "بصّ على هاد الهيدر المولّد بالذكاء الاصطناعي، بعدين جاوب.",
  "AI layout defaults often miss hierarchy between primary and secondary actions. Train your eye to name the problem, not just feel it.":
    "تخطيطات الذكاء الاصطناعي الافتراضية بتفوّت التسلسل بين الأكشن الأساسي والثانوي. درّب عينك تسمّي المشكلة، مش بس تحسّها.",
  "What design problem did you notice first?":
    "شو مشكلة التصميم يلي لاحظتها أوّل شي؟",
  "Both buttons have equal visual weight":
    "الزرّين عندهم نفس الوزن البصري",
  "The headline is too small": "العنوان صغير كتير",
  "The background color is wrong": "لون الخلفية غلط",
  "There's too much whitespace": "في فراغ زيادة",
  "Two identical full-width green buttons split attention -- the AI gave them equal weight because CTAs 'look like' that in its training data. A designer catches it in seconds.":
    "زرّين أخضر متطابقين بكامل العرض بيقسموا الانتباه — الذكاء الاصطناعي عطاهم نفس الوزن لأنّ أزرار الأكشن 'بتبيّن هيك' بداتاه التدريبية. المصمّم بيكتشفها بثواني.",
  "Get Started Free": "ابدأ مجاناً",
  "View Documentation": "شوف الدوكيومنتيشن",
  "Design Faster, Build Smarter": "صمّم أسرع، ابني أذكى",
  "The AI-powered platform for modern creative teams and design professionals.":
    "المنصّة المدعومة بالذكاء الاصطناعي للفرق الإبداعية الحديثة ومحترفي التصميم.",
  "AI-GENERATED LAYOUT": "تصميم مولّد بالذكاء الاصطناعي",

  "Spot the AI Text": "لاقي نصّ الذكاء الاصطناعي",
  "AI-generated copy has patterns. Find the one that wasn't reviewed.":
    "النصوص المولّدة بالذكاء الاصطناعي عندها أنماط. لاقي يلي ما تمّت مراجعته.",
  "AI has tells. Learn them.": "للذكاء الاصطناعي علامات. تعلّمها.",
  "Typography, symmetry, and copy are where AI output falls apart first.":
    "الخط والتماثل والنصّ هنّي أول الأماكن يلي بتنهار فيها مخرجات الذكاء الاصطناعي.",
  "Tap the element that looks most like unreviewed AI output.":
    "ضغط على العنصر يلي شكله أكتر مثل مخرجات ذكاء اصطناعي ما اتراجعت.",
  "'Passionate... innovative... cutting-edge solutions...' is word-for-word AI boilerplate. No real team writes their bio this way. Flag it before it ships.":
    "'شغوف... مبتكر... حلول متطوّرة...' هاد كلام جاهز من الذكاء الاصطناعي حرفياً. ما في فريق حقيقي بيكتب تعريفه هيك. أوقفه قبل ما يطلع.",
  "Meet the team": "تعرّف على الفريق",
  "We are a passionate team of creative professionals who strive to deliver innovative and cutting-edge solutions that transform digital experiences.":
    "نحنا فريق شغوف من محترفي الإبداع، عم نسعى لتقديم حلول مبتكرة ومتطوّرة بتحوّل التجارب الرقمية.",
  "Sara Al-Sayed": "سارة السيّد",
  "Lead Designer": "مصمّمة قائدة",
  "Omar Bakr": "عمر بكر",
  "Full-stack Developer": "مطوّر فول-ستاك",
  "Words like 'innovative', 'cutting-edge', and 'synergistic' in copy often signal unedited AI output.":
    "كلمات مثل 'مبتكر' و'متطوّر' و'تكاملي' بالنصوص غالباً بتشير لمخرجات ذكاء اصطناعي ما اتعدّلت.",
  "These cluster in AI training data as generic 'positive business language.' They're statistically common -- and say nothing specific.":
    "هالكلمات بتتجمّع بداتا تدريب الذكاء الاصطناعي كـ'لغة شركاتية إيجابية' عامّة. شائعة إحصائياً — وما بتقول شي محدّد.",

  "Style vs. Subject": "الستايل ضدّ الموضوع",
  "Two prompts, same subject. Which one directs better?":
    "برومبتين، نفس الموضوع. أيّ واحد بيوجّه أحسن؟",
  "Style is half the prompt.": "الستايل هو نصّ البرومبت.",
  "What you're generating and how it should look are two different instructions.":
    "إيش عم تولّد وكيف لازم يبيّن هنّي تعليمتين مختلفتين.",
  "Which image prompt gives you a more controlled, consistent result?":
    "أيّ برومبت صورة بيعطيك نتيجة أكتر تحكّم وثبات؟",
  "B defines format (vector), colors (hex values), shape count, text exclusion, and container. A says 'fun' -- which regenerates differently every single time.":
    "B بيحدّد الفورمات (vector) والألوان (hex) وعدد الأشكال واستثناء النصّ والحاوية. A بيقول 'fun' — يلي بيتولّد بشكل مختلف كل مرّة.",
  "Same subject -- an app icon. Pick the prompt that will actually be consistent.":
    "نفس الموضوع — أيقونة تطبيق. اختار البرومبت يلي رح يكون فعلاً ثابت.",
  "Create a beautiful app icon for a design learning app. Make it colorful and fun.":
    "اعمل أيقونة تطبيق حلوة لتطبيق تعلّم تصميم. خلّيها ملوّنة وممتعة.",
  "App icon for a design education platform. Flat vector, dark navy (#21263F) base, single yellow accent shape, no text, rounded square.":
    "أيقونة تطبيق لمنصّة تعليم تصميم. Flat vector، خلفية كحلي داكن (#21263F)، شكل أصفر مميّز واحد، بدون نصّ، مربّع بزوايا دائرية.",
  "FOR: app icon": "للموضوع: أيقونة تطبيق",
  "PROMPT A": "برومبت A",
  "PROMPT B": "برومبت B",
  "PROMPT C": "برومبت C",
  "Same goal -- a hero section for a design tool. Pick the prompt that ships faster.":
    "نفس الهدف — هيدر لأداة تصميم. اختار البرومبت يلي بيطلع للسوق أسرع.",

  // -- Module: AI Workflow --
  "AI Workflow": "سير العمل بالذكاء الاصطناعي",
  "Where to plug AI into the process -- and where to keep it out.":
    "وين تدخّل الذكاء الاصطناعي بالعمليّة — ووين تبعّده عنها.",

  "Where AI Belongs": "وين بينتمي الذكاء الاصطناعي",
  "AI belongs in some steps. Not all of them.":
    "الذكاء الاصطناعي بينتمي لبعض الخطوات. مش كلّها.",
  "The tool should serve the process.": "الأداة لازم تخدم العمليّة.",
  "AI is fast at divergence, slow at taste. Know which mode you're in.":
    "الذكاء الاصطناعي سريع بالتوسّع، بطيء بالذوق. اعرف بأيّ وضع أنت.",
  "At which design phase is AI most valuable?":
    "بأيّ مرحلة من التصميم بيكون الذكاء الاصطناعي الأكتر فايدة؟",
  "AI is fastest when options are wide open. Once direction is decided, designer judgment drives better decisions than generation.":
    "الذكاء الاصطناعي أسرع لمّا الخيارات بتكون مفتوحة كلياً. بعد ما يتقرّر الاتجاه، حكم المصمّم بياخد قرارات أحسن من التوليد.",
  "Final delivery to the client": "التسليم النهائي للعميل",
  "Early exploration and divergent ideation":
    "الاستكشاف المبكّر وتوليد الأفكار المتوسّعة",
  "Presenting the rationale to stakeholders":
    "تقديم المنطق لأصحاب المصلحة",
  "User research and interviews": "أبحاث المستخدمين والمقابلات",
  "AI can reliably replace user research because it has seen many products.":
    "الذكاء الاصطناعي بيقدر يستبدل أبحاث المستخدمين لأنّه شاف منتجات كتير.",
  "AI reflects average patterns from past data -- not your specific users, their context, or their problems. Research is irreplaceable.":
    "الذكاء الاصطناعي بيعكس أنماط متوسّطة من داتا قديمة — مش مستخدمينك المحدّدين ولا سياقهم ولا مشاكلهم. البحث ما بينعوّض.",
  "A designer generates 20 logo concepts with AI in 10 minutes, then picks and refines the best 2. This is:":
    "مصمّم ولّد ٢٠ فكرة لوغو بالذكاء الاصطناعي بـ١٠ دقايق، بعدين اختار وحسّن أحسن ٢ منهم. هاد اسمه:",
  "Divergence (many ideas fast) is AI's strength. Convergence (what's actually right) is the designer's job. This split is the most productive pattern.":
    "التوسّع (أفكار كتير بسرعة) هي قوّة الذكاء الاصطناعي. التركيز (شو فعلاً صح) هي شغلة المصمّم. هاد التقسيم هو أكتر نمط منتج.",
  "Laziness replacing skill": "كسل بيستبدل المهارة",
  "Using AI for divergence and the designer for convergence":
    "استخدام الذكاء الاصطناعي للتوسّع، والمصمّم للتركيز",
  "Plagiarism from training data": "نسخ من داتا التدريب",
  "Skipping the client brief": "تخطّي بريف العميل",

  "Right Tool, Right Step": "الأداة الصح، بالخطوة الصح",
  "Drag each AI task to the phase it actually belongs in.":
    "اسحب كل مهمّة ذكاء اصطناعي للمرحلة يلي فعلاً بتنتمي إلها.",
  "Phase matters more than tool.": "المرحلة أهمّ من الأداة.",
  "The same AI task used in the wrong phase creates rework, not output.":
    "نفس مهمّة الذكاء الاصطناعي لمّا تتستخدم بمرحلة غلط، بتنتج إعادة شغل، مش مخرجات.",
  "Arrange these AI design tasks from earliest to latest in the design process.":
    "رتّب مهام التصميم بالذكاء الاصطناعي من الأبكر للأخير بعمليّة التصميم.",
  "Order these from the earliest to latest in the design process.":
    "رتّبهم من الأبكر للأخير بعمليّة التصميم.",
  "Research grounds the work. Ideation opens possibilities. Refinement locks specifics. Handoff closes the loop. This order prevents expensive directional mistakes.":
    "البحث بيؤسّس الشغل. توليد الأفكار بيفتح الاحتمالات. التحسين بيثبّت التفاصيل. التسليم بيقفل الدورة. هاد الترتيب بيمنع أخطاء توجيه مكلفة.",
  "Use AI to generate a first-draft color palette from a brand brief":
    "استخدم الذكاء الاصطناعي لتوليد مسوّدة أولى لباليت لوني من بريف البراند",
  "Generate 10 moodboard directions": "ولّد ١٠ اتجاهات لموودبورد",
  "Use AI to generate and annotate icon variants for a design system":
    "استخدم الذكاء الاصطناعي لتوليد ووصف أيقونات متنوّعة لنظام تصميم",
  "Generate component documentation for the design system":
    "ولّد دوكيومنتيشن لمكوّنات نظام التصميم",
  "Research synthesis": "تجميع البحث",
  "Concept ideation": "توليد المفاهيم",
  "Copy refinement": "تحسين النصّ",
  "Design handoff": "تسليم التصميم",

  "Spot the AI Overreach": "لاقي تجاوز الذكاء الاصطناعي",
  "Find the step where handing to AI costs more than it saves.":
    "لاقي الخطوة يلي تسليمها للذكاء الاصطناعي بيكلّف أكتر ممّا بيوفّر.",
  "Automation has a cost ceiling.": "الأتمتة إلها سقف تكلفة.",
  "Past a point, AI output needs so much correction it would've been faster to do it yourself.":
    "بعد نقطة معيّنة، مخرجات الذكاء الاصطناعي بتحتاج تصحيح كتير، يا ريت كنت عملتها بإيدك من الأوّل.",
  "Tap the workflow step that creates the most hidden rework.":
    "ضغط على خطوة سير العمل يلي بتصنع أكبر قدر من إعادة الشغل المخفيّة.",
  "AI-conducted user interviews produce AI-average responses, not real human insight. The data looks clean but is fundamentally wrong -- requiring a full research redo.":
    "المقابلات يلي بيجريها الذكاء الاصطناعي بتنتج إجابات متوسّطة، مش رؤى بشريّة حقيقيّة. الداتا شكلها نظيف بس غلط من جوّاتها — وبتتطلّب إعادة بحث كاملة.",
  "AI-FIRST WORKFLOW": "سير عمل الذكاء الاصطناعي أوّلاً",
  "DESIGNER-FIRST, AI-ASSISTED": "المصمّم أوّلاً، والذكاء الاصطناعي مساعد",
  "Let AI conduct user interviews and synthesize insights -- no human reviews the questions":
    "خلّي الذكاء الاصطناعي يجري مقابلات المستخدمين ويجمّع الرؤى — بدون ما يراجع حدا الأسئلة",
  "Generate copy variants for the final hero headline":
    "ولّد تنويعات نصّ للعنوان الرئيسي النهائي",
  "Research -> AI for moodboard variations -> Designer curates -> Refine -> Deliver":
    "بحث ← ذكاء اصطناعي لتنويعات الموودبورد ← المصمّم يختار ← تحسين ← تسليم",
  "AI accelerates divergent phases. Human judgment handles direction.":
    "الذكاء الاصطناعي بيسرّع المراحل التوسّعية. الحكم البشري بيتولّى التوجيه.",
  "AI without context produces fast, wrong answers.":
    "الذكاء الاصطناعي بلا سياق بينتج إجابات سريعة وغلط.",
  "AI after research = speed where it helps, judgment where it counts.":
    "الذكاء الاصطناعي بعد البحث = سرعة وين بتفيد، وحكم وين بيهمّ.",
  "Generate logo -> Skip research -> Ship to client":
    "ولّد لوغو ← تخطّى البحث ← سلّم للعميل",
  "Generic icon. Wrong style. Wrong colors. Starts over.":
    "أيقونة عامّة. ستايل غلط. ألوان غلط. ترجع من الأوّل.",
  "On-brand output. Minor edits. Ships in one round.":
    "نتيجة متوافقة مع البراند. تعديلات بسيطة. بتطلع بجولة وحدة.",
  "Fast output, no context. Client rejects. Starts over.":
    "نتيجة سريعة، بلا سياق. العميل بيرفض. بترجع من الأوّل.",
  "One of these AI decisions will cost more hours than it saves. Tap it.":
    "واحد من قرارات الذكاء الاصطناعي هاي رح يكلّف ساعات أكتر ممّا بيوفّر. ضغط عليه.",
  "The best AI workflow decisions come from asking: 'what is repeatable and low-stakes here?'":
    "أحسن قرارات سير عمل الذكاء الاصطناعي بتيجي من السؤال: 'شو يلي متكرّر ومخاطره قليلة هون؟'",
  "Repeatable = AI does it faster every time. Low-stakes = mistakes are cheap to fix. That combination is the real sweet spot.":
    "متكرّر = الذكاء الاصطناعي بيعمله أسرع كل مرّة. مخاطر قليلة = الأخطاء رخيصة التصليح. هاد المزيج هو نقطة الذهب الحقيقية.",
  "Project workflow": "سير عمل المشروع",

  // -- Module: AI Ethics in Design --
  "AI Ethics in Design": "أخلاقيات الذكاء الاصطناعي بالتصميم",
  "Bias, attribution, and where designer responsibility begins.":
    "التحيّز، والإسناد، ومن وين بتبدأ مسؤولية المصمّم.",

  "Bias in the Model": "التحيّز بالنموذج",
  "AI reflects what it was trained on -- including the problems.":
    "الذكاء الاصطناعي بيعكس يلي اتدرّب عليه — بما فيه المشاكل.",
  "Training data isn't neutral.": "داتا التدريب مش محايدة.",
  "Every model learned from someone's internet. That internet had biases. Your output will too.":
    "كل نموذج تعلّم من إنترنت حدا. هاد الإنترنت كان فيه تحيّزات. مخرجاتك كمان رح تكون فيها.",
  "Why do AI image models often default to Western, male representations of professionals?":
    "ليش نماذج الصور بالذكاء الاصطناعي غالباً بترجع لتمثيلات غربيّة وذكوريّة للمحترفين؟",
  "Models learn from what exists online. Historically, certain demographics are over-represented in certain professional contexts. That bias gets inherited.":
    "النماذج بتتعلّم من يلي موجود أونلاين. تاريخياً، فئات معيّنة ممثّلة أكتر بسياقات مهنيّة معيّنة. هاد التحيّز بينورث.",
  "The developers chose this intentionally": "المطوّرين اختاروا هاد عمداً",
  "Training data reflects historical representation imbalances on the internet":
    "داتا التدريب بتعكس اختلالات تمثيل تاريخيّة على الإنترنت",
  "The model has no way to understand demographics":
    "النموذج ما عنده طريقة يفهم التركيبة السكانيّة",
  "This only happens with free AI tools":
    "هاد بيصير بس مع أدوات الذكاء الاصطناعي المجّانيّة",
  "As the designer, you are responsible for reviewing AI output for biased representations before it ships.":
    "كمصمّم، أنت مسؤول عن مراجعة مخرجات الذكاء الاصطناعي للتحيّزات بالتمثيل قبل ما تطلع.",
  "The model generated it. But you shipped it. Responsibility for what reaches users is always the designer's.":
    "النموذج ولّدها. بس أنت طلّعتها. مسؤوليّة يلي بيوصل للمستخدم دايماً للمصمّم.",
  "A designer uses AI to generate user persona portraits. The best practice is to:":
    "مصمّم بيستخدم الذكاء الاصطناعي لتوليد صور بيرسونات للمستخدمين. أحسن ممارسة هي:",
  "Intentional review and prompt adjustment is the professional standard. Speed is not a valid trade-off for biased representation in shipped products.":
    "المراجعة المتعمّدة وتعديل البرومبت هي المعيار المهني. السرعة مش مقايضة مقبولة مع تمثيل متحيّز بمنتجات بتطلع للسوق.",
  "Use the first results as-is to save time":
    "استخدم أوّل نتائج زي ما هي توفيراً للوقت",
  "Review all outputs for demographic diversity and adjust prompts accordingly":
    "راجع كل المخرجات للتنوّع السكاني وعدّل البرومبتات بناء عليه",
  "Only generate personas that match the designer's own identity":
    "ولّد بس بيرسونات بتطابق هويّة المصمّم نفسه",
  "Avoid AI for personas entirely":
    "تجنّب الذكاء الاصطناعي للبيرسونات تماماً",
  "Generate a photo of a surgeon at work":
    "ولّد صورة لجرّاح أثناء عمله",
  "Generate a photo of a female surgeon of Middle Eastern descent at work":
    "ولّد صورة لجرّاحة من أصول شرق-أوسطيّة أثناء عملها",
  "Skews heavily male and Western. Default biases from training data.":
    "بتميل بشدّة للذكوري والغربي. تحيّزات افتراضيّة من داتا التدريب.",
  "Default outputs reflect dominant training data -- not your user base.":
    "المخرجات الافتراضيّة بتعكس داتا التدريب المهيمنة — مش قاعدة مستخدمينك.",
  "You control representation. If you don't specify, the model picks for you.":
    "أنت بتتحكّم بالتمثيل. إذا ما حدّدت، النموذج بيختار عنّك.",
  "Explicit specification overrides the default. Representation is a choice you make.":
    "التحديد الصريح بيتجاوز الافتراضي. التمثيل خيار أنت بتاخده.",
  "UNSPECIFIED PROMPT": "برومبت بدون تحديد",
  "INTENTIONAL PROMPT": "برومبت متعمّد",
  "Result: Stock-photo look, incorrect hands, random background, wrong demographic.":
    "النتيجة: شكل صورة جاهزة، أيادي غلط، خلفيّة عشوائيّة، تركيبة سكانيّة غلط.",
  "Result: Consistent composition, correct framing, usable in an actual product.":
    "النتيجة: تكوين ثابت، تأطير صح، قابلة للاستخدام بمنتج فعلي.",

  "Attribution and Credit": "الإسناد والاعتراف",
  "Who made it -- you, the AI, or both?":
    "مين عمله — أنت، ولّا الذكاء الاصطناعي، ولّا الاتنين سوا؟",
  "Authorship has shifted. Responsibility hasn't.":
    "التأليف تغيّر. المسؤولية ما تغيّرت.",
  "AI generates from patterns learned from human work. That history matters professionally and legally.":
    "الذكاء الاصطناعي بيولّد من أنماط تعلّمها من شغل بشري. هاد التاريخ مهمّ مهنياً وقانونياً.",
  "When using AI-generated visuals in a client project, the professional standard is to:":
    "لمّا بتستخدم صور مولّدة بالذكاء الاصطناعي بمشروع عميل، المعيار المهني هو:",
  "Disclosure builds trust and manages expectations. Many clients have policies or legal considerations around AI-generated content.":
    "الإفصاح بيبني ثقة وبيدير التوقّعات. كتير عملاء عندهم سياسات أو اعتبارات قانونيّة حول المحتوى المولّد بالذكاء الاصطناعي.",
  "Never disclose -- clients don't need to know":
    "ما تفصح أبداً — العملاء مش لازم يعرفوا",
  "Disclose AI assistance and ensure the client approves its use":
    "أفصح عن استخدام الذكاء الاصطناعي وتأكّد إنّ العميل موافق على استعماله",
  "Only disclose if the client asks directly":
    "أفصح بس إذا العميل سأل مباشرة",
  "Add a small 'AI' watermark in the corner":
    "ضيف علامة مائيّة صغيرة 'AI' بالزاوية",
  "AI-generated images may contain elements derived from copyrighted works in their training data.":
    "الصور المولّدة بالذكاء الاصطناعي ممكن تحتوي عناصر مأخوذة من أعمال محميّة بحقوق النشر بداتا تدريبها.",
  "This is an active legal and ethical area. For commercial work, knowing what your AI tool was trained on -- and its licensing policy -- is part of professional due diligence.":
    "هاد مجال قانوني وأخلاقي نشط. للشغل التجاري، معرفة شو اتدرّبت عليه أداتك — وسياسة الترخيص تبعها — جزء من العناية المهنيّة الواجبة.",
  "A designer generates an illustration with AI, edits it significantly, and shows it in their portfolio. The right approach is:":
    "مصمّم ولّد رسم توضيحي بالذكاء الاصطناعي، عدّل عليه كتير، وعرضه ببورتفوليو. المنهج الصحيح هو:",
  "Transparency is the standard. Significant editing is creative work worth showing -- the origin of the base asset is still relevant context.":
    "الشفافية هي المعيار. التعديل الكبير شغل إبداعي يستاهل العرض — أصل الأصل مازال سياق مهمّ.",
  "No disclosure needed since they edited it":
    "ما في حاجة لإفصاح طالما إنّه عدّل عليه",
  "Note that it was AI-assisted in the project description":
    "نوّه إنّه عُمل بمساعدة ذكاء اصطناعي بوصف المشروع",
  "Remove it -- AI work can't be in a portfolio":
    "شيله — شغل الذكاء الاصطناعي ما إله مكان بالبورتفوليو",
  "List the AI tool as the co-designer":
    "حطّ أداة الذكاء الاصطناعي كمصمّم مشارك",

  "The Designer's Role": "دور المصمّم",
  "Where does human judgment stay non-negotiable?":
    "وين بيضلّ الحكم البشري غير قابل للتفاوض؟",
  "Tools change. Responsibility doesn't.":
    "الأدوات بتتغيّر. المسؤوليّة لأ.",
  "What AI can do and what you should delegate to it are two different questions.":
    "شو الذكاء الاصطناعي يقدر يعمل، وشو لازم تفوّضه فيه، سؤالين مختلفين.",
  "Glance at this portfolio case study intro, then answer.":
    "بصّ على مقدّمة هاي دراسة الحالة بالبورتفوليو، بعدين جاوب.",
  "AI copy in a portfolio undermines the one thing the portfolio must prove: that you can think, decide, and communicate as a designer.":
    "نصوص الذكاء الاصطناعي بالبورتفوليو بتدمّر الشي الوحيد يلي البورتفوليو لازم يثبته: إنّك بتقدر تفكّر وتقرّر وتتواصل كمصمّم.",
  "What was the biggest problem with that intro?":
    "شو أكبر مشكلة بهاي المقدّمة؟",
  "The body copy was vague AI boilerplate with no real insight":
    "نصّ المتن كان كلام جاهز ضبابي من الذكاء الاصطناعي بلا أيّ رؤية حقيقيّة",
  "The title was too long": "العنوان طويل كتير",
  "There were no images": "ما كان في صور",
  "The button was the wrong color": "الزرّ كان لونه غلط",
  "'Innovative methodologies', 'cutting-edge', 'synergistic outcomes' -- this says nothing. A portfolio intro should describe real decisions, not AI filler.":
    "'منهجيّات مبتكرة'، 'متطوّر'، 'نتائج تكامليّة' — هاد ما بيقول شي. مقدّمة البورتفوليو لازم توصف قرارات حقيقيّة، مش حشو ذكاء اصطناعي.",
  "View case study": "شوف دراسة الحالة",
  "Redesigning Checkout for a Global E-Commerce Platform":
    "إعادة تصميم الدفع لمنصّة تجارة إلكترونيّة عالميّة",
  "This project involved leveraging innovative design methodologies to create a seamless, cutting-edge user experience that transformed the checkout flow and delivered synergistic outcomes for stakeholders.":
    "هاد المشروع تضمّن الاستفادة من منهجيّات تصميم مبتكرة لخلق تجربة مستخدم سلسة ومتطوّرة بتحوّل سير عمليّة الدفع وبتسلّم نتائج تكامليّة لأصحاب المصلحة.",
  "Which design task is least appropriate to fully delegate to AI?":
    "أيّ مهمّة تصميم هي الأقلّ مناسبة لتفويضها كاملة للذكاء الاصطناعي؟",
  "Brand direction requires understanding the client's values, market, and future. AI has none of that. The 'final call' is always a human judgment.":
    "اتجاه البراند بيحتاج فهم لقيم العميل وسوقه ومستقبله. الذكاء الاصطناعي ما عنده شي من هاد. 'القرار النهائي' دايماً حكم بشري.",
  "Generating a first-draft icon set": "توليد مسوّدة أولى لمجموعة أيقونات",
  "Creating multiple color palette variations":
    "إنشاء تنويعات متعدّدة لباليتات لونيّة",
  "Making the final call on brand direction for a client":
    "اتّخاذ القرار النهائي لاتجاه البراند للعميل",
  "Summarize competitor app reviews": "تلخيص مراجعات تطبيقات المنافسين",
  "Summarizing competitor app reviews": "تلخيص مراجعات تطبيقات المنافسين",
  "A designer who uses AI tools well is a stronger designer, not a weaker one.":
    "المصمّم يلي بيستخدم أدوات الذكاء الاصطناعي منيح هو مصمّم أقوى، مش أضعف.",
  "AI amplifies the designer's intent. Strong taste + clear thinking + good prompting = more output, better quality, in less time.":
    "الذكاء الاصطناعي بيكبّر نيّة المصمّم. ذوق قوي + تفكير واضح + برومبت كويس = مخرجات أكتر، جودة أحسن، بوقت أقلّ.",

  // -- Shared scene strings --
  "PROMPT": "البرومبت",
  "RESULT": "النتيجة",
  "GOAL: hero section": "الهدف: هيدر",
  "Too vague: the AI has to guess everything.":
    "ضبابي كتير: الذكاء الاصطناعي لازم يحزر كل شي.",
  "Generic words produce generic -- and often wrong -- outputs.":
    "كلمات عامّة بتنتج مخرجات عامّة — وغالباً غلط.",
  "Subject + style + constraints = a result you can use.":
    "موضوع + ستايل + قيود = نتيجة بتقدر تستخدمها.",
  "Camera angle + subject + setting = a directed result.":
    "زاوية كاميرا + موضوع + إعداد = نتيجة موجّهة.",
  "make me a logo": "اعملّي لوغو",
  "a person working on a laptop": "شخص عم يشتغل على لابتوب",
  "Calm, trustworthy, minimal": "هادي، موثوق، بسيط",
  "Flat UI, muted greens and white, DM Sans":
    "Flat UI، أخضر هادئ وأبيض، خط DM Sans",
  "No gradients. Mobile only. No stock photos.":
    "بدون تدرّجات. للجوّال بس. بدون صور جاهزة.",
  "Minimalist wordmark for a design education app. Sans-serif, dark navy and electric blue, no gradients.":
    "وردمارك بسيط لتطبيق تعليم تصميم. خط بدون أرجل، كحلي داكن وأزرق كهربائي، بدون تدرّجات.",
  "Dark-mode dashboard card showing weekly stats. Bold numbers, muted label text, single accent color.":
    "كرت داشبورد بالوضع الداكن بيعرض إحصائيّات الأسبوع. أرقام عريضة، نصّ ليبل هادئ، لون مميّز واحد.",
  "Clean mobile onboarding screen for a fitness app. 3 steps, pastel green palette, no stock photos.":
    "شاشة أونبوردنغ نظيفة لتطبيق لياقة. ٣ خطوات، باليت أخضر هادئ، بدون صور جاهزة.",
  "top-down flat lay of a laptop and notebook, neutral linen background, product photography, f/2.8":
    "تصوير من فوق للابتوب ودفتر، خلفية كتّان محايد، تصوير منتجات، f/2.8",
  "App onboarding screen for a budgeting tool":
    "شاشة أونبوردنغ لأداة ميزانيّة",
  "One of these will force multiple rounds. Tap it.":
    "واحد من هدول رح يفرض عليك جولات متعدّدة. ضغط عليه.",
  "One element here wasn't reviewed by a human. Tap it.":
    "في عنصر هون ما تمّت مراجعته من إنسان. ضغط عليه.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Translate a single string. Returns Arabic if available, else original. */
export function tr(s: string | undefined, lang: Language): string | undefined {
  if (s == null) return s;
  if (lang !== "ar") return s;
  return EN_AR[s] ?? s;
}

function trArr(arr: string[] | undefined, lang: Language): string[] | undefined {
  if (!arr) return arr;
  if (lang !== "ar") return arr;
  return arr.map((s) => EN_AR[s] ?? s);
}

function localizeBlock(block: SceneBlock, lang: Language): SceneBlock {
  if (lang !== "ar") return block;
  const b: any = { ...block };
  for (const k of [
    "text",
    "label",
    "sub",
    "leftLabel",
    "rightLabel",
    "title",
    "value",
  ]) {
    if (typeof b[k] === "string") b[k] = EN_AR[b[k]] ?? b[k];
  }
  if (Array.isArray(b.children)) {
    b.children = b.children.map((c: SceneBlock) => localizeBlock(c, lang));
  }
  return b;
}

function localizeScreen(screen: ScreenSpec, lang: Language): ScreenSpec {
  if (lang !== "ar") return screen;
  return {
    ...screen,
    blocks: screen.blocks.map((b) => localizeBlock(b, lang)),
  };
}

export function localizeScene(
  scene: any,
  lang: Language,
): any {
  if (!scene || lang !== "ar") return scene;
  const s: any = { ...scene };
  for (const k of [
    "prompt",
    "goodNote",
    "badNote",
    "leftLabel",
    "rightLabel",
    "targetLabel",
    "baseLabel",
    "ruleLabel",
    "sampleHeading",
    "sampleBody",
  ]) {
    if (typeof s[k] === "string") s[k] = EN_AR[s[k]] ?? s[k];
  }
  if (s.screen) s.screen = localizeScreen(s.screen, lang);
  if (s.good) s.good = localizeScreen(s.good, lang);
  if (s.bad) s.bad = localizeScreen(s.bad, lang);
  if (s.left) s.left = localizeScreen(s.left, lang);
  if (s.right) s.right = localizeScreen(s.right, lang);
  if (Array.isArray(s.cards)) {
    s.cards = s.cards.map((c: any) => ({
      ...c,
      label: typeof c.label === "string" ? EN_AR[c.label] ?? c.label : c.label,
      sub: typeof c.sub === "string" ? EN_AR[c.sub] ?? c.sub : c.sub,
    }));
  }
  if (Array.isArray(s.slots)) {
    s.slots = s.slots.map((sl: any) => ({
      ...sl,
      label: typeof sl.label === "string" ? EN_AR[sl.label] ?? sl.label : sl.label,
      sub: typeof sl.sub === "string" ? EN_AR[sl.sub] ?? sl.sub : sl.sub,
    }));
  }
  if (Array.isArray(s.chips)) {
    s.chips = s.chips.map((c: any) => ({
      ...c,
      label: typeof c.label === "string" ? EN_AR[c.label] ?? c.label : c.label,
    }));
  }
  return s;
}

export function localizeIntro(
  intro: LessonIntro | undefined,
  lang: Language,
): LessonIntro | undefined {
  if (!intro || lang !== "ar") return intro;
  return {
    ...intro,
    headline: EN_AR[intro.headline] ?? intro.headline,
    body: EN_AR[intro.body] ?? intro.body,
    scene: intro.scene ? localizeScene(intro.scene, lang) : intro.scene,
  } as LessonIntro;
}

export function localizeQuestion(q: Question, lang: Language): Question {
  if (lang !== "ar") return q;
  const out: any = { ...q };
  out.question = EN_AR[q.question] ?? q.question;
  if (q.explanation) out.explanation = EN_AR[q.explanation] ?? q.explanation;
  if (q.options) out.options = trArr(q.options, lang);
  if ((q as any).template) {
    const tpl = (q as any).template as string;
    out.template = EN_AR[tpl] ?? tpl;
  }
  if ((q as any).blanks) out.blanks = trArr((q as any).blanks, lang);
  if ((q as any).acceptedAnswers)
    out.acceptedAnswers = trArr((q as any).acceptedAnswers, lang);
  if ((q as any).scene) out.scene = localizeScene((q as any).scene, lang);
  return out as Question;
}

export function localizeLesson(l: Lesson, lang: Language): Lesson {
  if (lang !== "ar") return l;
  return {
    ...l,
    title: EN_AR[l.title] ?? l.title,
    description: EN_AR[l.description] ?? l.description,
    intro: localizeIntro(l.intro, lang),
    questions: l.questions.map((q) => localizeQuestion(q, lang)),
  };
}

export function localizeNode(n: SkillNode, lang: Language): SkillNode {
  if (lang !== "ar") return n;
  return {
    ...n,
    title: EN_AR[n.title] ?? n.title,
    description: EN_AR[n.description] ?? n.description,
    lessons: n.lessons.map((l) => localizeLesson(l, lang)),
  };
}

export function localizeCourse(c: Course, lang: Language): Course {
  if (lang !== "ar") return c;
  return {
    ...c,
    title: EN_AR[c.title] ?? c.title,
    description: EN_AR[c.description] ?? c.description,
    nodes: c.nodes.map((n) => localizeNode(n, lang)),
  };
}

export function localizeUnlockMessage(msg: string, lang: Language): string {
  if (lang !== "ar") return msg;
  return EN_AR[msg] ?? msg;
}
