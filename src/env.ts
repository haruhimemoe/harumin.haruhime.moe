/**
 * @file src/env.ts
 * @desc The site's server environment, read on first use (never at import, so `next build` and
 *       the public pages need none of it). Errors name variables, never values.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Thu Oct 8, 2026
 */

import "server-only";
import { z } from "zod";

const schema = z.object({
  /** The cluster holding harumin's database and the hub's identity database (read-only). */
  MONGODB_URI: z.string().startsWith("mongodb"),
  /** Shared with the haruhime.moe hub, to verify its session cookie. */
  BETTER_AUTH_SECRET: z.string().min(32),
  /** The hub's origin. */
  HUB_URL: z.url().default("https://haruhime.moe"),
  /** The hub's cookie domain (".haruhime.moe"), so sign-out clears its cookies. Unset locally. */
  HUB_COOKIE_DOMAIN: z
    .string()
    .regex(/^\.[a-z0-9-]+(?:\.[a-z0-9-]+)*$/)
    .optional(),
  /** The bot's service routes, e.g. http://harumin.internal:8787. */
  HARUMIN_SERVICE_URL: z.url(),
  /** Bearer for the bot's service routes; the same value as the bot's. */
  HARUMIN_SERVICE_TOKEN: z.string().min(32),
  /** Bearer for the hub's account fan-out (export, delete). Unset: those routes answer 503. */
  ACCOUNT_FANOUT_SECRET: z.string().min(32).optional(),
});

/** The parsed variables. */
export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | null = null;

/**
 * @function parseServerEnv
 * @param source {Record<string, string | undefined>} process.env or a test copy
 * @returns {ServerEnv} the values
 * @throws {Error} naming each missing or bad variable
 */
export const parseServerEnv = (source: Record<string, string | undefined>): ServerEnv => {
  const parsed = schema.safeParse(source);
  if (parsed.success) return parsed.data;
  const names = [...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))];
  throw new Error(`harumin.haruhime.moe: missing or invalid env: ${names.join(", ")}`);
};

/**
 * @function getServerEnv
 * @returns {ServerEnv} process.env, parsed once
 */
export const getServerEnv = (): ServerEnv => {
  cached ??= parseServerEnv(process.env);
  return cached;
};
