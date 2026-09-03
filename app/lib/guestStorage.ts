/* Module serveur uniquement : accède à la base et au système de fichiers.
   Ne jamais l'importer depuis un composant client. */
import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";

export type GuestStatus = "pending" | "yes" | "no";

/** `list` : saisi par les mariés · `self` : l'invité s'est nommé via le lien ouvert */
export type GuestSource = "list" | "self";

export interface Guest {
  /** Court, public, transporté dans l'URL : quiconque l'a peut répondre pour cette famille */
  id: string;
  invitationId: string;
  name: string;
  /** Places prévues par les mariés, avant réponse */
  seats?: number;
  status: GuestStatus;
  /** Places réellement confirmées par la famille */
  confirmedSeats?: number;
  message?: string;
  sentAt?: string;
  openedAt?: string;
  respondedAt?: string;
  /** Arrivée réelle, pointée à l'entrée le jour J — Pack Royale uniquement */
  checkedInAt?: string;
  source: GuestSource;
  createdAt: string;
}

/** Ce que l'invitation elle-même a besoin de savoir : jamais la liste des autres invités */
export type GuestView = Pick<Guest, "id" | "name" | "seats" | "status" | "confirmedSeats" | "message">;

export function toGuestView(g: Guest): GuestView {
  return {
    id: g.id,
    name: g.name,
    seats: g.seats,
    status: g.status,
    confirmedSeats: g.confirmedSeats,
    message: g.message,
  };
}

/* Alphabet sans caractères ambigus : ces liens se dictent au téléphone */
const ID_ALPHABET = "23456789abcdefghijkmnpqrstuvwxyz";

export function newGuestId(): string {
  const bytes = randomBytes(7);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return out;
}

export const isGuestId = (v: unknown): v is string =>
  typeof v === "string" && /^[23456789a-z]{7}$/.test(v);

/** Un nom de famille tunisien tient largement dans 80 caractères */
export const MAX_NAME = 80;
export const MAX_MESSAGE = 500;
/** Au-delà, c'est une erreur de saisie, pas une famille */
export const MAX_SEATS = 50;

/** Totaux affichés aux mariés — le seul chiffre que réclament la salle et le traiteur */
export interface GuestTotals {
  families: number;
  sent: number;
  opened: number;
  answered: number;
  coming: number;
  seatsConfirmed: number;
  /** Familles réellement arrivées, pointées à l'entrée */
  checkedIn: number;
  seatsCheckedIn: number;
}

export function totalsOf(guests: Guest[]): GuestTotals {
  return {
    families: guests.length,
    sent: guests.filter((g) => g.sentAt).length,
    opened: guests.filter((g) => g.openedAt).length,
    answered: guests.filter((g) => g.status !== "pending").length,
    coming: guests.filter((g) => g.status === "yes").length,
    seatsConfirmed: guests
      .filter((g) => g.status === "yes")
      .reduce((sum, g) => sum + (g.confirmedSeats ?? g.seats ?? 1), 0),
    checkedIn: guests.filter((g) => g.checkedInAt).length,
    seatsCheckedIn: guests
      .filter((g) => g.checkedInAt)
      .reduce((sum, g) => sum + (g.confirmedSeats ?? g.seats ?? 1), 0),
  };
}

interface GuestDriver {
  listFor(invitationId: string): Promise<Guest[]>;
  get(id: string): Promise<Guest | null>;
  /** Renvoie les invités réellement créés — les noms déjà présents sont ignorés */
  addMany(invitationId: string, entries: { name: string; seats?: number }[], source: GuestSource): Promise<Guest[]>;
  update(id: string, patch: Partial<Guest>): Promise<Guest | null>;
  remove(id: string, invitationId: string): Promise<boolean>;
  /** Retrouve une famille par son nom : le lien ouvert n'a que ça pour l'identifier */
  findByName(invitationId: string, name: string): Promise<Guest | null>;
}

/* ── Fichier local (développement sans base) ── */
const LOCAL_FILE = path.join(process.cwd(), ".data", "guests.json");

