/**
 * @file src/app/sitemap.ts
 * @desc sitemap.xml: the static pages and the legal pages.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { contentSitemap } from "@haruhimemoe/next-kit/docs";
import { sitemapEntries } from "@haruhimemoe/next-kit/seo";
import type { MetadataRoute } from "next";
import { CONTENT } from "@/constants/content";
import { SEO_SITE } from "@/constants/seo";

/**
 * @function sitemap
 * @returns {MetadataRoute.Sitemap} the public pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(SEO_SITE, [["/", "/commands", "/brand"], contentSitemap(CONTENT)]);
}
