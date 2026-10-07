/**
 * @file src/lib/api.ts
 * @desc harumin's wiring for @haruhimemoe/next-kit/server's same-origin guard, which every write
 *       runs, bound to the site's URL and name.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { refuseCrossSite as refuseForeign } from "@haruhimemoe/next-kit/server";
import { SITE } from "@/constants/site";

/**
 * @function refuseCrossSite
 * @param request {Request} a write
 * @returns {Response | null} 403 when the request comes from another site (another
 *          *.haruhime.moe host counts); otherwise null
 */
export const refuseCrossSite = (request: Request): Response | null =>
  refuseForeign(request, { siteUrl: SITE.url, siteTitle: SITE.title });
