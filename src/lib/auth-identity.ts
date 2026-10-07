/**
 * @file src/lib/auth-identity.ts
 * @desc The Discord id a user linked on the hub, read from their identity user row.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { type Db, ObjectId } from "mongodb";

/**
 * @function readDiscordId
 * @param identityDb {Db} the identity database
 * @param userId {string} the identity user's id (better-auth stores an ObjectId)
 * @returns {Promise<string | null>} the Discord id they linked on the hub, or null
 */
export const readDiscordId = async (identityDb: Db, userId: string): Promise<string | null> => {
  const _id = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
  const row = await identityDb
    .collection("user")
    .findOne({ _id } as Record<string, unknown>, { projection: { discordId: 1 } });
  return typeof row?.discordId === "string" && /^\d{17,20}$/.test(row.discordId)
    ? row.discordId
    : null;
};
