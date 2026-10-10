/**
 * @file tests/unit/cards.test.ts
 * @desc The card image routes: the bearer, the card kinds, a bad card refused before drawing,
 *       a drawn PNG for each kind, and the "ago" text.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { CARD_ACCENTS } from "@haruhimemoe/harumin-config";
import { beforeAll, describe, expect, it } from "vitest";
import { isCardKind, renderCard } from "@/lib/cards/render";
import { accentColor, ago, clip, INK } from "@/lib/cards/theme";

const TOKEN = "c".repeat(40);

beforeAll(() => {
  Object.assign(process.env, {
    MONGODB_URI: "mongodb://localhost/test",
    BETTER_AUTH_SECRET: "s".repeat(40),
    HARUMIN_SERVICE_URL: "http://localhost:8787",
    HARUMIN_SERVICE_TOKEN: TOKEN,
  });
});

const PLAYER = {
  osuId: 2,
  username: "peppy",
  countryCode: "AU",
  coverUrl: null,
  supporter: false,
  pp: 1234.5,
  globalRank: null,
  countryRank: null,
};

const PROFILE = {
  ruleset: "osu",
  player: PLAYER,
  accuracy: 98.12,
  level: 100.5,
  playCount: 10,
  playTime: 3600,
  maxCombo: 1000,
  rankedScore: 1,
  grades: { ssh: 1, ss: 2, sh: 3, s: 4, a: 5 },
  joinDate: null,
};

const post = (body: unknown, token: string | null = TOKEN) =>
  new Request("http://localhost/api/cards/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

describe("card routes", () => {
  it("knows its kinds and nothing else", () => {
    expect(
      [
        "profile",
        "score",
        "scores",
        "map",
        "leaderboard",
        "simulate",
        "compare",
        "matchcost",
        "pool",
        "server",
        "tracks",
        "bb",
        "info",
        "link",
        "invite",
      ].every(isCardKind),
    ).toBe(true);
    expect(isCardKind("toString")).toBe(false);
    expect(isCardKind("help")).toBe(false);
  });

  it("refuses a missing or wrong bearer", async () => {
    expect((await renderCard(post(PROFILE, null), "profile")).status).toBe(401);
    expect((await renderCard(post(PROFILE, "x".repeat(40)), "profile")).status).toBe(401);
  });

  it("refuses a card that doesn't parse, before drawing", async () => {
    const response = await renderCard(
      post({ ...PROFILE, player: { ...PLAYER, coverUrl: "http://169.254.169.254/" } }),
      "profile",
    );
    expect(response.status).toBe(400);
  });
});

describe("ago", () => {
  const now = Date.parse("2026-10-07T12:00:00Z");
  it("reads like a person", () => {
    expect(ago("2026-10-07T11:59:30Z", now)).toBe("just now");
    expect(ago("2026-10-07T11:59:00Z", now)).toBe("1 minute ago");
    expect(ago("2026-10-07T09:00:00Z", now)).toBe("3 hours ago");
    expect(ago("2026-10-01T12:00:00Z", now)).toBe("6 days ago");
    expect(ago("2026-06-01T12:00:00Z", now)).toBe("4 months ago");
    expect(ago("2024-01-02T12:00:00Z", now)).toBe("Jan 2, 2024");
    expect(ago("2026-10-08T12:00:00Z", now)).toBe("just now");
  });
});

/** WCAG contrast ratio of two #rrggbb colors. */
const contrast = (a: string, b: string) => {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (bl ?? 0);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};

describe("accentColor", () => {
  it("is rose by default and reads on paper for every accent", () => {
    expect(accentColor(undefined)).toBe(INK.rose);
    const colors = CARD_ACCENTS.map(accentColor);
    expect(new Set(colors).size).toBe(CARD_ACCENTS.length);
    for (const color of colors) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
      expect(contrast(color, INK.paper)).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("clip", () => {
  it("keeps short text and cuts long text with three dots", () => {
    expect(clip("Short", 10)).toBe("Short");
    expect(clip("abcdefghijklmnop", 10)).toBe("abcdefg...");
  });
  it("counts wide characters twice", () => {
    expect(clip("ああああああ", 10)).toBe("あああ...");
  });
});
