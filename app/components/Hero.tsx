"use client";

import { motion } from "framer-motion";
import { Sparkles, Diamond, ArrowLeft, ArrowRight, Star, Heart } from "lucide-react";
import Image from "next/image";
import { useLocale } from "./LocaleProvider";

export default function Hero() {
  const { t, locale } = useLocale();

  /* « Suivant » pointe vers la gauche en arabe et vers la droite en français. */
  const Forward = locale === "fr" ? ArrowRight : ArrowLeft;

  return (
    <>
      <section className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden bg-[var(--color-cream)] pt-24 pb-16">
        {/* Ambient Glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#FDF5F8] blur-[100px] rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[#FDF5F8] blur-[100px] rounded-tr-full pointer-events-none" />
        </div>

        <div className="container-x relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-6xl mx-auto">
          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-right mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white border border-[var(--color-line)] text-xs sm:text-sm font-bold text-[var(--color-coral)] mb-6 shadow-sm"
            >
              <Heart className="w-4 h-4 text-[var(--color-coral)] fill-[var(--color-coral)]" />
              <span className="tracking-wide">{t.hero.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[var(--color-ink)] leading-[1.2] mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.hero.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--color-coral)] to-[#B5952F]">
                {t.hero.titleLine2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[var(--color-muted)] max-w-lg mb-10 text-base sm:text-xl leading-relaxed font-semibold px-4 sm:px-0"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
            >
              <a
                href="#templates"
                onClick={(e) => {
                  const el = document.getElementById("templates");
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--color-coral)] text-white rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(139,10,26,0.2)] hover:shadow-[0_15px_25px_rgba(139,10,26,0.3)] hover:-translate-y-1 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.hero.ctaPrimary}</span>
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  const el = document.getElementById("pricing");
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
              >
                <span>{t.hero.ctaSecondary}</span>
                <Forward className="w-5 h-5" />
              </a>
            </motion.div>
          </div>

          {/* 3D Mockup Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
            className="relative w-full h-full min-h-[350px] sm:min-h-[400px] flex items-center justify-center pt-10"
            dir="ltr"
          >
            {/* The 3 Phones Container */}
            <div className="hero-mocks scale-[0.7] sm:scale-90 lg:scale-100 origin-center">
              {/* Left Phone */}
              <div className="hero-mock-card hero-mock-left bg-[#1C1318] border-[#2A1D24]">
                <div className="phone-screen bg-[#1C1318] flex flex-col relative overflow-hidden">
                  {/* Mock content representing a dark invitation */}
                  <div className="absolute inset-0 bg-[#0A1128]" />
                  <div className="relative z-10 flex flex-col items-center pt-12 p-4 text-center">
                    <span className="text-[#D4AF37] font-serif tracking-widest text-[10px] uppercase mb-4">Victoria & Sebastian</span>
                    <div className="w-full h-40 bg-white/10 rounded-md border border-[#D4AF37]/30 mb-4 p-1">
                      <div className="w-full h-full bg-cover bg-center rounded" style={{ backgroundImage: 'url(https://image.pollinations.ai/prompt/tunisian%20traditional%20old%20medina%20door%20with%20red%20and%20gold%20floral%20decor%204k?width=1080&height=1920&nologo=true)' }} />
                    </div>
                    <span className="text-[#D4AF37] text-[8px] tracking-[0.2em]">TOGETHER WITH THEIR FAMILIES</span>
                  </div>
                </div>
              </div>

              {/* Center Phone (Main) */}
              <div className="hero-mock-card hero-mock-center bg-[#FAF6F0] border-white z-[3]">
                <div className="phone-screen bg-[#FAF6F0] flex flex-col relative overflow-hidden items-center justify-center">
                  <div className="absolute inset-0 bg-white" />
                  <div className="relative z-10 flex flex-col items-center w-full p-4 text-center">
                    <div className="w-full h-48 bg-white shadow-md p-2 rounded-sm rotate-[-2deg] mb-6 border border-[#EFE4D6]">
                      <div className="w-full h-full bg-cover bg-center rounded-sm" style={{ backgroundImage: 'url(https://image.pollinations.ai/prompt/luxury%20tunisian%20blue%20and%20gold%20zellige%20tile%20pattern%204k%20highly%20detailed?width=1080&height=1920&nologo=true)' }} />
                    </div>
                    <span className="font-serif italic text-2xl text-[#1C1318] mb-1">Victoria</span>
                    <span className="font-serif italic text-[#6B5B65] text-sm mb-1">&</span>
                    <span className="font-serif italic text-2xl text-[#1C1318] mb-6">Sebastian</span>
                    <span className="text-xs font-medium tracking-widest text-[#1C1318]">24 · 08 · 26</span>
                  </div>
                </div>
              </div>

              {/* Right Phone */}
              <div className="hero-mock-card hero-mock-right bg-[#1C1318] border-[#2A1D24]">
                <div className="phone-screen bg-black flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://image.pollinations.ai/prompt/tunisian%20jasmin%20mashmoum%20and%20orange%20blossoms%20on%20soft%20fabric%204k%20elegant?width=1080&height=1920&nologo=true)' }} />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                    <span className="text-[#D4AF37] text-[8px] tracking-widest uppercase mb-2">24 · 08 · 2026</span>
                    <span className="font-serif text-xl text-white mb-1 tracking-wider uppercase">Victoria</span>
                    <span className="font-serif text-[#D4AF37] text-xs mb-1">&</span>
                    <span className="font-serif text-xl text-white mb-6 tracking-wider uppercase">Sebastian</span>
                    <span className="text-white/60 text-[7px] tracking-[0.2em] uppercase">Together with their families</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Tags (Hidden on very small screens to avoid overlap) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hidden sm:flex absolute top-[15%] sm:top-[20%] -left-6 sm:left-0 lg:-left-4 z-20 bg-white rounded-2xl shadow-xl border border-[var(--color-line)] py-3 px-4 items-center gap-3 scale-90 sm:scale-100"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-velvet)] flex items-center justify-center text-[var(--color-coral)]">
                <Heart className="w-5 h-5 fill-[var(--color-velvet)]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[var(--color-muted)]">RSVPs today</span>
                <span className="text-xl font-extrabold text-[var(--color-ink)]">+128</span>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="hidden sm:flex absolute bottom-[15%] sm:bottom-[10%] -right-6 sm:right-0 lg:-right-4 z-20 bg-white rounded-2xl shadow-xl border border-[var(--color-line)] py-3 px-5 flex-col text-left scale-90 sm:scale-100"
            >
              <span className="text-xs font-semibold text-[var(--color-muted)] mb-1">Your invite link</span>
              <span className="text-sm font-bold text-[var(--color-ink)] font-mono">farhty.me/<span className="text-[var(--color-coral)]">v&s</span></span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats Strip - Light Mode Revert */}
      <section className="relative z-30 -mt-10 sm:-mt-12 container-x pb-20">
        <div className="bg-white/90 backdrop-blur-xl border border-[var(--color-line)] rounded-[24px] sm:rounded-[32px] shadow-lg sm:shadow-xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[var(--color-line)] relative overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-0">
            <div className="flex items-center gap-2 text-[var(--color-coral)] font-extrabold text-3xl sm:text-4xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
              <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-coral)]" />
              <span>+1,200</span>
            </div>
            <span className="text-sm sm:text-base text-[var(--color-muted)] font-semibold">{t.hero.statWeddings}</span>
          </div>

          <div className="flex flex-col items-center justify-center pt-6 sm:pt-0">
            <div className="flex items-center gap-2 text-[var(--color-gold)] font-extrabold text-3xl sm:text-4xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
              <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-[var(--color-gold)] text-[var(--color-gold)]" />
              <span>4.98</span>
            </div>
            <span className="text-sm sm:text-base text-[var(--color-muted)] font-semibold">{t.hero.statRating}</span>
          </div>

          <div className="flex flex-col items-center justify-center pt-6 sm:pt-0">
            <div className="flex items-center gap-2 font-extrabold text-3xl sm:text-4xl mb-2 text-[var(--color-coral)]" style={{ fontFamily: "var(--font-display)" }}>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-coral)]" />
              <span>VIP</span>
            </div>
            <span className="text-sm sm:text-base text-[var(--color-muted)] font-semibold">{t.hero.statRsvp}</span>
          </div>
        </div>
      </section>
    </>
  );
}
