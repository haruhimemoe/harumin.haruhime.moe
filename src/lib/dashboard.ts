/**
 * @file src/lib/dashboard.ts
 * @desc The dashboard's rules, apart from Next so tests can run them: reading a settings form,
 *       and saving it only for a signed-in user whose linked Discord account the bot confirms
 *       has Manage Server in that guild. The guild id from the URL is never trusted alone.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
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
 * @returns {Promise<SaveResult>} saved, or why not
 */
export const saveGuildForm = async (
  guildId: string,
  form: FormData,
  deps: SaveDeps,
): Promise<SaveResult> => {
  if (!snowflakeSchema.safeParse(guildId).success)
    return { ok: false, message: "That isn't a server." };
  const discordId = await deps.discordId();
  if (!discordId) return { ok: false, message: "Sign in and link Discord on haruhime.moe first." };
  let guilds: ManageableGuild[];
  try {
    guilds = await deps.manageableGuilds(discordId);
  } catch {
    return {
      ok: false,
      message: "harumin isn't answering right now, so nothing was saved. Try again in a minute.",
    };
  }
  if (!findManaged(guilds, guildId))
    return {
      ok: false,
      message: "You need Manage Server in that server, and harumin has to be in it.",
    };
  const patch = readSettingsForm(form);
  if (!patch)
    return { ok: false, message: "Those settings don't look right. Reload and try again." };
  await deps.save(guildId, patch, discordId);
  await deps.revalidateBot(guildId).catch(() => undefined);
  return { ok: true, message: "Saved. harumin uses the new settings within a minute." };
};

/** The default-mode choices, "auto" first. */
export const MODE_CHOICES: readonly { value: string; label: string }[] = [
  { value: "auto", label: "Player's own" },
  ...RULESETS.map((value) => ({
    value,
    label: value === "fruits" ? "catch" : value === "osu" ? "osu!" : value,
  })),
];
