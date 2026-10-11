/**
 * @file src/app/page.tsx
 * @desc The landing page: what harumin is with a sample conversation, what it does, and the
 *       haruhime tools it speaks. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
 */

import { HARUHIME_ORG, homeMetadata, ld } from "@haruhimemoe/next-kit/seo";
import { ButtonLink, DiscordIcon, JsonLd, TextLink } from "@haruhimemoe/ui";
import { getTranslations } from "next-intl/server";
import { ChatDemo } from "@/components/ChatDemo";
import { SEO_SITE } from "@/constants/seo";
import { HUB_ACCOUNT_URL, inviteUrl, TOOL_URLS, userInstallUrl } from "@/constants/site";

/** "the osu! Discord bot · harumin.haruhime.moe", its description and canonical URL. */
export const metadata = homeMetadata(SEO_SITE);

const FEATURES = ["remembers", "pp", "cards"] as const;

// Search engines read English: the structured data names the features in English.
const FEATURE_NAMES = [
  "It remembers the map",
  "pp, worked out on the spot",
  "Cards your server picks",
];

const HOME_LD = ld.graph(
  ld.organization(HARUHIME_ORG),
  ld.webSite(SEO_SITE),
  ld.webApplication(SEO_SITE, {
    name: "harumin: the osu! Discord bot",
    category: "CommunicationApplication",
    browserRequirements: "Requires Discord.",
    features: FEATURE_NAMES,
  }),
);

const TOOLS = [
  { name: "packs", href: TOOL_URLS.packs },
  { name: "pools", href: TOOL_URLS.pools },
  { name: "bb", href: TOOL_URLS.bb },
] as const;

/**
 * @function Home
 * @returns {Promise<JSX.Element>} the landing page
 */
export default async function Home() {
  const t = await getTranslations("harumin-site.home");
  return (
    <div className="flex flex-col gap-20">
      <JsonLd data={HOME_LD} />
      <section className="grid items-center gap-12 overflow-x-clip md:grid-cols-[1fr_1.05fr] md:overflow-visible">
        <div className="relative">
          <div
            aria-hidden="true"
            className="speedlines pointer-events-none absolute -inset-x-4 -inset-y-12 -z-10 md:-inset-x-16"
          />
          <p className="font-bold text-h1 text-sm uppercase tracking-[0.2em]">{t("kicker")}</p>
          <h1 className="mt-3 font-extrabold text-5xl text-c1 leading-[1.05] tracking-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-md text-c2 text-lg">{t("lead")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={inviteUrl()} size="lg">
              <DiscordIcon className="size-5" />
              {t("addToDiscord")}
            </ButtonLink>
            <ButtonLink href={userInstallUrl()} size="lg" variant="secondary">
              {t("addToApps")}
            </ButtonLink>
            <ButtonLink href="/commands" size="lg" variant="secondary">
              {t("seeCommands")}
            </ButtonLink>
          </div>
        </div>
        <ChatDemo />
      </section>

      <section aria-labelledby="what">
        <h2 id="what" className="font-extrabold text-3xl text-c1 tracking-tight">
          {t("whatHeading")}
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <li key={feature} className="panel relative overflow-hidden p-6">
              <div
                aria-hidden="true"
                className="screentone pointer-events-none absolute -top-6 -right-6 size-28 [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]"
              />
              <p className="relative font-extrabold text-h1 text-sm tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="relative mt-2 font-extrabold text-c1 text-xl">
                {t(`features.${feature}.title`)}
              </h3>
              <p className="relative mt-2 text-c2">{t(`features.${feature}.body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tools" className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="tools" className="font-extrabold text-3xl text-c1 tracking-tight">
            {t("toolsHeading")}
          </h2>
          <p className="mt-3 text-c3">{t("toolsLead")}</p>
          <p className="mt-4">
            <TextLink href={HUB_ACCOUNT_URL}>{t("linkAccount")}</TextLink>
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
              <p className="text-c2">{t(`tools.${tool.name}`)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
