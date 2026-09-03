"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Link2, Loader2, MessageCircle, QrCode, ScanLine, Trash2, UserCheck, Plus } from "lucide-react";
import { SITE_URL } from "../lib/brand";

type Guest = {
  id: string;
  name: string;
  seats?: number;
  status: "pending" | "yes" | "no";
  confirmedSeats?: number;
  message?: string;
  sentAt?: string;
  openedAt?: string;
  respondedAt?: string;
  checkedInAt?: string;
  source: "list" | "self";
};

type Totals = {
  families: number;
  sent: number;
  opened: number;
  answered: number;
  coming: number;
  seatsConfirmed: number;
  checkedIn: number;
  seatsCheckedIn: number;
};

const GOLD = "#D4AF37";
const CREAM = "#F4E4BA";

/**
 * Écran des mariés : coller la liste, envoyer famille par famille, suivre.
 *
 * L'envoi reste manuel — WhatsApp n'autorise aucun envoi automatique en masse.
 * Le rôle de cet écran est de rendre ce geste manuel très rapide : un bouton
 * par famille, qui ouvre la conversation avec le message et le bon lien déjà
 * écrits. Environ dix secondes par famille.
 */
export default function InvitesManager() {
  const params = useSearchParams();
  const invitationId = params?.get("inv") ?? "";
  const editToken = params?.get("t") ?? "";

  const [guests, setGuests] = useState<Guest[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [names, setNames] = useState("");
  const [showQr, setShowQr] = useState<string | null>(null);
  /* Se déduit de l'URL : inutile d'en faire un état, et le déclarer dans un
     effet déclencherait un rendu en cascade. */
  const incompleteLink = !invitationId || !editToken;

  const [loading, setLoading] = useState(!incompleteLink);
  const [busy, setBusy] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const error = incompleteLink
    ? "Lien incomplet : il manque l'invitation ou le jeton."
    : fetchError;

  const apply = (data: { guests: Guest[]; totals: Totals; plan?: string }) => {
    setGuests(data.guests);
    setTotals(data.totals);
    if (data.plan) setPlan(data.plan);
  };

  useEffect(() => {
    if (!invitationId || !editToken) return;

    let cancelled = false;

    fetch(`/api/invitations/${invitationId}/guests`, { headers: { "x-edit-token": editToken } })
      .then((res) => {
        if (res.status === 403) throw new Error("Lien de gestion invalide.");
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        apply(data);
        setFetchError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setFetchError(e instanceof Error ? e.message : "Chargement impossible");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [invitationId, editToken]);

  const act = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-edit-token": editToken },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `Erreur ${res.status}`);
      apply(await res.json());
      setFetchError(null);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Action impossible");
    } finally {
      setBusy(false);
    }
  };

  /* Toujours le domaine public, jamais `window.location.origin` : ces liens
     partent chez les invités, et un lien de préproduction n'ouvrirait rien
     chez eux. */
  const openLink = `${SITE_URL}/i/${invitationId}`;
  const linkFor = (g: Guest) => `${openLink}?g=${g.id}`;

  const sendTo = (g: Guest) => {
    const text = `سلام ${g.name} 🌸\n\nتشرّفونا بحضوركم في عرسنا. هذي دعوتكم:\n${linkFor(g)}\n\nنستنّاو تأكيدكم من الرابط 🤍`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    /* Marqué envoyé au clic : WhatsApp ne renvoie aucun accusé, donc c'est le
       geste de la mariée qui fait foi. Elle peut toujours relancer. */
    act({ action: "sent", guestId: g.id });
  };

  const copyOpenLink = async () => {
    await navigator.clipboard.writeText(openLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badge = (g: Guest) => {
    if (g.checkedInAt) return { label: `وصل · ${g.confirmedSeats ?? g.seats ?? 1}`, color: "#5FCF9B" };
    if (g.status === "yes") return { label: `جاي · ${g.confirmedSeats ?? 1}`, color: "#5FCF9B" };
    if (g.status === "no") return { label: "معتذر", color: "#F0999B" };
    if (g.openedAt) return { label: "قرا · ما جاوبش", color: GOLD };
    if (g.sentAt) return { label: "تبعثت", color: `${CREAM}77` };
    return { label: "ما تبعثتش", color: `${CREAM}44` };
  };

  return (
    <main className="min-h-screen p-5 sm:p-8" style={{ background: "#0F0206" }} dir="rtl">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-extrabold" style={{ color: CREAM }}>
            قائمة المدعوين
          </h1>
          <p className="text-xs" style={{ color: `${CREAM}66` }}>
            كل عائلة عندها رابط خاص باسمها. الزر يحلّ واتساب بالرسالة والرابط جاهزين.
          </p>
        </header>

        {error && (
          <p className="text-xs rounded-lg px-3 py-2" style={{ color: "#F0999B", background: "#3A0D14" }}>
            {error}
          </p>
        )}

        {totals && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "عائلات", value: totals.families },
              { label: "جاوبو", value: totals.answered },
              { label: "أماكن مؤكّدة", value: totals.seatsConfirmed },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-3 py-3 text-center"
                style={{ background: "#1C050B", border: `1px solid ${GOLD}22` }}
              >
                <p className="text-2xl font-extrabold tabular-nums" style={{ color: GOLD }}>
                  {s.value}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: `${CREAM}66` }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Check-in à l'entrée : Pack Royale uniquement ── */}
        {plan === "royale" && (
          <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#1C050B", border: `1px solid ${GOLD}44` }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: CREAM }}>
                <ScanLine size={13} style={{ color: GOLD }} /> استقبال يوم العرس
              </p>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${GOLD}22`, color: GOLD }}
              >
                Pack Royale
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: `${CREAM}66` }}>
              كل عائلة عندها QR في بطاقتها. حلّو هذا الرابط في تليفون اللي قاعد على الباب باش يصوّر الأكواد ويعرف شكون وصل، لحظة بلحظة.
            </p>

            {totals && (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <p className="text-xl font-extrabold tabular-nums" style={{ color: "#5FCF9B" }}>
                    {totals.checkedIn}
                    <span className="text-xs" style={{ color: `${CREAM}44` }}> / {totals.families}</span>
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: `${CREAM}66` }}>عائلات وصلت</p>
                </div>
                <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <p className="text-xl font-extrabold tabular-nums" style={{ color: "#5FCF9B" }}>
                    {totals.seatsCheckedIn}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: `${CREAM}66` }}>أشخاص وصلو</p>
                </div>
              </div>
            )}

            <a
              href={`/invites/scan?inv=${invitationId}&t=${editToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full text-xs font-extrabold cursor-pointer flex items-center justify-center gap-2"
              style={{ background: GOLD, color: "#1C050B" }}
            >
              <ScanLine size={14} /> حلّ الماسح ضوئي
            </a>
          </div>
        )}

        {/* ── Lien ouvert : la solution pour les invitations envoyées en groupe ── */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "#1C050B", border: `1px solid ${GOLD}22` }}>
          <p className="text-xs font-bold" style={{ color: CREAM }}>
            الرابط المفتوح
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: `${CREAM}66` }}>
            ابعثو في قروب العايلة ولا الخدمة. اللي يحلّو يكتب اسمو بروحو ويأكّد — ما تلزمكمش تحضّرو قائمة.
          </p>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.4)" }}>
            <Link2 size={12} style={{ color: GOLD }} className="shrink-0" />
            <span className="text-[10px] truncate flex-1" dir="ltr" style={{ color: `${CREAM}AA` }}>
              {openLink}
            </span>
            <button
              onClick={copyOpenLink}
              className="shrink-0 text-[10px] font-bold cursor-pointer flex items-center gap-1"
              style={{ color: GOLD }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? "تنسخ" : "انسخ"}
            </button>
          </div>
        </div>

        {/* ── Coller la liste ── */}
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#1C050B", border: `1px solid ${GOLD}22` }}>
          <p className="text-xs font-bold" style={{ color: CREAM }}>
            زيد عائلات
          </p>
          <textarea
            value={names}
            onChange={(e) => setNames(e.target.value)}
            rows={4}
            placeholder={"اسم في كل سطر. تنجّم تزيد عدد الأماكن:\nعائلة بن صالح - 6\nعمي كريم, 2\nخالتي نجاة"}
            className="w-full px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none"
            style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${GOLD}33`, color: CREAM }}
          />
          <button
            onClick={() => {
              act({ action: "add", names });
              setNames("");
            }}
            disabled={busy || !names.trim()}
            className="self-start px-5 py-2.5 rounded-full text-xs font-extrabold disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            style={{ background: GOLD, color: "#1C050B" }}
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            زيدهم
          </button>
        </div>

        {/* ── La liste ── */}
        {loading ? (
          <p className="text-center text-sm py-10" style={{ color: `${CREAM}44` }}>
            جاري التحميل…
          </p>
        ) : guests.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: `${CREAM}44` }}>
            ما ثمّة حتّى عائلة للتوّ.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {guests.map((g) => {
              const b = badge(g);
              return (
                <div key={g.id} className="flex flex-col gap-2">
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "#1C050B", border: `1px solid ${GOLD}1A` }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate" style={{ color: CREAM }}>
                      {g.name}
                      {g.source === "self" && (
                        <span className="text-[9px] mr-1.5" style={{ color: `${CREAM}44` }}>
                          (زاد روحو)
                        </span>
                      )}
                    </p>
                    <p className="text-[10px]" style={{ color: b.color }}>
                      {b.label}
                    </p>
                    {g.message && (
                      <p className="text-[10px] mt-1 italic" style={{ color: `${CREAM}55` }}>
                        « {g.message} »
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => sendTo(g)}
                    disabled={busy}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 disabled:opacity-40"
                    style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", color: "#25D366" }}
                  >
                    <MessageCircle size={12} />
                    {g.sentAt ? "عاود" : "ابعث"}
                  </button>

                  {plan === "royale" && (
                    <button
                      onClick={() => setShowQr(showQr === g.id ? null : g.id)}
                      aria-label={`QR ${g.name}`}
                      className="shrink-0 p-1.5 rounded-lg cursor-pointer"
                      style={{ color: showQr === g.id ? GOLD : `${CREAM}44` }}
                    >
                      <QrCode size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => act({ action: "remove", guestId: g.id })}
                    disabled={busy}
                    aria-label={`احذف ${g.name}`}
                    className="shrink-0 p-1.5 rounded-lg cursor-pointer disabled:opacity-40"
                    style={{ color: `${CREAM}44` }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {showQr === g.id && (
                  <div
                    className="rounded-xl p-4 flex flex-col items-center gap-2"
                    style={{ background: "#1C050B", border: `1px solid ${GOLD}33` }}
                  >
                    <div className="bg-white p-2.5 rounded-lg">
                      <QRCodeSVG value={linkFor(g)} size={128} />
                    </div>
                    <p className="text-[10px] flex items-center gap-1" style={{ color: `${CREAM}66` }}>
                      <UserCheck size={11} /> يتصور يوم العرس عالباب
                    </p>
                  </div>
                )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
