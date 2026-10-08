/**
 * @file tests/unit/user-settings.test.ts
 * @desc The "Your card" form reader and the user_settings store (on a small in-memory fake of
 *       the three collection calls it uses).
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import type { Db } from "mongodb";
import { describe, expect, it } from "vitest";
import { deleteAccountData, exportAccountData } from "@/lib/account-fanout";
import {
  deleteUserSettings,
  exportUserSettings,
  loadUserSettings,
  readCardForm,
  saveUserSettings,
} from "@/lib/user-settings";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

/** findOne / updateOne ($set, upsert) / deleteOne on { osuId }. */
const fakeDb = () => {
  const docs = new Map<number, Record<string, unknown>>();
  const collection = {
    findOne: async (query: { osuId: number }) => docs.get(query.osuId) ?? null,
    updateOne: async (query: { osuId: number }, update: { $set: Record<string, unknown> }) => {
      docs.set(query.osuId, { ...(docs.get(query.osuId) ?? {}), ...update.$set });
    },
    deleteOne: async (query: { osuId: number }) => {
      docs.delete(query.osuId);
    },
  };
  return { collection: () => collection } as unknown as Db;
};

describe("readCardForm", () => {
  it("reads an accent, a cover and a favorite link or id", () => {
    expect(readCardForm(form({ accent: "sky", cover: "paper", favorite: "" }))).toEqual({
      ok: true,
      value: { accent: "sky", cover: "paper", favoriteBeatmapId: null },
    });
    for (const favorite of [
      "129891",
      "https://osu.ppy.sh/b/129891",
      "https://osu.ppy.sh/beatmaps/129891",
      "https://osu.ppy.sh/beatmapsets/39804#osu/129891",
    ]) {
      const read = readCardForm(form({ accent: "rose", cover: "profile", favorite }));
      expect(read.ok && read.value.favoriteBeatmapId).toBe(129891);
    }
  });

  it("refuses a made-up accent or cover, and a set link", () => {
    expect(readCardForm(form({ accent: "lime", cover: "profile" })).ok).toBe(false);
    expect(readCardForm(form({ accent: "rose", cover: "gif" })).ok).toBe(false);
    expect(
      readCardForm(
        form({
          accent: "rose",
          cover: "profile",
          favorite: "https://osu.ppy.sh/beatmapsets/39804",
        }),
      ),
    ).toEqual({
      ok: false,
      message: "Use a difficulty link (one with #osu/ and an id), or the id.",
    });
    expect(
      readCardForm(form({ accent: "rose", cover: "profile", favorite: "freedom dive" })).ok,
    ).toBe(false);
  });
});

describe("user settings store", () => {
  it("reads defaults, saves, exports, and deletes back to defaults", async () => {
    const db = fakeDb();
    expect(await loadUserSettings(db, 2)).toMatchObject({ accent: "rose", cover: "profile" });
    expect(await exportUserSettings(db, 2)).toBeNull();
    const saved = await saveUserSettings(db, 2, { accent: "teal", favoriteBeatmapId: 129891 });
    expect(saved).toMatchObject({
      osuId: 2,
      accent: "teal",
      cover: "profile",
      favoriteBeatmapId: 129891,
    });
    expect(saved.updatedAt).toBeInstanceOf(Date);
    expect(await loadUserSettings(db, 2)).toMatchObject({ accent: "teal" });
    expect(await exportUserSettings(db, 2)).toMatchObject({ accent: "teal" });
    await deleteUserSettings(db, 2);
    expect(await loadUserSettings(db, 2)).toEqual({
      osuId: 2,
      accent: "rose",
      cover: "profile",
      favoriteBeatmapId: null,
    });
  });
});

describe("account fan-out", () => {
  const USER = "65f0c0ffee0000000000abcd";
  const identity = (osuId: number | null) =>
    ({
      collection: () => ({ findOne: async () => (osuId === null ? null : { osuId }) }),
    }) as unknown as Db;

  it("exports and deletes the card settings of the user's osu! account", async () => {
    const db = fakeDb();
    await saveUserSettings(db, 2, { accent: "violet" });
    expect(
      (await exportAccountData({ db, identity: identity(2) }, USER)).cardSettings,
    ).toMatchObject({
      accent: "violet",
    });
    await deleteAccountData({ db, identity: identity(2) }, USER);
    expect(await exportUserSettings(db, 2)).toBeNull();
    expect(await loadUserSettings(db, 2)).toMatchObject({ accent: "rose" });
  });

  it("has nothing for a user with no osu! id or a bad id", async () => {
    const db = fakeDb();
    await saveUserSettings(db, 2, { accent: "violet" });
    expect(await exportAccountData({ db, identity: identity(null) }, USER)).toEqual({
      cardSettings: null,
    });
    await deleteAccountData({ db, identity: identity(2) }, "not-an-id");
    expect(await exportUserSettings(db, 2)).not.toBeNull();
  });
});
