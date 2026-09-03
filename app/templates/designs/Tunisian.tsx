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
import { FarhtyLink } from "../../components/FarhtyCredit";
import PhotoGallery3D from "../../components/PhotoGallery3D";

interface TunisianProps {
  template: Template;
}

export default function Tunisian({ template }: TunisianProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: "", attendance: "yes", guests: "1", message: "" });
  const [guestWishes, setGuestWishes] = useState([
    { name: "Famille Ben Ali", text: "Alf mabrouk ! Que votre vie soit remplie de bonheur et de prospérité.", date: "Hier" },
    { name: "Youssef & Sarah", text: "Nous avons hâte de célébrer ce moment inoubliable avec vous !", date: "Il y a 2 jours" },
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishAdded, setWishAdded] = useState(false);

  const t = template.previewText;

  // Countdown timer
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 45);
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

  const handleOpenEnvelope = () => {
    if (phase !== "closed") return;
    setPhase("opening");

    // Fallback in case video is missing or fails to play
    setTimeout(() => {
      setPhase("opened");
    }, 5000);
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
    <main className="min-h-screen bg-[#F0F4F8] text-[#1a2b3c] overflow-x-hidden selection:bg-[#D4AF37] selection:text-white">
      {/* ========================================================= */}
      {/* 4K INTRO HERO OVERLAY - TUNISIAN ENVELOPE                 */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="tunisian-pro-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0D1F2D]"
          >
            {/* BACKGROUND VIDEO */}
            <video
              src="/videos/flowr.mp4"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${phase === "opening" ? "scale-110 blur-sm brightness-75" : "scale-105"}`}
              autoPlay
              muted
              playsInline
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onPlay={(e) => { e.currentTarget.playbackRate = 1.4; }}
              onEnded={() => setPhase("opening")}
            />
            
            {/* GRADIENT OVERLAY FOR TEXT READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            {/* CLOSED PHASE: PROMPT BUTTON */}
            <AnimatePresence>
              {phase === "closed" && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onClick={handleOpenEnvelope}
                  className="absolute bottom-16 px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center gap-3 cursor-pointer hover:bg-white/30 transition-all shadow-2xl group"
                >
                  <Sparkles size={16} className="text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                  <span className="font-serif uppercase tracking-widest text-sm">Ouvrir l'invitation</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* OPENING PHASE: THE ARCHED CARD */}
            <AnimatePresence>
              {phase === "opening" && (
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "20%", opacity: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-4 bottom-0 top-24 md:inset-x-auto md:w-[500px] bg-[#FBFAF3] rounded-t-full shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-10 text-center border-t-8 border-x-8 border-white/50"
                >
                  {/* Subtle inner border */}
                  <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-t-full rounded-b-lg pointer-events-none" />
                  
                  <div className="mt-12 text-[#1B5FA6] opacity-80">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                      <path d="M12 2v20"/>
                      <path d="M2 12h20"/>
                      <path d="M4.929 4.929l14.142 14.142"/>
                      <path d="M19.071 4.929L4.929 19.071"/>
                    </svg>
                  </div>

                  <div className="flex flex-col items-center gap-6 mt-6 relative z-10">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#1B5FA6] font-bold">
                      Bismillah Ar-Rahman Ar-Rahim
                    </span>
                    
                    <h2 className="font-script text-6xl md:text-7xl text-[#0D1F2D] leading-none mt-2">
                      {t.bride} <br/> <span className="text-[#D4AF37] text-4xl font-serif">&amp;</span> <br/> {t.groom}
                    </h2>
                    
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-2" />
                    
                    <p className="font-serif text-base text-[#0D1F2D]/80 leading-relaxed max-w-[280px] mx-auto">
                      Nous avons la grande joie de vous convier à la célébration de notre mariage.
                    </p>
                    
                    <div className="font-serif text-sm uppercase tracking-widest text-[#0D1F2D] space-y-2 mt-4">
                      <p>{t.date}</p>
                      <p className="text-[#1B5FA6]">{t.city}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setPhase("opened")}
                    className="relative z-10 mb-8 mt-auto px-10 py-4 bg-[#1B5FA6] text-white rounded-full font-serif text-xs tracking-widest uppercase hover:bg-[#0D1F2D] transition-colors shadow-xl flex items-center gap-3 group cursor-pointer"
                  >
                    Découvrir 
                    <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MAIN CONTENT                                              */}
      {/* ========================================================= */}

      {/* Navigation Header */}
      <motion.nav
        initial={{ y: -80 }}
        animate={phase === "opened" ? { y: 0 } : { y: -80 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#F0F4F8]/90 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/#modeles")}
            aria-label="Retour aux modèles"
            className="flex items-center gap-2 text-sm text-[#1B5FA6] hover:text-[#0D1F2D] transition-colors cursor-pointer font-serif"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <div className="text-center">
            <span className="font-script text-2xl text-[#1B5FA6] block leading-none">
              {t.bride} &amp; {t.groom}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2.5 rounded-full bg-white text-[#1B5FA6] hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer border border-[#D4AF37]/30"
              title={isPlayingMusic ? "Couper le son" : "Activer la musique"}
            >
              {isPlayingMusic ? <Music size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Image with Parallax effect */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tunisian_invitation_interior.webp"
            alt="Background"
            className="w-full h-full object-cover opacity-15 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0F4F8]/80 via-[#F0F4F8]/95 to-[#F0F4F8]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase === "opened" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-3xl border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden"
          >
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#1B5FA6]/50 rounded-tl-xl" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#1B5FA6]/50 rounded-tr-xl" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#1B5FA6]/50 rounded-bl-xl" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#1B5FA6]/50 rounded-br-xl" />

            <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-serif font-bold block mb-4">
              Bismillah Ar-Rahman Ar-Rahim
            </span>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#1B5FA6] to-transparent mx-auto mb-8" />

            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#1B5FA6] leading-tight drop-shadow-sm">
              {t.bride}
            </h1>
            <div className="flex items-center justify-center gap-6 my-4">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="font-serif text-3xl text-[#D4AF37]">&amp;</span>
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#1B5FA6] leading-tight drop-shadow-sm">
              {t.groom}
            </h1>

            <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-full bg-white/80 border border-[#1B5FA6]/20 shadow-sm text-sm font-serif text-[#0D1F2D]">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-[#D4AF37]" /> {t.date}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B5FA6]/50" />
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-[#D4AF37]" /> {t.time}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B5FA6]/50" />
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-[#D4AF37]" /> {t.city}
              </span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 text-[#1B5FA6] flex flex-col items-center gap-1 text-xs uppercase tracking-widest font-serif"
          >
            <span>Découvrir</span>
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="py-16 px-6 bg-[#1B5FA6] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-serif font-semibold mb-10">
            Le grand jour approche
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { val: countdown.days, label: "Jours" },
              { val: countdown.hours, label: "Heures" },
              { val: countdown.minutes, label: "Minutes" },
              { val: countdown.seconds, label: "Secondes" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0D1F2D]/50 p-6 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-md shadow-lg"
              >
                <span className="font-serif text-4xl sm:text-5xl text-white block mb-2 font-light">
                  {item.val}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-serif block">
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
          <span className="text-xs uppercase tracking-[0.4em] text-[#1B5FA6] font-serif font-bold">
            Notre parcours
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-[#0D1F2D] mt-4 mb-6">
            L'Histoire d'Amour
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
        </div>

        <div className="space-y-12">
          {t.story.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white p-8 rounded-3xl border border-[#1B5FA6]/10 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.1)_0%,_transparent_70%)] pointer-events-none" />

              <div className="w-16 h-16 rounded-full bg-[#1B5FA6] border-4 border-white shadow-md flex items-center justify-center flex-shrink-0 z-10">
                <span className="font-serif text-2xl text-white font-light">{idx + 1}</span>
              </div>
              <div className="flex-1 z-10">
                <h3 className="font-serif text-2xl text-[#1B5FA6] mb-3 font-medium">
                  {st.title}
                </h3>
                <p className="text-[#4A5568] leading-relaxed font-serif text-lg">
                  {st.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIEU & ITINÉRAIRE (GOOGLE MAPS) ── */}
      <section className="py-24 px-6 bg-[#E8F0F6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.4em] text-[#1B5FA6] font-serif font-bold">
              Célébration
            </span>
            <h2 className="font-script text-5xl sm:text-6xl text-[#0D1F2D] mt-4 mb-6">
              Le Lieu
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Calendar, title: "Date", value: t.date },
              { icon: Clock, title: "Heure", value: t.time },
              { icon: MapPin, title: "Adresse", value: t.lieu },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[#1B5FA6]/10 text-center shadow-lg hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 mx-auto bg-[#F0F4F8] rounded-full flex items-center justify-center mb-4 text-[#1B5FA6]">
                  <item.icon size={24} />
                </div>
                <h4 className="font-serif text-xs uppercase tracking-widest text-[#D4AF37] mb-2">{item.title}</h4>
                <p className="font-serif text-xl text-[#0D1F2D]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Premium Google Maps Container */}
          <div className="rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl h-[450px] relative group">
            <div className="absolute inset-0 pointer-events-none border border-[#D4AF37]/30 rounded-2xl z-20" />
            <iframe
              title="Localisation de l'événement"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(t.lieu + " " + t.city)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.1) saturate(1.2)" }}
              loading="lazy"
              className="z-10 relative"
            />
            <div className="absolute bottom-6 right-6 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1B5FA6] text-white px-6 py-3 rounded-xl text-sm font-serif tracking-wider uppercase shadow-xl hover:bg-[#0D1F2D] transition-colors cursor-pointer"
              >
                <Navigation size={16} /> Itinéraire
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-[#1B5FA6] font-serif font-bold">
            Déroulement
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-[#0D1F2D] mt-4 mb-6">
            Programme
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
        </div>

        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[39px] md:before:left-1/2 before:w-0.5 before:bg-[#D4AF37]/30">
          {t.program.map((pr, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex items-center justify-between md:justify-normal gap-8 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="absolute left-[31px] md:left-1/2 -ml-[9px] w-[18px] h-[18px] rounded-full border-4 border-[#F0F4F8] bg-[#1B5FA6] z-10 shadow-sm" />

              <div className="hidden md:block w-5/12" />

              <div className="w-full pl-24 md:pl-0 md:w-5/12">
                <div className="bg-white p-6 rounded-2xl border border-[#1B5FA6]/10 shadow-lg hover:shadow-xl transition-shadow group">
                  <span className="inline-block px-3 py-1 bg-[#E8F0F6] text-[#1B5FA6] text-xs font-bold rounded-lg mb-3 font-serif">
                    {pr.time}
                  </span>
                  <h3 className="font-serif text-xl text-[#0D1F2D] font-medium mb-2 group-hover:text-[#1B5FA6] transition-colors">{pr.title}</h3>
                  <p className="text-[#4A5568] text-sm font-serif leading-relaxed">{pr.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GALERIE PHOTOS DES MARIÉS 3D 360 ── */}
      {t.photos && t.photos.length > 0 && (
        <PhotoGallery3D photos={t.photos} goldColor="#D4AF37" textColor="#0D1F2D" />
      )}

      {/* ── FORMULAIRE RSVP ── */}
      {!t.hideRsvp && (
      <section className="py-24 px-6 bg-gradient-to-br from-[#1B5FA6] to-[#0D1F2D] text-white">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <h2 className="font-script text-5xl text-[#D4AF37] mb-4">Confirmation RSVP</h2>
            <p className="font-serif text-sm text-white/80 mb-10">
              Veuillez confirmer votre présence avant le 1er Septembre 2026.
            </p>

            {!rsvpSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRsvpSubmitted(true);
                }}
                className="space-y-6 text-left"
              >
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-serif font-semibold mb-2">
                    Nom &amp; Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                    placeholder="Ex: Amine & Nour"
                    className="w-full px-5 py-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/30 font-serif text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-serif font-semibold mb-2">
                    Serez-vous présent(e) ?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRsvpData({ ...rsvpData, attendance: "yes" })}
                      className={`py-4 rounded-xl border font-serif text-sm cursor-pointer transition-all ${rsvpData.attendance === "yes"
                          ? "bg-[#D4AF37] text-[#0D1F2D] border-[#D4AF37] font-bold shadow-lg"
                          : "border-white/20 text-white hover:bg-white/10"
                        }`}
                    >
                      Oui, avec joie !
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpData({ ...rsvpData, attendance: "no" })}
                      className={`py-4 rounded-xl border font-serif text-sm cursor-pointer transition-all ${rsvpData.attendance === "no"
                          ? "bg-[#D4AF37] text-[#0D1F2D] border-[#D4AF37] font-bold shadow-lg"
                          : "border-white/20 text-white hover:bg-white/10"
                        }`}
                    >
                      Non, désolé(e)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-serif font-semibold mb-2">
                    Nombre de personnes
                  </label>
                  <select
                    value={rsvpData.guests}
                    onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-white/20 bg-[#0D1F2D] text-white font-serif text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                  >
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4+">4 personnes ou plus</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-[#D4AF37] text-[#0D1F2D] rounded-xl font-serif text-sm uppercase tracking-widest hover:bg-[#ebd576] transition-colors shadow-lg cursor-pointer mt-6 font-bold"
                >
                  Envoyer la réponse
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-3xl text-white mb-3">Réponse enregistrée</h3>
                <p className="text-base font-serif text-white/70">
                  Merci {rsvpData.name || "cher invité"}, nous avons bien noté votre réponse.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="py-16 bg-[#0D1F2D] text-white/50 text-center font-serif text-xs border-t border-white/5">
        <p className="font-script text-5xl text-[#D4AF37] mb-4">
          {t.bride} &amp; {t.groom}
        </p>
        <p className="uppercase tracking-[0.4em] text-white/80 mb-8 font-medium">
          {t.date} · {t.city}
        </p>
        <div className="w-24 h-px bg-[#D4AF37]/30 mx-auto mb-8" />
        <p>
          Design Premium 4K par{" "}
          <FarhtyLink className="text-[#D4AF37] hover:text-white transition-colors underline decoration-[#D4AF37]/50 underline-offset-4" />{" "}
          · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
