/**
 * @file src/lib/cards/BbCard.tsx
 * @desc A bb.haruhime.moe link's image: the template's name (or "BBCode template") and a line
 *       saying what opening it does. bb draws its own previews, so this stays small.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Sun Oct 11, 2026
 */

import type { BbCard as BbCardData } from "@haruhimemoe/harumin-config";
import { FootLine, Frame, TitleBlock } from "@/lib/cards/parts";
import { scope } from "./i18n";

const t = scope("cards.bbCard");

/** The image size. */
export const BB_CARD_SIZE = { width: 1000, height: 208 } as const;

/**
 * @function BbCard
 * @param props {{ card: BbCardData }} the parsed card
 * @returns {JSX.Element} the bb template image's markup
 */
export const BbCard = ({ card }: { card: BbCardData }) => (
  <Frame {...BB_CARD_SIZE}>
    <TitleBlock
      label={t("bbHaruhimeMoe")}
      title={card.name || t("bbcodeTemplate")}
      subtitle={t("anOsuBbcodeTemplate")}
      height={138}
    />
    <FootLine left={`template ${card.templateId}`} />
  </Frame>
);
