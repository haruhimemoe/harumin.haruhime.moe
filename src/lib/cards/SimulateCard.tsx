/**
 * @file src/lib/cards/SimulateCard.tsx
 * @desc /simulate's image: the map strip, then the made-up play's pp big in rose, its mods, and
 *       the accuracy, combo and misses it was worked out for.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { SimulateCard as SimulateCardData } from "@haruhimemoe/harumin-config";
import { MapHeader } from "@/lib/cards/MapHeader";
import { Frame, Mods, Signature, Stat } from "@/lib/cards/parts";
import { INK, int, percent, pp, RULESET_LABELS } from "@/lib/cards/theme";

/** The image size. */
export const SIMULATE_CARD_SIZE = { width: 1000, height: 420 } as const;

/**
 * @function SimulateCard
 * @param props {{ card: SimulateCardData }} the parsed card
 * @returns {JSX.Element} the simulate image's markup
 */
export const SimulateCard = ({ card }: { card: SimulateCardData }) => (
  <Frame {...SIMULATE_CARD_SIZE}>
    <MapHeader
      map={card.map}
      height={190}
      pills={["If you played it like this", RULESET_LABELS[card.ruleset]]}
    />
    <div style={{ display: "flex", alignItems: "center", gap: 44, padding: "24px 32px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1, color: INK.rose }}
        >
          {pp(card.pp)}
        </div>
        <Mods mods={card.mods} size={18} />
      </div>
      <Stat label="Accuracy" value={percent(card.accuracy)} />
      <Stat label="Combo" value={`${int(card.combo)}x / ${int(card.mapMaxCombo)}x`} />
      <Stat label={card.misses === 1 ? "Miss" : "Misses"} value={int(card.misses)} />
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", margin: "auto 32px 18px" }}>
      <Signature />
    </div>
  </Frame>
);
