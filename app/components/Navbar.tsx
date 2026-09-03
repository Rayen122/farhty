"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Diamond } from "lucide-react";
import Link from "next/link";
import { useT } from "./LocaleProvider";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useT();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
      <div className="max-w-5xl mx-auto rounded-full bg-white/90 backdrop-blur-xl border border-[var(--color-line)] shadow-lg shadow-[#8B0A1A]/5 flex items-center justify-between h-[72px] px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 text-decoration-none group cursor-pointer">
          <div className="w-12 h-12 relative flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden rounded-full border-2 border-[var(--color-line)]">
            <img src="/brand/icon-primary.png" alt="Farhty Logo" className="w-full h-full object-contain p-1.5" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="/#templates"
            onClick={(e) => handleAnchorClick(e, "templates")}
            className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer"
          >
            {t.nav.collection}
          </a>
          <a
            href="/#features"
            onClick={(e) => handleAnchorClick(e, "features")}
            className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer"
          >
            {t.nav.features}
          </a>
          <a
            href="/#pricing"
            onClick={(e) => handleAnchorClick(e, "pricing")}
            className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer"
          >
            {t.nav.pricing}
          </a>
          <Link href="/editor" className="text-[var(--color-muted)] text-sm font-bold hover:text-[var(--color-coral)] transition-colors cursor-pointer flex items-center gap-1">
            <span>{t.nav.editor}</span>
          </Link>

          <div className="w-[1px] h-5 bg-[var(--color-line)]"></div>

          {/* CTA Button */}
          <a
            href="/#templates"
            onClick={(e) => handleAnchorClick(e, "templates")}
            className="px-5 py-2.5 bg-transparent text-[var(--color-coral)] border border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white transition-all rounded-full font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Diamond className="w-3.5 h-3.5" />
            <span className="text-sm">{t.nav.cta}</span>
          </a>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-cream)] border border-[var(--color-line)] text-[var(--color-ink)] cursor-pointer"
            aria-label={t.nav.menu}
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
              href="/#templates"
              onClick={(e) => {
                setMobileOpen(false);
                handleAnchorClick(e, "templates");
              }}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer flex items-center justify-between"
            >
              {t.nav.collection}
            </a>
            <a
              href="/#features"
              onClick={(e) => {
                setMobileOpen(false);
                handleAnchorClick(e, "features");
              }}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer"
            >
              {t.nav.features}
            </a>
            <a
              href="/#pricing"
              onClick={(e) => {
                setMobileOpen(false);
                handleAnchorClick(e, "pricing");
              }}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer"
            >
              {t.nav.pricing}
            </a>
            <Link
              href="/editor"
              onClick={() => setMobileOpen(false)}
              className="text-base font-bold text-[var(--color-ink)] py-3 border-b border-[var(--color-line-soft)] cursor-pointer"
            >
              {t.nav.editorLong}
            </Link>

            <a
              href="/#templates"
              onClick={(e) => {
                setMobileOpen(false);
                handleAnchorClick(e, "templates");
              }}
              className="mt-4 py-4 bg-[var(--color-coral)] text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Diamond className="w-4 h-4" />
              <span>{t.nav.cta}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
