"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, MapPin, Flower2, Wine, UtensilsCrossed, Music4, Check } from "lucide-react";
import type { Template } from "../data";

const SAGE = "#8A7B5C";
const SAGE_DEEP = "#5F5A42";
const BLUSH = "#C9A89A";
const CREAM = "#EFEADD";
const INK = "#4A4636";

/* ─── Callas / fleurs SVG (fallback décor) ─── */
function LilyCluster({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 160 200" className={`${className} ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      {/* feuillage */}
      <path d="M30,200 C20,150 40,110 70,80 M60,200 C70,150 90,120 120,95" stroke="#7C8A5E" strokeWidth="2.5" fill="none" opacity="0.55" />
      {[[40, 150, 20], [56, 120, -18], [96, 120, 22], [110, 150, -16]].map(([x, y, r], i) => (
        <path key={i} d="M0,0 C-16,-6 -18,-30 0,-44 C18,-30 16,-6 0,0 Z" fill="#8AA06A" opacity="0.4" transform={`translate(${x},${y}) rotate(${r})`} />
      ))}
      {/* callas (blanc crème) */}
      {[[50, 96, -22], [80, 78, 4], [110, 96, 22]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <path d="M0,0 C-20,-14 -16,-52 0,-62 C16,-52 20,-14 0,0 Z" fill="#F6F1E6" stroke="#E4DAC6" strokeWidth="1" />
          <path d="M0,-6 L2,-46" stroke="#D9B96A" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      {/* hortensias blush */}
      {Array.from({ length: 9 }, (_, i) => {
        const ang = (i / 9) * Math.PI * 2;
        return <circle key={i} cx={34 + Math.cos(ang) * 12} cy={160 + Math.sin(ang) * 12} r="4.5" fill={i % 2 ? "#DCC7BE" : "#E8DAD2"} opacity="0.85" />;
      })}
    </svg>
  );
}

/* ─── Fontaine SVG (fallback) ─── */
function Fountain({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden>
      <g stroke="#B6AE92" strokeWidth="1.5" fill="#CFC7AC" opacity="0.9">
        <ellipse cx="100" cy="205" rx="80" ry="14" />
        <path d="M40,205 Q100,180 160,205" fill="#C4BB9E" />
        <rect x="92" y="120" width="16" height="70" rx="3" />
        <ellipse cx="100" cy="120" rx="46" ry="10" />
        <rect x="96" y="70" width="8" height="52" rx="2" />
        <ellipse cx="100" cy="70" rx="26" ry="7" />
        <circle cx="100" cy="56" r="8" />
      </g>
      {/* eau */}
      {[[72, 122], [128, 122], [84, 74], [116, 74]].map(([x, y], i) => (
        <motion.path key={i} d={`M${x},${y} q-3,20 0,40`} stroke="#DCE6E0" strokeWidth="2" fill="none" opacity="0.6"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2 + (i % 3), repeat: Infinity }} />
      ))}
    </svg>
  );
}

/* ─── Pétales flottants ─── */
function Petals({ count = 12 }: { count?: number }) {
  const petals = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: (i * 41 + 7) % 100, delay: (i * 1.3) % 14, dur: 12 + (i % 5) * 2.4, scale: 0.5 + ((i * 7) % 10) / 12,
    color: i % 3 === 0 ? "#E8DAD2" : i % 3 === 1 ? "#DCC7BE" : "#F0E9DC",
  })), [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[3]" aria-hidden>
      {petals.map((p, i) => (
        <span key={i} className="petal-particle absolute -top-8" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, transform: `scale(${p.scale})` }}>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0 C12 4 12 10 8 16 C4 10 4 4 8 0 Z" fill={p.color} opacity="0.7" /></svg>
        </span>
      ))}
    </div>
  );
}

function Divider({ color = SAGE }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
      <span className="h-px w-12" style={{ background: `linear-gradient(90deg,transparent,${color})` }} />
      <Flower2 size={14} style={{ color }} />
      <span className="h-px w-12" style={{ background: `linear-gradient(270deg,transparent,${color})` }} />
    </div>
  );
}

