"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { EucalyptusCorner, RoseCluster, PetalParticles, WaxSeal } from "./FloralDecorations";

interface Envelope3DProps {
  onOpen: () => void;
  brideName?: string;
  groomName?: string;
  accentColor?: string;
}

export default function Envelope3D({
  onOpen,
  brideName = "Nour",
  groomName = "Youssef",
  accentColor = "#8B2252",
}: Envelope3DProps) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "opened">("sealed");
  const [showContent, setShowContent] = useState(false);
  const envelopeControls = useAnimation();
  const cardControls = useAnimation();
  const flapControls = useAnimation();

  const handleSealClick = async () => {
    if (phase !== "sealed") return;
    setPhase("opening");

    // Sequence: seal breaks → flap opens → card rises → fade out
    await new Promise((r) => setTimeout(r, 600)); // seal animation

    // Flap opens
    await flapControls.start({
      rotateX: -180,
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
    });

    // Card rises
    setShowContent(true);
    await cardControls.start({
      y: -60,
      opacity: 1,
      scale: 1.02,
      transition: { duration: 0.8, ease: "easeOut" },
    });

    await new Promise((r) => setTimeout(r, 800));

    await new Promise((r) => setTimeout(r, 800));

    // Call onOpen to let the parent's AnimatePresence handle the fade out
    onOpen();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-blush-gradient"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >

          {/* Petal particles background */}
          <PetalParticles count={20} color="#E8B4B8" />

          {/* Decorative florals */}
          <EucalyptusCorner position="top-left" size={220} opacity={0.4} />
          <EucalyptusCorner position="top-right" size={220} opacity={0.4} />
          <EucalyptusCorner position="bottom-left" size={180} opacity={0.3} />
          <EucalyptusCorner position="bottom-right" size={180} opacity={0.3} />

          <RoseCluster className="absolute top-8 left-1/2 -translate-x-1/2" size={130} />
          <RoseCluster className="absolute bottom-8 left-1/4" size={90} />
          <RoseCluster className="absolute bottom-12 right-1/4" size={100} />

          {/* Main envelope container */}
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={envelopeControls}
            className="relative perspective-1200 w-full h-full"
          >
            {/* Envelope body */}
            <div className="relative w-[100vw] h-[100dvh]">
              {/* Envelope back */}
              <div
                className="absolute inset-0 rounded-lg shadow-2xl envelope-texture"
                style={{
                  background: `linear-gradient(145deg, ${accentColor} 0%, #6B1740 60%, #4A0E2E 100%)`,
                  boxShadow: `0 25px 60px ${accentColor}40, 0 10px 30px rgba(0,0,0,0.2)`,
                }}
              />

              {/* Envelope flap (top triangle) */}
              <motion.div
                animate={flapControls}
                className="absolute -top-px left-0 right-0 preserve-3d"
                style={{
                  transformOrigin: "top center",
                  zIndex: phase === "sealed" ? 20 : 5,
                }}
              >
                {/* Front of flap */}
                <div className="backface-hidden">
                  <svg
                    viewBox="0 0 380 200"
                    className="w-full h-[50dvh]"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accentColor} />
                        <stop offset="100%" stopColor="#6B1740" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,0 L190,160 L380,0 Z"
                      fill="url(#flapGrad)"
                      stroke={accentColor}
                      strokeWidth="0.5"
                    />
                    {/* Subtle pattern on flap */}
                    <path
                      d="M0,0 L190,160 L380,0 Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="40"
                      strokeDasharray="2,8"
                    />
                  </svg>
                </div>
                {/* Back of flap (visible when open) */}
                <div
                  className="absolute inset-0 backface-hidden"
                  style={{ transform: "rotateX(180deg)" }}
                >
                  <svg
                    viewBox="0 0 380 200"
                    className="w-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,0 L190,160 L380,0 Z"
                      fill="#4A0E2E"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Envelope bottom V-shape */}
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg
                  viewBox="0 0 380 220"
                  className="w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 L190,180 L380,0 L380,220 L0,220 Z"
                    fill={accentColor}
                    opacity="0.3"
                  />
                </svg>
              </div>

              {/* Side flaps decoration */}
              <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/10 to-transparent z-10" />
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/10 to-transparent z-10" />

              {/* Gold border accent */}
              <div
                className="absolute inset-2 rounded-md pointer-events-none z-[15]"
                style={{ border: "1px solid rgba(201, 168, 76, 0.15)" }}
              />

              {/* Card inside envelope */}
              <motion.div
                animate={cardControls}
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                className="absolute inset-4 md:inset-6 bg-white rounded-lg shadow-inner z-[8] overflow-hidden"
              >
                {/* Card content preview */}
                <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-gold/40 to-transparent" />

                  {/* Mini floral decoration */}
                  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="mb-4 opacity-50">
                    <path d="M20,35 C15,25 10,15 25,10 C35,5 40,15 40,20" stroke="#6B8F71" strokeWidth="1" fill="none" />
                    <path d="M60,35 C65,25 70,15 55,10 C45,5 40,15 40,20" stroke="#6B8F71" strokeWidth="1" fill="none" />
                    <ellipse cx="25" cy="12" rx="5" ry="3" fill="#6B8F71" opacity="0.4" transform="rotate(-20, 25, 12)" />
                    <ellipse cx="55" cy="12" rx="5" ry="3" fill="#6B8F71" opacity="0.4" transform="rotate(20, 55, 12)" />
                    <circle cx="40" cy="8" r="4" fill="#E8B4B8" opacity="0.5" />
                  </svg>

                  <p className="text-[9px] uppercase tracking-[0.4em] text-charcoal/40 font-medium mb-3">
                    Vous êtes invités au mariage de
                  </p>

                  <h2
                    className="font-script text-3xl md:text-4xl leading-tight mb-1"
                    style={{ color: accentColor }}
                  >
                    {brideName}
                  </h2>
                  <span className="text-charcoal/20 text-lg font-serif-elegant italic">&amp;</span>
                  <h2
                    className="font-script text-3xl md:text-4xl leading-tight mt-1"
                    style={{ color: accentColor }}
                  >
                    {groomName}
                  </h2>

                  <div className="w-16 h-px bg-rose-gold/40 my-4" />

                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50 font-serif-elegant">
                    Nosso Casamento
                  </p>

                  {/* Bottom border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-gold/40 to-transparent" />
                </div>
              </motion.div>

              {/* Wax Seal - centered on envelope */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[25]">
                <WaxSeal
                  size={90}
                  onClick={handleSealClick}
                  isOpen={phase === "opening"}
                />
              </div>
            </div>
          </motion.div>

          {/* Bottom text */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="font-serif-elegant text-charcoal/40 text-sm tracking-widest uppercase">
              Invitation digitale
            </p>
          </motion.div>
    </motion.div>
  );
}
