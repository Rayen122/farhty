"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, VolumeX, MapPin } from "lucide-react";
import type { Template } from "../data";

/* Palette relevée sur la référence : papier crème, lavis chaud en haut,
   verts sourds du paysage à l'aquarelle. Aucun accent saturé — la retenue
   est ce qui distingue ce style des autres modèles. */
const PAPER = "#FBF9F3";      /* ivoire des tenues */
const PAPER_WARM = "#EAF4F7";  /* voile de ciel */
const WASH = "#8FCFE0";        /* ciel de midi */
const SAGE = "#7FA659";        /* prairie */
const OLIVE = "#5A7A3C";       /* prairie a l'ombre */
const FOREST = "#3F5A2E";      /* bosquet au fond */
const INK = "#2F4423";         /* texte : vert tres sombre, lisible sur ivoire */
const SAND = "#C97B4E";        /* terre cuite des batisses */

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

/**
 * Paysage à l'aquarelle.
 *
 * Les bords sont déformés par une turbulence : c'est ce qui distingue un lavis
 * d'un aplat vectoriel. Les lavis sont empilés en faible opacité pour que les
 * superpositions foncent d'elles-mêmes, comme un pigment qui se dépose.
 */
function WatercolourLandscape({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 480 200"
      className={className}
      preserveAspectRatio="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <defs>
        {/* Bords irréguliers : le lavis ne s'arrête jamais sur une ligne nette. */}
        <filter id="ml-bleed" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.05" numOctaves="4" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="13" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
        <filter id="ml-bleed-soft" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="3" seed="21" result="n2" />
          <feDisplacementMap in="SourceGraphic" in2="n2" scale="9" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        {/* Granulation du pigment dans les creux. */}
        <filter id="ml-grain-wash">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="3" />
          <feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.42 0 0 0 0 0.30 0 0 0 0.5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Bosquet — masses irrégulières, jamais deux fois la même */}
      <g filter="url(#ml-bleed)">
        <path
          d="M-10 128 C 14 96, 40 84, 62 92 C 74 66, 104 60, 122 76 C 142 62, 168 72, 174 94
             C 196 88, 212 100, 210 122 C 180 132, 40 136, -10 132 Z"
          fill={FOREST}
          opacity="0.3"
        />
        <path
          d="M28 130 C 42 104, 66 94, 86 102 C 98 82, 124 80, 136 98 C 156 94, 168 108, 164 124
             C 130 134, 62 136, 28 130 Z"
          fill={OLIVE}
          opacity="0.34"
        />
        <path
          d="M132 128 C 146 108, 172 100, 190 112 C 206 106, 220 118, 216 130 C 190 136, 152 136, 132 128 Z"
          fill={SAGE}
          opacity="0.4"
        />
      </g>

      {/* Prairie — deux lavis qui se recouvrent */}
      <g filter="url(#ml-bleed-soft)">
        <path
          d="M-10 132 C 90 116, 170 128, 250 122 C 330 116, 400 128, 490 118 L490 210 L-10 210 Z"
          fill={SAGE}
          opacity="0.3"
        />
        <path
          d="M-10 158 C 110 142, 200 156, 300 150 C 380 145, 430 156, 490 150 L490 210 L-10 210 Z"
          fill={OLIVE}
          opacity="0.22"
        />
        <path
          d="M-10 182 C 140 172, 260 184, 380 176 C 430 172, 460 178, 490 174 L490 210 L-10 210 Z"
          fill={FOREST}
          opacity="0.14"
        />
      </g>

      {/* Herbes — courbes, jamais des traits droits */}
      <g stroke={FOREST} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.34">
        {[
          "M392 186 C 396 170, 392 158, 400 142",
          "M406 188 C 414 172, 410 160, 422 148",
          "M424 186 C 426 168, 420 158, 428 140",
          "M440 188 C 448 174, 444 162, 456 152",
          "M458 186 C 460 170, 454 160, 462 146",
          "M22 190 C 28 176, 24 166, 32 154",
          "M40 188 C 46 174, 42 164, 52 152",
          "M58 190 C 60 178, 54 168, 62 158",
        ].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Fleurs éparses, comme les pâquerettes de la prairie */}
      <g opacity="0.5">
        {[[186, 168], [204, 180], [316, 164], [338, 176], [268, 186], [122, 176]].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r={i % 2 ? 2 : 2.6} fill={i % 3 === 0 ? SAND : "#FFFFFF"} />
        ))}
      </g>

      {/* Granulation posée par-dessus l'ensemble */}
      <rect x="0" y="110" width="480" height="90" filter="url(#ml-grain-wash)" opacity="0.28" />
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

