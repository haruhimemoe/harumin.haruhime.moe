/**
 * @file src/lib/cards/ProfileCard.tsx
 * @desc /osu's image: the cover under an ink fade, the avatar, name, flag, country rank and
 *       supporter heart, the global rank big in ink (rose got lost on pink covers), then pp,
 *       accuracy, level, plays, play time and max combo, the favorite line, and the grade
 *       counts. The player's accent colors only what sits on paper (pp, the rule, the
 *       favorite). With `cover: "hole"` the cover box and the paper are left transparent for the bot's gif.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Thu Oct 8, 2026
 */

import {
  CARD_LAYOUT,
  type Grade,
  type ProfileCard as ProfileCardData,
} from "@haruhimemoe/harumin-config";
import {
  Avatar,
  Flag,
  Frame,
  GradeLetter,
  oneLine,
  Pill,
  Signature,
  Stat,
  SupporterHeart,
} from "@/lib/cards/parts";
import {
  accentColor,
  alpha,
  hours,
  INK,
  int,
  modsText,
  percent,
  pp,
  RULESET_LABELS,
} from "@/lib/cards/theme";

/** The image size. */
export const PROFILE_CARD_SIZE = {
  width: CARD_LAYOUT.profile.width,
  height: CARD_LAYOUT.profile.height,
} as const;

const COVER = CARD_LAYOUT.profile.cover;

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
  const hole = card.cover === "hole";
  const accent = accentColor(card.theme?.accent);
  const favorite = card.theme?.favorite ?? null;
  const joined = card.joinDate
    ? new Date(card.joinDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  return (
    <Frame {...PROFILE_CARD_SIZE} transparent={hole}>
      <div
        style={{
          position: "relative",
          display: "flex",
          height: COVER.height,
          background: hole ? "transparent" : INK.ink,
        }}
      >
        {hole ? (
          // The cover goes under this PNG later; dim it the way opacity 0.8 on ink does.
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              background: alpha(INK.ink, 0.2),
            }}
          />
        ) : player.coverUrl ? (
          <img
            src={player.coverUrl}
            width={COVER.width}
            height={COVER.height}
            alt=""
            style={{ width: "100%", height: COVER.height, objectFit: "cover", opacity: 0.8 }}
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
            backgroundImage: `linear-gradient(180deg, ${alpha(INK.ink, 0)} 40%, ${alpha(INK.ink, 0.45)} 100%)`,
          }}
        />
        <div style={{ position: "absolute", top: 16, left: 18, display: "flex" }}>
          <Pill text={`${RULESET_LABELS[card.ruleset]} profile`} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", padding: "0 32px", marginTop: -64 }}>
        <Avatar osuId={player.osuId} size={132} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0,
            marginLeft: 22,
            marginTop: 72,
          }}
        >
          <div
            style={{ display: "flex", fontSize: 42, fontWeight: 800, lineHeight: 1.1, ...oneLine }}
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
            {player.supporter ? <SupporterHeart size={22} /> : null}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 80 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 1.5,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: INK.muted,
            }}
          >
            <div>Global</div>
            <div>rank</div>
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
            {player.globalRank ? `#${int(player.globalRank)}` : "unranked"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "26px 32px 0",
          paddingTop: 20,
          borderTop: `2px solid ${accent}`,
        }}
      >
        <Stat label="pp" value={int(Math.round(player.pp))} big color={accent} />
        <Stat label="Accuracy" value={percent(card.accuracy)} big />
        <Stat label="Level" value={String(Math.floor(card.level))} big />
        <Stat label="Plays" value={int(card.playCount)} big />
        <Stat label="Play time" value={hours(card.playTime)} big />
        <Stat label="Max combo" value={`${int(card.maxCombo)}x`} big />
      </div>

      {favorite ? (
        <div
          style={{
            display: "flex",
            margin: "14px 32px 0",
            fontSize: 20,
            fontWeight: 800,
            color: accent,
            ...oneLine,
          }}
        >
          {[
            `Favorite: ${favorite.title}`,
            favorite.pp !== null ? pp(favorite.pp) : null,
            modsText(favorite.mods),
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      ) : null}

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
