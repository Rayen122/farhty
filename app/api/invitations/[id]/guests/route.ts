import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { storage } from "../../../../lib/invitationStorage";
import {
  guests,
  totalsOf,
  isGuestId,
  MAX_NAME,
  MAX_SEATS,
} from "../../../../lib/guestStorage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Nombre de familles qu'on accepte de créer en une fois — au-delà, c'est un collage accidentel */
const MAX_BATCH = 400;

/**
 * Réservé aux mariés. Le jeton passe par un en-tête et jamais par l'URL :
 * une adresse se retrouve dans l'historique du navigateur et les journaux serveur.
 */
async function ownerOf(req: Request, id: string) {
  const record = await storage.get(id).catch(() => null);
  if (!record) return { record: null, ok: false as const };

  const provided = Buffer.from(req.headers.get("x-edit-token") ?? "");
  const expected = Buffer.from(record.editToken);
  const ok = provided.length === expected.length && timingSafeEqual(provided, expected);
  return { record, ok };
}

/** GET — la liste des familles et les totaux, pour l'écran d'envoi */
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { record, ok } = await ownerOf(req, id);

  if (!record) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });
  if (!ok) return NextResponse.json({ error: "Lien de gestion invalide" }, { status: 403 });

  const list = await guests.listFor(id);
  return NextResponse.json(
    { guests: list, totals: totalsOf(list), plan: record.plan },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Une ligne collée peut porter le nombre de places :
 *   « عائلة بن صالح » · « عائلة بن صالح - 6 » · « عمي كريم, 2 »
 */
function parseLine(line: string): { name: string; seats?: number } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const withSeats = trimmed.match(/^(.*?)[\s,;|·-]+(\d{1,2})$/);
  if (withSeats) {
    const name = withSeats[1].trim();
    const seats = Number(withSeats[2]);
    if (name && seats >= 1 && seats <= MAX_SEATS) return { name: name.slice(0, MAX_NAME), seats };
  }

  return { name: trimmed.slice(0, MAX_NAME) };
}

/** POST — ajouter des familles, marquer une invitation envoyée, ou retirer une ligne */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { record, ok } = await ownerOf(req, id);

  if (!record) return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 });
  if (!ok) return NextResponse.json({ error: "Lien de gestion invalide" }, { status: 403 });

  let body: { action?: string; names?: string; guestId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (body.action === "add") {
    if (typeof body.names !== "string") {
      return NextResponse.json({ error: "Liste manquante" }, { status: 400 });
    }

    const entries = body.names
      .split("\n")
      .map(parseLine)
      .filter((e): e is { name: string; seats?: number } => e !== null)
      .slice(0, MAX_BATCH);

    if (entries.length === 0) {
      return NextResponse.json({ error: "Aucun nom exploitable" }, { status: 400 });
    }

    const created = await guests.addMany(id, entries, "list");
    const list = await guests.listFor(id);
    /* `added` peut être inférieur au nombre de lignes : les noms déjà
       présents sont ignorés, pour qu'un double collage ne duplique rien. */
    return NextResponse.json({ added: created.length, guests: list, totals: totalsOf(list) });
  }

  if (body.action === "sent" || body.action === "remove") {
    if (!isGuestId(body.guestId)) {
      return NextResponse.json({ error: "Invité inconnu" }, { status: 400 });
    }

    const guest = await guests.get(body.guestId);
    if (!guest || guest.invitationId !== id) {
      return NextResponse.json({ error: "Invité introuvable" }, { status: 404 });
    }

    if (body.action === "remove") {
      await guests.remove(body.guestId, id);
    } else {
      await guests.update(body.guestId, { sentAt: new Date().toISOString() });
    }

    const list = await guests.listFor(id);
    return NextResponse.json({ guests: list, totals: totalsOf(list) });
  }

  /* Check-in à l'entrée : le scanner pointe l'arrivée réelle d'une famille.
     Réservé au Pack Royale — appliqué ici aussi, pas seulement dans l'écran,
     sinon une invitation en formule inférieure y accéderait en tapant l'URL. */
  if (body.action === "checkin") {
    if (record.plan !== "royale") {
      return NextResponse.json({ error: "Le check-in est réservé au Pack Royale" }, { status: 403 });
    }
    if (!isGuestId(body.guestId)) {
      return NextResponse.json({ error: "Invité inconnu" }, { status: 400 });
    }

    const guest = await guests.get(body.guestId);
    if (!guest || guest.invitationId !== id) {
      return NextResponse.json({ error: "Invité introuvable" }, { status: 404 });
    }

    /* Déjà pointée : on répond quand même, avec l'heure de la première
       arrivée — un deuxième scan de la même carte n'est pas une erreur. */
    const alreadyCheckedIn = Boolean(guest.checkedInAt);
    const updated = alreadyCheckedIn
      ? guest
      : await guests.update(body.guestId, { checkedInAt: new Date().toISOString() });

    if (!updated) return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });

    return NextResponse.json({ guest: updated, alreadyCheckedIn });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
