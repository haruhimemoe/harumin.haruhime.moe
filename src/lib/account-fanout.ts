/**
 * @file src/lib/account-fanout.ts
 * @desc What the hub's account fan-out (/api/internal/account/[op]) exports and deletes in
 *       harumin, given only an identity user id: their card settings, found by the osu! id the
 *       hub's identity database holds for them (read-only). A user with no osu! id has nothing
 *       here, so export answers { cardSettings: null } and delete removes nothing.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import "server-only";
import type { UserSettings } from "@haruhimemoe/harumin-config";
import { type Db, ObjectId } from "mongodb";
import { deleteUserSettings, exportUserSettings } from "@/lib/user-settings";

/**
 * @function osuIdOf
 * @param identity {Db} the hub's identity database
 * @param userId {string} an identity user id (24 hex)
 * @returns {Promise<number | null>} their osu! id, or null when there's none
 */
export const osuIdOf = async (identity: Db, userId: string): Promise<number | null> => {
  if (!ObjectId.isValid(userId)) return null;
  const user = await identity
    .collection("user")
    .findOne({ _id: new ObjectId(userId) }, { projection: { osuId: 1 } });
  return typeof user?.osuId === "number" ? user.osuId : null;
};

/**
 * @function exportAccountData
 * @param dbs {{ db: Db; identity: Db }} harumin's and the hub's databases
 * @param userId {string} an identity user id
 * @returns {Promise<{ cardSettings: UserSettings | null }>} their card settings
 */
export const exportAccountData = async (
  { db, identity }: { db: Db; identity: Db },
  userId: string,
): Promise<{ cardSettings: UserSettings | null }> => {
  const osuId = await osuIdOf(identity, userId);
  return { cardSettings: osuId === null ? null : await exportUserSettings(db, osuId) };
};

/**
 * @function deleteAccountData
 * @param dbs {{ db: Db; identity: Db }} harumin's and the hub's databases
 * @param userId {string} an identity user id
 * @returns {Promise<void>} once their card settings are gone (safe to repeat)
 */
export const deleteAccountData = async (
  { db, identity }: { db: Db; identity: Db },
  userId: string,
): Promise<void> => {
  const osuId = await osuIdOf(identity, userId);
  if (osuId !== null) await deleteUserSettings(db, osuId);
};
