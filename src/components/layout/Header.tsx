/**
 * @file src/components/layout/Header.tsx
 * @desc The header: ui's SiteHeader with the wordmark, the nav, the palette
 *       button and the account menu, in the request's language.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Sun Oct 11, 2026
 */

import { CommandPaletteButton, SiteHeader } from "@haruhimemoe/ui";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { accountMenuItems, navLinks, SITE } from "@/constants/site";
import { AccountMenu } from "@/lib/account";

/**
 * @function Header
 * @returns {Promise<JSX.Element>} ui's SiteHeader with harumin's wordmark, nav and actions
 */
export async function Header() {
  const t = await getTranslations("harumin-site");
  const ui = await getTranslations("ui");
  return (
    <SiteHeader
      brand={
        <Link href="/" className="font-extrabold text-c1 text-xl tracking-tight">
          {SITE.name}
          <span aria-hidden="true" className="text-h1">
            .
          </span>
        </Link>
      }
      links={navLinks(t)}
      navLabel={ui("shell.mainNav")}
      actions={
        <>
          <CommandPaletteButton label={ui("palette.openLabel")} />
          <AccountMenu
            items={accountMenuItems(t)}
            signInLabel={ui("account.signIn")}
            signOutLabel={ui("account.signOut")}
          />
        </>
      }
    />
  );
}
