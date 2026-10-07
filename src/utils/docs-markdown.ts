/**
 * @file src/utils/docs-markdown.ts
 * @desc What readContentMarkdown takes for the legal pages: the site's origin, next-kit's
 *       legalMarkdownTransform (so `<Processors />` and friends become real Markdown) and ui's
 *       MDX transforms. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { legalMarkdownTransform } from "@haruhimemoe/next-kit/legal";
import { mdxMarkdownTransforms } from "@haruhimemoe/ui/remark";
import { LEGAL_SITE } from "@/constants/legal-site";
import { SITE } from "@/constants/site";

/** readContentMarkdown's options for the legal section. */
export const LEGAL_MARKDOWN_OPTIONS = {
  siteUrl: SITE.url,
  transforms: [legalMarkdownTransform(LEGAL_SITE), ...mdxMarkdownTransforms],
} as const;
