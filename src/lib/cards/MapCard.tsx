/**
 * @file src/lib/cards/MapCard.tsx
 * @desc /map's image: the map strip with its status, ruleset and mapper, then CS AR OD HP, length,
 *       BPM and max combo with the mods' speed, and pp at each accuracy, 100% in rose.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { MapCard as MapCardData } from "@haruhimemoe/harumin-config";
import { MapHeader } from "@/lib/cards/MapHeader";
import { Frame, Mods, Signature, Stat } from "@/lib/cards/parts";
import { duration, INK, int, pp, RULESET_LABELS, stat } from "@/lib/cards/theme";

/** The image size. */
export const MAP_CARD_SIZE = { width: 1000, height: 470 } as const;

/**
 * @function MapCard
 * @param props {{ card: MapCardData }} the parsed card
 * @returns {JSX.Element} the map image's markup
 */
export const MapCard = ({ card }: { card: MapCardData }) => {
  const stats: [string, number | null][] = [
    ["CS", card.cs],
    ["AR", card.ar],
    ["OD", card.od],
    ["HP", card.hp],
  ];
  return (
    <Frame {...MAP_CARD_SIZE}>
      <MapHeader
        map={card.map}
        height={190}
        pills={[card.map.status, RULESET_LABELS[card.ruleset]]}
        under={`mapped by ${card.map.creator}`}
      />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 34, padding: "22px 32px 0" }}>
        {stats
          .filter((entry): entry is [string, number] => entry[1] !== null)
          .map(([label, value]) => (
            <Stat key={label} label={label} value={stat(value)} />
          ))}
        <div style={{ display: "flex", width: 2, height: 56, background: INK.rule }} />
        <Stat label="Length" value={duration(card.lengthSeconds)} />
        <Stat label="BPM" value={stat(card.bpm)} />
        {card.maxCombo !== null ? (
          <Stat label="Max combo" value={`${int(card.maxCombo)}x`} />
        ) : null}
      </div>
      {card.pps.length ? (
        <div style={{ display: "flex", gap: 14, padding: "22px 32px 0" }}>
          {card.pps.map(({ accuracy, pp: value }) => (
            <div
              key={accuracy}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                padding: "8px 0",
                borderRadius: 4,
                border: `2px solid ${accuracy === 100 ? INK.rose : INK.ink}`,
              }}
            >
              <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: INK.muted }}>
                {`${accuracy}%`}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 800,
                  color: accuracy === 100 ? INK.rose : INK.ink,
                }}
              >
                {pp(value)}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "auto 32px 18px",
        }}
      >
        <Mods mods={card.mods} size={18} />
        <Signature />
      </div>
    </Frame>
  );
};
