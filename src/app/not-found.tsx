/**
 * @file src/app/not-found.tsx
 * @desc 404: ui's PageHeader with a way back.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { notFoundMetadata } from "@haruhimemoe/next-kit/seo";
import { ButtonLink, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { SEO_SITE } from "@/constants/seo";

/** "Page not found · harumin.haruhime.moe", noindex. */
export const metadata: Metadata = notFoundMetadata(SEO_SITE);

/**
 * @function NotFound
 * @returns {JSX.Element} the 404 page with a link back
 */
export default function NotFound() {
  return (
    <PageHeader
      title="Page not found"
      lead="That page doesn't exist, or it moved."
      actions={
        <ButtonLink href="/" variant="secondary">
          Back home
        </ButtonLink>
      }
    />
  );
}
