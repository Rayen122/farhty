"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Smartphone, Tablet, RotateCcw, Check, Share2, Edit3, Eye, Music, Volume2, VolumeX } from "lucide-react";
import { templates, getTemplateBySlug } from "../templates/data";
import { useInvitationStore, subscribeToDraftAcrossFrames, PLAN_OPTIONS } from "../lib/invitationStore";
import { MUSIC_PRESETS } from "../lib/musicPresets";

type Device = "mobile" | "tablet";
const SIZES: Record<Device, { w: number; h: number }> = {
  mobile: { w: 390, h: 844 },
  tablet: { w: 820, h: 1180 },
};

/* ── Champs de formulaire ── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-white/70 text-sm text-[#2C1E14] " +
    "placeholder-[#2C1E14]/35 focus:outline-none focus:border-[#8B0A1A] focus:bg-white transition-colors";
  return (
    <label className="block">
      <span className="block text-[11px] font-bold tracking-wide text-[#8B0A1A] mb-1.5">{label}</span>
      {textarea ? (
        <textarea rows={3} className={cls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" className={cls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

/**
 * Extrait un point GPS d'un lien Google Maps collé.
 * Gère les formes courantes : `@36.86,10.34,17z`, `?q=36.86,10.34`, `!3d36.86!4d10.34`,
 * et le texte brut « 36.86, 10.34 ». Renvoie null si rien d'exploitable.
 */
export function parseLatLng(input: string): { lat: number; lng: number } | null {
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/,
  ];
  for (const re of patterns) {
    const m = input.match(re);
    if (!m) continue;
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}

