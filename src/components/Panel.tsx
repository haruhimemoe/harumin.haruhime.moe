/**
 * @file src/components/Panel.tsx
 * @desc A framed message box for the dashboard's states (link Discord first, bot offline, no
 *       servers): a title, the words, and an optional action, with a screentone corner.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import type { ReactNode } from "react";

/**
 * @function Panel
 * @param props {{ title: string; children: ReactNode; action?: ReactNode }}
 * @returns {JSX.Element} the box
 */
export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="panel relative overflow-hidden p-8">
      <div
        aria-hidden="true"
        className="screentone pointer-events-none absolute -right-8 -bottom-8 size-40 [mask-image:radial-gradient(circle_at_bottom_right,black,transparent_70%)]"
      />
      <h2 className="relative font-extrabold text-2xl text-c1">{title}</h2>
      <div className="relative mt-1 max-w-prose text-c2">{children}</div>
      {action ? <div className="relative mt-5">{action}</div> : null}
    </section>
  );
}
