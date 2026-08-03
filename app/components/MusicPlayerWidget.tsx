"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music, VolumeX, Play, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerWidgetProps {
  musicUrl?: string;
  musicTitle?: string;
  goldColor?: string;
}

export default function MusicPlayerWidget({
  musicUrl,
  musicTitle = "خلفية موسيقية",
  goldColor = "#D4AF37",
}: MusicPlayerWidgetProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  useEffect(() => {
    if (!musicUrl || musicUrl === "none") return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audioRef.current = audio;

    const attemptPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBlocked(false);
          setShowPrompt(false);
        })
        .catch((err) => {
          console.warn("[MusicPlayer] Autoplay blocked, waiting for user click", err);
          setIsPlaying(false);
          setIsBlocked(true);
        });
    };

    attemptPlay();

    /* Si bloqué par le navigateur, écouter le premier clic/touch n'importe où pour démarrer le son */
    const handleFirstTouch = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsBlocked(false);
            setShowPrompt(false);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstTouch, { once: true });
    window.addEventListener("touchstart", handleFirstTouch, { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
      window.removeEventListener("click", handleFirstTouch);
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, [musicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBlocked(false);
          setShowPrompt(false);
        })
        .catch(() => {});
    }
  };

  if (!musicUrl || musicUrl === "none") return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2 select-none" dir="rtl">
      <AnimatePresence>
        {(isBlocked || showPrompt) && !isPlaying && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={togglePlay}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-white shadow-xl cursor-pointer hover:bg-black/95 transition-all text-xs font-bold"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>تشغيل الموسيقى 🎵</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={togglePlay}
        className="group relative flex items-center gap-2.5 px-3 py-2 rounded-full bg-black/75 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:border-amber-400/60 transition-all cursor-pointer"
        title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      >
        {/* Animated Vinyl Disc */}
        <div className="relative w-7 h-7 flex items-center justify-center rounded-full bg-amber-500/20">
          <Disc
            className={`w-5 h-5 text-amber-400 ${isPlaying ? "animate-spin" : "opacity-60"}`}
            style={{ animationDuration: "3s" }}
          />
        </div>

        {/* Music Title & Equalizer Bars */}
        <div className="flex flex-col items-start min-w-0 pr-1 pl-2">
          <span className="text-[10px] text-white/80 font-medium truncate max-w-[110px]">
            {musicTitle}
          </span>
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-2.5 mt-0.5">
              <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite]" style={{ height: "100%" }} />
              <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_0.2s]" style={{ height: "60%" }} />
              <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.7s_infinite_0.4s]" style={{ height: "80%" }} />
            </div>
          ) : (
            <span className="text-[9px] text-white/40">متوقف</span>
          )}
        </div>

        {/* Toggle Icon */}
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80">
          {isPlaying ? <Music className="w-3 h-3 text-amber-400" /> : <VolumeX className="w-3 h-3 text-white/40" />}
        </div>
      </motion.button>
    </div>
  );
}
