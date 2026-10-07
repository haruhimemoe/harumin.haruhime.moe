/**
 * @file src/content/load.ts
 * @desc The MDX loaders for every registered content page, by section and slug.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { ContentSection } from "@haruhimemoe/next-kit/docs";
import type { ComponentType } from "react";

type Loader = () => Promise<{ default: ComponentType }>;

/** Static imports: @next/mdx compiles only files named in the source. */
export const LOADERS: Partial<Record<ContentSection, Record<string, Loader>>> = {
  legal: {
    terms: () => import("@content/legal/terms.mdx"),
    privacy: () => import("@content/legal/privacy.mdx"),
    "your-privacy-rights": () => import("@content/legal/your-privacy-rights.mdx"),
    copyright: () => import("@content/legal/copyright.mdx"),
    disclaimers: () => import("@content/legal/disclaimers.mdx"),
  },
};
