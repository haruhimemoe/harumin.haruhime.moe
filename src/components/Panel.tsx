/**
 * @file src/components/Panel.tsx
 * @desc A bordered message box for the dashboard's states (link Discord first, bot offline, no
 *       servers), with a hit circle and an optional action.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { HitCircle } from "./HitCircle";

/**
 * @function Panel
 * @param props {{ n: number; title: string; children: ReactNode; action?: ReactNode }}
 * @returns {JSX.Element} the box
 */
export function Panel({
  n,
  title,
  children,
  action,
}: {
  n: number;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="ink-shadow flex flex-col items-start gap-5 rounded-2xl border-2 border-ink bg-white p-8 sm:flex-row sm:items-center">
      <HitCircle n={n} size={64} animated={false} />
      <div className="flex-1">
        <h2 className="font-black font-display text-2xl text-ink">{title}</h2>
        <div className="mt-1 text-c2">{children}</div>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </section>
  );
}

/** The pink pill button as a link. */
export const PILL =
  "inline-flex items-center gap-2 rounded-full border-2 border-ink bg-pink px-5 py-2 font-black text-ink transition-transform sticker hover:-translate-y-0.5";
