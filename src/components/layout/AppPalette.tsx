/**
 * @file src/components/layout/AppPalette.tsx
 * @desc harumin's command palette: ui's CommandPalette mounted once (Ctrl K / Cmd K), with
 *       siteCommands (the pages, the other tools, page actions, sign in) plus "Add to Discord"
 *       and Sign out, in the request's language. signedIn comes from the same account store the
 *       header's menu reads.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Sun Oct 11, 2026
 */

"use client";

import { uiLabels } from "@haruhimemoe/next-kit/i18n";
import { type Command, CommandPalette, siteCommands } from "@haruhimemoe/ui";
import { useTranslations } from "next-intl";
import { HUB_ACCOUNT_URL, inviteUrl, navLinks, SITE } from "@/constants/site";
import { signOut, useAccount } from "@/lib/account";

/**
 * @function AppPalette
 * @returns {JSX.Element} ui's CommandPalette with harumin's commands
 */
export function AppPalette() {
  const t = useTranslations("harumin-site");
  const ui = uiLabels(useTranslations("ui"));
  const account = useAccount();
  const signedIn = account.status === "signed-in";
  const commands: Command[] = [
    ...siteCommands({
      pages: navLinks(t),
      tools: "harumin",
      repo: SITE.repoUrl,
      account: { signedIn, signInHref: "/signin", accountHref: HUB_ACCOUNT_URL },
      labels: ui.siteCommands,
    }),
    {
      id: "harumin.invite",
      title: t("palette.invite"),
      group: "harumin",
      keywords: ["invite", "install"],
      run: () => {
        window.location.href = inviteUrl();
      },
    },
    {
      id: "harumin.account.sign-out",
      title: ui.account.signOut,
      group: ui.siteCommands.account,
      when: () => signedIn,
      run: () => {
        void signOut();
      },
    },
  ];
  return (
    <CommandPalette
      storageKey="harumin"
      commands={commands}
      labels={ui.palette}
      placeholder={ui.paletteProps.placeholder}
      label={ui.paletteProps.label}
    />
  );
}
