"use client";

import { motion } from "framer-motion";
import { Star, Quote, Heart, CheckCircle2, MapPin, Diamond } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "ليلى وعمر",
      location: "تونس العاصمة (قرطاج)",
      date: "صيف 2026",
      text: "تجربة لا تُنسى! التصميم السينمائي للدعوة جعل جميع المدعوين يتحدثون عن فخامة حفلنا قبل بدايته. خدمة تأكيد الحضور وفرت علينا الكثير من الجهد والوقت.",
      rating: 5,
    },
    {
      name: "ياسمين ومهدي",
      location: "المرسى",
      date: "خريف 2026",
      text: "لم أتخيل يوماً أن تكون دعوتي بهذا الرقي. الأنميشن الخاص بفتح بوابة القصر الملكي أبهر الجميع، والأجواء الموسيقية أعطت طابعاً ساحراً لا يُضاهى.",
      rating: 5,
    },
    {
      name: "سيرين وأحمد",
      location: "سيدي بو سعيد",
      date: "ربيع 2026",
      text: "خدمة VIP بكل ما تحمله الكلمة من معنى. الدقة في التصميم والاهتمام بأدق التفاصيل مثل ختم الشمع والأنميشن، جعلت من دعوتنا تحفة فنية يتداولها الأصدقاء.",
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="container-x py-24 bg-[var(--color-cream)] relative" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[var(--color-velvet)] blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--color-line)] text-[var(--color-coral)] font-bold text-xs mb-4 shadow-sm">
          <Diamond className="w-3.5 h-3.5" />
          <span className="tracking-widest uppercase">Elite Testimonials</span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ink)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          شهادات النخبة
        </h2>
        <p className="text-[var(--color-muted)] text-base sm:text-lg font-semibold max-w-2xl mx-auto">
          انطباعات استثنائية من شخصيات اختارت الفخامة المطلقة لتخليد أجمل ليالي العمر.
        </p>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
        {reviews.map((rev, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-xl border border-[var(--color-line)] rounded-[32px] p-8 shadow-lg flex flex-col justify-between hover:border-[var(--color-coral)] hover:shadow-xl transition-all relative group cursor-pointer overflow-hidden"
          >
            {/* Card Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velvet)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <Quote className="w-10 h-10 text-[var(--color-velvet)] absolute top-6 left-6 group-hover:text-[var(--color-coral)]/20 transition-colors duration-500 transform group-hover:scale-110" />

            <div className="relative z-10">
              {/* Stars & Verified Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-1 text-[var(--color-gold)]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-gold)]" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[var(--color-coral)] bg-[var(--color-velvet)] px-3 py-1 rounded-full border border-[var(--color-coral)]/20 tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>عضوية VIP</span>
                </span>
              </div>

              <p className="text-sm text-[var(--color-muted)] leading-relaxed font-semibold mb-8 group-hover:text-[var(--color-ink)] transition-colors duration-300">
                "{rev.text}"
              </p>
            </div>

            <div className="pt-5 border-t border-[var(--color-line-soft)] flex items-center justify-between relative z-10">
              <div>
                <h4 className="text-lg font-bold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-amiri)" }}>
                  {rev.name}
                </h4>
                <span className="text-xs text-[var(--color-muted)] font-bold flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[var(--color-coral)]" />
                  <span>{rev.location}</span>
                </span>
              </div>
              <span className="text-[10px] text-[var(--color-muted)] bg-[var(--color-cream)] px-3 py-1 rounded-full font-bold border border-[var(--color-line)]">
                {rev.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
