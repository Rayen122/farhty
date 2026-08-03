"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGallery3DProps {
  photos: string[];
  title?: string;
  subtitle?: string;
  goldColor?: string;
  textColor?: string;
}

export default function PhotoGallery3D({
  photos,
  title = "معرض صور العروسين",
  subtitle = "أجمل اللحظات والذكريات",
  goldColor = "#D4AF37",
  textColor = "#FFFFFF",
}: PhotoGallery3DProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!photos || photos.length === 0) return null;

  const count = photos.length;

  return (
    <section className="w-full py-14 px-4 flex flex-col items-center" dir="rtl">
      {/* Title */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5" style={{ color: goldColor }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: goldColor }}>
            {subtitle}
          </span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold drop-shadow-md"
          style={{ color: textColor, fontFamily: "var(--font-amiri, serif)" }}
        >
          {title}
        </h2>
        <div className="w-14 h-0.5 mx-auto mt-2.5 rounded-full" style={{ backgroundColor: goldColor }} />
      </div>

      {/* Main Photo Showcase — large hero card with 3D tilt */}
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, rotateY: -15, scale: 0.92 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 cursor-pointer mx-auto"
          style={{
            borderColor: `${goldColor}66`,
            perspective: "800px",
            maxWidth: "280px",
          }}
          onClick={() => setSelectedIndex(activeSlide)}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={photos[activeSlide]}
            alt={`صورة ${activeSlide + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
            {activeSlide + 1} / {count} · انقر للتكبير 🔍
          </div>
        </motion.div>
      </div>

      {/* Thumbnail strip — horizontal scroll with 3D rotation animation */}
      {count > 1 && (
        <div className="mt-5 w-full max-w-sm mx-auto">
          <div className="flex gap-2.5 justify-center flex-wrap px-2">
            {photos.map((url, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveSlide(i)}
                className="relative rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all"
                style={{
                  width: "52px",
                  height: "66px",
                  borderColor: i === activeSlide ? goldColor : "rgba(255,255,255,0.2)",
                  opacity: i === activeSlide ? 1 : 0.6,
                }}
                animate={
                  i === activeSlide
                    ? { scale: 1.1, rotateY: [0, 360] }
                    : { scale: 1, rotateY: 0 }
                }
                transition={
                  i === activeSlide
                    ? { rotateY: { duration: 0.6, ease: "easeInOut" }, scale: { duration: 0.3 } }
                    : { duration: 0.3 }
                }
                whileHover={{ opacity: 1, scale: 1.05 }}
              >
                <img
                  src={url}
                  alt={`صورة مصغرة ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {i === activeSlide && (
                  <div
                    className="absolute inset-0 border-2 rounded-xl"
                    style={{ borderColor: goldColor, boxShadow: `0 0 12px ${goldColor}55` }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setActiveSlide((activeSlide - 1 + count) % count)}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer border border-white/20"
            >
              <ChevronRight size={16} />
            </button>
            <div className="flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    width: i === activeSlide ? "18px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor: i === activeSlide ? goldColor : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveSlide((activeSlide + 1) % count)}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer border border-white/20"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            {count > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((selectedIndex - 1 + count) % count);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors z-10 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((selectedIndex + 1) % count);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors z-10 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-sm max-h-[80vh] rounded-2xl overflow-hidden border border-white/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedIndex]}
                alt={`صورة ${selectedIndex + 1}`}
                className="w-full h-full object-contain max-h-[75vh]"
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold">
                {selectedIndex + 1} / {count}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
