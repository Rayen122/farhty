"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles, Send, CheckCircle2, Diamond } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "I",
      title: "اختيار التصميم",
      desc: "انتقِ القالب الذي يتناغم مع ذوقك وأرسل تفاصيل المناسبة بكل سهولة.",
      icon: Mail,
    },
    {
      num: "II",
      title: "الصياغة الفنية",
      desc: "يقوم فريقنا بتجهيز دعوتك بأعلى معايير الجودة والأنميشن السينمائي.",
      icon: Sparkles,
    },
    {
      num: "III",
      title: "الإرسال الفاخر",
      desc: "شارك رابطك الخاص والمشفر مع ضيوفك ليعيشوا التجربة الفاخرة.",
      icon: Send,
    },
    {
      num: "IV",
      title: "تأكيد النخبة",
      desc: "استلم تأكيدات الحضور مباشرة وبطريقة منظمة تليق بمناسبتك.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="how"
      className="py-24 bg-[var(--color-cream)] relative overflow-hidden"
      dir="rtl"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-velvet)] rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="container-x relative z-10 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--color-line)] text-[var(--color-coral)] text-xs font-bold mb-4 shadow-sm">
            <Diamond className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">The Process</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ink)] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            كيف نصنع التحفة؟
          </h2>
          <p className="text-[var(--color-muted)] text-base sm:text-lg font-semibold">
            خطوات بسيطة تفصلك عن امتلاك أرقى دعوة رقمية على الإطلاق، مصممة خصيصاً لتخليد لحظاتك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative bg-white/90 backdrop-blur-xl rounded-[32px] p-8 border border-[var(--color-line)] hover:border-[var(--color-coral)] shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col items-center text-center"
              >
                {/* Background Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velvet)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                {/* Top Number */}
                <div className="relative z-10 mb-6">
                  <span className="text-5xl font-light text-[var(--color-line)] group-hover:text-[var(--color-coral)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {item.num}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[var(--color-gold)] group-hover:text-[var(--color-coral)] transition-colors" />
                  </div>
                </div>

                <h3
                  className="relative z-10 text-xl font-bold text-[var(--color-ink)] mb-3 transition-colors"
                  style={{ fontFamily: "var(--font-amiri)" }}
                >
                  {item.title}
                </h3>
                <p className="relative z-10 text-sm text-[var(--color-muted)] leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="#templates"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white border border-[var(--color-coral)] text-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white shadow-md hover:shadow-lg transition-all rounded-full font-bold text-base cursor-pointer"
          >
            <span>ابدأ تصميمك الخاص</span>
            <Diamond className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
