import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  EXIT_FACTORS,
  FLEET_SLIDES,
  LAYER_FACTORS,
  WIPE_DURATION_MS,
  coverAt,
  incomingProgress,
} from "../src/components/home/fleet-slides";

describe("fleet showcase hero physics & data", () => {
  it("defines four fuel & haulage slides with existing transparent WebP cutouts", () => {
    expect(FLEET_SLIDES).toHaveLength(4);
    expect(FLEET_SLIDES.map((s) => s.id)).toEqual(["petrol", "diesel", "gasoil", "contracts"]);
    for (const slide of FLEET_SLIDES) {
      const assetPath = path.resolve(__dirname, "../public", slide.tanker.src.replace(/^\//, ""));
      expect(existsSync(assetPath)).toBe(true);
      expect(slide.callouts).toHaveLength(4);
      expect(slide.mobileSpecs).toHaveLength(2);
      expect(slide.contactQuery).toContain("product=");
    }
  });

  it("sweeps smoothly & monotonically with immediate click response and long settle", () => {
    expect(WIPE_DURATION_MS).toBe(860);
    expect(coverAt(-0.1)).toBe(0);
    expect(coverAt(0)).toBe(0);
    expect(coverAt(1)).toBe(1);
    expect(coverAt(1.2)).toBe(1);

    let prev = 0;
    for (let i = 0; i <= 100; i++) {
      const c = coverAt(i / 100);
      expect(c).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = c;
    }

    // Immediate visible response by 25%, swift mid sweep, gentle decel tail
    expect(coverAt(0.25)).toBeGreaterThan(0.15);
    expect(coverAt(0.5)).toBeGreaterThan(0.55);
    expect(coverAt(0.85)).toBeGreaterThan(0.95);
  });

  it("choreographs incoming & outgoing parallax layers in strict depth order", () => {
    expect(incomingProgress(0)).toBe(0);
    expect(incomingProgress(0.06)).toBe(0);
    expect(incomingProgress(0.35)).toBeGreaterThan(0.65);
    expect(incomingProgress(1)).toBe(1);
    expect(LAYER_FACTORS.corner).toBeGreaterThan(LAYER_FACTORS.details);
    expect(LAYER_FACTORS.details).toBeGreaterThan(LAYER_FACTORS.word);
    expect(LAYER_FACTORS.word).toBeGreaterThan(LAYER_FACTORS.shadow);
    expect(LAYER_FACTORS.shadow).toBeGreaterThan(LAYER_FACTORS.tanker);
    expect(EXIT_FACTORS.corner).toBeGreaterThan(EXIT_FACTORS.tanker);
  });
});
