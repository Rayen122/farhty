"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Check, KeyRound, TriangleAlert, X } from "lucide-react";

/* Copié de guestStorage.ts : ce module ne s'importe pas côté client, il
   touche le système de fichiers et la base. */
const isGuestId = (v: unknown): v is string => typeof v === "string" && /^[23456789a-z]{7}$/.test(v);

type Guest = {
  id: string;
  name: string;
  seats?: number;
  status: "pending" | "yes" | "no";
  confirmedSeats?: number;
  checkedInAt?: string;
};

type Result =
  | { kind: "ok"; guest: Guest; already: boolean }
  | { kind: "error"; message: string };

const GOLD = "#D4AF37";
const CREAM = "#F4E4BA";

/** Un lien scanné ressemble à .../i/<inv>?g=<id> : on n'a besoin que du dernier bout */
function extractGuestId(raw: string): string | null {
  const trimmed = raw.trim();
  const asId = trimmed.match(/[a-z0-9]{7}$/i)?.[0]?.toLowerCase();
  if (asId && isGuestId(asId)) return asId;
  try {
    const url = new URL(trimmed);
    const g = url.searchParams.get("g");
    if (g && isGuestId(g)) return g;
  } catch {
    /* pas une URL — c'était déjà tenté ci-dessus comme code brut */
  }
  return null;
}

/**
 * Scanner d'entrée — Pack Royale.
 *
 * Tenu par quelqu'un à la porte, pas par les mariés : le lien porte leur
 * jeton de gestion, donc il se partage avec la personne à l'accueil pour
 * la soirée, comme un badge temporaire.
 *
 * Caméra quand le navigateur la supporte (BarcodeDetector), sinon saisie du
 * code à la main — le même code court que le lien nominatif de l'invité.
 */
