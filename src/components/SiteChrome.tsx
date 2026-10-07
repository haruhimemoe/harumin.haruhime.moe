/**
 * @file src/components/SiteChrome.tsx
 * @desc The header (wordmark, nav, "Add to Discord") and the footer (the family's SiteFooter with
 *       harumin's columns and the other haruhime tools).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { DiscordIcon, SiteFooter } from "@haruhimemoe/ui";
import Link from "next/link";
import { inviteUrl, LINKS } from "@/constants/site";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/commands", label: "Commands" },
  { href: "/dashboard", label: "Dashboard" },
  { href: LINKS.support, label: "Support" },
] as const;

/**
 * @function Header
 * @returns {JSX.Element} the top bar
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-ink/10 border-b bg-b5/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="rounded-md text-2xl" aria-label="harumin home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden flex-1 sm:block">
          <ul className="flex items-center gap-5 font-bold text-c3 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-c1">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={inviteUrl()}
          className="sticker ml-auto inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 font-bold text-ink text-sm transition-transform hover:-translate-y-0.5 sm:ml-0"
        >
          <DiscordIcon className="size-4 text-discord" />
          Add to Discord
        </a>
      </div>
      <nav aria-label="Main, small screens" className="border-ink/10 border-t sm:hidden">
        <ul className="mx-auto flex max-w-6xl justify-around px-4 py-2 font-bold text-c3 text-sm">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-c1">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/**
 * @function Footer
 * @returns {JSX.Element} the footer
 */
export function Footer() {
  return (
    <SiteFooter
      columns={[
        {
          title: "harumin",
          items: [
            { href: "/commands", label: "Commands" },
            { href: "/dashboard", label: "Dashboard" },
            { href: inviteUrl(), label: "Add to Discord" },
          ],
        },
        {
          title: "About",
          items: [
            { href: "/legal/privacy", label: "Privacy" },
            { href: "/legal/terms", label: "Terms" },
            { href: LINKS.source, label: "Source" },
          ],
        },
      ]}
      tools={{ position: 2 }}
      discordHref={LINKS.support}
      finePrint="harumin isn't affiliated with osu! or ppy Pty Ltd."
    />
  );
}
