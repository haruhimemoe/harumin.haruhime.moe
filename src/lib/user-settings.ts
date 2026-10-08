/**
 * @file src/lib/user-settings.ts
 * @desc Each player's card settings in harumin's user_settings collection, keyed by osu! id and
 *       read through harumin-config's schema so the bot reads what's written: load with
 *       defaults, save a change (merged, upserted), export and delete for the hub's account
 *       fan-out. And the "Your card" form reader: accent, cover, and a favorite map as a
 *       difficulty link or id.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import "server-only";
import {
  CARD_ACCENTS,
  CARD_COVERS,
  type CardAccent,
  HARUMIN_COLLECTIONS,
  readUserSettings,
  type UserSettings,
} from "@haruhimemoe/harumin-config";
import type { Db } from "mongodb";

/** What the form may change. */
export type UserSettingsPatch = Partial<
  Pick<UserSettings, "accent" | "cover" | "favoriteBeatmapId">
>;

/** readCardForm's answer. */
export type CardFormRead =
  | { ok: true; value: Required<UserSettingsPatch> }
  | { ok: false; message: string };

/** A difficulty id alone, or at the end of a /b/, /beatmaps/ or /beatmapsets/…#mode/ link. */
const FAVORITE = /(?:\/b\/|\/beatmaps\/|#(?:osu|taiko|fruits|mania)\/)?(\d{1,10})$/;

const collection = (db: Db) => db.collection(HARUMIN_COLLECTIONS.userSettings);

/**
 * @function readCardForm
 * @param form {FormData} accent, cover, favorite
 * @returns {CardFormRead} the parsed change, or what's wrong with it
 */
export const readCardForm = (form: FormData): CardFormRead => {
  const accent = String(form.get("accent") ?? "");
  const cover = String(form.get("cover") ?? "");
  const favorite = String(form.get("favorite") ?? "").trim();
  if (!(CARD_ACCENTS as readonly string[]).includes(accent)) {
    return { ok: false, message: "Pick one of the colors." };
  }
  if (!(CARD_COVERS as readonly string[]).includes(cover)) {
    return { ok: false, message: "Pick a cover." };
  }
  let favoriteBeatmapId: number | null = null;
  if (favorite) {
    if (/\/beatmapsets\/\d+\/?$/.test(favorite)) {
      return { ok: false, message: "Use a difficulty link (one with #osu/ and an id), or the id." };
    }
    const id = Number(FAVORITE.exec(favorite)?.[1] ?? Number.NaN);
    if (!Number.isSafeInteger(id) || id < 1 || !/^(\d+|https?:\/\/\S+)$/.test(favorite)) {
      return { ok: false, message: "That isn't a beatmap link or id." };
    }
    favoriteBeatmapId = id;
  }
  return {
    ok: true,
    value: {
      accent: accent as CardAccent,
      cover: cover as UserSettings["cover"],
      favoriteBeatmapId,
    },
  };
};

/**
 * @function loadUserSettings
 * @param db {Db} harumin's database
 * @param osuId {number} the player
 * @returns {Promise<UserSettings>} stored settings with defaults filled in
 */
export const loadUserSettings = async (db: Db, osuId: number): Promise<UserSettings> =>
  readUserSettings(osuId, await collection(db).findOne({ osuId }, { projection: { _id: 0 } }));

/**
 * @function saveUserSettings
 * @param db {Db} harumin's database
 * @param osuId {number} the player
 * @param patch {UserSettingsPatch} a parsed change
 * @returns {Promise<UserSettings>} the settings now stored
 */
export const saveUserSettings = async (
  db: Db,
  osuId: number,
  patch: UserSettingsPatch,
): Promise<UserSettings> => {
  const next: UserSettings = {
    ...(await loadUserSettings(db, osuId)),
    ...patch,
    osuId,
    updatedAt: new Date(),
  };
  await collection(db).updateOne({ osuId }, { $set: next }, { upsert: true });
  return next;
};

/**
 * @function exportUserSettings
 * @param db {Db} harumin's database
 * @param osuId {number} the player
 * @returns {Promise<UserSettings | null>} what's stored, or null when they never saved
 */
export const exportUserSettings = async (db: Db, osuId: number): Promise<UserSettings | null> => {
  const stored = await collection(db).findOne({ osuId }, { projection: { _id: 0 } });
  return stored ? readUserSettings(osuId, stored) : null;
};

/**
 * @function deleteUserSettings
 * @param db {Db} harumin's database
 * @param osuId {number} the player
 * @returns {Promise<void>} once nothing is stored for them (safe to repeat)
 */
export const deleteUserSettings = async (db: Db, osuId: number): Promise<void> => {
  await collection(db).deleteOne({ osuId });
};
