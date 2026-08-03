import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storage } from "../../lib/invitationStorage";
import { getTemplateBySlug } from "../../templates/data";
import { SavedInvitationView } from "../../templates/[slug]/page";

export const runtime = "nodejs";
/* Le marié peut modifier son invitation à tout moment : jamais de cache */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function loadInvitation(id: string) {
  const record = await storage.get(id).catch(() => null);
  if (!record) return null;
  const template = getTemplateBySlug(record.slug);
  if (!template) return null;
  return { record, template };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await loadInvitation(id);
  if (!found) return { title: "دعوة غير موجودة · فرحتي" };

  /* Tant que ce n'est pas réglé, rien ne doit filtrer : le titre et l'aperçu
     Open Graph révéleraient les noms des mariés dans WhatsApp sans que
     l'invitation soit accessible. */
  if (found.record.payment.status !== "paid") {
    return { title: "دعوة غير مفعّلة · فرحتي", robots: { index: false, follow: false } };
  }

  const { bride, groom, date, city } = found.record.draft;
  const title = `${bride} & ${groom} — دعوة زفاف`;
  const description = `${date} · ${city}`;

  return {
    title,
    description,
    openGraph: { title, description, images: found.template.image ? [found.template.image] : undefined },
    /* Une invitation privée n'a rien à faire dans Google */
    robots: { index: false, follow: false },
  };
}

export default async function PublicInvitationPage({ params }: Props) {
  const { id } = await params;
  const found = await loadInvitation(id);
  if (!found) notFound();

  /* Tant que la formule n'est pas réglée, l'invitation n'est pas diffusable :
     on ne rend jamais son contenu, même si quelqu'un devine l'identifiant. */
  if (found.record.payment.status !== "paid") {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center p-6 text-center"
        style={{ background: "linear-gradient(180deg,#1C050B,#0F0206)" }}
      >
        <div className="max-w-sm">
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#F4E4BA] mb-3">هذه الدعوة غير مفعّلة بعد</h1>
          <p className="text-sm text-[#F4E4BA]/60 leading-relaxed">
            صاحب الدعوة لم يُكمل الدفع. بمجرد تفعيلها سيعمل هذا الرابط تلقائياً.
          </p>
        </div>
      </main>
    );
  }

  return <SavedInvitationView slug={found.record.slug} saved={{ draft: found.record.draft, geo: found.record.geo, layout: found.record.layout }} />;
}
