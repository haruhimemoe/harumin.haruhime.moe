/**
 * @file src/app/dashboard/[guildId]/actions.ts
 * @desc The settings form's server action: the rules in lib/dashboard.ts with the real session,
 *       bot and database. Next checks the action's origin.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use server";

import { revalidatePath } from "next/cache";
import { discordIdOf, getCurrentUser } from "@/lib/auth";
import { getBot } from "@/lib/bot";
import { type SaveResult, saveGuildForm } from "@/lib/dashboard";
import { getDb } from "@/lib/db";
import { saveSettings } from "@/lib/settings";

/**
 * @function saveGuildSettings
 * @param guildId {string} bound from the page
 * @param _previous {SaveResult | null} the last answer (useActionState)
 * @param form {FormData} the form
 * @returns {Promise<SaveResult>} what to show
 */
export async function saveGuildSettings(
  guildId: string,
  _previous: SaveResult | null,
  form: FormData,
): Promise<SaveResult> {
  const bot = getBot();
  const result = await saveGuildForm(guildId, form, {
    discordId: async () => {
      const user = await getCurrentUser();
      return user ? discordIdOf(user) : null;
    },
    manageableGuilds: (discordId) => bot.manageableGuilds(discordId),
    save: (id, patch, by) => saveSettings(getDb(), id, patch, by),
    revalidateBot: (id) => bot.revalidate(id),
  });
  if (result.ok) revalidatePath(`/dashboard/${guildId}`);
  return result;
}
