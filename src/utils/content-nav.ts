/**
 * @file src/utils/content-nav.ts
 * @desc Turns registry entries into the items ContentNav and ContentIndex take. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { type ContentEntry, type ContentSection, contentPath } from "@haruhimemoe/next-kit/docs";
import type { ContentSearchItem } from "@haruhimemoe/ui";

/**
 * @function toNavItem
 * @param section {ContentSection} the section the entries live under
 * @returns {(entry: ContentEntry) => ContentSearchItem} maps one entry to its nav item
 */
export const toNavItem =
  (section: ContentSection) =>
  ({ slug, title, navTitle, description }: ContentEntry): ContentSearchItem => ({
    href: contentPath(section, slug),
    title,
    ...(navTitle ? { navTitle } : {}),
    description,
  });
