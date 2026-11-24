/**
 * Geography for the corridor planner. Coordinates are real (lat, lon).
 * The outline is a simplified national silhouette for illustration only.
 * Distances are straight-line (great-circle), never a road quote.
 */

export type NodeKind = "depot" | "city" | "mine";

export interface GeoNode {
  id: string;
  name: string;
  kind: NodeKind;
  lat: number;
  lon: number;
  region: string;
}

/** Principal national fuel loading points used as lane origins. */
export const depots: GeoNode[] = [
  { id: "tema", name: "Tema", kind: "depot", lat: 5.64, lon: 0.0, region: "Greater Accra" },
  { id: "takoradi", name: "Takoradi", kind: "depot", lat: 4.89, lon: -1.76, region: "Western" },
  { id: "buipe", name: "Buipe", kind: "depot", lat: 8.77, lon: -1.45, region: "Savannah" },
];

export const destinations: GeoNode[] = [
  { id: "accra", name: "Accra", kind: "city", lat: 5.56, lon: -0.2, region: "Greater Accra" },
  { id: "cape-coast", name: "Cape Coast", kind: "city", lat: 5.11, lon: -1.25, region: "Central" },
  { id: "ho", name: "Ho", kind: "city", lat: 6.6, lon: 0.47, region: "Volta" },
  { id: "kumasi", name: "Kumasi", kind: "city", lat: 6.69, lon: -1.62, region: "Ashanti" },
  { id: "sunyani", name: "Sunyani", kind: "city", lat: 7.34, lon: -2.33, region: "Bono" },
  { id: "tamale", name: "Tamale", kind: "city", lat: 9.4, lon: -0.85, region: "Northern" },
  { id: "bolgatanga", name: "Bolgatanga", kind: "city", lat: 10.79, lon: -0.85, region: "Upper East" },
  { id: "wa", name: "Wa", kind: "city", lat: 10.06, lon: -2.5, region: "Upper West" },
  { id: "obuasi", name: "Obuasi", kind: "mine", lat: 6.2, lon: -1.67, region: "Ashanti" },
  { id: "tarkwa", name: "Tarkwa", kind: "mine", lat: 5.3, lon: -1.99, region: "Western" },
];

export const allNodes: GeoNode[] = [...depots, ...destinations];

/** Simplified Ghana silhouette, clockwise from the north-west, [lon, lat]. */
export const ghanaOutline: [number, number][] = [
  [-2.94, 11.0],
  [-2.0, 11.0],
  [-1.0, 11.0],
  [-0.2, 11.15],
  [0.0, 11.0],
  [-0.1, 10.7],
  [0.4, 10.4],
  [0.65, 10.0],
  [0.4, 9.4],
  [0.5, 8.7],
  [0.3, 8.0],
  [0.65, 7.4],
  [0.55, 6.7],
  [0.8, 6.3],
  [1.2, 6.1],
  [0.6, 5.85],
  [0.0, 5.6],
  [-0.6, 5.35],
  [-1.25, 5.1],
  [-1.76, 4.85],
  [-2.1, 4.74],
  [-2.65, 5.0],
  [-3.1, 5.1],
  [-2.95, 5.9],
  [-3.2, 6.6],
  [-2.8, 7.5],
  [-2.65, 8.2],
  [-2.5, 9.0],
  [-2.8, 9.7],
  [-2.65, 10.4],
];

/** Simplified Lake Volta outline [lon, lat] (illustrative), left dark in the dot field. */
export const lakeVolta: [number, number][] = [
  [0.06, 6.3], [0.28, 6.55], [0.33, 6.95], [0.2, 7.35], [0.05, 7.75], [-0.05, 8.05], [-0.25, 8.25],
  [-0.55, 8.35], [-0.95, 8.55], [-1.35, 8.64], [-1.58, 8.56], [-1.25, 8.44], [-0.9, 8.29], [-0.6, 8.14],
  [-0.36, 7.94], [-0.26, 7.6], [-0.16, 7.3], [-0.3, 7.06], [-0.56, 6.96], [-0.78, 6.8], [-0.46, 6.74],
  [-0.16, 6.8], [-0.03, 6.6],
];

/** Representative depot-to-destination lanes drawn as the network. */
export const networkLanes: [string, string][] = [
  ["tema", "kumasi"],
  ["tema", "accra"],
  ["tema", "ho"],
  ["tema", "cape-coast"],
  ["tema", "tamale"],
  ["takoradi", "tarkwa"],
  ["takoradi", "obuasi"],
  ["takoradi", "sunyani"],
  ["takoradi", "cape-coast"],
  ["buipe", "tamale"],
  ["buipe", "bolgatanga"],
  ["buipe", "wa"],
  ["buipe", "sunyani"],
  ["buipe", "kumasi"],
];

export const BOUNDS = { minLon: -3.3, maxLon: 1.3, minLat: 4.6, maxLat: 11.3 };
export const CENTER = {
  lon: (BOUNDS.minLon + BOUNDS.maxLon) / 2,
  lat: (BOUNDS.minLat + BOUNDS.maxLat) / 2,
};
/** World units per degree on the 3D map. */
export const SCALE = 1.6;

export function project(lon: number, lat: number): [number, number] {
  return [(lon - CENTER.lon) * SCALE, -(lat - CENTER.lat) * SCALE];
}

export function haversineKm(a: GeoNode, b: GeoNode): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function pointInPolygon(lon: number, lat: number): boolean {
  let inside = false;
  const pts = ghanaOutline;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    const hit = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

export function getNode(id: string): GeoNode | undefined {
  return allNodes.find((n) => n.id === id);
}

export const products = [
  { id: "petrol", label: "Petrol" },
  { id: "diesel", label: "Diesel" },
  { id: "gasoil", label: "Gasoil" },
] as const;
