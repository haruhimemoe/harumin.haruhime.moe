/**
 * @file src/lib/cards/render.tsx
 * @desc The card routes' work: check the bot's bearer, read the posted card against its
 *       harumin-config schema, and draw it to a PNG with next/og. A card is drawn from what the
 *       bot sends plus osu!'s images (avatars and flags by id, covers on assets.ppy.sh only), so
 *       the route never calls the osu! API and keeps nothing.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Thu Oct 8, 2026
 */

import "server-only";
import {
  bbCardSchema,
  compareCardSchema,
  leaderboardCardSchema,
  mapCardSchema,
  matchCostCardSchema,
  poolCardSchema,
  profileCardSchema,
  scoreCardSchema,
  scoreListCardSchema,
  serverCardSchema,
  simulateCardSchema,
  tracksCardSchema,
} from "@haruhimemoe/harumin-config";
import { parseJsonBody, refuseWithoutBearer } from "@haruhimemoe/next-kit/server";
import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import type { z } from "zod";
import { getServerEnv } from "@/env";
import { BB_CARD_SIZE, BbCard } from "@/lib/cards/BbCard";
import { COMPARE_CARD_SIZE, CompareCard } from "@/lib/cards/CompareCard";
import { LeaderboardCard, leaderboardCardSize } from "@/lib/cards/LeaderboardCard";
import { MAP_CARD_SIZE, MapCard } from "@/lib/cards/MapCard";
import { MatchCostCard, matchCostCardSize } from "@/lib/cards/MatchCostCard";
import { PoolCard, poolCardSize } from "@/lib/cards/PoolCard";
import { PROFILE_CARD_SIZE, ProfileCard } from "@/lib/cards/ProfileCard";
import { SCORE_CARD_SIZE, ScoreCard } from "@/lib/cards/ScoreCard";
import { ScoreListCard, scoreListCardSize } from "@/lib/cards/ScoreListCard";
import { ServerCard, serverCardSize } from "@/lib/cards/ServerCard";
import { SIMULATE_CARD_SIZE, SimulateCard } from "@/lib/cards/SimulateCard";
import { TracksCard, tracksCardSize } from "@/lib/cards/TracksCard";
import { cardFonts } from "@/lib/cards/theme";

type Drawn = { element: ReactElement; size: { width: number; height: number } };

type CardKind<T> = { schema: z.ZodType<T>; draw: (card: T) => Drawn };

const kind = <T,>(schema: z.ZodType<T>, draw: (card: T) => Drawn): CardKind<T> => ({
  schema,
  draw,
});

/** Each card route by its last path segment (CARD_ROUTES). */
export const CARD_KINDS = {
  profile: kind(profileCardSchema, (card) => ({
    element: <ProfileCard card={card} />,
    size: PROFILE_CARD_SIZE,
  })),
  score: kind(scoreCardSchema, (card) => ({
    element: <ScoreCard card={card} />,
    size: SCORE_CARD_SIZE,
  })),
  scores: kind(scoreListCardSchema, (card) => ({
    element: <ScoreListCard card={card} />,
    size: scoreListCardSize(card.rows.length),
  })),
  map: kind(mapCardSchema, (card) => ({ element: <MapCard card={card} />, size: MAP_CARD_SIZE })),
  leaderboard: kind(leaderboardCardSchema, (card) => ({
    element: <LeaderboardCard card={card} />,
    size: leaderboardCardSize(card.rows.length),
  })),
  simulate: kind(simulateCardSchema, (card) => ({
    element: <SimulateCard card={card} />,
    size: SIMULATE_CARD_SIZE,
  })),
  compare: kind(compareCardSchema, (card) => ({
    element: <CompareCard card={card} />,
    size: COMPARE_CARD_SIZE,
  })),
  matchcost: kind(matchCostCardSchema, (card) => ({
    element: <MatchCostCard card={card} />,
    size: matchCostCardSize(card.rows.length),
  })),
  pool: kind(poolCardSchema, (card) => ({
    element: <PoolCard card={card} />,
    size: poolCardSize(card.slots.length),
  })),
  server: kind(serverCardSchema, (card) => ({
    element: <ServerCard card={card} />,
    size: serverCardSize(card.rows.length),
  })),
  tracks: kind(tracksCardSchema, (card) => ({
    element: <TracksCard card={card} />,
    size: tracksCardSize(card.rows.length),
  })),
  bb: kind(bbCardSchema, (card) => ({ element: <BbCard card={card} />, size: BB_CARD_SIZE })),
} as const;

/** One of CARD_KINDS' names. */
export type CardKindName = keyof typeof CARD_KINDS;

/**
 * @function isCardKind
 * @param name {string} a path segment
 * @returns {boolean} whether it names a card
 */
export const isCardKind = (name: string): name is CardKindName => Object.hasOwn(CARD_KINDS, name);

/**
 * @function renderCard
 * @param request {Request} the bot's POST
 * @param name {CardKindName} which card
 * @returns {Promise<Response>} the PNG, or 401/503 without the bearer, or 400 for a bad card
 */
export const renderCard = async (request: Request, name: CardKindName): Promise<Response> => {
  const refused = await refuseWithoutBearer(request, {
    secret: () => getServerEnv().HARUMIN_SERVICE_TOKEN,
    label: "harumin cards",
    notConfigured: "Card images aren't set up.",
    noStore: true,
  });
  if (refused) return refused;
  const card = CARD_KINDS[name] as CardKind<unknown>;
  const body = await parseJsonBody(request, card.schema);
  if (!body.ok) return body.response;
  const { element, size } = card.draw(body.data);
  return new ImageResponse(element, {
    ...size,
    fonts: await cardFonts(),
    headers: { "Cache-Control": "no-store" },
  });
};
