"use client";

import { motion } from "framer-motion";
import {
  MessageSquareCheck,
  MapPin,
  Music,
  QrCode,
  Calendar,
  Heart,
  ShieldCheck,
  Crown,
  Diamond
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: MessageSquareCheck,
      title: "RSVP تأكيد النخبة",
      desc: "يوصلك كشف كامل ومنظم بأعداد وأسماء ضيوفك لحظة تأكيدهم، مباشرة على الواتساب.",
      tag: "تأكيد فوري",
    },
    {
      icon: MapPin,
      title: "التوجيه الفاخر للموقع",
      desc: "رابط خرائط جوجل مدمج بأناقة ليرشد ضيوفك إلى مكان الحفل بكل سهولة ورقي.",
      tag: "Google Maps",
    },
    {
      icon: Music,
      title: "الأجواء الموسيقية",
      desc: "تجربة سمعية تأسر القلوب—اختر بين المعزوفات الكلاسيكية، أو المالوف التونسي الأصيل.",
      tag: "موسيقى سينمائية",
    },
    {
      icon: Calendar,
      title: "تنبيه تقويم الشخصيات",
      desc: "إضافة أوتوماتيكية لموعد حفلكم في هواتف ضيوفكم لضمان حضورهم في ليلة العمر.",
      tag: "Save The Date",
    },
    {
      icon: Heart,
      title: "دفتر التهاني الملكي",
      desc: "سجل رقمي فاخر يدوّن فيه أحبابكم أجمل أمنياتهم وتهانيهم لتبقى ذكرى خالدة.",
      tag: "جدار التهاني",
    },
    {
      icon: QrCode,
      title: "دعوات الـ VIP المشفرة",
      desc: "رموز QR خاصة لكل ضيف لضمان تنظيم استثنائي وسرعة الدخول للقاعة.",
      tag: "QR Code",
    },
  ];

  return (
    <section id="features" className="container-x py-24 bg-[var(--color-cream)] relative" dir="rtl">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--color-velvet)] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--color-velvet)] blur-[120px] rounded-full pointer-events-none" />

      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--color-line)] text-[var(--color-coral)] text-xs font-bold mb-4 shadow-sm">
          <Crown className="w-4 h-4 text-[var(--color-coral)]" />
          <span className="tracking-widest uppercase">Premium Features</span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ink)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          خدمات استثنائية لمناسبة لا تُنسى
        </h2>
        <p className="text-[var(--color-muted)] text-base sm:text-lg font-semibold max-w-2xl mx-auto">
          كل تفصيلة صُممت بعناية فائقة لتعكس رقيكم، لتكون تجربتكم وتجربة ضيوفكم متكاملة، مبهرة، وخالية من أي عناء.
        </p>
      </div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {features.map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="relative group bg-white/90 backdrop-blur-xl border border-[var(--color-line)] hover:border-[var(--color-coral)] rounded-[32px] p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Card Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--color-velvet)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl bg-[var(--color-cream)] border border-[var(--color-line)] group-hover:border-[var(--color-coral)] text-[var(--color-coral)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300"
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-[var(--color-velvet)] text-[var(--color-coral)] border border-[var(--color-coral)]/20 shadow-xs tracking-wide">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-coral)] transition-colors" style={{ fontFamily: "var(--font-amiri)" }}>
                  {feat.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed font-semibold">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--color-line-soft)] flex items-center justify-between text-xs font-bold text-[var(--color-muted)] relative z-10 transition-colors">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-gold)]" />
                  <span>تضمين قياسي</span>
                </div>
                <Diamond className="w-3 h-3 text-[var(--color-coral)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
