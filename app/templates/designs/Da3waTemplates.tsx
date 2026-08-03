"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Template, mapsLinkFor, mapsEmbedFor } from "../data";
import {
  useInvitationStore,
  DEFAULT_CARD_LAYOUT,
  type BlockPosition,
} from "../../lib/invitationStore";
import PhotoGallery3D from "../../components/PhotoGallery3D";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  UserCheck,
  Send,
  Heart,
  BookOpen,
} from "lucide-react";

interface Props {
  template: Template;
  customData?: any;
  /** Mode éditeur : les blocs de la carte deviennent déplaçables */
  editable?: boolean;
}

/**
 * Bloc de texte posé sur la carte, repositionnable à la souris/au doigt.
 *
 * La position est stockée en % du centre de la carte, donc indépendante de la
 * taille de l'écran. framer-motion applique un décalage `x/y` pendant le glissement :
 * à la fin on convertit ce décalage en %, puis on remet le décalage à zéro pour
 * éviter qu'il ne s'additionne à la nouvelle position.
 */
function CardBlock({
  id,
  pos,
  editable,
  cardRef,
  onMove,
  className,
  style,
  children,
}: {
  id: string;
  pos: BlockPosition;
  editable: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onMove: (id: string, pos: BlockPosition) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  return (
    <motion.div
      ref={ref}
      drag={editable}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={cardRef}
      animate={controls}
      onDragEnd={() => {
        const card = cardRef.current?.getBoundingClientRect();
        const me = ref.current?.getBoundingClientRect();
        if (!card || !me) return;
        onMove(id, {
          x: +(((me.left + me.width / 2 - card.left) / card.width) * 100).toFixed(2),
          y: +(((me.top + me.height / 2 - card.top) / card.height) * 100).toFixed(2),
        });
        controls.set({ x: 0, y: 0 });
      }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${
        editable ? "cursor-grab active:cursor-grabbing rounded-lg ring-1 ring-dashed ring-black/25 hover:ring-black/50" : ""
      } ${className ?? ""}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, ...style }}
    >
      {children}
    </motion.div>
  );
}

const templateVideoMap: Record<string, string> = {
  bab: "/templates/bab/assets/door.mp4",
  disney: "/videos/sindrella.mp4",
  classic: "/templates/classic/assets/preloader.mp4",
  reverie: "/templates/reverie/assets/envelope.mp4",
  letter: "/templates/letter/assets/envelope.mp4",
  ring: "/templates/ring/assets/box-video.mp4",
  royal: "/videos/rd.mp4",
  rozana: "/templates/rozana/assets/entrance.mp4",
  hadeel: "/templates/hadeel/assets/flight.mp4",
  vangogh: "/templates/vangogh/assets/preloader.mp4",
  blush: "/templates/reverie/assets/envelope.mp4",
  glam: "/templates/ring/assets/box-video.mp4",
  "aroussa-tn": "/videos/tunisian-envelope.mp4",
  "jasmin-tn": "/templates/hadeel/assets/flight.mp4",
  "keswa-tn": "/videos/tunisian-envelope.mp4",
  "rideau-royal": "/videos/rd.mp4",
  "enveloppe-tunisienne": "/videos/tunisian-envelope.mp4",
  "lanternes-celestes": "/videos/sindrella.mp4",
  "palais-cristal": "/templates/ring/assets/box-video.mp4",
  "jardin-royal": "/templates/reverie/assets/envelope.mp4",
  "oasis-etoilee": "/templates/rozana/assets/entrance.mp4",
  "porte-chateau": "/templates/bab/assets/door.mp4",
  "parchemin-royal": "/videos/scroll-parchemin.mp4",
  "lettre-royale": "/videos/v1.mp4",
};

/* Templates whose intro video stays visible (letterboxed) and opens mid-playback */
const CINEMATIC_LETTER_SLUGS = new Set(["lettre-emeraude"]);

/* Playback second at which the details content is revealed (default 3.5s) */
const CINEMATIC_REVEAL_AT: Record<string, number> = {};

/* Premium templates: the intro video plays to the very end, then the content is revealed */
const FULL_VIDEO_SLUGS = new Set(["parchemin-royal", "lettre-royale", "lanternes-celestes", "disney"]);

/* Ces vidéos se terminent sur une carte/cadre vierge : le texte s'inscrit dessus. */
interface CardInk {
  ink: string;
  gold: string;
  muted: string;
  /* marge intérieure de la zone de texte, en % de la carte (évite fleurs / filets dorés) */
  padX: string;
  padY: string;
}
const FULL_VIDEO_CARD_INK: Record<string, CardInk> = {
  "parchemin-royal": { ink: "#4A3B22", gold: "#A98545", muted: "#7A6A4C", padX: "12%", padY: "16%" },
  "lettre-royale": { ink: "#3B4536", gold: "#A98545", muted: "#6E7666", padX: "14%", padY: "20%" },
  "lanternes-celestes": { ink: "#3E2718", gold: "#C49A45", muted: "#7A5E48", padX: "15%", padY: "22%" },
  "disney": { ink: "#3E2718", gold: "#C49A45", muted: "#7A5E48", padX: "15%", padY: "22%" },
};
const DEFAULT_CARD_INK: CardInk = { ink: "#4A3B22", gold: "#A98545", muted: "#7A6A4C", padX: "13%", padY: "18%" };

