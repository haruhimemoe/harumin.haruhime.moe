/**
 * @file src/app/api/internal/account/[op]/route.ts
 * @desc POST /api/internal/account/export and /delete: the haruhime.moe hub's account fan-out
 *       (@haruhimemoe/next-kit/account). Bearer ACCOUNT_FANOUT_SECRET; 503 while it's unset, 401
 *       without it, body { userId }. Export answers 200 with the user's card settings, delete
 *       204 (safe to repeat). Any other op is 404. Nothing is cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import { createAccountHandlers } from "@haruhimemoe/next-kit/account";
import { jsonError, noStore } from "@haruhimemoe/next-kit/server";
import { getServerEnv } from "@/env";
import { deleteAccountData, exportAccountData } from "@/lib/account-fanout";
import { getDb, getIdentityDb } from "@/lib/db";

const dbs = () => ({ db: getDb(), identity: getIdentityDb() });

const handlers = createAccountHandlers({
  secret: () => getServerEnv().ACCOUNT_FANOUT_SECRET,
  export: (userId) => exportAccountData(dbs(), userId),
  delete: (userId) => deleteAccountData(dbs(), userId),
});

/**
 * @function POST
 * @param request {Request} the hub's call
 * @param context {{ params }} the route segment (export or delete)
 * @returns {Promise<Response>} 200, 204, 400, 401, 404, 500, 503
 */
export async function POST(request: Request, { params }: { params: Promise<{ op: string }> }) {
  const { op } = await params;
  if (op === "export") return handlers.export(request);
  if (op === "delete") return handlers.delete(request);
  return noStore(jsonError(404, "Not found."));
}
