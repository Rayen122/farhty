import type { MetadataRoute } from "next";

const SITE_URL = "https://www.farhty.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Les vidéos sont protégées par un contrôle de referer côté serveur :
      // un crawler ne peut de toute façon pas les charger.
      disallow: ["/videos/", "/templates/*/assets/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
