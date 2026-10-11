/**
 * @file src/lib/dashboard.ts
 * @desc The dashboard's rules, apart from Next so tests can run them: reading a settings form,
 *       and saving it only for a signed-in user whose linked Discord account the bot confirms
 *       has Manage Server in that guild. The guild id from the URL is never trusted alone.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
 */

import {
  AUTO_EMBED_KEYS,
  type GuildSettings,
  type GuildSettingsPatch,
  guildSettingsPatchSchema,
  type ManageableGuild,
  RULESETS,
  snowflakeSchema,
} from "@haruhimemoe/harumin-config";

/** What a save answers, for the form. */
/** Why a save did or didn't happen; the page words it in the visitor's language. */
export type SaveCode =
  | "not-a-server"
  | "no-discord"
  | "offline"
  | "forbidden"
  | "invalid"
  | "saved";
/** What saveGuildForm decided. */
export type SaveOutcome = { ok: boolean; code: SaveCode };
/** What the form shows: the outcome and its words. */
export type SaveResult = { ok: boolean; message: string };

/** What saving needs, injected. */
export type SaveDeps = {
  discordId: () => Promise<string | null>;
  manageableGuilds: (discordId: string) => Promise<ManageableGuild[]>;
  save: (guildId: string, patch: GuildSettingsPatch, by: string) => Promise<GuildSettings>;
  revalidateBot: (guildId: string) => Promise<void>;
};

/**
 * @function readSettingsForm
 * @param form {FormData} the submitted form: one checkbox per auto-embed, and defaultMode
 * @returns {GuildSettingsPatch | null} the patch, or null when the form holds anything unexpected
 */
export const readSettingsForm = (form: FormData): GuildSettingsPatch | null => {
  const mode = form.get("defaultMode");
  const autoEmbeds = Object.fromEntries(
    AUTO_EMBED_KEYS.map((key) => [key, form.get(key) === "on"]),
  );
  const parsed = guildSettingsPatchSchema.safeParse({
    autoEmbeds,
    defaultMode: mode === "" || mode === "auto" || mode === null ? null : mode,
  });
  return parsed.success ? parsed.data : null;
};

/**
 * @function findManaged
 * @param guilds {readonly ManageableGuild[]} what the bot says the user manages
 * @param guildId {string} the guild asked for
 * @returns {ManageableGuild | null} that guild, or null
 */
export const findManaged = (
  guilds: readonly ManageableGuild[],
  guildId: string,
): ManageableGuild | null => guilds.find((guild) => guild.id === guildId) ?? null;

/**
 * @function saveGuildForm
 * @param guildId {string} from the URL
 * @param form {FormData} the submitted form
 * @param deps {SaveDeps} who's asking and what the bot says
 * @returns {Promise<SaveOutcome>} saved, or why not, as a code
 */
export const saveGuildForm = async (
  guildId: string,
  form: FormData,
  deps: SaveDeps,
): Promise<SaveOutcome> => {
  if (!snowflakeSchema.safeParse(guildId).success) return { ok: false, code: "not-a-server" };
  const discordId = await deps.discordId();
  if (!discordId) return { ok: false, code: "no-discord" };
  let guilds: ManageableGuild[];
  try {
    guilds = await deps.manageableGuilds(discordId);
  } catch {
    return { ok: false, code: "offline" };
  }
  if (!findManaged(guilds, guildId)) return { ok: false, code: "forbidden" };
  const patch = readSettingsForm(form);
  if (!patch) return { ok: false, code: "invalid" };
  await deps.save(guildId, patch, discordId);
  await deps.revalidateBot(guildId).catch(() => undefined);
  return { ok: true, code: "saved" };
};

/** The default-mode choices, "auto" first; "auto" is worded by the form (`playersOwn`). */
export const MODE_CHOICES: readonly { value: string; label: string }[] = [
  { value: "auto", label: "auto" },
  ...RULESETS.map((value) => ({
    value,
    label: value === "fruits" ? "catch" : value === "osu" ? "osu!" : value,
  })),
];
