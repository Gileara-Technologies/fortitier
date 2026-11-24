import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  SHELF_DOSSIERS,
  SHELF_TABS,
  computeShelfDims,
  shelfStepB,
  shelfX,
  shortestLoopTarget,
  tapeOpenness,
} from "../src/components/home/shelf-data";

describe("Fortitier 3D services archival shelf geometry & dossiers", () => {
  it("defines strictly the 6 official Fortitier services with existing local assets", () => {
    expect(SHELF_DOSSIERS).toHaveLength(6);
    expect(SHELF_TABS.map((t) => t.id)).toEqual(["all", "haulage", "tracking", "compliance"]);
    expect(SHELF_DOSSIERS.filter((d) => d.status === "roadmap")).toHaveLength(1);
    for (const doc of SHELF_DOSSIERS) {
      const full = path.resolve(__dirname, "../public", doc.image.replace(/^\//, ""));
      expect(existsSync(full)).toBe(true);
      expect(doc.highlights.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("matches Leon Vasari continuous B(r), F(r) and openness math", () => {
    expect(shelfStepB(0)).toBe(0);
    expect(shelfStepB(1)).toBe(0.5);
    expect(shelfStepB(-1)).toBe(-0.5);
    expect(shelfStepB(2.5)).toBe(0.5);

    const dims = computeShelfDims(400);
    expect(dims.ws).toBeCloseTo((400 * 142) / 840, 4);
    expect(dims.d).toBeCloseTo((400 * 474) / 900, 4);
    expect(shelfX(0, dims)).toBe(0);
    expect(shelfX(1, dims)).toBeCloseTo(-shelfX(-1, dims), 4);
    expect(shelfX(1, dims)).toBeGreaterThan(dims.d / 2);

    expect(tapeOpenness(0)).toBe(1);
    expect(tapeOpenness(1)).toBe(0);
    expect(tapeOpenness(-1)).toBe(0);
    expect(tapeOpenness(0.5)).toBe(0.5);
  });

  it("finds the shortest path around the 6-service loop for category jumps", () => {
    // From index 5 (v=17) to index 0 should step +1 (to 18), not -5
    expect(shortestLoopTarget(17, 0, 6)).toBe(18);
    // From index 1 (v=13) to index 5 should step -2 (to 11), not +4
    expect(shortestLoopTarget(13, 5, 6)).toBe(11);
  });
});
