import type { Metadata } from "next";
import { getTemplateBySlug, templates } from "../data";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

/* Pré-rend une page par modèle : les URLs existent pour les crawlers. */
export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return { title: "القالب غير موجود", robots: { index: false, follow: false } };
  }

  const title = `${template.name} · ${template.subtitle}`;
  const url = `/templates/${slug}`;
  const image = template.image ?? "/og.jpg";

  return {
    title,
    description: template.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: template.description,
      images: [{ url: image, alt: template.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: template.description,
      images: [image],
    },
  };
}

export default function TemplateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
