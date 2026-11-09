"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOCALES, LOCALE_DIR, LOCALE_LABELS, type Locale } from "../lib/i18n";
import { useLocale } from "./LocaleProvider";

/**
 * Sélecteur de langue affiché à chaque visite (une fois par session d'onglet).
 *
 * La dernière langue choisie reste appliquée derrière, et on peut en changer
 * depuis le pied de page. Pas de bouton « fermer » — choisir est l'action, donc
 * aucune impasse possible.
 */
export default function LanguageGate() {
  const { setLocale, ready, hasChosen } = useLocale();
  const open = ready && !hasChosen;
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  /* Empêche la page de défiler derrière la fenêtre, et donne le focus au premier choix. */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose your language · اختر لغتك"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[#1C050B]/80 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-md rounded-[28px] bg-[var(--color-cream)] border border-[var(--color-line)] shadow-2xl p-7 sm:p-9 text-center"
          >
            <img
              src="/brand/icon-primary.png"
              alt="Farhty"
              className="w-16 h-16 rounded-full object-contain p-2.5 mx-auto mb-5 border-2 border-[var(--color-line)] bg-white"
            />

            {/* Bilingue à dessein : à cet instant on ignore encore la langue du visiteur. */}
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              فرحتي · Farhty
            </h2>
            <p className="text-sm text-[var(--color-muted)] font-semibold mb-7">
              اختر لغتك · Choisissez votre langue
            </p>

            <div className="flex flex-col gap-3">
              {LOCALES.map((code: Locale, index) => {
                const label = LOCALE_LABELS[code];
                return (
                  <button
                    key={code}
                    ref={index === 0 ? firstButtonRef : undefined}
                    onClick={() => setLocale(code)}
                    dir={LOCALE_DIR[code]}
                    lang={code === "fr" ? "fr" : "ar"}
                    className="group w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-white border border-[var(--color-line)] hover:border-[var(--color-coral)] hover:bg-[var(--color-velvet)] focus-visible:border-[var(--color-coral)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl leading-none" aria-hidden>
                        {label.flag}
                      </span>
                      <span className="text-lg font-extrabold text-[var(--color-ink)] group-hover:text-[var(--color-coral)] transition-colors">
                        {label.name}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-[var(--color-muted)]">{label.hint}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
