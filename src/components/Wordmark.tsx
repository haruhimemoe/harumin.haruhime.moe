/**
 * @file src/components/Wordmark.tsx
 * @desc "harumin" set in the display face, the dot of the i a small hit circle.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "@haruhimemoe/ui";

/**
 * @function Wordmark
 * @param props {{ className?: string }} size via font-size classes
 * @returns {JSX.Element} the wordmark (its text is "harumin" for screen readers)
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="harumin"
      className={cx(
        "inline-flex items-baseline font-black font-display text-ink tracking-tight",
        className,
      )}
    >
      harum
      <span className="relative inline-block">
        ı
        <span
          aria-hidden="true"
          className="absolute top-[0.08em] left-1/2 size-[0.3em] -translate-x-1/2 rounded-full border-[0.05em] border-white bg-pink"
        />
      </span>
      n
    </span>
  );
}
