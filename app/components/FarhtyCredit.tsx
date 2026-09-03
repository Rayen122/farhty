"use client";

import { createContext, useContext } from "react";
import Image from "next/image";
import { referralUrl } from "../lib/brand";

/**
 * Identifiant de l'invitation réellement consultée (/i/<id>).
 * Vide sur les démos publiques : le lien de crédit fonctionne quand même,
 * il ne sait simplement pas d'où vient le visiteur.
 */
const InvitationRefContext = createContext<string | undefined>(undefined);

export function InvitationRefProvider({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return <InvitationRefContext.Provider value={id}>{children}</InvitationRefContext.Provider>;
}

export const useInvitationRef = () => useContext(InvitationRefContext);

/**
 * Le mot « Farhty » cliquable, intégré au pied de page de chaque design.
 * Chaque design garde ses propres couleurs via `className` : on ne remplace
 * que la destination, pas l'apparence.
 */
export function FarhtyLink({
  className,
  children = "Farhty",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useInvitationRef();
  return (
    <a href={referralUrl(ref)} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}

/**
 * Bandeau de fin d'invitation.
 *
 * C'est le seul canal d'acquisition qui grandit tout seul : une invitation est
 * ouverte par 200 à 400 invités, dont plusieurs se marieront dans l'année.
 * Il n'apparaît que sur les invitations réellement envoyées — jamais dans
 * l'éditeur ni sur les démos, où le site est déjà autour du visiteur.
 */
export default function InvitationCreditBar() {
  const ref = useInvitationRef();

  return (
    <section
      dir="rtl"
      className="relative py-10 px-6 text-center"
      style={{ background: "linear-gradient(180deg,#1C050B 0%,#0F0206 100%)" }}
    >
      {/* Filet doré : sépare le bandeau du design de l'invitation, quel qu'il soit */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,#D4AF3766,transparent)" }}
      />

      <div className="max-w-md mx-auto flex flex-col items-center gap-4">
        {/* Ce bandeau part chez des centaines d'invités par invitation :
            l'image passe par l'optimiseur plutôt que par un <img> brut. */}
        <Image
          src="/brand/icon-white.png"
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          className="w-12 h-12 object-contain p-1"
        />

        <p className="text-[10px] tracking-[0.35em] uppercase text-[#F4E4BA]/40">
          دعوة رقمية من فرحتي
        </p>

        <p
          className="text-xl leading-snug text-[#F4E4BA]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          عرسك قريب؟ اصنع دعوتك في دقائق
        </p>

        <p className="text-xs text-[#F4E4BA]/50 leading-relaxed">
          دعوة إلكترونية تفاعلية، تبعثها في واتساب لضيوفك — بلا مطبعة وبلا تنقّل.
        </p>

        <a
          href={referralUrl(ref)}
          target="_blank"
          rel="noopener"
          className="mt-1 inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#D4AF37] text-[#1C050B] text-sm font-extrabold hover:opacity-90 transition-opacity"
        >
          شوف التصاميم
        </a>

        <span className="text-[10px] text-[#F4E4BA]/25" dir="ltr">
          farhty.me
        </span>
      </div>
    </section>
  );
}
