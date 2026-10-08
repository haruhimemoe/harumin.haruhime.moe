/**
 * @file src/components/CardForm.tsx
 * @desc The "Your card" form (client): an accent swatch per color, the cover, and a favorite
 *       map, saved through the server action, with the answer read out in a live region.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

"use client";

import { CARD_ACCENTS, type CardAccent, type UserSettings } from "@haruhimemoe/harumin-config";
import { Button } from "@haruhimemoe/ui";
import { useActionState } from "react";
import type { SaveResult } from "@/lib/dashboard";

/** CardForm's props. */
export type CardFormProps = {
  settings: Pick<UserSettings, "accent" | "cover" | "favoriteBeatmapId">;
  /** Each accent's color, from the card theme. */
  colors: Readonly<Record<CardAccent, string>>;
  action: (previous: SaveResult | null, form: FormData) => Promise<SaveResult>;
};

const COVERS = [
  { value: "profile", label: "Profile cover" },
  { value: "paper", label: "Plain paper" },
] as const;

/**
 * @function CardForm
 * @param props {CardFormProps} current settings, accent colors and the action
 * @returns {JSX.Element} the form
 */
export function CardForm({ settings, colors, action }: CardFormProps) {
  const [result, submit, pending] = useActionState(action, null);
  return (
    <form action={submit} className="space-y-10">
      <fieldset>
        <legend className="font-extrabold text-2xl text-c1">Accent</legend>
        <p className="mt-1 text-c3 text-sm">
          Colors your pp, the rule under your name, and the favorite line.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {CARD_ACCENTS.map((accent) => (
            <label key={accent} className="cursor-pointer">
              <input
                type="radio"
                name="accent"
                value={accent}
                defaultChecked={settings.accent === accent}
                className="peer sr-only"
              />
              <span className="panel inline-flex items-center gap-2 px-3 py-1.5 font-bold text-c1 text-sm capitalize transition-colors peer-checked:bg-c1 peer-checked:text-b4 peer-focus-visible:outline-2 peer-focus-visible:outline-h1 peer-focus-visible:outline-offset-2">
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border border-c1"
                  style={{ background: colors[accent] }}
                />
                {accent}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-extrabold text-2xl text-c1">Cover</legend>
        <div className="mt-5 flex flex-wrap gap-2">
          {COVERS.map((cover) => (
            <label key={cover.value} className="cursor-pointer">
              <input
                type="radio"
                name="cover"
                value={cover.value}
                defaultChecked={settings.cover === cover.value}
                className="peer sr-only"
              />
              <span className="panel inline-block px-4 py-1.5 font-bold text-c1 text-sm transition-colors peer-checked:bg-c1 peer-checked:text-b4 peer-focus-visible:outline-2 peer-focus-visible:outline-h1 peer-focus-visible:outline-offset-2">
                {cover.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="favorite" className="font-extrabold text-2xl text-c1">
          Favorite map
        </label>
        <p className="mt-1 text-c3 text-sm">
          A difficulty link or id. /osu shows your best score on it. Leave it empty for none.
        </p>
        <input
          id="favorite"
          name="favorite"
          type="text"
          inputMode="url"
          maxLength={200}
          defaultValue={settings.favoriteBeatmapId ? String(settings.favoriteBeatmapId) : ""}
          placeholder="https://osu.ppy.sh/beatmapsets/39804#osu/129891"
          className="panel mt-4 w-full max-w-xl px-4 py-2 text-c1"
        />
      </div>

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
