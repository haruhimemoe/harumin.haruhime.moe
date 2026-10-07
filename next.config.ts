/**
 * @file next.config.ts
 * @desc Next.js config: MDX page extensions (the legal pages, with ui's remark plugin), strict
 *       mode, no X-Powered-By, unoptimized images (Discord's and osu!'s CDNs size their own),
 *       the legal pages' .md URLs rewritten to their Markdown routes (next-kit's
 *       contentRewrites), and security headers on every route: no framing, no MIME sniffing, a
 *       trimmed Referer, and images only from here, data: URIs, Discord's CDN and osu!.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { contentRewrites } from "@haruhimemoe/next-kit/docs";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Turbopack only takes MDX plugins as a module name plus serializable options.
  options: { remarkPlugins: [["@haruhimemoe/ui/remark", {}]] },
});

const CSP = [
  "frame-ancestors 'none'",
  "img-src 'self' data: https://cdn.discordapp.com https://a.ppy.sh https://assets.ppy.sh",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async rewrites() {
    return contentRewrites();
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
