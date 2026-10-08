/**
 * @file src/lib/cards/LinkCard.tsx
 * @desc /link's image: the linked osu! account with its avatar, or a "not linked" card saying
 *       where to link. The link button sits under the image.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import type { LinkCard as LinkCardData } from "@haruhimemoe/harumin-config";
import { Avatar, FootLine, Frame, TitleBlock } from "@/lib/cards/parts";

/** The image size. */
export const LINK_CARD_SIZE = { width: 1000, height: 208 } as const;

/**
 * @function LinkCard
 * @param props {{ card: LinkCardData }} the parsed card
 * @returns {JSX.Element} the /link image's markup
 */
export const LinkCard = ({ card }: { card: LinkCardData }) => (
  <Frame {...LINK_CARD_SIZE}>
    {card.account ? (
      <TitleBlock
        label="Linked"
        title={card.account.username}
        subtitle="Commands use this account when you leave the player empty."
        height={138}
        side={<Avatar osuId={card.account.osuId} size={96} />}
      />
    ) : (
      <TitleBlock
        label="Not linked"
        title="Link your osu! account"
        subtitle="Sign in with osu! on haruhime.moe, then link Discord there."
        height={138}
      />
    )}
    <FootLine left="haruhime.moe/account" />
  </Frame>
);
