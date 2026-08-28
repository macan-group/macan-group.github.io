import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/sendmail.php",
    },
    sitemap: "https://macanco.com/sitemap.xml",
    host: "https://macanco.com",
  };
}
