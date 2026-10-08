/**
 * @file src/lib/cards/ScoreCard.tsx
 * @desc /recent's image: the map's cover with its title, the grade letter big, the pp big in
 *       rose (with the full-combo pp when it wasn't one), accuracy, combo and score, the
 *       judgements on their own row (mania has six), mods, and who played it and when along the bottom.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { CardPlayer, ScoreCard as ScoreCardData } from "@haruhimemoe/harumin-config";
import { MapHeader } from "@/lib/cards/MapHeader";
import {
  Avatar,
  Flag,
  Frame,
  GradeLetter,
  Mods,
  oneLine,
  Signature,
  Stat,
} from "@/lib/cards/parts";
import { ago, INK, int, percent, pp, RULESET_LABELS } from "@/lib/cards/theme";

/** The image size. */
export const SCORE_CARD_SIZE = { width: 1000, height: 510 } as const;

/**
 * @function PlayerLine
 * @param props {{ player: CardPlayer; size: number }} who
 * @returns {JSX.Element} avatar, name, flag, rank and pp on one line
 */
export const PlayerLine = ({ player, size }: { player: CardPlayer; size: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
    <Avatar osuId={player.osuId} size={size} />
    <div style={{ display: "flex", fontSize: Math.round(size / 2), fontWeight: 800, ...oneLine }}>
      {player.username}
    </div>
    <Flag code={player.countryCode} height={Math.round(size / 2.6)} />
    <div style={{ display: "flex", fontSize: Math.round(size / 2.6), color: INK.soft }}>
      {[player.globalRank ? `#${int(player.globalRank)}` : null, pp(player.pp)]
        .filter(Boolean)
        .join(" · ")}
    </div>
  </div>
);

/**
 * @function ScoreCard
 * @param props {{ card: ScoreCardData; now?: number }} the parsed card, and the time (tests)
 * @returns {JSX.Element} the score image's markup
 */
export const ScoreCard = ({ card, now }: { card: ScoreCardData; now?: number }) => {
  const { score, player } = card;
  const { map } = score;
  const fullCombo = score.mapMaxCombo !== null && score.combo >= score.mapMaxCombo;
  return (
    <Frame {...SCORE_CARD_SIZE}>
      <MapHeader
        map={map}
        height={190}
        pills={[
          card.heading,
          card.tries ? `try #${card.tries}` : null,
          RULESET_LABELS[card.ruleset],
        ]}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "22px 32px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 130 }}>
          <GradeLetter grade={score.grade} size={110} />
          {!score.passed ? (
            <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: INK.muted }}>
              {score.completion !== null ? `failed at ${Math.round(score.completion)}%` : "failed"}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
            <div
              style={{
                display: "flex",
                fontSize: 58,
                fontWeight: 800,
                lineHeight: 1,
                color: score.pp === null ? INK.muted : INK.rose,
              }}
            >
              {score.pp === null ? "no pp" : `${score.ppApprox ? "≈" : ""}${pp(score.pp)}`}
            </div>
            {score.fcPp !== null && score.fcAccuracy !== null ? (
              <div style={{ display: "flex", fontSize: 20, color: INK.soft, paddingBottom: 6 }}>
                {`${pp(score.fcPp)} if FC at ${percent(score.fcAccuracy)}`}
              </div>
            ) : null}
            <div style={{ display: "flex", marginLeft: "auto", paddingBottom: 4 }}>
              <Mods mods={score.mods} size={20} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            <Stat label="Accuracy" value={percent(score.accuracy)} />
            <Stat
              label={fullCombo ? "Combo · FC" : "Combo"}
              value={`${int(score.combo)}x${score.mapMaxCombo !== null ? ` / ${int(score.mapMaxCombo)}x` : ""}`}
            />
            <Stat label="Score" value={int(score.totalScore)} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {score.hits.map(({ label, count }) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <div
                  style={{
                    display: "flex",
                    color: label === "miss" && count > 0 ? INK.rose : INK.ink,
                  }}
                >
                  {int(count)}
                </div>
                <div style={{ display: "flex", fontSize: 14, color: INK.muted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          margin: "auto 32px 20px",
          paddingTop: 14,
          borderTop: `2px solid ${INK.ink}`,
        }}
      >
        <PlayerLine player={player} size={40} />
        <Signature text={ago(score.endedAt, now)} />
      </div>
    </Frame>
  );
};