/**
 * Le lama, réduit à son trait — la marque du modèle.
 *
 * Les proportions font tout : encolure haute et fine, tête petite, corps
 * compact, pattes élancées. C'est ce qui distingue un lama d'un quadrupède
 * générique.
 */
function LlamaMark({ className = "", size = 46 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke={OLIVE}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Oreilles, dressées et pointues */}
      <path d="M15.4 8.6 L14.6 3.4 L18.4 7.2" />
      <path d="M20.6 7.1 L22.6 2.6 L23.4 7.8" />

      {/* Tête : museau court, front droit */}
      <path d="M15.2 8.8 C 12.6 10.4, 12.2 13.6, 13.6 15.4 C 14.6 16.7, 16.4 16.9, 17.8 16.2" />
      <path d="M23.2 7.6 C 24.6 9.8, 24.8 12.8, 23.6 15" />
      <path d="M13.6 15.4 C 12.2 16.2, 11.6 17.6, 12.4 18.4 C 13.2 19.2, 14.6 18.8, 15.2 17.8" />

      {/* Encolure : la ligne la plus caractéristique */}
      <path d="M17.8 16.2 C 19.4 19.8, 20.4 24.4, 20.8 28.2" />
      <path d="M23.6 15 C 25.2 19.4, 26 24, 26.2 27.8" />

      {/* Corps */}
      <path d="M20.8 28.2 C 22.6 26.4, 26 25.6, 30 25.8 L34.6 26.2 C 38.4 26.6, 40.4 28.8, 40.2 32 C 40 35, 38 36.4, 35 36.4 L24.4 36.4 C 21.6 36.4, 20.4 34.6, 20.6 32 Z" />

      {/* Queue, courte et relevée */}
      <path d="M40 28.6 C 42.2 27.4, 43.4 28.4, 43 30.2" />

      {/* Pattes */}
      <path d="M24.4 36.4 L23.8 44.4" />
      <path d="M28.6 36.4 L28.4 44.4" />
      <path d="M34 36.4 L34.4 44.4" />
      <path d="M37.8 36.2 L38.6 44.4" />

      {/* Œil */}
      <circle cx="16.4" cy="12.2" r="0.75" fill={OLIVE} stroke="none" />
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

export default function MidosMaryeem({ template }: { template: Template }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"video" | "arch" | "card">("video");
  const [soundOn, setSoundOn] = useState(false);
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);
  const [guestName, setGuestName] = useState("");
  const [seats, setSeats] = useState(2);
  const [attending, setAttending] = useState(true);
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
        {phase === "video" && (
          <motion.div
            key="ml-intro"
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-end overflow-hidden bg-[#151810]"
          >
            <video
              src="/videos/midos-maryeem.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted={!soundOn}
              playsInline
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onPlay={(e) => {
                /* La demande dure 24 s : au rythme réel, on perd le visiteur
                   avant la carte. Accéléré, le geste reste lisible. */
                e.currentTarget.playbackRate = 1.7;
              }}
              onEnded={() => setPhase("arch")}
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
                Ce sera toujours toi
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.1 }}
                className="mb-9 text-white"
                style={{ ...script, fontSize: "clamp(2.75rem,11vw,4.5rem)", lineHeight: 1.05 }}
              >
                {t.groom} <span style={{ ...serif, fontSize: "0.42em", letterSpacing: "0.2em" }}>et</span> {t.bride}
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.9 }}
                onClick={() => setPhase("arch")}
                className="cursor-pointer rounded-full px-10 py-3.5 text-[11px] uppercase shadow-lg transition-colors duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ ...serif, letterSpacing: "0.3em", backgroundColor: PAPER, color: INK, outlineColor: PAPER }}
              >
                Ouvrir
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ La carte en arche, une fois la vidéo finie ═══ */}
      <AnimatePresence>
        {phase === "arch" && (
          <motion.div
            key="ml-arch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="fixed inset-0 z-[95] overflow-hidden"
            style={{ background: "rgba(24,32,18,0.55)", backdropFilter: "blur(5px)" }}
          >
            <motion.div
              /* Elle monte du bas, comme le rideau d'une salle — même geste que
                 Jasmin. Ancrée en bas plutôt que centrée : c'est ce qui empêche
                 le contenu de déborder de l'arche sur les petits écrans. */
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "20%", opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Invitation"
              dir="ltr"
              className="absolute inset-x-4 bottom-0 top-20 flex flex-col items-center justify-between overflow-y-auto rounded-t-full border-x-8 border-t-8 px-8 py-10 text-center shadow-[0_-24px_60px_rgba(20,28,14,0.5)] sm:inset-x-auto sm:left-1/2 sm:w-[420px] sm:-translate-x-1/2"
              style={{ backgroundColor: PAPER, borderColor: "rgba(255,255,255,0.55)" }}
            >
              {/* Filet intérieur qui redouble l'arche */}
              <span
                className="pointer-events-none absolute inset-3 rounded-b-lg rounded-t-full border"
                style={{ borderColor: SAND, opacity: 0.45 }}
                aria-hidden
              />

              <div className="relative mt-10 flex flex-col items-center">
                <LlamaMark className="mb-6" />

                <p className="text-[10px] uppercase" style={{ ...serif, letterSpacing: "0.28em", color: INK, opacity: 0.65 }}>
                  Bismillah ar-Rahman ar-Rahim
                </p>
              </div>

              <div className="relative flex flex-col items-center">
                <p style={{ ...script, fontSize: "clamp(2.4rem,11vw,3.4rem)", lineHeight: 1.08, color: FOREST }}>
                  {t.groom}
                </p>
                <span className="my-1 text-2xl" style={{ ...serif, color: SAND }}>
                  &amp;
                </span>
                <p style={{ ...script, fontSize: "clamp(2.4rem,11vw,3.4rem)", lineHeight: 1.08, color: FOREST }}>
                  {t.bride}
                </p>

                <span className="my-6 h-px w-24" style={{ background: SAND, opacity: 0.6 }} aria-hidden />

                <p className="max-w-[26ch] text-[15px] leading-[1.7]" style={{ ...serif, color: INK, opacity: 0.85 }}>
                  Nous avons la grande joie de vous convier à la célébration de notre mariage.
                </p>
              </div>

              <div className="relative flex flex-col items-center">
                <p className="text-sm uppercase" style={{ ...serif, letterSpacing: "0.2em", color: FOREST }}>
                  {t.date}
                </p>
                <p className="mt-1 text-sm uppercase" style={{ ...serif, letterSpacing: "0.2em", color: FOREST, opacity: 0.75 }}>
                  {t.city}
                </p>

                <button
                  onClick={() => setPhase("card")}
                  className="group mt-7 mb-4 inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full px-9 text-[11px] uppercase text-white shadow-lg transition-colors duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ ...serif, letterSpacing: "0.24em", backgroundColor: OLIVE, outlineColor: FOREST }}
                >
                  Découvrir
                  <ArrowLeft size={15} className="rotate-180 transition-transform group-hover:translate-x-1" aria-hidden />
                </button>
              </div>
            </motion.div>
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
              et
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
          <Caps size="text-[11px] sm:text-xs">Ont la joie de vous inviter à leur mariage</Caps>

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
            réception à suivre
          </p>
        </motion.div>

        <WatercolourLandscape className="pointer-events-none absolute inset-x-0 bottom-0 h-52 w-full" />
      </section>

      {/* ═══ Le tirage : la photo du lama, contrecollée ═══ */}
      <section className="relative px-8 pb-20 pt-4">
        <motion.figure
          initial={{ opacity: 0, y: 24, rotate: -1.6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.6 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduceMotion ? 0 : 0.9 }}
          className="mx-auto w-full max-w-[340px]"
        >
          {/* Marge blanche large : c'est ce qui fait lire l'image comme un tirage
              posé sur le papier, et non comme une image de fond. */}
          <div className="bg-white p-3 pb-14 shadow-[0_14px_34px_-18px_rgba(74,64,52,0.55)]">
            <img
              src="/images/midos-maryeem-lama.jpg"
              alt="Midos et Maryeem devant le lama fleuri, au bord du lac"
              className="block w-full"
              loading="lazy"
            />
          </div>
        </motion.figure>
        <p className="mt-7 text-center" style={{ ...script, fontSize: "1.35rem", color: OLIVE }}>
          là où tout a commencé
        </p>
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

      {/* ═══ Confirmation de présence ═══ */}
      <section
        className="relative overflow-hidden px-8 pb-44 pt-20 text-center"
        style={{ background: `linear-gradient(180deg, ${PAPER_WARM}, ${WASH}33)` }}
      >
        <LlamaMark className="mx-auto mb-5" size={54} />
        <Caps className="opacity-70">Confirmez votre présence</Caps>
        <Rule />

        {rsvp === null ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRsvp(attending ? "yes" : "no");
            }}
            className="mx-auto flex max-w-[22rem] flex-col gap-4 text-start"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={{ ...serif, letterSpacing: "0.2em", color: INK, opacity: 0.7 }}>
                Votre nom
              </span>
              <input
                type="text"
                name="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                autoComplete="name"
                className="min-h-11 rounded-xl border bg-white/85 px-4 text-[15px] outline-none transition-colors focus:border-current"
                style={{ ...serif, borderColor: SAND, color: INK }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={{ ...serif, letterSpacing: "0.2em", color: INK, opacity: 0.7 }}>
                Nombre de personnes
              </span>
              <input
                type="number"
                name="seats"
                min={1}
                max={10}
                value={seats}
                onChange={(e) => setSeats(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                className="min-h-11 rounded-xl border bg-white/85 px-4 text-[15px] outline-none transition-colors focus:border-current"
                style={{ ...serif, borderColor: SAND, color: INK }}
              />
            </label>

            {/* Deux boutons radio plutôt qu'une case : la réponse négative doit
                être aussi facile à donner que la positive, sinon on ne l'a pas. */}
            <fieldset className="mt-1">
              <legend className="mb-2 text-[11px] uppercase" style={{ ...serif, letterSpacing: "0.2em", color: INK, opacity: 0.7 }}>
                Serez-vous des nôtres ?
              </legend>
              <div className="flex gap-2">
                {([[true, "Oui, avec joie"], [false, "Je ne pourrai pas"]] as const).map(([value, label]) => (
                  <label
                    key={label}
                    className="flex-1 cursor-pointer rounded-full border px-4 py-3 text-center text-[11px] uppercase transition-colors duration-200"
                    style={{
                      ...serif,
                      letterSpacing: "0.16em",
                      borderColor: attending === value ? OLIVE : SAND,
                      backgroundColor: attending === value ? OLIVE : "rgba(255,255,255,0.7)",
                      color: attending === value ? "#FFFFFF" : INK,
                    }}
                  >
                    <input
                      type="radio"
                      name="attending"
                      className="sr-only"
                      checked={attending === value}
                      onChange={() => setAttending(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="mt-3 min-h-11 cursor-pointer rounded-full px-9 text-[11px] uppercase text-white shadow-sm transition-colors duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ ...serif, letterSpacing: "0.24em", backgroundColor: FOREST, outlineColor: FOREST }}
            >
              Envoyer ma réponse
            </button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
            <p style={{ ...script, fontSize: "2rem", color: FOREST }}>
              {rsvp === "yes" ? "Merci, nous vous attendons" : "Vous nous manquerez"}
            </p>
            <p className="mt-2 text-sm" style={{ ...serif, color: INK, opacity: 0.75 }}>
              {rsvp === "yes"
                ? `${guestName} — ${seats} ${seats > 1 ? "personnes" : "personne"}`
                : guestName}
            </p>
            <button
              onClick={() => setRsvp(null)}
              className="mt-6 min-h-11 cursor-pointer text-[11px] uppercase underline-offset-4 hover:underline"
              style={{ ...serif, letterSpacing: "0.2em", color: OLIVE }}
            >
              Modifier ma réponse
            </button>
          </motion.div>
        )}

        <WatercolourLandscape className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-70" />
      </section>
    </main>
  );
}
