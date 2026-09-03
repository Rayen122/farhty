"use client";

import { useEffect } from "react";
import { REFERRAL_COOKIE, REFERRAL_MAX_AGE_SECONDS } from "../lib/brand";

/**
 * Retient l'invitation qui a amené ce visiteur.
 *
 * Écrit côté navigateur plutôt que par `cookies().set()` : un composant serveur
 * n'a pas le droit d'écrire un cookie, et cette valeur ne sert qu'à l'attribution
 * commerciale — aucune décision de sécurité ne s'appuie dessus.
 *
 * La prop s'appelle `refId` et non `ref` : React réserve `ref` et ne le
 * transmettrait jamais au composant.
 */
export default function RefCapture({ refId }: { refId: string }) {
  useEffect(() => {
    document.cookie = [
      `${REFERRAL_COOKIE}=${encodeURIComponent(refId)}`,
      "path=/",
      `max-age=${REFERRAL_MAX_AGE_SECONDS}`,
      "samesite=lax",
    ].join("; ");
  }, [refId]);

  return null;
}
