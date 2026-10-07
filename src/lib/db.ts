/**
 * @file src/lib/db.ts
 * @desc One MongoClient per process (kept on globalThis so dev reloads don't leak clients), built
 *       on first use. harumin's own database holds guild settings and tracks (the bot reads the
 *       same); the hub's identity database is read-only from here.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";
import { type Db, MongoClient } from "mongodb";
import { getServerEnv } from "@/env";

/** harumin's database. */
export const DB_NAME = "harumin";
/** The hub's database: users and sessions. Never written here. */
export const IDENTITY_DB_NAME = "identity";

const holder = globalThis as typeof globalThis & { __haruminMongo?: MongoClient };

/**
 * @function getMongoClient
 * @returns {MongoClient} the shared client (connects on its first operation)
 */
export const getMongoClient = (): MongoClient => {
  holder.__haruminMongo ??= new MongoClient(getServerEnv().MONGODB_URI);
  return holder.__haruminMongo;
};

/**
 * @function getDb
 * @returns {Db} harumin's database
 */
export const getDb = (): Db => getMongoClient().db(DB_NAME);

/**
 * @function getIdentityDb
 * @returns {Db} the identity database (read-only)
 */
export const getIdentityDb = (): Db => getMongoClient().db(IDENTITY_DB_NAME);
