/**
 * @file src/app/brand/page.tsx
 * @desc /brand: the harumin name, how to write it, logo files, colors, type, do's and don'ts and the
 *       contact, from @haruhimemoe/brand's brandPageData rendered by @haruhimemoe/ui's BrandPage
 *       (files in public/brand come from `haruhime-brand harumin`). Static. Also the site's
 *       Organization structured data.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Sun Oct 11, 2026
 */

import { brandPageData } from "@haruhimemoe/brand/products";
import { uiLabels } from "@haruhimemoe/next-kit/i18n";
import { HARUHIME_ORG, ld, pageMetadata } from "@haruhimemoe/next-kit/seo";
import { BrandPage, JsonLd, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PAGE_SEO, SEO_SITE } from "@/constants/seo";

/** The page's title, description and canonical URL. */
export const metadata: Metadata = pageMetadata(SEO_SITE, PAGE_SEO.brand);

/**
 * @function BrandRoute
 * @returns {Promise<JSX.Element>} the page header, the brand sections and the Organization
 *          JSON-LD
 */
export default async function BrandRoute() {
  const t = await getTranslations("harumin-site.brand");
  const ui = uiLabels(await getTranslations("ui"));
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} lead={t("lead")} />
      <BrandPage {...brandPageData("harumin")} labels={ui.brandPage} />
      <JsonLd
        data={ld.graph(
          ld.organization(HARUHIME_ORG),
          ld.breadcrumbs(SEO_SITE, [
            { name: "harumin", path: "/" },
            { name: "Brand", path: "/brand" },
          ]),
        )}
      />
    </div>
  );
}
