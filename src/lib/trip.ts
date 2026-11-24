/**
 * Shared state model for "The Trip" simulation. Used by the 3D scene and the
 * DOM readouts so both always agree. Figures are an illustrative simulation,
 * never performance data.
 */

export const TRIP_COMPARTMENTS = [
  { id: "petrol", label: "Petrol", litres: 11000, color: "#FBCF6A" },
  { id: "diesel", label: "Diesel", litres: 11000, color: "#DFA040" },
  { id: "gasoil", label: "Gasoil", litres: 11000, color: "#AC7023" },
] as const;

export const TRIP_TOTAL = TRIP_COMPARTMENTS.reduce((s, c) => s + c.litres, 0);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));

export const STEPS = [
  { id: "load", label: "Load", from: 0, to: 0.26 },
  { id: "track", label: "Track", from: 0.26, to: 0.5 },
  { id: "deliver", label: "Deliver", from: 0.5, to: 0.76 },
  { id: "reconcile", label: "Reconcile", from: 0.76, to: 1.01 },
] as const;

export function stepIndex(p: number) {
  const i = STEPS.findIndex((s) => p >= s.from && p < s.to);
  return i === -1 ? STEPS.length - 1 : i;
}

export function compartmentLoad(p: number, i: number) {
  return seg(p, 0.07 + i * 0.035, 0.21 + i * 0.035);
}
export function compartmentDeliver(p: number, i: number) {
  return seg(p, 0.5 + i * 0.04, 0.68 + i * 0.04);
}

export interface TripState {
  depot: number; // 0..1 depot tank fill
  tanker: number[]; // per-compartment fill 0..1
  customer: number; // 0..1 customer tank fill
  loadedL: number;
  deliveredL: number;
  onBoardL: number;
  flowIn: number; // pipe activity 0..1
  flowOut: number;
  balance: number; // 0 = balanced
}

export function tripState(p: number): TripState {
  const loads = TRIP_COMPARTMENTS.map((_, i) => compartmentLoad(p, i));
  const dels = TRIP_COMPARTMENTS.map((_, i) => compartmentDeliver(p, i));
  const loadedL = TRIP_COMPARTMENTS.reduce((s, c, i) => s + c.litres * loads[i], 0);
  const deliveredL = TRIP_COMPARTMENTS.reduce((s, c, i) => s + c.litres * dels[i], 0);
  const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
  const avgDel = dels.reduce((a, b) => a + b, 0) / dels.length;
  const inActive = loads.some((l) => l > 0.001 && l < 0.999) ? 1 : 0;
  const outActive = dels.some((l) => l > 0.001 && l < 0.999) ? 1 : 0;
  return {
    depot: 1 - 0.5 * avgLoad,
    tanker: loads.map((l, i) => 0.88 * (l - dels[i])),
    customer: 0.08 + 0.78 * avgDel,
    loadedL,
    deliveredL,
    onBoardL: loadedL - deliveredL,
    flowIn: inActive,
    flowOut: outActive,
    balance: 1 - seg(p, 0.8, 0.95),
  };
}

export const fmtL = (n: number) => Math.round(n).toLocaleString("en-GH") + " L";
