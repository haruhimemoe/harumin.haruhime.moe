/**
 * @file src/app/legal/terms/page.tsx
 * @desc The terms for using harumin.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LINKS } from "@/constants/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms for using the harumin osu! Discord bot and its dashboard at harumin.haruhime.moe.",
  alternates: { canonical: "/legal/terms" },
};

/**
 * @function TermsPage
 * @returns {JSX.Element} the terms page
 */
export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="October 6, 2026">
      <p>
        harumin is a free osu! Discord bot from haruhime.moe. By adding it to a server or using it,
        you agree to these terms.
      </p>
      <h2>Use it fairly</h2>
      <ul>
        <li>
          Don't use harumin to spam, scrape osu! in bulk, or get around osu!'s or Discord's rules.
        </li>
        <li>Don't try to break it, overload it, or reach data that isn't yours.</li>
      </ul>
      <p>harumin may stop answering a person or a server that does these things.</p>
      <h2>No guarantees</h2>
      <p>
        harumin is provided as is. Numbers like pp, star ratings and match costs are worked out from
        osu!'s data and may differ from osu!'s own. harumin can go offline or change without notice.
      </p>
      <h2>osu! and Discord</h2>
      <p>
        harumin isn't affiliated with osu!, ppy Pty Ltd, or Discord. Your use of osu! and Discord
        stays under their own terms.
      </p>
      <h2>Changes</h2>
      <p>
        These terms may change. The date above says when they last did. Questions go to the{" "}
        <a href={LINKS.support}>haruhime Discord</a>.
      </p>
    </LegalPage>
  );
}
