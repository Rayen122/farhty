export interface Template {
  id: number;
  slug: string;
  category: string;
  name: string;
  subtitle: string;
  description: string;
  accent: string;
  secondary: string;
  bg: string;
  decorations: string[];
  previewText: {
    bride: string;
    groom: string;
    date: string;
    time: string;
    lieu: string;
    city: string;
    story: { title: string; text: string }[];
    program: { time: string; title: string; desc: string }[];
    photos: string[];
    musicUrl?: string;
    musicTitle?: string;
    quranVerse?: string;
    hideRsvp?: boolean;
    hideWishes?: boolean;
    hideQuran?: boolean;
  };
  style: string;
  /** URL vidéo hero optionnelle (mp4/webm dans /public) */
  video?: string;
  /** Image de fond peinte optionnelle (jpg/png dans /public/images) */
  image?: string;
  /** Coordonnées exactes de la salle, saisies dans l'éditeur (prioritaires sur lieu+ville) */
  geo?: { lat: number; lng: number; address?: string };
  /** Positions personnalisées des blocs de texte sur la carte, en % */
  layout?: Record<string, { x: number; y: number }>;
}

/** Lien « ouvrir dans Google Maps ». Utilise le point GPS s'il existe, sinon le texte. */
export function mapsLinkFor(t: Pick<Template, "geo" | "previewText">): string {
  if (t.geo) return `https://maps.google.com/?q=${t.geo.lat},${t.geo.lng}`;
  return `https://maps.google.com/?q=${encodeURIComponent(`${t.previewText.lieu} ${t.previewText.city}`)}`;
}

