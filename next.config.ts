import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` — uploaded as-is to cPanel (public_html).
  output: "export",

  // Served from a domain root, so no basePath is needed.
  // Emit `/route/index.html` so URLs resolve on plain Apache with no rewrites.
  trailingSlash: true,

  // Shared hosting has no image optimization server.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
