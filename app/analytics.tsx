import Script from "next/script";

/**
 * Privacy-friendly, provider-agnostic analytics loader.
 *
 * It injects a single external script only when NEXT_PUBLIC_ANALYTICS_SRC is set
 * at build time, so the site ships with zero tracking until you opt in.
 * Works with Plausible, Umami, Cloudflare Web Analytics, GoatCounter, etc.
 *
 * Configure in `.env.local` (see .env.example), then rebuild:
 *   NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js
 *   NEXT_PUBLIC_ANALYTICS_DOMAIN=macanco.com
 */
export default function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!src) return null;

  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const websiteId = process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID;

  return (
    <Script
      src={src}
      strategy="afterInteractive"
      data-domain={domain}
      data-website-id={websiteId}
    />
  );
}
