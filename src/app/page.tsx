/**
 * @file src/app/page.tsx
 * @desc The landing page: what harumin is with a sample conversation, what it does, and the
 *       haruhime tools it speaks. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { HARUHIME_ORG, homeMetadata, ld } from "@haruhimemoe/next-kit/seo";
import { ButtonLink, DiscordIcon, JsonLd, TextLink } from "@haruhimemoe/ui";
import { ChatDemo } from "@/components/ChatDemo";
import { SEO_SITE } from "@/constants/seo";
import { HUB_ACCOUNT_URL, inviteUrl, TOOL_URLS } from "@/constants/site";

/** "the osu! Discord bot · harumin.haruhime.moe", its description and canonical URL. */
export const metadata = homeMetadata(SEO_SITE);

const FEATURES = [
  {
    title: "It remembers the map",
    body: "Someone links a beatmap and the channel keeps it. /score, /map, /leaderboard and /simulate work on it without pasting the link again. Matches, packs and pools too.",
  },
  {
    title: "pp, worked out on the spot",
    body: "Full-combo pp on every recent play, pp from 95 to 100% on map cards, /nochoke for your top 100, and /simulate. Computed with rosu-pp, the same calculator tosu uses.",
  },
  {
    title: "Cards your server picks",
    body: "Beatmap, match, pack and pool links get a card. Server managers switch each kind on or off from the dashboard.",
  },
] as const;

const HOME_LD = ld.graph(
  ld.organization(HARUHIME_ORG),
  ld.webSite(SEO_SITE),
  ld.webApplication(SEO_SITE, {
    name: "harumin: the osu! Discord bot",
    category: "CommunicationApplication",
    browserRequirements: "Requires Discord.",
    features: FEATURES.map((feature) => feature.title),
  }),
);

const TOOLS = [
  {
    name: "packs",
    href: TOOL_URLS.packs,
    line: "Pack links and pack keys open as a card with every map. /pack does the same.",
  },
  {
    name: "pools",
    href: TOOL_URLS.pools,
    line: "/pool view shows a pool by slot. /pool check runs osu!'s content rules over every map.",
  },
  {
    name: "bb",
    href: TOOL_URLS.bb,
    line: "Template links get a small preview, if your server turns them on.",
  },
] as const;

/**
 * @function Home
 * @returns {JSX.Element} the landing page
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <JsonLd data={HOME_LD} />
      <section className="grid items-center gap-12 overflow-x-clip md:grid-cols-[1fr_1.05fr] md:overflow-visible">
        <div className="relative">
          <div
            aria-hidden="true"
            className="speedlines pointer-events-none absolute -inset-x-4 -inset-y-12 -z-10 md:-inset-x-16"
          />
          <p className="font-bold text-h1 text-sm uppercase tracking-[0.2em]">
            the osu! Discord bot
          </p>
          <h1 className="mt-3 font-extrabold text-5xl text-c1 leading-[1.05] tracking-tight sm:text-6xl">
            The osu! bot that reads the room.
          </h1>
          <p className="mt-5 max-w-md text-c2 text-lg">
            Profiles, recent plays, top plays and pp for your Discord server. Link a map once and
            every command knows which one you mean.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={inviteUrl()} size="lg">
              <DiscordIcon className="size-5" />
              Add to Discord
            </ButtonLink>
            <ButtonLink href="/commands" size="lg" variant="secondary">
              See the commands
            </ButtonLink>
          </div>
        </div>
        <ChatDemo />
      </section>

      <section aria-labelledby="what">
        <h2 id="what" className="font-extrabold text-3xl text-c1 tracking-tight">
          What it does
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <li key={feature.title} className="panel relative overflow-hidden p-6">
              <div
                aria-hidden="true"
                className="screentone pointer-events-none absolute -top-6 -right-6 size-28 [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]"
              />
              <p className="relative font-extrabold text-h1 text-sm tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="relative mt-2 font-extrabold text-c1 text-xl">{feature.title}</h3>
              <p className="relative mt-2 text-c2">{feature.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tools" className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="tools" className="font-extrabold text-3xl text-c1 tracking-tight">
            Speaks haruhime
          </h2>
          <p className="mt-3 text-c3">
            harumin is part of haruhime.moe, osu! tools for players, mappers and tournament hosts.
            One account links them all: sign in with osu! once, link Discord, done.
          </p>
          <p className="mt-4">
            <TextLink href={HUB_ACCOUNT_URL}>Link your account</TextLink>
          </p>
        </div>
        <ul className="panel divide-y divide-c1/15">
          {TOOLS.map((tool) => (
            <li key={tool.name} className="flex gap-4 p-5">
              <a href={tool.href} className="w-16 shrink-0 font-extrabold text-c1 hover:text-h1">
                {tool.name}
                <span aria-hidden="true" className="text-h1">
                  .
                </span>
              </a>
              <p className="text-c2">{tool.line}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
