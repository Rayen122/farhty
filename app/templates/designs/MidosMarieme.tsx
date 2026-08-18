"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, VolumeX, MapPin } from "lucide-react";
import type { Template } from "../data";

/* Palette relevée sur la référence : papier crème, lavis chaud en haut,
   verts sourds du paysage à l'aquarelle. Aucun accent saturé — la retenue
   est ce qui distingue ce style des autres modèles. */
const PAPER = "#F7F2E7";
const PAPER_WARM = "#F0E4D2";
const WASH = "#EBD7BE";
const SAGE = "#8B9B7A";
const OLIVE = "#5A6B4C";
const FOREST = "#3E4B36";
const INK = "#4A4034";
const SAND = "#B9975B";

/* La feuille de style bascule .font-script sur Amiri en RTL : on impose donc
   les familles ici, et on isole les blocs latins en LTR. */
const script: React.CSSProperties = { fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" };
const serif: React.CSSProperties = { fontFamily: "var(--font-cormorant), 'Cormorant Infant', serif" };

/** Grain du papier — un bruit fin suffit à casser l'aplat numérique. */
function PaperGrain() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.055] mix-blend-multiply" aria-hidden>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/** Paysage à l'aquarelle : bosquet, prairie, quelques herbes. */
function WatercolourLandscape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 190" className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ml-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SAGE} stopOpacity="0.42" />
          <stop offset="100%" stopColor={OLIVE} stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* Bosquet */}
      <g opacity="0.75">
        <ellipse cx="52" cy="96" rx="46" ry="34" fill={FOREST} opacity="0.5" />
        <ellipse cx="96" cy="86" rx="40" ry="30" fill={OLIVE} opacity="0.55" />
        <ellipse cx="140" cy="98" rx="34" ry="26" fill={SAGE} opacity="0.5" />
        <ellipse cx="24" cy="108" rx="30" ry="22" fill={OLIVE} opacity="0.4" />
      </g>

      {/* Prairie */}
      <path d="M0 118 Q120 100 240 116 T480 108 L480 190 L0 190 Z" fill="url(#ml-meadow)" />
      <path d="M0 138 Q140 124 280 140 T480 132 L480 190 L0 190 Z" fill={OLIVE} opacity="0.14" />

      {/* Herbes */}
      <g stroke={FOREST} strokeWidth="1.6" strokeLinecap="round" opacity="0.42" fill="none">
        {[402, 418, 432, 446, 462].map((x, i) => (
          <path key={x} d={`M${x} 172 Q${x + (i % 2 ? 6 : -6)} ${150 - i * 4} ${x + (i % 2 ? 10 : -10)} ${132 - i * 5}`} />
        ))}
        {[26, 44, 60].map((x, i) => (
          <path key={x} d={`M${x} 176 Q${x + (i % 2 ? 5 : -5)} 158 ${x + (i % 2 ? 9 : -9)} 144`} />
        ))}
      </g>

      {/* Taches de sable, comme les pigments qui granulent */}
      <g fill={SAND} opacity="0.3">
        {[[188, 150], [206, 162], [318, 146], [336, 158], [268, 168]].map(([cx, cy]) => (
          <circle key={`${cx}`} cx={cx} cy={cy} r="2.4" />
        ))}
      </g>
    </svg>
  );
}

/** Lavis chaud en haut de page, comme sur le papier de la référence. */
function TopWash() {
  return (
    <svg viewBox="0 0 480 160" className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <radialGradient id="ml-wash" cx="55%" cy="12%" r="70%">
          <stop offset="0%" stopColor={WASH} stopOpacity="0.75" />
          <stop offset="60%" stopColor={PAPER_WARM} stopOpacity="0.35" />
          <stop offset="100%" stopColor={PAPER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="160" fill="url(#ml-wash)" />
    </svg>
  );
}

/** Filet séparateur : un trait fin et un losange, rien de plus. */
function Rule() {
  return (
    <div className="my-9 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16" style={{ background: SAND, opacity: 0.55 }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ background: SAND, opacity: 0.7 }} />
      <span className="h-px w-16" style={{ background: SAND, opacity: 0.55 }} />
    </div>
  );
}

