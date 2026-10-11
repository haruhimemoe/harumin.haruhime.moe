/**
 * @file src/lib/cards/LinkCard.tsx
 * @desc /link's image: the linked osu! account with its avatar, or a "not linked" card saying
 *       where to link. The link button sits under the image.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Sun Oct 11, 2026
 */

import type { LinkCard as LinkCardData } from "@haruhimemoe/harumin-config";
import { Avatar, FootLine, Frame, TitleBlock } from "@/lib/cards/parts";
import { scope } from "./i18n";

const t = scope("cards.linkCard");

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
        label={t("linked")}
        title={card.account.username}
        subtitle={t("commandsUseThisAccount")}
        height={138}
        side={<Avatar osuId={card.account.osuId} size={96} />}
      />
    ) : (
      <TitleBlock
        label={t("notLinked")}
        title={t("linkYourOsuAccount")}
        subtitle={t("signInWithOsu")}
        height={138}
      />
    )}
    <FootLine left="haruhime.moe/account" />
  </Frame>
);
