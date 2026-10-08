/**
 * @file src/lib/cards/CompareCard.tsx
 * @desc /compare's image: the two players side by side (cover halves, avatar, name, flag), then
 *       one row per stat with the label in the middle, the better number in ink and the other
 *       muted.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { CardPlayer, CompareCard as CompareCardData } from "@haruhimemoe/harumin-config";
import { Avatar, Flag, Frame, oneLine, Signature } from "@/lib/cards/parts";
import { alpha, hours, INK, int, percent, pp, RULESET_LABELS } from "@/lib/cards/theme";

/** The image size. */
export const COMPARE_CARD_SIZE = { width: 1000, height: 560 } as const;

const Side = ({ player, align }: { player: CardPlayer; align: "left" | "right" }) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      width: "50%",
      height: 170,
      background: INK.ink,
      overflow: "hidden",
    }}
  >
    {player.coverUrl ? (
      <img
        src={player.coverUrl}
        width={487}
        height={170}
        alt=""
        style={{ width: "100%", height: 170, objectFit: "cover", opacity: 0.8 }}
      />
    ) : null}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundImage: `linear-gradient(180deg, ${alpha(INK.ink, 0.15)} 0%, ${alpha(INK.ink, 0.75)} 100%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 18,
        display: "flex",
        flexDirection: align === "left" ? "row" : "row-reverse",
        alignItems: "center",
        gap: 14,
        color: INK.paper,
      }}
    >
      <Avatar osuId={player.osuId} size={76} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "left" ? "flex-start" : "flex-end",
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, ...oneLine }}>
          {player.username}
        </div>
        <Flag code={player.countryCode} height={20} />
      </div>
    </div>
  </div>
);

type Row = {
  label: string;
  a: number | null;
  b: number | null;
  show: (n: number) => string;
  lower?: boolean;
};

/**
 * @function CompareCard
 * @param props {{ card: CompareCardData }} the parsed card
 * @returns {JSX.Element} the compare image's markup
 */
export const CompareCard = ({ card }: { card: CompareCardData }) => {
  const { a, b } = card;
  const rows: Row[] = [
    {
      label: "Global rank",
      a: a.player.globalRank,
      b: b.player.globalRank,
      show: (n) => `#${int(n)}`,
      lower: true,
    },
    { label: "pp", a: a.player.pp, b: b.player.pp, show: pp },
    { label: "Accuracy", a: a.accuracy, b: b.accuracy, show: percent },
    { label: "Top play", a: a.topPp, b: b.topPp, show: pp },
    { label: "Play count", a: a.playCount, b: b.playCount, show: int },
    { label: "Play time", a: a.playTime, b: b.playTime, show: hours },
    { label: "Max combo", a: a.maxCombo, b: b.maxCombo, show: (n) => `${int(n)}x` },
    { label: "SS", a: a.ssCount, b: b.ssCount, show: int },
  ];
  const wins = (mine: number | null, theirs: number | null, lower = false) =>
    mine !== null && (theirs === null || (lower ? mine < theirs : mine > theirs));
  const cell = (value: number | null, win: boolean, row: Row, align: "flex-start" | "flex-end") => (
    <div
      style={{
        display: "flex",
        width: 340,
        justifyContent: align,
        fontSize: 24,
        fontWeight: 800,
        color: win ? INK.ink : INK.muted,
      }}
    >
      {value === null ? "none" : row.show(value)}
    </div>
  );
  return (
    <Frame {...COMPARE_CARD_SIZE}>
      <div style={{ position: "relative", display: "flex", borderBottom: `3px solid ${INK.ink}` }}>
        <Side player={a.player} align="left" />
        <div style={{ display: "flex", width: 3, background: INK.ink }} />
        <Side player={b.player} align="right" />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 452,
            display: "flex",
            fontSize: 22,
            fontWeight: 800,
            padding: "2px 12px",
            borderRadius: 4,
            background: INK.paper,
            color: INK.rose,
          }}
        >
          vs
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "8px 32px 0" }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 40,
              borderBottom: `1.5px solid ${INK.rule}`,
            }}
          >
            {cell(row.a, wins(row.a, row.b, row.lower), row, "flex-start")}
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: INK.muted,
              }}
            >
              {row.label}
            </div>
            {cell(row.b, wins(row.b, row.a, row.lower), row, "flex-end")}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "auto 32px 14px",
        }}
      >
        <Signature text={RULESET_LABELS[card.ruleset]} />
      </div>
    </Frame>
  );
};
