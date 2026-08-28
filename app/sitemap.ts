import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://macanco.com";

// Single-page site — the Capital / Industrial / Trade views are client-side
// tabs, not separate URLs, so only the root and the prospectus are listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE}/downloads/macan-group-prospectus.html`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
