/**
 * @file src/components/SettingsForm.tsx
 * @desc The guild settings form (client): a switch per link card and the default ruleset, saved
 *       through the server action, with the answer read out in a live region.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import {
  AUTO_EMBED_KEYS,
  AUTO_EMBED_LABELS,
  type GuildSettings,
} from "@haruhimemoe/harumin-config";
import { useActionState } from "react";
import type { SaveResult } from "@/lib/dashboard";
import { MODE_CHOICES } from "@/lib/dashboard";

/** SettingsForm's props. */
export type SettingsFormProps = {
  settings: Pick<GuildSettings, "autoEmbeds" | "defaultMode">;
  action: (previous: SaveResult | null, form: FormData) => Promise<SaveResult>;
};

/**
 * @function SettingsForm
 * @param props {SettingsFormProps} current settings and the bound action
 * @returns {JSX.Element} the form
 */
export function SettingsForm({ settings, action }: SettingsFormProps) {
  const [result, submit, pending] = useActionState(action, null);
  return (
    <form action={submit} className="space-y-10">
      <fieldset>
        <legend className="font-black font-display text-2xl text-ink">Link cards</legend>
        <p className="mt-1 text-c3 text-sm">
          When someone posts one of these links, harumin answers with a card. Commands work either
          way.
        </p>
        <ul className="mt-5 divide-y divide-ink/10 rounded-2xl border border-ink/15 bg-white">
          {AUTO_EMBED_KEYS.map((key) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-4 px-5 py-4">
                <span className="flex-1">
                  <span className="block font-bold text-ink">{AUTO_EMBED_LABELS[key].name}</span>
                  <span className="block text-c3 text-sm">{AUTO_EMBED_LABELS[key].line}</span>
                </span>
                <input
                  type="checkbox"
                  name={key}
                  defaultChecked={settings.autoEmbeds[key]}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="relative h-7 w-12 shrink-0 rounded-full border-2 border-ink bg-b3 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:border-2 after:border-ink after:bg-white after:transition-transform peer-checked:bg-pink peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-h1 peer-focus-visible:outline-offset-2"
                />
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="font-black font-display text-2xl text-ink">Default ruleset</legend>
        <p className="mt-1 text-c3 text-sm">
          For commands where nobody picks a mode. "Player's own" uses each player's main mode.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {MODE_CHOICES.map((choice) => (
            <label key={choice.value} className="cursor-pointer">
              <input
                type="radio"
                name="defaultMode"
                value={choice.value}
                defaultChecked={(settings.defaultMode ?? "auto") === choice.value}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border-2 border-ink bg-white px-4 py-1.5 font-bold text-ink text-sm transition-colors peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-h1 peer-focus-visible:outline-offset-2">
                {choice.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="sticker rounded-full border-2 border-ink bg-pink px-6 py-2.5 font-black text-ink transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={result?.ok === false ? "font-bold text-h1" : "text-c3"}
        >
          {result?.message ?? ""}
        </p>
      </div>
    </form>
  );
}
