/**
 * @file src/lib/cards/MatchCostCard.tsx
 * @desc /matchcost's image: the match name, maps won by each team when it's team vs, the
 *       formula, then every player ranked by match cost (the best in rose), and how many were
 *       left off along the bottom.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import {
  MAX_MATCH_ROWS,
  type MatchCostCard as MatchCostCardData,
} from "@haruhimemoe/harumin-config";
import { Empty, Flag, FootLine, Frame, oneLine, TitleBlock } from "@/lib/cards/parts";
import { INK, listHeight } from "@/lib/cards/theme";

const HEADER_HEIGHT = 138;
const ROW_HEIGHT = 46;
const FOOTER_HEIGHT = 52;

/** Team colors: osu!'s red and blue, dulled to sit with the ink. */
const TEAM = { red: "#c8414b", blue: "#3b6fc4" } as const;

/**
 * @function matchCostCardSize
 * @param rows {number} players on the card
 * @returns {{ width: number; height: number }} the image size: the frame grows with the rows
 */
export const matchCostCardSize = (rows: number) => ({
  width: 1000,
  height: listHeight({
    header: HEADER_HEIGHT,
    row: ROW_HEIGHT,
    rows,
    max: MAX_MATCH_ROWS,
    footer: FOOTER_HEIGHT,
  }),
});

const Score = ({ red, blue }: { red: number; blue: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, fontWeight: 800 }}>
    <div style={{ display: "flex", color: TEAM.red }}>{String(red)}</div>
    <div style={{ display: "flex", fontSize: 28, color: INK.muted }}>:</div>
    <div style={{ display: "flex", color: TEAM.blue }}>{String(blue)}</div>
  </div>
);

/**
 * @function MatchCostCard
 * @param props {{ card: MatchCostCardData }} the parsed card
 * @returns {JSX.Element} the match cost image's markup
 */
export const MatchCostCard = ({ card }: { card: MatchCostCardData }) => (
  <Frame {...matchCostCardSize(card.rows.length)}>
    <TitleBlock
      label="Match costs"
      title={card.name}
      subtitle={[
        `${card.games} game${card.games === 1 ? "" : "s"}`,
        `${card.formula} formula`,
        card.note,
      ]
        .filter(Boolean)
        .join(" · ")}
      height={HEADER_HEIGHT}
      side={card.teams ? <Score {...card.teams} /> : null}
    />
    {card.rows.length ? (
      card.rows.map((row, i) => (
        <div
          key={`${row.place}-${row.username}`}
          style={{
            display: "flex",
            alignItems: "center",
            height: ROW_HEIGHT,
            padding: "0 28px",
            gap: 16,
            borderTop: i === 0 ? "none" : `1.5px solid ${INK.rule}`,
            background: row.place === 1 ? INK.tone : "transparent",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              fontSize: 20,
              fontWeight: 800,
              color: row.place === 1 ? INK.rose : INK.muted,
            }}
          >
            {`#${row.place}`}
          </div>
          <div
            style={{
              display: "flex",
              width: 8,
              height: 26,
              borderRadius: 4,
              background: row.team ? TEAM[row.team] : "transparent",
            }}
          />
          <div style={{ display: "flex", width: 34 }}>
            <Flag code={row.countryCode} height={20} />
          </div>
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
          <div
            style={{
              display: "flex",
              width: 110,
              justifyContent: "flex-end",
              fontSize: 24,
              fontWeight: 800,
              color: row.place === 1 ? INK.rose : INK.ink,
            }}
          >
            {row.cost.toFixed(2)}
          </div>
        </div>
      ))
    ) : (
      <Empty text="No completed games yet." height={ROW_HEIGHT} />
    )}
    <FootLine left={card.more ? `and ${card.more} more` : null} />
  </Frame>
);
