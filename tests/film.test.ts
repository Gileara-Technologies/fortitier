import { describe, expect, it } from "vitest";
import { CLIPS, CLIP_SECONDS, CUTS, RANGES, SCENES, STARTS, TOTAL_SECONDS, filmAt, sceneAt, timelineAt } from "../src/components/cinema/story";

describe("film timeline", () => {
  it("scene ranges tile 0..1 contiguously", () => {
    expect(RANGES[0][0]).toBe(0);
    expect(RANGES[RANGES.length - 1][1]).toBeCloseTo(1, 10);
    for (let i = 1; i < RANGES.length; i++) expect(RANGES[i][0]).toBeCloseTo(RANGES[i - 1][1], 10);
    RANGES.forEach(([a, b], i) => expect(sceneAt((a + b) / 2).i).toBe(i));
  });

  it("every scene plays a known clip, each clip once, in film order", () => {
    expect(SCENES.map((s) => s.clip)).toEqual(CLIPS.map((c) => c.id));
  });

  it("plays each clip, then holds on its last frame for the scene's dwell", () => {
    SCENES.forEach((s, i) => {
      const playing = timelineAt(STARTS[i] + CLIP_SECONDS * 0.5);
      expect(playing.i).toBe(i);
      expect(playing.inClip).toBe(true);
      const holding = timelineAt(STARTS[i] + CLIP_SECONDS + s.dwell * 0.5);
      expect(holding.i).toBe(i);
      expect(holding.inClip).toBe(false);
      expect(holding.clipTime).toBeCloseTo(CLIP_SECONDS, 10);
    });
  });

  it("time only moves forward through the scenes, and wraps at the end", () => {
    let last = -1;
    for (let t = 0; t < TOTAL_SECONDS; t += 0.05) {
      const { i } = timelineAt(t);
      expect(i).toBeGreaterThanOrEqual(last);
      last = i;
    }
    expect(timelineAt(TOTAL_SECONDS + 0.1).i).toBe(0);
    expect(timelineAt(TOTAL_SECONDS * 0.5).p).toBeCloseTo(0.5, 10);
  });

  it("flashes only where clips do not chain (aerial → studio, studio → road)", () => {
    expect(CUTS).toHaveLength(2);
    expect(CUTS[0]).toBeCloseTo(RANGES[4][0], 10);
    expect(CUTS[1]).toBeCloseTo(RANGES[5][0], 10);
    expect(filmAt(CUTS[0]).flash).toBeCloseTo(1, 5);
    expect(filmAt((RANGES[1][0] + RANGES[1][1]) / 2).flash).toBe(0);
  });

  it("overlays appear in their own scenes, during the hold", () => {
    const at = (i: number, k: number) => RANGES[i][0] + (RANGES[i][1] - RANGES[i][0]) * k;
    expect(filmAt(at(3, 0.85)).map).toBeGreaterThan(0.9);
    expect(filmAt(at(4, 0.85)).labels).toBeGreaterThan(0.9);
    expect(filmAt(0.98).logo).toBeGreaterThan(0.9);
    const first = filmAt(at(0, 0.5));
    expect(first.map + first.labels + first.logo).toBe(0);
    // The callouts wait for the studio orbit to finish.
    const orbitEnd = (STARTS[4] + CLIP_SECONDS) / TOTAL_SECONDS;
    expect(filmAt(orbitEnd - 0.01).labels).toBe(0);
  });

  it("fades through black only around the loop point", () => {
    expect(filmAt(0.999).fade).toBeGreaterThan(0.5);
    expect(filmAt(0.5).fade).toBe(0);
  });
});
