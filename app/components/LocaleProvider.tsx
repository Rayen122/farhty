"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  LOCALE_DIR,
  LOCALE_LANG,
  isLocale,
  type Dictionary,
  type Locale,
} from "../lib/i18n";

export const LOCALE_STORAGE_KEY = "farhty-locale";
/** Posé dans `sessionStorage` : le sélecteur revient à chaque nouvelle visite, pas à chaque page. */
const LOCALE_SESSION_KEY = "farhty-locale-chosen";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dictionary;
  /** `false` tant que le choix enregistré n'a pas été lu : sert à n'ouvrir le sélecteur qu'une fois. */
  ready: boolean;
  hasChosen: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Le serveur rend toujours l'arabe et la langue enregistrée est appliquée au montage.
 * C'est ce qui permet à la page d'accueil de rester statique : lire un cookie dans le
 * layout la basculerait en rendu dynamique à chaque visite.
 */
export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);
  const [hasChosen, setHasChosen] = useState(false);

  /* La langue retenue s'applique d'emblée derrière le sélecteur, mais on redemande
     à chaque visite : le clic sert aussi de geste utilisateur qui débloque le son. */
  useEffect(() => {
    let stored: string | null = null;
    let chosenThisVisit = false;
    try {
      stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      chosenThisVisit = sessionStorage.getItem(LOCALE_SESSION_KEY) === "1";
    } catch {
      /* navigation privée ou stockage bloqué : on reste sur la langue par défaut */
    }
    if (isLocale(stored)) setLocaleState(stored);
    setHasChosen(chosenThisVisit && isLocale(stored));
    setReady(true);
  }, []);

  /* `dir` pilote toute la mise en page — le français doit repasser en LTR. */
  useEffect(() => {
    const root = document.documentElement;
    root.lang = LOCALE_LANG[locale];
    root.dir = LOCALE_DIR[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setHasChosen(true);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      sessionStorage.setItem(LOCALE_SESSION_KEY, "1");
    } catch {
      /* le choix ne survivra pas à la session, mais la page fonctionne quand même */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: DICTIONARIES[locale], ready, hasChosen }),
    [locale, setLocale, ready, hasChosen]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale doit être utilisé à l'intérieur de <LocaleProvider>");
  return ctx;
}

/** Raccourci pour les composants qui ne veulent que les textes. */
export function useT(): Dictionary {
  return useLocale().t;
}
