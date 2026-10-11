/**
 * @file src/app/not-found.tsx
 * @desc 404: ui's PageHeader with a way back.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
 */

import { notFoundMetadata } from "@haruhimemoe/next-kit/seo";
import { ButtonLink, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SEO_SITE } from "@/constants/seo";

/** "Page not found · harumin.haruhime.moe", noindex. */
export const metadata: Metadata = notFoundMetadata(SEO_SITE);

/**
 * @function NotFound
 * @returns {Promise<JSX.Element>} the 404 page with a link back
 */
export default async function NotFound() {
  const t = await getTranslations("common.notFound");
  return (
    <PageHeader
      title={t("title")}
      lead={t("lead")}
      actions={
        <ButtonLink href="/" variant="secondary">
          {t("home")}
        </ButtonLink>
      }
    />
  );
}
