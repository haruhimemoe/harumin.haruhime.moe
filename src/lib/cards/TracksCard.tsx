/**
 * @file src/lib/cards/TracksCard.tsx
 * @desc /track list's image: how many players the server tracks out of its cap, then each one
 *       with avatar, name, ruleset and the channel their top plays go to.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import {
  MAX_TRACKED_PER_GUILD,
  type TracksCard as TracksCardData,
} from "@haruhimemoe/harumin-config";
import { Avatar, Empty, FootLine, Frame, oneLine, TitleBlock } from "@/lib/cards/parts";
import { INK, listHeight, RULESET_LABELS } from "@/lib/cards/theme";

const HEADER_HEIGHT = 112;
const ROW_HEIGHT = 50;
const FOOTER_HEIGHT = 52;

/**
 * @function tracksCardSize
 * @param rows {number} tracked players
 * @returns {{ width: number; height: number }} the image size: the frame grows with the rows
 */
export const tracksCardSize = (rows: number) => ({
  width: 1000,
  height: listHeight({
    header: HEADER_HEIGHT,
    row: ROW_HEIGHT,
    rows,
    max: MAX_TRACKED_PER_GUILD,
    footer: FOOTER_HEIGHT,
  }),
});

/**
 * @function TracksCard
 * @param props {{ card: TracksCardData }} the parsed card
 * @returns {JSX.Element} the tracked players image's markup
 */
export const TracksCard = ({ card }: { card: TracksCardData }) => (
  <Frame {...tracksCardSize(card.rows.length)}>
    <TitleBlock
      label="Top play tracking"
      title="Tracked players"
      height={HEADER_HEIGHT}
      side={
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontWeight: 800 }}>
          <div style={{ display: "flex", fontSize: 44 }}>{String(card.rows.length)}</div>
          <div style={{ display: "flex", fontSize: 22, color: INK.muted }}>{`/ ${card.max}`}</div>
        </div>
      }
    />
    {card.rows.length ? (
      card.rows.map((row, i) => (
        <div
          key={`${row.osuId}-${row.ruleset}`}
          style={{
            display: "flex",
            alignItems: "center",
            height: ROW_HEIGHT,
            padding: "0 28px",
            gap: 16,
            borderTop: i === 0 ? "none" : `1.5px solid ${INK.rule}`,
          }}
        >
          <Avatar osuId={row.osuId} size={36} />
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              flexBasis: 0,
              minWidth: 0,
              fontSize: 21,
              fontWeight: 800,
              ...oneLine,
            }}
          >
            {row.username}
          </div>
          <div style={{ display: "flex", width: 120, fontSize: 17, color: INK.soft }}>
            {RULESET_LABELS[row.ruleset]}
          </div>
          <div
            style={{
              display: "flex",
              width: 260,
              fontSize: 18,
              fontWeight: 800,
              color: INK.soft,
              ...oneLine,
            }}
          >
            {`#${row.channel}`}
          </div>
        </div>
      ))
    ) : (
      <Empty text="Nobody yet. /track add posts a player's new top plays." height={ROW_HEIGHT} />
    )}
    <FootLine />
  </Frame>
);
