import type { MetadataRoute } from "next";
import { templates } from "./templates/data";

const SITE_URL = "https://www.farhty.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...templates.map((t) => ({
      url: `${SITE_URL}/templates/${t.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
