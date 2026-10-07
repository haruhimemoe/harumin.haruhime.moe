/**
 * @file src/components/layout/Header.tsx
 * @desc The header: ui's SiteHeader with the wordmark, the nav, the palette
 *       button and the account menu.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { CommandPaletteButton, SiteHeader } from "@haruhimemoe/ui";
import Link from "next/link";
import { ACCOUNT_MENU_ITEMS, NAV_LINKS, SITE } from "@/constants/site";
import { AccountMenu } from "@/lib/account";

/**
 * @function Header
 * @returns {JSX.Element} ui's SiteHeader with harumin's wordmark, nav and actions
 */
export function Header() {
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
      links={NAV_LINKS}
      actions={
        <>
          <CommandPaletteButton />
          <AccountMenu items={ACCOUNT_MENU_ITEMS} />
        </>
      }
    />
  );
}
