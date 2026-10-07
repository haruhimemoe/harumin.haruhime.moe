/**
 * @file src/lib/cards/parts.tsx
 * @desc Pieces the card images share: the paper frame with its ink panel border and screentone
 *       corner, the avatar, a flag, a stat (small label over a big number), mod pills, a label
 *       pill, star rating (an SVG star: Nunito has no ★), the harumin signature and the grade
 *       letter. Satori markup: every box with more than one
 *       child is a flex box, and every image has a size.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { Grade } from "@haruhimemoe/harumin-config";
import type { CSSProperties, ReactNode } from "react";
import {
  avatarUrl,
  flagUrl,
  GRADE_LABELS,
  gradeColor,
  INK,
  modsText,
  SCREENTONE,
} from "@/lib/cards/theme";

/** One line, cut with an ellipsis. */
export const oneLine: CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

/**
 * @function Frame
 * @param props {{ width: number; height: number; children: ReactNode }} the image size
 * @returns {JSX.Element} white paper inside a thin ink panel border, with a screentone corner
 */
export const Frame = ({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      background: INK.paper,
      fontFamily: "Nunito",
      color: INK.ink,
      padding: 10,
    }}
  >
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        border: `3px solid ${INK.ink}`,
        borderRadius: 6,
        overflow: "hidden",
        background: INK.paper,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 260,
          height: 180,
          ...SCREENTONE,
          // Satori has no mask-image: fade the dots with a paper gradient laid over them.
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 260,
          height: 180,
          display: "flex",
          backgroundImage: `linear-gradient(135deg, ${INK.paper} 30%, ${INK.paper}00 100%)`,
        }}
      />
      {children}
    </div>
  </div>
);

/**
 * @function Avatar
 * @param props {{ osuId: number; size: number }} whose, and how big
 * @returns {JSX.Element} the avatar in an ink frame
 */
export const Avatar = ({ osuId, size }: { osuId: number; size: number }) => (
  <img
    src={avatarUrl(osuId)}
    width={size}
    height={size}
    alt=""
    style={{
      width: size,
      height: size,
      borderRadius: Math.round(size / 6),
      border: `3px solid ${INK.ink}`,
      background: INK.tone,
      objectFit: "cover",
    }}
  />
);

/**
 * @function Flag
 * @param props {{ code: string | null; height: number }} a country code
 * @returns {JSX.Element | null} osu!'s flag, or nothing
 */
export const Flag = ({ code, height }: { code: string | null; height: number }) =>
  code ? (
    <img
      src={flagUrl(code)}
      width={Math.round(height * 1.4)}
      height={height}
      alt=""
      style={{ borderRadius: 3 }}
    />
  ) : null;

/**
 * @function Stat
 * @param props {{ label: string; value: string; big?: boolean; accent?: boolean }}
 * @returns {JSX.Element} a small label over its number
 */
export const Stat = ({
  label,
  value,
  big = false,
  accent = false,
}: {
  label: string;
  value: string;
  big?: boolean;
  accent?: boolean;
}) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <div
      style={{
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: INK.muted,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: big ? 40 : 26,
        fontWeight: 800,
        lineHeight: 1.1,
        color: accent ? INK.rose : INK.ink,
      }}
    >
      {value}
    </div>
  </div>
);

/**
 * @function Mods
 * @param props {{ mods: readonly string[]; size?: number }} acronyms
 * @returns {JSX.Element} one ink pill per mod, or a light "NM"
 */
export const Mods = ({ mods, size = 18 }: { mods: readonly string[]; size?: number }) => (
  <div style={{ display: "flex", gap: 5 }}>
    {(mods.length ? mods : [modsText(mods)]).map((mod) => (
      <div
        key={mod}
        style={{
          display: "flex",
          fontSize: size,
          fontWeight: 800,
          padding: `${Math.round(size / 6)}px ${Math.round(size / 2.2)}px`,
          borderRadius: 4,
          border: `2px solid ${INK.ink}`,
          background: mods.length ? INK.ink : INK.paper,
          color: mods.length ? INK.paper : INK.ink,
        }}
      >
        {mod}
      </div>
    ))}
  </div>
);

/**
 * @function GradeLetter
 * @param props {{ grade: Grade; size: number }} the grade and its font size
 * @returns {JSX.Element} the letter, rose for the silver grades
 */
export const GradeLetter = ({ grade, size }: { grade: Grade; size: number }) => (
  <div
    style={{
      display: "flex",
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: -2,
      color: gradeColor(grade),
    }}
  >
    {GRADE_LABELS[grade]}
  </div>
);

/**
 * @function Signature
 * @param props {{ text?: string }} words before the name, like the ruleset
 * @returns {JSX.Element} "harumin" in ink with a rose dot, the way a mangaka signs a page
 */
export const Signature = ({ text }: { text?: string | undefined }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16 }}>
    {text ? <div style={{ color: INK.muted, fontWeight: 800 }}>{text}</div> : null}
    <div style={{ display: "flex", alignItems: "center", fontWeight: 800, color: INK.ink }}>
      harumin
      <div
        style={{
          width: 7,
          height: 7,
          marginLeft: 3,
          borderRadius: 7,
          background: INK.rose,
        }}
      />
    </div>
  </div>
);

/**
 * @function Pill
 * @param props {{ text: string }} a short label
 * @returns {JSX.Element} ink text on a paper pill, for the cover's corner
 */
export const Pill = ({ text }: { text: string }) => (
  <div
    style={{
      display: "flex",
      fontSize: 16,
      fontWeight: 800,
      padding: "3px 12px",
      borderRadius: 4,
      background: INK.paper,
      color: INK.ink,
    }}
  >
    {text}
  </div>
);

/**
 * @function Stars
 * @param props {{ value: string; size: number; color: string }} the rating text
 * @returns {JSX.Element} the number and a drawn star
 */
export const Stars = ({ value, size, color }: { value: string; size: number; color: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: Math.round(size / 6), color }}>
    {value}
    <svg width={size * 0.85} height={size * 0.85} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={color}
        d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3 1.7 9.3l7.2-.9z"
      />
    </svg>
  </div>
);
