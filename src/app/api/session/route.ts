/**
 * @file src/app/api/session/route.ts
 * @desc GET /api/session: who is signed in, for the header's account menu. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { noStore } from "@haruhimemoe/next-kit/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * @function GET
 * @returns {Promise<Response>} 200 with the user, or with null
 */
export async function GET() {
  const user = await getCurrentUser();
  return noStore(
    Response.json({
      user: user ? { id: user.id, username: user.username, avatarUrl: user.avatarUrl } : null,
    }),
  );
}
