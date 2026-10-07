/**
 * @file src/components/ChatDemo.tsx
 * @desc A Discord conversation drawn in HTML, framed like a manga panel with narration boxes:
 *       someone posts a beatmap link, harumin answers with a map card, then `/score` with no map
 *       works because the channel remembers it. Sample data, labelled as such for assistive tech.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import type { ReactNode } from "react";

const Avatar = ({ label, bot }: { label: string; bot?: boolean }) => (
  <span
    aria-hidden="true"
    className={
      bot
        ? "grid size-10 shrink-0 place-items-center rounded-full bg-c1 font-extrabold text-b4 text-sm"
        : "screentone grid size-10 shrink-0 place-items-center rounded-full border border-c1 font-extrabold text-c1 text-lg"
    }
  >
    {label}
  </span>
);

const Message = ({
  name,
  bot,
  time,
  children,
}: {
  name: string;
  bot?: boolean;
  time: string;
  children: ReactNode;
}) => (
  <div className="flex gap-3">
    <Avatar label={bot ? "hm." : name.charAt(0).toUpperCase()} bot={bot} />
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-2 text-sm">
        <span className="font-bold text-c1">{name}</span>
        {bot ? (
          <span className="rounded-sm bg-c1 px-1 font-bold text-[10px] text-b4 uppercase leading-4">
            App
          </span>
        ) : null}
        <span className="text-c4 text-xs">{time}</span>
      </p>
      <div className="mt-0.5 text-[15px] text-c2">{children}</div>
    </div>
  </div>
);

const Embed = ({ children }: { children: ReactNode }) => (
  <div className="mt-1.5 max-w-md rounded-sm border-c1 border-l-4 bg-b6 p-3 text-sm">
    {children}
  </div>
);

/**
 * @function ChatDemo
 * @returns {JSX.Element} the sample conversation
 */
export function ChatDemo() {
  return (
    <figure aria-label="Sample Discord conversation with harumin" className="relative pt-4">
      <p className="panel absolute top-0 left-4 z-10 px-3 py-1 font-bold text-c1 text-sm">
        #tourney-chat, 21:04
      </p>
      <div className="panel space-y-4 p-4 pt-7">
        <Message name="yuki" time="Today at 21:04">
          <span className="break-all text-c1 underline underline-offset-2">
            https://osu.ppy.sh/beatmapsets/1#osu/75
          </span>
          <span className="block">is this one ok for the pool??</span>
        </Message>
        <Message name="harumin" bot time="Today at 21:04">
          <Embed>
            <p className="text-c3 text-xs">Mapped by haruhime</p>
            <p className="font-bold text-c1">haruhime - first combo [Expert]</p>
            <div className="mt-2 grid grid-cols-2 gap-3 text-c2 text-xs">
              <div>
                <p className="font-bold text-c1">Difficulty</p>
                <p>
                  <b>6.12★</b> · NM
                </p>
                <p>CS 4 · AR 9.4 · OD 9</p>
              </div>
              <div>
                <p className="font-bold text-c1">Length</p>
                <p>3:42 · 190 BPM</p>
                <p>x1,384 · ranked</p>
              </div>
            </div>
            <p className="mt-2 text-c2 text-xs">
              <span className="font-bold text-c1">pp</span> 95% <b>241</b> · 98% <b>289</b> · 99%{" "}
              <b>307</b> · 100% <b>331</b>
            </p>
          </Embed>
        </Message>
        <Message name="yuki" time="Today at 21:05">
          <code className="rounded-sm bg-b6 px-1 font-mono text-c1 text-sm">/score</code>
        </Message>
        <Message name="harumin" bot time="Today at 21:05">
          <Embed>
            <p className="text-c3 text-xs">yuki 🇯🇵 · 6,402pp (#12,840)</p>
            <p className="font-bold text-c1">haruhime - first combo [Expert]</p>
            <p className="mt-1 text-c3 text-xs">Best score on this map</p>
            <p className="text-c2 text-xs">
              <b className="text-c1">S</b> · +HD · 6.31★
            </p>
            <p className="text-c2 text-xs">
              <b className="text-c1">298.40pp</b> (FC 316.02pp at 98.91%) · 98.12%
            </p>
          </Embed>
        </Message>
      </div>
      <figcaption className="panel relative z-10 -mt-3 mr-4 ml-auto w-fit max-w-xs px-3 py-1.5 text-c2 text-sm">
        No map given to <code className="font-mono text-c1">/score</code>. The channel remembered
        it.
      </figcaption>
    </figure>
  );
}