/* Une ligne « libellé + lien + copier » */
function LinkRow({
  label,
  url,
  copied,
  onCopy,
  secret,
}: {
  label: string;
  url: string;
  copied: boolean;
  onCopy: () => void;
  secret?: boolean;
}) {
  return (
    <div>
      <p className={`text-[10px] mb-1 ${secret ? "text-[#F5B942]" : "text-[#F4E4BA]/60"}`}>{label}</p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          dir="ltr"
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-black/40 border border-[#D4AF37]/25 text-[11px] text-[#F4E4BA] truncate"
        />
        <button
          onClick={onCopy}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#8B0A1A] text-[#F4E4BA] text-[11px] font-bold hover:opacity-90 cursor-pointer flex items-center gap-1"
        >
          {copied ? <Check size={12} /> : null}
          {copied ? "تم" : "نسخ"}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mt-8 mb-3 first:mt-0">
      <h2 className="text-sm font-extrabold text-[#2C1E14]">{children}</h2>
      {action}
    </div>
  );
}

export default function EditorPage() {
  const { slug, draft, geo, setGeo, layout, resetLayout, plan, setPlan, initFrom, setField, updateStory, addStory, removeStory, updateProgram, addProgram, removeProgram, addPhoto, removePhoto, setMusic, reset } =
    useInvitationStore();

  const [geoInput, setGeoInput] = useState("");

  const [geoResolving, setGeoResolving] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  /* On accepte le lien tel quel. Les liens courts (bouton « Partager » sur mobile)
     ne contiennent pas les coordonnées : on les fait résoudre par le serveur. */
  const handleGeoInput = async (value: string) => {
    setGeoInput(value);
    setGeoError(null);

    const parsed = parseLatLng(value);
    if (parsed) {
      setGeo(parsed);
      return;
    }
    if (!value.trim()) {
      setGeo(null);
      return;
    }
    if (!/^https:\/\/(maps\.app\.goo\.gl|goo\.gl|maps\.google\.com|www\.google\.com)\//.test(value.trim())) return;

    setGeoResolving(true);
    try {
      const res = await fetch("/api/resolve-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Lien non résolu");
      setGeo({ lat: body.lat, lng: body.lng });
    } catch (e) {
      setGeoError(e instanceof Error ? e.message : "Lien non résolu");
    } finally {
      setGeoResolving(false);
    }
  };

  const [device, setDevice] = useState<Device>("mobile");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [published, setPublished] = useState<{ id: string; editToken: string } | null>(null);
  const [paid, setPaid] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  /* L'aperçu garde la taille réelle de l'appareil et se met à l'échelle pour tenir dans le cadre */
  useLayoutEffect(() => {
    const compute = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const { w, h } = SIZES[device];
      const availW = Math.max(280, stage.clientWidth - 16);
      const availH = Math.max(320, stage.clientHeight - 16);
      setScale(Math.min(1, availW / w, availH / h));
    };
    compute();
    const timer = setTimeout(compute, 80);
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", compute);
    };
  }, [device, hydrated, slug, mobileTab]);

  /* Initialiseur paresseux plutôt qu'un setState dans un effet.
     Pas de risque d'écart serveur/client : rien n'est affiché tant que `hydrated` est faux. */
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));

  /* Le store est persisté : on attend la réhydratation pour éviter un écart serveur/client,
     puis on recharge éventuellement l'invitation ciblée par le lien de modification. */
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await useInvitationStore.persist.rehydrate();

      const qs = new URLSearchParams(window.location.search);
      const inv = qs.get("inv");
      const token = qs.get("t");
      const tSlug = qs.get("slug") || qs.get("template");
      const qPlan = qs.get("plan");

      if (inv && token) {
        try {
          const res = await fetch(`/api/invitations/${inv}`);
          if (!res.ok) throw new Error("Invitation introuvable");
          const rec = await res.json();
          if (cancelled) return;
          useInvitationStore.setState({ slug: rec.slug, draft: rec.draft, geo: rec.geo ?? null, layout: rec.layout ?? null, plan: rec.plan ?? "elegante" });
          if (rec.geo) setGeoInput(`${rec.geo.lat}, ${rec.geo.lng}`);
          setPublished({ id: inv, editToken: token });
          setPaid(rec.payment?.status === "paid");
        } catch (e) {
          if (!cancelled) setSaveError(e instanceof Error ? e.message : "Chargement impossible");
        }
      } else if (tSlug) {
        const tObj = getTemplateBySlug(tSlug);
        if (tObj) {
          useInvitationStore.getState().initFrom(tObj.slug, tObj.previewText);
        }
      } else {
        const currentSlug = useInvitationStore.getState().slug;
        if (!currentSlug) {
          const defaultT = getTemplateBySlug("lella-beya") || templates[0];
          if (defaultT) {
            useInvitationStore.getState().initFrom(defaultT.slug, defaultT.previewText);
          }
        }
      }

      if (qPlan && ["elegante", "diamant", "royale"].includes(qPlan)) {
        useInvitationStore.getState().setPlan(qPlan as any);
      }

      if (!cancelled) setHydrated(true);
    };

    boot();

    /* Le glissement des blocs se fait DANS l'iframe, donc dans un autre store.
       Sans cet abonnement, le parent publierait un placement périmé. */
    const unsubscribe = subscribeToDraftAcrossFrames();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const activeTemplate = useMemo(() => (slug ? getTemplateBySlug(slug) : undefined), [slug]);

  const previewSrc = slug ? `/templates/${slug}?embed=1&draft=1` : null;

  /* Les modifications sont écrites dans localStorage ; l'iframe (autre document,
     même origine) les reçoit via l'événement `storage` et se met à jour seule. */

  const handlePickTemplate = (s: string) => {
    const t = getTemplateBySlug(s);
    if (t) initFrom(s, t.previewText);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const [testingPresetId, setTestingPresetId] = useState<string | null>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleTestAudio = (id: string, url: string) => {
    if (testingPresetId === id) {
      testAudioRef.current?.pause();
      setTestingPresetId(null);
    } else {
      if (testAudioRef.current) testAudioRef.current.pause();
      const a = new Audio(url);
      a.play().catch(() => {});
      testAudioRef.current = a;
      setTestingPresetId(id);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMusic(event.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  /* Publication : crée l'invitation côté serveur, puis met à jour la même à chaque nouvel envoi */
  const handlePublish = async () => {
    if (!slug || !draft || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = published
        ? await fetch(`/api/invitations/${published.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editToken: published.editToken, slug, draft, geo, layout, plan }),
          })
        : await fetch("/api/invitations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, draft, geo, layout, plan }),
          });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }));
        throw new Error(error || `Erreur ${res.status}`);
      }

      if (!published) {
        const created = await res.json();
        setPublished(created);
        /* Le client vient de valider son invitation : on l'emmène payer tout de suite. */
        window.location.href = `/checkout/${created.id}?t=${created.editToken}`;
        return;
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  const copy = async (text: string, which: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-[#FAF4EB]" />;
  }

  /* ── Étape 1 : choisir un modèle ── */
  if (!slug || !draft) {
    return (
      <main className="min-h-screen bg-[#FAF4EB] p-6 sm:p-10" dir="rtl">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#8B0A1A] mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft size={16} /> الرجوع إلى الرئيسية
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1E14] mb-3">اختر القالب وابدأ التعديل فوراً</h1>
          <p className="text-[#2C1E14]/70 mb-10 text-base font-semibold">انتقِ التصميم المناسب لتعديل الأسماء، التواريخ، والمكان مباشرة مع معاينة تفاعلية حية.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((t) => (
              <div
                key={t.slug}
                onClick={() => handlePickTemplate(t.slug)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#D4AF37]/30 hover:border-[#8B0A1A] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-[320px]"
              >
                <div className="relative w-full h-[200px] overflow-hidden bg-black">
                  <img
                    src={t.image || "/site/tpl/classic-cover.jpg"}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/site/tpl/royal-cover.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                    {t.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-[#2C1E14] text-base mb-1" style={{ fontFamily: "var(--font-amiri)" }}>
                      {t.name}
                    </h3>
                    <p className="text-xs text-[#2C1E14]/60 line-clamp-1 font-medium">{t.subtitle}</p>
                  </div>
                  <button className="w-full mt-3 py-2 px-3 bg-[#8B0A1A] group-hover:bg-[#660511] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    تعديل هذا القالب ✨
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ── Étape 2 : éditer ── */
  return (
    <main className="min-h-screen bg-[#FAF4EB] lg:h-screen lg:overflow-hidden relative" dir="rtl">
      {/* Mobile Tab Navigation Bar (Mobile Only) */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#1C050B] border-b border-[#D4AF37]/30 p-2.5 flex items-center justify-center gap-2 shadow-xl">
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileTab === "edit"
              ? "bg-[#8B0A1A] text-[#F4E4BA] shadow-md border border-[#D4AF37]/40"
              : "text-[#F4E4BA]/60 hover:text-[#F4E4BA]"
          }`}
        >
          <Edit3 size={15} />
          <span>تعديل البيانات</span>
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileTab === "preview"
              ? "bg-[#D4AF37] text-[#1C050B] shadow-md font-black"
              : "text-[#F4E4BA]/60 hover:text-[#F4E4BA]"
          }`}
        >
          <Eye size={15} />
          <span>المعاينة الحية ✨</span>
        </button>
      </div>

      <div className="lg:flex lg:h-full">
        {/* ══ Formulaire ══ */}
        <div className={`lg:w-[420px] lg:shrink-0 lg:h-full lg:overflow-y-auto border-l border-[#D4AF37]/20 bg-white/40 ${mobileTab === "edit" ? "block" : "hidden lg:block"}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Link href="/#modeles" className="inline-flex items-center gap-2 text-sm text-[#8B0A1A] hover:opacity-70">
                <ArrowLeft size={16} /> الرجوع
              </Link>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-[#2C1E14]/50 hover:text-[#8B0A1A] cursor-pointer"
              >
                <RotateCcw size={13} /> تغيير القالب
              </button>
            </div>

            <p className="text-[11px] text-[#2C1E14]/45 mb-1">القالب المختار</p>
            <h1 className="text-xl font-extrabold text-[#2C1E14] mb-6">{activeTemplate?.name}</h1>

            <SectionTitle>العروسان والعبارة الافتتاحية</SectionTitle>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="اسم العروس" value={draft.bride} onChange={(v) => setField("bride", v)} placeholder="مريم" />
                <Field label="اسم العريس" value={draft.groom} onChange={(v) => setField("groom", v)} placeholder="أنس" />
              </div>
              <Field
                label="الآية القرآنية / العبارة الافتتاحية"
                value={draft.quranVerse ?? "« وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً »"}
                onChange={(v) => setField("quranVerse", v)}
                textarea
                placeholder="أدخل الآية القرآنية أو النص الافتتاحي المفضل لديك..."
              />
            </div>

            <SectionTitle>إظهار وإخفاء أقسام الدعوة</SectionTitle>
            <div className="space-y-2 mb-6">
              {/* Toggle Quran */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#D4AF37]/20 bg-white/60">
                <span className="text-xs font-bold text-[#2C1E14]">الآية القرآنية / المقدمة</span>
                <button
                  type="button"
                  onClick={() => setField("hideQuran", !draft.hideQuran)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !draft.hideQuran
                      ? "bg-emerald-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {!draft.hideQuran ? "مفعل (ظاهر)" : "مخفي"}
                </button>
              </div>

              {/* Toggle RSVP */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#D4AF37]/20 bg-white/60">
                <span className="text-xs font-bold text-[#2C1E14]">تأكيد الحضور (RSVP)</span>
                <button
                  type="button"
                  onClick={() => setField("hideRsvp", !draft.hideRsvp)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !draft.hideRsvp
                      ? "bg-emerald-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {!draft.hideRsvp ? "مفعل (ظاهر)" : "مخفي"}
                </button>
              </div>

              {/* Toggle Wishes */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#D4AF37]/20 bg-white/60">
                <span className="text-xs font-bold text-[#2C1E14]">جدار التهاني والتبريكات</span>
                <button
                  type="button"
                  onClick={() => setField("hideWishes", !draft.hideWishes)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !draft.hideWishes
                      ? "bg-emerald-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {!draft.hideWishes ? "مفعل (ظاهر)" : "مخفي"}
                </button>
              </div>
            </div>

            <SectionTitle>الموعد والمكان</SectionTitle>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="التاريخ" value={draft.date} onChange={(v) => setField("date", v)} placeholder="15 نوفمبر 2026" />
                <Field label="الوقت" value={draft.time} onChange={(v) => setField("time", v)} placeholder="19h30" />
              </div>
              <Field label="القاعة" value={draft.lieu} onChange={(v) => setField("lieu", v)} placeholder="قصر المخطوطات" />
              <Field label="المدينة" value={draft.city} onChange={(v) => setField("city", v)} placeholder="سيدي بوسعيد" />
            </div>

            <SectionTitle>الباقة</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {PLAN_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  aria-pressed={plan === p.id}
                  disabled={paid}
                  className={`py-3 rounded-xl border text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan === p.id
                      ? "border-[#8B0A1A] bg-[#8B0A1A]/10"
                      : "border-[#D4AF37]/30 bg-white/60 hover:border-[#8B0A1A]/50 cursor-pointer"
                  }`}
                >
                  <span className="block text-[11px] font-bold text-[#2C1E14]">{p.label}</span>
                  <span className="block text-sm font-extrabold text-[#8B0A1A] mt-0.5">{p.amountDT} د.ت</span>
                </button>
              ))}
            </div>
            {paid && (
              <p className="text-[10px] text-[#2C1E14]/45 mt-2">الباقة غير قابلة للتغيير بعد الدفع.</p>
            )}

            <SectionTitle>موقع القاعة على الخريطة</SectionTitle>
            <div className="space-y-2">
              <Field
                label="ألصق رابط Google Maps"
                value={geoInput}
                onChange={handleGeoInput}
                placeholder="https://maps.google.com/…@36.8688,10.3417,17z"
              />
              {geo ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300/60">
                  <span className="text-[11px] text-emerald-800" dir="ltr">
                    📍 {geo.lat.toFixed(5)}, {geo.lng.toFixed(5)}
                  </span>
                  <button
                    onClick={() => {
                      setGeo(null);
                      setGeoInput("");
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:opacity-70 cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              ) : geoResolving ? (
                <p className="text-[10px] text-[#8B0A1A]">جارٍ قراءة الرابط…</p>
              ) : geoError ? (
                <p className="text-[10px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">{geoError}</p>
              ) : (
                <p className="text-[10px] text-[#2C1E14]/45 leading-relaxed">
                  افتح القاعة في Google Maps واضغط « مشاركة »، ثم ألصق الرابط هنا.
                  بدون هذا، الخريطة تبحث بالاسم فقط وقد لا تكون دقيقة.
                </p>
              )}
            </div>

            <SectionTitle
              action={
                <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B0A1A] hover:opacity-75 cursor-pointer bg-[#8B0A1A]/10 px-2.5 py-1 rounded-lg border border-[#8B0A1A]/20 transition-all">
                  <Plus size={13} /> إضافة صور
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              }
            >
              معرض صور العروسين
            </SectionTitle>

            {draft.photos && draft.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {draft.photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#D4AF37]/30 group shadow-sm bg-black/5">
                    <img src={photo} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      title="حذف الصورة"
                      className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#D4AF37]/40 bg-white/40 text-center mb-6">
                <p className="text-xs text-[#2C1E14]/50 mb-2 font-medium">لم يتم إضافة أي صور بعد</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B0A1A] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
                  <Plus size={13} /> اختر صوراً من جهازك
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            )}

            {/* ── SECTION MUSIQUE DE FOND ── */}
            <SectionTitle
              action={
                <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B0A1A] hover:opacity-75 cursor-pointer bg-[#8B0A1A]/10 px-2.5 py-1 rounded-lg border border-[#8B0A1A]/20 transition-all">
                  <Plus size={13} /> مقطع خاص (.mp3)
                  <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                </label>
              }
            >
              الخلفية الموسيقية
            </SectionTitle>

            <div className="space-y-2 mb-6">
              {/* Option بدون موسيقى */}
              <div
                onClick={() => setMusic(undefined, undefined)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  !draft.musicUrl
                    ? "bg-[#8B0A1A]/10 border-[#8B0A1A] text-[#8B0A1A] font-bold"
                    : "bg-white/60 border-[#D4AF37]/20 text-[#2C1E14]/70 hover:border-[#D4AF37]/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <VolumeX className="w-4 h-4 text-red-700" />
                  <span className="text-xs">بدون موسيقى (صامت)</span>
                </div>
                {!draft.musicUrl && <Check size={14} className="text-[#8B0A1A]" />}
              </div>

              {/* Presets list */}
              {MUSIC_PRESETS.map((preset) => {
                const isSelected = draft.musicUrl === preset.url;
                const isTesting = testingPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#2C1E14] font-bold shadow-sm"
                        : "bg-white/60 border-[#D4AF37]/20 text-[#2C1E14]/70 hover:border-[#D4AF37]/50"
                    }`}
                  >
                    <div
                      className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                      onClick={() => setMusic(preset.url, preset.name)}
                    >
                      <Music className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#8B0A1A]" : "text-[#D4AF37]"}`} />
                      <div className="min-w-0">
                        <p className="text-xs truncate">{preset.name}</p>
                        <p className="text-[10px] text-[#2C1E14]/50 truncate">{preset.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Button Test Sound */}
                      <button
                        type="button"
                        onClick={() => toggleTestAudio(preset.id, preset.url)}
                        className={`p-1.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isTesting
                            ? "bg-[#8B0A1A] text-white border-[#8B0A1A]"
                            : "bg-white/80 text-[#2C1E14] border-[#D4AF37]/30 hover:bg-white"
                        }`}
                        title="استماع للمقطع"
                      >
                        {isTesting ? <Volume2 className="w-3 h-3 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isTesting ? "إيقاف" : "استماع"}</span>
                      </button>

                      {/* Selection indicator */}
                      <button
                        type="button"
                        onClick={() => setMusic(preset.url, preset.name)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                          isSelected ? "bg-[#8B0A1A] border-[#8B0A1A] text-white" : "border-[#D4AF37]/40"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionTitle
              action={
                <button
                  onClick={addStory}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B0A1A] hover:opacity-70 cursor-pointer"
                >
                  <Plus size={13} /> إضافة
                </button>
              }
            >
              قصتنا
            </SectionTitle>
            <div className="space-y-4">
              {draft.story.map((s, i) => (
                <div key={i} className="p-3 rounded-xl border border-[#D4AF37]/20 bg-white/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2C1E14]/40">فقرة {i + 1}</span>
                    <button
                      onClick={() => removeStory(i)}
                      aria-label="حذف الفقرة"
                      className="text-[#2C1E14]/30 hover:text-[#8B0A1A] cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <Field label="العنوان" value={s.title} onChange={(v) => updateStory(i, { title: v })} />
                  <Field label="النص" value={s.text} onChange={(v) => updateStory(i, { text: v })} textarea />
                </div>
              ))}
            </div>

            <SectionTitle
              action={
                <button
                  onClick={addProgram}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B0A1A] hover:opacity-70 cursor-pointer"
                >
                  <Plus size={13} /> إضافة
                </button>
              }
            >
              البرنامج
            </SectionTitle>
            <div className="space-y-4 pb-16">
              {draft.program.map((p, i) => (
                <div key={i} className="p-3 rounded-xl border border-[#D4AF37]/20 bg-white/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2C1E14]/40">فقرة {i + 1}</span>
                    <button
                      onClick={() => removeProgram(i)}
                      aria-label="حذف الفقرة"
                      className="text-[#2C1E14]/30 hover:text-[#8B0A1A] cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-[90px_1fr] gap-2.5">
                    <Field label="الساعة" value={p.time} onChange={(v) => updateProgram(i, { time: v })} placeholder="19:00" />
                    <Field label="العنوان" value={p.title} onChange={(v) => updateProgram(i, { title: v })} />
                  </div>
                  <Field label="الوصف" value={p.desc} onChange={(v) => updateProgram(i, { desc: v })} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ Aperçu ══ */}
        <div
          className={`flex-1 lg:h-full flex-col items-center justify-center gap-5 p-4 sm:p-6 ${
            mobileTab === "preview" ? "flex min-h-[calc(100vh-60px)]" : "hidden lg:flex"
          }`}
          style={{ background: "radial-gradient(circle at 50% 35%, #2D0B14 0%, #17040A 60%, #0A0104 100%)" }}
        >
          <div className="flex items-center gap-2 bg-[#1C050B]/90 border border-[#D4AF37]/40 rounded-full px-3 py-1.5 shadow-md">
            {(["mobile", "tablet"] as Device[]).map((d) => {
              const Icon = d === "mobile" ? Smartphone : Tablet;
              return (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  aria-pressed={device === d}
                  aria-label={d === "mobile" ? "معاينة الهاتف" : "معاينة الجهاز اللوحي"}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    device === d ? "bg-[#8B0A1A] text-[#F4E4BA]" : "text-[#F4E4BA]/60 hover:bg-white/10"
                  }`}
                >
                  <Icon size={14} />
                  <span>{d === "mobile" ? "هاتف" : "لوحي"}</span>
                </button>
              );
            })}

            <span className="w-px h-5 bg-[#D4AF37]/30 mx-1" aria-hidden />

            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold bg-[#D4AF37] text-[#1C050B] hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Share2 size={14} />
              <span>{saving ? "جارٍ الحفظ…" : published ? "تحديث الدعوة" : "المتابعة للدفع"}</span>
            </button>
          </div>

          {saveError && (
            <p className="text-xs text-red-300 bg-red-950/50 border border-red-500/30 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          {published && (
            <div className="w-full max-w-md space-y-3 bg-[#1C050B]/80 border border-[#D4AF37]/30 rounded-2xl p-4">
              {paid ? (
                <LinkRow
                  label="رابط الضيوف — أرسله للمدعوين"
                  url={`${origin}/i/${published.id}`}
                  copied={copied === "public"}
                  onCopy={() => copy(`${origin}/i/${published.id}`, "public")}
                />
              ) : (
                <a
                  href={`/checkout/${published.id}?t=${published.editToken}`}
                  className="block w-full text-center py-3 rounded-xl bg-[#D4AF37] text-[#1C050B] text-sm font-extrabold hover:opacity-90 shadow-md"
                >
                  إتمام الدفع للحصول على رابط الضيوف
                </a>
              )}

              <LinkRow
                label="رابط التعديل — احتفظ به لنفسك"
                url={`${origin}/editor?inv=${published.id}&t=${published.editToken}`}
                copied={copied === "edit"}
                onCopy={() => copy(`${origin}/editor?inv=${published.id}&t=${published.editToken}`, "edit")}
                secret
              />
            </div>
          )}

          {previewSrc && (
            <div ref={stageRef} className="flex-1 w-full flex items-center justify-center min-h-0 py-2">
              <div
                className="rounded-[2rem] overflow-hidden bg-black border-2 border-[#D4AF37]/40 shadow-2xl shrink-0"
                style={{
                  width: SIZES[device].w,
                  height: SIZES[device].h,
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
              >
                <iframe
                  key={device}
                  src={previewSrc}
                  title="معاينة الدعوة"
                  allow="autoplay"
                  className="border-0 block"
                  style={{ width: SIZES[device].w, height: SIZES[device].h }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <p className="text-[11px] text-[#F4E4BA]/40">
              اسحب النصوص فوق البطاقة لتغيير مكانها
            </p>
            {layout && (
              <button
                onClick={resetLayout}
                className="text-[11px] font-bold text-[#F4E4BA]/70 hover:text-[#F4E4BA] underline cursor-pointer"
              >
                إرجاع الترتيب الأصلي
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Live Preview Pill on Mobile when in edit mode */}
      {mobileTab === "edit" && (
        <button
          onClick={() => setMobileTab("preview")}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3.5 rounded-full bg-[#D4AF37] text-[#1C050B] font-extrabold text-xs shadow-[0_10px_25px_rgba(212,175,55,0.4)] flex items-center gap-2 border-2 border-white cursor-pointer"
        >
          <Eye size={16} />
          <span>شاهد المعاينة الحية ✨</span>
        </button>
      )}
    </main>
  );
}
