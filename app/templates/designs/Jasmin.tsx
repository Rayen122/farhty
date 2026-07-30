"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, MapPin, Flower2, Sparkles, UtensilsCrossed, Music4, Check } from "lucide-react";
import type { Template } from "../data";

const SAGE = "#5E7A52";
const SAGE_DEEP = "#3C4E33";
const GOLD = "#D4AF6A";
const IVORY = "#FBFAF3";
const PAPER = "#F1EFE0";

const sageText: React.CSSProperties = {
  background: `linear-gradient(180deg, ${SAGE}, ${SAGE_DEEP})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

/* ── Fleur de jasmin : bourgeon fermé → fleur ouverte (même composant, deux états) ── */
function JasmineFlower({ bloom, size = 26 }: { bloom: boolean; size?: number }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      style={{ width: size, height: size }}
      aria-hidden
      animate={{ rotate: bloom ? 0 : -6 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!bloom ? (
          <motion.g key="bud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ellipse cx="20" cy="22" rx="5" ry="9" fill="#8AA06A" />
            <path d="M20,13 Q17,20 20,31 Q23,20 20,13 Z" fill="#9BB47C" opacity="0.7" />
          </motion.g>
        ) : (
          <motion.g key="flower" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="20" cy="11" rx="5.5" ry="9.5" fill="#FFFFFF" stroke="#EDE8D8" strokeWidth="0.4" transform={`rotate(${r}, 20, 20)`} />
            ))}
            <circle cx="20" cy="20" r="3.5" fill={GOLD} />
          </motion.g>
        )}
      </AnimatePresence>
    </motion.svg>
  );
}

/* ── Guirlande de jasmin (mashmoum) ── */
function JasmineGarland({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 200 60" className={`${className} ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M4,50 Q60,10 196,44" stroke="#8AA06A" strokeWidth="1.4" fill="none" opacity="0.6" />
      {[16, 44, 72, 100, 128, 156, 184].map((x, i) => {
        const y = 50 - Math.sin((x / 200) * Math.PI) * 40;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} rx="3.2" ry="5.5" fill="#FFFFFF" opacity="0.9" transform={`rotate(${r})`} />
            ))}
            <circle r="1.8" fill={GOLD} />
          </g>
        );
      })}
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
      <span className="h-px w-14" style={{ background: `linear-gradient(90deg,transparent,${SAGE})` }} />
      <Flower2 size={13} style={{ color: SAGE }} />
      <span className="h-px w-14" style={{ background: `linear-gradient(270deg,transparent,${SAGE})` }} />
    </div>
  );
}

const TIMELINE_ICONS = [Sparkles, Flower2, UtensilsCrossed, Music4];
const GARLAND_COUNT = 7;