const TIMELINE_ICONS = [Flower2, Wine, UtensilsCrossed, Music4];

export default function JardinVintage({ template }: { template: Template }) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);
  const heroRef = useRef<HTMLElement>(null);

  const t = template.previewText;
  const hasImage = !!template.image && imgOk;

  // parallax souris
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, [-1, 1], [-14, 14]);
  const bgY = useTransform(sy, [-1, 1], [-10, 10]);
  const frontX = useTransform(sx, [-1, 1], [22, -22]);
  const frontY = useTransform(sy, [-1, 1], [14, -14]);

  // parallax scroll
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 700);
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearTimeout(id); window.removeEventListener("mousemove", onMove); };
  }, [mx, my]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: INK }}>
      <button onClick={() => router.push("/#modeles")} aria-label="Retour aux modèles"
        className="fixed top-5 left-5 z-[70] w-10 h-10 rounded-full bg-white/70 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors duration-200 cursor-pointer">
        <ArrowLeft size={17} style={{ color: SAGE_DEEP }} />
      </button>
      <button onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? "Couper le son" : "Activer le son"}
        className="fixed top-5 right-5 z-[70] w-10 h-10 rounded-full bg-white/70 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors duration-200 cursor-pointer">
        {soundOn ? <Volume2 size={16} style={{ color: SAGE_DEEP }} /> : <VolumeX size={16} className="opacity-40" style={{ color: INK }} />}
      </button>

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Fond peint (image) + ken burns, ou fallback scène */}
        <motion.div className="absolute inset-0 z-[1]" style={{ x: bgX, y: bgY, scale: 1.1 }}>
          {hasImage ? (
            <motion.img
              src={template.image} alt="" onError={() => setImgOk(false)}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.12 }} animate={{ scale: 1.02 }} transition={{ duration: 20, ease: "easeOut" }}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(175deg, #E4E1D0 0%, #D2D2BC 40%, #BFC1A6 70%, #ADB394 100%)" }}>
              {/* rideaux drapés haut */}
              <div className="absolute top-0 left-0 right-0 h-40" style={{ background: "linear-gradient(180deg, rgba(220,214,190,0.9), transparent)" }} />
              {/* amarante suspendue */}
              {[12, 30, 50, 70, 88].map((x, i) => (
                <div key={i} className="absolute top-0 w-1 rounded-b-full" style={{ left: `${x}%`, height: `${70 + (i % 3) * 30}px`, background: "linear-gradient(180deg,#C8A79C,#B98F86)", opacity: 0.5 }} />
              ))}
              <Fountain className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 opacity-90" />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 45%, transparent 40%, rgba(95,90,66,0.25) 100%)" }} />
            </div>
          )}
        </motion.div>

        {/* florals coins (parallax avant) */}
        <motion.div className="absolute inset-0 z-[4] pointer-events-none" style={{ x: frontX, y: frontY }}>
          <LilyCluster className="absolute -top-4 -left-6 w-40 md:w-52" />
          <LilyCluster className="absolute -top-4 -right-6 w-40 md:w-52" flip />
          <LilyCluster className="absolute -bottom-6 -left-8 w-44 md:w-56 rotate-12" flip />
          <LilyCluster className="absolute -bottom-6 -right-8 w-44 md:w-56 -rotate-12" />
        </motion.div>

        <Petals />

        {/* voile lisibilité */}
        <div className="absolute inset-0 z-[5]" style={{ background: "linear-gradient(180deg, rgba(240,236,222,0.25) 0%, transparent 30%, rgba(95,90,66,0.35) 100%)" }} />

        {/* ── Enveloppe + carte qui monte ── */}
        <motion.div className="absolute inset-0 z-10 flex items-center justify-center px-6" style={{ y: heroTextY, opacity: heroFade }}>
          <div className="relative" style={{ perspective: "1400px", width: "min(78vw, 340px)" }}>
            {/* CARTE dentelle (monte de l'enveloppe) */}
            <motion.div
              className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[92%] origin-bottom"
              initial={false}
              animate={revealed ? { y: "-46%", opacity: 1 } : { y: "8%", opacity: 0.4 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ zIndex: 5 }}
            >
              <div className="relative rounded-[14px] px-6 py-9 text-center shadow-2xl"
                style={{ background: "linear-gradient(160deg,#FBF7EE,#F1EADB)", border: "1px solid #E2D8C2", boxShadow: "0 20px 50px rgba(75,70,54,0.25)" }}>
                {/* bord dentelle */}
                <div className="absolute inset-1.5 rounded-[10px] pointer-events-none" style={{ border: `1.5px dashed ${BLUSH}` }} />
                <p className="text-[9px] uppercase tracking-[0.45em] mb-4" style={{ color: SAGE }}>The Wedding of</p>
                <h1 className="font-script leading-[1.05]" style={{ color: SAGE_DEEP, fontSize: "clamp(2.6rem,10vw,3.6rem)" }}>{t.bride}</h1>
                <p className="font-script text-2xl my-1" style={{ color: BLUSH }}>&amp;</p>
                <h1 className="font-script leading-[1.05]" style={{ color: SAGE_DEEP, fontSize: "clamp(2.6rem,10vw,3.6rem)" }}>{t.groom}</h1>
                <Divider />
                <p className="text-xs tracking-[0.3em]" style={{ color: SAGE }}>{t.date.replace(/ /g, " . ").toUpperCase()}</p>
              </div>
            </motion.div>

            {/* ENVELOPPE */}
            <div className="relative aspect-[4/5] w-full rounded-[10px] shadow-xl overflow-hidden"
              style={{ background: "linear-gradient(160deg,#EFE7D6,#E0D4BC)", border: "1px solid #D8CBB0" }}>
              <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(200,185,150,0.15) 3px,rgba(200,185,150,0.15) 4px)" }} />
              {/* poche V */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden>
                <path d="M0,40 L50,88 L100,40" fill="none" stroke="#CDBE9E" strokeWidth="1" />
                <path d="M0,125 L50,80 L100,125 Z" fill="#E7DCC4" opacity="0.6" />
              </svg>
              {/* rabat (s'ouvre) */}
              <motion.div className="absolute top-0 left-0 right-0 origin-top"
                style={{ height: "48%", transformStyle: "preserve-3d", zIndex: revealed ? 1 : 8 }}
                initial={false} animate={revealed ? { rotateX: -172 } : { rotateX: 0 }}
                transition={{ duration: 0.9, ease: [0.6, 0, 0.3, 1] }}>
                <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
                  <path d="M0,0 L100,0 L50,58 Z" fill="#EAE0CB" stroke="#D2C4A6" strokeWidth="0.6" />
                </svg>
                {/* sceau de cire */}
                <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow"
                  style={{ background: `radial-gradient(circle at 35% 30%, ${BLUSH}, #A87668)` }}>
                  <span className="font-script text-sm text-white/90">{t.bride[0]}{t.groom[0]}</span>
                </div>
              </motion.div>
            </div>

            {!revealed && (
              <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-9 left-0 right-0 text-center text-[10px] uppercase tracking-[0.4em]" style={{ color: CREAM }}>
L'invitation s'ouvre…
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20" style={{ opacity: heroFade }}
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <div className="w-6 h-10 rounded-full border flex items-start justify-center pt-2" style={{ borderColor: `${CREAM}` }}>
            <span className="w-1 h-2 rounded-full" style={{ background: CREAM }} />
          </div>
        </motion.div>
      </section>

      {/* ═══════ MESSAGE ═══════ */}
      <section className="relative py-24 px-6" style={{ backgroundColor: CREAM }}>
        <LilyCluster className="absolute top-4 right-2 w-28 opacity-60" flip />
        <div className="max-w-md mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }}>
            <h2 className="font-script text-5xl mb-1" style={{ color: SAGE_DEEP }}>Notre histoire</h2>
            <Divider />
            {t.story.map((s, i) => (
              <p key={i} className="font-serif-elegant text-lg leading-relaxed mt-6" style={{ color: `${INK}CC` }}>{s.text}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ PROGRAMME ═══════ */}
      <section className="relative py-24 px-6" style={{ background: "linear-gradient(180deg,#E7E2D2,#DCD8C4)" }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-script text-5xl mb-1" style={{ color: SAGE_DEEP }}>Programme</h2>
            <Divider />
          </div>
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${SAGE}66 12%,${SAGE}66 88%,transparent)` }} />
            <div className="space-y-12">
              {t.program.map((p, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }} className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 relative z-10" style={{ borderColor: `${SAGE}66`, backgroundColor: CREAM }}>
                      <Icon size={17} style={{ color: SAGE }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-serif-elegant text-xl" style={{ color: BLUSH }}>{p.time}</p>
                      <h3 className="font-serif-elegant font-semibold text-lg" style={{ color: SAGE_DEEP }}>{p.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: `${INK}88` }}>{p.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ LIEU ═══════ */}
      <section className="relative py-24 px-6 text-center" style={{ backgroundColor: CREAM }}>
        <LilyCluster className="absolute bottom-0 left-0 w-32 opacity-50" />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="relative">
          <MapPin size={24} className="mx-auto mb-3" style={{ color: SAGE }} strokeWidth={1.5} />
          <h2 className="font-script text-4xl" style={{ color: SAGE_DEEP }}>{t.lieu}</h2>
          <p className="mt-2 font-serif-elegant text-lg" style={{ color: `${INK}AA` }}>{t.city} · {t.time}</p>
          <button className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer" style={{ backgroundColor: SAGE }}>
Voir l'itinéraire
          </button>
        </motion.div>
      </section>

      {/* ═══════ RSVP ═══════ */}
      <section className="relative py-28 px-6 text-center" style={{ background: "linear-gradient(180deg,#E7E2D2,#D6D2BE)" }}>
        <div className="max-w-md mx-auto">
          <h2 className="font-script text-5xl mb-1" style={{ color: SAGE_DEEP }}>Serez-vous des nôtres ?</h2>
          <Divider />
          <p className="text-sm mb-9" style={{ color: `${INK}99` }}>Merci de confirmer avant le 1er juillet</p>
          {rsvp === null ? (
            <div className="flex gap-4 justify-center">
              <button onClick={() => setRsvp("yes")} className="px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer" style={{ backgroundColor: SAGE }}>Avec joie</button>
              <button onClick={() => setRsvp("no")} className="px-8 py-3.5 rounded-full text-sm border transition-colors duration-200 hover:bg-black/5 cursor-pointer" style={{ borderColor: `${SAGE}55`, color: SAGE_DEEP }}>Malheureusement non</button>
            </div>
          ) : (
            <motion.p initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2" style={{ color: SAGE_DEEP }}>
              <Check size={18} style={{ color: SAGE }} /> {rsvp === "yes" ? "Merci ! Nous avons hâte de vous voir." : "Merci de nous avoir prévenus."}
            </motion.p>
          )}
        </div>
      </section>

      <footer className="py-12 text-center" style={{ backgroundColor: CREAM }}>
        <p className="font-script text-3xl" style={{ color: SAGE_DEEP }}>{t.bride} & {t.groom}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] mt-2" style={{ color: `${INK}66` }}>{t.date} · {t.lieu}</p>
        <p className="text-xs mt-5" style={{ color: `${INK}55` }}>
          Invitation digitale par <a href="https://farhty.tn" className="underline hover:opacity-70 transition-opacity">Farhty</a>
        </p>
      </footer>
    </main>
  );
}
