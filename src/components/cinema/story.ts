/**
 * "Night Haul": the homepage film, which plays on its own (motion first).
 * Each scene plays one clip, then holds on the clip's last frame for `dwell` seconds while the copy
 * reads and the overlays (map, callouts, logo) appear. Single source for timing, copy, which clip
 * each scene plays, and the pure per-progress state the player, overlays and sound all read.
 * Litre figures are an illustrative load and are labeled as such in the UI.
 */

export type SceneId = "ignition" | "load" | "road" | "network" | "standard" | "arrival";
export type ClipId = "c1" | "c2" | "c3" | "c4" | "c5" | "c6";

export interface Fact {
  k: string;
  v: string;
}

export interface Scene {
  id: SceneId;
  index: string;
  kicker: string;
  title: string;
  body: string;
  facts: Fact[];
  /** Seconds the film holds on the clip's last frame before the next scene. */
  dwell: number;
  /** The clip this scene plays. */
  clip: ClipId;
  /** Still (2K keyframe) used when the film cannot autoplay, and on the inner pages. */
  still: string;
}

/** Every clip is 5 s at 24 fps (121 frames), as generated on Higgsfield. */
export const CLIP_SECONDS = 121 / 24;

export const SCENES: Scene[] = [
  {
    id: "ignition",
    index: "01",
    kicker: "Bulk fuel haulage · Ghana",
    title: "Strength in every litre.",
    body: "Ghanaian bulk fuel haulage. Petrol, diesel and gasoil, moved safely, accountably and on time.",
    facts: [
      { k: "Base", v: "Accra, Ghana" },
      { k: "Products", v: "Petrol · Diesel · Gasoil" },
      { k: "For", v: "OMCs · Stations · Mines · Industry" },
    ],
    dwell: 1.6,
    clip: "c1",
    still: "/images/haul/depot-gantry-dusk.webp",
  },
  {
    id: "load",
    index: "02",
    kicker: "The load",
    title: "It begins with a figure.",
    body: "Three sealed compartments, filled against calibrated meters and written down before the wheels turn.",
    facts: [
      { k: "C1 · Petrol", v: "11,000 L" },
      { k: "C2 · Diesel", v: "11,000 L" },
      { k: "C3 · Gasoil", v: "11,000 L" },
    ],
    dwell: 1.4,
    clip: "c2",
    still: "/images/haul/loading-arm-hatch.webp",
  },
  {
    id: "road",
    index: "03",
    kicker: "In transit",
    title: "Nothing on the road is invisible.",
    body: "GPS from gate to gate. Position, stops and deviations are seen while they happen, not reconstructed after.",
    facts: [
      { k: "Tracking", v: "Gate to gate" },
      { k: "Crew", v: "Trained driver & mate" },
      { k: "Watch", v: "Stops · Deviations" },
    ],
    dwell: 1.0,
    clip: "c3",
    still: "/images/haul/highway-wheels-night.webp",
  },
  {
    id: "network",
    index: "04",
    kicker: "The network",
    title: "Every lane in Ghana.",
    body: "Loading at Tema, Takoradi and Buipe. Delivering to filling stations, mines and plants across the country.",
    facts: [
      { k: "Depots", v: "Tema · Takoradi · Buipe" },
      { k: "Reach", v: "Nationwide lanes" },
      { k: "North", v: "Tamale · Bolgatanga · Wa" },
    ],
    dwell: 3.2,
    clip: "c4",
    still: "/images/haul/aerial-savanna-highway.webp",
  },
  {
    id: "standard",
    index: "05",
    kicker: "The standard",
    title: "Built to answer for itself.",
    body: "Insured, calibrated tankers and trained crews, aligned with NPA requirements. Loaded meets delivered, or the difference is explained.",
    facts: [
      { k: "Loaded", v: "33,000 L" },
      { k: "Delivered", v: "33,000 L" },
      { k: "Variance", v: "0 L" },
    ],
    dwell: 3.2,
    clip: "c5",
    still: "/images/haul/tanker-studio.webp",
  },
  {
    id: "arrival",
    index: "06",
    kicker: "Fortitier · Latin, “with strength”",
    title: "Name the lane. We haul it.",
    body: "Tell us the depot, the destination, the product and the volume. Dispatch answers in Ghana business hours.",
    facts: [],
    dwell: 5.5,
    clip: "c6",
    still: "/images/haul/tail-lights-night-road.webp",
  },
];

/**
 * The clips, in film order. A clip "chains" when its first frame is the previous clip's last
 * frame (generated with start and end frames); otherwise the join is a cut, covered by a flash.
 */
export const CLIPS: { id: ClipId; from: string; to: string; shot: string }[] = [
  { id: "c1", from: "K1", to: "K2", shot: "Depot gantry at blue hour: headlights ignite, dolly in and arc along the tank" },
  { id: "c2", from: "K2", to: "K3", shot: "Truck pulls away onto the highway; camera drops to the wheels" },
  { id: "c3", from: "K3", to: "K4", shot: "Camera overtakes the cab and turns to face the oncoming truck" },
  { id: "c4", from: "K4", to: "K5", shot: "Crane up into the night until the road is a thin line of light" },
  { id: "c5", from: "K6", to: "K6", shot: "Black studio: slow orbit, strip lights tracing the tank" },
  { id: "c6", from: "K7", to: "K7", shot: "Truck drives away into the night; camera tilts up to the stars" },
];

