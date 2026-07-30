"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

interface RoyalInvitationIntroProps {
  onOpen: () => void;
  brideName?: string;
  groomName?: string;
  marsalaColor?: string;
  goldColor?: string;
}

export default function RoyalInvitationIntro({
  onOpen,
  brideName = "Nour",
  groomName = "Youssef",
  marsalaColor = "#7A1C47",
  goldColor = "#D4AF37",
}: RoyalInvitationIntroProps) {
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");

    // Sequence timing
    setTimeout(() => {
      setPhase("opened");
      setTimeout(() => {
        onOpen();
      }, 700);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {phase !== "opened" && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle at center, #4A0E2B 0%, #2A0517 70%, #15020B 100%)",
          }}
        >
          {/* Ambient glowing gold aura in background */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(122,28,71,0) 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating Gold Sparkle Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/60 shadow-[0_0_8px_#D4AF37]"
                style={{
                  top: `${(i * 13) % 95}%`,
                  left: `${(i * 19) % 95}%`,
                }}
                animate={{
                  y: [-15, -40, -15],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: (i * 0.4) % 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Main 3D Card Container */}
          <div className="relative w-[92vw] max-w-[440px] h-[580px] max-h-[85vh] perspective-1200 flex items-center justify-center">
            
            {/* INNER CARD (Revealed underneath when doors open) */}
            <motion.div
              className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-between text-center overflow-hidden border border-amber-300/30 shadow-2xl"
              style={{
                background: "linear-gradient(145deg, #FFFDF9 0%, #F8EFE4 100%)",
              }}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={phase === "opening" ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.8 }}
              transition={{ duration: 0.8 }}
            >
              {/* Card Corner Ornaments */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-600/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-600/40 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-600/40 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-600/40 rounded-br-lg pointer-events-none" />

              <div className="pt-6">
                <span className="text-[11px] uppercase tracking-[0.35em] text-amber-700 font-serif-elegant font-semibold">
                  دعوة عرس
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
              </div>

              <div className="my-auto space-y-3">
                <h1 className="font-script text-5xl text-[#7A1C47] leading-tight drop-shadow-sm">
                  {brideName} <span className="text-amber-600 font-serif-elegant text-3xl">&amp;</span> {groomName}
                </h1>
                <p className="font-serif-elegant text-stone-600 text-sm tracking-wide max-w-[260px] mx-auto italic">
                  عندهم الفرحة يدعوكم لحضور عرسهم.
                </p>
              </div>

              <div className="pb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-serif-elegant">
                  <Sparkles size={14} className="text-amber-600 animate-spin" style={{ animationDuration: "6s" }} />
                  مرحبا بيكم في يومنا الكبير
                </div>
              </div>
            </motion.div>

            {/* LEFT DOOR / FLAP */}
            <motion.div
              className="absolute top-0 left-0 bottom-0 w-1/2 rounded-l-2xl z-20 overflow-hidden border-y border-l border-amber-400/40 shadow-2xl flex flex-col justify-between p-6 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #7A1C47 0%, #4A0E2B 100%)",
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 0 }}
              animate={phase !== "closed" ? { rotateY: -110 } : { rotateY: 0 }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            >
              {/* Inner Decorative Border */}
              <div className="absolute inset-3 border border-amber-400/25 rounded-l-xl pointer-events-none" />
              <div className="w-full flex justify-start">
                <div className="w-6 h-6 border-t border-l border-amber-300/40" />
              </div>
              <div className="w-full flex justify-start">
                <div className="w-6 h-6 border-b border-l border-amber-300/40" />
              </div>
            </motion.div>

            {/* RIGHT DOOR / FLAP */}
            <motion.div
              className="absolute top-0 right-0 bottom-0 w-1/2 rounded-r-2xl z-20 overflow-hidden border-y border-r border-amber-400/40 shadow-2xl flex flex-col justify-between p-6 pointer-events-none"
              style={{
                background: "linear-gradient(225deg, #7A1C47 0%, #4A0E2B 100%)",
                transformOrigin: "right center",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 0 }}
              animate={phase !== "closed" ? { rotateY: 110 } : { rotateY: 0 }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            >
              {/* Inner Decorative Border */}
              <div className="absolute inset-3 border border-amber-400/25 rounded-r-xl pointer-events-none" />
              <div className="w-full flex justify-end">
                <div className="w-6 h-6 border-t border-r border-amber-300/40" />
              </div>
              <div className="w-full flex justify-end">
                <div className="w-6 h-6 border-b border-r border-amber-300/40" />
              </div>
            </motion.div>

            {/* CENTRAL SEAL & MEDALLION */}
            <motion.div
              className="absolute z-30 cursor-pointer flex flex-col items-center justify-center"
              initial={{ scale: 1, opacity: 1 }}
              animate={
                phase !== "closed"
                  ? { scale: 1.4, opacity: 0, filter: "blur(8px)" }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              onClick={handleOpen}
            >
              {/* Outer Pulsing Glow */}
              <motion.div
                className="absolute w-28 h-28 rounded-full bg-amber-400/20 blur-md pointer-events-none"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Wax Seal Medallion */}
              <motion.div
                className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.6)] border-2 border-amber-200/60"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #F3D078 0%, #C9A84C 50%, #8A6D2B 100%)",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
              >
                {/* Inner Ring Detail */}
                <div className="absolute inset-1.5 rounded-full border border-amber-100/50 pointer-events-none" />
                <div className="absolute inset-3 rounded-full border border-amber-900/20 pointer-events-none" />

                <div className="w-[62%] h-[62%] rounded-full bg-white/90 flex items-center justify-center overflow-hidden p-2">
                  <img src="/images/logo1.png" alt="Farhty" className="w-full h-full object-contain" />
                </div>
              </motion.div>

              {/* Action Hint Below Medallion */}
              <motion.div
                className="mt-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-200 text-[11px] font-serif-elegant uppercase tracking-[0.25em]"
                animate={{
                  y: [0, 4, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart size={12} className="text-amber-400 fill-amber-400/50" />
                <span>افتح الدعوة</span>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
