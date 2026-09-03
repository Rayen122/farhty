"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, MapPin, Coffee, Flower2, UtensilsCrossed, Music4, Check } from "lucide-react";
import type { Template } from "../data";
import { FarhtyLink } from "../../components/FarhtyCredit";

const BLUE = "#1B5FA6";
const BLUE_DEEP = "#0E3D70";
const TERRA = "#C97B3D";
const CREAM = "#FBF6EC";
const WHITE_WASH = "#F4EEE0";

const goldText = (c: string): React.CSSProperties => ({
  background: `linear-gradient(180deg, ${c}, ${BLUE_DEEP})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

/* ── Porte bleue clouée de Sidi Bou Saïd (SVG, un seul battant réutilisé x2) ── */
function DoorPanel({ isLeft }: { isLeft: boolean }) {
  const studRows = [18, 34, 50, 66, 82];
  return (
    <svg viewBox="0 0 100 220" preserveAspectRatio="none" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id={`doorGrad${isLeft ? "L" : "R"}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isLeft ? "#1C63AC" : "#134A82"} />
          <stop offset="100%" stopColor={isLeft ? "#134A82" : "#1C63AC"} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="220" fill={`url(#doorGrad${isLeft ? "L" : "R"})`} />
      {/* planches verticales */}
      {[16, 33, 50, 67, 84].map((x) => (
        <line key={x} x1={x} y1="4" x2={x} y2="216" stroke="#0A2F55" strokeWidth="0.6" opacity="0.5" />
      ))}
      {/* cadre panneau intérieur */}
      <rect x="10" y="14" width="80" height="82" fill="none" stroke="#0A2F55" strokeWidth="1.4" opacity="0.55" />
      <rect x="10" y="106" width="80" height="100" fill="none" stroke="#0A2F55" strokeWidth="1.4" opacity="0.55" />
      {/* clous en croix, style artisanat tunisien */}
      {studRows.map((y) =>
        [14, 50, 86].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" fill="#E8C878" stroke="#8A6A28" strokeWidth="0.4" />
        ))
      )}
      {studRows.map((y) =>
        [14, 50, 86].map((x) => (
          <circle key={`b${x}-${y}`} cx={x} cy={y + 108} r="2.1" fill="#E8C878" stroke="#8A6A28" strokeWidth="0.4" />
        ))
      )}
      {/* poignée en fer forgé (main de Fatma stylisée) sur le battant intérieur */}
      {((isLeft) as boolean) && (
        <g transform="translate(88, 118)">
          <circle r="6" fill="none" stroke="#E8C878" strokeWidth="1.6" />
          <circle r="1.6" fill="#E8C878" />
        </g>
      )}
    </svg>
  );
}

