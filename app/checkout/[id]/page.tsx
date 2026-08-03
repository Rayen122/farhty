"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Copy, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { PHONE_E164 } from "../../lib/contact";

/* Le transfert D17 arrive sur le numéro de téléphone du marchand : à défaut de
   `NEXT_PUBLIC_D17_NUMBER`, on affiche celui du contact plutôt que rien. */
const D17_NUMBER = process.env.NEXT_PUBLIC_D17_NUMBER || PHONE_E164.replace(/\D/g, "");

/* Barème dupliqué côté affichage uniquement : le montant qui fait foi
   est celui figé sur l'invitation par le serveur à sa création. */
const PLAN_LABELS: Record<string, string> = {
  elegante: "الباقة الأنيقة",
  diamant: "الباقة الماسية",
  royale: "باقة رويال",
};

type Invitation = {
  id: string;
  plan: string;
  payment: { status: "unpaid" | "pending" | "paid"; amountDT: number; ref?: string };
};

export default function CheckoutEntry() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0F0206]" />}>
      <Checkout />
    </Suspense>
  );
}

function Checkout() {
  const params = useParams();
  const qs = useSearchParams();
  const id = params?.id as string;
  const token = qs?.get("t") ?? "";

  const [inv, setInv] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  const d17 = D17_NUMBER;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/invitations/${id}`);
        if (!res.ok) throw new Error("Invitation introuvable");
        const data = await res.json();
        if (!cancelled) setInv(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Chargement impossible");
      } finally {
        if (!cancelled) {
          setOrigin(window.location.origin);
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const declarePayment = async () => {
    if (sending || ref.trim().length < 4) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/invitations/${id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editToken: token, ref: ref.trim(), method: "d17", phone: phone.trim() }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || `Erreur ${res.status}`);
      setInv(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg,#1C050B,#0F0206)" }}>
        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
      </main>
    );
  }

  if (!inv) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: "linear-gradient(180deg,#1C050B,#0F0206)" }}>
        <p className="text-[#F4E4BA]">{error ?? "الدعوة غير موجودة"}</p>
      </main>
    );
  }

  const status = inv.payment.status;

  return (
    <main dir="rtl" className="min-h-screen p-6 flex items-center justify-center" style={{ background: "linear-gradient(180deg,#1C050B,#0F0206)" }}>
      <div className="w-full max-w-md">
        <Link href="/editor" className="inline-flex items-center gap-2 text-xs text-[#F4E4BA]/60 hover:text-[#F4E4BA] mb-6">
          <ArrowLeft size={14} /> الرجوع للمحرّر
        </Link>

        {/* ── Payée : les liens sont délivrés ── */}
        {status === "paid" ? (
          <div className="rounded-3xl border border-emerald-400/40 bg-emerald-950/40 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-emerald-300" />
            </div>
            <h1 className="text-xl font-extrabold text-[#F4E4BA] mb-2">تم تفعيل دعوتك</h1>
            <p className="text-sm text-[#F4E4BA]/70 mb-6">أرسل هذا الرابط لضيوفك</p>

            <div className="flex items-center gap-2">
              <input
                readOnly
                dir="ltr"
                value={`${origin}/i/${inv.id}`}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/25 text-xs text-[#F4E4BA] truncate"
              />
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(`${origin}/i/${inv.id}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#1C050B] text-xs font-extrabold cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "تم" : "نسخ"}
              </button>
            </div>
          </div>
        ) : status === "pending" ? (
          /* ── En attente de vérification ── */
          <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#1C050B]/80 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h1 className="text-xl font-extrabold text-[#F4E4BA] mb-3">وصلنا إشعار الدفع</h1>
            <p className="text-sm text-[#F4E4BA]/70 leading-relaxed mb-2">
              نتحقّق من العملية ونفعّل دعوتك في أقرب وقت. ستشتغل روابطك تلقائياً بعد التفعيل.
            </p>
            <p className="text-[11px] text-[#F4E4BA]/40" dir="ltr">
              Réf : {inv.payment.ref}
            </p>
          </div>
        ) : (
          /* ── À régler ── */
          <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#1C050B]/80 p-7">
            <h1 className="text-xl font-extrabold text-[#F4E4BA] mb-1">إتمام الدفع</h1>
            <p className="text-xs text-[#F4E4BA]/50 mb-6">دفعة واحدة، بدون اشتراك</p>

            <div className="flex items-baseline justify-between rounded-2xl bg-black/30 border border-[#D4AF37]/20 px-5 py-4 mb-6">
              <span className="text-sm text-[#F4E4BA]/80">{PLAN_LABELS[inv.plan] ?? inv.plan}</span>
              <span className="text-3xl font-extrabold text-[#D4AF37]">
                {inv.payment.amountDT} <span className="text-sm">د.ت</span>
              </span>
            </div>

            <ol className="space-y-3 text-sm text-[#F4E4BA]/80 mb-6 list-decimal list-inside">
              <li>
                حوّل المبلغ عبر تطبيق <strong className="text-[#D4AF37]">D17</strong>{" "}
                إلى الرقم <strong className="text-[#F4E4BA]" dir="ltr">{d17}</strong>
              </li>
              <li>انسخ رقم العملية (Référence) من التطبيق</li>
              <li>ألصقه هنا وأرسله لنا</li>
            </ol>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الهاتف (مثال: 55 123 456)"
              type="tel"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-sm text-[#F4E4BA] placeholder-[#F4E4BA]/30 focus:outline-none focus:border-[#D4AF37] mb-3"
            />

            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="رقم العملية (Référence D17)"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-sm text-[#F4E4BA] placeholder-[#F4E4BA]/30 focus:outline-none focus:border-[#D4AF37] mb-3"
            />

            {error && (
              <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2 mb-3">{error}</p>
            )}

            <button
              onClick={declarePayment}
              disabled={sending || ref.trim().length < 4 || phone.trim().length < 4}
              className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#1C050B] font-extrabold text-sm disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              أرسلت الدفع
            </button>

            <p className="text-[11px] text-[#F4E4BA]/35 text-center mt-4 leading-relaxed">
              دعوتك محفوظة. الروابط تُسلَّم بعد تأكيد الدفع.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