/* Boîte correspondant exactement à la vidéo 9:16 affichée en « contain » */
const CARD_BOX_STYLE: React.CSSProperties = {
  width: "min(100vw, calc(100vh * 9 / 16))",
  aspectRatio: "9 / 16",
};

/* ── Background image for the details page (after video ends) ── */
const templateBgImageMap: Record<string, string> = {
  classic: "/images/bg_classic.webp",
  bab: "/images/bg_bab.webp",
  reverie: "/images/bg_reverie.webp",
  ring: "/images/bg_ring.webp",
  disney: "/images/bg_disney.webp",
  royal: "/images/royal_curtains_4k.webp",
  letter: "/images/tunisian_invitation_interior.webp",
  rozana: "/images/bg_classic.webp",
  hadeel: "/images/bg_reverie.webp",
  vangogh: "/images/bg_disney.webp",
  blush: "/images/bg_reverie.webp",
  glam: "/images/bg_ring.webp",
  "aroussa-tn": "/images/bg_aroussa_tn.webp",
  "jasmin-tn": "/images/bg_jasmin_tn.webp",
  "keswa-tn": "/images/tunisian_invitation_interior.webp",
  "rideau-royal": "/images/royal_curtains_4k.webp",
  "enveloppe-tunisienne": "/images/tunisian_invitation_interior.webp",
  "lanternes-celestes": "/images/bg_reverie.webp",
  "palais-cristal": "/images/bg_ring.webp",
  "jardin-royal": "/images/royal_garden.webp",
  "oasis-etoilee": "/images/bg_aroussa_tn.webp",
  "porte-chateau": "/images/la_joie_columns_gate_4k.webp",
  "parchemin-royal": "/images/gold_branches_4k.webp",
  "lettre-royale": "/images/gold_branches_4k.webp",
};

interface ThemeStyle {
  bgGradient: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  goldColor: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  overlayColor: string;
}

const defaultTheme: ThemeStyle = {
  bgGradient: "linear-gradient(180deg, #1C050B 0%, #2A0812 50%, #0F0206 100%)",
  textColor: "#F4E4BA",
  subtextColor: "rgba(244, 228, 186, 0.8)",
  accentColor: "#8B0A1A",
  goldColor: "#D4AF37",
  cardBg: "rgba(30, 8, 14, 0.85)",
  cardBorder: "rgba(212, 175, 55, 0.35)",
  badgeBg: "rgba(212, 175, 55, 0.15)",
  badgeText: "#F4E4BA",
  overlayColor: "rgba(28, 5, 11, 0.75)",
};

