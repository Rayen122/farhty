"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Diamond } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto rounded-full bg-white/90 backdrop-blur-xl border border-[var(--color-line)] shadow-lg shadow-[#8B0A1A]/5 flex items-center justify-between h-[72px] px-6">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 text-decoration-none group cursor-pointer">
          <div className="w-12 h-12 relative flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden rounded-full border-2 border-[var(--color-line)]">
            <img src="/logo.jpg" alt="Farhty Logo" className="w-full h-full object-cover" />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#templates" className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer">
            المجموعة الفاخرة
          </a>
          <a href="#features" className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer">
            المميزات
          </a>
          <a href="#pricing" className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer">
            الباقات
          </a>

          <div className="w-[1px] h-5 bg-[var(--color-line)]"></div>

          {/* CTA Button */}
          <a href="#templates" className="px-5 py-2.5 bg-transparent text-[var(--color-coral)] border border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white transition-all rounded-full font-bold flex items-center gap-2 cursor-pointer shadow-sm">
            <Diamond className="w-3.5 h-3.5" />
            <span className="text-sm">ابدأ تصميمك</span>
          </a>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-cream)] border border-[var(--color-line)] text-[var(--color-ink)] cursor-pointer"
            aria-label="القائمة"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-[84px] left-4 right-4 bg-white/95 backdrop-blur-xl border border-[var(--color-line)] rounded-2xl p-5 flex flex-col gap-3 shadow-2xl"
          >
            <a
              href="#templates"
              onClick={() => setMobileOpen(false)}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer flex items-center justify-between"
            >
              المجموعة الفاخرة
            </a>
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer"
            >
              المميزات
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer"
            >
              الباقات
            </a>

            <a
              href="#templates"
              onClick={() => setMobileOpen(false)}
              className="mt-4 py-4 bg-[var(--color-coral)] text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Diamond className="w-4 h-4" />
              <span>اصنع دعوتك الآن</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
