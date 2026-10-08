/**
 * @file src/app/card/page.tsx
 * @desc "Your card": the signed-in player's /osu card settings (accent, cover, favorite map),
 *       kept by osu! id so they follow the account into every server. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Thu Oct 8, 2026
 * @modified Thu Oct 8, 2026
 */

import type { Metadata } from "next";
import { CardForm } from "@/components/CardForm";
import { requireUser } from "@/lib/auth";
import { ACCENT_COLORS } from "@/lib/cards/theme";
import { getDb } from "@/lib/db";
import { loadUserSettings } from "@/lib/user-settings";
import { saveCard } from "./actions";

export const metadata: Metadata = { title: "Your card", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * @function CardPage
 * @returns {Promise<JSX.Element>} the form, with a note where the preview will go
 */
export default async function CardPage() {
  const user = await requireUser("/card");
  const settings = await loadUserSettings(getDb(), user.osuId);
  return (
    <div>
      <h1 className="font-extrabold text-4xl text-c1 tracking-tight">Your card</h1>
      <p className="mt-2 text-c3">
        How <code className="font-mono">/osu</code> draws {user.username} in every server.
      </p>
      <p className="mt-4 text-c4 text-sm">Preview arrives with the signature banner.</p>
      <div className="mt-10">
        <CardForm
          settings={{
            accent: settings.accent,
            cover: settings.cover,
            favoriteBeatmapId: settings.favoriteBeatmapId,
          }}
          colors={ACCENT_COLORS}
          action={saveCard}
        />
      </div>
    </div>
  );
}