export default function Jasmin({ template }: { template: Template }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const [soundOn, setSoundOn] = useState(false);
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);
  const [imgOk, setImgOk] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const t = template.previewText;
  const hasImage = !!template.image && imgOk;

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 130);
    target.setHours(18, 0, 0, 0);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const petals = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ left: (i * 43 + 6) % 100, delay: (i * 1.3) % 12, dur: 13 + (i % 4) * 2 })),
    []
  );

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: IVORY, color: SAGE_DEEP }}>
      <button onClick={() => router.push("/#modeles")} aria-label="Retour aux modèles" className="fixed top-5 left-5 z-[70] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors duration-200 cursor-pointer">
        <ArrowLeft size={17} style={{ color: SAGE_DEEP }} />
      </button>
      <button onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? "Couper le son" : "Activer le son"} className="fixed top-5 right-5 z-[70] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors duration-200 cursor-pointer">
        {soundOn ? <Volume2 size={16} style={{ color: SAGE_DEEP }} /> : <VolumeX size={16} className="opacity-40" />}
      </button>

      {/* ═══════ INTRO PRO : VIDEO + CARTE EN ARCHE ═══════ */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="jasmin-pro-overlay"
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

            {/* CLOSED PHASE: PROMPT BUTTON (Optional skip/manual open) */}
            <AnimatePresence>
              {phase === "closed" && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onClick={handleOpen}
                  className="absolute bottom-16 px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center gap-3 cursor-pointer hover:bg-white/30 transition-all shadow-2xl group"
                >
                  <Sparkles size={16} className="text-[#D4AF6A] group-hover:rotate-12 transition-transform" />
                  <span className="font-serif uppercase tracking-widest text-sm">Passer / Ouvrir</span>
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
                  <div className="absolute inset-3 border border-[#D4AF6A]/40 rounded-t-full rounded-b-lg pointer-events-none" />
                  
                  <div className="mt-12 text-[#5E7A52] opacity-80">
                    <Flower2 size={40} strokeWidth={1} />
                  </div>

                  <div className="flex flex-col items-center gap-6 mt-6 relative z-10">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#5E7A52] font-bold">
                      Bismillah Ar-Rahman Ar-Rahim
                    </span>
                    
                    <h2 className="font-script text-6xl md:text-7xl text-[#3C4E33] leading-none mt-2">
                      {t.bride} <br/> <span className="text-[#D4AF6A] text-4xl font-serif">&amp;</span> <br/> {t.groom}
                    </h2>
                    
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent my-2" />
                    
                    <p className="font-serif text-base text-[#3C4E33]/80 leading-relaxed max-w-[280px] mx-auto">
                      Nous avons la grande joie de vous convier à la célébration de notre mariage.
                    </p>
                    
                    <div className="font-serif text-sm uppercase tracking-widest text-[#3C4E33] space-y-2 mt-4">
                      <p>{t.date}</p>
                      <p className="text-[#5E7A52]">{t.city}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setPhase("opened")}
                    className="relative z-10 mb-8 mt-auto px-10 py-4 bg-[#5E7A52] text-white rounded-full font-serif text-xs tracking-widest uppercase hover:bg-[#3C4E33] transition-colors shadow-xl flex items-center gap-3 group cursor-pointer"
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

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {hasImage ? (
          <>
            <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1.02 }} transition={{ duration: 22, ease: "easeOut" }}>
              <img src={template.image} alt="" onError={() => setImgOk(false)} className="w-full h-full object-cover object-center" />
            </motion.div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(60,78,51,0.30) 0%, transparent 30%, rgba(60,78,51,0.55) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(175deg, ${IVORY} 0%, ${PAPER} 55%, #E4E8D8 100%)` }} />
        )}
        <JasmineGarland className="absolute top-0 left-0 w-56 md:w-72 opacity-90" />
        <JasmineGarland className="absolute top-0 right-0 w-56 md:w-72 opacity-90" flip />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {petals.map((p, i) => (
            <span key={i} className="petal-particle absolute -top-8" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><ellipse cx="6" cy="6" rx="3.5" ry="5.5" fill="#FFFFFF" opacity="0.85" /></svg>
            </span>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={phase === "opened" ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.9 }} className="relative text-center px-4">
          <Flower2 size={28} className="mx-auto mb-4" style={{ color: SAGE }} strokeWidth={1.5} />
          <p className="text-[11px] uppercase tracking-[0.5em] mb-4 font-bold" style={{ color: SAGE_DEEP }}>
            Vous êtes invités au mariage de
          </p>
          <h1 className="font-script leading-tight" style={{ color: SAGE_DEEP, fontSize: "clamp(3.4rem, 11vw, 6.2rem)", filter: "drop-shadow(0 2px 10px rgba(255,255,255,0.8))" }}>
            {t.bride} <span className="text-[#D4AF6A] font-serif font-light">&amp;</span> {t.groom}
          </h1>
          <Divider />
          <p className="font-serif-elegant text-lg tracking-widest font-medium uppercase" style={{ color: SAGE_DEEP }}>
            {t.date} · {t.city}
          </p>
        </motion.div>
      </section>

      {/* ═══════ MESSAGE ═══════ */}
      <section className="relative py-24 px-6 text-center" style={{ backgroundColor: IVORY }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }} className="max-w-md mx-auto">
          <h2 className="font-script text-5xl mb-2" style={{ color: SAGE }}>Notre histoire</h2>
          <Divider />
          {t.story.map((s, i) => (
            <p key={i} className="font-serif-elegant text-lg leading-relaxed mt-6" style={{ color: `${SAGE_DEEP}CC` }}>{s.text}</p>
          ))}
        </motion.div>
      </section>

      {/* ═══════ COUNTDOWN ═══════ */}
      <section className="relative py-20 px-6" style={{ background: `linear-gradient(180deg,${PAPER},#E4E8D8)` }}>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-8" style={{ color: `${SAGE}99` }}>Le grand jour approche</p>
          <div className="flex justify-center gap-4">
            {[[countdown.days, "Jours"], [countdown.hours, "Heures"], [countdown.minutes, "Minutes"], [countdown.seconds, "Secondes"]].map(([v, l]) => (
              <div key={l as string} className="w-16 md:w-20 py-4 rounded-xl border" style={{ borderColor: `${SAGE}33`, backgroundColor: "rgba(255,255,255,0.6)" }}>
                <div className="font-serif-elegant text-3xl tabular-nums" style={{ color: SAGE_DEEP }}>{String(v).padStart(2, "0")}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: `${SAGE_DEEP}88` }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROGRAMME ═══════ */}
      <section className="relative py-24 px-6" style={{ backgroundColor: IVORY }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-script text-5xl mb-2" style={{ color: SAGE }}>Programme</h2>
            <Divider />
          </div>
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${SAGE}55 12%,${SAGE}55 88%,transparent)` }} />
            <div className="space-y-12">
              {t.program.map((p, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }} className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 relative z-10" style={{ borderColor: `${SAGE}55`, backgroundColor: IVORY }}>
                      <Icon size={17} style={{ color: SAGE }} strokeWidth={1.4} />
                    </div>
                    <div>
                      <p className="font-serif-elegant text-xl" style={{ color: GOLD }}>{p.time}</p>
                      <h3 className="font-serif-elegant font-semibold text-lg" style={{ color: SAGE_DEEP }}>{p.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: `${SAGE_DEEP}80` }}>{p.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ LIEU ═══════ */}
      <section className="relative py-24 px-6 text-center" style={{ background: `linear-gradient(180deg,#E4E8D8,${PAPER})` }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
          <MapPin size={24} className="mx-auto mb-3" style={{ color: SAGE }} strokeWidth={1.5} />
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-semibold" style={{ color: SAGE_DEEP }}>{t.lieu}</h2>
          <p className="mt-2 font-serif-elegant text-lg" style={{ color: `${SAGE_DEEP}AA` }}>{t.city} · {t.time}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
            target="_blank" rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer shadow-lg"
            style={{ backgroundColor: SAGE }}
          >
            Voir l'itinéraire
          </a>
        </motion.div>
      </section>

      {/* ═══════ RSVP ═══════ */}
      <section className="relative py-28 px-6 text-center" style={{ backgroundColor: IVORY }}>
        <div className="max-w-md mx-auto">
          <h2 className="font-script text-5xl mb-2" style={{ color: SAGE }}>Serez-vous des nôtres ?</h2>
          <Divider />
          <p className="text-sm mb-9" style={{ color: `${SAGE_DEEP}99` }}>Merci de confirmer avant le 1er mai</p>
          {rsvp === null ? (
            <div className="flex gap-4 justify-center">
              <button onClick={() => setRsvp("yes")} className="px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer" style={{ backgroundColor: SAGE }}>Avec joie</button>
              <button onClick={() => setRsvp("no")} className="px-8 py-3.5 rounded-full text-sm border transition-colors duration-200 hover:bg-black/5 cursor-pointer" style={{ borderColor: `${SAGE}44`, color: SAGE_DEEP }}>Malheureusement non</button>
            </div>
          ) : (
            <motion.p initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2" style={{ color: SAGE_DEEP }}>
              <Check size={18} style={{ color: SAGE }} /> {rsvp === "yes" ? "Merci ! Nous avons hâte de vous voir." : "Merci de nous avoir prévenus."}
            </motion.p>
          )}
        </div>
      </section>

      <footer className="py-12 text-center relative" style={{ backgroundColor: IVORY }}>
        <p className="font-script text-3xl mb-2" style={{ color: `${SAGE}BB` }}>{t.bride} & {t.groom}</p>
        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${SAGE_DEEP}55` }}>{t.date} · {t.lieu}</p>
        <p className="text-xs mt-5" style={{ color: `${SAGE_DEEP}55` }}>
          Invitation digitale par <a href="https://farhty.tn" className="underline hover:opacity-70 transition-opacity">Farhty</a>
        </p>
      </footer>
    </main>
  );
}
