"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Smartphone, Tablet, ArrowLeft, Sparkles } from "lucide-react";

type Device = "mobile" | "tablet";

const SIZES: Record<Device, { w: number; h: number }> = {
  mobile: { w: 390, h: 844 },
  tablet: { w: 820, h: 1180 },
};

const LABELS: Record<Device, string> = {
  mobile: "الهاتف المحمول",
  tablet: "الجهاز اللوحي",
};

/* Outer dimensions of phone/tablet mockup chassis */
const OUTER: Record<Device, { w: number; h: number }> = {
  mobile: { w: SIZES.mobile.w + 28, h: SIZES.mobile.h + 28 },
  tablet: { w: SIZES.tablet.w + 32, h: SIZES.tablet.h + 32 },
};

/* ── Phone Mockup Chassis ── */
function PhoneMockup({ src, hideHomeIndicator }: { src: string; hideHomeIndicator?: boolean }) {
  const { w, h } = SIZES.mobile;
  return (
    <div className="relative select-none" style={{ width: w + 28, height: h + 28 }}>
      {/* Side Buttons */}
      <div className="absolute -left-[4px] top-[120px] w-[4px] h-10 bg-[#D4AF37]/80 rounded-l-sm shadow-md" />
      <div className="absolute -left-[4px] top-[175px] w-[4px] h-14 bg-[#D4AF37]/80 rounded-l-sm shadow-md" />
      <div className="absolute -left-[4px] top-[245px] w-[4px] h-14 bg-[#D4AF37]/80 rounded-l-sm shadow-md" />
      <div className="absolute -right-[4px] top-[160px] w-[4px] h-20 bg-[#D4AF37]/80 rounded-r-sm shadow-md" />

      {/* Phone Body with Gold Accent Rim */}
      <div
        className="relative w-full h-full rounded-[3.4rem] p-[14px] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.85)] border-2 border-[#D4AF37]/40"
        style={{ background: "linear-gradient(155deg, #2D141E, #14070B, #090204)" }}
      >
        <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-black ring-1 ring-white/10">
          <iframe
            src={src}
            title="معاينة الهاتف"
            className="border-0 block w-full h-full"
            style={{ width: w, height: h }}
            scrolling="yes"
          />
          {/* Dynamic Island / Top Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-[24px] bg-black rounded-full z-[999] pointer-events-none flex items-center justify-end px-3 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#160B10] border border-[#D4AF37]/30" />
          </div>
          {/* Home indicator bar */}
          {!hideHomeIndicator && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-[999] pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tablet Mockup Chassis ── */
function TabletMockup({ src }: { src: string }) {
  const { w, h } = SIZES.tablet;
  return (
    <div className="relative select-none" style={{ width: w + 32, height: h + 32 }}>
      <div
        className="relative w-full h-full rounded-[2.5rem] p-[16px] shadow-2xl border-2 border-[#D4AF37]/30"
        style={{ background: "linear-gradient(155deg, #2D141E, #12070A)" }}
      >
        <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-black ring-1 ring-white/10">
          <iframe
            src={src}
            title="معاينة الجهاز اللوحي"
            className="border-0 block w-full h-full"
            style={{ width: w, height: h }}
            scrolling="yes"
          />
        </div>
      </div>
    </div>
  );
}

export default function DeviceFrame({ desktopNode }: { desktopNode: React.ReactNode }) {
  const [device, setDevice] = useState<Device>("mobile");
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams?.toString();

  // Create iframe embed URL with embed=1 parameter
  const embedSrc = `${pathname}?${qs ? qs + "&" : ""}embed=1`;
  const hideHomeIndicator = pathname === "/templates/classic";

  // Calculate dynamic scale factor to always fit mockup on small viewports
  useLayoutEffect(() => {
    const compute = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const availW = stage.clientWidth - 24;
      const availH = stage.clientHeight - 80;
      const outer = OUTER[device];
      setScale(Math.min(1, availW / outer.w, availH / outer.h));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [device]);

  const templateSlug = pathname.replace("/templates/", "");

  return (
    <>
      {/* Top Navigation Bar: Back button & Phone / Tablet switcher & Edit in Editor button */}
      <div
        /* max-w : sur un téléphone la barre débordait de l'écran et rognait les
           boutons des deux bords — les libellés passent en icônes seules. */
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] max-w-[calc(100vw-1rem)] bg-[#1C050B]/90 backdrop-blur-md border border-[#D4AF37]/40 rounded-full px-2 py-1.5 flex items-center gap-1 whitespace-nowrap shadow-2xl sm:px-3 sm:gap-2"
        dir="rtl"
      >
        <button
          onClick={() => router.push("/#templates")}
          aria-label="الرجوع إلى القوالب"
          className="px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-[#F4E4BA] bg-[#8B0A1A]/40 hover:bg-[#8B0A1A] border border-[#D4AF37]/30 transition-all cursor-pointer sm:px-3.5"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">الرجوع للقوالب</span>
        </button>

        <span className="w-px h-5 bg-[#D4AF37]/30 mx-1" aria-hidden />

        <button
          onClick={() => {
            router.push(templateSlug && templateSlug !== pathname ? `/editor?slug=${templateSlug}` : "/editor");
          }}
          aria-label="تعديل في المحرر"
          className="shrink-0 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[var(--color-coral)] to-[#8B0A1A] hover:opacity-90 border border-[#D4AF37]/50 shadow-md transition-all cursor-pointer sm:px-4"
        >
          <Sparkles size={14} />
          {/* Action principale : c'est le seul libellé qu'on garde sur mobile */}
          <span>تعديل في المحرر</span>
        </button>

        <span className="w-px h-5 bg-[#D4AF37]/30 mx-1" aria-hidden />

        {(["mobile", "tablet"] as Device[]).map((d) => {
          const Icon = d === "mobile" ? Smartphone : Tablet;
          return (
            <button
              key={d}
              onClick={() => setDevice(d)}
              aria-label={`عرض في ${LABELS[d]}`}
              aria-pressed={device === d}
              className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer sm:px-3.5 ${
                device === d
                  ? "bg-gradient-to-r from-[#8B0A1A] to-[#660511] text-[#F4E4BA] border border-[#D4AF37]/60 shadow-md"
                  : "text-[#F4E4BA]/70 hover:bg-white/10"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{LABELS[d]}</span>
            </button>
          );
        })}
      </div>

      {/* Full-screen backdrop stage */}
      <div
        ref={stageRef}
        className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden pt-20 pb-4 px-4"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, #2D0B14 0%, #17040A 60%, #0A0104 100%)",
        }}
      >
        {/* Soft Gold Background Ambient Glow */}
        <div className="absolute w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

        <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
          {device === "mobile" && <PhoneMockup src={embedSrc} hideHomeIndicator={hideHomeIndicator} />}
          {device === "tablet" && <TabletMockup src={embedSrc} />}
        </div>
      </div>
    </>
  );
}
