"use client";

import { CheckCircle2, Diamond, ShieldCheck, Crown, Flower2, TreePalm, CreditCard } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="container-x py-24 bg-[var(--color-cream)] relative" dir="rtl">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[var(--color-velvet)] blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[var(--color-velvet)] blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--color-line)] text-[var(--color-coral)] font-bold text-xs mb-4 shadow-sm">
          <Diamond className="w-3.5 h-3.5" />
          <span className="tracking-widest uppercase">Elite Packages</span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ink)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          باقات مصممة للنخبة
        </h2>
        <p className="text-[var(--color-muted)] text-base sm:text-lg font-semibold mb-6">
          استثمار لمرة واحدة يضمن لك دعوة خالدة، بدون اشتراكات، وتسليم استثنائي في أقل من 24 ساعة.
        </p>
        <div className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-[var(--color-line)] text-xs font-bold text-[var(--color-ink)] shadow-md">
          <CreditCard className="w-4 h-4 text-[var(--color-coral)]" />
          <span>بوابات الدفع المشفرة والآمنة: D17 · Flouci · Bank Card · Sobflous</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch relative z-10">
        {/* Tier 1: الباقة الأساسية */}
        <div className="bg-white/90 backdrop-blur-xl border border-[var(--color-line)] rounded-[32px] overflow-hidden shadow-lg hover:shadow-xl flex flex-col justify-between hover:border-[var(--color-coral)] transition-all duration-300 group">
          <div className="bg-[var(--color-cream)] p-8 text-center border-b border-[var(--color-line-soft)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velvet)] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white text-[var(--color-coral)] border border-[var(--color-line)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <TreePalm className="w-6 h-6" />
            </div>
            <h3 className="relative z-10 text-2xl font-bold text-[var(--color-ink)] mb-2" style={{ fontFamily: "var(--font-amiri)" }}>
              الباقة الأنيقة
            </h3>
            <p className="relative z-10 text-sm text-[var(--color-muted)] font-semibold mb-6">البداية المثالية لدعوة راقية</p>
            <div className="relative z-10 text-5xl font-extrabold text-[var(--color-ink)] drop-shadow-sm" style={{ fontFamily: "var(--font-display)" }}>
              49 <span className="text-xl font-bold text-[var(--color-muted)]">د.ت</span>
            </div>
            <span className="relative z-10 text-xs text-[var(--color-muted)] font-bold block mt-2">دفعة واحدة ملمومة</span>
          </div>

          <div className="p-8 flex flex-col flex-1 justify-between">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>اختيار من القوالب الرسمية الكلاسيكية</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>رابط ويب مخصص باسم العروسين</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>أنميشن الستار أو الظرف الرقمي</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>دليل المواقع عبر خرائط جوجل</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>عداد تنازلي دقيق لموعد الحفل</span>
              </li>
            </ul>

            <a href="#templates" className="btn w-full py-4 bg-white text-[var(--color-coral)] border border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white shadow-sm hover:shadow-md rounded-2xl font-bold text-center block transition-all cursor-pointer">
              اطلب الباقة الأنيقة
            </a>
          </div>
        </div>

        {/* Tier 2: الباقة الماسية (Highlighted) */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border-2 border-[var(--color-coral)] flex flex-col justify-between relative transform md:-translate-y-6 z-20">
          <div className="absolute inset-0 bg-[var(--color-cream)] opacity-30 pointer-events-none" />
          
          <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--color-coral)] text-white rounded-b-xl text-xs font-bold px-6 py-1.5 z-10 shadow-md flex items-center gap-2">
            <Diamond className="w-3.5 h-3.5 fill-white" />
            <span>خيار النخبة المفضل</span>
          </span>

          <div className="p-8 text-center pt-14 border-b border-[var(--color-line)] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-velvet)] to-transparent pointer-events-none" />

            <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--color-velvet)] text-[var(--color-coral)] border border-[var(--color-coral)]/30 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Crown className="w-8 h-8" />
            </div>
            <h3 className="relative z-10 text-3xl font-extrabold text-[var(--color-coral)] mb-2" style={{ fontFamily: "var(--font-amiri)" }}>
              الباقة الماسية
            </h3>
            <p className="relative z-10 text-sm text-[var(--color-ink)] font-bold mb-6">تجربة كبار الشخصيات المتكاملة</p>
            <div className="relative z-10 text-6xl font-extrabold text-[var(--color-ink)] drop-shadow-md" style={{ fontFamily: "var(--font-display)" }}>
              89 <span className="text-2xl font-bold text-[var(--color-coral)]">د.ت</span>
            </div>
            <span className="relative z-10 text-xs text-[var(--color-muted)] font-bold block mt-2">دفعة واحدة ملمومة</span>
          </div>

          <div className="p-8 flex flex-col flex-1 justify-between relative z-10">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-[var(--color-ink)] font-bold">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>جميع مميزات الباقة الأنيقة</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-ink)] font-bold">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>نظام RSVP لتأكيد الحضور فوراً عبر الواتساب</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-ink)] font-bold">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>دفتر تهاني وتبريكات رقمي حصري</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-ink)] font-bold">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>مؤثرات موسيقية سينمائية / مالوف تونسي</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-ink)] font-bold">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>معرض صور عالي الدقة للعروسين</span>
              </li>
            </ul>

            <a href="#templates" className="btn w-full py-4.5 bg-[var(--color-coral)] text-white shadow-lg hover:shadow-xl rounded-2xl font-extrabold text-lg text-center block hover:scale-[1.03] transition-all cursor-pointer">
              احجز الباقة الماسية ✨
            </a>
          </div>
        </div>

        {/* Tier 3: باقة رويال */}
        <div className="bg-white/90 backdrop-blur-xl border border-[var(--color-line)] rounded-[32px] overflow-hidden shadow-lg hover:shadow-xl flex flex-col justify-between hover:border-[var(--color-coral)] transition-all duration-300 group">
          <div className="bg-[var(--color-cream)] p-8 text-center border-b border-[var(--color-line-soft)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velvet)] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white text-[var(--color-coral)] border border-[var(--color-line)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[var(--color-coral)]" />
            </div>
            <h3 className="relative z-10 text-2xl font-bold text-[var(--color-ink)] mb-2" style={{ fontFamily: "var(--font-amiri)" }}>
              باقة رويال
            </h3>
            <p className="relative z-10 text-sm text-[var(--color-muted)] font-semibold mb-6">تصميم مخصص وحصري بالكامل</p>
            <div className="relative z-10 text-5xl font-extrabold text-[var(--color-ink)] drop-shadow-sm" style={{ fontFamily: "var(--font-display)" }}>
              149 <span className="text-xl font-bold text-[var(--color-muted)]">د.ت</span>
            </div>
            <span className="relative z-10 text-xs text-[var(--color-muted)] font-bold block mt-2">دفعة واحدة ملمومة</span>
          </div>

          <div className="p-8 flex flex-col flex-1 justify-between">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>كافة مميزات الباقة الماسية</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>رموز QR مشفرة لكل ضيف لدخول القاعة</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>تعديلات لا محدودة ومفتوحة للتصميم</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-muted)] font-semibold group-hover:text-[var(--color-ink)] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-coral)] shrink-0" />
                <span>مساعد شخصي على الواتساب 24/7</span>
              </li>
            </ul>

            <a href="#templates" className="btn w-full py-4 bg-white text-[var(--color-coral)] border border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white shadow-sm hover:shadow-md rounded-2xl font-bold text-center block transition-all cursor-pointer">
              اطلب باقة رويال
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
