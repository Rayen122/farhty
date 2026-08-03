/**
 * Applique les fichiers .sql de ce dossier sur la base pointée par DATABASE_URL.
 *
 *   npm run db:migrate
 *
 * Les scripts sont écrits pour être rejouables (`if not exists` partout), donc
 * relancer la commande sur une base déjà migrée ne casse rien.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));

/* Node ne lit pas .env.local tout seul : on le charge à la main plutôt que
   d'imposer une dépendance de plus. */
function loadEnvLocal() {
  let raw;
  try {
    raw = readFileSync(join(here, "..", ".env.local"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (process.env[key]) continue; // une vraie variable d'environnement l'emporte
    process.env[key] = value.trim().replace(/^["']|["']$/g, "");
  }
}

/* Le driver HTTP n'accepte qu'une instruction par appel : on découpe le fichier.
   Les commentaires `--` sautent d'abord, car ils contiennent des `;`. */
function statementsOf(sql) {
  return sql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

loadEnvLocal();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL absente.\n" +
      "Renseigne-la dans .env.local (Neon > Connection string > Pooled connection),\n" +
      "ou récupère celle de Vercel avec : vercel env pull .env.local"
  );
  process.exit(1);
}

const sql = neon(url);
const files = readdirSync(here)
  .filter((f) => f.endsWith(".sql"))
  .sort();

for (const file of files) {
  const statements = statementsOf(readFileSync(join(here, file), "utf8"));
  process.stdout.write(`${file} — ${statements.length} instructions… `);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("ok");
}

const [{ count }] = await sql`select count(*)::int as count from invitations`;
console.log(`Table invitations prête (${count} lignes).`);
