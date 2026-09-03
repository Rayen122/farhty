"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, MapPin, Star, Gem, UtensilsCrossed, Music4, Check } from "lucide-react";
import type { Template } from "../data";
import { FarhtyLink } from "../../components/FarhtyCredit";

const WINE = "#7A1730";
const WINE_DEEP = "#3D0F1C";
const WINE_DARK = "#1A050A";
const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F0D98C";

const goldText: React.CSSProperties = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, #9C7D22 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

/* ── Étoile najma à 8 branches, motif textile/bijou tunisien ── */
function NajmaStar({ size = 140, draw = false }: { size?: number; draw?: boolean }) {
  const points = useMemo(() => {
    const outer = 46, inner = 20, cx = 50, cy = 50;
    const pts: string[] = [];
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 8) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  }, []);

  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} aria-hidden>
      <defs>
        <linearGradient id="najmaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <motion.polygon
        points={points}
        fill="none"
        stroke="url(#najmaGrad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: draw ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      <circle cx="50" cy="50" r="8" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

/* ── Arche najma en fond (silhouette dorée fine) ── */
function ArchSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 380" className={className} aria-hidden fill="none">
      <path d="M20,380 L20,180 Q20,50 150,30 Q280,50 280,180 L280,380" stroke={GOLD} strokeWidth="1" opacity="0.35" />
      <path d="M40,380 L40,185 Q40,70 150,52 Q260,70 260,185 L260,380" stroke={GOLD} strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
      <span className="h-px w-14" style={{ background: `linear-gradient(90deg,transparent,${GOLD})` }} />
      <Star size={12} style={{ color: GOLD }} fill={GOLD} />
      <span className="h-px w-14" style={{ background: `linear-gradient(270deg,transparent,${GOLD})` }} />
    </div>
  );
}

const TIMELINE_ICONS = [Star, Gem, UtensilsCrossed, Music4];

