"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Heart, Share2, Check, ChevronDown, Music, VolumeX } from "lucide-react";
import { getTemplateBySlug, type Template } from "../data";
import GateIntro from "../../components/GateIntro";
import RoyalInvitationIntro from "../../components/RoyalInvitationIntro";
import {
  EucalyptusCorner,
  RoseCluster,
  PetalParticles,
  FloralFrame,
  VineDivider,
  GoldOrnament,
} from "../../components/FloralDecorations";
import Imperiale from "../designs/Imperiale";
import JardinVintage from "../designs/JardinVintage";
import Amour from "../designs/Amour";
import LaJoie from "../designs/LaJoie";
import Jasmin from "../designs/Jasmin";
import MidosMarieme from "../designs/MidosMarieme";
import Tunisian from "../designs/Tunisian";
import EmeraudeRoyale from "../designs/EmeraudeRoyale";
import Da3waTemplates from "../designs/Da3waTemplates";
import DeviceFrame from "../../components/DeviceFrame";
import MusicPlayerWidget from "../../components/MusicPlayerWidget";
import InvitationCreditBar, { FarhtyLink, InvitationRefProvider } from "../../components/FarhtyCredit";
import GuestRsvp, { type GuestView } from "../../components/GuestRsvp";
import { useInvitationStore, subscribeToDraftAcrossFrames } from "../../lib/invitationStore";

export default function TemplateDemoPageEntry() {
  return (
    <Suspense fallback={null}>
      <TemplateDemoPage />
    </Suspense>
  );
}

function TemplateDemoPage() {
  return <TemplateContent />;
}

/**
 * Invitation réellement enregistrée, affichée sur /i/<id>.
 * On réutilise tout le rendu ci-dessous — les 24 designs — au lieu de le dupliquer.
 */
export function SavedInvitationView({
  slug,
  saved,
  id,
  guest,
}: {
  slug: string;
  saved: SavedInvitation;
  /** Sert de source au lien de parrainage imprimé en bas de l'invitation */
  id?: string;
  /** Famille qui consulte, quand l'invitation a été ouverte par un lien nominatif */
  guest?: GuestView | null;
}) {
  return (
    <Suspense fallback={null}>
      <TemplateContent slugProp={slug} saved={saved} invitationId={id} guest={guest} />
    </Suspense>
  );
}

type SavedInvitation = { draft: Template["previewText"]; geo?: Template["geo"]; layout?: Template["layout"] };

