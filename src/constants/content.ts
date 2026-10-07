/**
 * @file src/constants/content.ts
 * @desc The content registry (next-kit's defineContent): the five legal pages
 *       (content/legal/<slug>.mdx) from next-kit's legalEntries(LEGAL_SITE), with privacy and
 *       terms described for harumin. Pages, .md mirrors, nav and the sitemap read it. Bump an
 *       entry's lastUpdated in the same commit as its text.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { defineContent } from "@haruhimemoe/next-kit/docs";
import { legalEntries } from "@haruhimemoe/next-kit/legal";
import { LEGAL_SITE } from "@/constants/legal-site";

/** Every legal page. */
export const CONTENT = defineContent({
  docs: [],
  guides: [],
  legal: legalEntries(LEGAL_SITE, {
    privacy: {
      title: "Privacy",
      description: "What the harumin bot and harumin.haruhime.moe keep, why, and for how long.",
      lastUpdated: "2026-10-07",
    },
    terms: {
      title: "Terms",
      description: "The rules for adding harumin to a server and using its dashboard.",
      lastUpdated: "2026-10-07",
    },
  }),
});
