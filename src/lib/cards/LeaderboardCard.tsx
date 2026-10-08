/**
 * @file src/lib/cards/LeaderboardCard.tsx
 * @desc /leaderboard's image: a short map strip, then up to ten scores a page (place, flag, name,
 *       grade, mods, accuracy, combo, pp), and the filter and page along the bottom.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import {
  type LeaderboardCard as LeaderboardCardData,
  MAX_LEADERBOARD_ROWS,
} from "@haruhimemoe/harumin-config";
import { MapHeader } from "@/lib/cards/MapHeader";
import { Flag, Frame, GradeLetter, Mods, oneLine, Signature } from "@/lib/cards/parts";
import { INK, int, percent, pp } from "@/lib/cards/theme";

const HEADER_HEIGHT = 150;
const ROW_HEIGHT = 54;
const FOOTER_HEIGHT = 56;

/**
 * @function leaderboardCardSize
 * @param rows {number} rows on the page
 * @returns {{ width: number; height: number }} the image size: the frame grows with the rows
 */
export const leaderboardCardSize = (rows: number) => ({
  width: 1000,
  height:
    20 +
    6 +
    HEADER_HEIGHT +
    Math.max(1, Math.min(rows, MAX_LEADERBOARD_ROWS)) * ROW_HEIGHT +
    FOOTER_HEIGHT,
});

/**
 * @function LeaderboardCard
 * @param props {{ card: LeaderboardCardData }} the parsed card
 * @returns {JSX.Element} the leaderboard image's markup
 */
export const LeaderboardCard = ({ card }: { card: LeaderboardCardData }) => (
  <Frame {...leaderboardCardSize(card.rows.length)}>
    <MapHeader map={card.map} height={HEADER_HEIGHT} pills={["Global leaderboard"]} />
    {card.rows.length ? (
      card.rows.map((row) => (
        <div
          key={row.place}
          style={{
            display: "flex",
            alignItems: "center",
            height: ROW_HEIGHT,
            padding: "0 28px",
            gap: 16,
            borderTop: row.place === card.rows[0]?.place ? "none" : `1.5px solid ${INK.rule}`,
            background: row.place === 1 ? INK.tone : "transparent",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              fontSize: 22,
              fontWeight: 800,
              color: row.place === 1 ? INK.rose : INK.muted,
            }}
          >
            {`#${row.place}`}
          </div>
          <div style={{ display: "flex", width: 34 }}>
            <Flag code={row.countryCode} height={22} />
          </div>
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              flexBasis: 0,
              minWidth: 0,
              fontSize: 22,
              fontWeight: 800,
              ...oneLine,
            }}
          >
            {row.username}
          </div>
          <div style={{ display: "flex", width: 44, justifyContent: "center" }}>
            <GradeLetter grade={row.grade} size={28} />
          </div>
          <div style={{ display: "flex", width: 150, justifyContent: "flex-end" }}>
            <Mods mods={row.mods} size={13} />
          </div>
          <div
            style={{
              display: "flex",
              width: 96,
              justifyContent: "flex-end",
              fontSize: 18,
              color: INK.soft,
            }}
          >
            {percent(row.accuracy)}
          </div>
          <div
            style={{
              display: "flex",
              width: 80,
              justifyContent: "flex-end",
              fontSize: 18,
              color: INK.soft,
            }}
          >
            {`${int(row.combo)}x`}
          </div>
          <div
            style={{
              display: "flex",
              width: 132,
              justifyContent: "flex-end",
              fontSize: row.pp === null ? 20 : 24,
              fontWeight: 800,
              color: row.pp === null ? INK.muted : INK.rose,
            }}
          >
            {row.pp === null ? int(row.totalScore) : pp(row.pp)}
          </div>
        </div>
      ))
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: ROW_HEIGHT,
          fontSize: 22,
          color: INK.muted,
        }}
      >
        No scores.
      </div>
    )}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "auto 28px 16px",
        fontSize: 16,
        color: INK.muted,
        fontWeight: 800,
      }}
    >
      <div style={{ display: "flex" }}>{card.filter ?? "Global top 100"}</div>
      <Signature text={card.pages > 1 ? `page ${card.page} of ${card.pages}` : undefined} />
    </div>
  </Frame>
);
