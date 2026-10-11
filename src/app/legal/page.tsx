/**
 * @file src/app/legal/page.tsx
 * @desc /legal: every legal page with its description, from the content registry. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Sun Oct 11, 2026
 */

import { pageMetadata } from "@haruhimemoe/next-kit/seo";
import { ContentIndex, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CONTENT } from "@/constants/content";
import { PAGE_SEO, SEO_SITE } from "@/constants/seo";
import { toNavItem } from "@/utils/content-nav";

/** The page's title, description and canonical URL. */
export const metadata: Metadata = pageMetadata(SEO_SITE, PAGE_SEO.legal);

const ITEMS = CONTENT.entries.legal.map(toNavItem("legal"));

/**
 * @function LegalIndexPage
 * @returns {JSX.Element} the section's header and its pages
 */
export default async function LegalIndexPage() {
  const common = await getTranslations("common");
  const t = await getTranslations("harumin-site");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={common("footer.legal")} lead={t("legal.lead")} />
      <ContentIndex items={ITEMS} />
    </div>
  );
}
