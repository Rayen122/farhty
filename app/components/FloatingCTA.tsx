"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Phone, Sparkles } from "lucide-react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          dir="rtl"
        >
          {isExpanded && (
            <div className="absolute bottom-full left-4 right-4 mb-3 bg-white/95 backdrop-blur-xl border border-[var(--color-line)] rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.1)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-ink)] text-lg" style={{ fontFamily: "var(--font-amiri)" }}>تواصل معنا لطلب دعوتك</span>
                <button onClick={() => setIsExpanded(false)} className="w-8 h-8 bg-[var(--color-cream)] hover:bg-[var(--color-line)] rounded-full flex items-center justify-center text-[var(--color-muted)] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-[var(--color-muted)] font-semibold">فريقنا جاهز لتصميم دعوة فرحك في أقل من 24 ساعة.</p>
              
              <button className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                <MessageCircle size={18} /> واتساب
              </button>
              <button className="w-full py-3.5 bg-white border border-[var(--color-line)] hover:border-[var(--color-coral)] text-[var(--color-ink)] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                <Phone size={18} /> مكالمة هاتفية
              </button>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-lg border-t border-[var(--color-line)] px-4 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-1 bg-[var(--color-coral)] text-white py-3.5 rounded-2xl text-sm font-extrabold shadow-[0_0_20px_rgba(182,109,111,0.3)] flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                اصنع دعوتك الآن
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 bg-white border border-[var(--color-line)] text-[var(--color-coral)] rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <MessageCircle size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
