/**
 * @file src/components/layout/AppPalette.tsx
 * @desc harumin's command palette: ui's CommandPalette mounted once (Ctrl K / Cmd K), with
 *       siteCommands (the pages, the other tools, page actions, sign in) plus "Add to Discord"
 *       and Sign out. signedIn comes from the same account store the header's menu reads.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { type Command, CommandPalette, siteCommands } from "@haruhimemoe/ui";
import { HUB_ACCOUNT_URL, inviteUrl, NAV_LINKS, SITE } from "@/constants/site";
import { signOut, useAccount } from "@/lib/account";

/**
 * @function AppPalette
 * @returns {JSX.Element} ui's CommandPalette with harumin's commands
 */
export function AppPalette() {
  const account = useAccount();
  const signedIn = account.status === "signed-in";
  const commands: Command[] = [
    ...siteCommands({
      pages: NAV_LINKS,
      tools: "harumin",
      repo: SITE.repoUrl,
      account: { signedIn, signInHref: "/signin", accountHref: HUB_ACCOUNT_URL },
    }),
    {
      id: "harumin.invite",
      title: "Add harumin to Discord",
      group: "harumin",
      keywords: ["invite", "install"],
      run: () => {
        window.location.href = inviteUrl();
      },
    },
    {
      id: "harumin.account.sign-out",
      title: "Sign out",
      group: "Account",
      when: () => signedIn,
      run: () => {
        void signOut();
      },
    },
  ];
  return <CommandPalette storageKey="harumin" commands={commands} />;
}
