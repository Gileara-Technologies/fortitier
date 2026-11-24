"use client";

import { useEffect, useMemo, useRef } from "react";
import { allNodes, getNode, ghanaOutline, lakeVolta as VOLTA, networkLanes as LANES } from "@/content/geo";
import { cn } from "@/lib/cn";
import type { FilmBus } from "./FilmReel";
import { RIG_LABELS, filmAt } from "./story";

/**
 * Layers drawn over the footage where AI video cannot be trusted: an accurate map of Ghana,
 * callouts pinned to the truck, the real Fortitier mark, plus the cut flash, grain and vignette.
 * All read the player's smoothed progress (bus.p) each animation frame; no per-frame React state.
 */

export function useFrameLoop(fn: (now: number) => void) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      ref.current(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}

export const setStyle = (el: HTMLElement | SVGElement | null, prop: string, value: string) => {
  if (el && el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
};

/* ------------------------------------------------------------------- map */

const X = (lon: number) => (lon + 3.3) * 100;
const Y = (lat: number) => (11.3 - lat) * 100;
const poly = (pts: [number, number][]) => pts.map(([lon, lat], i) => `${i ? "L" : "M"}${X(lon).toFixed(1)},${Y(lat).toFixed(1)}`).join("") + "Z";

export function MapOverlay({ bus }: { bus: React.MutableRefObject<FilmBus> }) {
  const root = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const lanes = useRef<(SVGPathElement | null)[]>([]);
  const flows = useRef<SVGGElement>(null);
  const labels = useRef<SVGGElement>(null);
  const last = useRef(-1);

  const geo = useMemo(() => {
    const lanePaths = LANES.map(([a, b]) => {
      const A = getNode(a)!;
      const B = getNode(b)!;
      const ax = X(A.lon);
      const ay = Y(A.lat);
      const bx = X(B.lon);
      const by = Y(B.lat);
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      const len = Math.hypot(bx - ax, by - ay);
      const nx = -(by - ay) / len;
      const ny = (bx - ax) / len;
      const cx = mx + nx * len * 0.16;
      const cy = my + ny * len * 0.16;
      return { id: `${a}-${b}`, d: `M${ax},${ay} Q${cx},${cy} ${bx},${by}`, hero: a === "tema" && b === "kumasi", ax, ay, bx, by, cx, cy };
    });
    const hero = lanePaths[0];
    const u = 0.38;
    const truck = {
      x: (1 - u) ** 2 * hero.ax + 2 * (1 - u) * u * hero.cx + u * u * hero.bx,
      y: (1 - u) ** 2 * hero.ay + 2 * (1 - u) * u * hero.cy + u * u * hero.by,
    };
    return { outline: poly(ghanaOutline), volta: poly(VOLTA), lanePaths, truck };
  }, []);

  useFrameLoop(() => {
    const k = filmAt(bus.current.p).map;
    if (Math.abs(k - last.current) < 0.002) return;
    last.current = k;
    setStyle(root.current, "opacity", k.toFixed(3));
    setStyle(root.current, "visibility", k > 0.002 ? "visible" : "hidden");
    const sc = (0.94 + 0.06 * k).toFixed(4);
    setStyle(root.current, "transform", window.innerWidth < 768 ? `translate(-50%, -50%) scale(${sc})` : `translateY(-50%) scale(${sc})`);
    setStyle(scrim.current, "opacity", (k * 0.85).toFixed(3));
    const reveal = Math.min(1, Math.max(0, (k - 0.25) / 0.75));
    lanes.current.forEach((p) => setStyle(p, "stroke-dashoffset", (1 - reveal).toFixed(4)));
    setStyle(flows.current, "opacity", Math.max(0, (reveal - 0.6) / 0.4).toFixed(3));
    setStyle(labels.current, "opacity", Math.max(0, (k - 0.6) / 0.4).toFixed(3));
  });

  return (
    <>
      <div
        ref={scrim}
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_68%_50%,rgba(3,3,3,0.82)_0%,rgba(3,3,3,0.5)_45%,rgba(3,3,3,0)_75%)]"
        style={{ opacity: 0 }}
        aria-hidden
      />
      <div
        ref={root}
        className="pointer-events-none absolute right-[4vw] lg:right-[7vw] top-[46%] z-[6] aspect-[460/670] h-[min(70vh,680px)] max-md:left-1/2 max-md:right-auto max-md:top-[40%] max-md:h-[54vh]"
        style={{ opacity: 0, visibility: "hidden", transformOrigin: "60% 50%" }}
        aria-hidden
      >
        <svg viewBox="-20 -20 500 710" className="h-full w-full overflow-visible">
          <defs>
            <pattern id="cine-dots" width="6.5" height="6.5" patternUnits="userSpaceOnUse">
              <circle cx="3.25" cy="3.25" r="0.95" fill="#eadfca" />
            </pattern>
            <mask id="cine-land">
              <path d={geo.outline} fill="#fff" />
              <path d={geo.volta} fill="#000" />
            </mask>
            <filter id="cine-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="-20" y="-20" width="500" height="710" fill="url(#cine-dots)" mask="url(#cine-land)" opacity="0.42" />
          <path d={geo.volta} fill="none" stroke="#eadfca" strokeOpacity="0.18" strokeWidth="0.8" />
          <path d={geo.outline} fill="none" stroke="#dfa040" strokeWidth="1.3" strokeLinejoin="round" filter="url(#cine-glow)" />
          {geo.lanePaths.map((l, i) => (
            <path
              key={l.id}
              ref={(el) => {
                lanes.current[i] = el;
              }}
              d={l.d}
              pathLength={1}
              fill="none"
              stroke={l.hero ? "#ffd27a" : "#dfa040"}
              strokeOpacity={l.hero ? 1 : 0.55}
              strokeWidth={l.hero ? 2 : 1}
              strokeDasharray="1 1"
              style={{ strokeDashoffset: 1 }}
              filter={l.hero ? "url(#cine-glow)" : undefined}
            />
          ))}
          <g ref={flows} style={{ opacity: 0 }}>
            {geo.lanePaths.map((l, i) => (
              <circle key={l.id} r={l.hero ? 3.4 : 2.2} fill={l.hero ? "#fff1cf" : "#fbcf6a"} filter="url(#cine-glow)">
                <animateMotion dur={`${l.hero ? 3.2 : 4 + (i % 5) * 0.6}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" path={l.d} />
              </circle>
            ))}
          </g>
          {allNodes.map((n) => (
            <g key={n.id} transform={`translate(${X(n.lon)},${Y(n.lat)})`}>
              {n.kind === "depot" ? (
                <>
                  <circle r="4.2" fill="#fbcf6a" filter="url(#cine-glow)" />
                  <circle r="4.2" fill="none" stroke="#dfa040" strokeWidth="1" className="cine-ring" />
                </>
              ) : (
                <circle r="2.3" fill="#f4ecdf" opacity="0.85" />
              )}
            </g>
          ))}
          <g transform={`translate(${geo.truck.x},${geo.truck.y})`}>
            <circle r="5" fill="#fff1cf" filter="url(#cine-glow)" />
            <circle r="5" fill="none" stroke="#fff1cf" strokeWidth="1" className="cine-ring" />
          </g>
          <g ref={labels} style={{ opacity: 0 }} fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace">
            {allNodes.map((n) => (
              <text
                key={n.id}
                x={X(n.lon) + (n.kind === "depot" ? 9 : 6)}
                y={Y(n.lat) + 3}
                fontSize={n.kind === "depot" ? 10.5 : 8.5}
                letterSpacing={n.kind === "depot" ? 2 : 1.4}
                fill={n.kind === "depot" ? "#fbcf6a" : "rgba(244,236,223,0.62)"}
              >
                {n.name.toUpperCase()}
              </text>
            ))}
            <text x={geo.truck.x + 10} y={geo.truck.y - 10} fontSize="9" letterSpacing="1.6" fill="#fff1cf">
              FT-014 · TEMA → KUMASI
            </text>
          </g>
        </svg>
      </div>
    </>
  );
}

/* ---------------------------------------------------------- rig callouts */

/** Callouts pinned to points of the truck in the studio frame (frame space, follows the drift). */
export function RigLabels({ bus }: { bus: React.MutableRefObject<FilmBus> }) {
  const els = useRef<(HTMLDivElement | null)[]>([]);
  useFrameLoop(() => {
    const k = filmAt(bus.current.p).labels;
    const b = bus.current.box;
    RIG_LABELS.forEach((l, i) => {
      const el = els.current[i];
      if (!el) return;
      const v = Math.max(0, Math.min(1, k * 1.6 - i * 0.12));
      setStyle(el, "opacity", v.toFixed(3));
      if (v <= 0) return;
      setStyle(el, "transform", `translate3d(${(b.x + l.x * b.w).toFixed(1)}px, ${(b.y + l.y * b.h).toFixed(1)}px, 0)`);
    });
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-[7] overflow-hidden max-md:hidden" aria-hidden>
      {RIG_LABELS.map((l, i) => (
        <div
          key={l.id}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ opacity: 0 }}
        >
          <span className="absolute -left-[3px] -top-[3px] block h-[6px] w-[6px] rounded-full bg-[#fbcf6a] shadow-[0_0_12px_#dfa040]" />
          {l.rise ? (
            <span
              className="absolute left-0 block w-px bg-[#dfa040]/70"
              style={l.rise > 0 ? { top: -l.rise, height: l.rise } : { top: 0, height: -l.rise }}
            />
          ) : null}
          <div className="absolute left-0" style={{ top: -(l.rise ?? 0) }}>
            <span className={cn("absolute top-0 block h-px w-14 bg-[#dfa040]/70", l.side === "r" ? "left-0" : "right-0")} />
            <span
              className={cn(
                "absolute -top-[10px] whitespace-nowrap rounded-[2px] bg-black/55 px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.22em] text-[#f6e7cc] backdrop-blur-[2px]",
                l.side === "r" ? "left-[56px]" : "right-[56px]",
              )}
            >
              {l.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- logo finale */

/** Gold particles sampled from the real Fortitier mark assemble in the night sky. */
export function LogoBurst({ bus }: { bus: React.MutableRefObject<FilmBus> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const data = useRef<{ tx: Float32Array; ty: Float32Array; sx: Float32Array; sy: Float32Array; r: Float32Array; gold: Uint8Array; n: number } | null>(null);
  const sprites = useRef<{ gold: HTMLCanvasElement; cream: HTMLCanvasElement } | null>(null);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const cleared = useRef(true);

  useEffect(() => {
    const mk = (rgb: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = 16;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(8, 8, 0, 8, 8, 8);
      gr.addColorStop(0, `rgba(${rgb},1)`);
      gr.addColorStop(0.35, `rgba(${rgb},0.55)`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, 16, 16);
      return c;
    };
    sprites.current = { gold: mk("239,178,82"), cream: mk("255,240,214") };

    const resize = () => {
      const el = canvas.current;
      if (!el) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: window.innerWidth, h: window.innerHeight, dpr };
      el.width = Math.round(window.innerWidth * dpr);
      el.height = Math.round(window.innerHeight * dpr);
      cleared.current = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const img = new Image();
    img.src = "/brand/fortitier-logo.jpeg";
    img.onload = () => {
      const W = 240;
      const c = document.createElement("canvas");
      c.width = c.height = W;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0, W, W);
      const px = g.getImageData(0, 0, W, W).data;
      const tx: number[] = [];
      const ty: number[] = [];
      const gold: number[] = [];
      const mobile = window.innerWidth < 768;
      const keep = mobile ? 0.32 : 0.55;
      for (let y = 0; y < W * 0.67; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const r = px[i];
          const gg = px[i + 1];
          const b = px[i + 2];
          const lum = (r * 0.299 + gg * 0.587 + b * 0.114) / 255;
          const sat = Math.max(r, gg, b) - Math.min(r, gg, b);
          const isGold = sat > 55 && r > 110;
          const isInk = lum < 0.35;
          if (!isGold && !isInk) continue;
          if (Math.random() > keep) continue;
          tx.push(x / W - 0.5);
          ty.push(y / (W * 0.67) - 0.5);
          gold.push(isGold ? 1 : 0);
        }
      }
      const n = tx.length;
      const sx = new Float32Array(n);
      const sy = new Float32Array(n);
      const rr = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = 0.5 + Math.random() * 1.2;
        sx[i] = Math.cos(a) * d;
        sy[i] = Math.sin(a) * d * 0.7 + 0.4;
        rr[i] = Math.random();
      }
      data.current = { tx: Float32Array.from(tx), ty: Float32Array.from(ty), sx, sy, r: rr, gold: Uint8Array.from(gold), n };
    };
    return () => window.removeEventListener("resize", resize);
  }, []);

  useFrameLoop((now) => {
    const el = canvas.current;
    const d = data.current;
    const sp = sprites.current;
    if (!el || !d || !sp) return;
    const ctx = el.getContext("2d")!;
    const k = filmAt(bus.current.p).logo;
    const { w, h, dpr } = size.current;
    if (k <= 0.002) {
      if (!cleared.current) {
        ctx.clearRect(0, 0, el.width, el.height);
        cleared.current = true;
      }
      return;
    }
    cleared.current = false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    const mobile = w < 768;
    const S = mobile ? Math.min(w * 0.8, h * 0.42) : Math.min(w * 0.36, h * 0.5);
    const cx = mobile ? w * 0.5 : w * 0.62;
    const cy = mobile ? h * 0.28 : h * 0.36;
    const t = now / 1000;
    const fade = Math.min(1, k * 4);
    for (let i = 0; i < d.n; i++) {
      const r = d.r[i];
      let e = (k - r * 0.4) / 0.6;
      e = e < 0 ? 0 : e > 1 ? 1 : e;
      e = 1 - Math.pow(1 - e, 3);
      const sw = 1 - e;
      const x = cx + (d.sx[i] + (d.tx[i] - d.sx[i]) * e) * S + Math.sin(t * 0.6 + r * 40) * 6 * sw + Math.sin(t * 1.3 + r * 9) * 0.4;
      const y = cy + (d.sy[i] + (d.ty[i] - d.sy[i]) * e) * S * 0.67 + Math.cos(t * 0.5 + r * 25) * 6 * sw;
      const s = (1.6 + r * 2.2) * (1 + sw * 0.8);
      ctx.globalAlpha = (0.18 + 0.7 * e) * fade * (0.85 + 0.15 * Math.sin(t * 3 + r * 60));
      ctx.drawImage(d.gold[i] ? sp.gold : sp.cream, x - s, y - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  });

  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-[6] h-full w-full" aria-hidden />;
}

/* ------------------------------------------------------- cut flash + film */

/** Warm light flash over cuts, the fade through black at the loop, film grain and a vignette. */
export function FilmFX({ bus }: { bus: React.MutableRefObject<FilmBus> }) {
  const flash = useRef<HTMLDivElement>(null);
  const black = useRef<HTMLDivElement>(null);
  useFrameLoop(() => {
    const st = filmAt(bus.current.p);
    setStyle(flash.current, "opacity", (st.flash * st.flash).toFixed(3));
    setStyle(black.current, "opacity", st.fade.toFixed(3));
  });
  return (
    <>
      <div ref={black} className="pointer-events-none absolute inset-0 z-[8] bg-black" style={{ opacity: 0 }} aria-hidden />
      <div
        ref={flash}
        className="pointer-events-none absolute inset-0 z-[8] bg-[radial-gradient(ellipse_at_50%_50%,#fff3dc_0%,#f2b860_35%,rgba(120,60,10,0.6)_70%,rgba(0,0,0,0)_100%)] mix-blend-screen"
        style={{ opacity: 0 }}
        aria-hidden
      />
      <div className="cine-grain pointer-events-none absolute inset-0 z-[9]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[9] bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0)_55%,rgba(0,0,0,0.55)_100%)]"
        aria-hidden
      />
    </>
  );
}
