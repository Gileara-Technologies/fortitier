"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandLockup from "@/components/BrandLockup";
import { primaryNav } from "@/content/nav";
import { siteConfig } from "@/content/site-config";
import { cn } from "@/lib/cn";
import {
  AUTOPLAY_MS,
  DESIGN_H,
  DESIGN_W,
  EXIT_FACTORS,
  FLEET_SLIDES,
  INTERACTION_PAUSE_MS,
  LAYER_FACTORS,
  WIPE_DURATION_MS,
  coverAt,
  incomingProgress,
  type LayerKey,
} from "./fleet-slides";

/* ---------------------------------------------------------------- header */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[85] flex flex-col justify-between bg-[#070402]/95 px-6 pb-8 pt-24 backdrop-blur-xl transition-opacity duration-300 sm:px-10",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <nav aria-label="Primary">
        <ol className="space-y-2">
          {primaryNav.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={onClose}
                className="group flex items-baseline gap-5 py-1.5 font-wide text-[clamp(1.85rem,7vw,4rem)] uppercase leading-[1.05] tracking-tight text-[#f4ecdf] transition-colors hover:text-[#fbcf6a]"
              >
                <span className="font-mono text-[11px] tracking-[0.22em] text-[#dfa040]/70">0{i + 1}</span>
                {l.name}
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link
            href={siteConfig.ctaHref}
            tabIndex={open ? 0 : -1}
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-3 bg-[#dfa040] px-6 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-[#160b03] transition-colors hover:bg-[#fbcf6a] sm:w-auto"
          >
            {siteConfig.ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </nav>

      <div className="grid gap-3 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 sm:grid-cols-3">
        <a href={`tel:${siteConfig.phoneTel}`} tabIndex={open ? 0 : -1} className="hover:text-[#fbcf6a]">
          {siteConfig.phone}
        </a>
        <a href={`mailto:${siteConfig.email}`} tabIndex={open ? 0 : -1} className="hover:text-[#fbcf6a]">
          {siteConfig.email}
        </a>
        <span>{siteConfig.office}</span>
      </div>
    </div>
  );
}

function SiteHeader({ menu, onToggleMenu, revealed }: { menu: boolean; onToggleMenu: () => void; revealed: boolean }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = primaryNav.filter((l) => l.href !== "/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[86] border-b transition-[background-color,border-color,opacity,translate] duration-500",
        solid || menu
          ? "border-white/15 bg-[#080402]/95 shadow-[0_6px_28px_rgba(0,0,0,0.45)] backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-black/60 via-black/25 to-transparent",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.3, 1)" }}
    >
      <div className="mx-auto flex h-14 max-w-[96rem] items-center justify-between gap-4 px-4 sm:h-16 sm:px-8 lg:h-[4.5rem]">
        <Link
          href="/"
          aria-label="Fortitier Logistics, home"
          className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <BrandLockup tone="dark" priority className="max-sm:hidden" />
          <BrandLockup tone="dark" size="sm" priority className="sm:hidden" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75 transition-colors hover:text-[#fbcf6a]"
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="hidden font-mono text-[11px] tracking-[0.16em] text-white/75 transition-colors hover:text-[#fbcf6a] xl:inline"
          >
            {siteConfig.phone}
          </a>
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="inline-flex h-9 items-center rounded-sm border border-white/25 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90 transition-colors hover:border-[#dfa040] hover:text-[#fbcf6a] lg:hidden"
          >
            Call
          </a>
          <Link
            href={siteConfig.ctaHref}
            className="hidden bg-[#dfa040] px-4 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.24em] text-[#160b03] transition-colors hover:bg-[#fbcf6a] sm:inline-flex"
          >
            {siteConfig.ctaLabel}
          </Link>
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
            className="inline-flex h-9 items-center gap-2.5 rounded-sm border border-white/20 px-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4ecdf] transition-colors hover:border-[#dfa040] lg:hidden"
          >
            <span className="relative block h-2.5 w-4" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300",
                  menu ? "translate-y-[4.5px] rotate-45" : "",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300",
                  menu ? "-translate-y-[4.5px] -rotate-45" : "",
                )}
              />
            </span>
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------- word sizing */

interface WordMetric {
  fontSize: number;
  letterSpacing: string;
  top: number;
}

const DEFAULT_WORD_METRICS: Record<string, WordMetric> = {
  PETROL: { fontSize: 330, letterSpacing: "0.01em", top: 158 },
  DIESEL: { fontSize: 330, letterSpacing: "0.01em", top: 158 },
  GASOIL: { fontSize: 330, letterSpacing: "0.01em", top: 158 },
  CONTRACTS: { fontSize: 222, letterSpacing: "-0.03em", top: 204 },
};

/**
 * Computes exact optical cap-line word metrics using Canvas 2D measureText
 * so every slide's monumental display word shares the same cap center and never overflows.
 */
function measureSlideWords(vw: number, u: number, isMobile: boolean): Record<string, WordMetric> {
  if (typeof document === "undefined") return DEFAULT_WORD_METRICS;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return DEFAULT_WORD_METRICS;

  // Read the computed Archivo font family loaded by next/font on <html>
  const computedWide = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim();
  const fontFamily = computedWide ? `${computedWide}, "IBM Plex Sans", system-ui, sans-serif` : `"IBM Plex Sans", system-ui, sans-serif`;

  const visibleDesignW = isMobile ? Math.min(DESIGN_W, vw / Math.max(u, 0.01)) * 0.88 : 1300;
  const maxTightW = isMobile ? visibleDesignW : 1340;
  const defaultF = isMobile ? 320 : 375;
  const capCenterY = isMobile ? 252 : 332;
  const capRatio = 0.72;
  const baselineOffset = 0.84;

  const out: Record<string, WordMetric> = {};
  ctx.font = `800 100px ${fontFamily}`;

  for (const slide of FLEET_SLIDES) {
    const m = ctx.measureText(slide.word);
    // Archivo wide stretches ~1.18x relative to default canvas measure
    const rawInkAt100 = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight || m.width) * 1.16;
    const widthAtDefault = (rawInkAt100 / 100) * defaultF;

    let F = defaultF;
    let letterSpacing = "0.01em";

    if (widthAtDefault > visibleDesignW) {
      letterSpacing = "-0.03em";
      // Tighter tracking pulls total width in slightly (~0.96)
      const fitted = (maxTightW / Math.max(rawInkAt100 * 0.96, 1)) * 100;
      F = Math.min(defaultF, Math.max(110, fitted));
    }

    const baseline = capCenterY + (capRatio * F) / 2;
    const top = baseline - baselineOffset * F;
    out[slide.word] = { fontSize: F, letterSpacing, top };
  }

  return out;
}

/* --------------------------------------------------------------- arrows */

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-7 sm:w-7"
      aria-hidden
    >
      {dir === "prev" ? <path d="M24 14H4 M12 6l-8 8 8 8" /> : <path d="M4 14h20 M16 6l8 8-8 8" />}
    </svg>
  );
}

