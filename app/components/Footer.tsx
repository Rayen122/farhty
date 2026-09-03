"use client";

import { Diamond, Sparkles, MessageCircle, ArrowUp } from "lucide-react";
import Image from "next/image";
import { WHATSAPP_URL } from "../lib/contact";
import { useT } from "./LocaleProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const t = useT();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white text-[var(--color-ink)] pt-24 pb-12 border-t border-[var(--color-line)] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-[#FDF5F8] blur-[150px] opacity-70 pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#FAF6F0] blur-[120px] opacity-80 pointer-events-none -z-10" />

      <div className="container-x relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[var(--color-line)]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-line)] shadow-sm">
                <img src="/brand/icon-primary.png" alt="Farhty Logo" className="w-full h-full object-contain p-2" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-3xl text-[var(--color-coral)] tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                  فرحتي
                </span>
                <span className="text-xs text-[var(--color-muted)] font-bold mt-1 tracking-widest uppercase">
                  {t.footer.tagline}
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-md font-semibold">
              {t.footer.about}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-[var(--color-coral)] tracking-[0.2em] uppercase flex items-center gap-2">
              <Diamond className="w-3 h-3" /> {t.footer.linksTitle}
            </h4>
            <ul className="space-y-3 text-sm font-bold text-[var(--color-muted)]">
              <li>
                <a href="#templates" className="hover:text-[var(--color-coral)] hover:translate-x-[-4px] transition-all inline-block">{t.footer.linkTemplates}</a>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--color-coral)] hover:translate-x-[-4px] transition-all inline-block">{t.footer.linkFeatures}</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[var(--color-coral)] hover:translate-x-[-4px] transition-all inline-block">{t.footer.linkPricing}</a>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-[var(--color-coral)] tracking-[0.2em] uppercase flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> {t.footer.contactTitle}
            </h4>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed font-semibold">
              {t.footer.contactText}
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-[var(--color-coral)] font-bold text-sm border border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.footer.contactCta}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--color-muted)] font-bold">
          <p className="tracking-wider">© {new Date().getFullYear()} Farhty · فرحتي. {t.footer.rights}</p>
          
          <button
            onClick={scrollToTop}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-cream)] border border-[var(--color-line)] text-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <LanguageSwitcher />

          <div className="flex items-center gap-2 tracking-widest uppercase">
            <span>{t.footer.madeIn}</span>
            <span className="text-[var(--color-coral)] font-extrabold">{t.footer.tunisia}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