/** Seconds each scene lasts: its clip plus the hold on the last frame. */
export const sceneSeconds = (sc: Scene) => CLIP_SECONDS + sc.dwell;
export const TOTAL_SECONDS = SCENES.reduce((s, c) => s + sceneSeconds(c), 0);

/** Start of each scene, in seconds from the top of the film. */
export const STARTS: number[] = (() => {
  let acc = 0;
  return SCENES.map((c) => {
    const a = acc;
    acc += sceneSeconds(c);
    return a;
  });
})();

/** Cumulative [start, end] of each scene in global progress 0..1. */
export const RANGES: [number, number][] = SCENES.map((c, i) => [
  STARTS[i] / TOTAL_SECONDS,
  (STARTS[i] + sceneSeconds(c)) / TOTAL_SECONDS,
]);

export const sceneIndex = (id: SceneId) => SCENES.findIndex((s) => s.id === id);

export function sceneAt(p: number): { i: number; t: number } {
  const x = Math.min(0.99999, Math.max(0, p));
  for (let i = 0; i < RANGES.length; i++) {
    const [a, b] = RANGES[i];
    if (x >= a && x < b) return { i, t: (x - a) / (b - a) };
  }
  return { i: RANGES.length - 1, t: 1 };
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
/** Smoothstep of x across [a, b]. */
export const win = (x: number, a: number, b: number) => smooth((x - a) / (b - a));

/* ------------------------------------------------------------- timeline */

/**
 * Where the film is at `seconds` from the top: which scene, how far into it, and whether the clip is
 * still playing (`inClip`) or the film is holding on its last frame.
 */
export function timelineAt(seconds: number) {
  const T = ((seconds % TOTAL_SECONDS) + TOTAL_SECONDS) % TOTAL_SECONDS;
  let i = SCENES.length - 1;
  for (let k = 0; k < SCENES.length; k++) {
    if (T < STARTS[k] + sceneSeconds(SCENES[k])) {
      i = k;
      break;
    }
  }
  const local = T - STARTS[i];
  return { i, local, inClip: local < CLIP_SECONDS, clipTime: Math.min(local, CLIP_SECONDS), p: T / TOTAL_SECONDS };
}

/** Scene borders where the footage cuts instead of chaining. */
export const CUTS: number[] = SCENES.slice(1)
  .map((s, k) => {
    const prev = CLIPS.find((c) => c.id === SCENES[k].clip)!;
    const next = CLIPS.find((c) => c.id === s.clip)!;
    return prev.to === next.from ? -1 : RANGES[k + 1][0];
  })
  .filter((x) => x >= 0);

/* -------------------------------------------------------------- film state */

export const COMPARTMENT_LITRES = 11000;
export const TOTAL_LITRES = COMPARTMENT_LITRES * 3;

/** Everything the overlays and sound need at progress p. Pure and unit tested. */
export function filmAt(p: number) {
  const { i, t } = sceneAt(p);
  const id = SCENES[i].id;
  const local = (sid: SceneId) => {
    const [a, b] = RANGES[sceneIndex(sid)];
    return (p - a) / (b - a);
  };

  // Engine note for the soundscape (km/h).
  const kmh =
    win(local("ignition"), 0.45, 1) * 30 +
    win(local("load"), 0.4, 1) * 50 -
    win(local("network"), 0.92, 1.0) * 80 +
    win(local("arrival"), 0.0, 0.5) * 40 * (1 - win(local("arrival"), 0.85, 1));

  // Overlays, timed to the holds where the camera lingers.
  const tn = local("network");
  const map = win(tn, 0.6, 0.74) * (1 - win(tn, 0.95, 0.995));
  const ts = local("standard");
  const labels = win(ts, 0.63, 0.72) * (1 - win(ts, 0.96, 0.995));
  const ta = local("arrival");
  const logo = win(ta, 0.5, 0.72);

  // Cinemascope bars at the open and close.
  const letterbox = Math.max(1 - win(local("ignition"), 0.3, 0.85), win(ta, 0.4, 0.8));

  // Light flash over each cut.
  const flash = CUTS.reduce((m, c) => Math.max(m, 1 - Math.min(1, Math.abs(p - c) / 0.007)), 0);

  // Fade through black where the film loops from the night sky back to the depot.
  const fade = Math.max(win(ta, 0.95, 1), 1 - win(local("ignition"), 0, 0.05));

  return { scene: i, id, t, kmh: Math.max(0, kmh), map, labels, logo, letterbox, flash, fade };
}

export type FilmState = ReturnType<typeof filmAt>;

/**
 * Callouts on the studio shot (clip c5, near its last frame), in frame space (0..1 of the video frame).
 * `rise` bends the leader up (px, negative = down) so each tag lands on a clear patch, away from the
 * copy column, which sits over the cab on the left.
 */
export const RIG_LABELS: { id: string; text: string; x: number; y: number; side: "l" | "r"; rise?: number }[] = [
  { id: "gps", text: "GPS · gate to gate", x: 0.315, y: 0.178, side: "r", rise: 38 },
  { id: "manholes", text: "Three sealed compartments", x: 0.6, y: 0.272, side: "r", rise: 66 },
  { id: "tank", text: "Insured tanker · NPA-aligned", x: 0.515, y: 0.44, side: "r" },
  { id: "meters", text: "Calibrated meters", x: 0.66, y: 0.58, side: "r", rise: -104 },
];
