import { NextResponse } from "next/server";
import { storage, toPublic } from "../../../../lib/invitationStorage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/invitations/:id/payment
 * Le client déclare avoir payé et fournit sa référence de transaction.
 * Cela ne débloque RIEN : le statut passe à `pending`, en attente de validation.
 */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;

  let body: { editToken?: string; ref?: string; method?: string; phone?: string };
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

  if (existing.payment.status === "paid") {
    return NextResponse.json({ error: "Cette invitation est déjà réglée" }, { status: 409 });
  }

  const ref = (body.ref ?? "").trim();
  if (ref.length < 4 || ref.length > 64) {
    return NextResponse.json({ error: "Référence de transaction invalide" }, { status: 400 });
  }

  /* Numéro de téléphone du client (optionnel mais recommandé) */
  const phone = (body.phone ?? "").trim() || undefined;

  const updated = await storage.update(id, {
    phone,
    payment: {
      ...existing.payment,
      status: "pending",
      method: body.method === "d17" ? "d17" : (body.method ?? "d17"),
      ref,
      submittedAt: new Date().toISOString(),
    },
  });

  if (!updated) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });
  return NextResponse.json(toPublic(updated));
}
