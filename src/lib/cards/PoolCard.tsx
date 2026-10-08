/**
 * @file src/lib/cards/PoolCard.tsx
 * @desc The pack and pool image (/pack, /pool view, check and parse, and their links): the
 *       name, where it came from and its star span, then one row per slot with its bucket chip,
 *       map, stars and length. The check view adds each map's verdict on the right.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import { MAX_POOL_SLOTS, type PoolCard as PoolCardData } from "@haruhimemoe/harumin-config";
import { Empty, FootLine, Frame, oneLine, Stars, TitleBlock } from "@/lib/cards/parts";
import { duration, INK, int, listHeight, stars } from "@/lib/cards/theme";

const HEADER_HEIGHT = 138;
const ROW_HEIGHT = 42;
const FOOTER_HEIGHT = 52;

/**
 * @function poolCardSize
 * @param rows {number} slots on the card
 * @returns {{ width: number; height: number }} the image size: the frame grows with the slots
 */
export const poolCardSize = (rows: number) => ({
  width: 1000,
  height: listHeight({
    header: HEADER_HEIGHT,
    row: ROW_HEIGHT,
    rows,
    max: MAX_POOL_SLOTS,
    footer: FOOTER_HEIGHT,
  }),
});

const LABELS: Readonly<Record<PoolCardData["source"], string>> = {
  pack: "packs.haruhime.moe",
  pool: "pools.haruhime.moe",
  check: "Content rules",
  parsed: "Pasted pool",
};

/** How each verdict reads, and whether it's the rose (not allowed) or muted. */
const CHECKS = {
  ok: { text: "fine", color: INK.soft, fill: false },
  potential: { text: "look closer", color: INK.ink, fill: false },
  disallowed: { text: "not allowed", color: INK.rose, fill: true },
  unknown: { text: "unknown", color: INK.muted, fill: false },
} as const;

/**
 * @function Chip
 * @param props {{ label: string; mod: string | null }} the slot
 * @returns {JSX.Element} the slot label: NM in outline, TB in rose, every other bucket in ink
 */
const Chip = ({ label, mod }: { label: string; mod: string | null }) => {
  const outline = mod === "NM" || mod === null;
  const fill = mod === "TB" ? INK.rose : INK.ink;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: 64,
        fontSize: 16,
        fontWeight: 800,
        padding: "2px 0",
        borderRadius: 4,
        border: `2px solid ${outline ? INK.ink : fill}`,
        background: outline ? INK.paper : fill,
        color: outline ? INK.ink : INK.paper,
      }}
    >
      {label}
    </div>
  );
};

/**
 * @function PoolCard
 * @param props {{ card: PoolCardData }} the parsed card
 * @returns {JSX.Element} the pack or pool image's markup
 */
export const PoolCard = ({ card }: { card: PoolCardData }) => {
  const span = card.stars
    ? card.stars.min === card.stars.max
      ? stars(card.stars.min)
      : `${stars(card.stars.min)}–${stars(card.stars.max)}`
    : null;
  const shown = card.slots.length;
  return (
    <Frame {...poolCardSize(shown)}>
      <TitleBlock
        label={LABELS[card.source]}
        title={card.name || "Untitled"}
        subtitle={card.subtitle}
        height={HEADER_HEIGHT}
        side={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
              {int(card.mapCount)}
            </div>
            <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: INK.muted }}>
              {card.mapCount === 1 ? "MAP" : "MAPS"}
            </div>
            {span ? <Stars value={span} size={18} color={INK.soft} /> : null}
          </div>
        }
      />
      {shown ? (
        card.slots.map((slot, i) => {
          const check = slot.check ? CHECKS[slot.check] : null;
          return (
            <div
              key={`${slot.label}-${slot.beatmapId}`}
              style={{
                display: "flex",
                alignItems: "center",
                height: ROW_HEIGHT,
                padding: "0 28px",
                gap: 16,
                borderTop: i === 0 ? "none" : `1.5px solid ${INK.rule}`,
              }}
            >
              <Chip label={slot.label} mod={slot.mod} />
              <div
                style={{
                  display: "flex",
                  flexGrow: 1,
                  flexBasis: 0,
                  minWidth: 0,
                  fontSize: 19,
                  fontWeight: slot.title ? 800 : 400,
                  color: slot.title ? INK.ink : INK.muted,
                  ...oneLine,
                }}
              >
                {slot.title ?? `#${slot.beatmapId}`}
              </div>
              <div style={{ display: "flex", width: 74, justifyContent: "flex-end", fontSize: 18 }}>
                {slot.stars !== null ? (
                  <Stars value={stars(slot.stars)} size={18} color={INK.ink} />
                ) : null}
              </div>
              <div
                style={{
                  display: "flex",
                  width: 58,
                  justifyContent: "flex-end",
                  fontSize: 17,
                  color: INK.soft,
                }}
              >
                {slot.lengthSeconds !== null ? duration(slot.lengthSeconds) : ""}
              </div>
              {card.source === "check" ? (
                <div style={{ display: "flex", width: 124, justifyContent: "flex-end" }}>
                  {check ? (
                    <div
                      style={{
                        display: "flex",
                        fontSize: 14,
                        fontWeight: 800,
                        padding: "2px 9px",
                        borderRadius: 4,
                        border: `2px solid ${check.color}`,
                        background: check.fill ? check.color : INK.paper,
                        color: check.fill ? INK.paper : check.color,
                      }}
                    >
                      {check.text}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })
      ) : (
        <Empty text="No maps." height={ROW_HEIGHT} />
      )}
      <FootLine
        left={
          [card.note, card.mapCount > shown ? `${card.mapCount - shown} more not shown` : null]
            .filter(Boolean)
            .join(" · ") || null
        }
      />
    </Frame>
  );
};
