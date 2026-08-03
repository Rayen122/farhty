import { NextResponse } from "next/server";
import {
  storage,
  newInvitationId,
  newEditToken,
  PLANS,
  isPlanId,
  type InvitationRecord,
} from "../../lib/invitationStorage";
import { getTemplateBySlug } from "../../templates/data";

export const runtime = "nodejs";

/** POST /api/invitations — crée une invitation, renvoie l'id public + le token de modification */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { slug, draft, geo, layout, plan } = (body ?? {}) as Partial<InvitationRecord>;

  if (!slug || !getTemplateBySlug(slug)) {
    return NextResponse.json({ error: "Modèle inconnu" }, { status: 400 });
  }
  if (!draft || typeof draft !== "object" || !draft.bride || !draft.groom) {
    return NextResponse.json({ error: "Les noms des mariés sont obligatoires" }, { status: 400 });
  }

  /* La formule vient du client, mais JAMAIS le montant : il est dérivé
     du barème côté serveur, sinon n'importe qui paierait 0 د.ت. */
  const planId = isPlanId(plan) ? plan : "elegante";

  const now = new Date().toISOString();
  const record: InvitationRecord = {
    id: newInvitationId(draft.bride, draft.groom),
    editToken: newEditToken(),
    slug,
    draft,
    geo,
    layout,
    plan: planId,
    payment: { status: "unpaid", amountDT: PLANS[planId].amountDT },
    createdAt: now,
    updatedAt: now,
  };

  try {
    await storage.create(record);
  } catch (err) {
    console.error("[invitations] création impossible", err);
    return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });
  }

  return NextResponse.json({ id: record.id, editToken: record.editToken }, { status: 201 });
}
