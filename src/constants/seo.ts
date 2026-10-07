/**
 * @file src/constants/seo.ts
 * @desc The site as @haruhimemoe/next-kit/seo reads it (SEO_SITE: the home keyword, the
 *       description, the link preview image and the haruhime.moe organization), and the static
 *       pages' titles and descriptions.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { HARUHIME_ORG, type Site } from "@haruhimemoe/next-kit/seo";
import { SITE } from "@/constants/site";

/** The site for next-kit's metadata, robots, sitemap, JSON-LD and llms.txt helpers. */
export const SEO_SITE: Site = {
  name: SITE.name,
  url: SITE.url,
  title: "the osu! Discord bot",
  titleSuffix: SITE.title,
  shortTitleSuffix: "harumin",
  description:
    "An osu! Discord bot: profiles, recent and top plays with pp, map cards that remember the map, match costs, top play tracking, and haruhime's packs and pools.",
  ogImages: [
    {
      url: "/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: "harumin: the osu! Discord bot",
      type: "image/png",
    },
  ],
  organization: HARUHIME_ORG,
  parent: { name: "haruhime.moe", url: SITE.parentUrl },
};

/** A static page's title (before " · harumin.haruhime.moe") and description. */
export type PageSeo = { path: string; title: string; description: string };

/** The indexable static pages other than the home page. */
export const PAGE_SEO = {
  commands: {
    path: "/commands",
    title: "harumin commands: osu! profiles, scores, pp and more",
    description:
      "Every harumin slash command with its options: profiles, recent and top plays, map cards, pp, leaderboards, tracking, match costs, packs and pools.",
  },
  legal: {
    path: "/legal",
    title: "Legal",
    description:
      "The harumin terms for adding the bot and using the dashboard, and the privacy policy: what harumin keeps about you and your server, why, and for how long.",
  },
  brand: {
    path: "/brand",
    title: "harumin brand assets",
    description:
      "The harumin name, logos, icon, colors and type, with the files to download, for server owners, wikis and anyone writing about the bot.",
  },
} as const satisfies Record<string, PageSeo>;
