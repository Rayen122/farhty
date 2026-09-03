"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Sparkles,
  Crown,
  Gem,
  UtensilsCrossed,
  Music4,
  Check,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Template } from "../data";
import { mapsLinkFor, mapsEmbedFor } from "../data";
import { FarhtyLink } from "../../components/FarhtyCredit";

// Palette Émeraude Royale & Or
const EMERALD_DARK = "#021F18";
const EMERALD_MID = "#063B2F";
const EMERALD_LIGHT = "#0E5A48";
const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const GOLD_DARK = "#9C7D22";

const goldGradientText: React.CSSProperties = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, ${GOLD_DARK} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

/* ── Sceau de cire d'or royal avec couronne ── */
function GoldCrownSeal({ onClick, glowing = false }: { onClick?: () => void; glowing?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer group focus:outline-none"
      aria-label="فتح الدعوة الملكية"
    >
      {/* Halo lumineux */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-4 rounded-full blur-xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD_LIGHT} 0%, transparent 70%)` }}
      />

      <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10 filter drop-shadow-2xl">
        <defs>
          <linearGradient id="sealGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="35%" stopColor={GOLD_LIGHT} />
            <stop offset="70%" stopColor={GOLD} />
            <stop offset="100%" stopColor={GOLD_DARK} />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Contour sceau de cire bord festonné */}
        <path
          d="M60 6 L67 15 L78 11 L82 22 L93 21 L93 32 L104 36 L100 47 L110 54 L103 63 L111 72 L101 79 L106 90 L95 94 L96 106 L85 106 L82 117 L71 113 L64 122 L56 116 L48 123 L42 113 L31 116 L31 105 L19 104 L22 93 L12 88 L18 78 L9 69 L18 60 L10 50 L21 44 L19 33 L30 31 L31 20 L42 22 L45 11 L56 15 Z"
          fill="url(#sealGold)"
          stroke="#7A6016"
          strokeWidth="1.5"
        />

        {/* Cercle intérieur embossé */}
        <circle cx="60" cy="60" r="42" fill="none" stroke="#7A6016" strokeWidth="1.2" opacity="0.6" />
        <circle cx="60" cy="60" r="39" fill="none" stroke="#FFF2A8" strokeWidth="0.8" opacity="0.8" />

        {/* Couronne gravée au centre */}
        <g fill="none" stroke="#523E0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M42 66 L46 48 L54 58 L60 42 L66 58 L74 48 L78 66 Z" fill="#7A6016" opacity="0.25" />
          <path d="M42 66 L46 48 L54 58 L60 42 L66 58 L74 48 L78 66 Z" />
          <line x1="40" y1="70" x2="80" y2="70" strokeWidth="3" />
        </g>
        <circle cx="46" cy="46" r="2.5" fill="#523E0A" />
        <circle cx="60" cy="40" r="3" fill="#523E0A" />
        <circle cx="74" cy="46" r="2.5" fill="#523E0A" />
      </svg>
    </motion.button>
  );
}

/* ── Cadre en marbre et filigrane d'or ── */
function EmeraldGoldFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-6 md:p-10 rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl backdrop-blur-md bg-gradient-to-b from-[#063B2F]/90 via-[#021F18]/95 to-[#011410]/95">
      {/* Coin ornemental haut gauche */}
      <svg className="absolute top-3 left-3 w-12 h-12 text-[#D4AF37]/60 pointer-events-none" viewBox="0 0 50 50">
        <path d="M2,2 L48,2 M2,2 L2,48 M2,10 L10,2 M2,18 L18,2 M2,26 L26,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>

      {/* Coin ornemental haut droit */}
      <svg className="absolute top-3 right-3 w-12 h-12 text-[#D4AF37]/60 pointer-events-none transform scale-x-[-1]" viewBox="0 0 50 50">
        <path d="M2,2 L48,2 M2,2 L2,48 M2,10 L10,2 M2,18 L18,2 M2,26 L26,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>

      {/* Coin ornemental bas gauche */}
      <svg className="absolute bottom-3 left-3 w-12 h-12 text-[#D4AF37]/60 pointer-events-none transform scale-y-[-1]" viewBox="0 0 50 50">
        <path d="M2,2 L48,2 M2,2 L2,48 M2,10 L10,2 M2,18 L18,2 M2,26 L26,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>

      {/* Coin ornemental bas droit */}
      <svg className="absolute bottom-3 right-3 w-12 h-12 text-[#D4AF37]/60 pointer-events-none transform scale-[-1]" viewBox="0 0 50 50">
        <path d="M2,2 L48,2 M2,2 L2,48 M2,10 L10,2 M2,18 L18,2 M2,26 L26,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>

      {children}
    </div>
  );
}

/* ── Séparateur doré émeraude ── */
function EmeraldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
      <div className="rotate-45 w-2.5 h-2.5 bg-[#D4AF37] shadow-sm border border-[#F5D061]" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
    </div>
  );
}

const TIMELINE_ICONS = [Crown, Gem, UtensilsCrossed, Music4];

export default function EmeraudeRoyale({ template }: { template: Template }) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = template.previewText;

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 120);
    target.setHours(20, 0, 0, 0);
    const interval = setInterval(() => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setOpened(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#011410] text-[#E6F4F0] font-sans overflow-x-hidden relative selection:bg-[#D4AF37] selection:text-[#021F18]">
      {/* Texture de fond effet marbre vert sombre & dorures */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top,#0E5A48_0%,transparent_50%),radial-gradient(circle_at_bottom,#021F18_0%,#011410_100%)] z-0" />

      {/* Particules scintillantes d'or en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#F5D061]"
            style={{
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.3 + (i % 5) * 0.1,
            }}
            animate={{
              y: [-10, 15, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 5) * 0.4,
            }}
          />
        ))}
      </div>

      {/* OVERLAY D'OUVERTURE : ENVELOPPE & SCEAU ROYAL */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.9, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#021F18] via-[#063B2F] to-[#011410] px-4"
          >
            {/* Vidéo de fond hero si présente */}
            {template.video && (
              <video
                ref={videoRef}
                src={template.video}
                playsInline
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
              />
            )}

            <div className="relative z-10 text-center max-w-md w-full">
              {/* Carte enveloppe fermée */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-b from-[#063B2F] to-[#021F18] p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F5D061] to-transparent" />

                <Crown className="w-10 h-10 text-[#D4AF37] mx-auto mb-4 animate-pulse" />

                <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
                  دعوة زفاف ملكية
                </span>

                <h1 className="font-serif text-3xl md:text-4xl text-white font-light tracking-wide mb-6">
                  {t.bride} &amp; {t.groom}
                </h1>

                <p className="text-xs text-[#E6F4F0]/70 mb-8 leading-relaxed font-light">
                  انقر على السطح الذهبي لفتح المظروف الملكي والاستمتاع بتفاصيل الحفل
                </p>

                {/* Sceau d'or cliquable */}
                <div className="flex justify-center my-4">
                  <GoldCrownSeal onClick={handleOpen} glowing />
                </div>

                <p className="text-[11px] text-[#D4AF37]/80 mt-6 font-medium animate-pulse">
                  إضغط لفتح الدعوة ✉️
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE PRINCIPALE DE L'INVITATION */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Navigation flottante retour */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button
            onClick={() => router.push("/#templates")}
            className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#F5D061] transition-all bg-[#063B2F]/60 px-4 py-2 rounded-full border border-[#D4AF37]/30 backdrop-blur-md cursor-pointer"
          >
            <ArrowLeft size={16} /> الرجوع للقوالب
          </button>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Crown size={18} />
            <span className="text-xs font-serif tracking-widest uppercase">{template.name}</span>
          </div>
        </div>

        {/* HERO CARD PRINCIPALE */}
        <EmeraldGoldFrame>
          <div className="text-center relative py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={opened ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Crown className="w-12 h-12 text-[#F5D061] mx-auto mb-4 filter drop-shadow" />
              <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-semibold mb-4">
                بسم الله الرحمن الرحيم
              </p>

              {/* Verset du Coran si disponible */}
              {t.quranVerse ? (
                <blockquote className="text-sm md:text-base text-[#F5D061]/90 font-serif italic max-w-lg mx-auto mb-8 leading-relaxed">
                  « {t.quranVerse} »
                </blockquote>
              ) : (
                <blockquote className="text-sm md:text-base text-[#F5D061]/90 font-serif italic max-w-lg mx-auto mb-8 leading-relaxed">
                  « وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً »
                </blockquote>
              )}

              <EmeraldDivider />

              <span className="text-xs uppercase tracking-[0.3em] text-[#E6F4F0]/60 block my-4">
                يتشرفان بدعوتكم لحضور حفل زفافهما
              </span>

              {/* Noms des Mariés */}
              <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 my-4" style={goldGradientText}>
                {t.bride}
              </h1>
              <span className="block text-3xl font-serif text-[#D4AF37] italic my-1">&amp;</span>
              <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-8" style={goldGradientText}>
                {t.groom}
              </h1>

              <EmeraldDivider />

              {/* Date, Heure & Lieu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center text-sm font-medium">
                <div className="bg-[#021F18]/80 p-4 rounded-2xl border border-[#D4AF37]/20 flex flex-col items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#D4AF37] mb-1" />
                  <span className="text-xs text-[#E6F4F0]/60">التاريخ</span>
                  <span className="text-white font-semibold text-base mt-0.5">{t.date}</span>
                </div>
                <div className="bg-[#021F18]/80 p-4 rounded-2xl border border-[#D4AF37]/20 flex flex-col items-center justify-center">
                  <Clock className="w-5 h-5 text-[#D4AF37] mb-1" />
                  <span className="text-xs text-[#E6F4F0]/60">التوقيت</span>
                  <span className="text-white font-semibold text-base mt-0.5">{t.time}</span>
                </div>
                <div className="bg-[#021F18]/80 p-4 rounded-2xl border border-[#D4AF37]/20 flex flex-col items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D4AF37] mb-1" />
                  <span className="text-xs text-[#E6F4F0]/60">المكان</span>
                  <span className="text-white font-semibold text-base mt-0.5">{t.lieu} - {t.city}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </EmeraldGoldFrame>

        {/* BLOC COMPTE À REBOURS */}
        <section className="my-12">
          <div className="bg-gradient-to-r from-[#063B2F] via-[#021F18] to-[#063B2F] p-8 rounded-3xl border border-[#D4AF37]/30 shadow-xl text-center">
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-6">
              عدّ تنازلي لليوم الكبير ⏳
            </h3>
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {[
                { label: "يوم", value: countdown.days },
                { label: "ساعة", value: countdown.hours },
                { label: "دقيقة", value: countdown.minutes },
                { label: "ثانية", value: countdown.seconds },
              ].map((item, i) => (
                <div key={i} className="bg-[#011410]/90 p-3 md:p-5 rounded-2xl border border-[#D4AF37]/20">
                  <span className="block text-2xl md:text-4xl font-serif font-bold text-[#F5D061]" style={goldGradientText}>
                    {item.value}
                  </span>
                  <span className="text-[10px] md:text-xs text-[#E6F4F0]/60 uppercase tracking-widest mt-1 block">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HISTOIRE & PROGRAMME */}
        {t.story && t.story.length > 0 && (
          <section className="my-12">
            <EmeraldGoldFrame>
              <h2 className="text-center font-serif text-3xl text-white mb-2" style={goldGradientText}>
                قصة حبنا
              </h2>
              <p className="text-center text-xs text-[#D4AF37] tracking-widest uppercase mb-8">
                محطات في رحلتنا السعيدة
              </p>
              <div className="space-y-6">
                {t.story.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-[#021F18]/60 p-4 rounded-2xl border border-[#D4AF37]/15">
                    <div className="w-10 h-10 rounded-full bg-[#063B2F] border border-[#D4AF37] flex items-center justify-center text-[#F5D061] font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-[#E6F4F0]/80 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </EmeraldGoldFrame>
          </section>
        )}

        {/* PROGRAMME DE LA SOIRÉE */}
        {t.program && t.program.length > 0 && (
          <section className="my-12">
            <EmeraldGoldFrame>
              <h2 className="text-center font-serif text-3xl text-white mb-2" style={goldGradientText}>
                برنامج الاحتفال
              </h2>
              <p className="text-center text-xs text-[#D4AF37] tracking-widest uppercase mb-8">
                أوقات الفقرات والمراسم
              </p>
              <div className="space-y-4">
                {t.program.map((item, idx) => {
                  const Icon = TIMELINE_ICONS[idx % TIMELINE_ICONS.length];
                  return (
                    <div key={idx} className="flex items-center gap-4 bg-[#021F18]/80 p-4 rounded-2xl border border-[#D4AF37]/20">
                      <div className="px-3 py-1.5 rounded-xl bg-[#063B2F] border border-[#D4AF37]/40 text-[#F5D061] text-xs font-bold shrink-0">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base">{item.title}</h4>
                        {item.desc && <p className="text-xs text-[#E6F4F0]/70 mt-0.5">{item.desc}</p>}
                      </div>
                      <Icon className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    </div>
                  );
                })}
              </div>
            </EmeraldGoldFrame>
          </section>
        )}

        {/* CARTE & LOCALISATION GOOGLE MAPS */}
        <section className="my-12">
          <EmeraldGoldFrame>
            <h3 className="text-center font-serif text-2xl text-white mb-2" style={goldGradientText}>
              موقع الحفل
            </h3>
            <p className="text-center text-xs text-[#E6F4F0]/70 mb-6">
              {t.lieu} — {t.city}
            </p>
            <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 h-64 mb-6 shadow-inner">
              <iframe
                title="Map"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
                loading="lazy"
                allowFullScreen
                src={mapsEmbedFor(template)}
              />
            </div>
            <div className="text-center">
              <a
                href={mapsLinkFor(template)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#021F18] font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                <MapPin size={16} /> فتح في Google Maps
              </a>
            </div>
          </EmeraldGoldFrame>
        </section>

        {/* CONFIRMATION DE PRÉSENCE (RSVP) */}
        {!t.hideRsvp && (
          <section className="my-12">
            <div className="bg-gradient-to-b from-[#063B2F] to-[#021F18] p-8 rounded-3xl border border-[#D4AF37]/40 text-center shadow-2xl">
              <h3 className="font-serif text-2xl text-white mb-2" style={goldGradientText}>
                تأكيد الحضور (RSVP)
              </h3>
              <p className="text-xs text-[#E6F4F0]/70 mb-6">
                يسعدنا تأكيد حضوركم لمشاركتنا فرحتنا
              </p>

              {rsvpSubmitted ? (
                <div className="p-4 bg-[#021F18] rounded-2xl border border-[#D4AF37]/40 text-[#F5D061] text-sm font-semibold flex items-center justify-center gap-2">
                  <Check size={18} /> تم تسجيل إجابتكم بنجاح. شكراً لكم!
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setRsvpSubmitted(true)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#021F18] font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    يشرفني الحضور ✨
                  </button>
                  <button
                    onClick={() => setRsvpSubmitted(true)}
                    className="px-6 py-3 rounded-full bg-[#021F18] text-[#E6F4F0]/80 font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer"
                  >
                    أعتذر عن الحضور
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FOOTER & CRÉDITS */}
        <footer className="text-center py-8 border-t border-[#D4AF37]/20 mt-16 text-xs text-[#E6F4F0]/40">
          <p className="mb-2">
            دعوة رقمية فاخرة تصمّمت بـ ❤️ عبر <FarhtyLink className="text-[#D4AF37] underline hover:text-[#F5D061]" />
          </p>
          <p>© {new Date().getFullYear()} Farhty. Tous droits réservés.</p>
        </footer>
      </div>
    </main>
  );
}
