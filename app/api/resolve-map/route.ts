import { NextResponse } from "next/server";

export const runtime = "nodejs";

/* Le bouton « Partager » de Google Maps sur mobile produit un lien court qui ne
   contient aucune coordonnée. On suit la redirection pour récupérer l'URL longue.
   Liste blanche stricte : cette route ne doit pas devenir un proxy ouvert (SSRF). */
const ALLOWED_HOSTS = new Set(["maps.app.goo.gl", "goo.gl", "maps.google.com", "www.google.com"]);

const PATTERNS = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/,
  /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
];

function extract(url: string): { lat: number; lng: number } | null {
  for (const re of PATTERNS) {
    const m = url.match(re);
    if (!m) continue;
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}

export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({ url: null }));

  if (typeof url !== "string" || url.length > 2000) {
    return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Seuls les liens Google Maps sont acceptés" }, { status: 400 });
  }

  try {
    /* `redirect: manual` : on lit l'en-tête Location sans charger la page cible */
    let current = parsed.toString();
    for (let hop = 0; hop < 5; hop++) {
      const found = extract(current);
      if (found) return NextResponse.json(found);

      const res = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(5000) });
      const location = res.headers.get("location");
      if (!location) break;

      const next = new URL(location, current);
      if (next.protocol !== "https:" || !ALLOWED_HOSTS.has(next.hostname)) break;
      current = next.toString();
    }

    const found = extract(current);
    if (found) return NextResponse.json(found);

    return NextResponse.json({ error: "Coordonnées introuvables dans ce lien" }, { status: 422 });
  } catch {
    return NextResponse.json({ error: "Lien impossible à résoudre" }, { status: 502 });
  }
}
