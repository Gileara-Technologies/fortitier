/**
 * Fortitier Fleet Showcase Hero — data, coordinates and transition physics.
 *
 * Engineered for silky 60fps panel-wipe transitions with immediate click response,
 * GPU-only layer compositing, and 5-layer depth parallax choreography. All copy
 * stays strictly faithful to Fortitier's Ghanaian bulk fuel haulage operations.
 */

export type FleetSlideId = "petrol" | "diesel" | "gasoil" | "contracts";

export interface DepthCallout {
  id: string;
  label: string;
  value: string;
  /** Design-frame left coordinate (1440 x 900). */
  x: number;
  /** Design-frame top coordinate (1440 x 900). */
  y: number;
  /** Alignment anchor for the glass pill. */
  align: "left" | "right";
  /** Idle bob duration in seconds (3.4..5.2). */
  bobDuration: number;
  /** Negative animation delay in seconds so no two callouts move in step. */
  bobDelay: number;
  /** Subtle base tilt in degrees. */
  baseTilt: number;
}

export interface FleetSlide {
  id: FleetSlideId;
  index: string;
  tabLabel: string;
  word: string;
  kicker: string;
  summary: string;
  /** Query string appended to /contact so the dispatch form arrives pre-filled. */
  contactQuery: string;
  /** Flat base backdrop colour (Fortitier obsidian / espresso / bronze family). */
  backdrop: string;
  /** Radial studio atmosphere painted over the flat backdrop. */
  glow: string;
  /** Primary accent colour token for this slide. */
  accent: string;
  /** Pre-feathered radial gradients for bottom-left & top-right foreground depth orbs. */
  flareBottomLeft: string;
  flareTopRight: string;
  /** Transparent WebP studio tanker cutout and its 1440x900 design box. */
  tanker: {
    src: string;
    alt: string;
    naturalWidth: number;
    naturalHeight: number;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  /** Four asymmetric floating mid-depth industrial instrument callouts. */
  callouts: DepthCallout[];
  /** Two concise mobile telemetry highlights shown cleanly under the tanker on portrait screens. */
  mobileSpecs: [string, string];
}

export const DESIGN_W = 1440;
export const DESIGN_H = 900;

/** Total panel-wipe + parallax settle duration in milliseconds. */
export const WIPE_DURATION_MS = 860;

/** Autoplay cadence and post-interaction pause window. */
export const AUTOPLAY_MS = 5200;
export const INTERACTION_PAUSE_MS = 7500;

/** Parallax depth multipliers for the 5 layers inside each incoming slide frame. */
export const LAYER_FACTORS = {
  word: 0.34,
  shadow: 0.22,
  tanker: 0.14,
  details: 0.48,
  corner: 0.64,
} as const;

/** Subtle exit-drift multipliers for the 5 layers of the outgoing slide. */
export const EXIT_FACTORS = {
  word: 0.16,
  shadow: 0.12,
  tanker: 0.1,
  details: 0.24,
  corner: 0.32,
} as const;

export type LayerKey = keyof typeof LAYER_FACTORS;

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Smooth, responsive cinematic ease-in-out curve for the panel wipe edge:
 * responds immediately on click (no dead stall), glides swiftly & fluidly across the
 * tanker over ~340 ms, then settles with a silky long deceleration tail.
 */
export function coverAt(t: number): number {
  const x = clamp01(t);
  if (x === 0 || x === 1) return x;
  // Asymmetric power S-curve: brisk entry (p=2.2), long luxurious settle (q=3.2)
  const split = 0.38;
  if (x < split) {
    const u = x / split;
    return 0.42 * Math.pow(u, 2.2);
  }
  const u = (x - split) / (1 - split);
  return 0.42 + 0.58 * (1 - Math.pow(1 - u, 3.2));
}

/**
 * Incoming slide parallax settle progress k in [0, 1].
 * Begins gliding almost immediately as the curtain opens (t = 0.06) and glides to rest
 * with an automotive quintic ease-out so the tanker and typography land seamlessly.
 */
export function incomingProgress(t: number): number {
  const u = clamp01((t - 0.06) / 0.94);
  return 1 - Math.pow(1 - u, 4);
}

export const FLEET_SLIDES: FleetSlide[] = [
  {
    id: "petrol",
    index: "01",
    tabLabel: "Petrol",
    word: "PETROL",
    kicker: "Forecourt & OMC Supply · Ghana",
    summary: "Sealed multi-compartment petrol haulage from Tema, Takoradi & Buipe straight to the pump.",
    contactQuery: "product=petrol&segment=station",
    backdrop: "#120803",
    glow: "radial-gradient(ellipse 76% 60% at 50% 44%, rgba(206, 136, 44, 0.38) 0%, rgba(59, 25, 2, 0.52) 48%, rgba(18, 8, 3, 0) 100%)",
    accent: "#DFA040",
    flareBottomLeft: "radial-gradient(circle, rgba(223, 160, 64, 0.24) 0%, rgba(172, 112, 35, 0.1) 36%, transparent 70%)",
    flareTopRight: "radial-gradient(circle, rgba(251, 207, 106, 0.22) 0%, rgba(172, 112, 35, 0.07) 40%, transparent 72%)",
    tanker: {
      src: "/images/hero/tanker-petrol.webp",
      alt: "Fortitier gloss-black tractor and polished stainless-steel petrol road tanker",
      naturalWidth: 1245,
      naturalHeight: 660,
      x: 270,
      y: 205,
      w: 900,
      h: 477,
    },
    callouts: [
      { id: "p-comp", label: "Compartments", value: "3 Sealed · Metered", x: 64, y: 184, align: "left", bobDuration: 4.1, bobDelay: -0.7, baseTilt: -0.6 },
      { id: "p-depots", label: "Loading Depots", value: "Tema · Takoradi · Buipe", x: 1118, y: 176, align: "right", bobDuration: 4.7, bobDelay: -2.3, baseTilt: 0.5 },
      { id: "p-gps", label: "Visibility", value: "Live GPS · Gate to Gate", x: 54, y: 506, align: "left", bobDuration: 3.6, bobDelay: -1.5, baseTilt: 0.4 },
      { id: "p-rec", label: "Accountability", value: "Every Litre Reconciled", x: 1104, y: 528, align: "right", bobDuration: 4.9, bobDelay: -3.1, baseTilt: -0.5 },
    ],
    mobileSpecs: ["Live GPS · Gate to Gate", "Tema · Takoradi · Buipe"],
  },
  {
    id: "diesel",
    index: "02",
    tabLabel: "Diesel",
    word: "DIESEL",
    kicker: "Mines & Heavy Industry · Nationwide",
    summary: "Long-haul bulk diesel into remote mine gates and industrial yards — planned for distance and terrain.",
    contactQuery: "product=diesel&segment=mine",
    backdrop: "#2A1506",
    glow: "radial-gradient(ellipse 76% 62% at 52% 45%, rgba(235, 170, 68, 0.42) 0%, rgba(108, 52, 14, 0.5) 46%, rgba(42, 21, 6, 0) 100%)",
    accent: "#FBCF6A",
    flareBottomLeft: "radial-gradient(circle, rgba(251, 207, 106, 0.24) 0%, rgba(172, 112, 35, 0.1) 36%, transparent 70%)",
    flareTopRight: "radial-gradient(circle, rgba(223, 160, 64, 0.22) 0%, rgba(92, 42, 10, 0.08) 40%, transparent 72%)",
    tanker: {
      src: "/images/hero/tanker-diesel.webp",
      alt: "Fortitier heavy-duty obsidian and brushed-bronze bulk diesel tanker truck",
      naturalWidth: 1087,
      naturalHeight: 619,
      x: 288,
      y: 189,
      w: 864,
      h: 492,
    },
    callouts: [
      { id: "d-mines", label: "Mine Corridors", value: "Obuasi · Tarkwa · Ahafo", x: 64, y: 180, align: "left", bobDuration: 4.4, bobDelay: -1.1, baseTilt: -0.5 },
      { id: "d-npa", label: "Compliance", value: "NPA-Aligned Operations", x: 1124, y: 186, align: "right", bobDuration: 3.8, bobDelay: -2.8, baseTilt: 0.6 },
      { id: "d-fleet", label: "Equipment", value: "Insured & Calibrated", x: 58, y: 514, align: "left", bobDuration: 4.8, bobDelay: -0.4, baseTilt: 0.5 },
      { id: "d-crew", label: "Crews", value: "Trained Driver & Mate", x: 1110, y: 524, align: "right", bobDuration: 3.7, bobDelay: -2.1, baseTilt: -0.4 },
    ],
    mobileSpecs: ["Obuasi · Tarkwa · Ahafo", "NPA-Aligned · Insured"],
  },
  {
    id: "gasoil",
    index: "03",
    tabLabel: "Gasoil",
    word: "GASOIL",
    kicker: "Plants & Industrial Storage · Ghana",
    summary: "Metered bulk gasoil with documented loading figures, live stop monitoring, and signed discharge proof.",
    contactQuery: "product=gasoil&segment=industrial",
    backdrop: "#1E1206",
    glow: "radial-gradient(ellipse 74% 58% at 48% 45%, rgba(212, 148, 52, 0.38) 0%, rgba(74, 38, 10, 0.52) 48%, rgba(30, 18, 6, 0) 100%)",
    accent: "#DFA040",
    flareBottomLeft: "radial-gradient(circle, rgba(223, 160, 64, 0.22) 0%, rgba(138, 90, 28, 0.1) 38%, transparent 70%)",
    flareTopRight: "radial-gradient(circle, rgba(251, 207, 106, 0.2) 0%, rgba(172, 112, 35, 0.08) 40%, transparent 72%)",
    tanker: {
      src: "/images/hero/tanker-gasoil.webp",
      alt: "Fortitier multi-compartment polished stainless-steel gasoil road tanker profile",
      naturalWidth: 1250,
      naturalHeight: 545,
      x: 236,
      y: 256,
      w: 968,
      h: 422,
    },
    callouts: [
      { id: "g-load", label: "Loading Standard", value: "Calibrated Depot Meters", x: 64, y: 186, align: "left", bobDuration: 3.9, bobDelay: -1.8, baseTilt: -0.4 },
      { id: "g-reach", label: "Coverage", value: "Coast to Savannah", x: 1134, y: 178, align: "right", bobDuration: 4.6, bobDelay: -0.9, baseTilt: 0.5 },
      { id: "g-watch", label: "Dispatch Watch", value: "Stops & Deviations", x: 56, y: 508, align: "left", bobDuration: 4.3, bobDelay: -3.2, baseTilt: 0.4 },
      { id: "g-proof", label: "Closure", value: "Signed Trip Record", x: 1114, y: 526, align: "right", bobDuration: 3.5, bobDelay: -1.3, baseTilt: -0.6 },
    ],
    mobileSpecs: ["Calibrated Depot Meters", "Signed Trip Record"],
  },
  {
    id: "contracts",
    index: "04",
    tabLabel: "Contracts",
    word: "CONTRACTS",
    kicker: "Dedicated OMC Lanes · Scheduled Capacity",
    summary: "The same calibrated trucks and trained crews on your agreed weekly routes — capacity you count on.",
    contactQuery: "product=mixed&segment=omc",
    backdrop: "#0A0603",
    glow: "radial-gradient(ellipse 76% 60% at 50% 44%, rgba(251, 207, 106, 0.28) 0%, rgba(112, 62, 16, 0.38) 46%, rgba(10, 6, 3, 0) 100%)",
    accent: "#FBCF6A",
    flareBottomLeft: "radial-gradient(circle, rgba(251, 207, 106, 0.2) 0%, rgba(172, 112, 35, 0.08) 38%, transparent 70%)",
    flareTopRight: "radial-gradient(circle, rgba(223, 160, 64, 0.22) 0%, rgba(92, 42, 10, 0.08) 40%, transparent 72%)",
    tanker: {
      src: "/images/hero/tanker-contracts.webp",
      alt: "Flagship Fortitier dedicated contract petroleum tanker rig",
      naturalWidth: 1075,
      naturalHeight: 634,
      x: 296,
      y: 180,
      w: 848,
      h: 500,
    },
    callouts: [
      { id: "c-ded", label: "Dedicated Fleet", value: "Same Trucks · Same Crews", x: 64, y: 182, align: "left", bobDuration: 4.5, bobDelay: -0.6, baseTilt: -0.5 },
      { id: "c-sched", label: "Cadence", value: "Agreed Weekly Lanes", x: 1128, y: 180, align: "right", bobDuration: 4.0, bobDelay: -2.4, baseTilt: 0.4 },
      { id: "c-rep", label: "Reporting", value: "Transparent Records", x: 56, y: 512, align: "left", bobDuration: 3.7, bobDelay: -1.7, baseTilt: 0.5 },
      { id: "c-std", label: "Operating Ethos", value: "Safe · Accountable · On Time", x: 1084, y: 526, align: "right", bobDuration: 4.8, bobDelay: -2.9, baseTilt: -0.4 },
    ],
    mobileSpecs: ["Dedicated OMC Capacity", "Agreed Weekly Lanes"],
  },
];
