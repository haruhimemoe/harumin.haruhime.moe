/**
 * @file src/app/legal/privacy/page.tsx
 * @desc What harumin and this site keep, and why.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LINKS } from "@/constants/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the harumin Discord bot and harumin.haruhime.moe keep about you and your server, and why.",
  alternates: { canonical: "/legal/privacy" },
};

/**
 * @function PrivacyPage
 * @returns {JSX.Element} the privacy page
 */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="October 6, 2026">
      <p>harumin keeps as little as it can. Here is all of it.</p>
      <h2>Messages</h2>
      <p>
        harumin reads messages in channels it can see, only to spot osu!, packs, pools and bb links.
        It doesn't store message text. Each channel remembers the last map, match, pack and pool
        linked there for half an hour, in memory, so commands can use them. A restart forgets them.
      </p>
      <h2>Who was seen where</h2>
      <p>
        When you send a message or run a command in a server, harumin notes your Discord id, the
        server's id and the date, at most once a day. That's how <code>/server</code> knows who's in
        a server and how the dashboard finds the servers you manage, without asking Discord for
        every member list. These notes are deleted after 180 days without a new one.
      </p>
      <h2>Your linked account</h2>
      <p>
        Linking happens on <a href={LINKS.account}>haruhime.moe</a>, which keeps your osu! account
        and, if you link it, your Discord account. harumin reads which osu! account goes with your
        Discord id there, and caches the answer for five minutes. Unlink on haruhime.moe and harumin
        forgets within five minutes.
      </p>
      <h2>Server settings and tracking</h2>
      <ul>
        <li>
          Each server's settings: which link cards are on, the default ruleset, and the Discord id
          of whoever saved them last.
        </li>
        <li>
          Each <code>/track</code> entry: the osu! player, ruleset, channel, who added it and when,
          and the ids of that player's current top plays so harumin can spot new ones.
        </li>
      </ul>
      <p>
        Server managers can change both. Removing harumin from a server leaves them in place; ask on
        the support server to have them deleted.
      </p>
      <h2>osu! data</h2>
      <p>
        harumin asks osu! for public data (profiles, scores, beatmaps, matches) when a command needs
        it and keeps short caches. To work out pp it downloads beatmap <code>.osu</code> files from
        osu! and keeps up to 500 of them. It never stores or shares beatmap archives.
      </p>
      <h2>This website</h2>
      <p>
        The dashboard uses your haruhime.moe sign-in cookie to know who you are. It sets no cookies
        of its own and has no analytics.
      </p>
      <h2>Questions</h2>
      <p>
        Ask on the <a href={LINKS.support}>haruhime Discord</a> or write to haruhime@haruhime.moe.
      </p>
    </LegalPage>
  );
}
