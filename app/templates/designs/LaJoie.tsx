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
  Crown,
} from "lucide-react";
import type { Template } from "../data";

interface LaJoieProps {
  template: Template;
}

export default function LaJoie({ template }: LaJoieProps) {
  const router = router_or_fallback();
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: "", attendance: "yes", guests: "1", message: "" });
  const [guestWishes, setGuestWishes] = useState([
    { name: "Famille Mansour", text: "Tous nos vœux de bonheur et de joie infinie pour les mariés !", date: "Hier" },
    { name: "Sami & Hela", text: "Félicitations pour ce mariage royal sous les arcades de La Marsa !", date: "Il y a 2 jours" },
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishAdded, setWishAdded] = useState(false);

  const t = template.previewText;

  // Countdown timer
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 95);
    target.setHours(19, 0, 0, 0);

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

  const handleOpenPalace = () => {
    if (phase !== "closed") return;
    setPhase("opening");

    setTimeout(() => {
      setPhase("opened");
    }, 1800);
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
    <main className="min-h-screen bg-[#FAF9F5] text-[#1E2530] overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#1E2530]">
      {/* ========================================================= */}
      {/* 4K MARBLE COLONNADE PALACE INTRO OVERLAY (LA JOIE)       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="palace-colonnade-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
            style={{
              background: "radial-gradient(ellipse at center, #FFFFFF 0%, #F5F2EA 60%, #E8E3D5 100%)",
            }}
          >
            {/* Background 4K Marble Colonnade Photo */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src="/images/la_joie_columns_gate_4k.png"
                alt="Palais de Marbre 4K"
                className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F0]/80 via-transparent to-[#F8F6F0]/60" />
            </div>

            {/* Glowing Golden Aura */}
            <motion.div
              className="absolute w-[650px] h-[650px] rounded-full pointer-events-none blur-3xl opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, rgba(255,255,255,0) 75%)",
              }}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Gold Light Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(26)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#F3D078] shadow-[0_0_12px_#D4AF37]"
                  style={{
                    top: `${(i * 17) % 94}%`,
                    left: `${(i * 23) % 94}%`,
                  }}
                  animate={{
                    y: [-20, -60, -20],
                    opacity: [0.25, 0.9, 0.25],
                    scale: [0.6, 1.5, 0.6],
                  }}
                  transition={{
                    duration: 3.5 + (i % 4),
                    repeat: Infinity,
                    delay: (i * 0.3) % 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* 4K PALACE GATE STAGE */}
            <div className="relative w-[92vw] max-w-[460px] h-[620px] max-h-[88vh] perspective-1200 flex items-center justify-center">

              {/* REVEALED INVITATION CARD (Slides through the marble colonnade) */}
              <motion.div
                initial={{ scale: 0.94, opacity: 0.8 }}
                animate={phase === "opening" ? { scale: 1.02, opacity: 1, y: -20 } : { scale: 0.94, opacity: 0.8 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="absolute inset-0 rounded-3xl p-6 sm:p-8 text-center bg-[#FFFDF9]/95 backdrop-blur-md border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between overflow-hidden"
                style={{
                  boxShadow: "0 30px 70px rgba(28, 45, 66, 0.35)",
                }}
              >
                {/* Gold Royal Frame Ornaments */}
                <div className="absolute inset-3 border border-[#D4AF37]/30 rounded-2xl pointer-events-none" />
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#D4AF37]" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#D4AF37]" />

                <div className="pt-4">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37] mx-auto mb-2 flex items-center justify-center bg-[#FDFBF7]">
                    <Crown size={22} className="text-[#C5A059]" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.45em] text-[#C5A059] font-serif font-bold block">
                    Invitation Princère
                  </span>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-2" />
                </div>

                <div className="my-auto py-2">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#7A6B4E] font-serif">
                    Célébration Princère de l'Amour
                  </p>
                  <h1 className="font-script text-5xl sm:text-6xl text-[#1C2D42] my-2 leading-tight">
                    {t.bride} <span className="text-[#C5A059] font-serif text-2xl">&amp;</span> {t.groom}
                  </h1>
                  <p className="font-serif text-xs text-[#5C503A] tracking-wide">
                    {t.date} · {t.lieu}, {t.city}
                  </p>
                </div>

                <div className="pb-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 text-[#7A6020] text-xs font-serif font-medium shadow-xs">
                    <Sparkles size={13} className="text-[#C5A059]" /> Célébration Royale
                  </span>
                </div>
              </motion.div>

              {/* LEFT MARBLE GATE (Parts left on click) */}
              <motion.div
                initial={{ x: 0 }}
                animate={phase !== "closed" ? { x: "-105%" } : { x: 0 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                className="absolute top-0 left-0 bottom-0 w-1/2 rounded-l-3xl z-20 overflow-hidden border-y-2 border-l-2 border-[#D4AF37]/60 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #FFFDF9 0%, #F5F0E6 100%)",
                }}
              >
                <img
                  src="/images/la_joie_columns_gate_4k.png"
                  alt="Colonnade de marbre"
                  className="w-[200%] h-full object-cover object-left opacity-95"
                />
                <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-l-2xl pointer-events-none" />
              </motion.div>

              {/* RIGHT MARBLE GATE (Parts right on click) */}
              <motion.div
                initial={{ x: 0 }}
                animate={phase !== "closed" ? { x: "105%" } : { x: 0 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                className="absolute top-0 right-0 bottom-0 w-1/2 rounded-r-3xl z-20 overflow-hidden border-y-2 border-r-2 border-[#D4AF37]/60 shadow-2xl"
                style={{
                  background: "linear-gradient(225deg, #FFFDF9 0%, #F5F0E6 100%)",
                }}
              >
                <img
                  src="/images/la_joie_columns_gate_4k.png"
                  alt="Colonnade de marbre"
                  className="w-[200%] h-full object-cover object-right opacity-95"
                />
                <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-r-2xl pointer-events-none" />
              </motion.div>

              {/* CENTRAL ROYAL GOLDEN MEDALLION ("M & E") */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={
                  phase !== "closed"
                    ? { scale: 1.6, opacity: 0, filter: "blur(8px)" }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute z-40 cursor-pointer flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                onClick={handleOpenPalace}
              >
                {/* Glow Ring */}
                <motion.div
                  className="absolute w-32 h-32 rounded-full bg-[#D4AF37]/35 blur-md pointer-events-none"
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.4, 0.85, 0.4],
                  }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Golden Medallion */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(28,45,66,0.5)] border-2 border-[#FFE8A3]"
                  style={{
                    background: "radial-gradient(circle at 35% 30%, #FFE69A 0%, #D4AF37 45%, #9E7B2B 75%, #5E4713 100%)",
                  }}
                >
                  <div className="absolute inset-1.5 rounded-full border border-[#FFF7D6]/60 pointer-events-none" />
                  <div className="absolute inset-3 rounded-full border border-[#423108]/30 pointer-events-none" />

                  <div className="text-center px-1">
                    <span
                      className="font-script text-2xl md:text-3xl text-[#3B2B05] block leading-none font-bold"
                      style={{
                        textShadow: "0 1px 1px rgba(255, 245, 205, 0.8), 0 -1px 1px rgba(40, 30, 0, 0.6)",
                      }}
                    >
                      {t.bride[0]} &amp; {t.groom[0]}
                    </span>
                  </div>
                </motion.div>

                {/* Action Hint */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-6 px-4 py-1.5 rounded-full bg-[#1C2D42]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5EAD4] text-[11px] font-serif tracking-[0.2em] uppercase shadow-xl flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-[#D4AF37] animate-spin" style={{ animationDuration: "5s" }} />
                  <span>Ouvrir l'invitation</span>
                </motion.div>
              </motion.div>

            </div>

            {/* Bottom Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[#5C503A] font-serif text-xs uppercase tracking-widest">
              عرس {t.bride} &amp; {t.groom} · Modèle La Joie 4K
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
        className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E2DDD0] shadow-xs"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/#modeles")}
            className="flex items-center gap-2 text-sm text-[#1C2D42] hover:text-[#C5A059] transition-colors cursor-pointer font-serif"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Retour aux modèles</span>
          </button>

          <div className="text-center">
            <span className="font-script text-2xl text-[#C5A059] block leading-none">
              {t.bride} &amp; {t.groom}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#7A6B4E] font-serif">
              Template La Joie
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2.5 rounded-full bg-[#FAF3E0] text-[#7A6020] hover:bg-[#F3E5C8] transition-colors cursor-pointer"
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
              className="p-2.5 rounded-full bg-[#FAF3E0] text-[#7A6020] hover:bg-[#F3E5C8] transition-colors cursor-pointer"
              title="Partager"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION WITH 4K MARBLE COLONNADE PHOTO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background 4K Marble Colonnade Hero Photo */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/la_joie_columns_4k.png"
            alt="Colonnade de marbre 4K"
            className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.97] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/85 via-[#FFFDF9]/70 to-[#FAF9F5]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Royal Crest Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={phase === "opened" ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#D4AF37] p-1 flex items-center justify-center bg-[#FFFDF9] shadow-lg"
          >
            <div className="w-full h-full rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#FAF3E0]">
              <span className="font-script text-2xl text-[#C5A059]">
                {t.bride[0]}&amp;{t.groom[0]}
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xs uppercase tracking-[0.45em] text-[#C5A059] font-serif font-bold mb-6"
          >
            Célébration Princère de l'Amour
          </motion.p>

          {/* Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="py-2"
          >
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#1C2D42] leading-none">
              {t.bride}
            </h1>
            <div className="flex items-center justify-center gap-4 my-3">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="font-serif italic text-2xl md:text-3xl text-[#C5A059]">&amp;</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#1C2D42] leading-none">
              {t.groom}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={phase === "opened" ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-6 font-serif text-lg sm:text-xl text-[#4A5568] max-w-lg mx-auto italic leading-relaxed"
          >
            « Sous les arcades de marbre et la lumière du palais, deux chemins ne forment plus qu'une seule destinée. »
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-10 inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/60 shadow-xl text-sm font-serif text-[#1C2D42]"
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-[#C5A059]" /> {t.date}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-[#C5A059]" /> {t.time}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-[#C5A059]" /> {t.city}
            </span>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-14 text-[#7A6B4E] flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest font-serif"
          >
            <span>Découvrir la suite</span>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN TIMER ── */}
      <section className="py-16 px-4 bg-[#FAF6EC] border-y border-[#E2DDD0]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#C5A059] font-serif font-bold mb-8">
            Le décompte jusqu'à la célébration
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
                className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#D4AF37]/40 shadow-sm"
              >
                <span className="font-script text-4xl sm:text-5xl text-[#1C2D42] block">
                  {item.val}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A6B4E] font-serif mt-1 block">
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
          <span className="text-xs uppercase tracking-[0.4em] text-[#C5A059] font-serif font-bold">
            Récit d'amour
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-[#1C2D42] mt-2">
            Notre Histoire
          </h2>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
        </div>

        <div className="space-y-12">
          {t.story.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-[#FFFDF9] p-8 rounded-3xl border border-[#E2DDD0] shadow-md flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                <span className="font-script text-3xl text-[#C5A059]">{idx + 1}</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl text-[#1C2D42] mb-2 font-medium">
                  {st.title}
                </h3>
                <p className="text-[#4A5568] leading-relaxed font-serif text-base">
                  {st.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIEU & ITINÉRAIRE ── */}
      <section className="py-24 px-6 bg-[#FAF6EC] border-t border-[#E2DDD0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.4em] text-[#C5A059] font-serif font-bold">
              Rendez-vous
            </span>
            <h2 className="font-script text-5xl sm:text-6xl text-[#1C2D42] mt-2">
              Le Lieu du Mariage
            </h2>
            <p className="text-[#5C503A] font-serif mt-2">
              {t.lieu} — {t.city}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E2DDD0] text-center shadow-xs">
              <Calendar size={28} className="text-[#C5A059] mx-auto mb-3" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#7A6B4E] mb-1">Date</h4>
              <p className="font-serif text-xl text-[#1C2D42] font-medium">{t.date}</p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E2DDD0] text-center shadow-xs">
              <Clock size={28} className="text-[#C5A059] mx-auto mb-3" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#7A6B4E] mb-1">Heure d'arrivée</h4>
              <p className="font-serif text-xl text-[#1C2D42] font-medium">{t.time}</p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E2DDD0] text-center shadow-xs">
              <MapPin size={28} className="text-[#C5A059] mx-auto mb-3" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#7A6B4E] mb-1">Adresse</h4>
              <p className="font-serif text-xl text-[#1C2D42] font-medium">{t.lieu}</p>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl h-[380px] relative">
            <iframe
              title="Localisation de l'événement"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(t.lieu + " " + t.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "sepia(0.15) contrast(0.95)" }}
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1C2D42] text-[#FFFDF9] px-5 py-2.5 rounded-full text-xs font-serif tracking-wider uppercase shadow-lg hover:bg-[#121E2C] transition-colors"
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
          <span className="text-xs uppercase tracking-[0.4em] text-[#C5A059] font-serif font-bold">
            Déroulement
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-[#1C2D42] mt-2">
            Programme Princier
          </h2>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
        </div>

        <div className="space-y-6">
          {t.program.map((pr, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E2DDD0] shadow-xs flex items-center gap-6"
            >
              <div className="w-20 h-16 rounded-xl bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0 text-center">
                <span className="font-serif font-bold text-lg text-[#C5A059]">{pr.time}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-[#1C2D42] font-medium mb-1">{pr.title}</h3>
                <p className="text-[#5C503A] text-sm font-serif">{pr.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIVRE D'OR & VŒUX ── */}
      <section className="py-24 px-6 bg-[#FAF6EC] border-t border-[#E2DDD0]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.4em] text-[#C5A059] font-serif font-bold">
              Vos petits mots
            </span>
            <h2 className="font-script text-5xl text-[#1C2D42] mt-2">
              Livre d'Or &amp; Vœux
            </h2>
          </div>

          <form onSubmit={handleAddWish} className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#E2DDD0] shadow-md mb-12">
            <h3 className="font-serif text-lg text-[#1C2D42] mb-4 font-medium">Laissez un message d'amitié aux mariés</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom / prénom"
                value={newWishName}
                onChange={(e) => setNewWishName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] focus:outline-none focus:border-[#C5A059] font-serif text-sm text-[#1C2D42]"
                required
              />
              <textarea
                rows={3}
                placeholder="Votre message de félicitations..."
                value={newWishText}
                onChange={(e) => setNewWishText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] focus:outline-none focus:border-[#C5A059] font-serif text-sm text-[#1C2D42]"
                required
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1C2D42] text-[#FFFDF9] rounded-xl font-serif text-sm uppercase tracking-widest hover:bg-[#121E2C] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} /> Envoyer votre message
              </button>
            </div>
            {wishAdded && (
              <p className="mt-3 text-xs text-[#C5A059] font-serif text-center">
                ✨ Merci pour votre chaleureux message !
              </p>
            )}
          </form>

          <div className="space-y-4">
            {guestWishes.map((w, idx) => (
              <div key={idx} className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E2DDD0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-medium text-[#1C2D42]">{w.name}</span>
                  <span className="text-[10px] text-[#7A6B4E] font-serif">{w.date}</span>
                </div>
                <p className="text-[#4A5568] font-serif text-sm italic">« {w.text} »</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE RSVP ── */}
      <section className="py-24 px-6 max-w-xl mx-auto text-center">
        <div className="bg-[#FFFDF9] p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37]/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

          <h2 className="font-script text-5xl text-[#1C2D42] mb-2">Confirmation RSVP</h2>
          <p className="font-serif text-sm text-[#5C503A] mb-8">
            Merci de nous confirmer votre présence avant le 1er Septembre 2026.
          </p>

          {!rsvpSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRsvpSubmitted(true);
              }}
              className="space-y-5 text-left"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-serif font-semibold mb-1.5">
                  Nom &amp; Prénom
                </label>
                <input
                  type="text"
                  required
                  value={rsvpData.name}
                  onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                  placeholder="Ex: Sami & Hela"
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9] font-serif text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-serif font-semibold mb-1.5">
                  Serez-vous présent(e) ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, attendance: "yes" })}
                    className={`py-3 rounded-xl border font-serif text-sm cursor-pointer transition-colors ${
                      rsvpData.attendance === "yes"
                        ? "bg-[#1C2D42] text-[#FFFDF9] border-[#1C2D42]"
                        : "border-[#D4AF37]/60 text-[#1C2D42]"
                    }`}
                  >
                    Oui, avec joie !
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, attendance: "no" })}
                    className={`py-3 rounded-xl border font-serif text-sm cursor-pointer transition-colors ${
                      rsvpData.attendance === "no"
                        ? "bg-[#1C2D42] text-[#FFFDF9] border-[#1C2D42]"
                        : "border-[#D4AF37]/60 text-[#1C2D42]"
                    }`}
                  >
                    Malheureusement non
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-serif font-semibold mb-1.5">
                  Nombre de personnes
                </label>
                <select
                  value={rsvpData.guests}
                  onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9] font-serif text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="1">1 personne</option>
                  <option value="2">2 personnes</option>
                  <option value="3">3 personnes</option>
                  <option value="4+">4 personnes ou plus</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#C5A059] text-white rounded-xl font-serif text-sm uppercase tracking-widest hover:bg-[#B38F48] transition-colors shadow-md cursor-pointer mt-4 font-semibold"
              >
                Confirmer ma réponse
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FAF3E0] border border-[#C5A059] flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-[#C5A059]" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C2D42] mb-2">Réponse enregistrée !</h3>
              <p className="text-sm font-serif text-[#5C503A]">
                Merci {rsvpData.name || "cher invité"}, nous avons bien enregistré votre réponse.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 bg-[#121E2C] text-[#E2E8F0] text-center font-serif text-xs">
        <p className="font-script text-4xl text-[#D4AF37] mb-2">
          {t.bride} &amp; {t.groom}
        </p>
        <p className="uppercase tracking-[0.3em] text-[#C5A059] mb-6">
          {t.date} · {t.city}
        </p>
        <div className="w-24 h-px bg-[#D4AF37] mx-auto mb-6 opacity-40" />
        <p className="text-[#94A3B8]">
          Créé avec prestige sur{" "}
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
