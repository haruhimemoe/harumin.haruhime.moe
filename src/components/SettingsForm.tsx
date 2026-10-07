/**
 * @file src/components/SettingsForm.tsx
 * @desc The guild settings form (client): a switch per link card and the default ruleset, saved
 *       through the server action, with the answer read out in a live region.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import {
  AUTO_EMBED_KEYS,
  AUTO_EMBED_LABELS,
  type GuildSettings,
} from "@haruhimemoe/harumin-config";
import { Button } from "@haruhimemoe/ui";
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
        <legend className="font-extrabold text-2xl text-c1">Link cards</legend>
        <p className="mt-1 text-c3 text-sm">
          When someone posts one of these links, harumin answers with a card. Commands work either
          way.
        </p>
        <ul className="panel mt-5 divide-y divide-c1/15">
          {AUTO_EMBED_KEYS.map((key) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-4 px-5 py-4">
                <span className="flex-1">
                  <span className="block font-bold text-c1">{AUTO_EMBED_LABELS[key].name}</span>
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
                  className="relative h-6 w-11 shrink-0 rounded-full border-[1.5px] border-c1 bg-b4 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-c1 after:transition-transform peer-checked:bg-c1 peer-checked:after:translate-x-5 peer-checked:after:bg-b4 peer-focus-visible:outline-2 peer-focus-visible:outline-h1 peer-focus-visible:outline-offset-2"
                />
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="font-extrabold text-2xl text-c1">Default ruleset</legend>
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
              <span className="panel inline-block px-4 py-1.5 font-bold text-c1 text-sm transition-colors peer-checked:bg-c1 peer-checked:text-b4 peer-focus-visible:outline-2 peer-focus-visible:outline-h1 peer-focus-visible:outline-offset-2">
                {choice.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
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
