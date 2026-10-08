/**
 * @file src/lib/bot.ts
 * @desc The bot's service routes (bearer HARUMIN_SERVICE_TOKEN): which guilds a Discord user
 *       manages, a guild's text channels, and telling the bot a guild's settings changed. The
 *       guild list always comes from the bot, never from the browser.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";
import {
  type GuildChannels,
  guildChannelsSchema,
  type ManageableGuild,
  manageableGuildsSchema,
  SERVICE_ROUTES,
} from "@haruhimemoe/harumin-config";
import { getServerEnv } from "@/env";

/** createBotClient's options. */
export type BotClientOptions = { baseUrl: string; token: string; fetch?: typeof fetch };

/** Thrown when the bot can't be reached or answers badly. */
export class BotUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "BotUnavailableError";
  }
}

/**
 * @function createBotClient
 * @param options {BotClientOptions} the bot's service URL, token and fetch (tests)
 * @returns {{ manageableGuilds; guildChannels; revalidate; revalidateUser }} the four calls
 */
export const createBotClient = ({ baseUrl, token, fetch: fetchImpl = fetch }: BotClientOptions) => {
  const call = async (path: string, init: RequestInit = {}): Promise<Response> => {
    try {
      const response = await fetchImpl(new URL(path, baseUrl), {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });
      if (response.status >= 500 || response.status === 401) {
        throw new BotUnavailableError(`the bot answered ${response.status}`);
      }
      return response;
    } catch (error) {
      if (error instanceof BotUnavailableError) throw error;
      throw new BotUnavailableError("the bot isn't reachable", { cause: error });
    }
  };

  return {
    async manageableGuilds(discordId: string): Promise<ManageableGuild[]> {
      const response = await call(
        `${SERVICE_ROUTES.manageableGuilds}?discordId=${encodeURIComponent(discordId)}`,
      );
      const parsed = manageableGuildsSchema.safeParse(await response.json().catch(() => null));
      if (!response.ok || !parsed.success)
        throw new BotUnavailableError("the bot sent no guild list");
      return parsed.data.guilds;
    },
    async guildChannels(guildId: string): Promise<GuildChannels["channels"]> {
      const response = await call(
        SERVICE_ROUTES.guildChannels.replace(":guildId", encodeURIComponent(guildId)),
      );
      if (response.status === 404) return [];
      const parsed = guildChannelsSchema.safeParse(await response.json().catch(() => null));
      return parsed.success ? parsed.data.channels : [];
    },
    async revalidate(guildId: string): Promise<void> {
      await call(SERVICE_ROUTES.revalidate, {
        method: "POST",
        body: JSON.stringify({ guildId }),
        headers: { "Content-Type": "application/json" },
      });
    },
    async revalidateUser(osuId: number): Promise<void> {
      await call(SERVICE_ROUTES.revalidateUser, {
        method: "POST",
        body: JSON.stringify({ osuId }),
        headers: { "Content-Type": "application/json" },
      });
    },
  };
};

/** The bot client. */
export type BotClient = ReturnType<typeof createBotClient>;

/**
 * @function getBot
 * @returns {BotClient} the client from env
 */
export const getBot = (): BotClient => {
  const env = getServerEnv();
  return createBotClient({ baseUrl: env.HARUMIN_SERVICE_URL, token: env.HARUMIN_SERVICE_TOKEN });
};
