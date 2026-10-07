/**
 * @file src/app/dashboard/page.tsx
 * @desc The dashboard's start: sign in through the hub, then the servers you can manage (from
 *       the bot, which checks Manage Server). Without a linked Discord account it says where to
 *       link one. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { guildIconUrl, type ManageableGuild } from "@haruhimemoe/harumin-config";
import { ButtonLink, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Panel } from "@/components/Panel";
import { HUB_ACCOUNT_URL, inviteUrl } from "@/constants/site";
import { discordIdOf, requireUser } from "@/lib/auth";
import { BotUnavailableError, getBot } from "@/lib/bot";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

const GuildIcon = ({ guild }: { guild: ManageableGuild }) => {
  const icon = guildIconUrl(guild, 96);
  return icon ? (
    // biome-ignore lint/performance/noImgElement: Discord's CDN, sized by the URL
    <img
      src={icon}
      alt=""
      width={48}
      height={48}
      className="size-12 rounded-full border border-c1"
    />
  ) : (
    <span
      aria-hidden="true"
      className="screentone grid size-12 place-items-center rounded-full border border-c1 font-extrabold text-c1"
    >
      {guild.name.slice(0, 2)}
    </span>
  );
};

/**
 * @function DashboardPage
 * @returns {Promise<JSX.Element>} the server list or what to do first
 */
export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const discordId = await discordIdOf(user);
  let guilds: ManageableGuild[] | null = null;
  if (discordId) {
    try {
      guilds = await getBot().manageableGuilds(discordId);
    } catch (error) {
      if (!(error instanceof BotUnavailableError)) throw error;
    }
  }
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        lead={`Signed in as ${user.username}. Pick a server to set up.`}
      />
      <div>
        {!discordId ? (
          <Panel
            title="Link Discord first"
            action={<ButtonLink href={HUB_ACCOUNT_URL}>Link on haruhime.moe</ButtonLink>}
          >
            Your haruhime account has no Discord linked, so harumin can't tell which servers are
            yours. Link it, then come back.
          </Panel>
        ) : guilds === null ? (
          <Panel title="harumin isn't answering">
            The dashboard asks the bot which servers you manage, and it's offline right now. Try
            again in a minute.
          </Panel>
        ) : guilds.length === 0 ? (
          <Panel
            title="No servers yet"
            action={<ButtonLink href={inviteUrl()}>Add harumin to a server</ButtonLink>}
          >
            You'll see servers here where harumin is a member and you have Manage Server.
          </Panel>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {guilds.map((guild) => (
              <li key={guild.id}>
                <Link
                  href={`/dashboard/${guild.id}`}
                  className="panel flex items-center gap-4 p-4 transition-colors hover:bg-b6"
                >
                  <GuildIcon guild={guild} />
                  <span className="min-w-0 flex-1 truncate font-bold text-c1 text-lg">
                    {guild.name}
                  </span>
                  <span aria-hidden="true" className="text-c4">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
