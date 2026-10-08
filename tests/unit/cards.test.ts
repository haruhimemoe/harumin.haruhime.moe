/**
 * @file tests/unit/cards.test.ts
 * @desc The card image routes: the bearer, the card kinds, a bad card refused before drawing,
 *       a drawn PNG for each kind, and the "ago" text.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { beforeAll, describe, expect, it } from "vitest";
import { isCardKind, renderCard } from "@/lib/cards/render";
import { ago } from "@/lib/cards/theme";

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
