import type { MetadataRoute } from "next";
import { templates } from "./templates/data";
import { SITE_URL, REFERRAL_PATH } from "./lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      /* Page d'atterrissage du parrainage : elle reçoit des liens depuis toutes
         les invitations envoyées, autant qu'elle soit indexée. */
      url: `${SITE_URL}${REFERRAL_PATH}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...templates.map((t) => ({
      url: `${SITE_URL}/templates/${t.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