async function readLocal(): Promise<Record<string, Guest>> {
  try {
    return JSON.parse(await readFile(LOCAL_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeLocal(all: Record<string, Guest>): Promise<void> {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(all, null, 2), "utf8");
}

const localDriver: GuestDriver = {
  async listFor(invitationId) {
    const all = Object.values(await readLocal());
    return all
      .filter((g) => g.invitationId === invitationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
  async get(id) {
    return (await readLocal())[id] ?? null;
  },
  async addMany(invitationId, entries, source) {
    const all = await readLocal();
    const taken = new Set(
      Object.values(all)
        .filter((g) => g.invitationId === invitationId)
        .map((g) => g.name.toLowerCase())
    );

    const created: Guest[] = [];
    for (const entry of entries) {
      const key = entry.name.toLowerCase();
      if (taken.has(key)) continue;
      taken.add(key);
      const guest: Guest = {
        id: newGuestId(),
        invitationId,
        name: entry.name,
        seats: entry.seats,
        status: "pending",
        source,
        createdAt: new Date().toISOString(),
      };
      all[guest.id] = guest;
      created.push(guest);
    }
    await writeLocal(all);
    return created;
  },
  async update(id, patch) {
    const all = await readLocal();
    if (!all[id]) return null;
    all[id] = { ...all[id], ...patch };
    await writeLocal(all);
    return all[id];
  },
  async remove(id, invitationId) {
    const all = await readLocal();
    if (!all[id] || all[id].invitationId !== invitationId) return false;
    delete all[id];
    await writeLocal(all);
    return true;
  },
  async findByName(invitationId, name) {
    const all = Object.values(await readLocal());
    const key = name.toLowerCase();
    return all.find((g) => g.invitationId === invitationId && g.name.toLowerCase() === key) ?? null;
  },
};

/* ── Neon (Postgres) ── */
function neonDriver(connectionString: string): GuestDriver {
  const sql = neon(connectionString);

  type Row = {
    id: string;
    invitation_id: string;
    name: string;
    seats: number | null;
    status: GuestStatus;
    confirmed_seats: number | null;
    message: string | null;
    sent_at: string | null;
    opened_at: string | null;
    responded_at: string | null;
    checked_in_at: string | null;
    source: GuestSource;
    created_at: string;
  };

  const iso = (v: string | null) => (v ? new Date(v).toISOString() : undefined);

  const toGuest = (r: Row): Guest => ({
    id: r.id,
    invitationId: r.invitation_id,
    name: r.name,
    seats: r.seats ?? undefined,
    status: r.status,
    confirmedSeats: r.confirmed_seats ?? undefined,
    message: r.message ?? undefined,
    sentAt: iso(r.sent_at),
    openedAt: iso(r.opened_at),
    respondedAt: iso(r.responded_at),
    checkedInAt: iso(r.checked_in_at),
    source: r.source,
    createdAt: new Date(r.created_at).toISOString(),
  });

  return {
    async listFor(invitationId) {
      const rows = (await sql`
        select * from guests where invitation_id = ${invitationId} order by created_at
      `) as Row[];
      return rows.map(toGuest);
    },

    async get(id) {
      const rows = (await sql`select * from guests where id = ${id} limit 1`) as Row[];
      return rows[0] ? toGuest(rows[0]) : null;
    },

    async addMany(invitationId, entries, source) {
      const created: Guest[] = [];
      for (const entry of entries) {
        const id = newGuestId();
        /* `on conflict do nothing` sur l'index (invitation, nom) : coller deux
           fois la même liste n'ajoute pas de doublon et ne lève pas d'erreur. */
        const rows = (await sql`
          insert into guests (id, invitation_id, name, seats, source)
          values (${id}, ${invitationId}, ${entry.name}, ${entry.seats ?? null}, ${source})
          on conflict do nothing
          returning *
        `) as Row[];
        if (rows[0]) created.push(toGuest(rows[0]));
      }
      return created;
    },

    async update(id, patch) {
      const rows = (await sql`
        update guests set
          name            = coalesce(${patch.name ?? null}, name),
          seats           = coalesce(${patch.seats ?? null}, seats),
          status          = coalesce(${patch.status ?? null}, status),
          confirmed_seats = coalesce(${patch.confirmedSeats ?? null}, confirmed_seats),
          message         = coalesce(${patch.message ?? null}, message),
          sent_at         = coalesce(${patch.sentAt ?? null}, sent_at),
          opened_at       = coalesce(${patch.openedAt ?? null}, opened_at),
          responded_at    = coalesce(${patch.respondedAt ?? null}, responded_at),
          checked_in_at   = coalesce(${patch.checkedInAt ?? null}, checked_in_at)
        where id = ${id}
        returning *
      `) as Row[];
      return rows[0] ? toGuest(rows[0]) : null;
    },

    async remove(id, invitationId) {
      const rows = (await sql`
        delete from guests where id = ${id} and invitation_id = ${invitationId} returning id
      `) as { id: string }[];
      return rows.length > 0;
    },

    async findByName(invitationId, name) {
      const rows = (await sql`
        select * from guests
        where invitation_id = ${invitationId} and lower(name) = lower(${name})
        limit 1
      `) as Row[];
      return rows[0] ? toGuest(rows[0]) : null;
    },
  };
}

const DATABASE_URL = process.env.DATABASE_URL;

/* Même ordre de priorité que les invitations : Neon, sinon le fichier local.
   Supabase n'est pas géré ici — la table `guests` n'y existe pas. */
export const guests: GuestDriver = DATABASE_URL ? neonDriver(DATABASE_URL) : localDriver;
