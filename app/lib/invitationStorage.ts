/* Module serveur uniquement : ne jamais l'importer depuis un composant client
   (il contient la clé de service Supabase et accède au système de fichiers). */
import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";
import type { InvitationDraft } from "./invitationStore";

/** Position d'un bloc de texte sur la carte, en % de la carte (0-100) */
export interface BlockPosition {
  x: number;
  y: number;
}

export interface InvitationGeo {
  lat: number;
  lng: number;
  address?: string;
}

/* ── Formules, alignées sur la page tarifs ── */
export const PLANS = {
  elegante: { label: "الباقة الأنيقة", amountDT: 49 },
  diamant: { label: "الباقة الماسية", amountDT: 89 },
  royale: { label: "باقة رويال", amountDT: 149 },
} as const;

export type PlanId = keyof typeof PLANS;
export const isPlanId = (v: unknown): v is PlanId => typeof v === "string" && v in PLANS;

/**
 * `unpaid`  — créée, pas encore réglée
 * `pending` — le client dit avoir payé et a fourni une référence, à vérifier
 * `paid`    — validée : les liens sont délivrés et l'invitation devient publique
 */
export type PaymentStatus = "unpaid" | "pending" | "paid";

export interface Payment {
  status: PaymentStatus;
  /** Montant figé à la création — jamais recalculé depuis le client */
  amountDT: number;
  method?: string;
  /** Référence de transaction saisie par le client */
  ref?: string;
  submittedAt?: string;
  paidAt?: string;
}

