"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Crown,
  Gem,
  UtensilsCrossed,
  Music4,
  Check,
  MapPin,
  Play,
} from "lucide-react";
import type { Template } from "../data";
import { FarhtyLink } from "../../components/FarhtyCredit";
import PhotoGallery3D from "../../components/PhotoGallery3D";

const GOLD = "#C9A24B";
const GOLD_LIGHT = "#EBCF87";
const WINE = "#7A1028";
const DARK = "#0C0507";
const DARK2 = "#1E0B10";

/* ── Couronne + laurier monogramme ── */
function CrestMonogram({ bride, groom, size = 200 }: { bride: string; groom: string; size?: number }) {
  return (
    <svg viewBox="0 0 200 220" style={{ width: size }} aria-hidden className="mx-auto block filter drop-shadow-2xl">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#9C7A2E" />
        </linearGradient>
      </defs>
      {/* couronne */}
      <g fill="url(#goldGrad)" stroke={GOLD} strokeWidth="0.5">
        <path d="M70,44 L78,22 L90,40 L100,16 L110,40 L122,22 L130,44 Z" />
        <rect x="70" y="44" width="60" height="8" rx="2" />
        <circle cx="78" cy="22" r="3.5" />
        <circle cx="100" cy="16" r="4" />
        <circle cx="122" cy="22" r="3.5" />
      </g>
      {/* laurier gauche/droite */}
      {[false, true].map((right) => (
        <g key={right ? "r" : "l"} transform={right ? "translate(200,0) scale(-1,1)" : ""}>
          <path d="M62,70 C40,90 34,130 52,168" stroke={GOLD} strokeWidth="1.6" fill="none" />
          {[[52, 84, -40], [46, 100, -30], [42, 118, -22], [42, 136, -14], [46, 154, -8]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="8" ry="3" fill={GOLD} opacity="0.85" transform={`rotate(${r}, ${x}, ${y})`} />
          ))}
        </g>
      ))}
      {/* monogramme initiales */}
      <text x="72" y="140" fontFamily="var(--font-great-vibes), cursive" fontSize="42" fill="url(#goldGrad)" textAnchor="middle">{bride[0]}</text>
      <text x="100" y="140" fontFamily="var(--font-great-vibes), cursive" fontSize="30" fill={GOLD} textAnchor="middle" opacity="0.7">&amp;</text>
      <text x="128" y="140" fontFamily="var(--font-great-vibes), cursive" fontSize="42" fill="url(#goldGrad)" textAnchor="middle">{groom[0]}</text>
      {/* ornement bas */}
      <path d="M60,182 Q100,196 140,182 M100,188 L100,196 M96,192 L104,192" stroke={GOLD} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

/* ── Séparateur or ── */
function GoldRule() {
  return (
    <div className="flex items-center justify-center gap-3 my-5" aria-hidden>
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
      <svg width="26" height="10" viewBox="0 0 26 10">
        <path d="M13 0 L16 5 L13 10 L10 5 Z M0 5 H10 M16 5 H26" stroke={GOLD} strokeWidth="1" fill={GOLD} />
      </svg>
      <span className="h-px w-16" style={{ background: `linear-gradient(270deg, transparent, ${GOLD})` }} />
    </div>
  );
}

const goldText: React.CSSProperties = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 45%, #9C7A2E 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const TIMELINE_ICONS = [Crown, Gem, UtensilsCrossed, Music4];

export default function Imperiale({ template }: { template: Template }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const [soundOn, setSoundOn] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const t = template.previewText;

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 144);
    target.setHours(19, 0, 0, 0);
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

  return (
    <main className="min-h-screen text-white select-none relative overflow-x-hidden selection:bg-[#C9A24B]/30 selection:text-[#FFF]" style={{ background: `linear-gradient(160deg, ${DARK2} 0%, ${DARK} 55%, #050203 100%)` }}>
      <button
        onClick={() => setSoundOn(!soundOn)}
        aria-label={soundOn ? "Couper le son" : "Activer le son"}
        className="fixed top-5 right-5 z-[70] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer"
      >
        {soundOn ? <Volume2 size={16} style={{ color: GOLD }} /> : <VolumeX size={16} className="text-white/40" />}
      </button>

      {/* Grain / Vignette globale */}
      <div className="pointer-events-none fixed inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 75% 55% at 50% 42%, transparent 45%, rgba(0,0,0,0.6) 100%)" }} aria-hidden />

      {/* ========================================================= */}
      {/* CINEMATIC VIDEO-LIKE 4K RIDEAUX INTRO OVERLAY             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            key="imperiale-curtains-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden cursor-pointer bg-black"
          >
            <video
              src="/videos/rd.mp4"
              className="w-full h-full object-cover scale-105"
              playsInline
              muted
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onPlay={(e) => { e.currentTarget.playbackRate = 1.4; }}
              onClick={(e) => {
                const video = e.currentTarget;
                if (phase === "closed") {
                  setPhase("opening");
                  video.play().catch(() => {});
                }
              }}
              onEnded={() => setPhase("opened")}
            />
            {/* Interaction prompt */}
            {phase === "closed" && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 px-8 py-3 rounded-full backdrop-blur-md border border-[#C9A24B]/50 text-white text-xs font-serif tracking-widest uppercase shadow-2xl flex items-center gap-2 pointer-events-none"
                style={{ backgroundColor: "rgba(30,11,16,0.8)" }}
              >
                <Play size={14} className="text-[#C9A24B]" />
                <span>Ouvrir les rideaux</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 4K HERO — GALERIE DU PALAIS (photo réelle)                 */}
      {/* ========================================================= */}
      <section className="relative h-screen overflow-hidden z-[2]">
        {/* Backdrop photoréaliste : galerie de colonnes du palais, léger ken-burns */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 24, ease: "easeOut" }}
        >
          <img
            src="/images/la_joie_columns_4k.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Voile chaud pour légibilité + teinte de marque */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(12,5,7,0.55) 0%, rgba(30,11,16,0.35) 30%, rgba(12,5,7,0.5) 65%, ${DARK} 100%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 65% 55% at 50% 34%, rgba(201,162,75,0.16) 0%, transparent 62%)` }} />

        {template.video && videoOk && (
          <video src={template.video} autoPlay muted={!soundOn} loop playsInline controlsList="nodownload noremoteplayback" disablePictureInPicture onPlay={(e) => { e.currentTarget.playbackRate = 1.4; }} onError={() => setVideoOk(false)} className="absolute inset-0 w-full h-full object-cover scale-105 opacity-55 mix-blend-overlay" />
        )}

        {/* particules dorées */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: `${(i * 37 + 8) % 100}%`, top: `${(i * 53 + 20) % 90}%`, width: 3, height: 3, backgroundColor: GOLD_LIGHT }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -18, 0] }}
              transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: (i * 0.7) % 5 }}
            />
          ))}
        </div>

        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={phase === "opened" ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 1 }} className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
            <CrestMonogram bride={t.bride} groom={t.groom} size={140} />
            <p className="mt-4 text-[10px] uppercase tracking-[0.55em] text-white/70">Vous êtes invités au mariage de</p>
            <h1 className="font-script mt-3 leading-tight" style={{ ...goldText, fontSize: "clamp(3.4rem, 11vw, 6.5rem)" }}>
              {t.bride} <span className="opacity-70">&amp;</span> {t.groom}
            </h1>
            <GoldRule />
            <p className="font-serif-elegant text-lg text-white/80">
              {t.date} · {t.city}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ INVITATION ═══════ */}
      <section className="relative py-28 px-6 z-[2] text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl p-3 md:p-4"
        >
          {/* cadre décoratif branches dorées (visible en bordure) */}
          <img src="/images/gold_branches_4k.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          {/* panneau crème plat pour la lisibilité, quelle que soit la longueur du texte */}
          <div className="relative rounded-xl flex flex-col items-center justify-center px-8 md:px-12 py-14 md:py-16 text-center" style={{ backgroundColor: "rgba(249,244,233,0.95)" }}>
            <Crown size={24} className="mx-auto mb-4" style={{ color: WINE }} />
            <h2 className="font-script text-4xl mb-2" style={{ color: WINE }}>Notre invitation</h2>
            <div className="flex items-center justify-center gap-3 my-3" aria-hidden>
              <span className="h-px w-10" style={{ backgroundColor: `${WINE}66` }} />
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: WINE }} />
              <span className="h-px w-10" style={{ backgroundColor: `${WINE}66` }} />
            </div>
            <div className="space-y-4">
              {t.story.map((s, i) => (
                <p key={i} className="font-serif-elegant text-sm md:text-base leading-relaxed" style={{ color: "#4A3420" }}>{s.text}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ COUNTDOWN ═══════ */}
      <section className="relative py-24 px-6 z-[2]">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/50 mb-10">Le grand jour approche</p>
          <div className="flex justify-center gap-4 md:gap-6">
            {[
              [countdown.days, "Jours"],
              [countdown.hours, "Heures"],
              [countdown.minutes, "Minutes"],
              [countdown.seconds, "Secondes"],
            ].map(([v, l]) => (
              <div key={l as string} className="w-18 md:w-20 py-4 rounded-xl border min-w-16" style={{ borderColor: `${GOLD}44`, background: "rgba(201,162,75,0.08)" }}>
                <div className="font-serif-elegant text-3xl md:text-4xl tabular-nums" style={goldText}>{String(v).padStart(2, "0")}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROGRAMME ═══════ */}
      <section className="relative py-24 px-6 z-[2]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-script text-5xl mb-1" style={goldText}>Programme</h2>
            <GoldRule />
          </div>
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg, transparent, ${GOLD}66 12%, ${GOLD}66 88%, transparent)` }} />
            <div className="space-y-12">
              {t.program.map((p, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex items-center gap-6"
                  >
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 relative z-10" style={{ borderColor: `${GOLD}88`, backgroundColor: DARK2 }}>
                      <Icon size={17} style={{ color: GOLD }} strokeWidth={1.4} />
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
      <section className="relative py-32 px-6 z-[2] text-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/la_joie_columns_gate_4k.webp" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${DARK} 0%, rgba(12,5,7,0.45) 25%, rgba(12,5,7,0.55) 75%, ${DARK} 100%)` }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="relative">
          <MapPin size={26} className="mx-auto mb-4 text-[#C9A24B]" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/70 mb-3">Le Lieu</p>
          <h2 className="font-serif-elegant text-4xl md:text-5xl" style={goldText}>{t.lieu}</h2>
          <p className="text-white/85 mt-3 font-serif-elegant text-lg">{t.city} · {t.time}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(t.lieu + " " + t.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer shadow-lg"
            style={{ backgroundColor: WINE, color: GOLD_LIGHT }}
          >
            Voir l'itinéraire sur Google Maps
          </a>
        </motion.div>
      </section>

      {/* ═══════ GALERIE PHOTOS DES MARIÉS 3D 360 ═══════ */}
      {t.photos && t.photos.length > 0 && (
        <PhotoGallery3D photos={t.photos} goldColor={GOLD} textColor="#FFF" />
      )}

      {/* ═══════ RSVP ═══════ */}
      {!t.hideRsvp && (
        <section className="relative py-28 px-6 z-[2] text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl" style={{ boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px ${GOLD}33` }}>
              <img src="/images/rose_wax_seal_4k.webp" alt="" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-script text-5xl mb-3" style={goldText}>Confirmez votre présence</h2>
            <GoldRule />
            <p className="text-white/60 text-sm mb-10">Merci de confirmer avant le 1er novembre</p>
            {rsvp === null ? (
              <div className="flex gap-4 justify-center">
                <button onClick={() => setRsvp("yes")} className="px-8 py-3.5 rounded-full text-sm font-medium transition-opacity duration-200 hover:opacity-85 cursor-pointer shadow-lg" style={{ backgroundColor: GOLD, color: DARK }}>
                  C'est un honneur
                </button>
                <button onClick={() => setRsvp("no")} className="px-8 py-3.5 rounded-full text-sm border text-white/70 hover:bg-white/5 transition-colors duration-200 cursor-pointer" style={{ borderColor: `${GOLD}44` }}>
                  Malheureusement non
                </button>
              </div>
            ) : (
              <motion.p initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-white/80">
                <Check size={18} style={{ color: GOLD }} /> {rsvp === "yes" ? "Merci, votre présence nous honore." : "Merci de nous avoir prévenus."}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative py-14 px-6 z-[2] text-center">
        <CrestMonogram bride={t.bride} groom={t.groom} size={90} />
        <p className="font-script text-3xl mt-3" style={goldText}>{t.bride} &amp; {t.groom}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-3">{t.date} · {t.lieu}</p>
        <p className="text-xs text-white/25 mt-6">
          Invitation digitale par{" "}
          <FarhtyLink className="underline hover:text-white/50 transition-colors" />
        </p>
      </footer>
    </main>
  );
}
