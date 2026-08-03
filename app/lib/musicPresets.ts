export interface MusicPreset {
  id: string;
  name: string;
  artist: string;
  url: string;
  category: "malouf" | "instrumental" | "traditional" | "romantic";
}

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: "malouf-andalous",
    name: "مالوف تونس وأندلسيات 🕌",
    artist: "فرقة التخت الموسيقي بتونس (خميس ترنان)",
    category: "malouf",
    url: "/audio/malouf.mp3",
  },
  {
    id: "lelliri-yamma",
    name: "أغنية الزفاف: لليري ياما 💃",
    artist: "أجواء الأفراح والأعراس التونسية",
    category: "traditional",
    url: "/audio/lelliri.mp3",
  },
  {
    id: "qanun-romance",
    name: "تقاسيم عود تونسية أصيلة 🪕",
    artist: "أنغام عود شرق تونسية",
    category: "instrumental",
    url: "/audio/qanun.mp3",
  },
  {
    id: "violin-wedding",
    name: "استخبار كمنجة سيكاه 🎻",
    artist: "عزف كمان تونسي أصيل",
    category: "romantic",
    url: "/audio/violin.mp3",
  },
  {
    id: "traditional-festive",
    name: "أجواء المزود والربوخ التونسي 🥁",
    artist: "فن شعبي تونسي للأفراح",
    category: "traditional",
    url: "/audio/mezoued.mp3",
  },
  {
    id: "khalouni-traditional",
    name: "تراث الأعراس التونسية العتيقة 📜",
    artist: "أغنية تونسية أصيلة (خلوني)",
    category: "traditional",
    url: "/audio/khalouni.mp3",
  },
  {
    id: "piano-royal",
    name: "معزوفة أندلسية تونسية 🎹",
    artist: "تراث موسيقي تونسي أصيل",
    category: "romantic",
    url: "/audio/piano.mp3",
  },
];
