/**
 * @file src/components/layout/Footer.tsx
 * @desc The footer: ui's SiteFooter with harumin's columns, the other haruhime tools, the
 *       Discord and GitHub links and the trademark notice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { SiteFooter } from "@haruhimemoe/ui";
import { FOOTER_COLUMNS, SITE } from "@/constants/site";

/**
 * @function Footer
 * @returns {JSX.Element} ui's SiteFooter for harumin
 */
export function Footer() {
  return (
    <SiteFooter
      columns={FOOTER_COLUMNS}
      tools={{ current: "harumin" }}
      finePrint={
        <>harumin never keeps message text and never hosts beatmaps. {SITE.trademarkNotice}</>
      }
      parentHref={SITE.parentUrl}
      githubHref={SITE.githubOrg}
      discordHref={SITE.discordUrl}
    />
  );
}
