/**
 * @file src/lib/cards/InfoCard.tsx
 * @desc /info's image: harumin's name and version, a line on what it is, then the server count,
 *       uptime and ping.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import type { InfoCard as InfoCardData } from "@haruhimemoe/harumin-config";
import { FootLine, Frame, Stat, TitleBlock } from "@/lib/cards/parts";
import { int } from "@/lib/cards/theme";

/** The image size. */
export const INFO_CARD_SIZE = { width: 1000, height: 320 } as const;

/**
 * @function uptime
 * @param seconds {number} how long the bot has been up
 * @returns {string} "3d 4h", "4h 12m" or "12m"
 */
export const uptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * @function InfoCard
 * @param props {{ card: InfoCardData }} the parsed card
 * @returns {JSX.Element} the /info image's markup
 */
export const InfoCard = ({ card }: { card: InfoCardData }) => (
  <Frame {...INFO_CARD_SIZE}>
    <TitleBlock
      label="About"
      title={`harumin ${card.version}`}
      subtitle="An osu! bot from haruhime.moe, for players, mappers and tournament hosts."
      height={138}
    />
    <div style={{ display: "flex", gap: 56, padding: "22px 28px 0" }}>
      <Stat label="Servers" value={int(card.guilds)} big />
      <Stat label="Uptime" value={uptime(card.uptimeSeconds)} big />
      <Stat label="Ping" value={`${int(card.pingMs)}ms`} big />
    </div>
    <FootLine left="harumin.haruhime.moe" />
  </Frame>
);
