"use client";

import { motion } from "framer-motion";

// ─── Eucalyptus Corner Decoration ───
export function EucalyptusCorner({
  position = "top-left",
  size = 200,
  color = "#6B8F71",
  opacity = 0.6,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
  opacity?: number;
}) {
  const transforms: Record<string, string> = {
    "top-left": "rotate(0deg)",
    "top-right": "rotate(90deg)",
    "bottom-right": "rotate(180deg)",
    "bottom-left": "rotate(270deg)",
  };

  const positions: Record<string, React.CSSProperties> = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-right": { bottom: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute pointer-events-none"
      style={{ ...positions[position], width: size, height: size, transform: transforms[position] }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Main stem */}
        <motion.path
          d="M10,190 C30,170 40,150 50,120 C60,90 55,60 70,30"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
        />
        {/* Leaves */}
        {[
          { d: "M30,170 C20,160 15,150 25,145 C35,140 40,155 30,170Z", delay: 0.5 },
          { d: "M35,165 C45,155 55,150 50,160 C45,170 35,170 35,165Z", delay: 0.6 },
          { d: "M40,145 C30,135 25,125 35,120 C45,115 48,130 40,145Z", delay: 0.8 },
          { d: "M45,140 C55,130 65,125 60,135 C55,145 45,145 45,140Z", delay: 0.9 },
          { d: "M50,120 C40,110 35,100 45,95 C55,90 58,105 50,120Z", delay: 1.1 },
          { d: "M55,115 C65,105 75,100 70,110 C65,120 55,120 55,115Z", delay: 1.2 },
          { d: "M58,90 C48,80 43,70 53,65 C63,60 66,75 58,90Z", delay: 1.4 },
          { d: "M63,85 C73,75 83,70 78,80 C73,90 63,90 63,85Z", delay: 1.5 },
          { d: "M65,60 C55,50 50,40 60,35 C70,30 73,45 65,60Z", delay: 1.7 },
          { d: "M70,55 C80,45 90,40 85,50 C80,60 70,60 70,55Z", delay: 1.8 },
        ].map((leaf, i) => (
          <motion.path
            key={i}
            d={leaf.d}
            fill={color}
            opacity={0.5 + (i % 3) * 0.15}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 + (i % 3) * 0.15 }}
            transition={{ duration: 0.6, delay: leaf.delay }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// ─── Rose Cluster ───
export function RoseCluster({
  className = "",
  color = "#E8B4B8",
  accentColor = "#8B2252",
  size = 120,
}: {
  className?: string;
  color?: string;
  accentColor?: string;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Large rose */}
        <circle cx="50" cy="50" r="18" fill={color} opacity="0.8" />
        <circle cx="50" cy="50" r="12" fill={accentColor} opacity="0.4" />
        <path d="M42,50 C42,42 50,38 50,38 C50,38 58,42 58,50 C58,58 50,62 50,62 C50,62 42,58 42,50Z" fill={accentColor} opacity="0.3" />
        <circle cx="50" cy="50" r="5" fill={accentColor} opacity="0.6" />
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            key={i}
            cx={50 + Math.cos((angle * Math.PI) / 180) * 14}
            cy={50 + Math.sin((angle * Math.PI) / 180) * 14}
            rx="8"
            ry="5"
            fill={color}
            opacity={0.6}
            transform={`rotate(${angle + 30}, ${50 + Math.cos((angle * Math.PI) / 180) * 14}, ${50 + Math.sin((angle * Math.PI) / 180) * 14})`}
          />
        ))}
        {/* Small rose */}
        <circle cx="85" cy="70" r="10" fill={color} opacity="0.7" />
        <circle cx="85" cy="70" r="6" fill={accentColor} opacity="0.3" />
        <circle cx="85" cy="70" r="3" fill={accentColor} opacity="0.5" />
        {/* Bud */}
        <ellipse cx="30" cy="85" rx="6" ry="8" fill={color} opacity="0.6" />
        <ellipse cx="30" cy="82" rx="4" ry="5" fill={accentColor} opacity="0.3" />
        {/* Leaves */}
        <path d="M60,65 C65,60 75,62 80,65 C75,68 65,70 60,65Z" fill="#6B8F71" opacity="0.6" />
        <path d="M35,75 C30,70 25,72 20,80 C25,78 35,80 35,75Z" fill="#6B8F71" opacity="0.5" />
        <path d="M80,80 C85,75 95,77 100,85 C90,82 82,84 80,80Z" fill="#6B8F71" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

// ─── Floral Frame (for couple names) ───
export function FloralFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <EucalyptusCorner position="top-left" size={160} opacity={0.5} />
      <EucalyptusCorner position="top-right" size={160} opacity={0.5} />
      <EucalyptusCorner position="bottom-left" size={140} opacity={0.4} />
      <EucalyptusCorner position="bottom-right" size={140} opacity={0.4} />
      <RoseCluster className="absolute -top-4 left-1/2 -translate-x-1/2" size={100} />
      <RoseCluster className="absolute -bottom-4 left-1/2 -translate-x-1/2 rotate-180" size={80} />
      {children}
    </div>
  );
}

