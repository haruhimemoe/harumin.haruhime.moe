/**
 * @file src/app/page.tsx
 * @desc The landing page: what harumin is, a sample conversation, the three things it does
 *       differently, the haruhime tools it speaks, and the invite.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { DiscordIcon } from "@haruhimemoe/ui";
import Link from "next/link";
import { ChatDemo } from "@/components/ChatDemo";
import { HitCircle } from "@/components/HitCircle";
import { inviteUrl, LINKS } from "@/constants/site";
import commands from "@/data/commands.json";

const FEATURES = [
  {
    n: 1,
    title: "It remembers the map",
    body: "Someone links a beatmap, and the channel remembers it. /score, /map, /leaderboard and /simulate work on it with no link pasted again. Matches, packs and pools too.",
  },
  {
    n: 2,
    title: "pp it works out itself",
    body: "Full-combo pp on every recent play, pp at 95 to 100% on map cards, /nochoke for your top 100, and /simulate. Computed locally with rosu-pp, the same calculator tosu uses.",
  },
  {
    n: 3,
    title: "Cards you choose",
    body: "Beatmap, match, pack and pool links get a card. Server managers turn each kind on or off on the dashboard. No settings commands to memorize.",
  },
] as const;

const TOOLS = [
  {
    name: "packs",
    href: LINKS.packs,
    line: "Pack links and pack keys open as a card with every map. /pack does the same.",
  },
  {
    name: "pools",
    href: LINKS.pools,
    line: "/pool view shows a pool by slot. /pool check runs osu!'s content rules over every map.",
  },
  {
    name: "bb",
    href: LINKS.bb,
    line: "Template links get a small preview, if your server turns them on.",
  },
] as const;

const SAMPLE = ["osu", "recent", "top", "map", "nochoke", "matchcost", "track", "pool"] as const;

/**
 * @function Home
 * @returns {JSX.Element} the landing page
 */
export default function Home() {
  return (
    <>
      <section className="playfield relative overflow-hidden border-ink/10 border-b">
        <HitCircle
          n={1}
          size={180}
          className="pointer-events-none absolute -top-10 -right-12 hidden opacity-90 md:inline-grid"
        />
        <HitCircle
          n={2}
          size={84}
          delay={0.6}
          className="pointer-events-none absolute right-[44%] bottom-16 hidden opacity-80 lg:inline-grid"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 left-0 hidden h-40 w-[60%] text-pink/40 md:block"
          viewBox="0 0 600 160"
          fill="none"
        >
          <path
            d="M10 140 C 160 20, 320 160, 590 40"
            stroke="currentColor"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M10 140 C 160 20, 320 160, 590 40"
            stroke="white"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="1 34"
          />
        </svg>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr_1fr] md:py-24">
          <div>
            <p className="sticker inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 font-bold font-mono text-ink text-xs">
              <span className="size-2 rounded-full bg-pink" aria-hidden="true" />
              {commands.commands.length} slash commands · no prefixes
            </p>
            <h1 className="mt-6 font-black font-display text-5xl text-ink leading-[0.95] tracking-tight sm:text-7xl">
              The osu! bot that{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">reads the room</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 rounded-full bg-pink/35"
                />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-c2 text-lg">
              Profiles, recent plays, top plays and pp for your Discord server. Link a map once and
              every command knows which one you mean.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={inviteUrl()}
                className="sticker inline-flex items-center gap-2 rounded-full border-2 border-ink bg-pink px-6 py-3 font-black text-ink transition-transform hover:-translate-y-0.5"
              >
                <DiscordIcon className="size-5" />
                Add to Discord
              </a>
              <Link
                href="/commands"
                className="inline-flex items-center rounded-full border-2 border-ink bg-white px-6 py-3 font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                See the commands
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Some commands">
              {SAMPLE.map((name) => (
                <li key={name}>
                  <Link
                    href={`/commands#${name}`}
                    className="inline-block rounded-md border border-ink/15 bg-white px-2 py-0.5 font-mono text-c2 text-sm transition-colors hover:border-pink hover:text-h1"
                  >
                    /{name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative [--tilt:1.2deg] md:animate-float">
            <ChatDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="why">
        <h2 id="why" className="font-black font-display text-4xl text-ink tracking-tight">
          Clean, not crowded
        </h2>
        <p className="mt-3 max-w-2xl text-c3">
          {commands.commands.length} commands. Filters are options, not extra commands. Modes are an
          option, not /taiko /mania /catch.
        </p>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.n}
              className="ink-shadow relative rounded-2xl border-2 border-ink bg-white p-6 pt-10"
            >
              <HitCircle
                n={feature.n}
                size={52}
                animated={false}
                className="absolute -top-6 left-6"
              />
              <h3 className="font-black font-display text-ink text-xl">{feature.title}</h3>
              <p className="mt-2 text-c2">{feature.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-ink/10 border-y bg-white" aria-labelledby="tools">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="tools" className="font-black font-display text-4xl text-ink tracking-tight">
              Speaks haruhime
            </h2>
            <p className="mt-3 text-c3">
              harumin is part of haruhime.moe, osu! tools for players, mappers and tournament hosts.
              One account links them all: sign in with osu! once, link Discord, done.
            </p>
            <a
              href={LINKS.account}
              className="mt-5 inline-block font-bold text-h1 underline underline-offset-4 hover:text-c1"
            >
              Link your account
            </a>
          </div>
          <ul className="grid gap-4">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="flex gap-4 rounded-xl border border-ink/10 bg-b5 p-5">
                <a
                  href={tool.href}
                  className="w-20 shrink-0 font-black font-mono text-h1 text-lg hover:text-c1"
                >
                  {tool.name}
                </a>
                <p className="text-c2">{tool.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="playfield relative overflow-hidden" aria-labelledby="add">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
          <HitCircle n={727} size={120} delay={0.3} />
          <h2 id="add" className="mt-8 font-black font-display text-4xl text-ink tracking-tight">
            Ready when you are
          </h2>
          <p className="mt-3 max-w-lg text-c3">
            Add harumin, then set it up on the dashboard. It asks for no moderation permissions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={inviteUrl()}
              className="sticker inline-flex items-center gap-2 rounded-full border-2 border-ink bg-pink px-6 py-3 font-black text-ink transition-transform hover:-translate-y-0.5"
            >
              <DiscordIcon className="size-5" />
              Add to Discord
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full border-2 border-ink bg-white px-6 py-3 font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Open the dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
