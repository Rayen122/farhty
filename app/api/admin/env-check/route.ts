import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { storageBackend } from "../../../lib/invitationStorage";

export const runtime = "nodejs";

/**
 * DIAGNOSTIC TEMPORAIRE — à supprimer une fois le token administrateur validé.
 *
 * Ne renvoie jamais la valeur : seulement de quoi comparer les deux côtés
 * (présence, longueur, empreinte tronquée). Huit caractères d'un SHA-256 ne
 * permettent pas de remonter au secret.
 */
export async function GET() {
  const raw = process.env.FARHTY_ADMIN_TOKEN;

  return NextResponse.json(
    {
      set: typeof raw === "string" && raw.length > 0,
      length: raw?.length ?? 0,
      /* Repère les collages qui ont emporté un espace ou un retour à la ligne :
         `timingSafeEqual` échoue sur une longueur différente. */
      trimmedLength: raw?.trim().length ?? 0,
      fingerprint: raw ? createHash("sha256").update(raw).digest("hex").slice(0, 8) : null,
      storageBackend,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
