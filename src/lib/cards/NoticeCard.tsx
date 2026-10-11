/**
 * @file src/lib/cards/NoticeCard.tsx
 * @desc An error or confirmation as an image: a colored bar for its tone (rose for errors, green
 *       for done, ink for notes) and its text, with bold and code runs. The height follows the
 *       text: words are wrapped at a guessed width to count the lines.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 10, 2026
 * @modified Sun Oct 11, 2026
 */

import type { NoticeCard as NoticeCardData } from "@haruhimemoe/harumin-config";
import { Frame } from "@/lib/cards/parts";
import { INK } from "@/lib/cards/theme";

const WIDTH = 1000;
const FONT = 26;
const LINE = 36;
/** About how many characters of Nunito at 26px fit across the text column. */
const LINE_CHARS = 64;

const TONE_COLORS: Readonly<Record<NoticeCardData["tone"], string>> = {
  error: INK.rose,
  ok: "#2f7d4a",
  info: INK.soft,
};

/**
 * @function noticeLines
 * @param card {NoticeCardData} the notice
 * @returns {number} how many lines its words wrap to (at least 1)
 */
export const noticeLines = (card: NoticeCardData): number => {
  const words = card.parts
    .map((part) => part.text)
    .join("")
    .split(/\s+/)
    .filter(Boolean);
  let lines = 1;
  let used = 0;
  for (const word of words) {
    const length = Math.min(word.length, LINE_CHARS);
    if (used > 0 && used + 1 + length > LINE_CHARS) {
      lines++;
      used = length;
    } else {
      used += (used > 0 ? 1 : 0) + length;
    }
  }
  return lines;
};

/**
 * @function noticeCardSize
 * @param card {NoticeCardData} the notice
 * @returns {{ width: number; height: number }} the image size for its text
 */
export const noticeCardSize = (card: NoticeCardData) => ({
  width: WIDTH,
  height: 20 + 48 + noticeLines(card) * LINE,
});

/**
 * @function NoticeCard
 * @param props {{ card: NoticeCardData }} the parsed card
 * @returns {JSX.Element} the notice image's markup
 */
export const NoticeCard = ({ card }: { card: NoticeCardData }) => {
  // Satori wraps whole spans, so each word is its own span; a run's words keep its style.
  const words = card.parts.flatMap((part) =>
    part.text
      .split(/(\s+)/)
      .filter((piece) => piece.trim() !== "")
      .map((text, i, all) => ({
        text,
        style: part.style,
        // A space after it unless the run ends without one (so "peppy" + "'s" stay together).
        space: i < all.length - 1 || /\s$/.test(part.text),
        lead: i === 0 && /^\s/.test(part.text),
      })),
  );
  return (
    <Frame {...noticeCardSize(card)}>
      <div style={{ display: "flex", flexGrow: 1 }}>
        <div style={{ display: "flex", width: 10, background: TONE_COLORS[card.tone] }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
            padding: "0 26px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              fontSize: FONT,
              lineHeight: `${LINE}px`,
              fontWeight: 700,
              color: INK.ink,
            }}
          >
            {words.map((word, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: words are fixed for one draw
                key={i}
                style={{
                  display: "flex",
                  marginLeft: word.lead ? 8 : 0,
                  marginRight: word.space ? 8 : 0,
                  fontWeight: word.style === "plain" ? 700 : 800,
                  color: word.style === "bold" ? TONE_COLORS[card.tone] : INK.ink,
                  ...(word.style === "code"
                    ? { background: INK.tone, padding: "0 6px", borderRadius: 4 }
                    : {}),
                }}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
};
