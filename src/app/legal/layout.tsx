/**
 * @file src/app/legal/layout.tsx
 * @desc The legal section's frame: its nav (the index, then every registered page) beside
 *       the page on wide screens, above it on phones.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Sun Oct 11, 2026
 */

import { ContentLayout, ContentNav } from "@haruhimemoe/ui";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { CONTENT } from "@/constants/content";
import { toNavItem } from "@/utils/content-nav";

const GROUPS = [{ items: CONTENT.entries.legal.map(toNavItem("legal")) }];

/**
 * @function LegalLayout
 * @param props {{ children: ReactNode }} the page
 * @returns {JSX.Element} the section nav beside the page
 */
export default async function LegalLayout({ children }: { children: ReactNode }) {
  const common = await getTranslations("common");
  const ui = await getTranslations("ui");
  return (
    <ContentLayout
      nav={
        <ContentNav
          label={common("footer.legal")}
          indexHref="/legal"
          indexLabel={ui("contentNav.overview")}
          summaryLabel={ui("contentNav.contents")}
          groups={GROUPS}
        />
      }
    >
      {children}
    </ContentLayout>
  );
}
