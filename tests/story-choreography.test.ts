import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  FORTITIER_PIXEL_ICONS,
  STORY_CARDS,
  arcStepRad,
  cardWidthForViewport,
  fanPose,
  pilePose,
  targetCardPose,
  wheelPose,
} from "../src/components/home/story-choreography";

describe("Fortitier Tidewell-inspired scroll story choreography", () => {
  it("defines 12 Fortitier haulage cards with valid local assets and 7 9x9 pixel icons", () => {
    expect(STORY_CARDS).toHaveLength(12);
    for (const card of STORY_CARDS) {
      const full = path.resolve(__dirname, "../public", card.src.replace(/^\//, ""));
      expect(existsSync(full)).toBe(true);
    }
    expect(FORTITIER_PIXEL_ICONS).toHaveLength(7);
    for (const icon of FORTITIER_PIXEL_ICONS) {
      expect(icon.rows).toHaveLength(9);
      for (const row of icon.rows) {
        expect(row).toHaveLength(9);
      }
    }
  });

  it("maintains the 1.05 * cw chord spacing gap between adjacent cards on fan and wheel", () => {
    const W = 1440;
    const H = 900;
    const cw = cardWidthForViewport(W, H, false);
    const R = (1250 * W) / 1440;
    const step = arcStepRad(cw, R);
    const chord = 2 * R * Math.sin(step / 2);
    expect(chord).toBeCloseTo(1.05 * cw, 1);

    const f0 = fanPose(0, W, H, cw, false);
    const f1 = fanPose(1, W, H, cw, false);
    const dist = Math.hypot(f1.x - f0.x, f1.y - f0.y);
    expect(dist).toBeCloseTo(1.05 * cw, 1);
  });

  it("transitions smoothly through fan -> scatter -> pile -> rotating wheel", () => {
    const W = 1440;
    const H = 900;
    const cw = cardWidthForViewport(W, H, false);

    // Cards 6..11 start hidden in fan, become visible in pile
    expect(targetCardPose(8, 0, W, H, cw, false).opacity).toBe(0);
    expect(targetCardPose(8, 0.31, W, H, cw, false).opacity).toBe(1);

    // Pile gathers near centre
    const pCenter = pilePose(0, W, H, cw);
    expect(Math.abs(pCenter.x - W * 0.5)).toBeLessThan(cw * 0.2);

    // Wheel rotates right-to-left (x decreases for central card 5 as rotSlots moves 0 -> -1)
    const wStart = wheelPose(5, 0, W, H, cw, false);
    const wMoved = wheelPose(5, -1, W, H, cw, false);
    expect(wMoved.x).toBeLessThan(wStart.x);
  });
});
