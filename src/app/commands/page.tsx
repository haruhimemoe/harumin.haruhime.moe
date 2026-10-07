/**
 * @file src/app/commands/page.tsx
 * @desc Every command by category: usage line, description, and each option with its type and
 *       choices. Each command has an anchor (/commands#top).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { pageMetadata } from "@haruhimemoe/next-kit/seo";
import { PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { PAGE_SEO, SEO_SITE } from "@/constants/seo";
import {
  COMMANDS,
  COMMANDS_VERSION,
  type CommandOption,
  groupCommands,
  usageLine,
} from "@/lib/commands";

/** The page's title, description and canonical URL. */
export const metadata: Metadata = pageMetadata(SEO_SITE, PAGE_SEO.commands);

const Options = ({ options }: { options: readonly CommandOption[] }) =>
  options.length === 0 ? null : (
    <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
      {options.map((option) => (
        <div key={option.name} className="contents">
          <dt className="font-mono text-c1">
            {option.name}
            {option.required ? (
              <span className="ml-1 text-h1" title="required">
                *
              </span>
            ) : null}
          </dt>
          <dd className="text-c3">
            {option.description}
            <span className="text-c4"> · {option.type}</span>
            {option.choices ? (
              <span className="text-c4"> · {option.choices.join(", ")}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );

/**
 * @function CommandsPage
 * @returns {JSX.Element} the command reference
 */
export default function CommandsPage() {
  const groups = groupCommands(COMMANDS);
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Commands"
        lead={
          <>
            Player options default to your linked account. Map options default to the last map in
            the channel. <span className="text-h1">*</span> means required.
          </>
        }
      />
      <nav aria-label="Categories" className="mt-6 flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group.category}
            href={`#${group.category}`}
            className="panel px-3 py-1 font-bold text-c1 text-sm hover:bg-b6"
          >
            {group.name}
          </a>
        ))}
      </nav>
      {groups.map((group) => (
        <section key={group.category} aria-labelledby={group.category} className="mt-14">
          <h2 id={group.category} className="font-extrabold text-2xl text-c1 tracking-tight">
            {group.name}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {group.commands.map((command) => (
              <li key={command.name} id={command.name} className="panel scroll-mt-24 p-5">
                <h3 className="font-bold font-mono text-c1 text-lg">/{command.name}</h3>
                <p className="mt-1 text-c2">{command.description}</p>
                {command.subcommands.length > 0 ? (
                  <ul className="mt-4 space-y-4">
                    {command.subcommands.map((sub) => (
                      <li key={sub.name} className="border-c1 border-l-2 pl-3">
                        <p className="font-mono text-c1 text-sm">
                          {usageLine(`${command.name} ${sub.name}`, sub.options)}
                        </p>
                        <p className="text-c3 text-sm">{sub.description}</p>
                        <Options options={sub.options} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p className="mt-3 overflow-x-auto rounded-sm bg-b6 px-2 py-1 font-mono text-c2 text-sm">
                      {usageLine(command.name, command.options)}
                    </p>
                    <Options options={command.options} />
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-14 text-c4 text-sm">From harumin {COMMANDS_VERSION}.</p>
    </div>
  );
}
