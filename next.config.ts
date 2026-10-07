/**
 * @file next.config.ts
 * @desc Next.js config: strict mode, no X-Powered-By, unoptimized images (Discord's and osu!'s CDNs
 *       size their own), and security headers on every route: no framing, no MIME sniffing, a
 *       trimmed Referer, and images only from here, data: URIs, Discord's CDN and osu!.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { NextConfig } from "next";

const CSP = [
  "frame-ancestors 'none'",
  "img-src 'self' data: https://cdn.discordapp.com https://a.ppy.sh https://assets.ppy.sh",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
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

export default nextConfig;
