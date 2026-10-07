/**
 * @file src/app/api/signout/route.ts
 * @desc POST /api/signout: ends the hub session from this server and clears the hub's cookies
 *       (src/lib/signout.ts). Same-origin only.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { noStore } from "@haruhimemoe/next-kit/server";
import { getServerEnv } from "@/env";
import { refuseCrossSite } from "@/lib/api";
import { clearAuthCookies, signOutOnHub } from "@/lib/signout";

/**
 * @function POST
 * @param request {Request} the incoming request
 * @returns {Promise<Response>} 204 with the cookies cleared, or 403 cross-site
 */
export async function POST(request: Request) {
  const crossSite = refuseCrossSite(request);
  if (crossSite) return noStore(crossSite);
  const env = getServerEnv();
  await signOutOnHub(request.headers.get("cookie"), env.HUB_URL);
  const response = noStore(new Response(null, { status: 204 }));
  for (const cookie of clearAuthCookies(env.HUB_COOKIE_DOMAIN)) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}
