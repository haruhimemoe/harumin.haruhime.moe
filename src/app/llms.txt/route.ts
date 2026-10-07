/**
 * @file src/app/llms.txt/route.ts
 * @desc /llms.txt: what harumin is, its pages, every command, the legal pages and the other
 *       haruhime tools, for assistants. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { llmsTxt, textResponse } from "@haruhimemoe/next-kit/seo";
import { CONTENT } from "@/constants/content";
import { SEO_SITE } from "@/constants/seo";
import { SITE, TOOL_URLS } from "@/constants/site";
import { COMMANDS } from "@/lib/commands";

/** Built at deploy. */
export const dynamic = "force-static";

/**
 * @function GET
 * @returns {Response} the llms.txt as plain text
 */
export function GET() {
  const text = llmsTxt({
    title: SITE.title,
    summary: SEO_SITE.description,
    sections: [
      {
        heading: "Pages",
        links: [
          { title: "Commands", url: `${SITE.url}/commands`, note: "every command and option" },
          { title: "Dashboard", url: `${SITE.url}/dashboard`, note: "server settings, signed in" },
          { title: "Brand", url: `${SITE.url}/brand` },
        ],
      },
      {
        heading: "Commands",
        links: COMMANDS.map((command) => ({
          title: `/${command.name}`,
          url: `${SITE.url}/commands#${command.name}`,
          note: command.description,
        })),
      },
      {
        heading: "Legal",
        links: CONTENT.entries.legal.map((entry) => ({
          title: entry.title,
          url: `${SITE.url}/legal/${entry.slug}`,
          note: entry.description,
        })),
      },
      {
        heading: "Other haruhime tools",
        links: [
          { title: "packs", url: TOOL_URLS.packs, note: "osu! beatmap packs" },
          { title: "pools", url: TOOL_URLS.pools, note: "osu! mappools" },
          { title: "bb", url: TOOL_URLS.bb, note: "osu! BBCode editor" },
        ],
      },
    ],
  });
  return textResponse(text, { maxAge: 3600 });
}
