/**
 * @file src/app/robots.ts
 * @desc robots.txt: everything public, the dashboard not.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

/**
 * @function robots
 * @returns {MetadataRoute.Robots} the rules and the sitemap
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dashboard" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
