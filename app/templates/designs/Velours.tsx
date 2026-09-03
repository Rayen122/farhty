"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  GlassWater,
  Gem,
  UtensilsCrossed,
  Music4,
  Check,
  MailOpen,
  Sparkles,
  Share2,
  Heart,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import type { Template } from "../data";
import { FarhtyLink } from "../../components/FarhtyCredit";

const BURGUNDY = "#33090E";
const BURGUNDY_LIGHT = "#4A0E14";
const BURGUNDY_DARK = "#1E0407";

/* Ornate lace frame (SVG, drawn) */
function LaceFrame({ gold, children }: { gold: string; children: React.ReactNode }) {
  return (
    <div className="relative p-5">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 380" preserveAspectRatio="none" aria-hidden>
        <rect x="8" y="8" width="284" height="364" fill="none" stroke={gold} strokeWidth="0.8" opacity="0.8" />
        <rect x="14" y="14" width="272" height="352" fill="none" stroke={gold} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.7" />
        {/* corner flourishes */}
        {[
          [8, 8, 0], [292, 8, 90], [292, 372, 180], [8, 372, 270],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x}, ${y}) rotate(${r})`}>
            <path d="M0,0 C14,2 18,8 20,20 M0,0 C2,14 8,18 20,20" stroke={gold} strokeWidth="0.8" fill="none" opacity="0.9" />
            <circle cx="10" cy="10" r="1.5" fill={gold} opacity="0.8" />
          </g>
        ))}
        {/* scalloped edge dots */}
        {Array.from({ length: 13 }, (_, i) => (
          <circle key={`t${i}`} cx={30 + i * 20} cy="8" r="1" fill={gold} opacity="0.5" />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <circle key={`b${i}`} cx={30 + i * 20} cy="372" r="1" fill={gold} opacity="0.5" />
        ))}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

const TIMELINE_ICONS = [GlassWater, Gem, UtensilsCrossed, Music4];

export default function Velours({ template }: { template: Template }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  const gold = template.secondary || "#D9B98A";
  const t = template.previewText;

  const handleOpenEnvelope = () => {
    if (phase !== "closed") return;
    setPhase("opening");

    setTimeout(() => {
      setPhase("opened");
    }, 1800);
  };

  return (
    <main dir="rtl"
      className="min-h-screen text-white relative overflow-x-hidden selection:bg-[#D9B98A]/30 selection:text-[#FFF]"
      style={{ background: `linear-gradient(175deg, ${BURGUNDY} 0%, ${BURGUNDY_LIGHT} 50%, #240609 100%)` }}
    >
      {/* ========================================================= */}
      {/* 3D PREMIUM VELVET ENVELOPE INTRO OVERLAY WITH FRAMER MOTION*/}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="velours-envelope-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
            style={{
              background: "radial-gradient(circle at center, #4A0E14 0%, #2B070B 60%, #150204 100%)",
            }}
          >
            {/* Ambient Gold Aura */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-30"
              style={{
                background: `radial-gradient(circle, ${gold}55 0%, rgba(74,14,20,0) 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Gold Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: gold,
                    boxShadow: `0 0 10px ${gold}`,
                    top: `${(i * 17) % 95}%`,
                    left: `${(i * 23) % 95}%`,
                  }}
                  animate={{
                    y: [-15, -45, -15],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.7, 1.3, 0.7],
                  }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    delay: (i * 0.4) % 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Main 3D Envelope Stage */}
            <div className="relative w-[92vw] max-w-[450px] h-[330px] md:h-[370px] perspective-1200 flex items-center justify-center">

              {/* INNER INVITATION CARD (Glides UP when flap opens) */}
              <motion.div
                initial={{ y: 20, scale: 0.95, opacity: 0 }}
                animate={
                  phase === "opening"
                    ? { y: -155, scale: 1.02, opacity: 1 }
                    : { y: 20, scale: 0.95, opacity: 0 }
                }
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="absolute z-10 w-[88%] h-[270px] md:h-[300px] rounded-2xl p-6 text-center shadow-2xl flex flex-col justify-between overflow-hidden"
                style={{
                  background: "linear-gradient(150deg, #FBF8F3 0%, #F3EBDD 100%)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                }}
              >
                {/* Decorative Inner Lace Border */}
                <div className="absolute inset-2 border border-[#D9B98A]/50 rounded-xl pointer-events-none" />
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D9B98A]" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D9B98A]" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D9B98A]" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D9B98A]" />

                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#4A0E14] font-serif font-semibold">
                    دعوة راقية
                  </span>
                  <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#D9B98A] to-transparent mx-auto mt-1" />
                </div>

                <div>
                  <h2 className="font-script text-4xl md:text-5xl text-[#4A0E14] leading-tight">
                    {t.bride} <span className="text-[#D9B98A] font-serif text-2xl">&amp;</span> {t.groom}
                  </h2>
                  <p className="font-serif italic text-xs text-[#5C2B30] mt-2">
                    {t.date} · {t.city}
                  </p>
                </div>

                <div className="pb-1 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0E14]/10 border border-[#D9B98A]/40 text-[#4A0E14] text-[11px] font-serif font-medium">
                    <Sparkles size={12} className="text-[#D9B98A]" /> استقبال واحتفال
                  </span>
                </div>
              </motion.div>

              {/* ENVELOPE BACK BODY */}
              <div
                className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden border border-[#D9B98A]/30"
                style={{
                  background: "linear-gradient(150deg, #3D0B10 0%, #2B070B 60%, #1A0306 100%)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(217, 185, 138, 0.2)",
                }}
              >
                {/* Diagonal bottom shadow folds */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 300">
                  <polygon points="0,0 200,165 0,300" fill="#2B070B" opacity="0.9" />
                  <polygon points="0,0 200,165 0,300" fill="url(#veloursLeftShadow)" />
                  <polygon points="400,0 200,165 400,300" fill="#240508" opacity="0.8" />
                  <polygon points="400,0 200,165 400,300" fill="url(#veloursRightShadow)" />
                  <polygon points="0,300 200,150 400,300" fill="#36090E" />
                  <path d="M0,300 L200,150 L400,300" fill="none" stroke="#D9B98A" strokeWidth="1" strokeOpacity="0.4" />

                  <defs>
                    <linearGradient id="veloursLeftShadow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#D9B98A" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#1A0306" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="veloursRightShadow" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D9B98A" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#150204" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>

              {/* ENVELOPE TOP FLAP (Rotates 180deg open on X-axis) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={phase !== "closed" ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
                className="absolute top-0 left-0 right-0 h-1/2 z-30 preserve-3d"
                style={{
                  transformOrigin: "top center",
                }}
              >
                {/* Front of flap (visible when closed) */}
                <div className="absolute inset-0 backface-hidden">
                  <svg className="w-full h-full filter drop-shadow-lg" preserveAspectRatio="none" viewBox="0 0 400 180">
                    <polygon points="0,0 400,0 200,165" fill="#4A0E14" />
                    <polyline points="0,0 200,165 400,0" fill="none" stroke="#D9B98A" strokeWidth="1.5" strokeOpacity="0.8" />
                    <polyline points="10,0 200,155 390,0" fill="none" stroke="#D9B98A" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  </svg>
                </div>

                {/* Back of flap (visible when open) */}
                <div
                  className="absolute inset-0 backface-hidden"
                  style={{ transform: "rotateX(180deg)" }}
                >
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 180">
                    <polygon points="0,0 400,0 200,165" fill="#2B070B" />
                    <polyline points="0,0 200,165 400,0" fill="none" stroke="#D9B98A" strokeWidth="1" strokeOpacity="0.4" />
                  </svg>
                </div>
              </motion.div>

              {/* CENTRAL WAX SEAL MEDALLION ("Y & S" Monogram) */}
              <motion.div
                initial={{ scale: 1, opacity: 1, y: 0 }}
                animate={
                  phase !== "closed"
                    ? { scale: 1.5, opacity: 0, y: -40, filter: "blur(6px)" }
                    : { scale: 1, opacity: 1, y: 0 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute z-40 cursor-pointer top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                role="button"
                tabIndex={0}
                aria-label="افتح الدعوة"
                onClick={handleOpenEnvelope}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenEnvelope();
                  }
                }}
              >
                {/* Glow aura */}
                <motion.div
                  className="absolute w-24 h-24 rounded-full bg-[#D9B98A]/25 blur-md pointer-events-none"
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Wax Seal Medallion */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative w-20 h-20 md:w-22 md:h-22 rounded-full flex items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.8)] border-2 border-[#FFE8C2]"
                  style={{
                    background: "radial-gradient(circle at 35% 30%, #FFE5B4 0%, #D9B98A 40%, #9E7D4E 75%, #594220 100%)",
                  }}
                >
                  <div className="absolute inset-1.5 rounded-full border border-[#FFF5D6]/60 pointer-events-none" />
                  <div className="absolute inset-3 rounded-full border border-[#3D260D]/30 pointer-events-none" />

                  <div className="text-center px-1">
                    <span
                      className="font-script text-2xl md:text-3xl text-[#33090E] block leading-none font-bold"
                      style={{
                        textShadow: "0 1px 1px rgba(255, 235, 190, 0.8), 0 -1px 1px rgba(30, 0, 5, 0.6)",
                      }}
                    >
                      {t.bride[0]} &amp; {t.groom[0]}
                    </span>
                  </div>
                </motion.div>

                {/* Action hint */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D9B98A]/50 text-[#F5E8D3] text-[11px] font-serif tracking-[0.2em] uppercase shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-[#D9B98A] animate-spin" style={{ animationDuration: "5s" }} />
                  <span>افتح الدعوة</span>
                </motion.div>
              </motion.div>

            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[#D9B98A]/60 font-serif text-xs uppercase tracking-widest">
              عرس {t.bride} &amp; {t.groom} · مجموعة فيلور
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MAIN VELOURS PAGE CONTENT                                 */}
      {/* ========================================================= */}

      {/* Navigation Header */}
      <motion.div
        initial={{ y: -80 }}
        animate={phase === "opened" ? { y: 0 } : { y: -80 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#1E0407]/80 backdrop-blur-md border-b border-[#D9B98A]/20"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/#modeles")}
            aria-label="Retour aux modèles"
            className="flex items-center gap-2 text-white/80 hover:text-white text-xs uppercase tracking-wider font-serif cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">رجوع للنماذج</span>
          </button>

          <div className="text-center">
            <span className="font-script text-2xl text-[#D9B98A] block leading-none">
              {t.bride} &amp; {t.groom}
            </span>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `عرس ${t.bride} & ${t.groom}`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Lien d'invitation copié !");
              }
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
            title="Partager"
          >
            <Share2 size={16} />
          </button>
        </div>
      </motion.div>

      {/* subtle vignette + texture */}
      <div className="pointer-events-none fixed inset-0 z-10" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} aria-hidden />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 z-20">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.55em" }}
          transition={{ duration: 1.4 }}
          className="text-[10px] md:text-xs uppercase text-white/50 mb-10"
        >
          نعزموكم على عرس
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="w-64 md:w-72">
          <LaceFrame gold={gold}>
            {/* B&W photo placeholder */}
            <div
              className="aspect-[3/4] flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(150deg, #4B4B4B 0%, #262626 60%, #111 100%)" }}
            >
              <div className="text-center relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-white/90 flex items-center justify-center overflow-hidden p-3">
                  <img src="/images/logo1.webp" alt="Farhty" className="w-full h-full object-contain" />
                </div>
                <p className="text-[9px] uppercase tracking-[0.45em] text-white/40 mt-3">تصويرتكم</p>
              </div>
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 55%)" }} />
            </div>
          </LaceFrame>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="font-script mt-10 text-center leading-tight"
          style={{ color: gold, fontSize: "clamp(3rem, 9vw, 5.5rem)" }}
        >
          {t.bride} &amp; {t.groom}
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="mt-6 flex items-center gap-4 text-white/60">
          <span className="w-10 h-px bg-white/25" />
          <p className="font-serif-elegant text-lg tracking-wide">
            {t.date} · {t.city}
          </p>
          <span className="w-10 h-px bg-white/25" />
        </motion.div>
      </section>

      {/* ── Mot des mariés ── */}
      <section className="py-24 px-6 text-center z-20 relative">
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
          className="max-w-lg mx-auto font-serif-elegant text-xl md:text-2xl italic text-white/75 leading-relaxed"
        >
          « في هاذيك الليلة، تحت أضواء {t.city}، فهمنا بلي دروبنا ما عادتش تفترق.
          يشرفنا برشا نشوفوكم معانا. »
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="font-script text-3xl mt-8"
          style={{ color: gold }}
        >
          بكلّ حبّ
        </motion.p>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 px-6 z-20 relative">
        <div className="max-w-md mx-auto">
          <h2 className="font-script text-5xl text-center mb-16" style={{ color: gold }}>
            سهرتنا
          </h2>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2" style={{ background: `linear-gradient(180deg, transparent, ${gold}66 15%, ${gold}66 85%, transparent)` }} />
            <div className="space-y-14">
              {t.program.map((p, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                const left = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: left ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7 }}
                    className={`relative flex items-center gap-6 ${left ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${left ? "text-right" : "text-left"}`}>
                      <p className="font-serif-elegant text-2xl" style={{ color: gold }}>{p.time}</p>
                      <h3 className="font-serif-elegant text-xl text-white/90 mt-1">{p.title}</h3>
                      <p className="text-xs text-white/45 mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ borderColor: `${gold}88`, backgroundColor: BURGUNDY }}
                    >
                      <Icon size={18} style={{ color: gold }} strokeWidth={1.4} />
                    </div>
                    <div className="flex-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lieu ── */}
      <section className="py-24 px-6 text-center z-20 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4">المكان</p>
          <h2 className="font-serif-elegant text-4xl md:text-5xl" style={{ color: gold }}>
            {t.lieu}
          </h2>
          <p className="text-white/55 mt-3 font-serif-elegant text-lg">
            {t.city} · {t.time}
          </p>
        </motion.div>
      </section>

      {/* ── RSVP enveloppe ── */}
      {!t.hideRsvp && (
      <section className="py-28 px-6 text-center z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm mx-auto"
        >
          {!rsvpOpen ? (
            <button
              onClick={() => setRsvpOpen(true)}
              className="group mx-auto block cursor-pointer"
              aria-label="افتح تأكيد الحضور"
            >
              {/* envelope */}
              <div className="relative w-72 h-44 mx-auto rounded-md shadow-2xl transition-transform duration-300 group-hover:-translate-y-1.5" style={{ backgroundColor: "#F3EBDD" }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 176" aria-hidden>
                  <path d="M0,0 L144,86 L288,0" fill="none" stroke="#D8CCB6" strokeWidth="1.5" />
                </svg>
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <span className="font-script text-4xl" style={{ color: BURGUNDY_LIGHT }}>
                    أكّدو حضوركم
                  </span>
                </div>
                <div
                  className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-lg overflow-hidden p-1.5 bg-white/95"
                >
                  <img src="/images/logo1.webp" alt="Farhty" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/50 flex items-center justify-center gap-2">
                <MailOpen size={13} /> المس باش تجاوب
              </p>
            </button>
          ) : !rsvpDone ? (
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="font-serif-elegant text-2xl mb-6" style={{ color: gold }}>
                أكّدو حضوركم
              </h3>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setRsvpDone(true)}
                  className="px-7 py-3 rounded-full text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer"
                  style={{ backgroundColor: gold, color: BURGUNDY }}
                >
                  باش نكون
                </button>
                <button
                  onClick={() => setRsvpDone(true)}
                  className="px-7 py-3 rounded-full text-sm border border-white/25 text-white/70 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                >
                  للأسف لا
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-white/80">
              <Check size={18} style={{ color: gold }} /> الجواب توصّل، شكراً!
            </motion.div>
          )}
        </motion.div>
      </section>
      )}

      <footer className="py-10 text-center text-xs text-white/25 z-20 relative">
        <p className="font-script text-2xl mb-2" style={{ color: `${gold}AA` }}>
          {t.bride} &amp; {t.groom}
        </p>
        دعوة رقمية من{" "}
        <FarhtyLink className="underline hover:text-white/50 transition-colors" />
      </footer>
    </main>
  );
}
