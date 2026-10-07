/**
 * @file src/app/.well-known/security.txt/route.ts
 * @desc /.well-known/security.txt (RFC 9116): GitHub's private reporting first, then email.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { buildSecurityTxt } from "@haruhimemoe/next-kit/server";
import { SITE } from "@/constants/site";

/** Built on deploy: Expires is a year from the last deploy. */
export const dynamic = "force-static";

/**
 * @function GET
 * @returns {Response} the security.txt body as plain text
 */
export function GET() {
  const body = buildSecurityTxt({
    contactEmail: SITE.contactEmail,
    siteUrl: SITE.url,
    policyUrl: `${SITE.repoUrl}/blob/main/SECURITY.md`,
    now: new Date(),
  });
  return new Response(`Contact: ${SITE.advisoriesUrl}\n${body}`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
