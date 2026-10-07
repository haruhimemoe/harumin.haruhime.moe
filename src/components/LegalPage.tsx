/**
 * @file src/components/LegalPage.tsx
 * @desc The frame for the privacy and terms pages: title, last update, and prose.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";

/**
 * @function LegalPage
 * @param props {{ title: string; updated: string; children: ReactNode }}
 * @returns {JSX.Element} the page
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-black font-display text-5xl text-ink tracking-tight">{title}</h1>
      <p className="mt-2 text-c4 text-sm">Last updated {updated}</p>
      <div className="mt-10 space-y-5 text-c2 leading-relaxed [&_a]:font-bold [&_a]:text-h1 [&_a]:underline [&_h2]:mt-10 [&_h2]:font-black [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </article>
  );
}
