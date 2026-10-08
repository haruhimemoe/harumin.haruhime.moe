/**
 * @file src/lib/cards/theme.ts
 * @desc What every card image shares: harumin's ink-on-paper colors (fixed hex, since the
 *       renderer reads no CSS), the Nunito files from @haruhimemoe/brand, osu!'s image URLs
 *       built from ids (the renderer fetches nothing a caller names, except assets.ppy.sh
 *       covers the contract already checked), and number, grade and time text.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Grade, Ruleset } from "@haruhimemoe/harumin-config";

/** Ink on paper, with harumin's rose for the one accent. */
export const INK = {
  paper: "#ffffff",
  ink: "#141012",
  soft: "#4a3f42",
  muted: "#8a7b7e",
  rule: "#e6dfe1",
  tone: "#f6f1f2",
  rose: "#ac394d",
  roseLight: "#ff6680",
} as const;

/**
 * @function alpha
 * @param hex {string} a #rrggbb color
 * @param amount {number} 0 to 1
 * @returns {string} rgba(); the renderer ignores #rrggbbaa
 */
export const alpha = (hex: string, amount: number): string => {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${amount})`;
};

/** Halftone dots, like manga screentone. */
export const SCREENTONE = {
  backgroundImage: `radial-gradient(circle at center, ${alpha(INK.ink, 0.22)} 1.1px, transparent 1.6px)`,
  backgroundSize: "7px 7px",
} as const;

/** What each ruleset is called on a card. */
export const RULESET_LABELS: Readonly<Record<Ruleset, string>> = {
  osu: "osu!",
  taiko: "osu!taiko",
  fruits: "osu!catch",
  mania: "osu!mania",
};

/** How each grade reads. */
export const GRADE_LABELS: Readonly<Record<Grade, string>> = {
  XH: "SS",
  X: "SS",
  SH: "S",
  S: "S",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  F: "F",
};

/** Silver grades (hidden/flashlight) get the rose; the rest are ink. F is muted. */
export const gradeColor = (grade: Grade): string =>
  grade === "XH" || grade === "SH" ? INK.rose : grade === "F" ? INK.muted : INK.ink;

type Font = { name: string; data: ArrayBuffer; weight: 400 | 800; style: "normal" };

let fonts: Promise<Font[]> | null = null;

/**
 * @function cardFonts
 * @returns {Promise<Font[]>} Nunito 400 and 800 from @haruhimemoe/brand, read once
 */
export const cardFonts = (): Promise<Font[]> => {
  fonts ??= Promise.all(
    ([400, 800] as const).map(async (weight) => {
      const file = await readFile(
        join(process.cwd(), "node_modules/@haruhimemoe/brand/fonts", `nunito-${weight}.ttf`),
      );
      const data = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
      return { name: "Nunito", data: data as ArrayBuffer, weight, style: "normal" as const };
    }),
  );
  return fonts;
};

/** A player's avatar. */
export const avatarUrl = (osuId: number): string => `https://a.ppy.sh/${osuId}`;

/** A beatmap set's cover, wide or list-sized. */
export const mapCoverUrl = (setId: number, size: "cover@2x" | "list@2x"): string =>
  `https://assets.ppy.sh/beatmaps/${setId}/covers/${size}.jpg`;

/** osu-web's flag for a country code (the contract only lets two capitals through). */
export const flagUrl = (code: string): string =>
  `https://osu.ppy.sh/assets/images/flags/${[...code]
    .map((letter) => (0x1f1e6 + letter.charCodeAt(0) - 65).toString(16))
    .join("-")}.svg`;

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const twoDecimals = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "1,234,567". */
export const int = (value: number): string => integer.format(value);

/** "98.12%". */
export const percent = (value: number): string => `${twoDecimals.format(value)}%`;

/** "312pp" (rounded, the way osu! shows pp in lists). */
export const pp = (value: number): string => `${integer.format(Math.round(value))}pp`;

/** "5.67". */
export const stars = (value: number): string => twoDecimals.format(value);

/** "321h". */
export const hours = (seconds: number): string => `${integer.format(Math.floor(seconds / 3600))}h`;

/** "NM" for none, else "HDDT". */
export const modsText = (mods: readonly string[]): string => (mods.length ? mods.join("") : "NM");

/**
 * @function ago
 * @param iso {string} a time
 * @param now {number} epoch ms (tests pass a fixed one)
 * @returns {string} "just now", "5 minutes ago", "3 days ago", or the date past a year
 */
export const ago = (iso: string, now = Date.now()): string => {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  const steps: [number, string][] = [
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  if (seconds >= 60 * 60 * 24 * 365) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  for (const [size, unit] of steps) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
  }
  return "just now";
};

/** "3:25", or "1:02:03" past an hour. */
export const duration = (seconds: number): string => {
  const total = Math.round(seconds);
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  const [, m, s] = parts.map((n) => String(n).padStart(2, "0"));
  return parts[0] ? `${parts[0]}:${m}:${s}` : `${parts[1]}:${s}`;
};

/** "4.2", "10" (one decimal, none when whole). */
export const stat = (value: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
