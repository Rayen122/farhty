import crypto from "crypto";
import { findReply } from "./replies";

/**
 * Webhook WhatsApp Cloud API — répondeur automatique par mots-clés.
 *
 * GET  : Meta vérifie l'URL une seule fois, à l'enregistrement du webhook.
 * POST : Meta pousse chaque message entrant ; on répond via la Graph API.
 *
 * Variables d'environnement requises (Vercel → Settings → Environment Variables) :
 *   WHATSAPP_VERIFY_TOKEN   chaîne de ton choix, recopiée dans le formulaire Meta
 *   WHATSAPP_TOKEN          jeton d'accès permanent du compte système
 *   WHATSAPP_PHONE_NUMBER_ID  identifiant du numéro émetteur
 *   WHATSAPP_APP_SECRET     secret de l'app Meta, sert à valider les signatures
 */

const GRAPH_API_VERSION = "v21.0";

/** Meta appelle cette route une fois pour prouver qu'on contrôle bien l'URL. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!expected) {
    return new Response("Webhook not configured", { status: 500 });
  }

  if (mode === "subscribe" && token === expected && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  const accessToken = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!appSecret || !accessToken || !phoneNumberId) {
    console.error("[whatsapp] variables d'environnement manquantes");
    return new Response("Webhook not configured", { status: 500 });
  }

  /* Le corps brut est nécessaire : la signature porte sur les octets exacts,
     donc re-sérialiser le JSON invaliderait le HMAC. */
  const raw = await request.text();

  if (!isSignatureValid(raw, request.headers.get("x-hub-signature-256"), appSecret)) {
    /* Sans cette vérification, n'importe qui pourrait faire envoyer des messages
       WhatsApp depuis le numéro de l'entreprise. */
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const messages = extractIncomingMessages(payload);

  /* Meta réessaie tant qu'il ne reçoit pas un 2xx : on répond toujours 200,
     même si un envoi échoue, pour éviter une boucle de renvois. */
  await Promise.all(
    messages.map(async ({ from, text }) => {
      try {
        await sendText(phoneNumberId, accessToken, from, findReply(text));
      } catch (error) {
        console.error("[whatsapp] envoi impossible", error);
      }
    }),
  );

  return new Response("OK", { status: 200 });
}

function isSignatureValid(raw: string, header: string | null, secret: string): boolean {
  if (!header?.startsWith("sha256=")) return false;

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const received = header.slice("sha256=".length);

  /* Comparaison à temps constant : une comparaison naïve fuirait le secret
     octet par octet via le temps de réponse. */
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(received, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Ne garde que les messages texte entrants ; ignore les accusés de lecture et les médias. */
function extractIncomingMessages(payload: WebhookPayload) {
  const results: { from: string; text: string }[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const message of change.value?.messages ?? []) {
        if (message.type === "text" && message.text?.body && message.from) {
          results.push({ from: message.from, text: message.text.body });
        }
      }
    }
  }

  return results;
}

async function sendText(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  body: string,
) {
  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Graph API ${response.status}: ${await response.text()}`);
  }
}

interface WebhookPayload {
  entry?: {
    changes?: {
      value?: {
        messages?: {
          from?: string;
          type?: string;
          text?: { body?: string };
        }[];
      };
    }[];
  }[];
}
