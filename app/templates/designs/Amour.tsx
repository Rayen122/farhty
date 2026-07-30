"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Share2,
  Check,
  ChevronDown,
  Sparkles,
  Music,
  VolumeX,
  Send,
  Navigation,
} from "lucide-react";
import type { Template } from "../data";

interface AmourProps {
  template: Template;
}

export default function Amour({ template }: AmourProps) {
  const router = router_or_fallback();
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const [guestWishes, setGuestWishes] = useState([
    { name: "Sonia & Karim", text: "Qu'Allah bénisse votre union d'amour et de miséricorde !", date: "Hier" },
    { name: "Youssef B.", text: "Tous nos vœux de bonheur pour cette nouvelle étape de vie !", date: "Il y a 2 jours" },
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishAdded, setWishAdded] = useState(false);

  const t = template.previewText;

  // Countdown timer
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 58);
    target.setHours(18, 0, 0, 0);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenEnvelope = () => {
    if (phase !== "closed") return;
    setPhase("opening");

    setTimeout(() => {
      setPhase("opened");
    }, 1700);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishText.trim()) return;
    setGuestWishes((prev) => [
      { name: newWishName.trim(), text: newWishText.trim(), date: "À l'instant" },
      ...prev,
    ]);
    setNewWishName("");
    setNewWishText("");
    setWishAdded(true);
    setTimeout(() => setWishAdded(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#2C2621] overflow-x-hidden selection:bg-[#F3E2C8] selection:text-[#3D2F17]">
      {/* ========================================================= */}
      {/* 4K ULTRA-REALISTIC 3D GATEFOLD ENVELOPE INTRO OVERLAY     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="gatefold-4k-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
            style={{
              background: "radial-gradient(ellipse at center, #FFF8EF 0%, #F5E6CF 50%, #E8D3B5 100%)",
            }}
          >
            {/* Ambient Gold & Red Aura */}
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(212,168,90,0.6) 0%, rgba(184,29,40,0.15) 50%, rgba(0,0,0,0) 80%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Gold Sparkle Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#E5B560] shadow-[0_0_10px_#D4A24E]"
                  style={{
                    top: `${(i * 17) % 95}%`,
                    left: `${(i * 23) % 95}%`,
                  }}
                  animate={{
                    y: [-20, -50, -20],
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.6, 1.4, 0.6],
                  }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    delay: (i * 0.3) % 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* MAIN 4K GATEFOLD CARD STAGE */}
            <div className="relative w-[92vw] max-w-[460px] h-[620px] max-h-[88vh] perspective-1200 flex items-center justify-center">

              {/* REVEALED INNER CARD (Behind the doors, unveiled when doors open) */}
              <motion.div
                initial={{ scale: 0.96, opacity: 0.85 }}
                animate={phase === "opening" ? { scale: 1, opacity: 1 } : { scale: 0.96, opacity: 0.85 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-3xl p-6 sm:p-8 text-center bg-[#FFFDF9] border-2 border-[#D4A24E]/50 shadow-2xl flex flex-col justify-between overflow-hidden"
                style={{
                  boxShadow: "0 25px 60px rgba(74, 52, 18, 0.3)",
                }}
              >
                {/* Decorative Inner Gold Corner Frame */}
                <div className="absolute inset-3 border border-[#D4A24E]/30 rounded-2xl pointer-events-none" />
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#C59B58]" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#C59B58]" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#C59B58]" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#C59B58]" />

                {/* Top Ayat Header Section */}
                <div className="pt-3 px-2">
                  <span className="text-[11px] uppercase tracking-[0.45em] text-[#B81D28] font-serif font-bold block mb-2">
                    بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </span>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C59B58] to-transparent mx-auto mb-3" />

                  {/* Quranic Ayat Calligraphy Text */}
                  <p className="font-serif text-lg sm:text-xl text-[#871822] leading-relaxed font-bold tracking-wide">
                    ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
                  </p>

                  <p className="font-serif italic text-[11px] sm:text-xs text-[#7A6038] mt-2 max-w-xs mx-auto leading-normal">
                    « Et parmi Ses signes Il a créé de vous, pour vous, des épouses afin que vous trouviez auprès d'elles le repos, et Il a établi entre vous de l'amour et de la miséricorde. »
                  </p>
                  <span className="text-[9px] uppercase tracking-widest text-[#B81D28]/70 block mt-1 font-serif font-medium">
                    (Sourate Ar-Rum · Verset 21)
                  </span>
                </div>

                {/* Middle Couple Announcement */}
                <div className="my-auto py-2">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C59B58] to-transparent mx-auto mb-3" />
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#9E7D42] font-serif">
                    Invitation au عرس
                  </p>
                  <h1 className="font-script text-5xl sm:text-6xl text-[#684C1C] my-1 leading-tight">
                    {t.bride} <span className="text-[#B81D28] font-serif text-2xl">&amp;</span> {t.groom}
                  </h1>
                  <p className="font-serif text-xs text-[#7A6038] tracking-wide mt-1">
                    {t.date} · {t.lieu}, {t.city}
                  </p>
                </div>

                {/* Bottom Welcome Badge */}
                <div className="pb-2 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FCEEE6] border border-[#B81D28]/30 text-[#871822] text-xs font-serif font-medium shadow-xs">
                    <Sparkles size={13} className="text-[#B81D28]" /> Bienvenue à notre célébration
                  </span>
                </div>
              </motion.div>

              {/* LEFT DOOR / FLAP (Photorealistic 4K Gold Foil Foliage Texture) */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={phase !== "closed" ? { rotateY: -115 } : { rotateY: 0 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                className="absolute top-0 left-0 bottom-0 w-1/2 rounded-l-3xl z-20 overflow-hidden border-y-2 border-l-2 border-[#D4A24E]/60 shadow-2xl preserve-3d"
                style={{
                  background: "linear-gradient(135deg, #FFFDF9 0%, #FDF3E5 100%)",
                  transformOrigin: "left center",
                  boxShadow: "-15px 20px 40px rgba(0,0,0,0.15)",
                }}
              >
                {/* 4K Gold Foliage Branches Image Layer (Left Side) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src="/images/gold_branches_4k.png"
                    alt="Feuillage d'or 4K"
                    className="w-[200%] h-full object-cover object-left opacity-90 filter drop-shadow-sm"
                  />
                </div>

                {/* Paper texture overlay & inner gold line border */}
                <div className="absolute inset-3 border border-[#D4A24E]/40 rounded-l-2xl pointer-events-none" />
                <div className="absolute inset-4 border border-[#D4A24E]/20 rounded-l-xl pointer-events-none stroke-dasharray" />
              </motion.div>

              {/* RIGHT DOOR / FLAP (Photorealistic 4K Gold Foil Foliage Texture) */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={phase !== "closed" ? { rotateY: 115 } : { rotateY: 0 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                className="absolute top-0 right-0 bottom-0 w-1/2 rounded-r-3xl z-20 overflow-hidden border-y-2 border-r-2 border-[#D4A24E]/60 shadow-2xl preserve-3d"
                style={{
                  background: "linear-gradient(225deg, #FFFDF9 0%, #FDF3E5 100%)",
                  transformOrigin: "right center",
                  boxShadow: "15px 20px 40px rgba(0,0,0,0.15)",
                }}
              >
                {/* 4K Gold Foliage Branches Image Layer (Right Side) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src="/images/gold_branches_4k.png"
                    alt="Feuillage d'or 4K"
                    className="w-[200%] h-full object-cover object-right opacity-90 filter drop-shadow-sm"
                  />
                </div>

                {/* Paper texture overlay & inner gold line border */}
                <div className="absolute inset-3 border border-[#D4A24E]/40 rounded-r-2xl pointer-events-none" />
                <div className="absolute inset-4 border border-[#D4A24E]/20 rounded-r-xl pointer-events-none stroke-dasharray" />
              </motion.div>

              {/* CENTRAL PHOTOREALISTIC 4K RED ROSE WAX SEAL */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={
                  phase !== "closed"
                    ? { scale: 1.5, opacity: 0, filter: "blur(8px)" }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute z-40 cursor-pointer flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                onClick={handleOpenEnvelope}
              >
                {/* Outer Glow Aura */}
                <motion.div
                  className="absolute w-32 h-32 rounded-full bg-[#B81D28]/30 blur-md pointer-events-none"
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.4, 0.85, 0.4],
                  }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* 4K Photorealistic Red Rose Wax Seal Medallion */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative w-24 h-24 sm:w-26 sm:h-26 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(70,10,18,0.6)]"
                >
                  <img
                    src="/images/rose_wax_seal_4k.png"
                    alt="Sceau de cire 4K Rose Rouge"
                    className="w-full h-full object-cover rounded-full filter drop-shadow-2xl"
                  />
                </motion.div>

                {/* Interactive Hint Badge */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-6 px-4 py-1.5 rounded-full bg-[#4A050A]/90 backdrop-blur-md border border-[#FFA3A9]/40 text-[#FFE5E7] text-[11px] font-serif tracking-[0.2em] uppercase shadow-xl flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-[#FFCCD0] animate-spin" style={{ animationDuration: "5s" }} />
                  <span>Ouvrir l'invitation</span>
                </motion.div>
              </motion.div>

            </div>

            {/* Bottom Credit Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[#7A6038] font-serif text-xs uppercase tracking-widest">
              عرس {t.bride} &amp; {t.groom} · Collection 4K Gatefold
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MAIN INVITATION PAGE CONTENT                               */}
      {/* ========================================================= */}

      {/* Navigation Header */}
      <motion.nav
        initial={{ y: -80 }}
        animate={phase === "opened" ? { y: 0 } : { y: -80 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E6D0B3] shadow-xs"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/#modeles")}
            className="flex items-center gap-2 text-sm text-[#5A4930] hover:text-[#B81D28] transition-colors cursor-pointer font-serif"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Retour aux modèles</span>
          </button>

          <div className="text-center">
            <span className="font-script text-2xl text-[#871822] block leading-none">
              {t.bride} &amp; {t.groom}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#9E8B6B] font-serif">
              Template Amour 4K
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2.5 rounded-full bg-[#FCEEE6] text-[#871822] hover:bg-[#FADCD0] transition-colors cursor-pointer"
              title={isPlayingMusic ? "Couper le son" : "Activer la musique"}
            >
              {isPlayingMusic ? <Music size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `عرس ${t.bride} & ${t.groom}`, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Lien d'invitation copié !");
                }
              }}
              className="p-2.5 rounded-full bg-[#FCEEE6] text-[#871822] hover:bg-[#FADCD0] transition-colors cursor-pointer"
              title="Partager"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION WITH QURANIC AYAT & DESIGN ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FDF5E8] to-[#F5E5CF]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#F7E5CC]/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Quranic Ayat Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] border-2 border-[#D4A24E]/40 shadow-xl relative"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-[#B81D28] font-serif font-bold block mb-3">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C59B58] to-transparent mx-auto mb-4" />

            <h2 className="font-serif text-2xl sm:text-3xl text-[#871822] leading-relaxed font-bold tracking-wide mb-3">
              ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#684C1C] max-w-xl mx-auto leading-relaxed">
              « Et parmi Ses signes Il a créé de vous, pour vous, des épouses afin que vous trouviez auprès d'elles le repos, et Il a établi entre vous de l'amour et de la miséricorde. »
            </p>
            <span className="text-[10px] uppercase tracking-widest text-[#B81D28]/80 font-serif font-semibold mt-2 block">
              Sourate Ar-Rum · Verset 21
            </span>
          </motion.div>

          {/* Monogram Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={phase === "opened" ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#B81D28] p-1 flex items-center justify-center bg-[#FFFDF9] shadow-md"
          >
            <div className="w-full h-full rounded-full border border-[#C59B58] flex items-center justify-center bg-[#FCEEE6] overflow-hidden p-2">
              <span className="font-script text-2xl text-[#871822]">{t.bride[0]}&amp;{t.groom[0]}</span>
            </div>
          </motion.div>

          {/* Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="py-2"
          >
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#684C1C] leading-none">
              {t.bride}
            </h1>
            <div className="flex items-center justify-center gap-4 my-3">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#B81D28]" />
              <span className="font-serif italic text-2xl md:text-3xl text-[#B81D28]">&amp;</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#B81D28]" />
            </div>
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#684C1C] leading-none">
              {t.groom}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-full bg-[#FFFDF8] border border-[#D4A24E]/60 shadow-lg text-sm font-serif text-[#684C1C]"
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-[#B81D28]" /> {t.date}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B81D28]" />
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-[#B81D28]" /> {t.time}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B81D28]" />
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-[#B81D28]" /> {t.city}
            </span>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-14 text-[#9E8B6B] flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest font-serif"
          >
            <span>Découvrir la suite</span>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN TIMER ── */}
      <section className="py-16 px-4 bg-[#F5E5CF]/60 border-y border-[#E6D0B3]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#871822] font-serif font-semibold mb-8">
            Le grand jour approche
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { val: countdown.days, label: "Jours" },
              { val: countdown.hours, label: "Heures" },
              { val: countdown.minutes, label: "Minutes" },
              { val: countdown.seconds, label: "Secondes" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#D4A24E]/40 shadow-sm"
              >
                <span className="font-script text-4xl sm:text-5xl text-[#871822] block">
                  {item.val}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A6038] font-serif mt-1 block">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-[#871822] font-serif font-bold">
            Notre parcours
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-[#684C1C] mt-2">
            Notre Histoire
          </h2>
          <div className="w-16 h-px bg-[#C59B58] mx-auto mt-4" />
        </div>

        <div className="space-y-12">
          {t.story.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-[#FFFDF8] p-8 rounded-3xl border border-[#E6D0B3] shadow-md flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#FCEEE6] border border-[#B81D28]/40 flex items-center justify-center flex-shrink-0">
                <span className="font-script text-3xl text-[#871822]">{idx + 1}</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl text-[#684C1C] mb-2 font-medium">
                  {st.title}
                </h3>
                <p className="text-[#68553A] leading-relaxed font-serif text-base">
                  {st.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIEU & ITINÉRAIRE ── */}
      <section className="py-24 px-6 bg-[#FDF5E8] border-t border-[#E6D0B3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.4em] text-[#871822] font-serif font-bold">
              Rendez-vous
            </span>
            <h2 className="font-script text-5xl sm:text-6xl text-[#684C1C] mt-2">
              Le Lieu de la Cérémonie
            </h2>
            <p className="text-[#7A6038] font-serif mt-2">
              {t.lieu} — {t.city}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E6D0B3] text-center shadow-xs">
              <Calendar size={28} className="text-[#B81D28] mx-auto mb-3" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#9E7D42] mb-1">Date</h4>
              <p className="font-serif text-xl text-[#4A3818] font-medium">{t.date}</p>
            </div>

            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E6D0B3] text-center shadow-xs">
              <Clock size={28} className="text-[#B81D28] mx-auto mb-3" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#9E7D42] mb-1">Heure d'arrivée</h4>
              <p className="font-serif text-xl text-[#4A3818] font-medium">{t.time}</p>
            </div>

            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E6D0B3] text-center shadow-xs">
              <MapPin size={28} className="text-[#B81D28] mx-auto mb-3" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#9E7D42] mb-1">Adresse</h4>
              <p className="font-serif text-xl text-[#4A3818] font-medium">{t.lieu}</p>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="rounded-3xl overflow-hidden border-2 border-[#D4A24E]/50 shadow-xl h-[380px] relative">
            <iframe
              title="Localisation de l'événement"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(t.lieu + " " + t.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "sepia(0.2) contrast(0.95)" }}
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#871822] text-[#FFF8EB] px-5 py-2.5 rounded-full text-xs font-serif tracking-wider uppercase shadow-lg hover:bg-[#6B1119] transition-colors"
              >
                <Navigation size={14} /> Ouvrir Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME DE LA JOURNÉE ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-[#871822] font-serif font-bold">
            Déroulement
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-[#684C1C] mt-2">
            Programme de la Journée
          </h2>
          <div className="w-16 h-px bg-[#C59B58] mx-auto mt-4" />
        </div>

        <div className="space-y-6">
          {t.program.map((pr, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E6D0B3] shadow-xs flex items-center gap-6"
            >
              <div className="w-20 h-16 rounded-xl bg-[#FCEEE6] border border-[#B81D28]/30 flex items-center justify-center flex-shrink-0 text-center">
                <span className="font-serif font-bold text-lg text-[#871822]">{pr.time}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-[#684C1C] font-medium mb-1">{pr.title}</h3>
                <p className="text-[#756448] text-sm font-serif">{pr.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIVRE D'OR & VŒUX ── */}
      <section className="py-24 px-6 bg-[#FDF5E8] border-t border-[#E6D0B3]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.4em] text-[#871822] font-serif font-bold">
              Vos petits mots
            </span>
            <h2 className="font-script text-5xl text-[#684C1C] mt-2">
              Livre d'Or &amp; Vœux
            </h2>
          </div>

          <form onSubmit={handleAddWish} className="bg-[#FFFDF8] p-6 sm:p-8 rounded-3xl border border-[#E6D0B3] shadow-md mb-12">
            <h3 className="font-serif text-lg text-[#684C1C] mb-4 font-medium">Laissez un mot doux aux mariés</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom / prénom"
                value={newWishName}
                onChange={(e) => setNewWishName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D4A24E]/50 bg-[#FFFDF8] focus:outline-none focus:border-[#B81D28] font-serif text-sm text-[#4A3818]"
                required
              />
              <textarea
                rows={3}
                placeholder="Votre message de félicitations..."
                value={newWishText}
                onChange={(e) => setNewWishText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D4A24E]/50 bg-[#FFFDF8] focus:outline-none focus:border-[#B81D28] font-serif text-sm text-[#4A3818]"
                required
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-[#871822] text-[#FFF8EB] rounded-xl font-serif text-sm uppercase tracking-widest hover:bg-[#6B1119] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} /> Envoyer votre message
              </button>
            </div>
            {wishAdded && (
              <p className="mt-3 text-xs text-[#871822] font-serif text-center">
                ✨ Merci pour votre chaleureux message !
              </p>
            )}
          </form>

          <div className="space-y-4">
            {guestWishes.map((w, idx) => (
              <div key={idx} className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E6D0B3] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-medium text-[#684C1C]">{w.name}</span>
                  <span className="text-[10px] text-[#A89574] font-serif">{w.date}</span>
                </div>
                <p className="text-[#68553A] font-serif text-sm italic">« {w.text} »</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <footer className="py-12 bg-[#4A0A0E] text-[#FFE8EA] text-center font-serif text-xs">
        <p className="font-script text-4xl text-[#FFCCD0] mb-2">
          {t.bride} &amp; {t.groom}
        </p>
        <p className="uppercase tracking-[0.3em] text-[#D4A24E] mb-6">
          {t.date} · {t.city}
        </p>
        <div className="w-24 h-px bg-[#B81D28] mx-auto mb-6 opacity-40" />
        <p className="text-[#E0B8BC]">
          Créé avec amour sur{" "}
          <a href="https://farhty.tn" className="underline hover:text-[#FFF]">
            Farhty
          </a>{" "}
          · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}

function router_or_fallback() {
  try {
    return useRouter();
  } catch {
    return { push: () => {} };
  }
}
