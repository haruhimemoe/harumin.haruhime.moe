/**
 * @file src/app/dashboard/[guildId]/page.tsx
 * @desc One server's settings: link cards and default ruleset (the form), and the players it
 *       tracks (managed with /track in Discord). The bot must confirm the user manages this
 *       server, or it's a 404. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { guildIconUrl, MAX_TRACKED_PER_GUILD, snowflakeSchema } from "@haruhimemoe/harumin-config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Panel } from "@/components/Panel";
import { SettingsForm } from "@/components/SettingsForm";
import { discordIdOf, requireUser } from "@/lib/auth";
import { BotUnavailableError, getBot } from "@/lib/bot";
import { findManaged } from "@/lib/dashboard";
import { getDb } from "@/lib/db";
import { listTracks, loadSettings } from "@/lib/settings";
import { saveGuildSettings } from "./actions";

type Props = { params: Promise<{ guildId: string }> };

export const metadata: Metadata = { title: "Server settings", robots: { index: false } };
export const dynamic = "force-dynamic";

const RULESET_NAMES: Record<string, string> = {
  osu: "osu!",
  taiko: "taiko",
  fruits: "catch",
  mania: "mania",
};

/**
 * @function GuildPage
 * @param props {Props} the route params
 * @returns {Promise<JSX.Element>} the settings page
 */
export default async function GuildPage({ params }: Props) {
  const { guildId } = await params;
  if (!snowflakeSchema.safeParse(guildId).success) notFound();
  const user = await requireUser(`/dashboard/${guildId}`);
  const discordId = await discordIdOf(user);
  if (!discordId) redirect("/dashboard");
  const bot = getBot();
  let guilds: Awaited<ReturnType<typeof bot.manageableGuilds>>;
  try {
    guilds = await bot.manageableGuilds(discordId);
  } catch (error) {
    if (!(error instanceof BotUnavailableError)) throw error;
    return (
      <div>
        <Panel title="harumin isn't answering">
          Settings need the bot to confirm you manage this server, and it's offline right now. Try
          again in a minute.
        </Panel>
      </div>
    );
  }
  const guild = findManaged(guilds, guildId);
  if (!guild) notFound();
  const db = getDb();
  const [settings, tracks, channels] = await Promise.all([
    loadSettings(db, guildId),
    listTracks(db, guildId),
    bot.guildChannels(guildId).catch(() => []),
  ]);
  const channelName = new Map(channels.map((channel) => [channel.id, channel.name]));
  const icon = guildIconUrl(guild, 128);
  return (
    <div>
      <Link href="/dashboard" className="font-bold text-c3 text-sm hover:text-c1">
        ← All servers
      </Link>
      <header className="mt-4 flex items-center gap-4">
        {icon ? (
          // biome-ignore lint/performance/noImgElement: Discord's CDN, sized by the URL
          <img
            src={icon}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-full border border-c1"
          />
        ) : null}
        <h1 className="min-w-0 truncate font-extrabold text-4xl text-c1 tracking-tight">
          {guild.name}
        </h1>
      </header>

      <div className="mt-10">
        <SettingsForm
          settings={{ autoEmbeds: settings.autoEmbeds, defaultMode: settings.defaultMode }}
          action={saveGuildSettings.bind(null, guildId)}
        />
      </div>

      <section className="mt-14" aria-labelledby="tracked">
        <h2 id="tracked" className="font-extrabold text-2xl text-c1">
          Tracked players{" "}
          <span className="text-c4 text-lg">
            {tracks.length}/{MAX_TRACKED_PER_GUILD}
          </span>
        </h2>
        <p className="mt-1 text-c3 text-sm">
          New top plays get posted to these channels. Add and remove them with{" "}
          <code className="font-mono">/track</code> in Discord.
        </p>
        {tracks.length === 0 ? (
          <p className="panel mt-5 border-dashed p-5 text-c3">Nobody tracked yet.</p>
        ) : (
          <ul className="panel mt-5 divide-y divide-c1/15">
            {tracks.map((track) => (
              <li
                key={`${track.osuId}:${track.mode}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3"
              >
                <a
                  href={`https://osu.ppy.sh/users/${track.osuId}`}
                  className="font-bold text-c1 underline-offset-2 hover:underline"
                >
                  {track.username}
                </a>
                <span className="rounded-sm bg-b6 px-2 py-0.5 font-mono text-c3 text-xs">
                  {RULESET_NAMES[track.mode]}
                </span>
                <span className="ml-auto text-c3 text-sm">
                  #{channelName.get(track.channelId) ?? "a channel harumin can't see"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
