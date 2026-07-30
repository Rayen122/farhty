"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GateIntroProps {
  onOpen: () => void;
  brideName?: string;
  groomName?: string;
  gateColor?: string;
  accentColor?: string;
}

export default function GateIntro({
  onOpen,
  brideName = "Nour",
  groomName = "Youssef",
  gateColor = "#6B1740", // Dark Marsala by default
  accentColor = "#C9A84C", // Gold
}: GateIntroProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Wait for the gate opening animation to finish before calling onOpen
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {/* Left Gate */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 w-1/2 flex justify-end items-center border-r border-black/20"
            style={{
              background: `linear-gradient(90deg, ${gateColor} 0%, rgba(0,0,0,0.3) 100%)`,
              backgroundColor: gateColor,
              boxShadow: "inset -10px 0 20px rgba(0,0,0,0.2)",
            }}
            initial={{ x: "0%" }}
            animate={isOpen ? { x: "-100%" } : { x: "0%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            {/* Left Gate Details (Molding) */}
            <div className="absolute inset-y-4 left-4 right-2 border border-white/10 rounded-sm pointer-events-none" />
            <div className="absolute inset-y-8 left-8 right-6 border border-white/5 rounded-sm pointer-events-none" />
          </motion.div>

          {/* Right Gate */}
          <motion.div
            className="absolute top-0 right-0 bottom-0 w-1/2 flex justify-start items-center border-l border-white/10"
            style={{
              background: `linear-gradient(270deg, ${gateColor} 0%, rgba(0,0,0,0.3) 100%)`,
              backgroundColor: gateColor,
              boxShadow: "inset 10px 0 20px rgba(0,0,0,0.2)",
            }}
            initial={{ x: "0%" }}
            animate={isOpen ? { x: "100%" } : { x: "0%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            {/* Right Gate Details (Molding) */}
            <div className="absolute inset-y-4 left-2 right-4 border border-white/10 rounded-sm pointer-events-none" />
            <div className="absolute inset-y-8 left-6 right-8 border border-white/5 rounded-sm pointer-events-none" />
          </motion.div>

          {/* Central Seal / Lock */}
          <motion.div
            className={`absolute z-10 cursor-pointer flex items-center justify-center rounded-full ${!isOpen ? "seal-glow" : ""}`}
            style={{
              width: 100,
              height: 100,
              background: `linear-gradient(135deg, ${accentColor} 0%, #A88636 100%)`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.4), inset 0 2px 5px rgba(255,255,255,0.5)",
            }}
            initial={{ scale: 1, rotate: 0 }}
            animate={isOpen ? { scale: 0, rotate: 90, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
            whileHover={!isOpen ? { scale: 1.1 } : undefined}
            whileTap={!isOpen ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.5, ease: "backIn" }}
            onClick={handleOpen}
          >
            {/* Inner Ring */}
            <div className="absolute inset-1 rounded-full border-2 border-[#F5D998]/40" />
            <div className="absolute inset-2 rounded-full border border-[#F5D998]/20" />
            
            <div className="w-[64%] h-[64%] rounded-full bg-white/90 flex items-center justify-center overflow-hidden p-1.5">
              <img src="/images/logo1.png" alt="Farhty" className="w-full h-full object-contain" />
            </div>

            {/* Instruction Text */}
            {!isOpen && (
              <motion.div
                className="absolute -bottom-16 w-48 text-center animate-pulse float-gentle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-serif-elegant text-white/70">
                  دوسو باش تفتحو
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
