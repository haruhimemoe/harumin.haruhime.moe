/**
 * @file src/components/layout/Footer.tsx
 * @desc The footer: ui's SiteFooter with harumin's columns, the other haruhime tools, the
 *       Discord and GitHub links and the trademark notice, in the request's language.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Sun Oct 11, 2026
 */

import { LOCALES } from "@haruhimemoe/messages";
import { LocaleSelect, SiteFooter } from "@haruhimemoe/ui";
import { getLocale, getTranslations } from "next-intl/server";
import { footerColumns, SITE } from "@/constants/site";

/**
 * @function Footer
 * @returns {Promise<JSX.Element>} ui's SiteFooter for harumin
 */
export async function Footer() {
  const t = await getTranslations("harumin-site");
  const common = await getTranslations("common");
  const ui = await getTranslations("ui");
  const locale = await getLocale();
  return (
    <SiteFooter
      columns={footerColumns(t, common)}
      navLabel={ui("shell.footerNav")}
      tools={{ current: "harumin", title: ui("shell.tools"), allLabel: ui("shell.allTools") }}
      extra={
        <LocaleSelect
          locales={LOCALES}
          value={locale}
          label={ui("shell.language")}
          cookieDomain=".haruhime.moe"
        />
      }
      finePrint={t("footer.finePrint")}
      parentHref={SITE.parentUrl}
      githubHref={SITE.githubOrg}
      discordHref={SITE.discordUrl}
    />
  );
}
