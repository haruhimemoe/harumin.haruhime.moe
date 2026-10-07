/**
 * @file src/app/api/cards/[kind]/route.ts
 * @desc POST /api/cards/{profile,score,scores}: the bot's card images (harumin-config's
 *       CARD_ROUTES). Bearer HARUMIN_SERVICE_TOKEN; answers a PNG.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { isCardKind, renderCard } from "@/lib/cards/render";

/**
 * @function POST
 * @param request {Request} the bot's card
 * @param context {{ params: Promise<{ kind: string }> }} which card
 * @returns {Promise<Response>} the PNG, or an error
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ kind: string }> },
): Promise<Response> {
  const { kind } = await params;
  if (!isCardKind(kind)) return new Response(null, { status: 404 });
  return renderCard(request, kind);
}
