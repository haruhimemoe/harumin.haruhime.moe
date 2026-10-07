/**
 * @file src/lib/settings.ts
 * @desc Guild settings and tracks in harumin's database, through harumin-config's schemas so the
 *       bot can always read what's written: read with defaults, save a dashboard change (strict
 *       patch, merged, upserted), and list a guild's tracks.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";
import {
  applyGuildSettingsPatch,
  type GuildSettings,
  type GuildSettingsPatch,
  HARUMIN_COLLECTIONS,
  readGuildSettings,
  type TrackEntry,
  trackEntrySchema,
} from "@haruhimemoe/harumin-config";
import type { Db } from "mongodb";

/**
 * @function loadSettings
 * @param db {Db} harumin's database
 * @param guildId {string} the guild
 * @returns {Promise<GuildSettings>} stored settings with defaults filled in
 */
export const loadSettings = async (db: Db, guildId: string): Promise<GuildSettings> =>
  readGuildSettings(
    guildId,
    await db
      .collection(HARUMIN_COLLECTIONS.guildSettings)
      .findOne({ guildId }, { projection: { _id: 0 } }),
  );

/**
 * @function saveSettings
 * @param db {Db} harumin's database
 * @param guildId {string} the guild
 * @param patch {GuildSettingsPatch} a parsed change
 * @param by {string} the Discord id saving
 * @returns {Promise<GuildSettings>} the settings now stored
 */
export const saveSettings = async (
  db: Db,
  guildId: string,
  patch: GuildSettingsPatch,
  by: string,
): Promise<GuildSettings> => {
  const next = applyGuildSettingsPatch(await loadSettings(db, guildId), patch, by);
  await db
    .collection(HARUMIN_COLLECTIONS.guildSettings)
    .updateOne({ guildId }, { $set: next }, { upsert: true });
  return next;
};

/**
 * @function listTracks
 * @param db {Db} harumin's database
 * @param guildId {string} the guild
 * @returns {Promise<TrackEntry[]>} its /track entries, oldest first (bad rows left out)
 */
export const listTracks = async (db: Db, guildId: string): Promise<TrackEntry[]> => {
  const rows = await db
    .collection(HARUMIN_COLLECTIONS.tracks)
    .find({ guildId }, { projection: { _id: 0 } })
    .sort({ addedAt: 1 })
    .limit(100)
    .toArray();
  return rows.flatMap((row) => {
    const parsed = trackEntrySchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
};
