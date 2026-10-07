/**
 * @file src/app/sitemap.ts
 * @desc sitemap.xml: the public pages.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

/**
 * @function sitemap
 * @returns {MetadataRoute.Sitemap} the public pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/commands", "/legal/privacy", "/legal/terms"].map((path) => ({
    url: `${SITE.url}${path}`,
  }));
}