export default function Keswa({ template }: { template: Template }) {
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
    target.setDate(target.getDate() + 160);
    target.setHours(19, 30, 0, 0);
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

  const sparks = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ left: (i * 31 + 7) % 100, top: (i * 53 + 11) % 90, delay: (i * 0.6) % 5 })),
    []
  );

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("opened"), 1400);
  };

  return (
    <main dir="rtl" className="min-h-screen text-white" style={{ background: `linear-gradient(160deg, ${WINE_DEEP} 0%, ${WINE_DARK} 60%, #100308 100%)` }}>
      <button onClick={() => router.push("/#modeles")} aria-label="Retour aux modèles" className="fixed top-5 left-5 z-[70] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer">
        <ArrowLeft size={17} style={{ color: GOLD }} />
      </button>
      <button onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? "Couper le son" : "Activer le son"} className="fixed top-5 right-5 z-[70] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer">
        {soundOn ? <Volume2 size={16} style={{ color: GOLD }} /> : <VolumeX size={16} className="text-white/40" />}
      </button>

      {/* ═══════ INTRO : ÉTOILE NAJMA QUI EXPLOSE EN IRIS ═══════ */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="keswa-star-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: WINE_DARK }}
          >
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${WINE}44 0%, ${WINE_DARK} 75%)` }} />
            <ArchSilhouette className="absolute h-[80vh] opacity-80" />
            {sparks.map((s, i) => (
              <motion.span
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ left: `${s.left}%`, top: `${s.top}%`, backgroundColor: GOLD_LIGHT }}
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.4, 0.6] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: s.delay }}
              />
            ))}

            <button
              onClick={handleOpen}
              className="relative flex flex-col items-center cursor-pointer"
              aria-label="افتح الدعوة"
            >
              <motion.div
                animate={
                  phase === "opening"
                    ? { scale: 26, rotate: 35, opacity: 0 }
                    : { scale: 1, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 1.2, ease: [0.6, 0, 0.35, 1] }}
              >
                <NajmaStar size={130} draw={true} />
              </motion.div>

              <motion.div
                animate={phase === "opening" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-2 flex flex-col items-center"
              >
                <p className="font-script text-3xl" style={goldText}>{t.bride} &amp; {t.groom}</p>
                <p className="mt-6 text-[11px] uppercase tracking-[0.45em] text-white/70">دوسو على النجمة</p>
                <p className="mt-1 text-[9px] text-white/40">باش تشوفو الدعوة</p>
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {hasImage ? (
          <>
            <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1.02 }} transition={{ duration: 22, ease: "easeOut" }}>
              <img src={template.image} alt="" onError={() => setImgOk(false)} className="w-full h-full object-cover object-center opacity-80" />
            </motion.div>
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${WINE_DARK}CC 0%, ${WINE_DEEP}66 35%, ${WINE_DARK} 100%)` }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 65% 55% at 50% 32%, ${WINE}33 0%, transparent 60%)` }} />
        )}
        <ArchSilhouette className="absolute h-[92vh] opacity-40" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={phase === "opened" ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.9 }} className="relative text-center">
          <NajmaStar size={70} draw={true} />
          <p className="mt-4 text-[10px] uppercase tracking-[0.55em] text-white/70">أنتم مدعوّون لحضور عرس</p>
          <h1 className="font-script mt-3 leading-tight" style={{ ...goldText, fontSize: "clamp(3.4rem, 11vw, 6.5rem)" }}>
            {t.bride} <span className="opacity-70">&amp;</span> {t.groom}
          </h1>
          <Divider />
          <p className="font-serif-elegant text-lg text-white/80">{t.date} · {t.city}</p>
        </motion.div>
      </section>

      {/* ═══════ MESSAGE ═══════ */}
      <section className="relative py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }} className="max-w-md mx-auto">
          <h2 className="font-script text-5xl mb-2" style={goldText}>قصّتنا</h2>
          <Divider />
          {t.story.map((s, i) => (
            <p key={i} className="font-serif-elegant text-lg leading-relaxed text-white/80 mt-6">{s.text}</p>
          ))}
        </motion.div>
      </section>

      {/* ═══════ COUNTDOWN ═══════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/50 mb-8">اليوم الكبير قرّب</p>
          <div className="flex justify-center gap-4">
            {[[countdown.days, "أيّام"], [countdown.hours, "ساعات"], [countdown.minutes, "دقائق"], [countdown.seconds, "ثواني"]].map(([v, l]) => (
              <div key={l as string} className="w-16 md:w-20 py-4 rounded-xl border" style={{ borderColor: `${GOLD}33`, background: "rgba(212,175,55,0.06)" }}>
                <div className="font-serif-elegant text-3xl tabular-nums" style={goldText}>{String(v).padStart(2, "0")}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/45 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROGRAMME ═══════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-script text-5xl mb-2" style={goldText}>البرنامج</h2>
            <Divider />
          </div>
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${GOLD}55 12%,${GOLD}55 88%,transparent)` }} />
            <div className="space-y-12">
              {t.program.map((p, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }} className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 relative z-10" style={{ borderColor: `${GOLD}66`, backgroundColor: WINE_DEEP }}>
                      <Icon size={16} style={{ color: GOLD }} strokeWidth={1.4} />
                    </div>
                    <div>
                      <p className="font-serif-elegant text-xl" style={goldText}>{p.time}</p>
                      <h3 className="font-serif-elegant text-lg text-white/90">{p.title}</h3>
                      <p className="text-xs text-white/50 mt-0.5">{p.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ LIEU ═══════ */}
      <section className="relative py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
          <MapPin size={24} className="mx-auto mb-3 text-[#D4AF37]" strokeWidth={1.5} />
          <h2 className="font-serif-elegant text-4xl md:text-5xl" style={goldText}>{t.lieu}</h2>
          <p className="text-white/70 mt-2 font-serif-elegant text-lg">{t.city} · {t.time}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
            target="_blank" rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer shadow-lg"
            style={{ backgroundColor: GOLD, color: WINE_DARK }}
          >
            شوف الطريق
          </a>
        </motion.div>
      </section>

      {/* ═══════ RSVP ═══════ */}
      {!t.hideRsvp && (
        <section className="relative py-28 px-6 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="font-script text-5xl mb-2" style={goldText}>شرّفونا بحضوركم</h2>
            <Divider />
            <p className="text-white/60 text-sm mb-9">أكّدولنا قبل 1 نوفمبر</p>
            {rsvp === null ? (
              <div className="flex gap-4 justify-center">
                <button onClick={() => setRsvp("yes")} className="px-8 py-3.5 rounded-full text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer" style={{ backgroundColor: GOLD, color: WINE_DARK }}>بكلّ فرح</button>
                <button onClick={() => setRsvp("no")} className="px-8 py-3.5 rounded-full text-sm border text-white/70 hover:bg-white/5 transition-colors duration-200 cursor-pointer" style={{ borderColor: `${GOLD}44` }}>للأسف لا</button>
              </div>
            ) : (
              <motion.p initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-white/80">
                <Check size={18} style={{ color: GOLD }} /> {rsvp === "yes" ? "شكراً، هذا شرف لينا." : "شكراً على الإعلام."}
              </motion.p>
            )}
          </div>
        </section>
      )}

      <footer className="py-12 text-center relative">
        <NajmaStar size={60} draw={true} />
        <p className="font-script text-3xl mt-2" style={goldText}>{t.bride} &amp; {t.groom}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-3">{t.date} · {t.lieu}</p>
        <p className="text-xs text-white/25 mt-6">
          دعوة رقمية من <FarhtyLink className="underline hover:text-white/50 transition-colors" />
        </p>
      </footer>
    </main>
  );
}
