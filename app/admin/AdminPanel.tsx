"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, X, Loader2, RefreshCw, ExternalLink, Lock, Copy, MessageCircle, Link2 } from "lucide-react";

type Row = {
  id: string;
  editToken: string;
  slug: string;
  plan: string;
  draft: { bride: string; groom: string; date: string; city: string; musicTitle?: string; musicUrl?: string };
  payment: { status: "unpaid" | "pending" | "paid"; amountDT: number; ref?: string; submittedAt?: string };
  phone?: string;
  /** Invitation depuis laquelle ce client est arrivé — mesure la boucle de parrainage */
  referredBy?: string;
  updatedAt: string;
};

const FILTERS = [
  { id: "pending", label: "à vérifier" },
  { id: "paid", label: "réglées" },
  { id: "unpaid", label: "non réglées" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem("farhty-admin-token") ?? "");
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<FilterId>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetch(`/api/admin/payments?status=${filter}`, { headers: { "x-admin-token": token } })
      .then((res) => {
        if (res.status === 401) throw new Error("Jeton refusé");
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setRows([]);
        setError(e instanceof Error ? e.message : "Chargement impossible");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, filter, reloadKey]);

  const decide = async (id: string, action: "confirm" | "reject") => {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      /* Met à jour la ligne localement au lieu de recharger : la carte
         reste visible avec son nouveau statut + bouton WhatsApp */
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                payment: {
                  ...r.payment,
                  status: action === "confirm" ? "paid" : "unpaid",
                  paidAt: action === "confirm" ? new Date().toISOString() : undefined,
                },
              }
            : r
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action impossible");
    } finally {
      setBusyId(null);
    }
  };

  const copyLink = async (id: string) => {
    const link = `${origin}/i/${id}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (phone: string, invId: string) => {
    /* Normalise : enlève les espaces et ajoute l'indicatif tunisien si besoin */
    let num = phone.replace(/[\s\-().]/g, "");
    if (num.startsWith("0")) num = "216" + num.slice(1);
    if (!num.startsWith("+") && !num.startsWith("216")) num = "216" + num;
    num = num.replace("+", "");

    const link = `${origin}/i/${invId}`;
    const msg = encodeURIComponent(
      `✨ مبروك! دعوتك جاهزة ✨\n\nهذا رابط دعوتك الرقمية:\n${link}\n\nأرسله لضيوفك عبر واتساب أو فيسبوك 🎉`
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  /* ── Saisie du jeton ── */
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0F0206]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem("farhty-admin-token", input.trim());
            setToken(input.trim());
          }}
          className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/30 bg-[#1C050B] p-7"
        >
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-5">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h1 className="text-lg font-extrabold text-[#F4E4BA] mb-1">Espace administrateur</h1>
          <p className="text-xs text-[#F4E4BA]/45 mb-5">Validation des paiements</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Jeton administrateur"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-sm text-[#F4E4BA] placeholder-[#F4E4BA]/30 focus:outline-none focus:border-[#D4AF37] mb-3"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#1C050B] text-sm font-extrabold cursor-pointer"
          >
            Entrer
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-[#0F0206]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-extrabold text-[#F4E4BA]">Paiements</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              aria-label="Rafraîchir"
              className="p-2 rounded-lg border border-[#D4AF37]/30 text-[#F4E4BA]/70 hover:text-[#F4E4BA] cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("farhty-admin-token");
                setToken("");
              }}
              className="text-xs text-[#F4E4BA]/50 hover:text-[#F4E4BA] cursor-pointer"
            >
              Quitter
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                filter === f.id
                  ? "bg-[#D4AF37] text-[#1C050B]"
                  : "text-[#F4E4BA]/60 border border-[#D4AF37]/25 hover:text-[#F4E4BA]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        {!loading && rows.length === 0 && (
          <p className="text-sm text-[#F4E4BA]/40 text-center py-16">Rien ici.</p>
        )}

        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#D4AF37]/20 bg-[#1C050B]/80 p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#F4E4BA] truncate">
                    {r.draft.bride} &amp; {r.draft.groom}
                  </p>
                  <p className="text-[11px] text-[#F4E4BA]/45">
                    {r.draft.date} · {r.draft.city} · {r.slug}
                  </p>
                </div>
                <span className="shrink-0 text-lg font-extrabold text-[#D4AF37]">{r.payment.amountDT} د.ت</span>
              </div>

              {/* Phone number */}
              {r.phone && (
                <p className="text-[11px] text-[#F4E4BA]/60 mb-2" dir="ltr">
                  📱 Tél : <span className="text-[#F4E4BA] font-bold">{r.phone}</span>
                </p>
              )}

              {r.payment.ref && (
                <p className="text-[11px] text-[#F4E4BA]/60 mb-2" dir="ltr">
                  Réf D17 : <span className="text-[#F4E4BA] font-bold">{r.payment.ref}</span>
                </p>
              )}

              {/* Music info */}
              <p className="text-[11px] text-[#F4E4BA]/60 mb-3">
                🎵 Musique : <span className="text-[#F4E4BA] font-bold">{r.draft.musicTitle || "Sans musique"}</span>
              </p>

              {/* Origine : quelle invitation a ramené ce client */}
              {r.referredBy && (
                <p className="text-[11px] text-[#F4E4BA]/60 mb-3">
                  🔁 Venu de l&apos;invitation{" "}
                  <a
                    href={`/i/${r.referredBy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] font-bold underline"
                    dir="ltr"
                  >
                    {r.referredBy}
                  </a>
                </p>
              )}

              {/* Public invitation link (always visible) */}
              <div className="flex items-center gap-2 rounded-xl bg-black/30 border border-[#D4AF37]/15 px-3 py-2 mb-3">
                <Link2 size={12} className="text-[#D4AF37] shrink-0" />
                <span className="text-[10px] text-[#F4E4BA]/70 truncate flex-1" dir="ltr">
                  {origin}/i/{r.id}
                </span>
                <button
                  onClick={() => copyLink(r.id)}
                  className="shrink-0 text-[10px] text-[#D4AF37] font-bold hover:opacity-70 cursor-pointer flex items-center gap-1"
                >
                  {copiedId === r.id ? <Check size={10} /> : <Copy size={10} />}
                  {copiedId === r.id ? "copié" : "copier"}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`/editor?inv=${r.id}&t=${r.editToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 text-[11px] text-[#F4E4BA]/80 hover:text-[#F4E4BA]"
                >
                  <ExternalLink size={12} /> voir
                </a>

                <a
                  href={`/i/${r.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 text-[11px] text-[#F4E4BA]/80 hover:text-[#F4E4BA]"
                >
                  <Link2 size={12} /> invitation
                </a>

                {/* WhatsApp button — only when phone is available */}
                {r.phone && (
                  <button
                    onClick={() => openWhatsApp(r.phone!, r.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[11px] font-bold hover:bg-[#25D366]/30 cursor-pointer"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </button>
                )}

                {r.payment.status !== "paid" && (
                  <button
                    onClick={() => decide(r.id, "confirm")}
                    disabled={busyId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold disabled:opacity-40 cursor-pointer"
                  >
                    {busyId === r.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    valider
                  </button>
                )}

                {r.payment.status !== "unpaid" && (
                  <button
                    onClick={() => decide(r.id, "reject")}
                    disabled={busyId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 text-[11px] font-bold disabled:opacity-40 cursor-pointer"
                  >
                    <X size={12} /> refuser
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
