import type { Metadata } from "next";
import { Check, Clock, MessageCircle, Sparkles, Wallet } from "lucide-react";
import Navbar from "../components/Navbar";
import Templates from "../components/Templates";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import FloatingCTA from "../components/FloatingCTA";
import { whatsappUrlWithRef } from "../lib/contact";
import { isValidRef } from "../lib/brand";
import RefCapture from "./RefCapture";

export const metadata: Metadata = {
  /* Le gabarit du layout ajoute déjà « · فرحتي » */
  title: "وصلتك دعوة رقمية؟ اصنع دعوتك أنت الزادة",
  description:
    "الدعوة اللي وصلتك تصنعت في فرحتي. اختار تصميمك، عمّر معلوماتك، وابعث دعوتك لضيوفك في واتساب — بلا مطبعة وبلا تنقّل.",
  alternates: { canonical: "/da3wa" },
};

/** Ce qui décide vraiment un invité tunisien : le prix, le délai, le partage. */
const ARGUMENTS = [
  { icon: Wallet, title: "أرخص من المطبعة", text: "300 كرط ورق يكلّفوك مئات الدنانير. الدعوة الرقمية ثابتة السعر، مهما كثروا ضيوفك." },
  { icon: Clock, title: "جاهزة في 24 ساعة", text: "بلا مواعيد، بلا تنقّل للمطبعة، بلا انتظار أسبوع باش تشوف نموذج." },
  { icon: MessageCircle, title: "تتبعث في واتساب", text: "رابط واحد يمشي لكل ضيوفك. يفتحوه في تليفوناتهم، ويأكّدوا حضورهم منّه." },
];

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function Da3waLandingPage({ searchParams }: Props) {
  const params = await searchParams;
  /* Un `ref` bricolé n'a rien à faire dans un cookie ni dans un message WhatsApp */
  const ref = isValidRef(params.ref) ? params.ref : undefined;

  return (
    <main className="min-h-screen">
      {ref && <RefCapture refId={ref} />}
      <Navbar />

      <section
        dir="rtl"
        className="relative overflow-hidden bg-[var(--color-cream)] pt-32 pb-20"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#FDF5F8] blur-[100px] rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[#FDF5F8] blur-[100px] rounded-tr-full" />
        </div>

        <div className="container-x relative z-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[var(--color-line)] text-xs sm:text-sm font-bold text-[var(--color-coral)] mb-7 shadow-sm">
            <Sparkles className="w-4 h-4" />
            الدعوة اللي شفتها تصنعت هنا
          </span>

          <h1
            className="text-4xl sm:text-6xl font-extrabold text-[var(--color-ink)] leading-[1.25] mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            عرسك قريب؟{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--color-coral)] to-[#B5952F]">
              دورك أنت الجاي
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-muted)] font-semibold leading-relaxed max-w-xl mx-auto mb-9">
            اختار تصميم من مجموعتنا، عمّر أسماءكم والتاريخ والمكان، وخوذ رابط دعوتك.
            تبعثه لضيوفك في واتساب، وهوما يأكّدوا حضورهم منّه مباشرة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#templates"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-coral)] text-[var(--color-coral-text)] text-sm font-extrabold hover:opacity-90 transition-opacity"
            >
              شوف التصاميم
            </a>
            <a
              href={whatsappUrlWithRef(ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-[var(--color-line)] text-[var(--color-ink)] text-sm font-extrabold hover:border-[var(--color-coral)] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              اسأل في واتساب
            </a>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs font-bold text-[var(--color-muted)]">
            {["بلا تطبيق يتنزّل", "تبديل غير محدود قبل الإرسال", "تأكيد الحضور مدمج"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[var(--color-coral)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section dir="rtl" className="bg-white py-20 border-y border-[var(--color-line)]">
        <div className="container-x max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARGUMENTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center md:text-right">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-velvet)] border border-[var(--color-line)] flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Icon className="w-5 h-5 text-[var(--color-coral)]" />
              </div>
              <h3
                className="text-lg font-extrabold text-[var(--color-ink)] mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-[var(--color-muted)] font-semibold leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Templates />
      <HowItWorks />
      <Pricing />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
