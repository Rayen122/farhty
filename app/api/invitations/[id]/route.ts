import { NextResponse } from "next/server";
import { storage, toPublic, PLANS, isPlanId, type InvitationRecord } from "../../../lib/invitationStorage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/invitations/:id — vue publique (jamais le token de modification) */
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;

  let record: InvitationRecord | null;
  try {
    record = await storage.get(id);
  } catch (err) {
    console.error("[invitations] lecture impossible", err);
    return NextResponse.json({ error: "Lecture impossible" }, { status: 500 });
  }

  if (!record) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });

  return NextResponse.json(toPublic(record), {
    headers: { "Cache-Control": "no-store" },
  });
}

/** PUT /api/invitations/:id — modification, réservée au porteur du token */
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;

  let body: { editToken?: string } & Partial<InvitationRecord>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const existing = await storage.get(id).catch(() => null);
  if (!existing) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });

  if (!body.editToken || body.editToken !== existing.editToken) {
    return NextResponse.json({ error: "Lien de modification invalide" }, { status: 403 });
  }

  /* On n'autorise que les champs de contenu : ni l'id, ni le token, ni le
     statut de paiement ne peuvent être modifiés depuis le client. */
  const patch: Partial<InvitationRecord> = {};
  if (body.draft) patch.draft = body.draft;
  if (body.slug) patch.slug = body.slug;
  if (body.geo !== undefined) patch.geo = body.geo;
  if (body.layout !== undefined) patch.layout = body.layout;

  /* Changer de formule reste possible tant que rien n'est réglé.
     Le montant est toujours relu du barème serveur, jamais du corps de requête. */
  if (isPlanId(body.plan) && body.plan !== existing.plan) {
    if (existing.payment.status === "paid") {
      return NextResponse.json({ error: "Formule non modifiable après paiement" }, { status: 409 });
    }
    patch.plan = body.plan;
    patch.payment = { ...existing.payment, amountDT: PLANS[body.plan].amountDT };
  }

  /* Sans ce garde-fou, un corps mal formé répondrait 200 sans rien modifier :
     l'appelant croirait sa modification enregistrée. */
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Aucune modification fournie" }, { status: 400 });
  }

  try {
    const updated = await storage.update(id, patch);
    if (!updated) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });
    return NextResponse.json(toPublic(updated));
  } catch (err) {
    console.error("[invitations] mise à jour impossible", err);
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }
}