export default function CheckinScanner() {
  const params = useSearchParams();
  const invitationId = params?.get("inv") ?? "";
  const editToken = params?.get("t") ?? "";
  const ready = Boolean(invitationId && editToken);

  const [manualCode, setManualCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [planOk, setPlanOk] = useState<boolean | null>(null);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScannedRef = useRef<{ id: string; at: number } | null>(null);
  const busyRef = useRef(false);

  /* Confirme que la formule autorise le check-in, une fois au chargement. */
  useEffect(() => {
    if (!ready) return;
    fetch(`/api/invitations/${invitationId}/guests`, { headers: { "x-edit-token": editToken } })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { plan?: string }) => setPlanOk(data.plan === "royale"))
      .catch(() => setPlanOk(false));
  }, [ready, invitationId, editToken]);

  useEffect(() => {
    setCameraSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  const submitGuestId = useCallback(
    async (guestId: string) => {
      if (busyRef.current) return;
      /* Anti-rebond : la même carte reste dans le champ de la caméra plusieurs
         images de suite, ça ne doit pas déclencher dix requêtes. */
      const now = Date.now();
      if (lastScannedRef.current?.id === guestId && now - lastScannedRef.current.at < 4000) return;
      lastScannedRef.current = { id: guestId, at: now };

      busyRef.current = true;
      setBusy(true);
      setResult(null);
      try {
        const res = await fetch(`/api/invitations/${invitationId}/guests`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-edit-token": editToken },
          body: JSON.stringify({ action: "checkin", guestId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setResult({ kind: "error", message: data.error ?? `Erreur ${res.status}` });
        } else {
          setResult({ kind: "ok", guest: data.guest, already: data.alreadyCheckedIn });
        }
      } catch {
        setResult({ kind: "error", message: "الاتصال انقطع. عاود جرّب." });
      } finally {
        setBusy(false);
        busyRef.current = false;
      }
    },
    [invitationId, editToken]
  );

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Detector = (window as any).BarcodeDetector;
      const detector = new Detector({ formats: ["qr_code"] });

      const tick = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        try {
          const codes = await detector.detect(videoRef.current);
          const raw = codes[0]?.rawValue as string | undefined;
          const guestId = raw ? extractGuestId(raw) : null;
          if (guestId) submitGuestId(guestId);
        } catch {
          /* une image ratée ne doit pas arrêter le flux */
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setCameraError("ما نجّمناش نحلّو الكاميرا. أعطي الإذن ولا استعمل الكود يدويًا.");
      setCameraOn(false);
    }
  }, [submitGuestId]);

  useEffect(() => stopCamera, [stopCamera]);

  const onManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guestId = extractGuestId(manualCode);
    if (!guestId) return;
    lastScannedRef.current = null; // saisie volontaire : jamais de rebond
    submitGuestId(guestId);
    setManualCode("");
  };

  if (!ready) {
    return (
      <Screen>
        <p style={{ color: "#F0999B" }}>Lien incomplet : il manque l&apos;invitation ou le jeton.</p>
      </Screen>
    );
  }

  if (planOk === false) {
    return (
      <Screen>
        <TriangleAlert size={28} style={{ color: GOLD }} />
        <p style={{ color: CREAM }} className="text-sm text-center mt-3">
          Le check-in à l&apos;entrée est réservé au Pack Royale.
        </p>
      </Screen>
    );
  }

  return (
    <Screen>
      <h1 className="text-lg font-extrabold mb-1" style={{ color: CREAM }}>
        استقبال الضيوف
      </h1>
      <p className="text-xs mb-6 text-center" style={{ color: `${CREAM}66` }}>
        صوّرو الـ QR متاع كل عائلة، ولا اكتبو الكود يدويًا
      </p>

      {result && (
        <div
          className="w-full max-w-sm rounded-2xl p-5 mb-5 flex flex-col items-center gap-2 text-center"
          style={{
            background: result.kind === "ok" ? (result.already ? "#3A2A0D" : "#0D3A22") : "#3A0D14",
            border: `1px solid ${result.kind === "ok" ? (result.already ? "#D4AF37" : "#5FCF9B") : "#F0999B"}66`,
          }}
        >
          {result.kind === "ok" ? (
            <>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: result.already ? "#D4AF3722" : "#5FCF9B22" }}
              >
                {result.already ? (
                  <TriangleAlert size={22} style={{ color: GOLD }} />
                ) : (
                  <Check size={22} style={{ color: "#5FCF9B" }} />
                )}
              </div>
              <p className="font-extrabold text-base" style={{ color: CREAM }}>
                {result.guest.name}
              </p>
              <p className="text-xs" style={{ color: `${CREAM}99` }}>
                {result.already
                  ? "دخلت من قبل"
                  : `دخلت الآن · ${result.guest.confirmedSeats ?? result.guest.seats ?? 1} أشخاص`}
              </p>
            </>
          ) : (
            <>
              <X size={22} style={{ color: "#F0999B" }} />
              <p className="text-sm" style={{ color: "#F0999B" }}>
                {result.message}
              </p>
            </>
          )}
        </div>
      )}

      {cameraSupported && (
        <div className="w-full max-w-sm mb-5">
          {cameraOn ? (
            <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: `${GOLD}44` }}>
              <video ref={videoRef} className="w-full aspect-square object-cover" muted playsInline />
              <button
                onClick={stopCamera}
                className="absolute top-2 left-2 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer"
                style={{ background: "rgba(0,0,0,0.5)", color: CREAM }}
              >
                وقف الكاميرا
              </button>
            </div>
          ) : (
            <button
              onClick={startCamera}
              className="w-full py-3.5 rounded-full text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2"
              style={{ background: GOLD, color: "#1C050B" }}
            >
              <Camera size={16} /> حلّ الكاميرا
            </button>
          )}
          {cameraError && (
            <p className="text-xs mt-2 text-center" style={{ color: "#F0999B" }}>
              {cameraError}
            </p>
          )}
        </div>
      )}

      <form onSubmit={onManualSubmit} className="w-full max-w-sm flex flex-col gap-2">
        <label className="text-[11px] flex items-center gap-1.5" style={{ color: `${CREAM}66` }}>
          <KeyRound size={12} /> ولا اكتب الكود يدويًا
        </label>
        <div className="flex gap-2">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="ex: k7m2p9q"
            dir="ltr"
            className="flex-1 px-4 py-3 rounded-xl text-sm text-center focus:outline-none"
            style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${GOLD}44`, color: CREAM }}
          />
          <button
            type="submit"
            disabled={busy || !manualCode.trim()}
            className="px-5 rounded-xl text-sm font-extrabold disabled:opacity-40 cursor-pointer"
            style={{ background: GOLD, color: "#1C050B" }}
          >
            دخل
          </button>
        </div>
      </form>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen flex flex-col items-center p-6 pt-16"
      style={{ background: "#0F0206" }}
      dir="rtl"
    >
      {children}
    </main>
  );
}
