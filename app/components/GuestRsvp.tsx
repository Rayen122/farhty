"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";

/** Ce que l'invitation sait de la famille qui la consulte — jamais plus */
export type GuestView = {
  id: string;
  name: string;
  seats?: number;
  status: "pending" | "yes" | "no";
  confirmedSeats?: number;
  message?: string;
};

const GOLD = "#D4AF37";
const CREAM = "#F4E4BA";

/**
 * Confirmation de présence, réellement enregistrée.
 *
 * Deux entrées possibles :
 *  — lien nominatif `/i/<id>?g=<guest>` : le nom est déjà connu, on salue la famille ;
 *  — lien ouvert `/i/<id>` : l'invité se nomme lui-même, ce qui évite aux mariés
 *    d'avoir à préparer une liste pour les invitations envoyées en groupe.
 *
 * Un mariage tunisien s'invite par famille : la question posée est « combien
 * serez-vous », pas « viendrez-vous ». C'est ce total que réclame la salle.
 */
export default function GuestRsvp({
  invitationId,
  guest: initialGuest,
}: {
  invitationId: string;
  guest: GuestView | null;
}) {
  const [guest, setGuest] = useState<GuestView | null>(initialGuest);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(initialGuest?.confirmedSeats ?? initialGuest?.seats ?? 1);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(initialGuest?.status === "pending" || !initialGuest);
  const [busy, setBusy] = useState<"yes" | "no" | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Signale la première ouverture : c'est ce qui permet aux mariés de
     relancer les silencieux sans harceler ceux qui ont déjà répondu. */
  useEffect(() => {
    if (!initialGuest) return;
    fetch(`/api/invitations/${invitationId}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "open", guestId: initialGuest.id }),
    }).catch(() => {
      /* Un ping de suivi qui échoue ne doit rien casser côté invité */
    });
  }, [invitationId, initialGuest]);

  const submit = async (status: "yes" | "no") => {
    if (!guest && !name.trim()) {
      setError("اكتب اسمك قبل");
      return;
    }

    setBusy(status);
    setError(null);

    try {
      const res = await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest?.id,
          name: guest ? undefined : name.trim(),
          status,
          seats: status === "yes" ? seats : undefined,
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error(String(res.status));

      const data = (await res.json()) as { guest: GuestView };
      setGuest(data.guest);
      setEditing(false);
    } catch {
      setError("ما نجّمناش نسجّلو. عاود جرّب.");
    } finally {
      setBusy(null);
    }
  };

  const answered = guest && guest.status !== "pending" && !editing;

  return (
    <section
      dir="rtl"
      className="relative px-6 py-12"
      style={{ background: "linear-gradient(180deg,#2A0912 0%,#1C050B 100%)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD}66,transparent)` }}
      />

      <div className="max-w-sm mx-auto text-center flex flex-col gap-5">
        {guest ? (
          <p className="text-xl" style={{ color: CREAM, fontFamily: "var(--font-display)" }}>
            عزيزنا {guest.name}
          </p>
        ) : (
          <p className="text-xl" style={{ color: CREAM, fontFamily: "var(--font-display)" }}>
            أهلا بيك معانا
          </p>
        )}

        {answered ? (
          /* ── Réponse déjà donnée ── */
          <div className="flex flex-col gap-3 items-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border"
              style={{
                borderColor: guest.status === "yes" ? `${GOLD}66` : `${CREAM}33`,
                background: guest.status === "yes" ? `${GOLD}1A` : "transparent",
              }}
            >
              {guest.status === "yes" ? (
                <Check size={24} style={{ color: GOLD }} />
              ) : (
                <X size={24} style={{ color: `${CREAM}66` }} />
              )}
            </div>

            <p className="text-sm" style={{ color: `${CREAM}CC` }}>
              {guest.status === "yes"
                ? `سجّلناكم ${guest.confirmedSeats ?? 1} أشخاص. نستنّاوكم!`
                : "سجّلنا اعتذاركم. نتمنّاو نشوفوكم في مناسبة أخرى."}
            </p>

            <button
              onClick={() => setEditing(true)}
              className="text-xs underline cursor-pointer"
              style={{ color: `${CREAM}66` }}
            >
              بدّل إجابتك
            </button>
          </div>
        ) : (
          /* ── Formulaire ── */
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: `${CREAM}55` }}>
              تأكيد الحضور
            </p>

            {!guest && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم العائلة ولا اسمك"
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl text-sm text-center focus:outline-none"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: `1px solid ${GOLD}44`,
                  color: CREAM,
                }}
              />
            )}

            {/* Le compteur de places : la seule question qui intéresse la salle */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm" style={{ color: `${CREAM}99` }}>
                قدّاش باش تكونو؟
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  aria-label="أقل"
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ border: `1px solid ${GOLD}44`, color: CREAM }}
                >
                  <Minus size={14} />
                </button>
                <span
                  className="text-2xl w-8 tabular-nums"
                  style={{ color: GOLD, fontFamily: "var(--font-display)" }}
                >
                  {seats}
                </span>
                <button
                  onClick={() => setSeats((s) => Math.min(50, s + 1))}
                  aria-label="أكثر"
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ border: `1px solid ${GOLD}44`, color: CREAM }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="كلمة للعروسين (اختياري)"
              rows={2}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl text-sm text-center resize-none focus:outline-none"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: `1px solid ${GOLD}33`,
                color: CREAM,
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => submit("yes")}
                disabled={busy !== null}
                className="flex-1 py-3.5 rounded-full text-sm font-extrabold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                style={{ background: GOLD, color: "#1C050B" }}
              >
                {busy === "yes" ? <Loader2 size={16} className="animate-spin" /> : null}
                بكلّ فرح
              </button>
              <button
                onClick={() => submit("no")}
                disabled={busy !== null}
                className="flex-1 py-3.5 rounded-full text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                style={{ border: `1px solid ${CREAM}33`, color: `${CREAM}AA` }}
              >
                {busy === "no" ? <Loader2 size={16} className="animate-spin" /> : null}
                للأسف لا
              </button>
            </div>

            {error && (
              <p className="text-xs" style={{ color: "#F0999B" }}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
