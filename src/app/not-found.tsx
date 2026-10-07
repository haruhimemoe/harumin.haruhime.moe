/**
 * @file src/app/not-found.tsx
 * @desc 404: a missed circle.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import Link from "next/link";

/**
 * @function NotFound
 * @returns {JSX.Element} the 404 page
 */
export default function NotFound() {
  return (
    <div className="playfield mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <span
        aria-hidden="true"
        className="font-black font-display text-[#ff3355] text-[9rem] leading-none"
      >
        ×
      </span>
      <h1 className="mt-2 font-black font-display text-4xl text-ink">Miss.</h1>
      <p className="mt-2 text-c3">There's no page here. Combo broken, but not for long.</p>
      <Link href="/" className="mt-6 font-bold text-h1 underline underline-offset-4 hover:text-c1">
        Back to the start
      </Link>
    </div>
  );
}