/* ── Bougainvillier grimpant ── */
function Bougainvillea({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 100 220" className={`${className} ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M8,220 C18,160 6,110 26,58 C36,32 50,18 70,6" stroke="#5A7247" strokeWidth="2.2" fill="none" opacity="0.7" />
      {[[18, 190], [10, 160], [28, 140], [14, 118], [32, 96], [20, 74], [38, 56], [30, 34], [50, 22]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle r="5.5" fill={i % 2 === 0 ? "#C64F72" : "#D9698A"} opacity="0.85" />
          <circle r="1.8" fill="#7A1E3C" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

/* ── Motif zellige (tuiles étoilées turquoise/terracotta) ── */
function ZelligePattern({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full" opacity={opacity} aria-hidden>
      <defs>
        <pattern id="zellige" width="56" height="56" patternUnits="userSpaceOnUse">
          <rect width="56" height="56" fill="none" />
          <path d="M28,4 L48,28 L28,52 L8,28 Z" fill="none" stroke={BLUE} strokeWidth="1" opacity="0.5" />
          <circle cx="28" cy="28" r="8" fill="none" stroke={TERRA} strokeWidth="1" opacity="0.5" />
          <circle cx="0" cy="0" r="4" fill={BLUE} opacity="0.25" />
          <circle cx="56" cy="0" r="4" fill={BLUE} opacity="0.25" />
          <circle cx="0" cy="56" r="4" fill={BLUE} opacity="0.25" />
          <circle cx="56" cy="56" r="4" fill={BLUE} opacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
  );
}

function Divider({ color = BLUE }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
      <span className="h-px w-14" style={{ background: `linear-gradient(90deg,transparent,${color})` }} />
      <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: TERRA }} />
      <span className="h-px w-14" style={{ background: `linear-gradient(270deg,transparent,${color})` }} />
    </div>
  );
}

const TIMELINE_ICONS = [Coffee, Flower2, UtensilsCrossed, Music4];

export default function Zellige({ template }: { template: Template }) {
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
    target.setDate(target.getDate() + 120);
    target.setHours(17, 30, 0, 0);
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
    () => Array.from({ length: 10 }, (_, i) => ({ left: (i * 41 + 9) % 100, delay: (i * 1.4) % 12, dur: 12 + (i % 5) * 2 })),
    []
  );

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("opened"), 1500);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: BLUE_DEEP }}>
      <button onClick={() => router.push("/#modeles")} aria-label="Retour aux modèles" className="fixed top-5 left-5 z-[70] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors duration-200 cursor-pointer">
        <ArrowLeft size={17} style={{ color: BLUE }} />
      </button>
      <button onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? "Couper le son" : "Activer le son"} className="fixed top-5 right-5 z-[70] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors duration-200 cursor-pointer">
        {soundOn ? <Volume2 size={16} style={{ color: BLUE }} /> : <VolumeX size={16} className="opacity-40" />}
      </button>

      {/* ═══════ INTRO : PORTE À DEUX BATTANTS SUR SES GONDS ═══════ */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="zellige-door-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(175deg, #E9E2CE 0%, #DED4B8 60%, #CFC29E 100%)" }}
          >
            <Bougainvillea className="absolute left-0 top-0 h-[68vh] opacity-90" />
            <Bougainvillea className="absolute right-0 top-8 h-[58vh] opacity-80" flip />

            <div
              className="relative cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Ouvrir la porte"
              onClick={handleOpen}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
              style={{ perspective: "1000px" }}
            >
              {/* arche blanchie à la chaux */}
              <div
                className="relative w-64 md:w-72 overflow-hidden shadow-2xl"
                style={{ height: "min(64vh, 460px)", borderRadius: "8rem 8rem 0.4rem 0.4rem", backgroundColor: WHITE_WASH, padding: "9px" }}
              >
                <div className="absolute inset-0 opacity-25" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(160,150,120,0.15) 5px, rgba(160,150,120,0.15) 6px)" }} />
                {/* zellige visible dans l'entrebâillement dès le départ (fond de scène) */}
                <div className="absolute inset-[9px] rounded-[7.4rem_7.4rem_0.3rem_0.3rem] overflow-hidden">
                  <ZelligePattern opacity={0.7} />
                  <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, transparent 20%, rgba(20,50,90,0.25) 100%)" }} />
                </div>

                {/* battants de porte, pivotent sur charnière extérieure */}
                <div className="absolute inset-[9px] flex" style={{ borderRadius: "7.4rem 7.4rem 0.3rem 0.3rem", overflow: "visible" }}>
                  {[true, false].map((isLeft) => (
                    <motion.div
                      key={isLeft ? "l" : "r"}
                      className="w-1/2 h-full relative shadow-xl"
                      style={{ transformOrigin: isLeft ? "left center" : "right center", transformStyle: "preserve-3d" }}
                      initial={false}
                      animate={
                        phase === "opening"
                          ? { rotateY: isLeft ? -108 : 108 }
                          : { rotateY: 0 }
                      }
                      transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
                    >
                      <DoorPanel isLeft={isLeft} />
                      {/* ombre portée sur le battant selon l'angle */}
                      <div className="absolute inset-0" style={{ background: `linear-gradient(${isLeft ? 90 : 270}deg, rgba(0,0,0,0.25), transparent 60%)` }} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.p animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.2, repeat: Infinity }} className="mt-8 text-[11px] uppercase tracking-[0.45em] text-center" style={{ color: BLUE_DEEP }}>
                Ouvrir la porte
              </motion.p>
              <p className="mt-1 text-[9px] text-center opacity-50" style={{ color: BLUE_DEEP }}>Sidi Bou Saïd vous attend</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ HERO : COUR ZELLIGE ═══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {hasImage ? (
          <>
            {/* Fond photo 4K + ken-burns lent */}
            <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1.02 }} transition={{ duration: 22, ease: "easeOut" }}>
              <img src={template.image} alt="" onError={() => setImgOk(false)} className="w-full h-full object-cover object-center" />
            </motion.div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,61,112,0.35) 0%, transparent 30%, rgba(14,61,112,0.55) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(175deg, #EAF2F7 0%, #D8E6EF 50%, #F3E7D6 100%)` }}>
            <ZelligePattern opacity={0.35} />
          </div>
        )}
        <Bougainvillea className="absolute top-0 left-0 w-32 md:w-44 opacity-70" />
        <Bougainvillea className="absolute top-0 right-0 w-32 md:w-44 opacity-70" flip />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {petals.map((p, i) => (
            <span key={i} className="petal-particle absolute -top-8" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0 C10.5 3 10.5 8 7 14 C3.5 8 3.5 3 7 0 Z" fill={TERRA} opacity="0.5" /></svg>
            </span>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={phase === "opened" ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.9 }} className="relative text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 flex items-center justify-center" style={{ borderColor: hasImage ? "#FFFFFF" : BLUE, backgroundColor: hasImage ? "rgba(255,255,255,0.12)" : "transparent" }}>
            <span className="font-script text-2xl" style={{ color: hasImage ? "#FFFFFF" : BLUE }}>{t.bride[0]}&{t.groom[0]}</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.55em] mb-5" style={{ color: hasImage ? "rgba(255,255,255,0.8)" : `${BLUE}99` }}>Vous êtes invités au mariage de</p>
          <h1 className="font-script leading-tight" style={hasImage
            ? { color: "#FFFFFF", fontSize: "clamp(3.4rem, 11vw, 6.5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.4)" }
            : { ...goldText(BLUE), fontSize: "clamp(3.4rem, 11vw, 6.5rem)" }}>
            {t.bride} <span className="opacity-60">&amp;</span> {t.groom}
          </h1>
          <Divider />
          <p className="font-serif-elegant text-lg" style={{ color: hasImage ? "rgba(255,255,255,0.9)" : `${BLUE_DEEP}CC` }}>{t.date} · {t.city}</p>
        </motion.div>
      </section>

      {/* ═══════ MESSAGE ═══════ */}
      <section className="relative py-24 px-6 text-center" style={{ backgroundColor: CREAM }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }} className="max-w-md mx-auto">
          <h2 className="font-script text-5xl mb-2" style={{ color: BLUE }}>Notre histoire</h2>
          <Divider />
          {t.story.map((s, i) => (
            <p key={i} className="font-serif-elegant text-lg leading-relaxed mt-6" style={{ color: `${BLUE_DEEP}CC` }}>{s.text}</p>
          ))}
        </motion.div>
      </section>

      {/* ═══════ COUNTDOWN ═══════ */}
      <section className="relative py-20 px-6" style={{ background: "linear-gradient(180deg,#EAF2F7,#DCE9F0)" }}>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-8" style={{ color: `${BLUE}88` }}>Le grand jour approche</p>
          <div className="flex justify-center gap-4">
            {[[countdown.days, "Jours"], [countdown.hours, "Heures"], [countdown.minutes, "Minutes"], [countdown.seconds, "Secondes"]].map(([v, l]) => (
              <div key={l as string} className="w-16 md:w-20 py-4 rounded-xl border" style={{ borderColor: `${BLUE}33`, backgroundColor: "rgba(255,255,255,0.6)" }}>
                <div className="font-serif-elegant text-3xl tabular-nums" style={{ color: BLUE }}>{String(v).padStart(2, "0")}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: `${BLUE_DEEP}88` }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROGRAMME ═══════ */}
      <section className="relative py-24 px-6" style={{ backgroundColor: CREAM }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-script text-5xl mb-2" style={{ color: BLUE }}>Programme</h2>
            <Divider />
          </div>
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${BLUE}55 12%,${BLUE}55 88%,transparent)` }} />
            <div className="space-y-12">
              {t.program.map((p, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }} className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 relative z-10" style={{ borderColor: `${BLUE}55`, backgroundColor: CREAM }}>
                      <Icon size={17} style={{ color: BLUE }} strokeWidth={1.4} />
                    </div>
                    <div>
                      <p className="font-serif-elegant text-xl" style={{ color: TERRA }}>{p.time}</p>
                      <h3 className="font-serif-elegant font-semibold text-lg" style={{ color: BLUE_DEEP }}>{p.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: `${BLUE_DEEP}80` }}>{p.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ LIEU ═══════ */}
      <section className="relative py-24 px-6 text-center overflow-hidden" style={{ background: "linear-gradient(180deg,#DCE9F0,#EAF2F7)" }}>
        <ZelligePattern opacity={0.25} />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="relative">
          <MapPin size={24} className="mx-auto mb-3" style={{ color: BLUE }} strokeWidth={1.5} />
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-semibold" style={{ color: BLUE_DEEP }}>{t.lieu}</h2>
          <p className="mt-2 font-serif-elegant text-lg" style={{ color: `${BLUE_DEEP}AA` }}>{t.city} · {t.time}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
            target="_blank" rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer shadow-lg"
            style={{ backgroundColor: BLUE }}
          >
            Voir l'itinéraire
          </a>
        </motion.div>
      </section>

      {/* ═══════ RSVP ═══════ */}
      {!t.hideRsvp && (
        <section className="relative py-28 px-6 text-center" style={{ backgroundColor: CREAM }}>
          <div className="max-w-md mx-auto">
            <h2 className="font-script text-5xl mb-2" style={{ color: BLUE }}>Serez-vous des nôtres ?</h2>
            <Divider />
            <p className="text-sm mb-9" style={{ color: `${BLUE_DEEP}99` }}>Merci de confirmer avant le 1er mai</p>
            {rsvp === null ? (
              <div className="flex gap-4 justify-center">
                <button onClick={() => setRsvp("yes")} className="px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer" style={{ backgroundColor: BLUE }}>Avec joie</button>
                <button onClick={() => setRsvp("no")} className="px-8 py-3.5 rounded-full text-sm border transition-colors duration-200 hover:bg-black/5 cursor-pointer" style={{ borderColor: `${BLUE}44`, color: BLUE_DEEP }}>Malheureusement non</button>
              </div>
            ) : (
              <motion.p initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2" style={{ color: BLUE_DEEP }}>
                <Check size={18} style={{ color: BLUE }} /> {rsvp === "yes" ? "Merci ! Nous avons hâte de vous voir." : "Merci de nous avoir prévenus."}
              </motion.p>
            )}
          </div>
        </section>
      )}

      <footer className="py-12 text-center relative" style={{ backgroundColor: CREAM }}>
        <p className="font-script text-3xl mb-2" style={{ color: `${BLUE}BB` }}>{t.bride} & {t.groom}</p>
        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${BLUE_DEEP}55` }}>{t.date} · {t.lieu}</p>
        <p className="text-xs mt-5" style={{ color: `${BLUE_DEEP}55` }}>
          Invitation digitale par <FarhtyLink className="underline hover:opacity-70 transition-opacity" />
        </p>
      </footer>
    </main>
  );
}
