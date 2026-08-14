/**
 * Moteur du conseiller de modèles.
 *
 * Quatre questions à choix fermés, chaque réponse porte des étiquettes ; le
 * modèle qui en partage le plus l'emporte. Pas d'appel réseau, pas de clé API,
 * et surtout aucun risque de recommander un modèle qui n'existe pas — la liste
 * finale est filtrée sur les modèles réellement présents dans `data.ts`.
 */

import { templates } from "../templates/data";

export type AdvisorTag =
  | "royal"
  | "tunisian"
  | "floral"
  | "classic"
  | "goldRed"
  | "emerald"
  | "pastel"
  | "blue"
  | "palace"
  | "garden"
  | "heritage"
  | "night"
  | "video"
  | "sober"
  | "luxe";

export type AdvisorQuestion = {
  /** Sert de clé de traduction : `advisor.q_<id>` et `advisor.a_<id>_<option>`. */
  id: "style" | "colors" | "venue" | "priority";
  options: { id: string; tags: AdvisorTag[] }[];
};

export const ADVISOR_QUESTIONS: AdvisorQuestion[] = [
  {
    id: "style",
    options: [
      { id: "royal", tags: ["royal", "palace", "luxe"] },
      { id: "tunisian", tags: ["tunisian", "heritage"] },
      { id: "floral", tags: ["floral", "garden", "pastel"] },
      { id: "classic", tags: ["classic", "sober"] },
    ],
  },
  {
    id: "colors",
    options: [
      { id: "goldRed", tags: ["goldRed", "royal"] },
      { id: "emerald", tags: ["emerald"] },
      { id: "pastel", tags: ["pastel", "floral"] },
      { id: "blue", tags: ["blue"] },
    ],
  },
  {
    id: "venue",
    options: [
      { id: "hall", tags: ["palace", "luxe"] },
      { id: "garden", tags: ["garden", "floral"] },
      { id: "dar", tags: ["heritage", "tunisian"] },
      { id: "night", tags: ["night", "video"] },
    ],
  },
  {
    id: "priority",
    options: [
      { id: "video", tags: ["video", "luxe"] },
      { id: "sober", tags: ["sober", "classic"] },
      { id: "roots", tags: ["tunisian", "heritage"] },
      { id: "luxe", tags: ["luxe", "royal", "palace"] },
    ],
  },
];

/* Étiquetage fait à la main d'après le rendu de chaque modèle. Un modèle absent
   de cette table reste proposable en dernier recours, il ne disparaît pas. */
const TEMPLATE_TAGS: Record<string, AdvisorTag[]> = {
  "emeraude-royale": ["royal", "emerald", "palace", "luxe", "video"],
  "porte-chateau": ["royal", "goldRed", "palace", "video", "luxe"],
  "palais-or": ["royal", "goldRed", "palace", "luxe"],
  "parchemin-royal": ["royal", "goldRed", "heritage", "sober", "luxe"],
  "lettre-royale": ["royal", "goldRed", "sober", "luxe"],
  "lanternes-celestes": ["floral", "pastel", "night", "garden", "video"],
  "palais-cristal": ["royal", "blue", "palace", "luxe", "video"],
  "jardin-royal": ["floral", "emerald", "garden", "video"],
  "oasis-etoilee": ["tunisian", "goldRed", "heritage", "night"],
  classic: ["classic", "sober", "blue"],
  "lella-beya": ["tunisian", "heritage", "pastel", "sober"],
  imperiale: ["royal", "goldRed", "palace", "luxe"],
  jardin: ["floral", "garden", "pastel", "sober"],
  amour: ["floral", "pastel", "sober"],
  "la-joie": ["royal", "palace", "luxe", "video"],
  jasmin: ["tunisian", "heritage", "pastel", "garden"],
  tunisian: ["tunisian", "heritage", "goldRed", "luxe"],
};

export type Recommendation = { slug: string; name: string; image?: string; score: number };

/**
 * Classe les modèles par nombre d'étiquettes partagées avec les réponses.
 * En cas d'égalité, l'ordre de `data.ts` tranche — les modèles mis en avant
 * en tête de fichier restent devant.
 */
export function recommend(answers: AdvisorTag[], limit = 3): Recommendation[] {
  const wanted = new Set(answers);

  return templates
    .map((template, index) => {
      const tags = TEMPLATE_TAGS[template.slug] ?? [];
      const score = tags.reduce((total, tag) => total + (wanted.has(tag) ? 1 : 0), 0);
      return { slug: template.slug, name: template.name, image: template.image, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ slug, name, image, score }) => ({ slug, name, image, score }));
}
