/**
 * @file src/lib/auth.ts
 * @desc Who's signed in, from the haruhime.moe hub's session cookie (next-kit's session reader:
 *       signature checked against the shared secret, session and user read from identity, no
 *       writes). The dashboard also needs the Discord id the user linked on the hub: one read of
 *       their identity user row.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import "server-only";
import {
  createSessionReader,
  requireSession,
  type SessionReader,
} from "@haruhimemoe/next-kit/auth";
import { hubSignInUrl, safeNextPath } from "@haruhimemoe/next-kit/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_AFTER_SIGN_IN, HUB_DIRECT_SIGN_IN_PATH, SITE } from "@/constants/site";
import { getServerEnv } from "@/env";
import { readDiscordId } from "@/lib/auth-identity";
import { getIdentityDb } from "@/lib/db";

/** The signed-in person. */
export type SessionUser = { id: string; osuId: number; username: string; avatarUrl: string | null };

let reader: SessionReader | null = null;

const getReader = (): SessionReader => {
  const env = getServerEnv();
  reader ??= createSessionReader({
    identityDb: getIdentityDb(),
    secret: env.BETTER_AUTH_SECRET,
    hubUrl: env.HUB_URL,
  });
  return reader;
};

/**
 * @function getCurrentUser
 * @returns {Promise<SessionUser | null>} the signed-in, unbanned user, or null
 */
export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const user = await requireSession(getReader(), await headers());
  return user
    ? { id: user.id, osuId: user.osuId, username: user.username, avatarUrl: user.avatarUrl }
    : null;
};

/**
 * @function signInHref
 * @param next {string} a path on this site to come back to
 * @returns {string} the hub's osu! sign-in, returning here
 */
export const signInHref = (next: string): string =>
  hubSignInUrl(new URL(safeNextPath(next, { fallback: DEFAULT_AFTER_SIGN_IN }), SITE.url).href, {
    hubUrl: getServerEnv().HUB_URL,
    hosts: [new URL(SITE.url).hostname],
    signInPath: HUB_DIRECT_SIGN_IN_PATH,
  });

/**
 * @function requireUser
 * @param next {string} the page asking
 * @returns {Promise<SessionUser>} the user; a visitor is sent to sign in
 */
export const requireUser = async (next: string): Promise<SessionUser> => {
  const user = await getCurrentUser();
  if (!user) redirect(signInHref(next));
  return user;
};

/**
 * @function discordIdOf
 * @param user {SessionUser} the signed-in user
 * @returns {Promise<string | null>} their linked Discord id
 */
export const discordIdOf = (user: SessionUser): Promise<string | null> =>
  readDiscordId(getIdentityDb(), user.id);
