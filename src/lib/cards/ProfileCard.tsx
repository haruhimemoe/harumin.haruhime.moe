/**
 * @file src/lib/cards/ProfileCard.tsx
 * @desc /osu's image: the cover under an ink fade, the avatar and name, the global rank big in
 *       rose, then pp, accuracy, level, plays, play time and max combo, and the grade counts.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { Grade, ProfileCard as ProfileCardData } from "@haruhimemoe/harumin-config";
import {
  Avatar,
  Flag,
  Frame,
  GradeLetter,
  oneLine,
  Pill,
  Signature,
  Stat,
} from "@/lib/cards/parts";
import { hours, INK, int, percent, RULESET_LABELS } from "@/lib/cards/theme";

/** The image size. */
export const PROFILE_CARD_SIZE = { width: 1000, height: 470 } as const;

const GRADE_ROWS: readonly { grade: Grade; key: keyof ProfileCardData["grades"] }[] = [
  { grade: "XH", key: "ssh" },
  { grade: "X", key: "ss" },
  { grade: "SH", key: "sh" },
  { grade: "S", key: "s" },
  { grade: "A", key: "a" },
];

/**
 * @function ProfileCard
 * @param props {{ card: ProfileCardData }} the parsed card
 * @returns {JSX.Element} the profile image's markup
 */
export const ProfileCard = ({ card }: { card: ProfileCardData }) => {
  const { player } = card;
  const joined = card.joinDate
    ? new Date(card.joinDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  return (
    <Frame {...PROFILE_CARD_SIZE}>
      <div style={{ position: "relative", display: "flex", height: 170, background: INK.ink }}>
        {player.coverUrl ? (
          <img
            src={player.coverUrl}
            width={974}
            height={170}
            alt=""
            style={{ width: "100%", height: 170, objectFit: "cover", opacity: 0.75 }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(180deg, ${INK.ink}00 30%, ${INK.ink}cc 100%)`,
          }}
        />
        <div style={{ position: "absolute", top: 16, left: 18, display: "flex" }}>
          <Pill text={`${RULESET_LABELS[card.ruleset]} profile`} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", padding: "0 32px", marginTop: -64 }}>
        <Avatar osuId={player.osuId} size={132} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0,
            marginLeft: 22,
            paddingBottom: 4,
          }}
        >
          <div
            style={{ display: "flex", fontSize: 46, fontWeight: 800, lineHeight: 1.1, ...oneLine }}
          >
            {player.username}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 20,
              color: INK.soft,
            }}
          >
            <Flag code={player.countryCode} height={20} />
            {player.countryRank ? (
              <div
                style={{ display: "flex", fontWeight: 800 }}
              >{`#${int(player.countryRank)}`}</div>
            ) : null}
            {player.supporter ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: INK.rose,
                  color: INK.paper,
                }}
              >
                supporter
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, color: INK.rose }}>
            {player.globalRank ? `#${int(player.globalRank)}` : "unranked"}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: INK.muted,
            }}
          >
            Global rank
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "26px 32px 0",
          paddingTop: 20,
          borderTop: `2px solid ${INK.ink}`,
        }}
      >
        <Stat label="pp" value={int(Math.round(player.pp))} big />
        <Stat label="Accuracy" value={percent(card.accuracy)} big />
        <Stat label="Level" value={String(Math.floor(card.level))} big />
        <Stat label="Plays" value={int(card.playCount)} big />
        <Stat label="Play time" value={hours(card.playTime)} big />
        <Stat label="Max combo" value={`${int(card.maxCombo)}x`} big />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          margin: "auto 32px 22px",
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          {GRADE_ROWS.map(({ grade, key }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <GradeLetter grade={grade} size={30} />
              <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: INK.soft }}>
                {int(card.grades[key])}
              </div>
            </div>
          ))}
        </div>
        <Signature text={joined ? `joined ${joined}` : undefined} />
      </div>
    </Frame>
  );
};
