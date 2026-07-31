/**
 * Réponses automatiques par mots-clés.
 *
 * Les clients tunisiens écrivent indifféremment en arabe, en derja translittérée
 * ou en français : chaque règle liste donc les trois formes.
 */

export interface Rule {
  /** Motifs recherchés dans le message, déjà normalisés (minuscules, sans accents). */
  keywords: string[];
  reply: string;
}

const SITE = "farhty.me";

/** Envoyé quand aucune règle ne correspond : oriente sans faire semblant de comprendre. */
export const FALLBACK_REPLY = `أهلا بيك في فرحتي 🌸

ما فهمتش سؤالك مليح، أما نجم نعاونك. أكتبلي وحدة من هاذم :

• *الأسعار* — باش نبعثلك التعريفة
• *التصاميم* — باش تشوف النماذج
• *الوقت* — قداش تاخو الدعوة
• *نحجز* — باش نبداو دعوتك

ولا استنى شوية وباش نجاوبك شخصيا 💛`;

/**
 * L'ordre compte : la première règle qui correspond gagne.
 * Les intentions les plus spécifiques (réserver) passent avant les plus larges.
 */
export const RULES: Rule[] = [
  {
    keywords: [
      "نحجز", "حجز", "نبدا", "نحب نعمل", "نعمل دعوة", "طلب",
      "commander", "reserver", "je veux", "commande",
    ],
    reply: `يا مرحبا 🎉

باش نبداو، أرسلي هاذي المعلومات :

1. أسماء العروسين
2. تاريخ الحفل
3. اسم القاعة والمدينة
4. التصميم إلي عجبك (من ${SITE})

كيف تبعثهم، نحضرلك الدعوة ونبعثلك اللينك 💛`,
  },
  {
    keywords: [
      "سعر", "الأسعار", "اسعار", "بقداش", "قداش", "كم", "تعريفة", "ثمن",
      "prix", "tarif", "combien", "cout",
    ],
    reply: `أهلا بيك 🌸

الأسعار تتبدل حسب التصميم والخدمات إلي تحبهم.

شوف التصاميم الكل هوني : ${SITE}
قولي أنهي وحدة عجبتك وباش نعطيك السعر بالضبط 💛`,
  },
  {
    keywords: [
      "وقت", "الوقت", "متى", "وقتاش", "مدة", "سرعة", "جاهزة",
      "delai", "temps", "quand", "duree",
    ],
    reply: `الدعوة تكون حاضرة في ظرف *24 إلى 48 ساعة* من وقت ما تبعثلي المعلومات ⏱️

كان مستعجل، قولي وباش نشوف كيفاش نسرعو 💛`,
  },
  {
    keywords: [
      "تصميم", "التصاميم", "نماذج", "نموذج", "شنوة عندكم", "شوف",
      "modele", "design", "template", "catalogue",
    ],
    reply: `التصاميم الكل موجودة هوني مع الفيديوهات 👇

${SITE}

كل تصميم تنجم تشوفو يتحرك قبل ما تختار. قولي أنهي وحدة عجبتك 💛`,
  },
  {
    keywords: [
      "كيفاش", "كيف", "شنية", "شنوة", "تخدم", "يخدم", "تمشي",
      "comment", "ca marche", "fonctionne",
    ],
    reply: `بسيطة برشا 🌸

1. تختار التصميم من ${SITE}
2. تبعثلي أسماء العروسين، التاريخ والقاعة
3. نحضرلك الدعوة ونبعثلك لينك
4. تبعث اللينك لضيوفك في الواتساب

الضيوف يحلو اللينك ويشوفو الدعوة بالفيديو والموسيقى 💛`,
  },
  {
    keywords: [
      "سلام", "السلام", "أهلا", "اهلا", "مرحبا", "صباح", "مساء",
      "bonjour", "bonsoir", "salut", "salam", "hello", "hi",
    ],
    reply: `وعليكم السلام، أهلا وسهلا بيك في فرحتي 🌸

نعملولك دعوة عرس إلكترونية بالفيديو والموسيقى، تبعثها لضيوفك بلينك واحد.

شوف التصاميم : ${SITE}

شنوة تحب تعرف ؟ *الأسعار* ولا *الوقت* ولا *نحجز* 💛`,
  },
  {
    keywords: ["شكرا", "يعيشك", "بارك الله", "merci", "thanks"],
    reply: `العفو، بالتوفيق إن شاء الله 💛
أي وقت تحتاجني، أنا هوني 🌸`,
  },
];

/**
 * Normalise pour que « Bonjour », « bonjour » et « Bônjour » correspondent,
 * et que les variantes de l'alef arabe (أ إ آ) tombent sur la même forme.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents latins
    .replace(/[أإآ]/g, "ا") // أ إ آ -> ا
    .replace(/ة/g, "ه") // ة -> ه
    .trim();
}

/** Retourne la réponse de la première règle qui correspond, sinon le repli. */
export function findReply(message: string): string {
  const normalized = normalize(message);
  for (const rule of RULES) {
    if (rule.keywords.some((k) => normalized.includes(normalize(k)))) {
      return rule.reply;
    }
  }
  return FALLBACK_REPLY;
}
