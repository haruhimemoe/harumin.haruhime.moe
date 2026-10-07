/**
 * @file src/app/commands/page.tsx
 * @desc Every command by category: usage line, description, and each option with its type and
 *       choices. Each command has an anchor (/commands#top).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { Metadata } from "next";
import { HitCircle } from "@/components/HitCircle";
import {
  COMMANDS,
  COMMANDS_VERSION,
  type CommandOption,
  groupCommands,
  usageLine,
} from "@/lib/commands";

export const metadata: Metadata = {
  title: "Commands",
  description:
    "Every harumin slash command, with its options: profiles, scores, maps, pp, tracking, match costs, packs and pools.",
  alternates: { canonical: "/commands" },
};

const Options = ({ options }: { options: readonly CommandOption[] }) =>
  options.length === 0 ? null : (
    <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
      {options.map((option) => (
        <div key={option.name} className="contents">
          <dt className="font-mono text-ink">
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
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="flex items-center gap-5">
        <HitCircle n={COMMANDS.length} size={72} animated={false} />
        <div>
          <h1 className="font-black font-display text-5xl text-ink tracking-tight">Commands</h1>
          <p className="mt-1 text-c3">
            Player options default to your linked account. Map options default to the last map in
            the channel. <span className="text-h1">*</span> means required.
          </p>
        </div>
      </header>
      <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group.category}
            href={`#${group.category}`}
            className="rounded-full border-2 border-ink bg-white px-3 py-1 font-bold text-ink text-sm hover:bg-pink-soft"
          >
            {group.name}
          </a>
        ))}
      </nav>
      {groups.map((group) => (
        <section key={group.category} aria-labelledby={group.category} className="mt-14">
          <h2
            id={group.category}
            className="font-black font-display text-3xl text-ink tracking-tight"
          >
            {group.name}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {group.commands.map((command) => (
              <li
                key={command.name}
                id={command.name}
                className="ink-shadow scroll-mt-24 rounded-2xl border border-ink/15 bg-white p-5"
              >
                <h3 className="font-bold font-mono text-ink text-lg">/{command.name}</h3>
                <p className="mt-1 text-c2">{command.description}</p>
                {command.subcommands.length > 0 ? (
                  <ul className="mt-4 space-y-4">
                    {command.subcommands.map((sub) => (
                      <li key={sub.name} className="border-pink border-l-4 pl-3">
                        <p className="font-mono text-ink text-sm">
                          {usageLine(`${command.name} ${sub.name}`, sub.options)}
                        </p>
                        <p className="text-c3 text-sm">{sub.description}</p>
                        <Options options={sub.options} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p className="mt-3 overflow-x-auto rounded-md bg-b6 px-2 py-1 font-mono text-c2 text-sm">
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
