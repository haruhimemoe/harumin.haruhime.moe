/**
 * @file src/components/HitCircle.tsx
 * @desc An osu! hit circle as decoration: a pink disc with a white rim and its combo number, and
 *       an approach ring closing in on it. The ring moves only when motion is allowed (the theme's
 *       reduced-motion rule stops it). Hidden from assistive tech.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "@haruhimemoe/ui";

/** HitCircle's props. */
export type HitCircleProps = {
  /** The combo number. */
  n: number;
  /** Size in pixels. */
  size?: number;
  /** Whether the approach ring animates. */
  animated?: boolean;
  /** Seconds to offset the animation, so several circles don't move as one. */
  delay?: number;
  className?: string;
};

/**
 * @function HitCircle
 * @param props {HitCircleProps} number, size, animation
 * @returns {JSX.Element} the circle
 */
export function HitCircle({ n, size = 96, animated = true, delay = 0, className }: HitCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={cx("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      {animated ? (
        <span
          className="absolute inset-0 animate-approach rounded-full border-[3px] border-pink"
          style={{ animationDelay: `${delay}s` }}
        />
      ) : null}
      <span
        className={cx(
          "grid size-full place-items-center rounded-full border-[5px] border-white bg-pink font-black font-display text-white",
          animated && "animate-hit",
        )}
        style={{
          animationDelay: `${delay}s`,
          fontSize: size * 0.42,
          boxShadow:
            "0 6px 18px -6px hsl(333 80% 45% / 0.55), inset 0 -6px 0 hsl(333 80% 45% / 0.25)",
        }}
      >
        {n}
      </span>
    </span>
  );
}
