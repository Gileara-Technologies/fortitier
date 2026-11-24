/**
 * Fortitier Logistics — "Fuel in Motion" scroll-story choreography math & content.
 *
 * Translates the Tidewell four-part scroll story (pixel-icon morph, fan -> scatter -> pile ->
 * rotating 12-card wheel, gated dusk window + floating 3D-yawing tanker + zoom blackout, and
 * horizontal black manifesto) into Fortitier's authentic Ghanaian bulk fuel haulage brand.
 */

export interface StoryCard {
  id: string;
  index: string;
  label: string;
  sublabel: string;
  src: string;
  alt: string;
  /** Subtle focal crop for 3:4 portrait card framing. */
  objectPosition?: string;
  /** Dark studio cutout cards use object-contain on deep espresso studio ground. */
  studio?: boolean;
}

export interface CardPose {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
}

export interface PixelIconDef {
  id: string;
  label: string;
  /** 9 rows of 9 chars: '.' empty, 'k' espresso #3B1902, 'g' gold #DFA040, 'b' bronze #AC7023, 'w' white #FFFFFF */
  rows: readonly string[];
}

export const PIXEL_PALETTE: Record<string, string> = {
  k: "#3B1902",
  g: "#DFA040",
  b: "#AC7023",
  w: "#FFFFFF",
};

/** Seven 9x9 industrial pixel icons that morph into "Fuel in Motion". */
export const FORTITIER_PIXEL_ICONS: PixelIconDef[] = [
  {
    // 1. Fuel tanker silhouette
    id: "tanker",
    label: "Fuel tanker",
    rows: [
      ".........",
      ".........",
      "..kkkkkk.",
      ".kggggggk",
      "kkggggggk",
      "kwkgggggk",
      "kkkkkkkkk",
      ".kk...kk.",
      ".........",
    ],
  },
  {
    // 2. Fuel drop
    id: "drop",
    label: "Petroleum drop",
    rows: [
      "....k....",
      "...kgk...",
      "..kgggk..",
      ".kggwggk.",
      ".kggwggk.",
      ".kgggggk.",
      "..kbbbk..",
      "...kkk...",
      ".........",
    ],
  },
  {
    // 3. Depot gantry
    id: "depot",
    label: "Loading depot",
    rows: [
      "kkkkkkkkk",
      "k..g.g..k",
      "k..k.k..k",
      "k..k.k..k",
      "k..g.g..k",
      "k.......k",
      "k..bbb..k",
      "kkkkkkkkk",
      ".........",
    ],
  },
  {
    // 4. Live GPS pin
    id: "gps",
    label: "GPS tracking",
    rows: [
      "..kkkkk..",
      ".kgggggk.",
      "kggwwwggk",
      "kggwkwggk",
      "kggwwwggk",
      ".kgggggk.",
      "..kbbbk..",
      "...kbk...",
      "....k....",
    ],
  },
  {
    // 5. Calibrated meter gauge
    id: "gauge",
    label: "Calibrated meter",
    rows: [
      "..kkkkk..",
      ".kwwwwwk.",
      "kwwkwwgwk",
      "kwwwkggwk",
      "kwwwwkwwk",
      "kwwbbbwwk",
      ".kgggggk.",
      "..kkkkk..",
      ".........",
    ],
  },
  {
    // 6. Safety compliance shield
    id: "shield",
    label: "Safety & compliance",
    rows: [
      ".kkkkkkk.",
      "kgggggggk",
      "kgwwwwwgk",
      "kgwgggwkg",
      "kgwgggwkg",
      ".kgwwwgk.",
      "..kbbbk..",
      "...kbk...",
      "....k....",
    ],
  },
  {
    // 7. Nationwide highway compass
    id: "compass",
    label: "Nationwide Ghana",
    rows: [
      "....g....",
      "..k.k.k..",
      ".k..g..k.",
      "k..kgk..k",
      "gkkgwgkkg",
      "k..kbk..k",
      ".k..b..k.",
      "..k.k.k..",
      "....b....",
    ],
  },
];

