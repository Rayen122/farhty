"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Diamond, ArrowLeft, Play, Crown } from "lucide-react";
import { templates as allTemplates, Template } from "../templates/data";

export default function Templates() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "المجموعة الكاملة" },
    { id: "royal", label: "القصور الملكية" },
    { id: "envelope", label: "أختام الشمع" },
    { id: "tunisian", label: "التراث الأصيل" },
    { id: "floral", label: "الورود والشموع" },
  ];

  const filteredTemplates = allTemplates.filter((t) => {
    if (activeCategory === "royal") return t.slug.includes("porte-chateau") || t.slug.includes("imperiale") || t.slug.includes("cristal") || t.slug.includes("joie") || t.category.includes("الملكي") || t.category.includes("Prestige");
    if (activeCategory === "envelope") return t.slug.includes("lettre") || t.slug.includes("parchemin") || t.slug.includes("amour");
    if (activeCategory === "tunisian") return t.category.includes("تونس") || t.category.includes("Traditionnel") || t.slug.includes("jasmin") || t.slug.includes("oasis") || t.slug.includes("tunisian");
    if (activeCategory === "floral") return t.slug.includes("jardin") || t.slug.includes("lanternes");
    return true;
  });

  const openDemo = (slug: string) => {
    router.push(`/templates/${slug}`);
  };

  return (
    <section id="templates" className="relative bg-[var(--color-cream)] py-24" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--color-velvet)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-[var(--color-velvet)] blur-[150px] rounded-full pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--color-line)] text-[var(--color-coral)] font-bold text-xs mb-4 shadow-sm">
            <Crown className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">The Collection</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-extrabold text-[var(--color-ink)] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            روائع التصاميم الفاخرة
          </h2>
          <p className="text-[var(--color-muted)] text-base sm:text-lg font-semibold max-w-2xl mx-auto">
            انتقِ التصميم الذي يعبّر عن فخامة مناسبتك. كل دعوة هي تحفة فنية تنبض بالحياة، الموسيقى، والتفاصيل السينمائية.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[var(--color-coral)] text-white shadow-md scale-105 border border-[var(--color-coral)]"
                  : "bg-white text-[var(--color-muted)] border border-[var(--color-line)] hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry/Bento Grid of Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTemplates.map((item) => (
            <TemplateCard key={item.id} item={item} onSelect={openDemo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplateCard({ item, onSelect }: { item: Template; onSelect: (slug: string) => void }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group cursor-pointer relative rounded-[28px] overflow-hidden bg-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-coral)] shadow-md hover:shadow-2xl transition-all h-[420px] flex flex-col justify-end"
      onClick={() => onSelect(item.slug)}
    >
      {/* Cover Image */}
      <img
        src={item.image || "/site/tpl/classic-cover.jpg"}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/site/tpl/royal-cover.jpg";
        }}
      />

      {/* Dark gradient overlay for consistent text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300" />

      {/* Center Play Button (Reveals on Hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100 z-10">
        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[var(--color-coral)] shadow-2xl">
          <Play className="w-6 h-6 fill-[var(--color-coral)] ml-1" />
        </div>
      </div>

      {/* Content Details */}
      <div className="relative z-20 p-6 flex flex-col justify-end">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[var(--color-gold-light)] text-[11px] font-bold mb-2">
            {item.category}
          </span>
          <h3 className="text-2xl font-extrabold text-white drop-shadow-md" style={{ fontFamily: "var(--font-amiri)" }}>
            {item.name}
          </h3>
          <p className="text-xs text-white/80 font-medium mt-1 drop-shadow-sm line-clamp-1">
            {item.subtitle}
          </p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90 group-hover:text-white transition-colors">
          <span className="flex items-center gap-1.5">
            <Diamond className="w-3.5 h-3.5 text-[var(--color-gold)]" />
            تجربة الأنميشن
          </span>
          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
}
