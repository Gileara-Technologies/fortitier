"use client";

import { useId } from "react";
import { allNodes, ghanaOutline, getNode, lakeVolta, networkLanes, type GeoNode } from "@/content/geo";
import { cn } from "@/lib/cn";

/** Plain equirectangular projection: 100 SVG units per degree. */
const X = (lon: number) => (lon + 3.3) * 100;
const Y = (lat: number) => (11.3 - lat) * 100;
const poly = (pts: [number, number][]) =>
  pts.map(([lon, lat], i) => `${i ? "L" : "M"}${X(lon).toFixed(1)},${Y(lat).toFixed(1)}`).join("") + "Z";

/** A gentle arc between two places (bowed to one side, so lanes never sit on top of each other). */
function arc(a: GeoNode, b: GeoNode, bend = 0.16) {
  const x1 = X(a.lon);
  const y1 = Y(a.lat);
  const x2 = X(b.lon);
  const y2 = Y(b.lat);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${(mx - dy * bend).toFixed(1)},${(my + dx * bend).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

/**
 * Map of Ghana for the corridor planner: real coordinates, the depots and destinations, the
 * national network faintly, and the chosen lane drawn in gold with a light travelling along it.
 * Click a depot to load there, any other place to deliver there.
 */
export default function LaneMap({
  originId,
  destId,
  onPick,
}: {
  originId: string;
  destId: string;
  onPick: (id: string) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const origin = getNode(originId)!;
  const dest = getNode(destId)!;
  const lane = arc(origin, dest);
  const laneKey = `${originId}-${destId}`;

  return (
    <svg viewBox="-40 -30 540 730" className="h-full w-full" role="group" aria-label={`Map of Ghana. Selected lane: ${origin.name} to ${dest.name}.`}>
      <defs>
        <pattern id={`dots-${uid}`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.05" fill="#dfa040" opacity="0.32" />
        </pattern>
        <clipPath id={`land-${uid}`}>
          <path d={poly(ghanaOutline)} />
        </clipPath>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`halo-${uid}`}>
          <stop offset="0" stopColor="#dfa040" stopOpacity="0.16" />
          <stop offset="1" stopColor="#dfa040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* land */}
      <path d={poly(ghanaOutline)} fill="#140b05" />
      <g clipPath={`url(#land-${uid})`}>
        <rect x="-40" y="-30" width="540" height="730" fill={`url(#dots-${uid})`} />
        <circle cx={X(dest.lon)} cy={Y(dest.lat)} r="160" fill={`url(#halo-${uid})`} />
      </g>
      <path d={poly(lakeVolta)} fill="#070403" stroke="#dfa040" strokeOpacity="0.18" strokeWidth="1" />
      <path d={poly(ghanaOutline)} fill="none" stroke="#dfa040" strokeOpacity="0.55" strokeWidth="1.4" strokeLinejoin="round" />

      {/* the network, faintly */}
      <g fill="none" stroke="#f3e6cf" strokeOpacity="0.1" strokeWidth="1">
        {networkLanes.map(([a, b]) => (
          <path key={`${a}-${b}`} d={arc(getNode(a)!, getNode(b)!)} />
        ))}
      </g>

      {/* the chosen lane */}
      <g key={laneKey}>
        <path d={lane} fill="none" stroke="#dfa040" strokeOpacity="0.25" strokeWidth="9" strokeLinecap="round" />
        <path id={`lane-${uid}`} d={lane} pathLength={1} className="lane-draw" fill="none" stroke="#fbcf6a" strokeWidth="2.6" strokeLinecap="round" filter={`url(#glow-${uid})`} />
        <circle r="4.5" fill="#fff3dc" filter={`url(#glow-${uid})`}>
          <animateMotion dur="3.6s" repeatCount="indefinite" begin="1.2s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1">
            <mpath href={`#lane-${uid}`} />
          </animateMotion>
        </circle>
      </g>

      {/* places */}
      {allNodes.map((n) => {
        const on = n.id === originId || n.id === destId;
        const x = X(n.lon);
        const y = Y(n.lat);
        const leftLabel = n.lon < -2.2;
        return (
          <g
            key={n.id}
            role="button"
            tabIndex={0}
            aria-label={`${n.kind === "depot" ? "Load at" : "Deliver to"} ${n.name}`}
            aria-pressed={on}
            onClick={() => onPick(n.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(n.id);
              }
            }}
            className="cursor-pointer outline-none [&:focus-visible_.focus]:opacity-100"
          >
            <circle cx={x} cy={y} r="18" fill="transparent" />
            <circle className="focus" cx={x} cy={y} r="13" fill="none" stroke="#fbcf6a" strokeWidth="1.5" opacity="0" />
            {on ? <circle cx={x} cy={y} r="12" fill="none" stroke="#dfa040" strokeWidth="1.2" className="cine-ring" /> : null}
            {n.kind === "depot" ? (
              <rect x={x - 5} y={y - 5} width="10" height="10" fill={on ? "#fbcf6a" : "#dfa040"} stroke="#140b05" strokeWidth="1.5" />
            ) : n.kind === "mine" ? (
              <rect x={x - 4.5} y={y - 4.5} width="9" height="9" transform={`rotate(45 ${x} ${y})`} fill={on ? "#fff3dc" : "#c9b393"} stroke="#140b05" strokeWidth="1.5" />
            ) : (
              <circle cx={x} cy={y} r={on ? 5.5 : 4} fill={on ? "#fff3dc" : "#c9b393"} stroke="#140b05" strokeWidth="1.5" />
            )}
            <text
              x={leftLabel ? x - 11 : x + 11}
              y={y + 4}
              textAnchor={leftLabel ? "end" : "start"}
              className={cn("select-none font-mono uppercase", on ? "fill-[#fbcf6a]" : "fill-[#f3e6cf]/60")}
              style={{ fontSize: on ? 13 : 11, letterSpacing: "0.12em", fontWeight: on ? 600 : 400 }}
            >
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
