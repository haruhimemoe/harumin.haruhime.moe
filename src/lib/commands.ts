/**
 * @file src/lib/commands.ts
 * @desc The command list the bot exports (`bun run export-commands` in the harumin repo writes
 *       src/data/commands.json), grouped by category for the /commands page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import data from "@/data/commands.json";

/** One option. */
export type CommandOption = {
  name: string;
  description: string;
  type: string;
  required: boolean;
  choices?: string[];
};
/** One command. */
export type CommandDoc = {
  name: string;
  description: string;
  category: string;
  categoryName: string;
  options: CommandOption[];
  subcommands: { name: string; description: string; options: CommandOption[] }[];
};

/** Every public command, in the bot's order. */
export const COMMANDS: readonly CommandDoc[] = data.commands as CommandDoc[];

/** The bot version the list came from. */
export const COMMANDS_VERSION: string = data.version;

/**
 * @function groupCommands
 * @param commands {readonly CommandDoc[]} the list
 * @returns {{ category: string; name: string; commands: CommandDoc[] }[]} by category, first-seen order
 */
export const groupCommands = (commands: readonly CommandDoc[]) => {
  const groups = new Map<string, { category: string; name: string; commands: CommandDoc[] }>();
  for (const command of commands) {
    const group = groups.get(command.category) ?? {
      category: command.category,
      name: command.categoryName,
      commands: [],
    };
    group.commands.push(command);
    groups.set(command.category, group);
  }
  return [...groups.values()];
};

/**
 * @function usageLine
 * @param name {string} "top", or "pool view"
 * @param options {readonly CommandOption[]} its options
 * @returns {string} "/top [name] [mode]", required ones in <>
 */
export const usageLine = (name: string, options: readonly CommandOption[]): string =>
  [
    `/${name}`,
    ...options.map((option) => (option.required ? `<${option.name}>` : `[${option.name}]`)),
  ].join(" ");
