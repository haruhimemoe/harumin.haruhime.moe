/**
 * @file src/constants/site.ts
 * @desc The site's name, URL, description, contact and links, the bot's invite link, the header
 *       nav and account menu, and the footer's columns.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { SHARED_MARKER_COOKIE } from "@haruhimemoe/next-kit/auth-react";
import type { SiteFooterColumn } from "@haruhimemoe/ui";
import { CONTENT } from "@/constants/content";

/** The site's name, URL, description, contact and links. */
export const SITE = {
  name: "harumin",
  title: "harumin.haruhime.moe",
  url: "https://harumin.haruhime.moe",
  description:
    "harumin is an osu! Discord bot: profiles, recent and top plays with pp, map cards for links, match costs, tracking, and the haruhime packs and pools tools.",
  contactEmail: "haruhime@haruhime.moe",
  /** The haruhime.moe Discord server: support, and the footer's Discord icon. */
  discordUrl: "https://haruhime.moe/discord",
  /** The bot's public source. */
  repoUrl: "https://github.com/haruhimemoe/harumin",
  /** This site's public source. */
  siteRepoUrl: "https://github.com/haruhimemoe/harumin.haruhime.moe",
  /** GitHub private vulnerability reporting, the first way to report one. */
  advisoriesUrl: "https://github.com/haruhimemoe/harumin/security/advisories/new",
  /** The parent brand, linked from the footer wordmark. */
  parentUrl: "https://www.haruhime.moe",
  /** The GitHub organization, linked from the footer's GitHub mark. */
  githubOrg: "https://github.com/haruhimemoe",
  trademarkNotice:
    "Not affiliated with or endorsed by ppy Pty Ltd or Discord. osu! is a trademark of ppy Pty Ltd.",
} as const;

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

/** The haruhime.moe account page, where Discord gets linked. */
export const HUB_ACCOUNT_URL = "https://www.haruhime.moe/account";

/** The other haruhime tools the landing page talks about. */
export const TOOL_URLS = {
  packs: "https://packs.haruhime.moe",
  pools: "https://pools.haruhime.moe",
  bb: "https://bb.haruhime.moe",
} as const;

/** The hub route that starts osu! sign-in straight away (no hub page), with `?next=`. */
export const HUB_DIRECT_SIGN_IN_PATH = "/api/signin/osu";

/** Where sign-in comes back to when `next` is missing or not a safe path. */
export const DEFAULT_AFTER_SIGN_IN = "/dashboard";

/** The readable "signed in" marker the hub sets on .haruhime.moe. harumin only reads it. */
export const SIGNED_IN_COOKIE = SHARED_MARKER_COOKIE;

/** The header's links. */
export const NAV_LINKS: readonly { href: string; label: string }[] = [
  { href: "/commands", label: "Commands" },
  { href: "/dashboard", label: "Dashboard" },
];

/** The header account menu's links, above Sign out. */
export const ACCOUNT_MENU_ITEMS: readonly { href: string; label: string }[] = [
  { href: "/dashboard", label: "Your servers" },
  { href: HUB_ACCOUNT_URL, label: "Link Discord" },
];

/** The footer's own link columns: harumin, About and Legal (ui's SiteFooter adds the tools). */
export const FOOTER_COLUMNS: readonly SiteFooterColumn[] = [
  {
    title: "harumin",
    items: [
      { href: "/commands", label: "Commands" },
      { href: "/dashboard", label: "Dashboard" },
      { href: SITE.discordUrl, label: "Support" },
    ],
  },
  {
    title: "About",
    items: [
      { href: SITE.repoUrl, label: "Source on GitHub" },
      { href: "/brand", label: "Brand" },
      { href: `mailto:${SITE.contactEmail}`, label: SITE.contactEmail },
    ],
  },
  {
    title: "Legal",
    items: CONTENT.entries.legal.map(({ slug, title }) => ({
      href: `/legal/${slug}`,
      label: title,
    })),
  },
];
