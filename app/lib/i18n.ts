/**
 * Traductions de la page d'accueil — arabe, derja tunisienne, français.
 *
 * Une seule source : ajouter une clé ici oblige TypeScript à la remplir dans
 * les trois langues, ce qui évite les textes qui manquent dans une seule.
 * Le reste du site (éditeur, paiement, admin) reste en arabe pour l'instant.
 */

export const LOCALES = ["ar", "tn", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

/** Ce que voit l'utilisateur dans le sélecteur : chaque langue écrite dans sa propre langue. */
export const LOCALE_LABELS: Record<Locale, { name: string; hint: string; flag: string }> = {
  ar: { name: "العربية", hint: "الفصحى", flag: "🇸🇦" },
  tn: { name: "الدارجة", hint: "تونسي", flag: "🇹🇳" },
  fr: { name: "Français", hint: "FR", flag: "🇫🇷" },
};

export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  tn: "rtl",
  fr: "ltr",
};

/** Code de langue HTML — `ar-TN` distingue la derja de l'arabe standard pour les lecteurs d'écran. */
export const LOCALE_LANG: Record<Locale, string> = {
  ar: "ar",
  tn: "ar-TN",
  fr: "fr",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

const ar = {
  gate: {
    title: "أهلاً بك في فرحتي",
    subtitle: "اختر لغتك لمواصلة التصفح",
    note: "تقدر تبدّل اللغة في أي وقت من أسفل الصفحة.",
  },

  nav: {
    collection: "المجموعة الفاخرة",
    features: "المميزات",
    pricing: "الباقات",
    editor: "المحرر",
    editorLong: "المحرر (تعديل الدعوة)",
    cta: "اصنع دعوتك الآن",
    menu: "القائمة",
  },

  hero: {
    badge: "تصاميم حصرية للزفاف الراقي",
    titleLine1: "دعوة زفافك،",
    titleLine2: "تُحفة فنية خالدة",
    subtitle:
      "دعوات رقمية تفاعلية بلمسة كلاسيكية فاخرة. ابهر ضيوفك بتجربة بصرية لا تُنسى، وتأكيد حضور حصري يليق بليلة العمر.",
    ctaPrimary: "استكشف المجموعة الفاخرة",
    ctaSecondary: "اكتشف الباقات",
    statWeddings: "حفل زفاف راقي",
    statRating: "تقييم النخبة",
    statRsvp: "تأكيد حضور حصري",
  },

  templates: {
    eyebrow: "The Collection",
    title: "روائع التصاميم الفاخرة",
    subtitle:
      "انتقِ التصميم الذي يعبّر عن فخامة مناسبتك. كل دعوة هي تحفة فنية تنبض بالحياة، الموسيقى، والتفاصيل السينمائية.",
    catAll: "المجموعة الكاملة",
    catRoyal: "القصور الملكية",
    catEnvelope: "أختام الشمع",
    catTunisian: "التراث الأصيل",
    catFloral: "الورود والشموع",
    edit: "تعديل الدعوة",
    preview: "معاينة",
    previewOf: "معاينة",
    goToSlide: "الانتقال إلى التصميم",
  },

  how: {
    title: "كيف نصنع التحفة؟",
    subtitle:
      "خطوات بسيطة تفصلك عن امتلاك أرقى دعوة رقمية على الإطلاق، مصممة خصيصاً لتخليد لحظاتك.",
    cta: "ابدأ تصميمك الخاص",
    step1Title: "اختيار التصميم",
    step1Desc: "انتقِ القالب الذي يتناغم مع ذوقك وأرسل تفاصيل المناسبة بكل سهولة.",
    step2Title: "الصياغة الفنية",
    step2Desc: "يقوم فريقنا بتجهيز دعوتك بأعلى معايير الجودة والأنميشن السينمائي.",
    step3Title: "الإرسال الفاخر",
    step3Desc: "شارك رابطك الخاص والمشفر مع ضيوفك ليعيشوا التجربة الفاخرة.",
    step4Title: "تأكيد النخبة",
    step4Desc: "استلم تأكيدات الحضور مباشرة وبطريقة منظمة تليق بمناسبتك.",
  },

  features: {
    title: "خدمات استثنائية لمناسبة لا تُنسى",
    subtitle:
      "كل تفصيلة صُممت بعناية فائقة لتعكس رقيكم، لتكون تجربتكم وتجربة ضيوفكم متكاملة، مبهرة، وخالية من أي عناء.",
    standard: "تضمين قياسي",
    rsvpTitle: "RSVP تأكيد النخبة",
    rsvpDesc:
      "يوصلك كشف كامل ومنظم بأعداد وأسماء ضيوفك لحظة تأكيدهم، مباشرة على الواتساب.",
    rsvpTag: "تأكيد فوري",
    mapTitle: "التوجيه الفاخر للموقع",
    mapDesc: "رابط خرائط جوجل مدمج بأناقة ليرشد ضيوفك إلى مكان الحفل بكل سهولة ورقي.",
    musicTitle: "الأجواء الموسيقية",
    musicDesc:
      "تجربة سمعية تأسر القلوب—اختر بين المعزوفات الكلاسيكية، أو المالوف التونسي الأصيل.",
    musicTag: "موسيقى سينمائية",
    calendarTitle: "تنبيه تقويم الشخصيات",
    calendarDesc: "إضافة أوتوماتيكية لموعد حفلكم في هواتف ضيوفكم لضمان حضورهم في ليلة العمر.",
    guestbookTitle: "دفتر التهاني الملكي",
    guestbookDesc:
      "سجل رقمي فاخر يدوّن فيه أحبابكم أجمل أمنياتهم وتهانيهم لتبقى ذكرى خالدة.",
    guestbookTag: "جدار التهاني",
    qrTitle: "دعوات الـ VIP المشفرة",
    qrDesc: "رموز QR خاصة لكل ضيف لضمان تنظيم استثنائي وسرعة الدخول للقاعة.",
  },

  pricing: {
    title: "باقات مصممة للنخبة",
    subtitle:
      "استثمار لمرة واحدة يضمن لك دعوة خالدة، بدون اشتراكات، وتسليم استثنائي في أقل من 24 ساعة.",
    payments: "بوابات الدفع المشفرة والآمنة: D17 · Flouci · Bank Card · Sobflous",
    currency: "د.ت",
    oneOff: "دفعة واحدة ملمومة",
    popular: "خيار النخبة المفضل",

    eleganteName: "الباقة الأنيقة",
    eleganteTagline: "البداية المثالية لدعوة راقية",
    eleganteCta: "اطلب الباقة الأنيقة",
    eleganteF1: "اختيار من القوالب الرسمية الكلاسيكية",
    eleganteF2: "رابط ويب مخصص باسم العروسين",
    eleganteF3: "أنميشن الستار أو الظرف الرقمي",
    eleganteF4: "دليل المواقع عبر خرائط جوجل",
    eleganteF5: "عداد تنازلي دقيق لموعد الحفل",

    diamantName: "الباقة الماسية",
    diamantTagline: "تجربة كبار الشخصيات المتكاملة",
    diamantCta: "احجز الباقة الماسية ✨",
    diamantF1: "جميع مميزات الباقة الأنيقة",
    diamantF2: "نظام RSVP لتأكيد الحضور فوراً عبر الواتساب",
    diamantF3: "دفتر تهاني وتبريكات رقمي حصري",
    diamantF4: "مؤثرات موسيقية سينمائية / مالوف تونسي",
    diamantF5: "معرض صور عالي الدقة للعروسين",

    royaleName: "باقة رويال",
    royaleTagline: "تصميم مخصص وحصري بالكامل",
    royaleCta: "اطلب باقة رويال",
    royaleF1: "كافة مميزات الباقة الماسية",
    royaleF2: "رموز QR مشفرة لكل ضيف لدخول القاعة",
    royaleF3: "تعديلات لا محدودة ومفتوحة للتصميم",
    royaleF4: "مساعد شخصي على الواتساب 24/7",
  },

  footer: {
    tagline: "دعوات النخبة الرقمية",
    about:
      "نصمم دعوات تعكس فخامة مناسباتكم. لمسة من الرقي، تكنولوجيا متطورة، وتجربة استثنائية تليق بكم.",
    linksTitle: "الروابط",
    linkTemplates: "مجموعة التصاميم",
    linkFeatures: "الخدمات الاستثنائية",
    linkPricing: "باقات النخبة",
    contactTitle: "الحجز والتواصل",
    contactText: "مستشارونا متاحون على مدار الساعة لتلبية متطلباتكم الراقية.",
    contactCta: "تواصل مع الخبراء",
    rights: "جميع الحقوق محفوظة لعلامتنا التجارية.",
    madeIn: "صُنع بفخامة في",
    tunisia: "تونس",
    language: "اللغة",
  },

  cta: {
    title: "تواصل معنا لطلب دعوتك",
    text: "فريقنا جاهز لتصميم دعوة فرحك في أقل من 24 ساعة.",
    whatsapp: "واتساب",
    call: "مكالمة هاتفية",
    button: "اصنع دعوتك الآن",
    aria: "تواصل معنا",
  },

  advisor: {
    launcher: "مساعد اختيار التصميم",
    teaser: "حائر في الاختيار؟ نجد لك التصميم المناسب في أقل من دقيقة.",
    soundOff: "إيقاف الصوت",
    soundOn: "تشغيل الصوت",
    title: "مساعد التصاميم",
    intro: "أهلاً! نسألك أربعة أسئلة قصيرة ونقترح عليك التصميم الأنسب لمناسبتك.",
    q_style: "ما الطابع الذي تريده لدعوتك؟",
    a_style_royal: "ملكي وفخم",
    a_style_tunisian: "تونسي أصيل",
    a_style_floral: "ورود ورومانسية",
    a_style_classic: "كلاسيكي وبسيط",
    q_colors: "أي الألوان تفضّل؟",
    a_colors_goldRed: "ذهبي وأحمر",
    a_colors_emerald: "أخضر زمردي",
    a_colors_pastel: "وردي فاتح",
    a_colors_blue: "أزرق وأبيض",
    q_venue: "أين سيقام الحفل؟",
    a_venue_hall: "قاعة أفراح فخمة",
    a_venue_garden: "حديقة في الهواء الطلق",
    a_venue_dar: "دار تقليدية",
    a_venue_night: "سهرة ليلية",
    q_priority: "ما الأهم بالنسبة لك؟",
    a_priority_video: "فيديو يبهر الضيوف",
    a_priority_sober: "أناقة هادئة",
    a_priority_roots: "لمسة تونسية",
    a_priority_luxe: "أقصى درجات الفخامة",
    resultIntro: "حسب إجاباتك، هذه التصاميم الأنسب لك:",
    best: "الأنسب لك",
    view: "شاهد التصميم",
    restart: "أعد الأسئلة",
    close: "إغلاق",
    step: "سؤال",
    of: "من",
  },
} as const;

/** La forme de `ar` fait foi : les autres langues doivent la remplir entièrement. */
export type Dictionary = {
  [Section in keyof typeof ar]: { [Key in keyof (typeof ar)[Section]]: string };
};

const tn: Dictionary = {
  gate: {
    title: "مرحبا بيك في فرحتي",
    subtitle: "اختار اللغة متاعك باش تكمّل",
    note: "تنجم تبدّل اللغة وقت ما تحب من تحت الصفحة.",
  },

  nav: {
    collection: "المجموعة",
    features: "الخدمات",
    pricing: "الأسعار",
    editor: "المحرر",
    editorLong: "المحرر (بدّل الدعوة)",
    cta: "اعمل دعوتك توّا",
    menu: "القائمة",
  },

  hero: {
    badge: "تصاميم حصرية للأعراس",
    titleLine1: "دعوة عرسك،",
    titleLine2: "تحفة تبقى في البال",
    subtitle:
      "دعوات رقمية تتحرّك وتتسمّع. بهّر ضيوفك بحاجة ما شافوهاش قبل، وتأكيد حضور مرتّب كيف ما يلزم لليلة عمرك.",
    ctaPrimary: "شوف المجموعة",
    ctaSecondary: "شوف الأسعار",
    statWeddings: "عرس تعمل",
    statRating: "تنقيط العرسان",
    statRsvp: "تأكيد حضور",
  },

  templates: {
    eyebrow: "The Collection",
    title: "أحلى التصاميم",
    subtitle:
      "اختار التصميم اللي يعجبك. كل دعوة فيها حركة، موسيقى، وتفاصيل تشدّ العين.",
    catAll: "الكل",
    catRoyal: "قصور ملكية",
    catEnvelope: "ظروف وأختام",
    catTunisian: "تراث تونسي",
    catFloral: "ورود وشموع",
    edit: "بدّل الدعوة",
    preview: "شوفها",
    previewOf: "شوف",
    goToSlide: "أمشي للتصميم",
  },

  how: {
    title: "كيفاش نخدموها؟",
    subtitle: "أربع خطوات برك وتولّي عندك أحلى دعوة رقمية، معمولة على قيس مناسبتك.",
    cta: "ابدا تصميمك",
    step1Title: "اختار التصميم",
    step1Desc: "اختار القالب اللي يعجبك وابعثلنا تفاصيل المناسبة، ساهل برشة.",
    step2Title: "نجهّزوها",
    step2Desc: "الفريق متاعنا يجهّز دعوتك بأعلى جودة وحركة كيما السينما.",
    step3Title: "ابعثها",
    step3Desc: "ابعث الرابط الخاص بيك لضيوفك وخلّيهم يعيشوا التجربة.",
    step4Title: "تأكيد الحضور",
    step4Desc: "تجيك تأكيدات الحضور مباشرة ومرتّبة كيف ما يلزم.",
  },

  features: {
    title: "خدمات ما تلقاهمش في بلاصة أخرى",
    subtitle:
      "كل تفصيلة مدروسة باش التجربة متاعك ومتاع ضيوفك تكون كاملة وتبهر.",
    standard: "موجود في الكل",
    rsvpTitle: "RSVP تأكيد الحضور",
    rsvpDesc:
      "يوصلك كشف كامل بأسماء وعدد ضيوفك ساعة ما يأكّدوا، ديركت على الواتساب.",
    rsvpTag: "تأكيد فوري",
    mapTitle: "الطريق للقاعة",
    mapDesc: "رابط خرائط جوجل مدمج باش ضيوفك يلقاو القاعة بلا ما يضيعوا.",
    musicTitle: "الموسيقى",
    musicDesc: "تجربة سمعية تشدّ القلب — اختار بين المعزوفات الكلاسيكية، ولا المالوف التونسي الأصيل.",
    musicTag: "موسيقى سينمائية",
    calendarTitle: "تذكير في التقويم",
    calendarDesc: "موعد العرس يتزاد أوتوماتيك في تليفونات ضيوفك باش ما ينساوش.",
    guestbookTitle: "دفتر التهاني",
    guestbookDesc: "سجل رقمي يكتبوا فيه أحبابك تهانيهم، تبقى ذكرى.",
    guestbookTag: "جدار التهاني",
    qrTitle: "دعوات VIP بكود",
    qrDesc: "كود QR خاص لكل ضيف باش الدخول للقاعة يكون مرتّب وسريع.",
  },

  pricing: {
    title: "الأسعار",
    subtitle: "خلاص مرة وحدة، بلا اشتراك، والدعوة توصلك في أقل من 24 ساعة.",
    payments: "الخلاص آمن: D17 · Flouci · Bank Card · Sobflous",
    currency: "د.ت",
    oneOff: "خلاص مرة وحدة",
    popular: "الأكثر طلبا",

    eleganteName: "الباقة الأنيقة",
    eleganteTagline: "البداية المناسبة لدعوة راقية",
    eleganteCta: "اطلب الباقة الأنيقة",
    eleganteF1: "اختيار من القوالب الكلاسيكية",
    eleganteF2: "رابط ويب على أسماء العروسين",
    eleganteF3: "حركة الستار ولا الظرف الرقمي",
    eleganteF4: "الطريق للقاعة عبر خرائط جوجل",
    eleganteF5: "عدّاد تنازلي لموعد العرس",

    diamantName: "الباقة الماسية",
    diamantTagline: "التجربة الكاملة",
    diamantCta: "احجز الباقة الماسية ✨",
    diamantF1: "كل مميزات الباقة الأنيقة",
    diamantF2: "نظام RSVP لتأكيد الحضور على الواتساب",
    diamantF3: "دفتر تهاني رقمي",
    diamantF4: "موسيقى سينمائية ولا مالوف تونسي",
    diamantF5: "معرض تصاور بجودة عالية للعروسين",

    royaleName: "باقة رويال",
    royaleTagline: "تصميم مخصص لك وحدك",
    royaleCta: "اطلب باقة رويال",
    royaleF1: "كل مميزات الباقة الماسية",
    royaleF2: "كود QR لكل ضيف باش يدخل للقاعة",
    royaleF3: "تبديلات في التصميم بلا حدّ",
    royaleF4: "مساعد شخصي على الواتساب 24/7",
  },

  footer: {
    tagline: "دعوات رقمية تونسية",
    about:
      "نصمّمو دعوات تعكس فخامة مناسبتك. رقي، تكنولوجيا، وتجربة تليق بيك.",
    linksTitle: "الروابط",
    linkTemplates: "التصاميم",
    linkFeatures: "الخدمات",
    linkPricing: "الأسعار",
    contactTitle: "الحجز والاتصال",
    contactText: "أحنا موجودين على مدار الساعة باش نجاوبوك.",
    contactCta: "تكلّم معانا",
    rights: "الحقوق كلها محفوظة.",
    madeIn: "معمولة في",
    tunisia: "تونس",
    language: "اللغة",
  },

  cta: {
    title: "تكلّم معانا باش تطلب دعوتك",
    text: "الفريق متاعنا جاهز يصمّم دعوة فرحك في أقل من 24 ساعة.",
    whatsapp: "واتساب",
    call: "تلفون",
    button: "اعمل دعوتك توّا",
    aria: "تكلّم معانا",
  },

  advisor: {
    launcher: "مساعد اختيار التصميم",
    teaser: "محتار شنوّة تختار؟ نلقالك التصميم اللي يمشيلك في أقل من دقيقة.",
    soundOff: "طفّي الصوت",
    soundOn: "شعّل الصوت",
    title: "مساعد التصاميم",
    intro: "أهلا! نسألوك أربع أسئلة قصار ونقترحولك التصميم اللي يمشيلك.",
    q_style: "شنوة الطابع اللي تحبّه في دعوتك؟",
    a_style_royal: "ملكي وفخم",
    a_style_tunisian: "تونسي أصيل",
    a_style_floral: "ورود ورومنسية",
    a_style_classic: "كلاسيك وبسيط",
    q_colors: "أنهي ألوان تحب؟",
    a_colors_goldRed: "ذهبي وأحمر",
    a_colors_emerald: "أخضر زمردي",
    a_colors_pastel: "وردي فاتح",
    a_colors_blue: "أزرق وأبيض",
    q_venue: "وين باش يكون العرس؟",
    a_venue_hall: "قاعة أفراح فخمة",
    a_venue_garden: "في الجنان، برّا",
    a_venue_dar: "دار عربي تقليدي",
    a_venue_night: "سهرة في الليل",
    q_priority: "شنوة الأهم بالنسبة ليك؟",
    a_priority_video: "فيديو يبهر الضيوف",
    a_priority_sober: "أناقة هادية",
    a_priority_roots: "لمسة تونسية",
    a_priority_luxe: "فخامة على الآخر",
    resultIntro: "حسب إجاباتك، هاذي التصاميم اللي تمشيلك:",
    best: "الأنسب ليك",
    view: "شوف التصميم",
    restart: "عاود الأسئلة",
    close: "سكّر",
    step: "سؤال",
    of: "من",
  },
};

const fr: Dictionary = {
  gate: {
    title: "Bienvenue chez Farhty",
    subtitle: "Choisissez votre langue pour continuer",
    note: "Vous pourrez en changer à tout moment en bas de page.",
  },

  nav: {
    collection: "La collection",
    features: "Prestations",
    pricing: "Tarifs",
    editor: "Éditeur",
    editorLong: "Éditeur (modifier l'invitation)",
    cta: "Créer mon invitation",
    menu: "Menu",
  },

  hero: {
    badge: "Des créations exclusives pour un mariage d'exception",
    titleLine1: "Votre faire-part,",
    titleLine2: "une œuvre d'art intemporelle",
    subtitle:
      "Des invitations numériques interactives à l'élégance classique. Offrez à vos invités une expérience visuelle inoubliable et des confirmations de présence à la hauteur du plus beau jour de votre vie.",
    ctaPrimary: "Découvrir la collection",
    ctaSecondary: "Voir les tarifs",
    statWeddings: "mariages célébrés",
    statRating: "note des mariés",
    statRsvp: "confirmations de présence",
  },

  templates: {
    eyebrow: "The Collection",
    title: "Nos plus belles créations",
    subtitle:
      "Choisissez le design qui exprime l'élégance de votre événement. Chaque invitation est une pièce animée, mise en musique et soignée jusqu'au moindre détail.",
    catAll: "Toute la collection",
    catRoyal: "Palais royaux",
    catEnvelope: "Sceaux de cire",
    catTunisian: "Patrimoine tunisien",
    catFloral: "Fleurs et bougies",
    edit: "Personnaliser",
    preview: "Aperçu",
    previewOf: "Aperçu de",
    goToSlide: "Aller au design",
  },

  how: {
    title: "Comment ça se passe ?",
    subtitle:
      "Quatre étapes seulement vous séparent de la plus belle invitation numérique, conçue pour votre événement.",
    cta: "Commencer ma création",
    step1Title: "Choix du design",
    step1Desc:
      "Sélectionnez le modèle qui vous ressemble et transmettez-nous les détails de l'événement.",
    step2Title: "Réalisation",
    step2Desc:
      "Notre équipe prépare votre invitation avec une finition soignée et des animations cinématographiques.",
    step3Title: "Envoi",
    step3Desc:
      "Partagez votre lien privé avec vos invités et laissez-les vivre l'expérience.",
    step4Title: "Confirmations",
    step4Desc:
      "Recevez les confirmations de présence directement, organisées et prêtes à consulter.",
  },

  features: {
    title: "Des prestations à la hauteur de l'événement",
    subtitle:
      "Chaque détail est pensé pour que votre expérience et celle de vos invités soient complètes et mémorables.",
    standard: "Inclus partout",
    rsvpTitle: "RSVP — confirmations",
    rsvpDesc:
      "Recevez la liste complète et organisée de vos invités dès qu'ils confirment, directement sur WhatsApp.",
    rsvpTag: "Confirmation immédiate",
    mapTitle: "Itinéraire vers la salle",
    mapDesc:
      "Un lien Google Maps intégré avec élégance pour guider vos invités jusqu'au lieu de la réception.",
    musicTitle: "Ambiance musicale",
    musicDesc:
      "Une écoute qui émeut : au choix, des pièces classiques ou du malouf tunisien authentique.",
    musicTag: "Musique cinématographique",
    calendarTitle: "Rappel dans l'agenda",
    calendarDesc:
      "La date est ajoutée automatiquement dans le téléphone de vos invités pour qu'ils ne l'oublient pas.",
    guestbookTitle: "Livre d'or",
    guestbookDesc:
      "Un registre numérique où vos proches écrivent leurs vœux, conservé comme un souvenir.",
    guestbookTag: "Mur des vœux",
    qrTitle: "Invitations VIP avec QR",
    qrDesc:
      "Un QR code unique par invité pour une entrée en salle rapide et parfaitement organisée.",
  },

  pricing: {
    title: "Des formules pensées pour vous",
    subtitle:
      "Un paiement unique pour une invitation qui vous suit, sans abonnement, livrée en moins de 24 heures.",
    payments: "Paiement sécurisé : D17 · Flouci · Carte bancaire · Sobflous",
    currency: "DT",
    oneOff: "Paiement unique",
    popular: "Le plus demandé",

    eleganteName: "Formule Élégante",
    eleganteTagline: "Le bon départ pour une invitation soignée",
    eleganteCta: "Choisir l'Élégante",
    eleganteF1: "Choix parmi les modèles classiques",
    eleganteF2: "Lien web personnalisé au nom des mariés",
    eleganteF3: "Animation du rideau ou de l'enveloppe",
    eleganteF4: "Itinéraire via Google Maps",
    eleganteF5: "Compte à rebours jusqu'au jour J",

    diamantName: "Formule Diamant",
    diamantTagline: "L'expérience complète",
    diamantCta: "Réserver la Diamant ✨",
    diamantF1: "Tout ce que comprend l'Élégante",
    diamantF2: "RSVP avec confirmations sur WhatsApp",
    diamantF3: "Livre d'or numérique",
    diamantF4: "Musique cinématographique ou malouf tunisien",
    diamantF5: "Galerie photo haute définition des mariés",

    royaleName: "Formule Royale",
    royaleTagline: "Une création entièrement sur mesure",
    royaleCta: "Choisir la Royale",
    royaleF1: "Tout ce que comprend la Diamant",
    royaleF2: "QR code par invité pour l'entrée en salle",
    royaleF3: "Retouches illimitées du design",
    royaleF4: "Assistant dédié sur WhatsApp 24h/24",
  },

  footer: {
    tagline: "Invitations numériques tunisiennes",
    about:
      "Nous créons des invitations à l'image de vos événements : raffinement, technologie et une expérience qui vous ressemble.",
    linksTitle: "Liens",
    linkTemplates: "Les designs",
    linkFeatures: "Les prestations",
    linkPricing: "Les tarifs",
    contactTitle: "Réservation et contact",
    contactText: "Nos conseillers sont disponibles à toute heure pour vous répondre.",
    contactCta: "Parler à un conseiller",
    rights: "Tous droits réservés.",
    madeIn: "Conçu en",
    tunisia: "Tunisie",
    language: "Langue",
  },

  cta: {
    title: "Contactez-nous pour votre invitation",
    text: "Notre équipe conçoit l'invitation de votre mariage en moins de 24 heures.",
    whatsapp: "WhatsApp",
    call: "Appeler",
    button: "Créer mon invitation",
    aria: "Nous contacter",
  },

  advisor: {
    launcher: "Trouver mon design",
    teaser: "Vous hésitez ? Je trouve votre design en moins d'une minute.",
    soundOff: "Couper le son",
    soundOn: "Activer le son",
    title: "Assistant design",
    intro: "Bonjour ! Quatre questions rapides, et je vous propose le design le plus adapté à votre mariage.",
    q_style: "Quel style souhaitez-vous pour votre invitation ?",
    a_style_royal: "Royal et fastueux",
    a_style_tunisian: "Tunisien authentique",
    a_style_floral: "Fleuri et romantique",
    a_style_classic: "Classique et sobre",
    q_colors: "Quelles couleurs préférez-vous ?",
    a_colors_goldRed: "Or et rouge",
    a_colors_emerald: "Vert émeraude",
    a_colors_pastel: "Rose pastel",
    a_colors_blue: "Bleu et blanc",
    q_venue: "Où se déroulera la réception ?",
    a_venue_hall: "Dans une salle de fête",
    a_venue_garden: "En extérieur, dans un jardin",
    a_venue_dar: "Dans une maison traditionnelle",
    a_venue_night: "Une soirée de nuit",
    q_priority: "Qu'est-ce qui compte le plus pour vous ?",
    a_priority_video: "Une vidéo qui impressionne",
    a_priority_sober: "Une élégance discrète",
    a_priority_roots: "Une touche tunisienne",
    a_priority_luxe: "Le luxe avant tout",
    resultIntro: "D'après vos réponses, voici les designs qui vous correspondent :",
    best: "Le plus adapté",
    view: "Voir le design",
    restart: "Recommencer",
    close: "Fermer",
    step: "Question",
    of: "sur",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { ar, tn, fr };
