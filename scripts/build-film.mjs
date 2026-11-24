#!/usr/bin/env node
/**
 * Footage pipeline for the homepage film.
 *
 * Reads clips c1..c6 from film-src/ (.mp4, .mov or .webm, e.g. exported from Higgsfield) and writes
 * short autoplay videos plus a manifest to public/film/:
 *   l/cN.mp4   landscape 1920x1080, H.264, muted, fast-start (desktop and tablets)
 *   p/cN.mp4   portrait 720x1280, cropped around each clip's subject (phones)
 *   l/cN.jpg   first frame of each clip, used as the video poster
 *   p/cN.jpg
 *   manifest.json  clip durations and sizes
 *
 * The homepage plays the clips back to back. Each clip ends on the frame the next one starts on,
 * so the player can hold on a last frame and continue without a visible cut.
 *
 * Any clip that is missing is replaced by a labelled placeholder so the site always works.
 *
 * Usage:
 *   node scripts/build-film.mjs                # real clips, placeholders for missing ones
 *   node scripts/build-film.mjs --placeholder  # placeholders for everything
 *   options: --crf 20  --sharpen 0.5  --src film-src  --no-grade
 *
 * Every clip gets a light grade that mutes blue and cyan and warms the shadows, so the AI footage
 * stays on brand (gold and bronze, never teal). --no-grade turns it off.
 * Scaling uses Lanczos plus contrast-adaptive sharpening (--sharpen 0..1, 0 = off). Use about 0.2
 * once the clips have been AI-upscaled to 1080p or 4K.
 *
 * Optional film-src/focus.json, e.g. { "c3": 0.35 }: horizontal position (0..1) of the subject,
 * used to aim the portrait crop.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};

const ROOT = process.cwd();
const SRC = path.resolve(ROOT, opt("src", "film-src"));
const OUT = path.resolve(ROOT, "public", "film");
const CRF = Number(opt("crf", 20));
const SHARPEN = Math.min(1, Math.max(0, Number(opt("sharpen", 0.5))));
const CAS = SHARPEN > 0 ? `,cas=${SHARPEN}` : "";
const ALL_PLACEHOLDER = flag("placeholder");
const CLIPS = ["c1", "c2", "c3", "c4", "c5", "c6"];
const NAMES = {
  c1: "C1  K1 -> K2  IGNITION",
  c2: "C2  K2 -> K3  THE LOAD",
  c3: "C3  K3 -> K4  THE ROAD",
  c4: "C4  K4 -> K5  CRANE UP",
  c5: "C5  K6  STUDIO ORBIT",
  c6: "C6  K7  ARRIVAL",
};
const SIZES = { l: { w: 1920, h: 1080 }, p: { w: 720, h: 1280 } };
const GRADE = flag("no-grade")
  ? ""
  : "huesaturation=colors=c+b:saturation=-0.7:strength=1.2,colorbalance=rs=0.03:bs=-0.04:rm=0.02:bm=-0.02,";

function run(cmd, argv, cwd) {
  const r = spawnSync(cmd, argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, cwd });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(`${cmd} failed (${r.status}):\n${(r.stderr || "").split("\n").slice(-15).join("\n")}`);
  }
  return r.stdout;
}

function findClip(id) {
  for (const ext of [".mp4", ".mov", ".webm", ".mkv"]) {
    const f = path.join(SRC, id + ext);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

/** A dark, obviously-placeholder clip: drifting warm gradient, a light sweep and the shot name. */
function makePlaceholder(id, i, file) {
  // Run ffmpeg from the font's folder so the path needs no drive-colon escaping.
  const fontDir = process.platform === "win32" ? "C:/Windows/Fonts" : "/usr/share/fonts/truetype/dejavu";
  const fontFile = process.platform === "win32" ? "consola.ttf" : "DejaVuSansMono.ttf";
  const font = fs.existsSync(path.join(fontDir, fontFile)) ? fontFile : null;
  const warm = ["0x2c1507", "0x26140a", "0x1e1208", "0x14100c", "0x1a1a1c", "0x120c08"][i];
  const vf = [
    `drawbox=x='mod(t*380+${i * 260}\\,2400)-240':y=0:w=110:h=ih:color=0xdfa040@0.09:t=fill`,
    "vignette=PI/4",
    font && `drawtext=fontfile=${font}:text='${NAMES[id]}':fontcolor=0xf4ecdf@0.8:fontsize=52:x=(w-tw)/2:y=(h-th)/2-20`,
    font && `drawtext=fontfile=${font}:text='PLACEHOLDER  -  drop film-src/${id}.mp4 and rebuild':fontcolor=0xdfa040@0.75:fontsize=24:x=(w-tw)/2:y=(h/2)+50`,
  ]
    .filter(Boolean)
    .join(",");
  run("ffmpeg", [
    "-v", "error", "-y",
    "-f", "lavfi",
    "-i", `gradients=s=1920x1080:r=24:d=5:c0=${warm}:c1=0x030303:nb_colors=2:speed=0.01:seed=${i + 7}`,
    "-vf", vf,
    "-t", "5",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
    path.resolve(file),
  ], font ? fontDir : undefined);
}