/* ----------------------------------------------------------------- main */

/**
 * Flagship full-viewport interactive hero inspired by the Blendy measured panel-wipe architecture,
 * engineered specifically for Fortitier Logistics: 4 fuel & haulage showcases, 5 depth parallax
 * layers, transparent studio tanker cutouts over dynamically fitted monumental typography,
 * gliding gold tab indicator, swipe/keyboard/autoplay controls, and mobile-first ergonomics.
 */
export default function FleetHero({ embedded = false }: { embedded?: boolean }) {
  const stageRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<Record<LayerKey, (HTMLDivElement | null)[]>>({
    word: [],
    shadow: [],
    tanker: [],
    details: [],
    corner: [],
  });
  const seamRef = useRef<HTMLDivElement>(null);
  const tabRowRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [wordMetrics, setWordMetrics] = useState<Record<string, WordMetric>>(DEFAULT_WORD_METRICS);

  // Mutable animation & interaction state kept in refs for silky 60fps zero-rerender wipes
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastInteractionRef = useRef(0);
  const inViewRef = useRef(true);
  const scaleRef = useRef({ u: 1, frameW: DESIGN_W, isMobile: false });
  const dragRef = useRef<{ active: boolean; x: number; y: number; id: number }>({
    active: false,
    x: 0,
    y: 0,
    id: -1,
  });

  // Track prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Compute responsive --u scale, mobile flag, and canvas-measured word metrics
  const updateLayout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const vw = stage.clientWidth || window.innerWidth;
    const vh = stage.clientHeight || window.innerHeight;
    const mobile = vw <= 820 || vh > vw;

    let u: number;
    let fy: number;
    if (mobile) {
      // Portrait / narrow mobile: center the tanker + monumental word cleanly between the 2-row header and bottom controls
      u = Math.min(vw / 960, (vh - 210) / 560);
      fy = -68;
    } else {
      u = Math.min(vw / DESIGN_W, vh / DESIGN_H);
      fy = 0;
    }

    stage.style.setProperty("--u", `${u}px`);
    stage.style.setProperty("--fy", `${fy}px`);
    scaleRef.current = { u, frameW: DESIGN_W * u, isMobile: mobile };

    setIsMobile(mobile);
    setWordMetrics(measureSlideWords(vw, u, mobile));
  }, []);

  // Glide the active tab underline to match the active tab's exact offsetLeft & offsetWidth
  const positionUnderline = useCallback((idx: number, instant = false) => {
    const bar = underlineRef.current;
    const btn = tabButtonRefs.current[idx];
    if (!bar || !btn) return;
    if (instant) {
      bar.style.transition = "none";
    } else {
      bar.style.transition =
        "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1), width 0.6s cubic-bezier(0.65, 0, 0.35, 1)";
    }
    bar.style.width = `${btn.offsetWidth}px`;
    bar.style.transform = `translateX(${btn.offsetLeft}px)`;
    if (instant) {
      // Force reflow so subsequent transitions animate smoothly
      void bar.offsetWidth;
    }
  }, []);

  // Initial layout, font readiness, opening parallax reveal, and 3s failsafe
  useEffect(() => {
    updateLayout();
    positionUnderline(activeRef.current, true);

    const onResize = () => {
      updateLayout();
      positionUnderline(activeRef.current, true);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let cancelled = false;
    const runReveal = () => {
      if (cancelled) return;
      updateLayout();
      positionUnderline(activeRef.current, true);

      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const introScale = mq.matches ? 0.35 : 1;
      const frameW = scaleRef.current.frameW;
      (Object.keys(LAYER_FACTORS) as LayerKey[]).forEach((key) => {
        const el = layerRefs.current[key][0];
        if (!el) return;
        el.style.transition = "none";
        el.style.transform = `translate3d(${(LAYER_FACTORS[key] * frameW * introScale).toFixed(2)}px, 0, 0)`;
        void el.offsetWidth;
        el.style.transition = "transform 900ms cubic-bezier(0.22, 0.8, 0.3, 1)";
        el.style.transform = "translate3d(0, 0, 0)";
      });
      window.setTimeout(() => {
        (Object.keys(LAYER_FACTORS) as LayerKey[]).forEach((key) => {
          const el = layerRefs.current[key][0];
          if (el) {
            el.style.transition = "";
            el.style.transform = "";
          }
        });
      }, 980);
      setRevealed(true);
    };

    const failsafe = window.setTimeout(runReveal, 2400);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        window.clearTimeout(failsafe);
        runReveal();
      });
    } else {
      window.clearTimeout(failsafe);
      runReveal();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      window.removeEventListener("resize", onResize);
    };
  }, [updateLayout, positionUnderline]);

  // Reposition underline whenever mobile layout toggles
  useEffect(() => {
    positionUnderline(activeRef.current, true);
  }, [isMobile, positionUnderline]);

  // Initialize slide DOM visibility once on mount (managed imperatively thereafter so React re-renders never conflict with active transitions)
  useEffect(() => {
    slideRefs.current.forEach((s, i) => {
      if (!s) return;
      s.style.visibility = i === activeRef.current ? "visible" : "hidden";
      s.style.zIndex = i === activeRef.current ? "2" : "0";
      s.style.clipPath = "";
    });
  }, []);

  // Core 60fps panel-wipe + 5-layer depth parallax transition engine
  const goTo = useCallback(
    (targetIdx: number, explicitDir?: 1 | -1, fromUser = true) => {
      const count = FLEET_SLIDES.length;
      const nextIdx = ((targetIdx % count) + count) % count;
      const prevIdx = activeRef.current;
      if (nextIdx === prevIdx) return;

      // If an animation is already in flight and the user clicks again, cleanly cancel and start the new transition immediately
      if (animatingRef.current) {
        if (!fromUser) return;
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        // Reset all layers cleanly before starting the new transition from the current target
        slideRefs.current.forEach((s, i) => {
          if (!s) return;
          s.style.clipPath = "";
          s.style.zIndex = i === prevIdx ? "2" : "0";
          s.style.visibility = i === prevIdx ? "visible" : "hidden";
        });
        (Object.keys(LAYER_FACTORS) as LayerKey[]).forEach((key) => {
          layerRefs.current[key].forEach((el) => {
            if (!el) return;
            el.style.transition = "";
            el.style.transform = "";
            el.style.opacity = "";
          });
        });
        if (seamRef.current) seamRef.current.style.opacity = "0";
        animatingRef.current = false;
      }

      if (fromUser) {
        lastInteractionRef.current = performance.now();
      }

      const dir: 1 | -1 = explicitDir ?? (nextIdx > prevIdx ? 1 : -1);
      const slideA = slideRefs.current[prevIdx];
      const slideB = slideRefs.current[nextIdx];
      if (!slideA || !slideB) return;

      // Immediately glide underline & update active UI state
      activeRef.current = nextIdx;
      setActive(nextIdx);
      positionUnderline(nextIdx, false);

      // Under OS reduced-motion preference, keep the silky panel wipe & underline glide
      // while gently toning down parallax travel distance (vestibular-safe, never a jarring hard cut)
      const motionScale = reducedMotion ? 0.45 : 1;

      animatingRef.current = true;
      const stageW = stageRef.current?.clientWidth || window.innerWidth;
      const frameW = scaleRef.current.frameW || DESIGN_W;
      const seam = seamRef.current;

      // Prepare stacking: A stays on top (z=2) and gets wiped away, revealing B underneath (z=1)
      slideRefs.current.forEach((s, i) => {
        if (!s) return;
        if (i === prevIdx) {
          s.style.visibility = "visible";
          s.style.zIndex = "2";
          s.style.clipPath = "inset(0 0 0 0)";
        } else if (i === nextIdx) {
          s.style.visibility = "visible";
          s.style.zIndex = "1";
          s.style.clipPath = "";
        } else {
          s.style.visibility = "hidden";
          s.style.zIndex = "0";
          s.style.clipPath = "";
        }
      });

      // Position B's 5 layers toward incoming side before frame 1
      (Object.keys(LAYER_FACTORS) as LayerKey[]).forEach((key) => {
        const bLayer = layerRefs.current[key][nextIdx];
        if (bLayer) {
          bLayer.style.transition = "none";
          const startX = dir * LAYER_FACTORS[key] * frameW * motionScale;
          bLayer.style.transform =
            key === "tanker"
              ? `translate3d(${startX.toFixed(2)}px, 0, 0) scale(${(1 - 0.035 * motionScale).toFixed(4)})`
              : `translate3d(${startX.toFixed(2)}px, 0, 0)`;
          if (key === "details") bLayer.style.opacity = "0";
        }
      });

      let startTime: number | null = null;

      const step = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = Math.max(0, now - startTime);
        const t = Math.min(1, elapsed / WIPE_DURATION_MS);
        const c = coverAt(t);
        const k = incomingProgress(t);

        // 1) Smoothly clip outgoing slide A from right->left (forward) or left->right (backward)
        const pct = (c * 100).toFixed(3);
        slideA.style.clipPath = dir === 1 ? `inset(0 ${pct}% 0 0)` : `inset(0 0 0 ${pct}%)`;

        // GPU-composited feathered molten-gold light edge riding along the moving wipe boundary
        if (seam) {
          const edgeAlpha = c > 0.005 && c < 0.995 ? Math.sin(c * Math.PI) : 0;
          const xPx = dir === 1 ? (1 - c) * stageW : c * stageW;
          seam.style.opacity = (edgeAlpha * 0.9).toFixed(3);
          seam.style.transform = `translate3d(${xPx.toFixed(2)}px, 0, 0)`;
        }

        // 2) Drift outgoing slide A's 5 layers gently in the exit direction with depth separation
        (Object.keys(EXIT_FACTORS) as LayerKey[]).forEach((key) => {
          const aLayer = layerRefs.current[key][prevIdx];
          if (!aLayer) return;
          const driftA = -dir * c * EXIT_FACTORS[key] * frameW * motionScale;
          aLayer.style.transform =
            key === "tanker"
              ? `translate3d(${driftA.toFixed(2)}px, 0, 0) scale(${(1 - c * 0.025 * motionScale).toFixed(4)})`
              : `translate3d(${driftA.toFixed(2)}px, 0, 0)`;
          if (key === "details") {
            aLayer.style.opacity = Math.max(0, 1 - c * 1.6).toFixed(3);
          }
        });

        // 3) Arrive incoming slide B's 5 layers with silky staggered parallax & subtle scale settle
        (Object.keys(LAYER_FACTORS) as LayerKey[]).forEach((key) => {
          const bLayer = layerRefs.current[key][nextIdx];
          if (!bLayer) return;
          const offsetB = dir * (1 - k) * LAYER_FACTORS[key] * frameW * motionScale;
          if (key === "tanker") {
            const sc = 1 - 0.035 * motionScale * (1 - k);
            bLayer.style.transform = `translate3d(${offsetB.toFixed(2)}px, 0, 0) scale(${sc.toFixed(4)})`;
          } else {
            bLayer.style.transform = `translate3d(${offsetB.toFixed(2)}px, 0, 0)`;
          }
          if (key === "details") {
            bLayer.style.opacity = Math.min(1, k * 1.35).toFixed(3);
          }
        });

        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // Finalize cleanly: B on top at z=2, hide others, clear all inline animation props
          slideRefs.current.forEach((s, i) => {
            if (!s) return;
            s.style.clipPath = "";
            s.style.zIndex = i === nextIdx ? "2" : "0";
            s.style.visibility = i === nextIdx ? "visible" : "hidden";
          });
          (Object.keys(LAYER_FACTORS) as LayerKey[]).forEach((key) => {
            const aLayer = layerRefs.current[key][prevIdx];
            const bLayer = layerRefs.current[key][nextIdx];
            if (aLayer) {
              aLayer.style.transition = "";
              aLayer.style.transform = "";
              aLayer.style.opacity = "";
            }
            if (bLayer) {
              bLayer.style.transition = "";
              bLayer.style.transform = "";
              bLayer.style.opacity = "";
            }
          });
          if (seam) seam.style.opacity = "0";
          animatingRef.current = false;
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [positionUnderline, reducedMotion],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Track hero visibility so autoplay & keyboard arrows only fire while hero is in view
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.intersectionRatio > 0.25;
      },
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay cadence (pauses when off-screen, tab hidden, menu open, or after user interaction)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (
        document.visibilityState !== "visible" ||
        !inViewRef.current ||
        menuOpen ||
        animatingRef.current
      ) {
        return;
      }
      if (performance.now() - lastInteractionRef.current < INTERACTION_PAUSE_MS) {
        return;
      }
      goTo(activeRef.current + 1, 1, false);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [goTo, menuOpen]);

  // Keyboard ArrowLeft / ArrowRight navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current || menuOpen) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(activeRef.current + 1, 1, true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(activeRef.current - 1, -1, true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, menuOpen]);

  // Pointer swipe & drag (threshold > 45px, horizontal dominant)
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    dragRef.current = { active: true, x: e.clientX, y: e.clientY, id: e.pointerId };
  };

  useEffect(() => {
    const onPointerUp = (e: PointerEvent) => {
      if (!dragRef.current.active || dragRef.current.id !== e.pointerId) return;
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      dragRef.current.active = false;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) goTo(activeRef.current + 1, 1, true);
        else goTo(activeRef.current - 1, -1, true);
      }
    };
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, [goTo]);

  const currentSlide = FLEET_SLIDES[active];
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {embedded ? null : (
        <>
          <SiteHeader menu={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} revealed={revealed} />
          <MobileMenu open={menuOpen} onClose={closeMenu} />
        </>
      )}

      <section
        ref={stageRef}
        id={embedded ? "products" : "hero"}
        data-nav-tone="dark"
        aria-roledescription="carousel"
        aria-label="Fortitier Logistics bulk fuel products showcase"
        onPointerDown={onPointerDown}
        className="fortitier-hero relative h-[100svh] min-h-[600px] w-full select-none overflow-hidden bg-[#140903] text-white"
        style={{ touchAction: "pan-y" }}
      >
        {embedded ? (
          <h2 className="sr-only">
            Fuel Products &amp; Haulage Grades: Petrol, Diesel, Gasoil, and Dedicated OMC Contracts.
          </h2>
        ) : (
          <h1 className="sr-only">
            Fortitier Logistics — Ghanaian bulk fuel haulage: petrol, diesel, gasoil, and dedicated OMC contracts. Safe, accountable, on time.
          </h1>
        )}

        {/* ---------------- Stacked Slides (each clips & wipes independently) ---------------- */}
        {FLEET_SLIDES.map((slide, idx) => {
          const metric = wordMetrics[slide.word] ?? DEFAULT_WORD_METRICS[slide.word];
          return (
            <div
              key={slide.id}
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              aria-hidden={idx !== active}
              className={cn(
                "absolute inset-0 overflow-hidden will-change-[clip-path]",
                idx === 0 ? "visible z-[2]" : "invisible z-0",
              )}
              style={{
                backgroundColor: slide.backdrop,
                contain: "layout paint",
              }}
            >
              {/* Atmospheric radial studio wash */}
              <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: slide.glow }} aria-hidden />

              {/* Subtle vertical architectural grid lines */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(251,207,106,0.5) 1px, transparent 1px), linear-gradient(180deg, rgba(251,207,106,0.25) 1px, transparent 1px)",
                  backgroundSize: "120px 120px",
                }}
                aria-hidden
              />

              {/* Centered 1440x900 design frame scaled by --u */}
              <div
                className="absolute"
                style={{
                  width: "calc(1440 * var(--u))",
                  height: "calc(900 * var(--u))",
                  left: "calc(50% - 720 * var(--u))",
                  top: "calc(50% - 450 * var(--u) + var(--fy, 0px))",
                }}
              >
                {/* LAYER 1: Monumental display word (behind tanker, parallax 0.40) */}
                <div
                  ref={(el) => {
                    layerRefs.current.word[idx] = el;
                  }}
                  className="pointer-events-none absolute inset-0 will-change-transform"
                >
                  <span
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-wide font-extrabold uppercase leading-none"
                    style={{
                      top: `calc(${metric.top.toFixed(2)} * var(--u))`,
                      fontSize: `calc(${metric.fontSize.toFixed(2)} * var(--u))`,
                      letterSpacing: metric.letterSpacing,
                      backgroundImage:
                        "linear-gradient(180deg, rgba(255,250,242,0.96) 0%, rgba(248,232,200,0.68) 58%, rgba(223,160,64,0.16) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {slide.word}
                  </span>
                </div>

                {/* LAYER 2: Studio floor horizon & grounded tire shadows (parallax 0.30) */}
                <div
                  ref={(el) => {
                    layerRefs.current.shadow[idx] = el;
                  }}
                  className="pointer-events-none absolute inset-0 will-change-transform"
                >
                  {/* Luminous gold horizon strip */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: "calc(546 * var(--u))",
                      width: "calc(1320 * var(--u))",
                      height: "max(1px, calc(1.6 * var(--u)))",
                      background: `linear-gradient(90deg, transparent 0%, ${slide.accent}66 22%, ${slide.accent}cc 50%, ${slide.accent}66 78%, transparent 100%)`,
                      boxShadow: `0 0 calc(26 * var(--u)) ${slide.accent}55`,
                    }}
                  />
                  {/* Soft ambient floor wash (pre-feathered radial gradient, zero GPU blur filter) */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      top: "calc(618 * var(--u))",
                      width: "calc(1020 * var(--u))",
                      height: "calc(96 * var(--u))",
                      background:
                        "radial-gradient(closest-side, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.42) 48%, rgba(0, 0, 0, 0.12) 76%, transparent 100%)",
                    }}
                  />
                  {/* Crisp contact shadow right beneath tires */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      top: "calc(646 * var(--u))",
                      width: "calc(840 * var(--u))",
                      height: "calc(34 * var(--u))",
                      background:
                        "radial-gradient(closest-side, rgba(0, 0, 0, 0.94) 0%, rgba(12, 5, 1, 0.52) 55%, transparent 100%)",
                    }}
                  />
                  {/* Subtle amber-gold studio floor reflection */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      top: "calc(662 * var(--u))",
                      width: "calc(780 * var(--u))",
                      height: "calc(62 * var(--u))",
                      background: `radial-gradient(closest-side, ${slide.accent}24 0%, ${slide.accent}0b 52%, transparent 100%)`,
                    }}
                  />
                </div>

                {/* LAYER 3: Transparent studio tanker cutout — never bobs (parallax 0.15) */}
                <div
                  ref={(el) => {
                    layerRefs.current.tanker[idx] = el;
                  }}
                  className="pointer-events-none absolute inset-0 will-change-transform"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.tanker.src}
                    alt={slide.tanker.alt}
                    width={slide.tanker.naturalWidth}
                    height={slide.tanker.naturalHeight}
                    decoding="async"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    draggable={false}
                    className="absolute max-w-none select-none object-contain"
                    style={{
                      left: `calc(${slide.tanker.x} * var(--u))`,
                      top: `calc(${slide.tanker.y} * var(--u))`,
                      width: `calc(${slide.tanker.w} * var(--u))`,
                      height: `calc(${slide.tanker.h} * var(--u))`,
                    }}
                  />
                </div>

                {/* LAYER 4: Reserved parallax depth container (all floating cards removed per clean studio composition) */}
                <div
                  ref={(el) => {
                    layerRefs.current.details[idx] = el;
                  }}
                  className="pointer-events-none absolute inset-0"
                  aria-hidden
                />

                {/* LAYER 5: Pre-feathered foreground optical depth orbs (GPU-friendly, parallax 0.64) */}
                <div
                  ref={(el) => {
                    layerRefs.current.corner[idx] = el;
                  }}
                  className="pointer-events-none absolute inset-0 will-change-transform"
                >
                  {/* Bottom-left foreground bokeh orb */}
                  <div
                    className="hero-bob absolute rounded-full"
                    style={
                      {
                        left: "calc(-130 * var(--u))",
                        top: "calc(540 * var(--u))",
                        width: "calc(440 * var(--u))",
                        height: "calc(440 * var(--u))",
                        backgroundImage: slide.flareBottomLeft,
                        "--bob-base": "0deg",
                        "--bob-dur": "4.8s",
                        "--bob-delay": "-1.2s",
                      } as React.CSSProperties
                    }
                  />
                  {/* Top-right foreground bokeh orb */}
                  <div
                    className="hero-bob absolute rounded-full"
                    style={
                      {
                        left: "calc(1160 * var(--u))",
                        top: "calc(-90 * var(--u))",
                        width: "calc(400 * var(--u))",
                        height: "calc(400 * var(--u))",
                        backgroundImage: slide.flareTopRight,
                        "--bob-base": "0deg",
                        "--bob-dur": "4.2s",
                        "--bob-delay": "-2.6s",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* GPU-composited feathered molten-gold wipe seam riding along the clip-path boundary */}
        <div
          ref={seamRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-[100px] opacity-0 will-change-[transform,opacity]"
          style={{
            marginLeft: "-50px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(223,160,64,0.16) 44%, rgba(251,207,106,0.92) 50%, rgba(223,160,64,0.16) 56%, transparent 100%)",
          }}
        />

        {/* Edge legibility vignettes (never muddy the central studio glow) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[34%] bg-gradient-to-t from-black/75 via-black/30 to-transparent"
        />

        {/* ---------------- Fixed Hero Controls Layer (z-10) ---------------- */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
          {/* Top-center Grade Switcher with gliding gold underline (Row 2 on mobile) */}
          <div
            className={cn(
              "flex justify-center pt-[4.25rem] transition-[opacity,translate] duration-700 sm:pt-[4.9rem] lg:pt-[5.15rem]",
              revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5",
            )}
            style={{ transitionDelay: "260ms", transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.3, 1)" }}
          >
            <div
              ref={tabRowRef}
              role="tablist"
              aria-label="Select fuel haulage showcase"
              className="pointer-events-auto relative inline-flex items-center gap-5 border-b border-white/15 pb-1.5 sm:gap-10 md:gap-14"
            >
              {FLEET_SLIDES.map((slide, idx) => {
                const isCurrent = idx === active;
                return (
                  <button
                    key={slide.id}
                    ref={(el) => {
                      tabButtonRefs.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-current={isCurrent ? "true" : undefined}
                    onClick={() => goTo(idx, undefined, true)}
                    className={cn(
                      "px-0.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] transition-colors sm:text-[12.5px] sm:tracking-[0.26em]",
                      isCurrent ? "text-[#fbcf6a]" : "text-white/65 hover:text-white",
                    )}
                    style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.45)" }}
                  >
                    {slide.tabLabel}
                  </button>
                );
              })}
              {/* Gliding gold indicator underline */}
              <span
                ref={underlineRef}
                aria-hidden
                className="pointer-events-none absolute -bottom-[1px] left-0 h-[2px] rounded-[2px] bg-[#dfa040] shadow-[0_0_12px_rgba(223,160,64,0.85)]"
              />
            </div>
          </div>

          {/* Bottom Controls Bar: Left Arrow · Center Copy + CTA · Right Arrow */}
          <div className="relative px-3 pb-4 sm:px-8 sm:pb-7 lg:px-10 lg:pb-8">
            <div className="mx-auto flex max-w-[92rem] items-end justify-between gap-2 sm:gap-6">
              {/* Previous Arrow */}
              <button
                type="button"
                aria-label="Previous haulage showcase"
                onClick={() => goTo(activeRef.current - 1, -1, true)}
                className={cn(
                  "pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/85 backdrop-blur-md transition-[opacity,translate,border-color,color,background-color] duration-500 hover:border-[#dfa040] hover:bg-[#dfa040]/15 hover:text-[#fbcf6a] sm:h-[52px] sm:w-[52px]",
                  revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5",
                )}
                style={{ transitionDelay: "420ms", transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.3, 1)" }}
              >
                <ArrowIcon dir="prev" />
              </button>

              {/* Center Tracked CTA & Slide Context */}
              <div
                className={cn(
                  "pointer-events-auto flex min-w-0 max-w-2xl flex-1 flex-col items-center text-center transition-[opacity,translate] duration-700",
                  revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5",
                )}
                style={{ transitionDelay: "500ms", transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.3, 1)" }}
              >
                <div key={`${currentSlide.id}-caption`} className="hero-caption-in flex flex-col items-center">
                  <p
                    className="max-w-xl text-[13.5px] leading-snug text-white/85 sm:text-[15.5px]"
                    style={{ textShadow: "0 1px 10px rgba(0, 0, 0, 0.65)" }}
                  >
                    {currentSlide.summary}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-5 sm:gap-5">
                  <Link
                    href={`${siteConfig.ctaHref}?${currentSlide.contactQuery}#request`}
                    className="group inline-flex items-center justify-center gap-2.5 bg-[#dfa040] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#160b03] shadow-[0_8px_28px_rgba(223,160,64,0.32)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#fbcf6a] sm:px-8 sm:py-3.5 sm:text-[11.5px]"
                  >
                    {siteConfig.ctaLabel}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  {embedded ? (
                    <Link
                      href="/services"
                      className="group inline-flex items-center gap-2.5 rounded-sm border border-white/25 bg-black/40 px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm transition-colors hover:border-[#dfa040]/70 hover:text-[#fbcf6a] sm:px-5 sm:py-3.5"
                    >
                      All Services
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  ) : (
                    <a
                      href="#night-haul-film"
                      className="group inline-flex items-center gap-2.5 rounded-sm border border-white/25 bg-black/40 px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm transition-colors hover:border-[#dfa040]/70 hover:text-[#fbcf6a] sm:px-5 sm:py-3.5"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current">
                        <svg viewBox="0 0 10 10" className="ml-0.5 h-2 w-2" aria-hidden>
                          <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
                        </svg>
                      </span>
                      Night Haul Film
                    </a>
                  )}
                </div>
              </div>

              {/* Next Arrow */}
              <button
                type="button"
                aria-label="Next haulage showcase"
                onClick={() => goTo(activeRef.current + 1, 1, true)}
                className={cn(
                  "pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/85 backdrop-blur-md transition-[opacity,translate,border-color,color,background-color] duration-500 hover:border-[#dfa040] hover:bg-[#dfa040]/15 hover:text-[#fbcf6a] sm:h-[52px] sm:w-[52px]",
                  revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5",
                )}
                style={{ transitionDelay: "580ms", transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.3, 1)" }}
              >
                <ArrowIcon dir="next" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
