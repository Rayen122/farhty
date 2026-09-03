/** Identité et liens de marque — source unique.
 *
 *  Historique : chaque design portait son propre `https://farhty.tn` en dur.
 *  Ce domaine n'a jamais existé, donc tous les crédits imprimés au bas des
 *  invitations envoyées pointaient dans le vide. Tout passe désormais par ici. */

export const SITE_URL = "https://www.farhty.me";

/** Page d'atterrissage des invités qui cliquent depuis une invitation reçue.
 *  Court et prononçable : ce lien se lit au bas d'une carte et se tape à la main. */
export const REFERRAL_PATH = "/da3wa";

/** Retient l'invitation d'origine entre la visite de l'invité et sa commande. */
export const REFERRAL_COOKIE = "farhty_ref";

/** 90 jours : un invité qui se marie à son tour décide rarement le soir même. */
export const REFERRAL_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

/**
 * Lien affiché au bas d'une invitation.
 * `ref` est l'identifiant de l'invitation qui amène le visiteur : c'est lui
 * qui permet de savoir quel mariage a ramené quel client.
 */
export function referralUrl(ref?: string): string {
  const url = `${SITE_URL}${REFERRAL_PATH}`;
  return ref ? `${url}?ref=${encodeURIComponent(ref)}` : url;
}

/** Un `ref` ne sert qu'à retrouver une invitation : même alphabet que les ids. */
export function isValidRef(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]{3,80}$/.test(value);
}