/** Même chose pour la carte intégrée */
export function mapsEmbedFor(t: Pick<Template, "geo" | "previewText">): string {
  const q = t.geo ? `${t.geo.lat},${t.geo.lng}` : `${t.previewText.lieu} ${t.previewText.city}`;
  const zoom = t.geo ? 17 : 15;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

export const templates: Template[] = [
  {
    id: 301,
    slug: "porte-chateau",
    category: "الستار الأحمر والملكيات 🔴",
    name: "بوابة القصر الأسطوري",
    subtitle: "فيديو بوابات القصر الملكي تنفتح 🏰 4K",
    description: "أنميشن فيديو ساحر لبوابات القصر الأسطوري الذهبية تنفتح بإبهار لتكشف عن تفاصيل حفل الزفاف الملكي",
    accent: "#D4AF37",
    secondary: "#8B0A1A",
    bg: "linear-gradient(180deg, #1C050B 0%, #3B0D18 50%, #0F0206 100%)",
    decorations: ["🏰", "👑", "✨"],
    previewText: {
      bride: "فاطمة",
      groom: "مهدي",
      date: "20 سبتمبر 2026",
      time: "20h00",
      lieu: "قصر الأحلام الملكي",
      city: "تونس العاصمة",
      story: [
        { title: "افتتاح بوابة القصر", text: "ثلاث دقات على أبواب القصر الذهبية تبدأ معها أسطورة فرحنا الأبدي وسط الأجواء الملكية." },
      ],
      program: [
        { time: "19:30", title: "فتح أبواب القصر", desc: "استقبال الضيوف والموسيقى الملكية" },
        { time: "21:00", title: "دخول العروسين القاعة الكبرى", desc: "مراسيم عقد القران والألعاب النارية" },
      ],
      photos: [],
    },
    style: "da3wa-porte-chateau",
    video: "/templates/bab/assets/door.mp4",
    image: "/images/royal_gates.webp"
  },
  {
    id: 302,
    slug: "palais-or",
    category: "الستار الأحمر والملكيات 🔴",
    name: "القصر الذهبي الفاخر",
    subtitle: "فيديو بوابات القصر الذهبية 4K 🏰",
    description: "أنميشن سينمائي مبهر لبوابات قصر ذهبية تفتح على عالم من الفخامة المطلقة لتعرض تفاصيل دعوة زفافكم الملكية.",
    accent: "#D4AF37",
    secondary: "#F5D061",
    bg: "linear-gradient(180deg, #140F05 0%, #2A1F0A 50%, #0F0A02 100%)",
    decorations: ["🏰", "👑", "✨"],
    previewText: {
      bride: "عليا",
      groom: "يوسف",
      date: "10 أكتوبر 2026",
      time: "20h00",
      lieu: "قصر الأفراح الملكي",
      city: "المرسى",
      story: [
        { title: "افتتاح أبواب الفرح", text: "خلف هذه الأبواب الذهبية، تبدأ أجمل فصول حكايتنا التي نود مشاركتها معكم." },
      ],
      program: [
        { time: "19:30", title: "استقبال كبار الزوار", desc: "ترحيب ملكي بالضيوف الكرام" },
        { time: "21:00", title: "إضاءة القصر", desc: "دخول العروسين وبدء الاحتفال" },
      ],
      photos: [],
    },
    style: "da3wa-palais-or",
    video: "/videos/palais-or.mp4",
    image: "/images/golden_palace.webp"
  },
  {
    id: 304,
    slug: "parchemin-royal",
    category: "الستار الأحمر والملكيات 🔴",
    name: "المخطوط الملكي (Premium)",
    subtitle: "فيديو سينمائي لفتح المخطوط الذهبي 4K 📜",
    description: "تصميم فاخر بمخطوط ملكي مطرز بالذهب يُفتح ببطء بحركة سينمائية مذهلة ليكشف تفاصيل ليلة العمر.",
    accent: "#B8860B",
    secondary: "#F0E0BC",
    bg: "linear-gradient(180deg, #1A1207 0%, #33240F 50%, #0D0904 100%)",
    decorations: ["📜", "👑", "✨"],
    previewText: {
      bride: "مريم",
      groom: "أنس",
      date: "15 نوفمبر 2026",
      time: "19h30",
      lieu: "قصر المخطوطات",
      city: "سيدي بوسعيد",
      story: [
        { title: "مخطوط الفرح", text: "على مخطوط من ذهب، كتبنا أجمل فصول حكايتنا، ونتشرف بدعوتكم لقراءتها معنا." },
      ],
      program: [
        { time: "19:00", title: "فتح المخطوط الملكي", desc: "استقبال الضيوف على أنغام المالوف" },
        { time: "20:30", title: "مراسم عقد القران", desc: "توقيع العهد وسط العائلة والأحباب" },
      ],
      photos: [],
    },
    style: "da3wa-parchemin-royal",
    video: "/videos/scroll-parchemin.mp4",
    image: "/images/parchemin_royal_cover.jpg"
  },
  {
    id: 305,
    slug: "lettre-royale",
    category: "الستار الأحمر والملكيات 🔴",
    name: "الرسالة الملكية (Premium)",
    subtitle: "فيديو سينمائي كامل لفتح الظرف وختم الشمع البرونزي 4K ✉️",
    description: "تجربة سينمائية كاملة: ظرف مخملي بختم شمعي برونزي ينفتح على وهج ذهبي، ثم تنكشف تفاصيل الدعوة.",
    accent: "#C9A24B",
    secondary: "#E8D9A8",
    bg: "linear-gradient(180deg, #0D1310 0%, #1C2620 50%, #070B09 100%)",
    decorations: ["✉️", "👑", "✨"],
    previewText: {
      bride: "لينا",
      groom: "زياد",
      date: "5 ديسمبر 2026",
      time: "20h00",
      lieu: "قصر قرطاج",
      city: "قرطاج",
      story: [
        { title: "ختم من شمع", text: "خلف ختم الشمع البرونزي، رسالة كتبناها بالنور، ندعوكم فيها لمشاركتنا أجمل ليالي العمر." },
      ],
      program: [
        { time: "19:30", title: "استقبال الضيوف", desc: "كوكتيل ترحيبي على أنغام الكمان" },
        { time: "21:00", title: "دخول العروسين", desc: "بداية الاحتفال والألعاب النارية" },
      ],
      photos: [],
    },
    style: "da3wa-lettre-royale",
    video: "/videos/v1.mp4",
    image: "/images/lettre_royale_cover.jpg"
  },
  {
    id: 203,
    slug: "lanternes-celestes",
    category: "الورود والشموع 🌸",
    name: "ليلة الفوانيس والنجوم",
    subtitle: "فيديو أنميشن الفوانيس الطائرة ✨",
    description: "أنميشن فيديو ساحر لمئات الفوانيس المضيئة تتصاعد في سماء الليل الداكنة لتكشف عن بطاقة زفافكم الملكية",
    accent: "#F59E0B",
    secondary: "#EC4899",
    bg: "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #020617 100%)",
    decorations: ["🏮", "🌟", "✨"],
    previewText: {
      bride: "نور",
      groom: "فارس",
      date: "18 أكتوبر 2026",
      time: "20h30",
      lieu: "فيلا الأحلام",
      city: "Gammarth",
      story: [
        { title: "أمنيات مضاءة بالسماء", text: "كل فانوس أطلقناه في السماء هو دعوة صادقة وأمنية لحياة مليئة بالمحبة والسلام." },
      ],
      program: [
        { time: "20:00", title: "إضاءة الفوانيس", desc: "إطلاق الفوانيس المضيئة في السماء" },
        { time: "21:30", title: "عشاء سهرة الشموع", desc: "موسيقى هادئة وجلسة شاعرية" },
      ],
      photos: [],
    },
    style: "da3wa-lanternes",
    video: "/videos/sindrella.mp4",
    image: "/images/floating_lanterns.webp"
  },
  {
    id: 204,
    slug: "palais-cristal",
    category: "الستار الأحمر والملكيات 🔴",
    name: "قصر الكريستال والماس",
    subtitle: "فيديو صندوق الماس ينفتح 💎",
    description: "أنميشن فيديو فاخر لصندوق المجوهرات والماس ينفتح بضوء مبهر ولألأة ساحرة ليكشف عن تفاصيل حفل الزفاف",
    accent: "#D4AF37",
    secondary: "#E2E8F0",
    bg: "linear-gradient(180deg, #18092B 0%, #341459 50%, #0F041D 100%)",
    decorations: ["💎", "👑", "✨"],
    previewText: {
      bride: "سلمى",
      groom: "مهدي",
      date: "5 نوفمبر 2026",
      time: "19h00",
      lieu: "Palais Royal",
      city: "تونس",
      story: [
        { title: "بريق الماس والأبد", text: "خاتم الماس يلمع في الظلام، ووعدٌ راسخ يربط قلوبنا إلى الأبد." },
      ],
      program: [
        { time: "19:00", title: "استقبال الكريستال", desc: "عزف الكمان والمشروبات الترحيبية" },
        { time: "20:30", title: "دخول القاعة الكبرى", desc: "مراسيم الزفاف وإضاءة اللسترات" },
      ],
      photos: [],
    },
    style: "da3wa-cristal",
    video: "/templates/ring/assets/box-video.mp4",
    image: "/images/crystal_box.webp"
  },
  {
    id: 205,
    slug: "jardin-royal",
    category: "الورود والشموع 🌸",
    name: "الحديقة الملكية الزمردية",
    subtitle: "حرير الزمرد والورد 🍃",
    description: "أنميشن حالم لمظروف حريري بالأخضر الزمردي والذهب الوردي ينفتح على حديقة غنّاء من الزهور التونسية",
    accent: "#047857",
    secondary: "#F59E0B",
    bg: "linear-gradient(180deg, #022C22 0%, #064E3B 50%, #021B15 100%)",
    decorations: ["🌿", "🌸", "✨"],
    previewText: {
      bride: "ياسمين",
      groom: "كريم",
      date: "12 ديسمبر 2026",
      time: "18h00",
      lieu: "حدائق الورد الملكية",
      city: "المرسى",
      story: [
        { title: "ربيع القلوب", text: "تفتحت زهور الحب في قلوبنا لتزهر ليلة فرح لا تُنسى وسط الطبيعة والجمال." },
      ],
      program: [
        { time: "18:00", title: "استقبال الحديقة", desc: "عصير الفواكه الطبيعية وعزف الناي" },
        { time: "19:30", title: "عقد القران في الروضة", desc: "تبادل الخواتم أمام النافورة" },
      ],
      photos: [],
    },
    style: "da3wa-jardin-royal",
    video: "/templates/reverie/assets/envelope.mp4",
    image: "/images/royal_garden.webp"
  },
  {
    id: 206,
    slug: "oasis-etoilee",
    category: "التراث التونسي 🇹🇳",
    name: "واحة النجوم والتراث",
    subtitle: "فيديو البوابة الصحراوية الذهبية 🌙",
    description: "أنميشن فيديو لبوابة القصر التونسي الذهبية تنفتح على واحة من النجوم المتلألئة والنغمات الأصيلة",
    accent: "#C97B3D",
    secondary: "#F59E0B",
    bg: "linear-gradient(180deg, #1A0D06 0%, #472918 50%, #0C0603 100%)",
    decorations: ["🌙", "🏺", "✨"],
    previewText: {
      bride: "ليلى",
      groom: "سليم",
      date: "30 ديسمبر 2026",
      time: "20h00",
      lieu: "قصر الصحراء",
      city: "توزر",
      story: [
        { title: "سحر الصحراء والنجوم", text: "تحت سماء الصحراء الصافية ومئات النجوم الساطعة، نحتفل بجمع شملنا." },
      ],
      program: [
        { time: "20:00", title: "سهرة الخيمة الملكية", desc: "استقبال بالطبل العربي والأغاني البدوية" },
        { time: "21:30", title: "عشاء الواحة", desc: "مأدبة العشاء التونسي الأصيل" },
      ],
      photos: [],
    },
    style: "da3wa-oasis",
    video: "/templates/rozana/assets/entrance.mp4",
    image: "/images/bg_bab.webp"
  },
  {
    id: 101,
    slug: "classic",
    category: "الأكثر مبيعاً 🔥",
    name: "كلاسيك",
    subtitle: "باب يُفتح + طيور",
    description: "باب شرقي أثري يُفتح مع تحليق الطيور وموسيقى هادئة تكشف عن بطاقة دعوتكم الفاخرة",
    accent: "#ff4d7d",
    secondary: "#14c2b0",
    bg: "linear-gradient(160deg, #f6efe4, #ece0cc)",
    decorations: ["🕊️", "🚪", "✨"],
    previewText: {
      bride: "مريم",
      groom: "أحمد",
      date: "15 أيلول 2026",
      time: "19h00",
      lieu: "قاعة الفردوس",
      city: "بغداد",
      story: [
        { title: "بداية الحكاية", text: "في يوم جميل التقيا تحت ظلال الياسمين، وتبادلا الوعود بقلوب مليئة بالأمل." },
      ],
      program: [
        { time: "18:30", title: "استقبال الضيوف", desc: "ترحيب حار وعصير طازج" },
        { time: "19:30", title: "مراسيم الزفاف", desc: "دخول العروسين وتبادل الوعود" },
      ],
      photos: [],
    },
    style: "da3wa-classic",
    image: "/images/bg_classic.webp"
  },
  {
    id: 1,
    slug: "lella-beya",
    category: "Traditionnel",
    name: "Lella Beya",
    subtitle: "Marsala & Floral 3D",
    description: "Invitation 3D animée avec enveloppe interactive, sceau de cire doré et décors floraux",
    accent: "#8B2252",
    secondary: "#C9A84C",
    bg: "linear-gradient(180deg, #FDF5F8 0%, #F8E8F0 40%, #F0D8E5 70%, #FDF5F8 100%)",
    decorations: ["floral", "eucalyptus", "rose"],
    previewText: {
      bride: "Nour",
      groom: "Youssef",
      date: "12 Août 2025",
      time: "18h30",
      lieu: "Dar El Bey",
      city: "Tunis",
      story: [
        { title: "Comment tout a commencé", text: "Une nuit d'été dans la médina de Tunis. Nour cherchait l'inspiration pour sa collection de poterie, Youssef photographiait les vieilles portes. Leurs regards se sont croisés rue de la Pacha..." },
        { title: "La demande", text: "Trois ans plus tard, sous la coupole du palais Ennejma Ezzahra, Youssef a posé un genou à terre. Les larmes de Nour ont parlé avant elle." },
      ],
      program: [
        { time: "17:00", title: "Accueil", desc: "Cocktail de bienvenue dans le jardin andalou" },
        { time: "18:30", title: "Cérémonie", desc: "Échange des vœux sous la grande coupole" },
        { time: "20:00", title: "Dîner", desc: "Dîner raffiné aux saveurs tunisiennes" },
        { time: "22:00", title: "Soirée", desc: "Danse et fête jusqu'au petit matin" },
      ],
      photos: [],
    },
    style: "marsala-3d",
    image: "/images/lella_beya_4k.webp"
  },
  {
    id: 6,
    slug: "imperiale",
    category: "Premium",
    name: "Impériale",
    subtitle: "Rideaux de Velours 4K & Couronne d'Or",
    description: "Rideaux de velours rouge impérial 4K qui s'écartent avec Framer Motion, médaillon couronne dorée et monogramme d'exception",
    accent: "#C9A24B",
    secondary: "#7A1028",
    bg: "linear-gradient(160deg, #14090C 0%, #1E0B10 45%, #0C0507 100%)",
    decorations: ["♛", "❦", "✦"],
    previewText: {
      bride: "Elif",
      groom: "Ahmed",
      date: "12 Décembre 2026",
      time: "19h00",
      lieu: "Palais Ennejma Ezzahra",
      city: "Sidi Bou Saïd",
      story: [
        { title: "Notre histoire", text: "Nous avons l'honneur de vous convier à notre mariage. Une soirée d'exception, entre or et lumières, pour célébrer notre union." },
        { title: "Notre promesse", text: "Sous les lustres du palais, entourés de ceux que nous aimons, pour unir nos vies à jamais." },
      ],
      program: [
        { time: "18:30", title: "Accueil", desc: "Réception royale dans le grand salon" },
        { time: "19:00", title: "Cérémonie", desc: "Échange des vœux sous les lustres" },
        { time: "21:00", title: "Festin", desc: "Dîner de gala aux chandelles" },
        { time: "23:00", title: "Bal", desc: "Ouverture du bal et grande soirée" },
      ],
      photos: [],
    },
    style: "imperiale",
    image: "/images/royal_curtains_4k.webp",
  },
  {
    id: 7,
    slug: "jardin",
    category: "Premium",
    name: "Jardin Vintage",
    subtitle: "Fontaine & Dentelle",
    description: "Scène jardin peinte, enveloppe qui s'ouvre et carte de dentelle qui s'élève — parallax et pétales flottants",
    accent: "#8A7B5C",
    secondary: "#C9A89A",
    bg: "linear-gradient(175deg, #EDE8DC 0%, #DCD8C4 45%, #C7C6AE 100%)",
    decorations: ["❀", "✿", "❁"],
    previewText: {
      bride: "Selma",
      groom: "Farouk",
      date: "26 Juillet 2026",
      time: "17h00",
      lieu: "Villa des Orangers",
      city: "La Marsa",
      story: [
        { title: "Notre histoire", text: "Entre les fontaines et les jardins fleuris, nos chemins se sont croisés. Aujourd'hui nous vous invitons à célébrer notre amour." },
        { title: "Notre promesse", text: "Sous les tonnelles de jasmin, entourés de nos proches, pour unir nos vies." },
      ],
      program: [
        { time: "16:30", title: "Accueil", desc: "Réception dans le jardin fleuri" },
        { time: "17:00", title: "Cérémonie", desc: "Échange des vœux devant la fontaine" },
        { time: "19:00", title: "Cocktail", desc: "Sorbets de bienvenue sous les tonnelles" },
        { time: "21:00", title: "Dîner", desc: "Dîner aux chandelles en plein air" },
      ],
      photos: [],
    },
    style: "jardin",
    image: "/images/bg_reverie.webp",
  },
  {
    id: 8,
    slug: "amour",
    category: "Luxe & Tradition",
    name: "Amour",
    subtitle: "Rameaux d'Or & Sceau Rose Rouge",
    description: "Portes 3D à motifs végétaux dorés s'ouvrant à gauche et à droite grâce à Framer Motion. Révèle une carte raffinée sublimée par le verset du mariage (Mawaddah & Rahmah)",
    accent: "#B81D28",
    secondary: "#C59B58",
    bg: "linear-gradient(160deg, #FFF6E9 0%, #F5E5CF 50%, #E6D0B3 100%)",
    decorations: ["✦", "🌹", "✧"],
    previewText: {
      bride: "Sara",
      groom: "Rayan",
      date: "18 Septembre 2026",
      time: "18h00",
      lieu: "Domaine de la Roseraie",
      city: "Sidi Bou Saïd",
      story: [
        { title: "L'étincelle", text: "Leurs chemins se sont croisés au coucher du soleil sur les hauteurs de Sidi Bou Saïd. Un regard, et le monde s'est arrêté..." },
        { title: "La promesse", text: "Sous des fils de soie et une lumière dorée, Rayan a offert cette lettre scellée de mots d'avenir partagé." },
      ],
      program: [
        { time: "17:00", title: "Accueil & Cocktail", desc: "Verre de bienvenue au son de la harpe sur la terrasse" },
        { time: "18:00", title: "Échange des vœux", desc: "Cérémonie solennelle sous la coupole dorée" },
        { time: "20:00", title: "Dîner de gala", desc: "Dîner raffiné aux saveurs exceptionnelles" },
        { time: "22:30", title: "Danse & Lumières", desc: "Ouverture du bal et feu d'artifice sur la baie" },
      ],
      photos: [],
    },
    style: "amour",
    image: "/images/amour_4k.webp",
  },
  {
    id: 9,
    slug: "la-joie",
    category: "Palais & Prestige",
    name: "La Joie",
    subtitle: "Colonnes de Marbre Blanc & Or",
    description: "Célébration digne d'un palais : traversée d'une majestueuse colonnade en marbre blanc 4K avec animation Framer Motion et invitation dorée",
    accent: "#D4AF37",
    secondary: "#1C2D42",
    bg: "linear-gradient(160deg, #F8F6F0 0%, #EFEBE0 45%, #E2DDD0 100%)",
    decorations: ["🏛️", "✨", "👑"],
    previewText: {
      bride: "Maya",
      groom: "Elyes",
      date: "24 Octobre 2026",
      time: "19h00",
      lieu: "Palais des Sables Dorés",
      city: "La Marsa",
      story: [
        { title: "Rencontre royale", text: "Au cœur des jardins du palais, par une nuit d'automne, leurs destins se sont croisés sous les arcades de marbre." },
        { title: "L'union sacrée", text: "Entourés de leurs familles et de leurs proches, ils se sont mariés pour celebrar la plus belle des promesses." },
      ],
      program: [
        { time: "18:30", title: "Accueil princier", desc: "Tapis rouge et musique classique sous les colonnes" },
        { time: "19:30", title: "Échange des vœux", desc: "Cérémonie solennelle sous la coupole du palais" },
        { time: "21:00", title: "Dîner de gala", desc: "Festin royal aux chandelles et saveurs exceptionnelles" },
        { time: "23:00", title: "Grande soirée et danse", desc: "Ouverture du bal et nuit de fête" },
      ],
      photos: [],
    },
    style: "la-joie",
    image: "/images/la_joie_columns_4k.webp",
  },
  {
    id: 11,
    slug: "jasmin",
    category: "Traditionnel Tunisien",
    name: "Jasmin",
    subtitle: "Mashmoum & Fleur d'Oranger",
    description: "Guirlande de jasmin qui éclot fleur par fleur à l'ouverture — hommage au mashmoum tunisien, ivoire, sauge et or",
    accent: "#5E7A52",
    secondary: "#D4AF6A",
    bg: "linear-gradient(175deg, #FBFAF3 0%, #F1EFE0 45%, #E4E8D8 100%)",
    decorations: ["✦", "❁", "✧"],
    previewText: {
      bride: "Ranim",
      groom: "Yassine",
      date: "3 Juin 2027",
      time: "18h00",
      lieu: "Dar Zarrouk",
      city: "Sidi Bou Saïd",
      story: [
        { title: "Le mashmoum", text: "Un vendeur de jasmin dans la ruelle, un bouquet offert plus par pudeur que par audace. Ranim l'a gardé pour le lendemain, et puis pour toujours." },
        { title: "La promesse", text: "Sous les orangers de Dar Zarrouk, dans le parfum de la fleur d'oranger, Yassine a noué un fil de jasmin au doigt de Ranim. La bague viendrait, en promesse." },
      ],
      program: [
        { time: "17:30", title: "Accueil", desc: "Distribution du mashmoum aux invités" },
        { time: "18:00", title: "Cérémonie", desc: "Les vœux sous la tonnelle de jasmin" },
        { time: "20:00", title: "Cocktail", desc: "Eau de fleur d'oranger et douceurs" },
        { time: "22:00", title: "Dîner", desc: "Dîner sous les orangers illuminés" },
      ],
      photos: [],
    },
    style: "jasmin",
    image: "/images/jasmin_bg.webp",
  },
  {
    id: 13,
    slug: "tunisian",
    category: "Luxe & Tradition",
    name: "Tunisian",
    subtitle: "Zellige Bleu & Or 4K",
    description: "Une expérience luxueuse avec une enveloppe en zellige bleu et or qui s'ouvre pour révéler une invitation somptueuse inspirée de l'architecture tunisienne.",
    accent: "#1B5FA6",
    secondary: "#D4AF37",
    bg: "linear-gradient(160deg, #F0F4F8 0%, #DCE5F0 50%, #B8CDE0 100%)",
    decorations: ["💠", "✨", "⚜️"],
    previewText: {
      bride: "Fatma",
      groom: "Mehdi",
      date: "25 Septembre 2026",
      time: "19h00",
      lieu: "Palais Ennejma Ezzahra",
      city: "Sidi Bou Saïd",
      story: [
        { title: "Rencontre sous les arcades", text: "Au cœur de la médina, sous les arcades parfumées de jasmin, leurs regards se sont croisés pour la première fois." },
        { title: "La promesse éternelle", text: "Mehdi l'a demandée en mariage face à la mer, avec une bague scintillant à l'horizon de Sidi Bou Saïd." },
      ],
      program: [
        { time: "18:30", title: "Accueil chaleureux", desc: "Thé aux pignons et douceurs tunisiennes à l'entrée du palais" },
        { time: "19:30", title: "Signature du contrat", desc: "Signature de l'acte de mariage sous les lumières dorées" },
        { time: "21:00", title: "Dîner royal", desc: "Festin traditionnel revisité par notre chef" },
        { time: "23:00", title: "Soirée orientale", desc: "Musique, danse et fête jusqu'au matin" },
      ],
      photos: [],
    },
    style: "tunisian",
    image: "/images/tunisian_envelope_exterior.webp",
  },
  {
    id: 14,
    slug: "moustache-tunisie",
    category: "Luxe & Tradition",
    name: "Moustache Tunisie",
    subtitle: "High-End Scroll World 10K",
    description: "Une expérience immersive de type scroll-world. Moustache Tunisie : L'art du sur-mesure et du smoking haute couture.",
    accent: "#D4AF37",
    secondary: "#111111",
    bg: "linear-gradient(160deg, #222 0%, #111 50%, #000 100%)",
    decorations: ["⚜️", "✨", "🎬"],
    previewText: {
      bride: "",
      groom: "",
      date: "",
      time: "",
      lieu: "Boutique Moustache Tunisie",
      city: "Tunis",
      story: [],
      program: [],
      photos: [],
    },
    style: "moustache",
    image: "/images/bg_classic.webp", // Placeholder
  }
];

export const getTemplateBySlug = (slug: string) => templates.find(t => t.slug === slug);
export const getTemplateById = (id: number) => templates.find(t => t.id === id);
