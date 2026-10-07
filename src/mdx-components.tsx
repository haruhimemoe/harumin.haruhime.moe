/**
 * @file src/mdx-components.tsx
 * @desc The elements MDX pages render with: ui's MDX components, and next-kit's legal blocks
 *       bound to LEGAL_SITE (<Processors /> instead of <Processors site={...} />).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import {
  Changes,
  DataWeKeep,
  DmcaNotice,
  LegalContact,
  NoWarranty,
  Processors,
  YourRights,
} from "@haruhimemoe/next-kit/legal";
import { mdxComponents } from "@haruhimemoe/ui/mdx";
import type { MDXComponents } from "mdx/types";
import { LEGAL_SITE } from "@/constants/legal-site";

const components: MDXComponents = {
  ...mdxComponents,
  LegalContact: () => <LegalContact site={LEGAL_SITE} />,
  DataWeKeep: () => <DataWeKeep site={LEGAL_SITE} />,
  Processors: () => <Processors site={LEGAL_SITE} />,
  YourRights: () => <YourRights site={LEGAL_SITE} />,
  DmcaNotice: () => <DmcaNotice site={LEGAL_SITE} />,
  NoWarranty: () => <NoWarranty site={LEGAL_SITE} />,
  Changes: (props: { date?: string }) => <Changes site={LEGAL_SITE} date={props.date} />,
};

/**
 * @function useMDXComponents
 * @returns {MDXComponents} the legal pages' elements, styled like the rest of the site
 */
export function useMDXComponents(): MDXComponents {
  return components;
}