const templateThemeMap: Record<string, ThemeStyle> = {
  "porte-chateau": {
    bgGradient: "linear-gradient(180deg, #1C050B 0%, #3B0D18 50%, #0F0206 100%)",
    textColor: "#F4E4BA",
    subtextColor: "#D4AF37",
    accentColor: "#D4AF37",
    goldColor: "#F4E4BA",
    cardBg: "rgba(28, 5, 11, 0.88)",
    cardBorder: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#F4E4BA",
    overlayColor: "rgba(28, 5, 11, 0.75)",
  },
  "rideau-royal": {
    bgGradient: "linear-gradient(180deg, #4A030C 0%, #660511 50%, #2A0105 100%)",
    textColor: "#F4E4BA",
    subtextColor: "#D4AF37",
    accentColor: "#D4AF37",
    goldColor: "#F4E4BA",
    cardBg: "rgba(30, 2, 6, 0.88)",
    cardBorder: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#F4E4BA",
    overlayColor: "rgba(74, 3, 12, 0.72)",
  },
  "enveloppe-tunisienne": {
    bgGradient: "linear-gradient(180deg, #2D0B14 0%, #7A1730 50%, #0A0104 100%)",
    textColor: "#F4E4BA",
    subtextColor: "rgba(244, 228, 186, 0.85)",
    accentColor: "#8B0A1A",
    goldColor: "#D4AF37",
    cardBg: "rgba(45, 11, 20, 0.88)",
    cardBorder: "rgba(212, 175, 55, 0.4)",
    badgeBg: "rgba(139, 10, 26, 0.2)",
    badgeText: "#F4E4BA",
    overlayColor: "rgba(45, 11, 20, 0.75)",
  },
  "lanternes-celestes": {
    bgGradient: "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #020617 100%)",
    textColor: "#FDF4E3",
    subtextColor: "#FCD34D",
    accentColor: "#F59E0B",
    goldColor: "#FBBF24",
    cardBg: "rgba(15, 23, 42, 0.88)",
    cardBorder: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "#FCD34D",
    overlayColor: "rgba(15, 23, 42, 0.75)",
  },
  "palais-cristal": {
    bgGradient: "linear-gradient(180deg, #18092B 0%, #341459 50%, #0F041D 100%)",
    textColor: "#F8FAFC",
    subtextColor: "#CBD5E1",
    accentColor: "#A855F7",
    goldColor: "#FDE047",
    cardBg: "rgba(24, 9, 43, 0.88)",
    cardBorder: "rgba(253, 224, 71, 0.4)",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    badgeText: "#FDE047",
    overlayColor: "rgba(24, 9, 43, 0.72)",
  },
  "jardin-royal": {
    bgGradient: "linear-gradient(180deg, #022C22 0%, #064E3B 50%, #021B15 100%)",
    textColor: "#ECFDF5",
    subtextColor: "#A7F3D0",
    accentColor: "#10B981",
    goldColor: "#F59E0B",
    cardBg: "rgba(2, 44, 34, 0.88)",
    cardBorder: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#A7F3D0",
    overlayColor: "rgba(2, 44, 34, 0.75)",
  },
  "oasis-etoilee": {
    bgGradient: "linear-gradient(180deg, #1A0D06 0%, #472918 50%, #0C0603 100%)",
    textColor: "#FEF3C7",
    subtextColor: "#FDE68A",
    accentColor: "#C97B3D",
    goldColor: "#F59E0B",
    cardBg: "rgba(26, 13, 6, 0.88)",
    cardBorder: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(201, 123, 61, 0.15)",
    badgeText: "#FEF3C7",
    overlayColor: "rgba(26, 13, 6, 0.75)",
  },
  "palais-or": {
    bgGradient: "linear-gradient(180deg, #140F05 0%, #2A1F0A 50%, #0F0A02 100%)",
    textColor: "#FDF0D5",
    subtextColor: "#E2C48C",
    accentColor: "#D4AF37",
    goldColor: "#F5D061",
    cardBg: "rgba(20, 15, 5, 0.88)",
    cardBorder: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#FDF0D5",
    overlayColor: "rgba(20, 15, 5, 0.80)",
  },
  "lettre-emeraude": {
    bgGradient: "linear-gradient(180deg, #101813 0%, #1B291F 50%, #0A100C 100%)",
    textColor: "#F4F7F5",
    subtextColor: "#A6BAAB",
    accentColor: "#D4AF37",
    goldColor: "#E2C48C",
    cardBg: "rgba(16, 24, 19, 0.9)",
    cardBorder: "rgba(212, 175, 55, 0.35)",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#E2C48C",
    overlayColor: "rgba(10, 16, 12, 0.85)",
  },
  "parchemin-royal": {
    bgGradient: "linear-gradient(180deg, #101410 0%, #1E2418 50%, #080A07 100%)",
    textColor: "#F7EBD0",
    subtextColor: "#D9C395",
    accentColor: "#B8860B",
    goldColor: "#F0E0BC",
    cardBg: "rgba(26, 18, 7, 0.9)",
    cardBorder: "rgba(184, 134, 11, 0.45)",
    badgeBg: "rgba(184, 134, 11, 0.18)",
    badgeText: "#F0E0BC",
    overlayColor: "rgba(13, 9, 4, 0.85)",
  },
  "lettre-royale": {
    bgGradient: "linear-gradient(180deg, #0D1310 0%, #1C2620 50%, #070B09 100%)",
    textColor: "#F6F1E4",
    subtextColor: "#B8C4B4",
    accentColor: "#C9A24B",
    goldColor: "#E8D9A8",
    cardBg: "rgba(13, 19, 16, 0.92)",
    cardBorder: "rgba(201, 162, 75, 0.4)",
    badgeBg: "rgba(201, 162, 75, 0.16)",
    badgeText: "#E8D9A8",
    overlayColor: "rgba(7, 11, 9, 0.86)",
  },
  classic: {
    bgGradient: "linear-gradient(180deg, #FAF4EB 0%, #F5E8D4 50%, #FAF4EB 100%)",
    textColor: "#2C1E14",
    subtextColor: "#6B5544",
    accentColor: "#8B0A1A",
    goldColor: "#B8860B",
    cardBg: "rgba(255, 255, 255, 0.85)",
    cardBorder: "rgba(184, 134, 11, 0.35)",
    badgeBg: "rgba(139, 10, 26, 0.1)",
    badgeText: "#8B0A1A",
    overlayColor: "rgba(250, 244, 235, 0.65)",
  },
  bab: {
    bgGradient: "linear-gradient(180deg, #2A170C 0%, #472918 50%, #1A0D06 100%)",
    textColor: "#F4E4BA",
    subtextColor: "#D4B982",
    accentColor: "#D4AF37",
    goldColor: "#F3D279",
    cardBg: "rgba(20, 10, 5, 0.85)",
    cardBorder: "rgba(212, 175, 55, 0.4)",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#F4E4BA",
    overlayColor: "rgba(42, 23, 12, 0.72)",
  },
  reverie: {
    bgGradient: "linear-gradient(180deg, #FDF5F7 0%, #F8DCE5 50%, #FDF5F7 100%)",
    textColor: "#3D1420",
    subtextColor: "#7C3E50",
    accentColor: "#C2255C",
    goldColor: "#D4AF37",
    cardBg: "rgba(255, 255, 255, 0.85)",
    cardBorder: "rgba(194, 37, 92, 0.3)",
    badgeBg: "rgba(194, 37, 92, 0.1)",
    badgeText: "#C2255C",
    overlayColor: "rgba(253, 245, 247, 0.6)",
  },
  ring: {
    bgGradient: "linear-gradient(180deg, #3B0D18 0%, #5E1727 50%, #24050D 100%)",
    textColor: "#F9E4EB",
    subtextColor: "#E2B0C0",
    accentColor: "#FF4D7D",
    goldColor: "#E5C158",
    cardBg: "rgba(25, 5, 10, 0.88)",
    cardBorder: "rgba(229, 193, 88, 0.4)",
    badgeBg: "rgba(255, 77, 125, 0.15)",
    badgeText: "#FF4D7D",
    overlayColor: "rgba(59, 13, 24, 0.75)",
  },
  letter: {
    bgGradient: "linear-gradient(180deg, #FDFBF7 0%, #F3EAE0 50%, #FAF6F0 100%)",
    textColor: "#2B1E19",
    subtextColor: "#6E5B52",
    accentColor: "#8B0A1A",
    goldColor: "#C59B58",
    cardBg: "rgba(255, 255, 255, 0.88)",
    cardBorder: "rgba(197, 155, 88, 0.35)",
    badgeBg: "rgba(139, 10, 26, 0.1)",
    badgeText: "#8B0A1A",
    overlayColor: "rgba(253, 251, 247, 0.65)",
  },
  disney: {
    bgGradient: "linear-gradient(180deg, #18092B 0%, #341459 50%, #0F041D 100%)",
    textColor: "#F3E8FF",
    subtextColor: "#C084FC",
    accentColor: "#A855F7",
    goldColor: "#FDE047",
    cardBg: "rgba(15, 4, 29, 0.85)",
    cardBorder: "rgba(168, 85, 247, 0.4)",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    badgeText: "#E9D5FF",
    overlayColor: "rgba(24, 9, 43, 0.7)",
  },
  royal: {
    bgGradient: "linear-gradient(180deg, #4A030C 0%, #660511 50%, #2A0105 100%)",
    textColor: "#F4E4BA",
    subtextColor: "#D4AF37",
    accentColor: "#D4AF37",
    goldColor: "#F4E4BA",
    cardBg: "rgba(30, 2, 6, 0.88)",
    cardBorder: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#F4E4BA",
    overlayColor: "rgba(74, 3, 12, 0.72)",
  },
  rozana: {
    bgGradient: "linear-gradient(180deg, #F8F4EC 0%, #EADECF 50%, #F8F4EC 100%)",
    textColor: "#2E241E",
    subtextColor: "#7A6556",
    accentColor: "#A06B56",
    goldColor: "#B58A43",
    cardBg: "rgba(255, 255, 255, 0.88)",
    cardBorder: "rgba(181, 138, 67, 0.35)",
    badgeBg: "rgba(160, 107, 86, 0.1)",
    badgeText: "#A06B56",
    overlayColor: "rgba(248, 244, 236, 0.65)",
  },
  hadeel: {
    bgGradient: "linear-gradient(180deg, #F2F8FC 0%, #D8ECF7 50%, #F2F8FC 100%)",
    textColor: "#122E3A",
    subtextColor: "#3A6E85",
    accentColor: "#0284C7",
    goldColor: "#D4AF37",
    cardBg: "rgba(255, 255, 255, 0.88)",
    cardBorder: "rgba(2, 132, 199, 0.3)",
    badgeBg: "rgba(2, 132, 199, 0.1)",
    badgeText: "#0284C7",
    overlayColor: "rgba(242, 248, 252, 0.6)",
  },
  vangogh: {
    bgGradient: "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0A0F1D 100%)",
    textColor: "#F1F5F9",
    subtextColor: "#94A3B8",
    accentColor: "#38BDF8",
    goldColor: "#FACC15",
    cardBg: "rgba(15, 23, 42, 0.88)",
    cardBorder: "rgba(250, 204, 21, 0.4)",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeText: "#38BDF8",
    overlayColor: "rgba(15, 23, 42, 0.7)",
  },
  blush: {
    bgGradient: "linear-gradient(180deg, #FDF3F5 0%, #F8D9E0 50%, #FDF3F5 100%)",
    textColor: "#3B141E",
    subtextColor: "#8A3C52",
    accentColor: "#E11D48",
    goldColor: "#D4AF37",
    cardBg: "rgba(255, 255, 255, 0.88)",
    cardBorder: "rgba(225, 29, 72, 0.3)",
    badgeBg: "rgba(225, 29, 72, 0.1)",
    badgeText: "#E11D48",
    overlayColor: "rgba(253, 243, 245, 0.6)",
  },
  glam: {
    bgGradient: "linear-gradient(180deg, #171207 0%, #33280F 50%, #0F0C05 100%)",
    textColor: "#FEF08A",
    subtextColor: "#EAB308",
    accentColor: "#EAB308",
    goldColor: "#FACC15",
    cardBg: "rgba(23, 18, 7, 0.88)",
    cardBorder: "rgba(250, 204, 21, 0.45)",
    badgeBg: "rgba(250, 204, 21, 0.15)",
    badgeText: "#FEF08A",
    overlayColor: "rgba(23, 18, 7, 0.75)",
  },
};

