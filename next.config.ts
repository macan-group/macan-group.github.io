import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` for GitHub Pages.
  output: "export",

  // Served from the org root (macan-group.github.io), so no basePath is needed.
  // Emit `/route/index.html` so links resolve without a server.
  trailingSlash: true,

  // GitHub Pages has no image optimization server.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