/** The 12 curated Fortitier haulage cards (0-5 open in the warm golden-hour fan; 6-11 join for pile & rotating wheel). */
export const STORY_CARDS: StoryCard[] = [
  {
    id: "c0",
    index: "01",
    label: "Terminal",
    sublabel: "Coastal storage · Dawn",
    src: "/images/story/terminal-sunrise.webp",
    alt: "Gleaming silver petroleum storage tanks and pipelines at a coastal terminal at golden sunrise",
    objectPosition: "50% 50%",
  },
  {
    id: "c1",
    index: "02",
    label: "Calibrated",
    sublabel: "Precision valves & meters",
    src: "/images/story/manifold-valves.webp",
    alt: "Macro detail of stainless-steel tanker manifold valves and brass pressure gauge in warm sunset light",
    objectPosition: "50% 50%",
  },
  {
    id: "c2",
    index: "03",
    label: "Corridor",
    sublabel: "Golden savanna run",
    src: "/images/story/golden-highway.webp",
    alt: "Black and stainless-steel fuel tanker cruising a sunlit golden Ghanaian savanna highway",
    objectPosition: "50% 50%",
  },
  {
    id: "c3",
    index: "04",
    label: "Loading",
    sublabel: "Three sealed compartments",
    src: "/images/story/loading-gantry.webp",
    alt: "Overhead articulated petroleum loading arms above three sealed stainless tanker hatches at amber twilight",
    objectPosition: "50% 50%",
  },
  {
    id: "c4",
    index: "05",
    label: "Refined",
    sublabel: "Petrol · Diesel · Gasoil",
    src: "/images/story/liquid-gold.webp",
    alt: "Sculptural golden-amber refined fuel stream backlit in warm bronze studio light",
    objectPosition: "50% 50%",
  },
  {
    id: "c5",
    index: "06",
    label: "Forecourt",
    sublabel: "Delivered on schedule",
    src: "/images/story/forecourt-dusk.webp",
    alt: "Architectural bronze-and-cream modern filling station canopy illuminated at golden dusk",
    objectPosition: "50% 50%",
  },
  {
    id: "c6",
    index: "07",
    label: "Depot Dusk",
    sublabel: "Tema · Takoradi · Buipe",
    src: "/images/haul/depot-gantry-dusk.webp",
    alt: "Fortitier fuel tanker under the depot loading gantry at dusk",
    objectPosition: "45% 50%",
  },
  {
    id: "c7",
    index: "08",
    label: "Night Watch",
    sublabel: "Live GPS · Gate to gate",
    src: "/images/haul/aerial-savanna-highway.webp",
    alt: "Aerial view of a Fortitier tanker lit along a Ghanaian highway at night",
    objectPosition: "50% 55%",
  },
  {
    id: "c8",
    index: "09",
    label: "Transit",
    sublabel: "Nationwide routes",
    src: "/images/haul/highway-wheels-night.webp",
    alt: "Fortitier fuel tanker rolling down a wet Ghanaian highway at night",
    objectPosition: "55% 50%",
  },
  {
    id: "c9",
    index: "10",
    label: "Hatch Seal",
    sublabel: "Metered before departure",
    src: "/images/haul/loading-arm-hatch.webp",
    alt: "Loading arm connected to the top hatch of a calibrated stainless tanker",
    objectPosition: "55% 42%",
  },
  {
    id: "c10",
    index: "11",
    label: "Arrival",
    sublabel: "Confirmed on site",
    src: "/images/haul/headlights-oncoming.webp",
    alt: "Oncoming Fortitier tanker headlights arriving on schedule",
    objectPosition: "45% 50%",
  },
  {
    id: "c11",
    index: "12",
    label: "Northern Run",
    sublabel: "Coast to Savannah",
    src: "/images/haul/tail-lights-night-road.webp",
    alt: "Fortitier tanker tail lights along a straight northern highway",
    objectPosition: "38% 55%",
  },
];

/* --------------------------------------------------------------- easing */

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function eInOut(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function eOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

/** Soft overshoot back-out (s = 1.15) matching Tidewell's tactile spring feel. */
export function eBackOut(t: number, s = 1.15): number {
  const x = clamp01(t);
  const c3 = s + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
}

/** Smooth cubic-bezier(0.25, 0.75, 0.2, 1) approximation for wheel fan-out glide. */
export function eGlide(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 2.75);
}

/* ---------------------------------------------------------- card poses */

/**
 * Angular step (radians) between adjacent cards on an arc of radius R so the chord
 * between card centres is strictly 1.05 * cw (a crisp 5% visible gap everywhere).
 */
export function arcStepRad(cw: number, R: number): number {
  const ratio = Math.min(0.95, (1.05 * cw) / (2 * Math.max(R, cw)));
  return 2 * Math.asin(ratio);
}

export function cardWidthForViewport(W: number, H: number, mobile: boolean): number {
  if (mobile) return Math.min(W * 0.3, H * 0.2);
  return Math.min(W / 1440, H / 780) * 214;
}

export function fanPose(i: number, W: number, H: number, cw: number, mobile: boolean): CardPose {
  if (i >= 6) {
    return { x: W * 0.5, y: H * 1.42, rot: 0, scale: 0.92, opacity: 0 };
  }
  const R = mobile ? W * 1.35 : (1250 * W) / 1440;
  const step = arcStepRad(cw, R);
  const theta = (i - 2.5) * step;
  const cx = mobile ? W * 0.5 : W * 0.52;
  const cy = H * 0.86 + R;
  const x = cx + R * Math.sin(theta) - (mobile ? 0 : W * 0.018);
  const y = cy - R * Math.cos(theta) + (mobile ? cw * 0.2 : 0);
  return { x, y, rot: (theta * 180) / Math.PI, scale: 1, opacity: 1 };
}

