import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const srcRoot = path.resolve(__dirname, "../src");

function walk(dir: string, files: string[] = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|css)$/.test(name)) files.push(full);
  }
  return files;
}

describe("brand guard", () => {
  it("bans Gileara / teal residue in src", () => {
    const files = walk(srcRoot);
    const banned = [
      /gileara/i,
      /#00BFA5/i,
      /#001c38/i,
      /5EEAD4/i,
      /digital transformation/i,
      /MSME/i,
    ];
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const re of banned) {
        if (re.test(text)) offenders.push(`${path.relative(srcRoot, file)} :: ${re}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("includes Fortitier gold token somewhere in styles", () => {
    const css = readFileSync(path.resolve(srcRoot, "app/globals.css"), "utf8");
    const tw = readFileSync(path.resolve(__dirname, "../tailwind.config.js"), "utf8");
    expect(css + tw).toContain("#DFA040");
    expect(css + tw).toContain("#3B1902");
  });
});
