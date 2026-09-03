import { NextResponse } from "next/server";
import { storage, isPaid } from "../../../../lib/invitationStorage";
import {
  guests,
  toGuestView,
  isGuestId,
  MAX_NAME,
  MAX_MESSAGE,
  MAX_SEATS,
  type Guest,
} from "../../../../lib/guestStorage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Route publique : c'est l'invité qui l'appelle depuis l'invitation.
 * Elle ne renvoie jamais la liste des autres invités — un invité n'a pas à
 * savoir qui d'autre est convié, ni qui a décliné.
 */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;

  const record = await storage.get(id).catch(() => null);
  if (!record) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });

  /* Une invitation non réglée n'est pas diffusable : sa page ne rend rien,
     et cette route ne doit pas devenir la porte dérobée qui la fait exister. */
  if (!isPaid(record)) {
    return NextResponse.json({ error: "Invitation non activée" }, { status: 403 });
  }

  let body: {
    action?: "open" | "respond";
    guestId?: string;
    name?: string;
    status?: "yes" | "no";
    seats?: number;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  /* ── Ouverture : sert uniquement à savoir qui relancer ── */
  if (body.action === "open") {
    if (!isGuestId(body.guestId)) return NextResponse.json({ ok: true });

    const guest = await guests.get(body.guestId);
    if (!guest || guest.invitationId !== id) return NextResponse.json({ ok: true });

    /* Première ouverture seulement : la date de découverte est plus parlante
       que celle de la dernière relecture. */
    if (!guest.openedAt) {
      await guests.update(guest.id, { openedAt: new Date().toISOString() });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.status !== "yes" && body.status !== "no") {
    return NextResponse.json({ error: "Réponse manquante" }, { status: 400 });
  }

  const seats =
    typeof body.seats === "number" && Number.isInteger(body.seats)
      ? Math.min(Math.max(body.seats, 1), MAX_SEATS)
      : undefined;

  const message =
    typeof body.message === "string" && body.message.trim()
      ? body.message.trim().slice(0, MAX_MESSAGE)
      : undefined;

  /* ── Qui répond ? ──
     Soit un lien nominatif (?g=…), soit le lien ouvert : dans ce cas
     l'invité se nomme lui-même et on lui crée sa ligne au passage. */
  let guest: Guest | null = null;

  if (isGuestId(body.guestId)) {
    const found = await guests.get(body.guestId);
    if (found && found.invitationId === id) guest = found;
  }

  if (!guest) {
    const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME) : "";
    if (!name) return NextResponse.json({ error: "Nom manquant" }, { status: 400 });

    /* Quelqu'un qui rouvre le lien ouvert et retape son nom doit corriger sa
       réponse, pas en créer une deuxième. */
    guest = await guests.findByName(id, name);
    if (!guest) {
      const [created] = await guests.addMany(id, [{ name }], "self");
      guest = created ?? (await guests.findByName(id, name));
    }
    if (!guest) return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });
  }

  const updated = await guests.update(guest.id, {
    status: body.status,
    confirmedSeats: body.status === "yes" ? (seats ?? guest.seats ?? 1) : undefined,
    message,
    respondedAt: new Date().toISOString(),
    openedAt: guest.openedAt ?? new Date().toISOString(),
  });

  if (!updated) return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });

  return NextResponse.json({ guest: toGuestView(updated) });
}
