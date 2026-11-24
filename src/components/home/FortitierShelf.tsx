"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandLockup from "@/components/BrandLockup";
import { siteConfig } from "@/content/site-config";
import { SHELF_DOSSIERS, type ShelfDossier } from "./shelf-data";

const COUNT = SHELF_DOSSIERS.length;
const AUTO_ADVANCE_MS = 4500;

const INK_BLOBS: readonly { cx: number; cy: number; delay: number }[] = [
  { cx: 150, cy: 280, delay: 0 },
  { cx: 340, cy: 520, delay: 120 },
  { cx: 250, cy: 110, delay: 210 },
  { cx: 90, cy: 640, delay: 290 },
  { cx: 400, cy: 220, delay: 350 },
  { cx: 260, cy: 730, delay: 410 },
  { cx: 230, cy: 400, delay: 170 },
];

/** Signed circular slot offset in [-2, 3] for a 6-card deck. */
function circularOffset(index: number, active: number, count: number): number {
  let diff = (index - active) % count;
  if (diff > count / 2) diff -= count;
  if (diff <= -count / 2) diff += count;
  return diff;
}

export default function FortitierShelf() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const progressBarRef = useRef<HTMLSpanElement>(null);

  // Detail paper-sheet & ink-blot SVG refs
  const detailRef = useRef<HTMLDivElement>(null);
  const detailLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const blobRefs = useRef<(SVGCircleElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDossier, setDetailDossier] = useState<ShelfDossier>(SHELF_DOSSIERS[0]);

  const animRef = useRef({
    elapsed: 0,
    inkRaf: 0,
    sheetAnim: null as Animation | null,
    lineAnims: [] as Animation[],
    touchStartX: 0,
    touchMoved: false,
  });

  const goTo = useCallback((nextIdx: number) => {
    const normalized = ((nextIdx % COUNT) + COUNT) % COUNT;
    animRef.current.elapsed = 0;
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }
    setActiveIndex(normalized);
  }, []);

  const stepDeck = useCallback(
    (delta: 1 | -1) => {
      goTo(activeIndex + delta);
    },
    [activeIndex, goTo],
  );

  // Trigger rising masked lines + spreading SVG ink-blot reveal inside detail modal
  const runDetailReveal = useCallback((immediate = false) => {
    const st = animRef.current;
    if (st.inkRaf) cancelAnimationFrame(st.inkRaf);
    blobRefs.current.forEach((c) => c?.setAttribute("r", "0"));

    st.lineAnims.forEach((a) => a.cancel());
    st.lineAnims = [];
    const baseDelay = immediate ? 60 : 420;
    detailLinesRef.current.forEach((line, idx) => {
      if (!line) return;
      const anim = line.animate(
        [{ transform: "translateY(110%)" }, { transform: "translateY(0%)" }],
        {
          duration: immediate ? 540 : 820,
          delay: baseDelay + idx * 65,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "both",
        },
      );
      st.lineAnims.push(anim);
    });

    const inkStart = performance.now() + (immediate ? 80 : 380);
    const runInk = (now: number) => {
      const elapsed = now - inkStart;
      if (elapsed >= 0) {
        INK_BLOBS.forEach((b, i) => {
          const circle = blobRefs.current[i];
          if (!circle) return;
          const p = Math.min(1, Math.max(0, (elapsed - b.delay) / 1150));
          const eased = 1 - Math.pow(1 - p, 3);
          circle.setAttribute("r", (eased * 720).toFixed(1));
        });
      }
      if (elapsed < 2000) {
        st.inkRaf = requestAnimationFrame(runInk);
      } else {
        st.inkRaf = 0;
      }
    };
    st.inkRaf = requestAnimationFrame(runInk);
  }, []);

  const openDetailFor = useCallback(
    (index: number) => {
      const normalized = ((index % COUNT) + COUNT) % COUNT;
      const dossier = SHELF_DOSSIERS[normalized];
      setActiveIndex(normalized);
      setDetailDossier(dossier);
      setDetailOpen(true);
      animRef.current.elapsed = 0;

      const dialog = detailRef.current;
      if (!dialog) return;

      const cardEl = cardRefs.current[normalized];
      const rect = cardEl?.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const top = rect ? Math.max(0, rect.top) : vh * 0.15;
      const left = rect ? Math.max(0, rect.left) : vw * 0.3;
      const right = rect ? Math.max(0, vw - rect.right) : vw * 0.3;
      const bottom = rect ? Math.max(0, vh - rect.bottom) : vh * 0.15;

      document.body.style.overflow = "hidden";
      dialog.style.visibility = "visible";
      dialog.style.pointerEvents = "auto";
      dialog.scrollTop = 0;

      const st = animRef.current;
      st.sheetAnim?.cancel();
      st.sheetAnim = dialog.animate(
        [
          {
            clipPath: `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round 18px)`,
            opacity: 0.85,
          },
          {
            clipPath: "inset(0px 0px 0px 0px round 0px)",
            opacity: 1,
          },
        ],
        {
          duration: 720,
          easing: "cubic-bezier(0.76, 0, 0.18, 1)",
          fill: "both",
        },
      );

      runDetailReveal(false);
    },
    [runDetailReveal],
  );

  const closeDetail = useCallback(() => {
    const dialog = detailRef.current;
    if (!detailOpen || !dialog) return;

    const st = animRef.current;
    if (st.inkRaf) {
      cancelAnimationFrame(st.inkRaf);
      st.inkRaf = 0;
    }

    const cardEl = cardRefs.current[activeIndex];
    const rect = cardEl?.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const top = rect ? Math.max(0, rect.top) : vh * 0.15;
    const left = rect ? Math.max(0, rect.left) : vw * 0.3;
    const right = rect ? Math.max(0, vw - rect.right) : vw * 0.3;
    const bottom = rect ? Math.max(0, vh - rect.bottom) : vh * 0.15;

    dialog.style.pointerEvents = "none";
    st.sheetAnim?.cancel();
    const anim = dialog.animate(
      [
        {
          clipPath: "inset(0px 0px 0px 0px round 0px)",
          opacity: 1,
        },
        {
          clipPath: `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round 18px)`,
          opacity: 0.2,
        },
      ],
      {
        duration: 560,
        easing: "cubic-bezier(0.76, 0, 0.18, 1)",
        fill: "both",
      },
    );
    st.sheetAnim = anim;
    anim.onfinish = () => {
      dialog.style.visibility = "hidden";
      anim.cancel();
      st.lineAnims.forEach((a) => a.cancel());
      st.lineAnims = [];
      setDetailOpen(false);
      document.body.style.overflow = "";
    };
  }, [activeIndex, detailOpen]);

  const switchDetail = useCallback(
    (delta: 1 | -1) => {
      const nextIdx = (activeIndex + delta + COUNT) % COUNT;
      setActiveIndex(nextIdx);
      setDetailDossier(SHELF_DOSSIERS[nextIdx]);
      if (detailRef.current) detailRef.current.scrollTop = 0;
      runDetailReveal(true);
    },
    [activeIndex, runDetailReveal],
  );

  // Track section visibility so auto-advance only ticks while in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.intersectionRatio > 0.25);
      },
      { threshold: [0, 0.25, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cleanup body scroll lock on unmount
  useEffect(() => {
    const animState = animRef.current;
    return () => {
      if (animState.inkRaf) cancelAnimationFrame(animState.inkRaf);
      document.body.style.overflow = "";
    };
  }, []);

  // Smooth 60fps auto-advance timer with visual progress bar
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(100, Math.max(0, now - last));
      last = now;

      const shouldAdvance = inView && !isPaused && !isHovered && !detailOpen;
      if (shouldAdvance) {
        animRef.current.elapsed += dt;
        if (animRef.current.elapsed >= AUTO_ADVANCE_MS) {
          animRef.current.elapsed = 0;
          setActiveIndex((prev) => (prev + 1) % COUNT);
        }
      }

      if (progressBarRef.current) {
        const pct = Math.min(1, Math.max(0, animRef.current.elapsed / AUTO_ADVANCE_MS));
        progressBarRef.current.style.transform = `scaleX(${pct.toFixed(4)})`;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [detailOpen, inView, isHovered, isPaused]);

  // Keyboard navigation (Left/Right/Enter when in view; Esc/Arrows when modal open)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (detailOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeDetail();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          switchDetail(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          switchDetail(-1);
        }
        return;
      }
      if (!inView) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepDeck(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepDeck(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDetail, detailOpen, inView, stepDeck, switchDetail]);

  // Touch swipe support on mobile
  const onStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    animRef.current.touchStartX = e.clientX;
    animRef.current.touchMoved = false;
  };

  const onStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    const dx = e.clientX - animRef.current.touchStartX;
    if (Math.abs(dx) > 42) {
      animRef.current.touchMoved = true;
      stepDeck(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services-shelf"
      data-nav-tone="light"
      aria-label="Fortitier Logistics services showcase"
      className="ft-shelf-section relative flex min-h-[100svh] w-full select-none flex-col justify-between overflow-hidden bg-[#EDE7DE] pb-8 pt-20 text-[#140B05] sm:pb-10 sm:pt-24"
    >
      {/* Subtle printed paper grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.42] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.40 0 0 0 0 0.34 0 0 0 0.22 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />

      {/* Top Heading: Clean bold "Our Services" */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h2 className="font-wide text-[clamp(2rem,4.5vw,3.6rem)] font-bold uppercase leading-none tracking-[-0.02em] text-[#3B1902]">
          Our Services
        </h2>
      </div>

      {/* Middle: Auto-Advancing Editorial Card Deck */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={onStagePointerDown}
        onPointerUp={onStagePointerUp}
        className="relative z-10 my-5 flex flex-1 items-center justify-center px-4 sm:my-6"
        style={{ minHeight: "clamp(410px, 56svh, 520px)", touchAction: "pan-y" }}
      >
        <div className="relative flex h-[clamp(390px,54svh,490px)] w-full max-w-[1220px] items-center justify-center">
          {SHELF_DOSSIERS.map((doc, i) => {
            const offset = circularOffset(i, activeIndex, COUNT);
            const abs = Math.abs(offset);
            const isActive = offset === 0;
            const isVisible = abs <= 2;

            // Spatial editorial fan choreography: center active card flanked by crisp peeking cards
            let txPct = 0;
            let tyPx = 0;
            let scale = 1;
            let rotateDeg = 0;
            let opacity = 1;
            let zIndex = 30;

            if (offset === -1) {
              txPct = -84;
              tyPx = 14;
              scale = 0.85;
              rotateDeg = -4.5;
              opacity = 0.82;
              zIndex = 20;
            } else if (offset === 1) {
              txPct = 84;
              tyPx = 14;
              scale = 0.85;
              rotateDeg = 4.5;
              opacity = 0.82;
              zIndex = 20;
            } else if (offset === -2) {
              txPct = -152;
              tyPx = 30;
              scale = 0.72;
              rotateDeg = -8.5;
              opacity = 0.36;
              zIndex = 10;
            } else if (offset === 2) {
              txPct = 152;
              tyPx = 30;
              scale = 0.72;
              rotateDeg = 8.5;
              opacity = 0.36;
              zIndex = 10;
            } else if (!isActive) {
              txPct = offset < 0 ? -190 : 190;
              tyPx = 42;
              scale = 0.64;
              rotateDeg = offset < 0 ? -10 : 10;
              opacity = 0;
              zIndex = 5;
            }

            return (
              <article
                key={doc.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="button"
                tabIndex={abs <= 1 ? 0 : -1}
                aria-label={`${doc.title} — ${isActive ? "open full service description" : "bring card to center"}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  if (animRef.current.touchMoved) {
                    animRef.current.touchMoved = false;
                    return;
                  }
                  if (isActive) {
                    openDetailFor(i);
                  } else {
                    goTo(i);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (isActive) openDetailFor(i);
                    else goTo(i);
                  }
                }}
                className={`group absolute flex h-full w-[min(86vw,370px)] cursor-pointer flex-col overflow-hidden rounded-[20px] border bg-[#140A04] text-left transition-[transform,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DFA040] sm:w-[390px] ${
                  isActive
                    ? "border-[#DFA040]/55 shadow-[0_32px_70px_-24px_rgba(30,15,4,0.68)]"
                    : "border-[#DFA040]/20 shadow-[0_20px_44px_-24px_rgba(30,15,4,0.45)] hover:border-[#DFA040]/45"
                }`}
                style={{
                  transform: `translate3d(${txPct}%, ${tyPx}px, 0) scale(${scale}) rotate(${rotateDeg}deg)`,
                  opacity,
                  zIndex,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                {/* Upper Visual Plate */}
                <div
                  className="relative h-[56%] w-full overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(223, 160, 64, 0.25) 0%, rgba(59, 25, 2, 0.55) 58%, #0a0502 100%)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.image}
                    alt={doc.title}
                    loading={i < 3 ? "eager" : "lazy"}
                    draggable={false}
                    className={`h-full w-full transition-transform duration-700 ease-out ${
                      doc.studio
                        ? "object-contain p-5 group-hover:scale-[1.04]"
                        : "object-cover group-hover:scale-[1.05]"
                    }`}
                    style={doc.objectPosition ? { objectPosition: doc.objectPosition } : undefined}
                  />
                  {/* Bottom vignette melting seamlessly into card body */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140A04] via-[#140A04]/25 to-black/30"
                  />

                  {/* Top index & status badge */}
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    <span className="rounded-full border border-[#DFA040]/45 bg-[#140A04]/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FBCF6A] backdrop-blur-sm">
                      {doc.code} / 0{COUNT}
                    </span>
                    {doc.status === "roadmap" ? (
                      <span className="rounded-full border border-[#AC7023] bg-[#3B1902]/90 px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#FBCF6A]">
                        Roadmap
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-[#140A04]/70 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/75">
                        Ghana · NPA
                      </span>
                    )}
                  </div>
                </div>

                {/* Lower Editorial Content */}
                <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <div>
                    <h3 className="font-display text-[23px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#FBF7F2] sm:text-[26px]">
                      {doc.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.52] text-[#FBF7F2]/75 sm:text-[13.5px]">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FBCF6A] transition-colors group-hover:text-white">
                      {isActive ? "View details" : "Bring to front"}
                    </span>
                    <span
                      aria-hidden
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DFA040]/50 bg-[#DFA040]/15 text-[12px] text-[#FBCF6A] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#DFA040] group-hover:text-[#160B03]"
                    >
                      →
                    </span>
                  </div>
                </div>

                {/* Subtle darkening veil on non-active peeking cards */}
                {!isActive && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[#140A04]/30 transition-opacity duration-500 group-hover:opacity-15"
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Bottom: Auto-Advance Progress Stepper + Prev / Pause / Next Controls */}
      <div className="relative z-10 mx-auto flex w-full max-w-[68rem] flex-col items-center gap-4 px-4 sm:px-8">
        <div className="flex w-full items-center justify-between gap-3">
          {/* Prev button */}
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => stepDeck(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#140B05]/25 text-[#140B05] transition-colors hover:border-[#3B1902] hover:bg-[#3B1902] hover:text-[#FBCF6A]"
          >
            <svg viewBox="0 0 18 10" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path d="M5 1 L1 5 L5 9 M1 5 H17" />
            </svg>
          </button>

          {/* 6 Timed Progress Pills */}
          <div
            role="tablist"
            aria-label="Select service card"
            className="flex flex-1 items-center justify-center gap-2 sm:gap-2.5"
          >
            {SHELF_DOSSIERS.map((doc, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={doc.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show ${doc.title}`}
                  onClick={() => goTo(idx)}
                  className={`group relative h-2 overflow-hidden rounded-full transition-all duration-500 ${
                    active
                      ? "w-14 bg-[#3B1902]/20 sm:w-20"
                      : "w-5 bg-[#3B1902]/20 hover:bg-[#3B1902]/45 sm:w-7"
                  }`}
                >
                  {active && (
                    <span
                      ref={progressBarRef}
                      className="absolute inset-0 origin-left rounded-full bg-[#DFA040]"
                      style={{ transform: "scaleX(0)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Pause/Resume + Next */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={isPaused ? "Resume auto-switching" : "Pause auto-switching"}
              onClick={() => setIsPaused((p) => !p)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#140B05]/25 text-[#140B05] transition-colors hover:border-[#3B1902] hover:bg-[#3B1902] hover:text-[#FBCF6A]"
            >
              {isPaused ? (
                <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M2.5 1.5 L10.5 6 L2.5 10.5 Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <rect x="2.2" y="1.5" width="2.6" height="9" rx="0.5" />
                  <rect x="7.2" y="1.5" width="2.6" height="9" rx="0.5" />
                </svg>
              )}
            </button>
            <button
              type="button"
              aria-label="Next service"
              onClick={() => stepDeck(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#140B05]/25 text-[#140B05] transition-colors hover:border-[#3B1902] hover:bg-[#3B1902] hover:text-[#FBCF6A]"
            >
              <svg viewBox="0 0 18 10" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path d="M13 1 L17 5 L13 9 M17 5 H1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer micro bar */}
        <div className="flex w-full items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#5C3A22]/80">
          <span>Click active card for full description</span>
          <Link
            href="/services"
            className="text-[#3B1902] underline underline-offset-4 hover:text-[#AC7023]"
          >
            All Services →
          </Link>
        </div>
      </div>

      {/* Full-Screen Expanding Paper Dossier Sheet + SVG Ink-Blot Poster Reveal */}
      <div
        ref={detailRef}
        role="dialog"
        aria-modal="true"
        aria-label={detailDossier.title}
        aria-hidden={!detailOpen}
        className="fixed inset-0 z-[95] overflow-y-auto bg-[#FBF7F2] text-[#140B05]"
        style={{ visibility: "hidden", pointerEvents: "none" }}
      >
        {/* Top bar inside sheet */}
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E8DCCC] bg-[#FBF7F2]/95 px-4 backdrop-blur-sm sm:h-20 sm:px-8">
          <button
            type="button"
            onClick={closeDetail}
            className="inline-flex h-8 items-center rounded-full border border-[#140B05]/80 px-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#140B05] transition-colors hover:bg-[#3B1902] hover:text-[#FBCF6A]"
          >
            Close · Esc
          </button>
          <BrandLockup tone="light" size="sm" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous service detail"
              onClick={() => switchDetail(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#140B05]/25 text-[#3B1902] transition-colors hover:border-[#3B1902] hover:bg-[#3B1902] hover:text-[#FBCF6A]"
            >
              ←
            </button>
            <span className="px-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A5A1C]">
              {detailDossier.code} / 0{COUNT}
            </span>
            <button
              type="button"
              aria-label="Next service detail"
              onClick={() => switchDetail(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#140B05]/25 text-[#3B1902] transition-colors hover:border-[#3B1902] hover:bg-[#3B1902] hover:text-[#FBCF6A]"
            >
              →
            </button>
          </div>
        </div>

        {/* Two-column editorial layout (mobile: poster first, then details) */}
        <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[88rem] items-center gap-8 px-5 py-8 sm:px-10 lg:grid-cols-2 lg:gap-14 lg:py-12">
          {/* Left column: masked rising lines */}
          <div className="order-2 flex max-w-[540px] flex-col gap-4 lg:order-1">
            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  detailLinesRef.current[0] = el;
                }}
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#AC7023]"
              >
                {detailDossier.subtitle}
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  detailLinesRef.current[1] = el;
                }}
              >
                <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#3B1902]">
                  {detailDossier.title}
                </h2>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  detailLinesRef.current[2] = el;
                }}
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#7A5A40]"
              >
                {detailDossier.meta}
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  detailLinesRef.current[3] = el;
                }}
                className="text-[16px] leading-[1.62] text-[#3B1902]/90 sm:text-[17px]"
              >
                {detailDossier.summary}
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  detailLinesRef.current[4] = el;
                }}
              >
                <ul className="space-y-2.5 border-t border-[#E8DCCC] pt-4 text-[14.5px] text-[#5C3A22]">
                  {detailDossier.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#DFA040]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  detailLinesRef.current[5] = el;
                }}
                className="text-[13.5px] italic text-[#7A5A40]"
              >
                {detailDossier.credit}
              </div>
            </div>

            <div className="overflow-hidden pt-2">
              <div
                ref={(el) => {
                  detailLinesRef.current[6] = el;
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  href={`${siteConfig.ctaHref}?${detailDossier.ctaQuery}#request`}
                  onClick={closeDetail}
                  className="inline-flex h-11 items-center gap-2.5 bg-[#3B1902] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FBCF6A] transition-colors hover:bg-[#5C3A22]"
                >
                  {siteConfig.ctaLabel}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={detailDossier.href}
                  onClick={closeDetail}
                  className="inline-flex h-11 items-center border border-[#3B1902]/40 px-5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#3B1902] transition-colors hover:border-[#3B1902] hover:bg-[#F3EBE0]"
                >
                  Full details
                </Link>
              </div>
            </div>
          </div>

          {/* Right column: SVG Poster with ragged spreading ink-blot mask */}
          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="aspect-[474/760] h-[40svh] max-h-[700px] w-auto overflow-hidden rounded-[8px] shadow-[0_24px_60px_-20px_rgba(59,25,2,0.35)] lg:h-[72vh]">
              <svg viewBox="0 0 474 760" className="h-full w-full" aria-hidden>
                <defs>
                  <filter id="ft-ink-blot" x="-30%" y="-30%" width="160%" height="160%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.011"
                      numOctaves="3"
                      seed="7"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="120"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>
                  <mask id="ft-ink-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1160">
                    <g filter="url(#ft-ink-blot)">
                      {INK_BLOBS.map((b, i) => (
                        <circle
                          key={i}
                          ref={(el) => {
                            blobRefs.current[i] = el;
                          }}
                          cx={b.cx}
                          cy={b.cy}
                          r={0}
                          fill="#FFFFFF"
                        />
                      ))}
                    </g>
                  </mask>
                  <radialGradient id="ft-studio-bg" cx="50%" cy="48%" r="65%">
                    <stop offset="0%" stopColor="#6E3B10" />
                    <stop offset="55%" stopColor="#261105" />
                    <stop offset="100%" stopColor="#0D0602" />
                  </radialGradient>
                </defs>

                <g mask="url(#ft-ink-mask)">
                  <rect x="0" y="0" width="474" height="760" fill="url(#ft-studio-bg)" />
                  <image
                    href={detailDossier.image}
                    x={detailDossier.studio ? 24 : 0}
                    y={detailDossier.studio ? 150 : 0}
                    width={detailDossier.studio ? 426 : 474}
                    height={detailDossier.studio ? 460 : 760}
                    preserveAspectRatio={detailDossier.studio ? "xMidYMid meet" : "xMidYMid slice"}
                  />
                  <rect
                    x="18"
                    y="18"
                    width="438"
                    height="724"
                    fill="none"
                    stroke="#DFA040"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