// ─── Petal Particles ───
export function PetalParticles({
  count = 15,
  color = "#E8B4B8",
}: {
  count?: number;
  color?: string;
}) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 10,
    size: 8 + Math.random() * 14,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-particle absolute"
          style={{
            left: petal.left,
            top: "-5%",
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="10" rx="6" ry="9" fill={color} opacity={petal.opacity} transform="rotate(25, 10, 10)" />
            <ellipse cx="10" cy="10" rx="3" ry="6" fill={color} opacity={petal.opacity * 0.7} transform="rotate(-15, 10, 10)" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── Wax Seal ───
export function WaxSeal({
  size = 80,
  onClick,
  isOpen = false,
}: {
  size?: number;
  onClick?: () => void;
  isOpen?: boolean;
}) {
  return (
    <motion.div
      className={`relative cursor-pointer rounded-full ${!isOpen ? "seal-glow" : ""}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      whileHover={!isOpen ? { scale: 1.05 } : undefined}
      whileTap={!isOpen ? { scale: 0.95 } : undefined}
      animate={isOpen ? { scale: 0, rotate: 45, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
      transition={isOpen ? { duration: 0.6, ease: "easeIn" } : undefined}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Wax base */}
        <defs>
          <radialGradient id="waxGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D4A030" />
            <stop offset="40%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#8B7A3D" />
          </radialGradient>
          <filter id="emboss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.8" specularExponent="20" result="spec">
              <fePointLight x="30" y="30" z="100" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec-in" />
            <feComposite in="SourceGraphic" in2="spec-in" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
        {/* Irregular wax shape */}
        <path
          d="M50,5 C60,3 70,8 78,15 C86,22 92,32 95,42 C98,52 97,63 92,72 C87,81 78,88 68,92 C58,96 47,97 37,93 C27,89 18,82 12,72 C6,62 3,50 5,40 C7,30 14,20 23,13 C32,6 42,4 50,5Z"
          fill="url(#waxGradient)"
          filter="url(#emboss)"
        />
        {/* Monogram circle */}
        <circle cx="50" cy="50" r="22" fill="none" stroke="#F5D998" strokeWidth="1.5" opacity="0.7" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="#F5D998" strokeWidth="0.8" opacity="0.5" />
        {/* Initials */}
        <text x="50" y="48" textAnchor="middle" fontSize="14" fontFamily="serif" fill="#F5D998" fontWeight="600" opacity="0.9">N</text>
        <text x="50" y="63" textAnchor="middle" fontSize="10" fontFamily="serif" fill="#F5D998" opacity="0.7">&amp;</text>
        <text x="50" y="48" textAnchor="middle" fontSize="0" fill="transparent">Y</text>
        {/* Decorative dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <circle
            key={angle}
            cx={50 + Math.cos((angle * Math.PI) / 180) * 26}
            cy={50 + Math.sin((angle * Math.PI) / 180) * 26}
            r="1.5"
            fill="#F5D998"
            opacity="0.5"
          />
        ))}
      </svg>
      {!isOpen && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-rose-gold/80 whitespace-nowrap font-serif-elegant tracking-widest uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Appuyez pour ouvrir
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Vine Divider ───
export function VineDivider({
  color = "#6B8F71",
  width = "100%",
  className = "",
}: {
  color?: string;
  width?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className={`mx-auto ${className}`}
      style={{ width }}
    >
      <svg viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="30" preserveAspectRatio="xMidYMid meet">
        <path d="M0,15 C50,15 80,5 120,15 C160,25 200,8 200,15 C200,22 240,5 280,15 C320,25 350,15 400,15" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        {/* Small leaves along the vine */}
        {[60, 120, 200, 280, 340].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={i % 2 === 0 ? 10 : 20} rx="6" ry="3" fill={color} opacity="0.4" transform={`rotate(${i % 2 === 0 ? -30 : 30}, ${x}, ${i % 2 === 0 ? 10 : 20})`} />
          </g>
        ))}
        <circle cx="200" cy="15" r="3" fill="#E8B4B8" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

// ─── Gold Ornament Divider ───
export function GoldOrnament({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-rose-gold/60" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10,2 L12,8 L18,10 L12,12 L10,18 L8,12 L2,10 L8,8 Z" fill="#C9A84C" opacity="0.7" />
      </svg>
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-rose-gold/60" />
    </motion.div>
  );
}