function TemplateContent({
  slugProp,
  saved,
  invitationId,
  guest,
}: {
  slugProp?: string;
  saved?: SavedInvitation;
  invitationId?: string;
  guest?: GuestView | null;
} = {}) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.self !== window.top || window.location.search.includes("embed=1")) {
        setInIframe(true);
        document.documentElement.classList.add("is-embed");
        document.body.classList.add("is-embed");
      }
    }
  }, []);

  const isEmbed = searchParams?.get("embed") === "1" || inIframe;
  const slug = slugProp ?? (params?.slug as string);
  const [template, setTemplate] = useState<Template | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const isLellaBeya = slug === "lella-beya";

  /* Mode brouillon : l'éditeur affiche cette page dans une iframe avec ?draft=1 */
  const isDraft = searchParams?.get("draft") === "1";
  const storedDraft = useInvitationStore((s) => s.draft);
  const storedSlug = useInvitationStore((s) => s.slug);
  const storedGeo = useInvitationStore((s) => s.geo);
  const storedLayout = useInvitationStore((s) => s.layout);

  useEffect(() => {
    if (!isDraft) return;
    useInvitationStore.persist.rehydrate();
    return subscribeToDraftAcrossFrames();
  }, [isDraft]);

  useEffect(() => {
    const t = getTemplateBySlug(slug);
    if (t) setTemplate(t);
  }, [slug]);

  /* On remplace le contenu de démo, soit par l'invitation enregistrée (/i/<id>),
     soit par le brouillon de l'éditeur. Tous les designs en profitent. */
  const effectiveTemplate: Template | null = !template
    ? null
    : saved
      ? {
          ...template,
          previewText: {
            ...template.previewText,
            ...saved.draft,
            /* Le bloc RSVP décoratif de la maquette laisse place au vrai, qui
               enregistre la réponse. Seuls les modèles `da3wa` honorent ce
               drapeau ; les autres gardent encore le leur (à retirer). */
            hideRsvp: true,
          },
          geo: saved.geo ?? template.geo,
          layout: saved.layout ?? template.layout,
        }
      : isDraft && storedDraft && storedSlug === slug
        ? {
            ...template,
            previewText: { ...template.previewText, ...storedDraft },
            geo: storedGeo ?? template.geo,
            layout: storedLayout ?? template.layout,
          }
        : template;

  useEffect(() => {
    if (!template) return;
    const target = new Date();
    target.setDate(target.getDate() + 87);
    target.setHours(18, 0, 0, 0);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [template]);

  // Mouse tracking for 3D card tilt
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  if (!template) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
        <div className="text-center">
          <p className="text-[#1C1318]/60 mb-4">القالب غير موجود</p>
          <button onClick={() => router.push("/#templates")} className="text-[#8B0A1A] font-bold underline cursor-pointer">
            الرجوع إلى القوالب
          </button>
        </div>
      </main>
    );
  }

  // Lella Beya specific colors
  const marsala = "#8B2252";
  const gold = "#C9A84C";
  const blush = "#F8F0F5";
  const eucGreen = "#6B8F71";
  const petalPink = "#E8B4B8";

  const renderContent = () => {
    // En mode brouillon, tout le rendu ci-dessous lit le contenu saisi dans l'éditeur
    const template = effectiveTemplate!;

    // Use lella beya design
    if (isLellaBeya) {
      return (
        <main dir="rtl" className={`min-h-screen bg-blush-gradient text-charcoal overflow-x-hidden ${!envelopeOpen ? "h-screen overflow-hidden" : ""}`}>
          {/* Intro overlay (Royal Invitation Card) */}
          <AnimatePresence>
            {!envelopeOpen && (
              <RoyalInvitationIntro
                onOpen={() => setEnvelopeOpen(true)}
                brideName={template.previewText.bride}
                groomName={template.previewText.groom}
                marsalaColor={marsala}
                goldColor={gold}
              />
            )}
          </AnimatePresence>

          {/* Floating navigation bar - shown ONLY outside iframe */}
          {!isEmbed && (
            <motion.div
              initial={{ y: -100 }}
              animate={envelopeOpen ? { y: 0 } : { y: -100 }}
              transition={{ delay: 0.5, type: "spring", damping: 20 }}
              className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-marsala/5"
            >
              <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <button onClick={() => router.push("/#templates")} aria-label="الرجوع إلى القوالب" className="flex items-center gap-2 text-charcoal text-sm font-medium hover:text-marsala transition-all cursor-pointer">
                  <ArrowLeft size={18} /> رجوع
                </button>
                <div className="text-charcoal flex items-center gap-2">
                  <span className="text-[10px] text-marsala/60 uppercase tracking-wider">تجربة</span>
                  <span className="font-script text-xl text-marsala">{template.name}</span>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 bg-marsala/5 rounded-full flex items-center justify-center hover:bg-marsala/10 transition-all cursor-pointer">
                    <Share2 size={16} className="text-marsala" />
                  </button>
                  <button className="w-9 h-9 bg-marsala/5 rounded-full flex items-center justify-center hover:bg-marsala/10 transition-all cursor-pointer">
                    <Heart size={16} className="text-marsala" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* === HERO SECTION === */}
          <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
            style={{
              background: `linear-gradient(180deg, #FDF5F8 0%, #F8E8F0 40%, #F0D8E5 70%, #FDF5F8 100%)`,
            }}
          >
            <PetalParticles count={18} color={petalPink} />
            <EucalyptusCorner position="top-left" size={250} opacity={0.35} />
            <EucalyptusCorner position="top-right" size={250} opacity={0.35} />
            <EucalyptusCorner position="bottom-left" size={200} opacity={0.25} />
            <EucalyptusCorner position="bottom-right" size={200} opacity={0.25} />

            <RoseCluster className="absolute top-12 left-[15%]" size={100} color={petalPink} accentColor={marsala} />
            <RoseCluster className="absolute top-16 right-[12%]" size={120} color={petalPink} accentColor={marsala} />
            <RoseCluster className="absolute bottom-24 left-[8%]" size={80} color={petalPink} accentColor={marsala} />
            <RoseCluster className="absolute bottom-20 right-[10%]" size={90} color={petalPink} accentColor={marsala} />

            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={envelopeOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-[11px] uppercase tracking-[0.5em] text-marsala/50 font-serif-elegant font-medium mb-6"
              >
                أنتم مدعوّون لحضور عرس
              </motion.p>

              <FloralFrame className="py-8 px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={envelopeOpen ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6, type: "spring", damping: 15 }}
                >
                  <h1 className="font-script text-6xl md:text-8xl lg:text-9xl leading-none text-marsala">
                    {template.previewText.bride}
                  </h1>
                  <motion.span
                    className="block text-3xl md:text-4xl text-rose-gold/40 font-serif-elegant italic my-2"
                    initial={{ opacity: 0 }}
                    animate={envelopeOpen ? { opacity: 1 } : {}}
                    transition={{ delay: 0.9 }}
                  >
                    &amp;
                  </motion.span>
                  <h1 className="font-script text-6xl md:text-8xl lg:text-9xl leading-none text-marsala">
                    {template.previewText.groom}
                  </h1>
                </motion.div>
              </FloralFrame>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={envelopeOpen ? { scaleX: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="w-32 h-px mx-auto my-8"
                style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={envelopeOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.4 }}
                className="flex flex-wrap items-center justify-center gap-8 text-charcoal/60 font-serif-elegant text-sm"
              >
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-marsala/60" /> {template.previewText.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-marsala/60" /> {template.previewText.city}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-marsala/60" /> {template.previewText.time}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={envelopeOpen ? { opacity: 1 } : {}}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-1 text-marsala/40"
                >
                  <span className="text-[10px] uppercase tracking-widest font-serif-elegant">مزيد</span>
                  <ChevronDown size={20} />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* === COUNTDOWN === */}
          <section className="-mt-10 relative z-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto rounded-3xl shadow-2xl p-8 border-2"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #FDF5F8 100%)",
                borderColor: `${marsala}15`,
                boxShadow: `0 20px 60px ${marsala}10`,
              }}
            >
              <p className="text-center text-[10px] uppercase tracking-[0.5em] text-marsala/50 font-serif-elegant mb-6">
                اليوم الكبير قرّب
              </p>
              <div className="grid grid-cols-4 gap-3 md:gap-6 text-center">
                {[
                  { val: countdown.days, label: "أيّام" },
                  { val: countdown.hours, label: "ساعات" },
                  { val: countdown.minutes, label: "دقايق" },
                  { val: countdown.seconds, label: "ثواني" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-3xl md:text-5xl font-script text-marsala">
                      {item.val}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest mt-2 text-charcoal/40 font-serif-elegant">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* === OUR STORY === */}
          <section className="py-24 px-6 bg-blush-gradient">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <GoldOrnament className="mb-4" />
                <span className="text-[11px] uppercase tracking-[0.5em] font-serif-elegant text-marsala/50">
                  مسيرتنا
                </span>
                <h2 className="font-serif-elegant text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-marsala mt-3">
                  قصة حبنا
                </h2>
              </motion.div>

              <div className="space-y-16 relative">
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    className="w-full h-full origin-top"
                    style={{ background: `linear-gradient(180deg, ${eucGreen}40, ${marsala}30, ${eucGreen}40)` }}
                  />
                </div>

                {template.previewText.story.map((story, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-6 md:gap-8 items-start pl-2"
                  >
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif-elegant text-lg shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${marsala}, ${marsala}CC)`,
                          boxShadow: `0 4px 15px ${marsala}30`,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {i + 1}
                      </motion.div>
                      <div className="absolute -top-1 -right-1 w-4 h-4">
                        <svg viewBox="0 0 20 20" fill="none" width="100%" height="100%">
                          <circle cx="10" cy="10" r="5" fill={petalPink} opacity="0.7" />
                          <circle cx="10" cy="10" r="2.5" fill={marsala} opacity="0.4" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif-elegant text-2xl md:text-3xl font-medium text-marsala mb-2 tracking-wide">
                        {story.title}
                      </h3>
                      <p className="text-stone-700 leading-relaxed font-serif-elegant text-base md:text-lg">
                        {story.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* === FOOTER === */}
          <footer
            className="py-12 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${marsala} 0%, #6B1740 60%, #4A0E2E 100%)`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${gold}40, transparent)` }} />

            <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
              <VineDivider color="rgba(255,255,255,0.15)" className="mb-6" />

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, transparent, ${gold}60)` }} />
                <Heart size={18} style={{ color: gold }} />
                <div className="w-12 h-px" style={{ background: `linear-gradient(270deg, transparent, ${gold}60)` }} />
              </div>

              <p className="font-script text-3xl text-white/90 mb-2">
                {template.previewText.bride} &amp; {template.previewText.groom}
              </p>

              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-serif-elegant mb-6">
                {template.previewText.date} · {template.previewText.lieu}, {template.previewText.city}
              </p>

              <p className="text-xs text-white/20 font-serif-elegant">
                دعوة رقمية من{" "}
                <FarhtyLink className="underline hover:text-white/50 transition-all" />{" "}
                · {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </main>
      );
    }

    // Dispatch to dedicated design components
    if (template.style.startsWith("da3wa")) return <Da3waTemplates template={template} editable={isDraft} />;
    if (template.style === "emeraude-royale") return <EmeraudeRoyale template={template} />;
    if (template.style === "la-joie") return <LaJoie template={template} />;
    if (template.style === "amour") return <Amour template={template} />;
    if (template.style === "imperiale") return <Imperiale template={template} />;
    if (template.style === "jardin") return <JardinVintage template={template} />;
    if (template.style === "midos") return <MidosMarieme template={template} />;
    if (template.style === "jasmin") return <Jasmin template={template} />;
    return <Tunisian template={template} />;
  };

  const content = renderContent();

  const musicWidget = (
    <MusicPlayerWidget
      musicUrl={effectiveTemplate?.previewText.musicUrl}
      musicTitle={effectiveTemplate?.previewText.musicTitle}
    />
  );

  // En iframe, ou pour une invitation réelle envoyée aux invités : plein écran, sans maquette
  if (isEmbed || saved) {
    return (
      <InvitationRefProvider id={invitationId}>
        {content}
        {/* Confirmation de présence réelle, avant le bandeau de marque : la
            réponse de l'invité passe en premier, la publicité en dernier. */}
        {saved && invitationId && (
          <GuestRsvp invitationId={invitationId} guest={guest ?? null} />
        )}
        {/* Uniquement sur une invitation réellement envoyée : dans l'éditeur, le
            marié n'a pas besoin qu'on lui vende le produit qu'il vient d'acheter. */}
        {saved && <InvitationCreditBar />}
        {musicWidget}
      </InvitationRefProvider>
    );
  }

  // Outside iframe, wrap in DeviceFrame (mobile mockup by default)
  return (
    <InvitationRefProvider id={invitationId}>
      <DeviceFrame desktopNode={content} />
      {musicWidget}
    </InvitationRefProvider>
  );
}