const X264 = (crf, maxrate) => [
  "-an",
  "-c:v", "libx264", "-preset", "slow", "-tune", "film", "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-crf", String(crf), "-maxrate", maxrate, "-bufsize", "16M",
  "-r", "24", "-g", "48",
  "-movflags", "+faststart",
];

function encode(file, id, focus) {
  const l = path.join(OUT, "l", `${id}.mp4`);
  const p = path.join(OUT, "p", `${id}.mp4`);
  run("ffmpeg", [
    "-v", "error", "-y", "-i", file,
    "-vf", `${GRADE}scale=${SIZES.l.w}:${SIZES.l.h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${SIZES.l.w}:${SIZES.l.h}${CAS}`,
    ...X264(CRF, "9M"), l,
  ]);
  run("ffmpeg", [
    "-v", "error", "-y", "-i", file,
    "-vf", `${GRADE}crop=ih*9/16:ih:(iw-ih*9/16)*${focus}:0,scale=${SIZES.p.w}:${SIZES.p.h}:flags=lanczos${CAS}`,
    ...X264(CRF + 1, "5M"), p,
  ]);
  for (const [dir, video] of [["l", l], ["p", p]]) {
    run("ffmpeg", ["-v", "error", "-y", "-i", video, "-frames:v", "1", "-q:v", "3", path.join(OUT, dir, `${id}.jpg`)]);
  }
  const probe = run("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-count_packets",
    "-show_entries", "stream=nb_read_packets:format=duration", "-of", "json", l,
  ]);
  const j = JSON.parse(probe);
  return { frames: Number(j.streams[0].nb_read_packets), duration: Number(j.format.duration) };
}

function main() {
  try {
    run("ffmpeg", ["-version"]);
  } catch {
    console.error("ffmpeg was not found on PATH. Install it, then run this again.");
    process.exit(1);
  }
  fs.mkdirSync(SRC, { recursive: true });
  const focus = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(SRC, "focus.json"), "utf8"));
    } catch {
      return {};
    }
  })();

  // Clear old outputs, including the previous frame-sequence format.
  for (const d of ["l", "p", "d", "m", "_tmp"]) rmrf(path.join(OUT, d));
  for (const f of fs.existsSync(OUT) ? fs.readdirSync(OUT) : []) if (/^poster-/.test(f)) fs.rmSync(path.join(OUT, f));
  fs.mkdirSync(path.join(OUT, "l"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "p"), { recursive: true });

  const phDir = path.join(SRC, "_placeholder");
  const clips = [];
  const placeholders = [];
  CLIPS.forEach((id, i) => {
    let file = ALL_PLACEHOLDER ? null : findClip(id);
    if (!file) {
      fs.mkdirSync(phDir, { recursive: true });
      file = path.join(phDir, `${id}.mp4`);
      makePlaceholder(id, i, file);
      placeholders.push(id);
    }
    const fx = Math.min(1, Math.max(0, Number(focus[id] ?? 0.5)));
    process.stdout.write(`${id}  ${path.relative(ROOT, file)}  `);
    const r = encode(file, id, fx);
    clips.push({ id, duration: Number(r.duration.toFixed(3)), frames: r.frames });
    console.log(`${r.duration.toFixed(2)} s`);
  });

  const bytes = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith(".mp4")).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
  const manifest = {
    version: 2,
    fps: 24,
    sizes: SIZES,
    clips,
    placeholder: placeholders,
    generated: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
  console.log(`\nlandscape ${mb(bytes(path.join(OUT, "l")))} · portrait ${mb(bytes(path.join(OUT, "p")))}`);
  if (placeholders.length) console.log(`Placeholders used for: ${placeholders.join(", ")}`);
}

main();
