/**
 * @file src/lib/cards/MapHeader.tsx
 * @desc The map strip several cards open with: the set's cover darkened toward the bottom, label
 *       pills in the top corner, the title and "artist · [difficulty]" over it, a line under
 *       that when given (the mapper), and the star rating in a box on the right.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { CardScore } from "@haruhimemoe/harumin-config";
import { oneLine, Pill, Stars } from "@/lib/cards/parts";
import { alpha, INK, mapCoverUrl, stars } from "@/lib/cards/theme";

/**
 * @function MapHeader
 * @param props {{ map; height; pills; under? }} the map, the strip's height, the corner labels,
 *        and a small line under the difficulty
 * @returns {JSX.Element} the cover strip
 */
export const MapHeader = ({
  map,
  height,
  pills,
  under,
}: {
  map: CardScore["map"];
  height: number;
  pills: readonly (string | null)[];
  under?: string | undefined;
}) => (
  <div style={{ position: "relative", display: "flex", height, background: INK.ink }}>
    {map.beatmapsetId ? (
      <img
        src={mapCoverUrl(map.beatmapsetId, "cover@2x")}
        width={974}
        height={height}
        alt=""
        style={{ width: "100%", height, objectFit: "cover", opacity: 0.85 }}
      />
    ) : null}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundImage: `linear-gradient(180deg, ${alpha(INK.ink, 0.1)} 0%, ${alpha(INK.ink, 0.8)} 100%)`,
      }}
    />
    <div style={{ position: "absolute", top: 16, left: 18, display: "flex", gap: 8 }}>
      {pills
        .filter((text): text is string => Boolean(text))
        .map((text) => (
          <Pill key={text} text={text} />
        ))}
    </div>
    <div
      style={{
        position: "absolute",
        left: 26,
        right: 26,
        bottom: 18,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 20,
        color: INK.paper,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div
          style={{ display: "flex", fontSize: 36, fontWeight: 800, lineHeight: 1.15, ...oneLine }}
        >
          {map.title}
        </div>
        <div style={{ display: "flex", fontSize: 20, ...oneLine }}>
          {`${map.artist} · [${map.version}]`}
        </div>
        {under ? (
          <div style={{ display: "flex", fontSize: 16, opacity: 0.85, ...oneLine }}>{under}</div>
        ) : null}
      </div>
      {map.stars !== null ? (
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 800,
            padding: "4px 12px",
            borderRadius: 4,
            border: `2px solid ${INK.paper}`,
          }}
        >
          <Stars value={stars(map.stars)} size={22} color={INK.paper} />
        </div>
      ) : null}
    </div>
  </div>
);
