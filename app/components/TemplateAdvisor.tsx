"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MessageCircleHeart, X, RotateCcw, Sparkles, Crown } from "lucide-react";
import { ADVISOR_QUESTIONS, recommend, type AdvisorTag } from "../lib/templateAdvisor";
import { useLocale } from "./LocaleProvider";

type Answer = { questionId: string; optionId: string; tags: AdvisorTag[] };

const HINT_SESSION_KEY = "farhty-advisor-hint";

/**
 * Conseiller de modèles présenté comme une conversation.
 *
 * Les réponses sont des boutons plutôt qu'un champ libre : le résultat reste
 * prévisible, il n'y a ni appel réseau ni clé API, et la recommandation ne peut
 * porter que sur des modèles qui existent réellement.
 */
export default function TemplateAdvisor() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hintShown, setHintShown] = useState(false);
  const [hovering, setHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* L'accroche se montre d'elle-même une fois par session : sur mobile il n'y a
     pas de survol, et sans elle le bouton n'est qu'une icône sans explication. */
  useEffect(() => {
    let dejaVue = false;
    try {
      dejaVue = sessionStorage.getItem(HINT_SESSION_KEY) === "1";
    } catch {
      /* stockage bloqué : l'accroche s'affichera à chaque visite, sans gravité */
    }
    if (dejaVue) return;

    const apparition = setTimeout(() => {
      setHintShown(true);
      try {
        sessionStorage.setItem(HINT_SESSION_KEY, "1");
      } catch {}
    }, 4000);
    const disparition = setTimeout(() => setHintShown(false), 11000);

    return () => {
      clearTimeout(apparition);
      clearTimeout(disparition);
    };
  }, []);

  const step = answers.length;
  const current = ADVISOR_QUESTIONS[step];
  const finished = step >= ADVISOR_QUESTIONS.length;

  const results = useMemo(
    () => (finished ? recommend(answers.flatMap((a) => a.tags)) : []),
    [finished, answers]
  );

  /* Garde la dernière question visible quand la conversation s'allonge. */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [answers, open]);

  const label = (key: string) => (t.advisor as Record<string, string>)[key] ?? key;

  const choose = (optionId: string, tags: AdvisorTag[]) => {
    setAnswers((prev) => [...prev, { questionId: current.id, optionId, tags }]);
  };

  const restart = () => setAnswers([]);

  return (
    <>
      {/* Lanceur — à gauche et remonté sur mobile pour ne pas heurter la barre
          d'appel à l'action, qui occupe déjà le bas de l'écran. */}
      <div
        className="fixed left-4 bottom-28 md:bottom-6 z-[90] flex items-end gap-2"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label={t.advisor.launcher}
          aria-describedby="advisor-teaser"
          className="shrink-0 flex items-center gap-2 rounded-full bg-[var(--color-coral)] text-white pl-4 pr-5 py-3 shadow-[0_10px_30px_rgba(139,10,26,0.35)] hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          <MessageCircleHeart className="w-5 h-5" />
          <span className="text-sm font-extrabold hidden sm:inline">{t.advisor.launcher}</span>
        </button>

        <AnimatePresence>
          {(hovering || hintShown) && !open && (
            <motion.p
              id="advisor-teaser"
              role="status"
              initial={{ opacity: 0, x: -8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              dir={locale === "fr" ? "ltr" : "rtl"}
              /* Toujours à droite du bouton : celui-ci est ancré à gauche de
                 l'écran dans les deux sens de lecture. */
              className="max-w-[62vw] sm:max-w-xs rounded-2xl rounded-bl-md bg-white border border-[var(--color-line)] px-4 py-2.5 text-xs sm:text-sm font-bold text-[var(--color-ink)] shadow-xl"
            >
              {t.advisor.teaser}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-[#1C050B]/70 backdrop-blur-sm p-0 sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              dir={locale === "fr" ? "ltr" : "rtl"}
              className="w-full sm:max-w-lg h-[85vh] sm:h-[600px] flex flex-col rounded-t-[28px] sm:rounded-[28px] bg-[var(--color-cream)] border border-[var(--color-line)] shadow-2xl overflow-hidden"
            >
              {/* En-tête */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 bg-white border-b border-[var(--color-line)]">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[var(--color-velvet)] text-[var(--color-coral)] flex items-center justify-center">
                    <Crown className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[var(--color-ink)]">{t.advisor.title}</span>
                    {!finished && (
                      <span className="text-[11px] font-bold text-[var(--color-muted)]">
                        {t.advisor.step} {step + 1} {t.advisor.of} {ADVISOR_QUESTIONS.length}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t.advisor.close}
                  className="w-9 h-9 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-line)] text-[var(--color-muted)] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Conversation */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                <Bubble>{t.advisor.intro}</Bubble>

                {answers.map((answer) => (
                  <div key={answer.questionId} className="space-y-3">
                    <Bubble>{label(`q_${answer.questionId}`)}</Bubble>
                    <div className="flex justify-end">
                      <span className="max-w-[80%] rounded-2xl rounded-br-md bg-[var(--color-coral)] text-white px-4 py-2.5 text-sm font-bold shadow-sm">
                        {label(`a_${answer.questionId}_${answer.optionId}`)}
                      </span>
                    </div>
                  </div>
                ))}

                {!finished && <Bubble>{label(`q_${current.id}`)}</Bubble>}

                {finished && (
                  <>
                    <Bubble>{t.advisor.resultIntro}</Bubble>
                    <div className="space-y-3">
                      {results.map((result, index) => (
                        <div
                          key={result.slug}
                          className="flex items-center gap-3 rounded-2xl bg-white border border-[var(--color-line)] p-3 shadow-sm"
                        >
                          <img
                            src={result.image || "/site/tpl/royal-cover.jpg"}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            {index === 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[var(--color-coral)] bg-[var(--color-velvet)] rounded-full px-2 py-0.5 mb-1">
                                <Sparkles className="w-3 h-3" /> {t.advisor.best}
                              </span>
                            )}
                            <p className="font-extrabold text-[var(--color-ink)] text-sm truncate">
                              {result.name}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setOpen(false);
                              router.push(`/templates/${result.slug}`);
                            }}
                            className="shrink-0 text-xs font-extrabold text-white bg-[var(--color-coral)] hover:bg-[#8B0A1A] rounded-full px-4 py-2 transition-colors cursor-pointer"
                          >
                            {t.advisor.view}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Réponses possibles, ou reprise du questionnaire */}
              <div className="border-t border-[var(--color-line)] bg-white px-5 py-4">
                {finished ? (
                  <button
                    onClick={restart}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-line)] hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] text-[var(--color-ink)] py-3 text-sm font-extrabold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.advisor.restart}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {current.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => choose(option.id, option.tags)}
                        className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-cream)] hover:bg-[var(--color-velvet)] hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] text-[var(--color-ink)] px-3 py-3 text-sm font-bold transition-all cursor-pointer"
                      >
                        {label(`a_${current.id}_${option.id}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <span className="max-w-[85%] rounded-2xl rounded-bl-md bg-white border border-[var(--color-line)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-sm">
        {children}
      </span>
    </div>
  );
}
