import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { storage, toPublic } from "../../../lib/invitationStorage";

export const runtime = "nodejs";

/**
 * Validation manuelle d'un paiement, réservée à l'exploitant.
 * Protégée par `FARHTY_ADMIN_TOKEN` : sans cette variable d'environnement,
 * la route est totalement désactivée plutôt que laissée ouverte.
 */
function authorized(req: Request): boolean {
  const expected = process.env.FARHTY_ADMIN_TOKEN;
  if (!expected) return false;

  const header = req.headers.get("x-admin-token") ?? "";
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  // comparaison à durée constante : évite de deviner le jeton caractère par caractère
  return a.length === b.length && timingSafeEqual(a, b);
}

/** GET /api/admin/payments?status=pending — file d'attente des paiements à vérifier */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const status = new URL(req.url).searchParams.get("status");
  const valid = status === "unpaid" || status === "pending" || status === "paid";

  try {
    const rows = await storage.list({ status: valid ? status : undefined, limit: 100 });
    return NextResponse.json(
      rows.map((r) => ({
        ...toPublic(r),
        /* La liste sert à ouvrir l'invitation pour vérifier : on expose le lien
           de modification ici, mais uniquement derrière le jeton administrateur. */
        editToken: r.editToken,
        /* Absent de `toPublic` — l'origine d'un client ne se lit que par l'exploitant */
        referredBy: r.referredBy,
      })),
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[admin] liste impossible", err);
    return NextResponse.json({ error: "Lecture impossible" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { id?: string; action?: "confirm" | "reject" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: "id manquant" }, { status: 400 });

  const existing = await storage.get(body.id).catch(() => null);
  if (!existing) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });

  const confirming = body.action !== "reject";

  const updated = await storage.update(body.id, {
    payment: {
      ...existing.payment,
      status: confirming ? "paid" : "unpaid",
      paidAt: confirming ? new Date().toISOString() : undefined,
    },
  });

  if (!updated) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });
  return NextResponse.json(toPublic(updated));
}
