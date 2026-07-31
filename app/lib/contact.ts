/** Coordonnées de contact — source unique, utilisée par le pied de page et le CTA flottant. */

export const PHONE_E164 = "+21621619408";

/** Format attendu par wa.me : chiffres uniquement, sans « + ». */
const WHATSAPP_NUMBER = PHONE_E164.replace(/\D/g, "");

/** Message pré-rempli en dialecte tunisien : le client n'a plus qu'à envoyer. */
const WHATSAPP_GREETING = "سلام، نحب نعمل دعوة إلكترونية";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_GREETING,
)}`;

export const PHONE_URL = `tel:${PHONE_E164}`;
