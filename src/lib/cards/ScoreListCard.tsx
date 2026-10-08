/**
 * @file src/lib/cards/ScoreListCard.tsx
 * @desc /top's image: the player and the list's title along the top, then up to five plays a
 *       page, each with its place, map cover strip, title and difficulty, grade, mods, accuracy,
 *       combo and pp (and the full-combo pp when there is one), and the page number along the bottom.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import {
  type CardScore,
  MAX_CARD_ROWS,
  type ScoreListCard as ScoreListCardData,
} from "@haruhimemoe/harumin-config";
import { Frame, GradeLetter, Mods, oneLine, Signature, Stars } from "@/lib/cards/parts";
import { PlayerLine } from "@/lib/cards/ScoreCard";
import { ago, INK, int, mapCoverUrl, percent, pp, RULESET_LABELS, stars } from "@/lib/cards/theme";

const ROW_HEIGHT = 96;
const HEADER_HEIGHT = 104;
const FOOTER_HEIGHT = 58;

/**
 * @function scoreListCardSize
 * @param rows {number} rows on the page
 * @returns {{ width: number; height: number }} the image size: the frame grows with the rows
 */
export const scoreListCardSize = (rows: number) => ({
  width: 1000,
  height:
    20 +
    6 +
    HEADER_HEIGHT +
    Math.max(1, Math.min(rows, MAX_CARD_ROWS)) * ROW_HEIGHT +
    FOOTER_HEIGHT,
});

const Row = ({
  place,
  score,
  now,
}: {
  place: number;
  score: CardScore;
  now?: number | undefined;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: ROW_HEIGHT,
      padding: "0 28px",
      gap: 18,
      borderTop: `1.5px solid ${INK.rule}`,
    }}
  >
    <div style={{ display: "flex", width: 52, fontSize: 26, fontWeight: 800, color: INK.muted }}>
      {`#${place}`}
    </div>
    <div
      style={{
        display: "flex",
        width: 128,
        height: 64,
        borderRadius: 4,
        border: `2px solid ${INK.ink}`,
        overflow: "hidden",
        background: INK.tone,
      }}
    >
      {score.map.beatmapsetId ? (
        <img
          src={mapCoverUrl(score.map.beatmapsetId, "cover@2x")}
          width={128}
          height={64}
          alt=""
          style={{ width: 128, height: 64, objectFit: "cover" }}
        />
      ) : null}
    </div>
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0, gap: 2 }}>
      <div style={{ display: "flex", fontSize: 22, fontWeight: 800, ...oneLine }}>
        {score.map.title}
      </div>
      <div style={{ display: "flex", gap: 5, fontSize: 16, color: INK.soft, ...oneLine }}>
        {`[${score.map.version}] · `}
        {score.map.stars !== null ? (
          <Stars value={stars(score.map.stars)} size={15} color={INK.soft} />
        ) : null}
        {` · ${ago(score.endedAt, now)}`}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: INK.soft }}
      >
        <Mods mods={score.mods} size={13} />
        <div style={{ display: "flex" }}>
          {`${percent(score.accuracy)} · ${int(score.combo)}x${score.mapMaxCombo !== null ? `/${int(score.mapMaxCombo)}x` : ""}`}
        </div>
      </div>
    </div>
    <GradeLetter grade={score.grade} size={44} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: 150 }}>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          fontWeight: 800,
          color: score.pp === null ? INK.muted : INK.rose,
        }}
      >
        {score.pp === null ? "no pp" : `${score.ppApprox ? "≈" : ""}${pp(score.pp)}`}
      </div>
      {score.fcPp !== null ? (
        <div style={{ display: "flex", fontSize: 16, fontWeight: 800, color: INK.soft }}>
          {`${pp(score.fcPp)} if FC`}
        </div>
      ) : null}
    </div>
  </div>
);

/**
 * @function ScoreListCard
 * @param props {{ card: ScoreListCardData; now?: number }} the parsed card, and the time (tests)
 * @returns {JSX.Element} the list image's markup
 */
export const ScoreListCard = ({ card, now }: { card: ScoreListCardData; now?: number }) => (
  <Frame {...scoreListCardSize(card.rows.length)}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: HEADER_HEIGHT,
        padding: "0 28px",
        gap: 20,
        borderBottom: `3px solid ${INK.ink}`,
      }}
    >
      <PlayerLine player={card.player} size={56} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <div
          style={{
            display: "flex",
            fontSize: 15,
            fontWeight: 800,
            color: INK.muted,
          }}
        >
          {RULESET_LABELS[card.ruleset]}
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>{card.title}</div>
      </div>
    </div>
    {card.rows.length ? (
      card.rows.map(({ place, score }) => <Row key={place} place={place} score={score} now={now} />)
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
        Nothing here.
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
      <div style={{ display: "flex" }}>{card.note ?? ""}</div>
      <Signature text={card.pages > 1 ? `page ${card.page} of ${card.pages}` : undefined} />
    </div>
  </Frame>
);