export interface InvitationRecord {
  id: string;
  /** Secret : ne doit JAMAIS sortir par la route publique */
  editToken: string;
  slug: string;
  draft: InvitationDraft;
  geo?: InvitationGeo;
  /** Placement libre des blocs sur la carte (clé = nom du bloc) */
  layout?: Record<string, BlockPosition>;
  plan: PlanId;
  payment: Payment;
  /** Numéro de téléphone du client pour le contacter via WhatsApp */
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

/** Ce que voit un invité : jamais le token de modification */
export type PublicInvitation = Omit<InvitationRecord, "editToken">;

export function toPublic(record: InvitationRecord): PublicInvitation {
  /* Réécriture explicite plutôt qu'un rest : si un champ secret est ajouté
     un jour au type, il ne fuitera pas silencieusement par cette fonction. */
  return {
    id: record.id,
    slug: record.slug,
    draft: record.draft,
    geo: record.geo,
    layout: record.layout,
    plan: record.plan,
    payment: record.payment,
    phone: record.phone,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const isPaid = (record: InvitationRecord) => record.payment.status === "paid";

/**
 * Les invitations créées avant l'introduction du paiement n'ont ni `plan` ni
 * `payment`. On les complète à la lecture plutôt que de faire planter l'appelant.
 * Une invitation ancienne reste non réglée : elle ne devient pas gratuite.
 */
function withDefaults(record: InvitationRecord): InvitationRecord {
  if (record.payment && record.plan) return record;
  const plan = record.plan ?? "elegante";
  return {
    ...record,
    plan,
    payment: record.payment ?? { status: "unpaid", amountDT: PLANS[plan].amountDT },
  };
}

/* Alphabet sans caractères ambigus (0/O, 1/l/I) — ces liens se dictent au téléphone */
const ID_ALPHABET = "23456789abcdefghijkmnpqrstuvwxyz";

function shortId(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return out;
}

/* ── Translittération arabe → latin simplifiée ── */
const AR_MAP: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "a", "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "dh", "ط": "t", "ظ": "dh",
  "ع": "a", "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m",
  "ن": "n", "ه": "h", "و": "w", "ي": "y", "ى": "a", "ة": "a",
  "ئ": "i", "ؤ": "w", "ء": "",
  // Voyelles courtes (diacritiques)
  "\u064E": "a", "\u064F": "u", "\u0650": "i", "\u0651": "", "\u0652": "",
};

function transliterate(text: string): string {
  let out = "";
  for (const ch of text) {
    if (AR_MAP[ch] !== undefined) out += AR_MAP[ch];
    else out += ch;
  }
  return out;
}

function slugify(text: string): string {
  return transliterate(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Génère un ID basé sur les noms du couple :  `fatma-et-mehdi-a3k`
 * Si les noms ne sont pas exploitables, repli sur un ID court aléatoire.
 */
export function newInvitationId(bride?: string, groom?: string): string {
  const b = slugify(bride ?? "");
  const g = slugify(groom ?? "");
  const suffix = shortId(3);

  if (b && g) return `${b}-et-${g}-${suffix}`;
  if (b || g) return `${b || g}-${suffix}`;
  return shortId(8);
}

export const newEditToken = () => randomBytes(24).toString("base64url");

/* ────────────────────────────────────────────────────────────────
   Deux pilotes de stockage.
   - Supabase dès que les variables d'environnement sont présentes
   - sinon un fichier JSON local, pour pouvoir développer et tester
     sans compte externe. Le fichier ne survit pas à un déploiement
     Vercel (système de fichiers éphémère) : la production a besoin
     de Supabase.
   ──────────────────────────────────────────────────────────────── */

interface StorageDriver {
  create(record: InvitationRecord): Promise<void>;
  get(id: string): Promise<InvitationRecord | null>;
  update(id: string, patch: Partial<InvitationRecord>): Promise<InvitationRecord | null>;
  /** Usage administrateur : les plus récentes d'abord */
  list(opts?: { status?: PaymentStatus; limit?: number }): Promise<InvitationRecord[]>;
}

const LOCAL_FILE = path.join(process.cwd(), ".data", "invitations.json");

const localDriver: StorageDriver = {
  async create(record) {
    const all = await readLocal();
    all[record.id] = record;
    await writeLocal(all);
  },
  async get(id) {
    const all = await readLocal();
    return all[id] ? withDefaults(all[id]) : null;
  },
  async update(id, patch) {
    const all = await readLocal();
    const existing = all[id];
    if (!existing) return null;
    const merged = withDefaults({ ...existing, ...patch, updatedAt: new Date().toISOString() });
    all[id] = merged;
    await writeLocal(all);
    return merged;
  },
  async list(opts) {
    const all = Object.values(await readLocal()).map(withDefaults);
    return all
      .filter((r) => !opts?.status || r.payment.status === opts.status)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, opts?.limit ?? 100);
  },
};

async function readLocal(): Promise<Record<string, InvitationRecord>> {
  try {
    return JSON.parse(await readFile(LOCAL_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeLocal(all: Record<string, InvitationRecord>): Promise<void> {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(all, null, 2), "utf8");
}

/* ── Neon (Postgres) ──
   Les colonnes sont en snake_case côté base, camelCase côté TypeScript. */
function neonDriver(connectionString: string): StorageDriver {
  const sql = neon(connectionString);

  type Row = {
    id: string;
    edit_token: string;
    slug: string;
    draft: InvitationDraft;
    geo: InvitationGeo | null;
    layout: Record<string, BlockPosition> | null;
    plan: PlanId;
    payment: Payment;
    phone: string | null;
    created_at: string;
    updated_at: string;
  };

  const toRecord = (r: Row): InvitationRecord => ({
    id: r.id,
    editToken: r.edit_token,
    slug: r.slug,
    draft: r.draft,
    geo: r.geo ?? undefined,
    layout: r.layout ?? undefined,
    plan: r.plan,
    payment: r.payment,
    phone: r.phone ?? undefined,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  });

  return {
    async create(record) {
      await sql`
        insert into invitations (id, edit_token, slug, draft, geo, layout, plan, payment, phone, created_at, updated_at)
        values (${record.id}, ${record.editToken}, ${record.slug},
                ${JSON.stringify(record.draft)}::jsonb,
                ${record.geo ? JSON.stringify(record.geo) : null}::jsonb,
                ${record.layout ? JSON.stringify(record.layout) : null}::jsonb,
                ${record.plan},
                ${JSON.stringify(record.payment)}::jsonb,
                ${record.phone ?? null},
                ${record.createdAt}, ${record.updatedAt})
      `;
    },

    async get(id) {
      const rows = (await sql`select * from invitations where id = ${id} limit 1`) as Row[];
      return rows[0] ? toRecord(rows[0]) : null;
    },

    async update(id, patch) {
      // `coalesce` : un champ absent du patch garde sa valeur actuelle
      const rows = (await sql`
        update invitations set
          slug       = coalesce(${patch.slug ?? null}, slug),
          draft      = coalesce(${patch.draft ? JSON.stringify(patch.draft) : null}::jsonb, draft),
          geo        = coalesce(${patch.geo ? JSON.stringify(patch.geo) : null}::jsonb, geo),
          layout     = coalesce(${patch.layout ? JSON.stringify(patch.layout) : null}::jsonb, layout),
          plan       = coalesce(${patch.plan ?? null}, plan),
          payment    = coalesce(${patch.payment ? JSON.stringify(patch.payment) : null}::jsonb, payment),
          phone      = coalesce(${patch.phone ?? null}, phone),
          updated_at = now()
        where id = ${id}
        returning *
      `) as Row[];
      return rows[0] ? toRecord(rows[0]) : null;
    },

    async list(opts) {
      const limit = opts?.limit ?? 100;
      const rows = (opts?.status
        ? await sql`select * from invitations where payment->>'status' = ${opts.status}
                    order by updated_at desc limit ${limit}`
        : await sql`select * from invitations order by updated_at desc limit ${limit}`) as Row[];
      return rows.map(toRecord);
    },
  };
}

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function supabaseDriver(): StorageDriver {
  const base = `${SUPABASE_URL}/rest/v1/invitations`;
  const headers = {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  return {
    async create(record) {
      const res = await fetch(base, { method: "POST", headers, body: JSON.stringify(record) });
      if (!res.ok) throw new Error(`Supabase create ${res.status}: ${await res.text()}`);
    },
    async get(id) {
      const res = await fetch(`${base}?id=eq.${encodeURIComponent(id)}&select=*`, { headers, cache: "no-store" });
      if (!res.ok) throw new Error(`Supabase get ${res.status}: ${await res.text()}`);
      const rows = (await res.json()) as InvitationRecord[];
      return rows[0] ?? null;
    },
    async update(id, patch) {
      const res = await fetch(`${base}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ ...patch, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Supabase update ${res.status}: ${await res.text()}`);
      const rows = (await res.json()) as InvitationRecord[];
      return rows[0] ?? null;
    },
    async list(opts) {
      const filter = opts?.status ? `&payment->>status=eq.${opts.status}` : "";
      const res = await fetch(
        `${base}?select=*${filter}&order=updatedAt.desc&limit=${opts?.limit ?? 100}`,
        { headers, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Supabase list ${res.status}: ${await res.text()}`);
      return (await res.json()) as InvitationRecord[];
    },
  };
}

/* Ordre de priorité : Neon, puis Supabase, sinon le fichier local (dev uniquement) */
export const storage: StorageDriver = DATABASE_URL
  ? neonDriver(DATABASE_URL)
  : SUPABASE_URL && SUPABASE_KEY
    ? supabaseDriver()
    : localDriver;

export const storageBackend: "neon" | "supabase" | "local" = DATABASE_URL
  ? "neon"
  : SUPABASE_URL && SUPABASE_KEY
    ? "supabase"
    : "local";

/** `true` quand les données ne survivent pas à un redéploiement (fichier local) */
export const storageIsEphemeral = storageBackend === "local";