function Caps({ children, className = "", size = "text-[11px]" }: { children: React.ReactNode; className?: string; size?: string }) {
  return (
    <p className={`${size} uppercase ${className}`} style={{ ...serif, letterSpacing: "0.34em", color: INK }}>
      {children}
    </p>
  );
}

export default function MidosMarieme({ template }: { template: Template }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "card">("intro");
  const [soundOn, setSoundOn] = useState(false);
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const t = template.previewText;

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 96);
    target.setHours(18, 0, 0, 0);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const dateParts = useMemo(() => (t.date || "").split(" ").filter(Boolean), [t.date]);

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: PAPER, color: INK }}>
      <PaperGrain />

      <button
        onClick={() => router.push("/#templates")}
        aria-label="Retour aux modèles"
        className="fixed left-5 top-5 z-[70] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: OLIVE }}
      >
        <ArrowLeft size={17} style={{ color: INK }} />
      </button>
      <button
        onClick={() => setSoundOn(!soundOn)}
        aria-label={soundOn ? "Couper le son" : "Activer le son"}
        aria-pressed={soundOn}
        className="fixed right-5 top-5 z-[70] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: OLIVE }}
      >
        {soundOn ? <Volume2 size={16} style={{ color: INK }} /> : <VolumeX size={16} style={{ color: INK, opacity: 0.45 }} />}
      </button>

      {/* ═══ Ouverture : la vidéo de la demande, puis le papier ═══ */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="ml-intro"
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-end overflow-hidden bg-[#151810]"
          >
            <video
              src="/videos/midos-marieme.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted={!soundOn}
              playsInline
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onEnded={() => setPhase("card")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            <div className="relative z-10 w-full px-8 pb-16 text-center" dir="ltr">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="mb-4 text-[10px] uppercase text-white/65"
                style={{ ...serif, letterSpacing: "0.4em" }}
              >
                It will always be you
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.1 }}
                className="mb-9 text-white"
                style={{ ...script, fontSize: "clamp(2.75rem,11vw,4.5rem)", lineHeight: 1.05 }}
              >
                {t.groom} <span style={{ ...serif, fontSize: "0.42em", letterSpacing: "0.2em" }}>and</span> {t.bride}
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.9 }}
                onClick={() => setPhase("card")}
                className="cursor-pointer rounded-full px-10 py-3.5 text-[11px] uppercase shadow-lg transition-colors duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ ...serif, letterSpacing: "0.3em", backgroundColor: PAPER, color: INK, outlineColor: PAPER }}
              >
                Ouvrir
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ La carte ═══ */}
      <section className="relative mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center px-8 pb-52 pt-28 text-center">
        <TopWash />

        <div className="relative z-10" dir="ltr">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1 }}
            style={{ ...script, fontSize: "clamp(3rem,13vw,5.25rem)", lineHeight: 1.02, color: INK }}
          >
            {t.groom}
            <span className="mx-3 align-middle" style={{ ...serif, fontSize: "0.26em", letterSpacing: "0.22em" }}>
              and
            </span>
            {t.bride}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1, delay: 0.3 }}
          className="relative z-10 mt-8"
          dir="ltr"
        >
          <Caps size="text-[11px] sm:text-xs">Invite you to their wedding</Caps>

          <div className="mt-7 flex items-center justify-center gap-3" style={{ ...serif }}>
            {dateParts.map((part, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span style={{ color: SAND, opacity: 0.7 }}>|</span>}
                <span className="text-sm uppercase sm:text-base" style={{ letterSpacing: "0.2em", color: INK }}>
                  {part}
                </span>
              </span>
            ))}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed" style={{ ...serif, color: INK, opacity: 0.8 }}>
            {t.time}
            <br />
            {t.lieu}
            <br />
            {t.city}
          </p>

          <p className="mt-6" style={{ ...script, fontSize: "1.5rem", color: OLIVE }}>
            reception to follow
          </p>
        </motion.div>

        <WatercolourLandscape className="pointer-events-none absolute inset-x-0 bottom-0 h-52 w-full" />
      </section>

      {/* ═══ Compte à rebours ═══ */}
      <section className="relative px-8 py-16 text-center" style={{ backgroundColor: PAPER_WARM }}>
        <Caps className="opacity-70">Le grand jour approche</Caps>
        <div className="mt-6 flex items-center justify-center gap-8" dir="ltr">
          {([["jours", countdown.days], ["heures", countdown.hours], ["minutes", countdown.minutes]] as const).map(
            ([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="tabular-nums" style={{ ...serif, fontSize: "2.25rem", color: FOREST }}>
                  {String(value).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[10px] uppercase" style={{ ...serif, letterSpacing: "0.26em", color: INK, opacity: 0.6 }}>
                  {label}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      {/* ═══ Histoire ═══ */}
      <section className="relative px-8 py-20">
        <div className="mx-auto max-w-[52ch] text-center">
          <Caps className="opacity-70">Notre histoire</Caps>
          <Rule />
          <div className="space-y-10 text-start">
            {t.story?.map((chapter, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: reduceMotion ? 0 : 0.7, delay: i * 0.08 }}
              >
                <h3 className="mb-2 text-lg" style={{ ...serif, color: FOREST }}>
                  {chapter.title}
                </h3>
                <p className="text-[15px] leading-[1.75]" style={{ ...serif, color: INK, opacity: 0.82 }}>
                  {chapter.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Programme ═══ */}
      <section className="relative px-8 py-20" style={{ backgroundColor: PAPER_WARM }}>
        <div className="mx-auto max-w-[46ch] text-center">
          <Caps className="opacity-70">Le programme</Caps>
          <Rule />
          <ul className="space-y-6 text-start">
            {t.program?.map((item, i) => (
              <li key={i} className="flex items-baseline gap-5">
                <span className="shrink-0 tabular-nums text-sm" style={{ ...serif, color: SAND, letterSpacing: "0.1em" }} dir="ltr">
                  {item.time}
                </span>
                <span className="flex-1">
                  <span className="block text-base" style={{ ...serif, color: FOREST }}>
                    {item.title}
                  </span>
                  {item.desc && (
                    <span className="block text-[14px] leading-relaxed" style={{ ...serif, color: INK, opacity: 0.7 }}>
                      {item.desc}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ Lieu ═══ */}
      <section className="relative px-8 py-20 text-center">
        <Caps className="opacity-70">Le lieu</Caps>
        <Rule />
        <p style={{ ...script, fontSize: "2.5rem", color: FOREST }}>{t.lieu}</p>
        <p className="mt-1 text-sm" style={{ ...serif, color: INK, opacity: 0.7 }}>
          {t.city}
        </p>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(`${t.lieu} ${t.city}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-8 text-[11px] uppercase transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ ...serif, letterSpacing: "0.26em", borderColor: SAND, color: INK, outlineColor: OLIVE }}
        >
          <MapPin size={14} style={{ color: SAND }} />
          Itinéraire
        </a>
      </section>

      {/* ═══ Confirmation ═══ */}
      <section className="relative overflow-hidden px-8 pb-40 pt-20 text-center" style={{ backgroundColor: PAPER_WARM }}>
        <Caps className="opacity-70">Confirmez votre présence</Caps>
        <Rule />

        {rsvp === null ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setRsvp("yes")}
              className="min-h-11 cursor-pointer rounded-full px-9 text-[11px] uppercase text-white shadow-sm transition-colors duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ ...serif, letterSpacing: "0.26em", backgroundColor: FOREST, outlineColor: FOREST }}
            >
              Je serai là
            </button>
            <button
              onClick={() => setRsvp("no")}
              className="min-h-11 cursor-pointer rounded-full border bg-white/70 px-9 text-[11px] uppercase transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ ...serif, letterSpacing: "0.26em", borderColor: SAND, color: INK, outlineColor: OLIVE }}
            >
              Je ne pourrai pas
            </button>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...script, fontSize: "2rem", color: FOREST }}
            role="status"
          >
            {rsvp === "yes" ? "Merci, nous vous attendons" : "Vous nous manquerez"}
          </motion.p>
        )}

        <WatercolourLandscape className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-70" />
      </section>
    </main>
  );
}
