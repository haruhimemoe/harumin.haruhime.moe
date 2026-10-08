/**
 * @file src/app/card/actions.ts
 * @desc The "Your card" form's server action: the signed-in player's card settings, saved by
 *       their osu! id, then the bot told to drop its cached copy (if it's down, its 10 minute
 *       cache runs out on its own). Next checks the action's origin.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getBot } from "@/lib/bot";
import type { SaveResult } from "@/lib/dashboard";
import { getDb } from "@/lib/db";
import { readCardForm, saveUserSettings } from "@/lib/user-settings";

/**
 * @function saveCard
 * @param _previous {SaveResult | null} the last answer (useActionState)
 * @param form {FormData} the form
 * @returns {Promise<SaveResult>} what to show
 */
export async function saveCard(_previous: SaveResult | null, form: FormData): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sign in again to save." };
  const read = readCardForm(form);
  if (!read.ok) return read;
  await saveUserSettings(getDb(), user.osuId, read.value);
  await getBot()
    .revalidateUser(user.osuId)
    .catch(() => undefined);
  revalidatePath("/card");
  return { ok: true, message: "Saved. /osu shows it now." };
}
