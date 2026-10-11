/**
 * @file src/constants/site.ts
 * @desc The site's name, URL, description, contact and links, the bot's invite link, and the
 *       header nav, account menu and footer columns built from a translator.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
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

/**
 * @function userInstallUrl
 * @returns {string} the link that adds harumin to your own account, for its commands in any DM
 *          or server (no bot user joins anything)
 */
export const userInstallUrl = (): string => {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", DISCORD_CLIENT_ID);
  url.searchParams.set("integration_type", "1");
  url.searchParams.set("scope", "applications.commands");
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

/** A translator for this site's catalog (next-intl's t for "harumin-site" or "common"). */
type T = (key: string) => string;

/**
 * @function navLinks
 * @param t {T} the "harumin-site" translator
 * @returns {{ href: string; label: string }[]} the header's links
 */
export const navLinks = (t: T): { href: string; label: string }[] => [
  { href: "/commands", label: t("nav.commands") },
  { href: "/dashboard", label: t("nav.dashboard") },
];

/**
 * @function accountMenuItems
 * @param t {T} the "harumin-site" translator
 * @returns {{ href: string; label: string }[]} the header account menu's links, above Sign out
 */
export const accountMenuItems = (t: T): { href: string; label: string }[] => [
  { href: "/dashboard", label: t("nav.servers") },
  { href: "/card", label: t("nav.card") },
  { href: HUB_ACCOUNT_URL, label: t("nav.linkDiscord") },
];

/**
 * @function footerColumns
 * @param t {T} the "harumin-site" translator
 * @param common {T} the "common" translator
 * @returns {SiteFooterColumn[]} the footer's own link columns: harumin, About and Legal (ui's
 *          SiteFooter adds the tools). Legal page titles stay English, like the pages.
 */
export const footerColumns = (t: T, common: T): SiteFooterColumn[] => [
  {
    title: "harumin",
    items: [
      { href: "/commands", label: t("nav.commands") },
      { href: "/dashboard", label: t("nav.dashboard") },
      { href: SITE.discordUrl, label: common("footer.support") },
    ],
  },
  {
    title: common("footer.about"),
    items: [
      { href: SITE.repoUrl, label: common("footer.source") },
      { href: "/brand", label: common("footer.brand") },
      { href: `mailto:${SITE.contactEmail}`, label: SITE.contactEmail },
    ],
  },
  {
    title: common("footer.legal"),
    items: CONTENT.entries.legal.map(({ slug, title }) => ({
      href: `/legal/${slug}`,
      label: title,
    })),
  },
];
