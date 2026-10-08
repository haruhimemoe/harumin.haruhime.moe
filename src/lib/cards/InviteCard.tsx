/**
 * @file src/lib/cards/InviteCard.tsx
 * @desc /invite's image: harumin's name, a line on what it does, and how many servers have it.
 *       The invite itself stays a button under the image.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import type { InviteCard as InviteCardData } from "@haruhimemoe/harumin-config";
import { FootLine, Frame, Stat, TitleBlock } from "@/lib/cards/parts";
import { int } from "@/lib/cards/theme";

/** The image size. */
export const INVITE_CARD_SIZE = { width: 1000, height: 208 } as const;

/**
 * @function InviteCard
 * @param props {{ card: InviteCardData }} the parsed card
 * @returns {JSX.Element} the /invite image's markup
 */
export const InviteCard = ({ card }: { card: InviteCardData }) => (
  <Frame {...INVITE_CARD_SIZE}>
    <TitleBlock
      label="Add to a server"
      title="harumin"
      subtitle="Profiles, scores, maps, match costs and pools, in your osu! server."
      height={138}
      side={<Stat label="Servers" value={int(card.guilds)} big />}
    />
    <FootLine left="Settings live on the dashboard" />
  </Frame>
);
