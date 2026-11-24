import { describe, expect, it } from "vitest";
import {
  allNodes,
  depots,
  destinations,
  getNode,
  ghanaOutline,
  haversineKm,
  pointInPolygon,
  project,
} from "../src/content/geo";
import { TRIP_TOTAL, clamp01, seg, stepIndex, tripState } from "../src/lib/trip";

describe("geo", () => {
  it("has the three depots and ten destinations with unique ids", () => {
    expect(depots).toHaveLength(3);
    expect(destinations).toHaveLength(10);
    const ids = allNodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every node sits inside the simplified Ghana outline", () => {
    for (const n of allNodes) {
      expect(pointInPolygon(n.lon, n.lat), `${n.name} should be inside the outline`).toBe(true);
    }
  });

  it("haversine distance is sensible and symmetric", () => {
    const tema = getNode("tema")!;
    const kumasi = getNode("kumasi")!;
    const d = haversineKm(tema, kumasi);
    expect(d).toBeGreaterThan(190);
    expect(d).toBeLessThan(220);
    expect(haversineKm(kumasi, tema)).toBeCloseTo(d, 6);
    expect(haversineKm(tema, tema)).toBe(0);
  });

  it("projects north to negative z and keeps the outline finite", () => {
    const [, zNorth] = project(0, 11);
    const [, zSouth] = project(0, 5);
    expect(zNorth).toBeLessThan(zSouth);
    for (const [lon, lat] of ghanaOutline) {
      const [x, z] = project(lon, lat);
      expect(Number.isFinite(x) && Number.isFinite(z)).toBe(true);
    }
  });
});

describe("trip simulation", () => {
  it("starts empty and ends delivered with the books balanced", () => {
    const start = tripState(0);
    expect(start.loadedL).toBe(0);
    expect(start.onBoardL).toBe(0);
    expect(start.deliveredL).toBe(0);
    const end = tripState(1);
    expect(end.loadedL).toBeCloseTo(TRIP_TOTAL, 3);
    expect(end.deliveredL).toBeCloseTo(TRIP_TOTAL, 3);
    expect(end.onBoardL).toBeCloseTo(0, 3);
    expect(end.balance).toBe(0);
  });

  it("conserves product at every point: loaded = on board + delivered", () => {
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const s = tripState(p);
      expect(s.loadedL).toBeCloseTo(s.onBoardL + s.deliveredL, 6);
      expect(s.onBoardL).toBeGreaterThanOrEqual(-1e-6);
    }
  });

  it("maps progress to the four steps in order", () => {
    expect([0, 0.3, 0.6, 0.95].map(stepIndex)).toEqual([0, 1, 2, 3]);
    expect(clamp01(2)).toBe(1);
    expect(seg(0.5, 0, 1)).toBeCloseTo(0.5, 6);
  });
});
