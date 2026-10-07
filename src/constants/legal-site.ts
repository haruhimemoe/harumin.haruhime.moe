/**
 * @file src/constants/legal-site.ts
 * @desc The `LegalSite` config next-kit's legal blocks and `legalEntries` render from: what the
 *       harumin bot and this site keep (content/legal/privacy.mdx says the same, in prose), who
 *       processes data on harumin's behalf, the cookies the site reads, and the `hosting` line
 *       `DmcaNotice` shows: harumin stores settings and ids, never beatmap archives or images.
 *
 *       Hardcodes the site name and contact email (matching `@/constants/site`'s SITE) instead of
 *       importing them: SITE's FOOTER_COLUMNS reads CONTENT.entries.legal, which is built from
 *       this file, so importing SITE here would be a cycle.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { LegalSite } from "@haruhimemoe/next-kit/legal";

/** harumin's legal config: feeds `src/mdx-components.tsx`'s bound blocks and `legalEntries`. */
export const LEGAL_SITE: LegalSite = {
  siteName: "harumin.haruhime.moe",
  operator: "the operator of harumin and harumin.haruhime.moe",
  contactEmail: "haruhime@haruhime.moe",
  effectiveDate: "2026-10-07",
  stores: [
    {
      what: "Who was seen where",
      why: "your Discord id, a server's id and the date, at most once a day, so /server and the dashboard know who is in a server; deleted after 180 days without a new one",
    },
    {
      what: "Server settings",
      why: "which link cards are on, the default ruleset, and the Discord id of whoever saved last, so the bot answers the way the server chose",
    },
    {
      what: "/track entries",
      why: "the osu! player, ruleset, channel, who added it and when, and the ids of that player's current top plays, so new ones can be posted",
    },
    {
      what: "osu! lookups and .osu files",
      why: "public osu! data in short caches, and up to 500 beatmap .osu files, so pp can be worked out without asking osu! again",
    },
  ],
  processors: [
    { name: "Vercel", purpose: "hosts this website and runs its server functions." },
    { name: "Hetzner", purpose: "runs the harumin bot." },
    { name: "MongoDB Atlas", purpose: "stores the settings and tracking data listed above." },
    {
      name: "haruhime.moe",
      purpose:
        "runs sign-in and keeps the account, sessions and linked Discord id harumin reads to know who you are.",
    },
    { name: "Discord", purpose: "carries the bot's messages and commands." },
    {
      name: "osu! (ppy Pty Ltd)",
      purpose: "answers the profile, score, beatmap and match lookups harumin makes.",
    },
  ],
  cookies: [
    "haruhime.moe's session cookie (on .haruhime.moe) keeps you signed in; harumin.haruhime.moe only reads it. It's HttpOnly, so page scripts can't read it.",
    "`haruhime-signed-in`, also set by haruhime.moe, tells the page to check whether you're signed in. Page scripts can read it, and it holds no personal data.",
  ],
  hosting:
    "harumin stores server settings, tracking entries and Discord and osu! ids. It never stores message text, and it never hosts beatmap archives, images, audio or video.",
};
