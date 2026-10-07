/**
 * @file src/constants/site.ts
 * @desc The site's name, URL and copy, the bot's invite link, and where things live.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The site. */
export const SITE = Object.freeze({
  name: "harumin",
  url: "https://harumin.haruhime.moe",
  description:
    "harumin is an osu! Discord bot: profiles, recent plays, top plays and pp, map cards for links, match costs, tracking, and the haruhime packs and pools tools.",
  parentUrl: "https://haruhime.moe",
});

/** The Discord application (the same one since 2024). Public: it's in every invite link. */
export const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ?? "";

/** What the invite asks for: view, send, embed, attach, history, external emoji. Nothing that moderates. */
export const INVITE_PERMISSIONS = "379904";

/**
 * @function inviteUrl
 * @param guildId {string | undefined} preselect a server
 * @returns {string} the bot's install link
 */
export const inviteUrl = (guildId?: string): string => {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", DISCORD_CLIENT_ID);
  url.searchParams.set("scope", "bot applications.commands");
  url.searchParams.set("permissions", INVITE_PERMISSIONS);
  if (guildId) {
    url.searchParams.set("guild_id", guildId);
    url.searchParams.set("disable_guild_select", "true");
  }
  return url.href;
};

/** Outside links. */
export const LINKS = Object.freeze({
  support: "https://haruhime.moe/discord",
  source: "https://github.com/haruhimemoe/harumin",
  account: "https://haruhime.moe/account",
  packs: "https://packs.haruhime.moe",
  pools: "https://pools.haruhime.moe",
  bb: "https://bb.haruhime.moe",
});

/** The hub's sign-in route (goes straight to osu!). */
export const HUB_SIGN_IN_PATH = "/api/signin/osu";
