/**
 * @file src/app/robots.ts
 * @desc robots.txt: everything public; the dashboard, sign-in and the API not.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { robots } from "@haruhimemoe/next-kit/seo";
import type { MetadataRoute } from "next";
import { SEO_SITE } from "@/constants/seo";

/**
 * @function robotsTxt
 * @returns {MetadataRoute.Robots} crawl rules, the AI crawler groups, the sitemap and the host
 */
export default function robotsTxt(): MetadataRoute.Robots {
  return robots(SEO_SITE, {
    allow: ["/"],
    disallow: ["/api/", "/dashboard", "/signin"],
    aiBots: "allow",
  });
}