const DESKTOP_SCATTER: readonly (readonly [number, number, number])[] = [
  [0.08, 0.48, -19],
  [0.19, 0.86, -12],
  [0.81, 0.84, 14],
  [0.37, 1.04, -8],
  [0.92, 0.44, 16],
  [0.63, 1.04, 9],
];

const MOBILE_SCATTER: readonly (readonly [number, number, number])[] = [
  [0.07, 0.62, -18],
  [0.45, 0.7, 11],
  [0.93, 0.62, 16],
  [0.22, 0.94, -13],
  [0.74, 0.96, 9],
  [0.5, 1.32, 0],
];

export function scatterPose(i: number, W: number, H: number, mobile: boolean): CardPose {
  if (i >= 6) {
    return { x: W * 0.5, y: H * 1.42, rot: 0, scale: 0.92, opacity: 0 };
  }
  const [fx, rawFy, rot] = mobile ? MOBILE_SCATTER[i] : DESKTOP_SCATTER[i];
  const fy = H < 500 && rawFy < 0.1 ? rawFy + 0.08 : rawFy;
  return { x: W * fx, y: H * fy, rot, scale: 0.96, opacity: 1 };
}

export function pilePose(i: number, W: number, H: number, cw: number): CardPose {
  const x = W * 0.5 + ((i % 3) - 1) * cw * 0.08;
  const y = H * 0.63 + (((i * 7) % 5) - 2) * cw * 0.04;
  const sign = i % 2 === 0 ? 1 : -1;
  const rot = sign * (4 + i * 1.25);
  return { x, y, rot, scale: 0.95, opacity: 1 };
}

export function wheelPose(
  i: number,
  rotSlots: number,
  W: number,
  H: number,
  cw: number,
  mobile: boolean,
): CardPose {
  const mod = (((i + rotSlots) % 12) + 12) % 12;
  const slot = mod - 5.5;
  const R = mobile ? W * 1.2 : (900 * W) / 1440;
  const step = arcStepRad(cw, R);
  const theta = slot * step;
  const angleDeg = (theta * 180) / Math.PI;
  const cx = W * 0.5;
  const cy = (mobile ? H * 0.77 : H * 0.83) + R;
  const x = cx + R * Math.sin(theta);
  const y = cy - R * Math.cos(theta);
  const visible = Math.abs(angleDeg) < 62;
  const edgeFade = visible ? clamp01((62 - Math.abs(angleDeg)) / 10) : 0;
  return { x, y, rot: angleDeg, scale: 1, opacity: edgeFade };
}

export function blendPose(a: CardPose, b: CardPose, t: number): CardPose {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    rot: lerp(a.rot, b.rot, t),
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
  };
}

/**
 * Computes the target pose of card i at story progress p in [0, 1].
 * Phases:
 * - 0.004..0.105: fan -> scatter
 * - 0.21..0.31:   scatter -> central pile (cards 6..11 join)
 * - 0.31..0.41:   pile -> bottom wheel arc
 * - 0.41..0.57:   wheel rotates 3 slots right-to-left
 * - 0.57..1.00:   wheel rests cleanly while dusk panel expands above
 */
export function targetCardPose(
  i: number,
  p: number,
  W: number,
  H: number,
  cw: number,
  mobile: boolean,
): CardPose {
  const fan = fanPose(i, W, H, cw, mobile);
  const scat = scatterPose(i, W, H, mobile);
  const pile = pilePose(i, W, H, cw);

  if (p <= 0.004) return fan;
  if (p < 0.105) {
    return blendPose(fan, scat, eInOut((p - 0.004) / (0.105 - 0.004)));
  }
  if (p < 0.21) return scat;
  if (p < 0.31) {
    const t = eInOut((p - 0.21) / 0.1);
    const pose = blendPose(scat, pile, t);
    if (i >= 6) {
      // Cards 6..11 rise smoothly into the central pile during gather
      pose.opacity = clamp01((t - 0.15) / 0.65);
    }
    return pose;
  }
  if (p < 0.41) {
    const t = eGlide((p - 0.31) / 0.1);
    const w0 = wheelPose(i, 0, W, H, cw, mobile);
    return blendPose(pile, w0, t);
  }
  const wheelProgress = eInOut(clamp01((p - 0.41) / 0.16));
  const rotSlots = -3 * wheelProgress;
  return wheelPose(i, rotSlots, W, H, cw, mobile);
}
