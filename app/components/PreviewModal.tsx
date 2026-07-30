"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Music, Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface Template {
  id: number;
  category: string;
  name: string;
  subtitle: string;
  accent: string;
  image: string;
}

interface PreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

const fade = (delay = 0) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, type: "tween" as const } });
const slide = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, type: "tween" as const } });
const pop = (delay = 0) => ({ initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay, type: "spring" as const } });

export default function PreviewModal({ template, isOpen, onClose }: PreviewModalProps) {
  const [countdown, setCountdown] = useState({ days: 45, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const target = new Date();
    target.setDate(target.getDate() + 45);
    const iv = setInterval(() => {
      const diff = target.getTime() - Date.now();
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isOpen]);

  if (!template) return null;

  const screen = () => {
    const sbg = (from: string, to: string) => ({ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` });
    switch (template.id) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-6" style={{ ...sbg("#FDFBF7", "#F5E6C8"), color: "#2C2C2C", fontFamily: "'Playfair Display', serif" }}>
            <motion.div {...fade(0.2)} className="text-xs tracking-[0.4em] uppercase text-[#C5A059]">Vous etes invites</motion.div>
            <motion.h1 {...pop(0.4)} className="text-5xl italic">Sarah <span className="text-[#C5A059]">&</span> Alexandre</motion.h1>
            <motion.div {...fade(0.6)} className="w-24 h-0.5 bg-[#C5A059]" />
            <motion.div {...slide(0.8)} className="text-sm space-y-1 opacity-80">
              <p>📅 Samedi 15 Juin 2025</p>
              <p>📍 Villa des Roses, Nabeul</p>
              <p>🕐 18h00</p>
            </motion.div>
            <motion.div {...fade(1)} className="bg-[#C5A059] text-white px-8 py-3 rounded-full text-sm font-medium">RSVP</motion.div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-5" style={{ ...sbg("#E8F5E9", "#C8E6C9"), color: "#1B4332", fontFamily: "'Playfair Display', serif" }}>
            <motion.div {...pop(0.3)} className="text-6xl">🌿</motion.div>
            <motion.h1 {...slide(0.5)} className="text-4xl italic"><span>Amira</span> <span className="text-[#88B3A5]">&</span> <span>Karim</span></motion.h1>
            <motion.p {...fade(0.7)} className="text-sm tracking-wider uppercase">Dans le jardin de nos reves</motion.p>
            <motion.div {...fade(0.9)} className="w-32 h-px bg-[#88B3A5]" />
            <motion.div {...slide(1.1)} className="grid grid-cols-2 gap-3 text-sm w-full max-w-[200px]">
              <div className="bg-white/60 p-3 rounded-xl"><div className="text-[#88B3A5] font-bold">15 Juin</div><div className="text-xs opacity-70">Date</div></div>
              <div className="bg-white/60 p-3 rounded-xl"><div className="text-[#88B3A5] font-bold">17h00</div><div className="text-xs opacity-70">Heure</div></div>
            </motion.div>
            <motion.button {...slide(1.3)} className="border-2 border-[#88B3A5] px-6 py-2 rounded-full text-sm transition-all hover:bg-[#88B3A5] hover:text-white">Confirmer presence</motion.button>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-5" style={{ ...sbg("#FFF0F0", "#FFE4E1"), color: "#5C3A3A", fontFamily: "'Playfair Display', serif" }}>
            <motion.div {...pop(0.3)} className="text-5xl">💍</motion.div>
            <motion.h1 {...slide(0.5)} className="text-4xl italic text-[#E27D5F]">Leyla & Amine</motion.h1>
            <motion.p {...fade(0.7)} className="text-sm tracking-[0.3em] uppercase text-[#E27D5F]/70">Toutes nos felicitations</motion.p>
            <motion.div {...fade(0.9)} className="w-16 h-px bg-[#E27D5F]/30" />
            <motion.div {...slide(1.1)} className="flex items-center gap-3 bg-white/70 p-4 rounded-2xl">
              {[{ v: countdown.days, l: "Jours" }, { v: countdown.hours, l: "Hrs" }, { v: countdown.minutes, l: "Min" }].map((u, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-[#E27D5F]">{u.v}</div>
                  <div className="text-[10px] uppercase">{u.l}</div>
                </div>
              ))}
            </motion.div>
            <motion.div {...fade(1.3)} className="text-xs space-y-1 opacity-70">
              <p>📅 20 Juillet 2025</p>
              <p>📍 Hotel Royal, Hammamet</p>
            </motion.div>
            <motion.button {...fade(1.5)} className="bg-[#E27D5F] text-white px-8 py-3 rounded-full text-sm shadow-lg shadow-[#E27D5F]/30">Je confirme ma presence</motion.button>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-5" style={{ ...sbg("#F3E8FF", "#E9D5FF"), color: "#4A3658", fontFamily: "'DM Sans', sans-serif" }}>
            <motion.div {...pop(0.3)} className="text-6xl">🎉</motion.div>
            <motion.h1 {...pop(0.5)} className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>30 Ans<br /><span className="text-[#B5A4D2]">Sarah!</span></motion.h1>
            <motion.div {...slide(0.7)} className="bg-white/70 p-4 rounded-2xl w-full max-w-[220px] text-sm space-y-2 text-left">
              <p>📅 Samedi 10 Aout 2025</p>
              <p>📍 Rooftop Le 15, Tunis</p>
              <p>🕐 20h00 - Tard dans la nuit</p>
            </motion.div>
            <motion.div {...fade(0.9)} className="flex gap-2">{["🎂", "🎈", "🎊", "✨", "🥂"].map((e, i) => <span key={i} className="text-2xl">{e}</span>)}</motion.div>
            <motion.button {...fade(1.2)} className="bg-[#B5A4D2] text-white px-6 py-2.5 rounded-full text-sm font-medium">Je serai la!</motion.button>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-6" style={{ background: "#FFFFFF", color: "#2C2C2C", fontFamily: "'Playfair Display', serif" }}>
            <motion.div {...fade(0.2)} className="w-full flex justify-between text-xs tracking-widest uppercase opacity-40"><span>Save the Date</span><span>2025</span></motion.div>
            <motion.h1 {...slide(0.4)} className="text-5xl font-light tracking-tight">NADA <span className="opacity-30">&</span> SAMI</motion.h1>
            <motion.div {...fade(0.6)} className="w-16 h-px bg-black/20" />
            <motion.div {...fade(0.8)} className="space-y-2 text-sm opacity-60">
              <p>SEPTEMBRE · 12 · 2025</p>
              <p>DAR BEN GACEM, LA MEDINA</p>
              <p className="text-xs tracking-wider mt-4 opacity-50">FORMAL ATTIRE</p>
            </motion.div>
            <motion.div {...fade(1)} className="border border-black/10 px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all cursor-pointer">Repondre a l'invitation</motion.div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-5" style={{ ...sbg("#EEF4F7", "#D1E3EC"), color: "#1A3340", fontFamily: "'DM Sans', sans-serif" }}>
            <motion.div {...slide(0.3)} className="flex items-center gap-2"><div className="w-10 h-10 bg-[#4A7C94] rounded-lg flex items-center justify-center text-white text-sm font-bold">AC</div><span className="text-sm font-medium">ACME Corp</span></motion.div>
            <motion.div {...fade(0.5)} className="w-16 h-0.5 bg-[#4A7C94]" />
            <motion.h1 {...fade(0.7)} className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Gala Annuel 2025</motion.h1>
            <motion.p {...fade(0.9)} className="text-sm text-[#4A7C94] font-medium">Excellence & Innovation</motion.p>
            <motion.div {...slide(1.1)} className="bg-white p-4 rounded-xl w-full text-sm text-left space-y-2 shadow-sm">
              <p>📅 Jeudi 5 Decembre 2025</p>
              <p>🕐 19h00 - 23h00</p>
              <p>📍 Centre de Congres, Tunis</p>
            </motion.div>
            <motion.button {...fade(1.3)} className="bg-[#4A7C94] text-white px-6 py-2.5 rounded-lg text-sm w-full">Confirmer participation</motion.button>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-5" style={{ ...sbg("#FAF0E6", "#F5E6D3"), color: "#3D3329", fontFamily: "'Playfair Display', serif" }}>
            <motion.div {...pop(0.3)} className="w-20 h-20 rounded-full border-2 border-[#A0938E]/30 flex items-center justify-center"><span className="text-3xl">💎</span></motion.div>
            <motion.h1 {...slide(0.5)} className="text-3xl italic">Rania <span className="text-[#A0938E] mx-1">&</span> Mehdi</motion.h1>
            <motion.p {...fade(0.7)} className="text-xs tracking-[0.3em] uppercase text-[#A0938E]">Engagement</motion.p>
            <motion.div {...slide(0.9)} className="grid grid-cols-3 gap-3 w-full max-w-[200px]">
              {[{ v: "08", l: "Nov" }, { v: "15", l: "H" }, { v: "25", l: "Min" }].map((u, i) => (
                <div key={i} className={`text-center ${i === 1 ? "border-x border-black/10" : ""}`}>
                  <div className="text-lg font-bold">{u.v}</div>
                  <div className="text-[10px] uppercase opacity-50">{u.l}</div>
                </div>
              ))}
            </motion.div>
            <motion.button {...fade(1.1)} className="border border-[#A0938E] px-6 py-2 rounded-full text-sm transition-all hover:bg-[#A0938E] hover:text-white">Confirmer presence</motion.button>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-col items-center text-center p-8 gap-4" style={{ ...sbg("#FFF5E6", "#FFE8CC"), color: "#5E3A1A", fontFamily: "'DM Sans', sans-serif" }}>
            <motion.div {...pop(0.3)} className="text-5xl">🥂</motion.div>
            <motion.h1 {...pop(0.5)} className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>50 Ans<br /><span className="text-[#E8A87C]">de Bonheur</span></motion.h1>
            <motion.p {...fade(0.7)} className="text-sm italic text-[#E8A87C]">Noces d'Or de Fatma & Hichem</motion.p>
            <motion.div {...fade(0.9)} className="flex gap-2 flex-wrap justify-center">{["🎁", "🎉", "🍾", "💐", "🎊"].map((e, i) => <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="text-2xl">{e}</motion.span>)}</motion.div>
            <motion.div {...slide(1.1)} className="bg-white/70 p-3 rounded-xl text-sm space-y-1">
              <p>📅 1er Octobre 2025</p>
              <p>📍 Restaurant Au Bonheur, Sidi Bou Said</p>
              <p>🕐 19h00</p>
            </motion.div>
            <motion.button {...fade(1.3)} className="bg-[#E8A87C] text-white px-8 py-3 rounded-full text-sm shadow-lg shadow-[#E8A87C]/30">Je participe!</motion.button>
          </div>
        );
      default:
        return screen();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          >
            <div className="flex-1 p-6 bg-cream overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl">{template.name}</h3>
                <button onClick={onClose} className="w-8 h-8 bg-charcoal/5 rounded-full flex items-center justify-center hover:bg-charcoal/10"><X size={16} /></button>
              </div>
              <div className="mx-auto w-[280px] h-[500px] rounded-[2.5rem] border-[8px] border-charcoal shadow-2xl overflow-hidden bg-white relative">
                {screen()}
              </div>
              <div className="flex justify-center gap-3 mt-6">
                {[
                  { I: Music, t: "Musique" },
                  { I: Share2, t: "Partager" },
                  { I: Heart, t: "J'aime" },
                ].map(({ I, t }) => (
                  <button key={t} className="flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full text-sm hover:bg-charcoal hover:text-white transition-all">
                    <I size={14} /> {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-80 p-6 border-l border-charcoal/5 space-y-6 overflow-y-auto">
              <div>
                <span className="text-xs uppercase tracking-wider text-charcoal/50">{template.category}</span>
                <h2 className="font-display text-2xl mt-1">{template.name}</h2>
                <p className="text-sm text-charcoal/70 mt-2">{template.subtitle}</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Caracteristiques :</h4>
                <div className="space-y-2">
                  {["RSVP interactif", "Compte a rebours", "Galerie photos", "Musique de fond", "Carte interactive"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-charcoal/70"><div className="w-1.5 h-1.5 rounded-full bg-gold" />{f}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Couleurs :</h4>
                <div className="flex gap-2">
                  {["#C5A059", "#2C2C2C", "#FDFBF7"].map((c) => (
                    <div key={c} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-charcoal/5 space-y-3">
                <div className="text-xs text-charcoal/50">A partir de</div>
                <div className="text-3xl font-display text-charcoal">89 <span className="text-lg">DT</span></div>
                <button className="w-full bg-charcoal text-white py-3 rounded-xl text-sm font-medium hover:bg-charcoal/90 transition-all">Utiliser ce modele</button>
                <button className="w-full border border-charcoal/10 py-3 rounded-xl text-sm text-charcoal hover:border-charcoal transition-all">Voir la demo live</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