/* ── Vector Gold Ornament Line Divider ── */
function OrnamentDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
      <span className="h-px w-16 opacity-40" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path d="M12 0L15 6L12 12L9 6L12 0Z" fill={color} opacity="0.8" />
        <circle cx="4" cy="6" r="1.5" fill={color} opacity="0.5" />
        <circle cx="20" cy="6" r="1.5" fill={color} opacity="0.5" />
      </svg>
      <span className="h-px w-16 opacity-40" style={{ background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  );
}

export default function Da3waTemplates({ template, customData, editable }: Props) {
  /* Carte de référence pour convertir un glissement en pourcentage */
  const cardRef = useRef<HTMLDivElement>(null);
  const setBlockPosition = useInvitationStore((s) => s.setBlockPosition);
  /* Positions : celles enregistrées sur l'invitation, sinon les valeurs par défaut */
  const L = { ...DEFAULT_CARD_LAYOUT, ...(template.layout ?? {}) };
  const moveBlock = (id: string, pos: BlockPosition) => setBlockPosition(id, pos);

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [knocks, setKnocks] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState([
    { name: "عائلة بن علي", text: "ألف ألف مبروك للعروسين، دياركم عامرة بالأفراح دائماً", time: "قبل ساعتين" },
    { name: "م. حسام", text: "بارك الله لكما وبارك عليكما وجمع بينكما في خير", time: "قبل ٥ ساعات" },
  ]);
  const [submittedRsvp, setSubmittedRsvp] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const data = customData || template.previewText;
  const videoSrc = template.video || templateVideoMap[template.slug];
  const bgImage = template.image || `/site/tpl/${template.slug}-cover.jpg`;
  const theme = templateThemeMap[template.slug] || defaultTheme;
  const detailsBgImage = templateBgImageMap[template.slug] || "/images/la_joie_columns_4k.webp";

  const isFullVideo = FULL_VIDEO_SLUGS.has(template.slug);
  const isCinematicLetter = CINEMATIC_LETTER_SLUGS.has(template.slug);
  const cardInk = FULL_VIDEO_CARD_INK[template.slug] || DEFAULT_CARD_INK;
  /* Vidéo affichée en entier, sans recadrage (formats portrait 9:16) */
  const isLetterboxed = isFullVideo || isCinematicLetter;

  /* Auto-open after video ends */
  const handleVideoEnd = () => {
    setVideoEnded(true);
    // On laisse la dernière image respirer avant d'enchaîner sur le contenu
    setTimeout(() => setIsOpen(true), isFullVideo ? 900 : 400);
  };

  /* Carte plein écran (vidéo figée) : elle se dissout dès qu'on descend vers les détails */
  const [heroScrolled, setHeroScrolled] = useState(false);
  useEffect(() => {
    if (!isFullVideo) return;
    const onScroll = () => setHeroScrolled(window.scrollY > window.innerHeight * 0.45);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFullVideo]);

  /* If no video, auto-open after a short delay */
  useEffect(() => {
    if (!videoSrc) {
      const timer = setTimeout(() => {
        setVideoEnded(true);
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [videoSrc]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (CINEMATIC_LETTER_SLUGS.has(template.slug) && !isOpen) {
      if (e.currentTarget.currentTime >= (CINEMATIC_REVEAL_AT[template.slug] ?? 3.5)) {
        setIsOpen(true);
      }
    }
  };

  const handleOpen = () => {
    if (template.slug === "bab" && knocks < 2) {
      setKnocks((prev) => prev + 1);
    } else {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      setIsOpen(true);
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !wishText) return;
    setWishes([{ name: guestName, text: wishText, time: "الآن" }, ...wishes]);
    setWishText("");
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden font-sans select-none"
      style={{ background: "#000", color: theme.textColor }}
      dir="rtl"
    >
      {/* ═══════════════════════════════════════════════════════════════
          PHASE 1: VIDEO INTRO (full-screen, clean, no text overlay)
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(!isOpen || isCinematicLetter || isFullVideo) && (
          <motion.div
            key="video-intro-overlay"
            /* full-video : fondu piloté en CSS (indépendant de requestAnimationFrame) */
            initial={isFullVideo ? false : { opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`fixed inset-0 ${isOpen ? (isFullVideo ? 'z-10' : 'z-0') : 'z-[60]'} bg-black ${!isOpen && !isFullVideo ? 'cursor-pointer' : ''} ${
              isFullVideo ? `transition-opacity duration-700 ease-out ${heroScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}` : ''
            }`}
            onClick={!isOpen && !isFullVideo ? handleOpen : undefined}
          >
            {/* Fond dégradé du thème : la vidéo portrait n'est plus posée sur du noir brut */}
            {isFullVideo && (
              <div className="absolute inset-0" style={{ background: theme.bgGradient }} aria-hidden />
            )}

            {videoSrc && isFullVideo ? (
              /* La vidéo finit sur une carte vierge : on cale une boîte 9:16 dessus
                 pour y inscrire le texte exactement dans la carte. */
              <div className="absolute inset-0 flex items-center justify-center">
                <div ref={cardRef} className="relative" style={CARD_BOX_STYLE}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    onPlay={(e) => { e.currentTarget.playbackRate = 1.4; }}
                    onEnded={handleVideoEnd}
                    onError={handleVideoEnd}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>

                  {/* ── Le texte s'inscrit sur la carte, une fois la vidéo terminée ── */}
                  <AnimatePresence>
                    {videoEnded && (
                      <motion.div
                        key="card-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        className="absolute inset-0 text-center"
                      >
                        <CardBlock id="label" pos={L.label} editable={!!editable} cardRef={cardRef} onMove={moveBlock}
                          className="text-[10px] sm:text-xs tracking-[0.45em] whitespace-nowrap px-2 py-1"
                          style={{ color: cardInk.muted }}>
                          دعوة زفاف
                        </CardBlock>

                        <CardBlock id="names" pos={L.names} editable={!!editable} cardRef={cardRef} onMove={moveBlock}
                          className="text-4xl sm:text-5xl font-extrabold leading-[1.35] px-3 py-1"
                          style={{ fontFamily: "var(--font-display)", color: cardInk.ink }}>
                          {data.bride}
                          <span className="block my-2 text-2xl sm:text-3xl font-normal" style={{ color: cardInk.gold }}>
                            &amp;
                          </span>
                          {data.groom}
                        </CardBlock>

                        <CardBlock id="rule" pos={L.rule} editable={!!editable} cardRef={cardRef} onMove={moveBlock}
                          className="py-2 px-1">
                          <span className="block w-24 h-px" style={{ backgroundColor: cardInk.gold }} />
                        </CardBlock>

                        <CardBlock id="date" pos={L.date} editable={!!editable} cardRef={cardRef} onMove={moveBlock}
                          className="text-sm sm:text-base font-bold whitespace-nowrap px-2 py-1"
                          style={{ color: cardInk.ink }}>
                          {data.date}
                        </CardBlock>

                        <CardBlock id="venue" pos={L.venue} editable={!!editable} cardRef={cardRef} onMove={moveBlock}
                          className="text-xs sm:text-sm whitespace-nowrap px-2 py-1"
                          style={{ color: cardInk.muted }}>
                          {data.lieu} · {data.city}
                        </CardBlock>

                        {/* invite à faire défiler vers le reste de la dépliante */}
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0.55, 1] }}
                          transition={{ delay: 1.8, duration: 2.4, repeat: Infinity, repeatDelay: 0.6 }}
                          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] cursor-pointer"
                          style={{ color: cardInk.muted }}
                        >
                          ↓ تفاصيل الحفل
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : videoSrc ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                poster={isLetterboxed ? undefined : bgImage}
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onPlay={(e) => { e.currentTarget.playbackRate = 1.4; }}
                onEnded={handleVideoEnd}
                onTimeUpdate={handleTimeUpdate}
                onError={handleVideoEnd}
                className={`relative w-full h-full scale-105 ${isLetterboxed ? 'object-contain' : 'object-cover'}`}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            ) : (
              <img
                src={bgImage}
                alt={template.name}
                className="w-full h-full object-cover scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/site/tpl/classic-cover.jpg";
                }}
              />
            )}

            {/* Voile sombre pour la lisibilité — la vidéo premium reste intacte */}
            {!isFullVideo && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              />
            )}

            {/* Discret « passer l'intro » pendant la lecture intégrale */}
            {isFullVideo && !videoEnded && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoEnd();
                }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-5 py-2 rounded-full text-[11px] tracking-[0.25em] backdrop-blur-md border cursor-pointer transition-opacity hover:opacity-100"
                style={{
                  color: theme.badgeText,
                  borderColor: theme.cardBorder,
                  backgroundColor: theme.badgeBg,
                  opacity: 0.75,
                }}
              >
                تخطي المقدمة
              </motion.button>
            )}

            {/* Show open button ONLY after video ended (for bab: tap to knock) */}
            <AnimatePresence>
              {!isFullVideo && (videoEnded || !videoSrc) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                    }}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-gray-950 font-extrabold text-sm shadow-[0_12px_40px_rgba(245,158,11,0.55)] flex items-center gap-2 cursor-pointer border border-white/30 tracking-wider"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {template.slug === "bab"
                        ? knocks === 0
                          ? "إقرع ٣ مرات لفتح الباب"
                          : knocks === 1
                          ? "إقرع مرتين"
                          : "إقرع الأخيرة!"
                        : "افتح الدعوة واستكشف الحفل"}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 2: DETAILS PAGE (after video ends — themed background)
          ═══════════════════════════════════════════════════════════════ */}

      {/* Full-bleed background photo with Ken Burns animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {!CINEMATIC_LETTER_SLUGS.has(template.slug) && (
          <motion.img
            src={detailsBgImage}
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 30, ease: "easeOut" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/la_joie_columns_4k.webp";
            }}
          />
        )}
        {/* Theme-colored overlay for readability */}
        <div className="absolute inset-0" style={{ background: theme.overlayColor }} />
        {/* Additional gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 55% at 50% 40%, transparent 40%, ${theme.overlayColor} 100%)`,
          }}
        />
      </div>

      {/* Music Floating Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 inset-inline-start-6 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border border-amber-400/30"
        aria-label="الموسيقى"
      >
        {isPlaying ? <Volume2 className="w-5 h-5 text-[#8B0A1A]" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
      </button>

      {/* ═══════ SCROLLABLE CONTENT ═══════ */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 min-h-screen w-full flex flex-col items-center pb-24"
        >
          {/* Le hero est la carte de la vidéo elle-même : on laisse un écran vide pour la voir */}
          {isFullVideo && <div className="h-screen w-full shrink-0 pointer-events-none" aria-hidden />}

          {/* 1. HERO SECTION */}
          {!isFullVideo && (
          <section className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center">
            <span
              className="text-xs font-extrabold px-5 py-1.5 rounded-full border mb-6 shadow-sm tracking-widest uppercase backdrop-blur-md"
              style={{
                backgroundColor: theme.badgeBg,
                color: theme.badgeText,
                borderColor: theme.cardBorder,
              }}
            >
              دعوة زفاف خاصة
            </span>
            <h1
              className="text-6xl sm:text-8xl font-extrabold mb-4 tracking-wide drop-shadow-lg"
              style={{ fontFamily: "var(--font-display)", color: theme.textColor }}
            >
              {data.bride} <span style={{ color: theme.goldColor }}>&amp;</span> {data.groom}
            </h1>
            <p className="text-sm sm:text-base font-bold mb-4 drop-shadow-md" style={{ color: theme.subtextColor }}>
              {data.date} • {data.lieu} ({data.city})
            </p>

            <OrnamentDivider color={theme.goldColor} />

            <p className="text-xs sm:text-sm italic max-w-sm leading-relaxed mt-2 drop-shadow-md" style={{ color: theme.subtextColor }}>
              "فتحنا باب فرحتنا.. وطارت البشائر تدعوكم لمشاركتنا أجمل ليالي العمر"
            </p>
          </section>
          )}

          {/* 2. QURANIC VERSE */}
          {!data.hideQuran && (
            <section className="w-full max-w-2xl px-4 py-8 text-center">
              <div
                className="rounded-3xl p-8 backdrop-blur-xl shadow-xl space-y-4 border"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <div
                  className="w-10 h-10 rounded-full mx-auto flex items-center justify-center border"
                  style={{ backgroundColor: theme.badgeBg, borderColor: theme.cardBorder }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: theme.goldColor }} />
                </div>
                <p
                  className="text-base sm:text-lg font-serif leading-loose"
                  style={{ fontFamily: "var(--font-display)", color: theme.textColor }}
                >
                  {data.quranVerse || "« وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً »"}
                </p>
                <span className="text-xs font-bold block" style={{ color: theme.goldColor }}>
                  صدق الله العظيم
                </span>
              </div>
            </section>
          )}

          {/* 3. EVENT DETAILS GRID */}
          <section className="w-full max-w-2xl px-4 py-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="w-5 h-5" style={{ color: theme.goldColor }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: theme.goldColor }}>
                تفاصيل المناسبة
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="p-6 rounded-2xl backdrop-blur-xl border flex flex-col items-center text-center space-y-2 shadow-md"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <Calendar className="w-7 h-7" style={{ color: theme.goldColor }} />
                <span className="text-xs font-bold" style={{ color: theme.subtextColor }}>التاريخ</span>
                <span className="text-base font-extrabold" style={{ color: theme.textColor }}>{data.date}</span>
              </div>
              <div
                className="p-6 rounded-2xl backdrop-blur-xl border flex flex-col items-center text-center space-y-2 shadow-md"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <Clock className="w-7 h-7" style={{ color: theme.goldColor }} />
                <span className="text-xs font-bold" style={{ color: theme.subtextColor }}>الوقت</span>
                <span className="text-base font-extrabold" style={{ color: theme.textColor }}>{data.time}</span>
              </div>
              <div
                className="sm:col-span-2 p-6 rounded-2xl backdrop-blur-xl border flex flex-col items-center text-center space-y-3 shadow-md"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <MapPin className="w-7 h-7" style={{ color: theme.goldColor }} />
                <span className="text-xs font-bold" style={{ color: theme.subtextColor }}>مكان الحفل والقاعة</span>
                <span className="text-base font-extrabold" style={{ color: theme.textColor }}>
                  {data.lieu} — {data.city}
                </span>
                <a
                  href={mapsLinkFor({ geo: template.geo, previewText: data })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
                  style={{ backgroundColor: theme.goldColor, color: "#000" }}
                >
                  <span>فتح في تطبيق Google Maps</span>
                </a>
                <div className="w-full h-48 rounded-2xl overflow-hidden border mt-3 shadow-lg" style={{ borderColor: theme.cardBorder }}>
                  <iframe
                    title="خريطة القاعة"
                    src={mapsEmbedFor({ geo: template.geo, previewText: data })}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "contrast(1.05) opacity(0.92)" }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. PROGRAM SCHEDULE */}
          {data.program && data.program.length > 0 && (
            <section className="w-full max-w-2xl px-4 py-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-5 h-5" style={{ color: theme.goldColor }} />
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: theme.goldColor }}>
                  برنامج الحفل
                </h2>
              </div>
              <div className="space-y-3">
                {data.program.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl backdrop-blur-xl border flex items-center justify-between gap-4 shadow-sm"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center border"
                        style={{ backgroundColor: theme.badgeBg, color: theme.goldColor, borderColor: theme.cardBorder }}
                      >
                        {item.time}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: theme.textColor }}>{item.title}</h3>
                        <p className="text-xs" style={{ color: theme.subtextColor }}>{item.desc}</p>
                      </div>
                    </div>
                    <Sparkles className="w-4 h-4 opacity-40" style={{ color: theme.goldColor }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4.5. 3D 360 ROTATING PHOTO GALLERY */}
          {data.photos && data.photos.length > 0 && (
            <PhotoGallery3D
              photos={data.photos}
              goldColor={theme.goldColor}
              textColor={theme.textColor}
            />
          )}

          {/* 5. RSVP FORM */}
          {!data.hideRsvp && (
            <section className="w-full max-w-2xl px-4 py-8">
              <div
                className="backdrop-blur-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <div className="text-center space-y-1">
                  <UserCheck className="w-7 h-7 mx-auto" style={{ color: theme.goldColor }} />
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: theme.goldColor }}>
                    تأكيد الحضور (RSVP)
                  </h2>
                  <p className="text-xs" style={{ color: theme.subtextColor }}>يسعدنا جداً حضوركم وتشريفكم لنا في هذه الليلة المباركة</p>
                </div>

                {submittedRsvp ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-center space-y-2">
                    <UserCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h3 className="text-base font-bold text-emerald-300">تم تسجيل تأكيد حضورك بنجاح!</h3>
                    <p className="text-xs text-gray-300">شكراً لك، ننتظر رؤيتك بشغف في يوم الحفل.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (rsvpAttending !== null && guestName) setSubmittedRsvp(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: theme.subtextColor }}>الاسم الكامل</label>
                      <input
                        type="text"
                        required
                        placeholder="أدخل اسمك الكريم"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border text-sm focus:outline-none focus:border-amber-400 transition-colors"
                        style={{ color: theme.textColor, borderColor: theme.cardBorder }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: theme.subtextColor }}>هل ستحضر المناسبة؟</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRsvpAttending(true)}
                          className={`py-3 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                            rsvpAttending === true ? "bg-emerald-600 text-white border-emerald-400 shadow-lg" : "bg-white/5 border-white/20"
                          }`}
                          style={{ color: rsvpAttending === true ? "#FFF" : theme.textColor }}
                        >
                          نعم، سأحضر ببالغ الشوق
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpAttending(false)}
                          className={`py-3 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                            rsvpAttending === false ? "bg-rose-600 text-white border-rose-400 shadow-lg" : "bg-white/5 border-white/20"
                          }`}
                          style={{ color: rsvpAttending === false ? "#FFF" : theme.textColor }}
                        >
                          أعتذر عن الحضور
                        </button>
                      </div>
                    </div>
                    {rsvpAttending === true && (
                      <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: theme.subtextColor }}>عدد الأشخاص</label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border text-sm focus:outline-none"
                          style={{ color: theme.textColor, borderColor: theme.cardBorder }}
                        >
                          <option value={1} className="bg-gray-900 text-white">شخص واحد</option>
                          <option value={2} className="bg-gray-900 text-white">شخصان (2)</option>
                          <option value={3} className="bg-gray-900 text-white">3 أشخاص</option>
                          <option value={4} className="bg-gray-900 text-white">4 أشخاص أو أكثر</option>
                        </select>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={rsvpAttending === null}
                      className="w-full py-3.5 rounded-full font-extrabold text-sm shadow-lg disabled:opacity-50 cursor-pointer hover:scale-[1.02] transition-transform"
                      style={{ backgroundColor: theme.goldColor, color: "#000" }}
                    >
                      إرسال تأكيد الحضور
                    </button>
                  </form>
                )}
              </div>
            </section>
          )}

          {/* 6. WISHES WALL */}
          {!data.hideWishes && (
            <section className="w-full max-w-2xl px-4 py-8">
              <div
                className="backdrop-blur-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <div className="text-center space-y-1">
                  <Heart className="w-7 h-7 mx-auto" style={{ color: theme.accentColor }} />
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: theme.goldColor }}>
                    جدار التهاني والتبريكات
                  </h2>
                  <p className="text-xs" style={{ color: theme.subtextColor }}>اترك كلمة طيبة ودعوة صادقة للعروسين</p>
                </div>

                <form onSubmit={handleAddWish} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكريـم..."
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border text-xs focus:outline-none"
                    style={{ color: theme.textColor, borderColor: theme.cardBorder }}
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="اكتب تهنئتك للعروسين هنا..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border text-xs focus:outline-none"
                    style={{ color: theme.textColor, borderColor: theme.cardBorder }}
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-opacity text-white"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر التهنئة</span>
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {wishes.map((w, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border space-y-1 text-right" style={{ borderColor: theme.cardBorder }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: theme.goldColor }}>{w.name}</span>
                        <span className="text-[10px]" style={{ color: theme.subtextColor }}>{w.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: theme.textColor }}>{w.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </motion.div>
      )}
    </div>
  );
}
