/**
 * @file src/lib/cards/ServerCard.tsx
 * @desc /server's image: the server's icon and name, the ruleset and stat, then one page of its
 *       linked players (place, avatar, flag, name, the stat), and the page along the bottom.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import { MAX_SERVER_ROWS, type ServerCard as ServerCardData } from "@haruhimemoe/harumin-config";
import { Avatar, Empty, Flag, FootLine, Frame, oneLine, TitleBlock } from "@/lib/cards/parts";
import { guildIconPng, INK, listHeight, RULESET_LABELS } from "@/lib/cards/theme";

const HEADER_HEIGHT = 138;
const ROW_HEIGHT = 54;
const FOOTER_HEIGHT = 52;

/**
 * @function serverCardSize
 * @param rows {number} rows on the page
 * @returns {{ width: number; height: number }} the image size: the frame grows with the rows
 */
export const serverCardSize = (rows: number) => ({
  width: 1000,
  height: listHeight({
    header: HEADER_HEIGHT,
    row: ROW_HEIGHT,
    rows,
    max: MAX_SERVER_ROWS,
    footer: FOOTER_HEIGHT,
  }),
});

/**
 * @function ServerCard
 * @param props {{ card: ServerCardData }} the parsed card
 * @returns {JSX.Element} the server ranking image's markup
 */
export const ServerCard = ({ card }: { card: ServerCardData }) => (
  <Frame {...serverCardSize(card.rows.length)}>
    <TitleBlock
      label={`${RULESET_LABELS[card.ruleset]} · by ${card.stat}`}
      title={card.guild.name}
      subtitle={`${card.total} linked member${card.total === 1 ? "" : "s"}`}
      height={HEADER_HEIGHT}
      side={
        card.guild.icon ? (
          <img
            src={guildIconPng(card.guild.id, card.guild.icon)}
            width={84}
            height={84}
            alt=""
            style={{ borderRadius: 14, border: `3px solid ${INK.ink}` }}
          />
        ) : null
      }
    />
    {card.rows.length ? (
      card.rows.map((row, i) => (
        <div
          key={row.place}
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
              fontSize: 21,
              fontWeight: 800,
              color: row.place === 1 ? INK.rose : INK.muted,
            }}
          >
            {`#${row.place}`}
          </div>
          <Avatar osuId={row.osuId} size={40} />
          <div style={{ display: "flex", width: 34 }}>
            <Flag code={row.countryCode} height={20} />
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
          <div
            style={{
              display: "flex",
              fontSize: 23,
              fontWeight: 800,
              color: row.place === 1 ? INK.rose : INK.ink,
            }}
          >
            {row.value}
          </div>
        </div>
      ))
    ) : (
      <Empty text="Nobody here has linked an osu! account yet." height={ROW_HEIGHT} />
    )}
    <FootLine left={card.pages > 1 ? `page ${card.page} of ${card.pages}` : null} />
  </Frame>
);
