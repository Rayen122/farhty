"use client";

import { LOCALES, LOCALE_LABELS, type Locale } from "../lib/i18n";
import { useLocale } from "./LocaleProvider";

/** Permet de revenir sur le choix fait à l'arrivée, sans avoir à vider le navigateur. */
export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <span className="text-xs font-bold text-[var(--color-muted)]">{t.footer.language}</span>
      <div className="flex items-center gap-1 rounded-full border border-white/15 p-1">
        {LOCALES.map((code: Locale) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            lang={code === "fr" ? "fr" : "ar"}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              locale === code
                ? "bg-[var(--color-coral)] text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {LOCALE_LABELS[code].name}
          </button>
        ))}
      </div>
    </div>
  );
}
