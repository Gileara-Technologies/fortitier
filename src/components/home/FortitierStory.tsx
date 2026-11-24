"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site-config";
import {
  FORTITIER_PIXEL_ICONS,
  PIXEL_PALETTE,
  STORY_CARDS,
  cardWidthForViewport,
  clamp01,
  eInOut,
  lerp,
  targetCardPose,
  type CardPose,
  type PixelIconDef,
} from "./story-choreography";

const HEADLINE = "Fuel in Motion";
const CHARS = Array.from(HEADLINE);

/* ----------------------------------------------------------- pixel icon */

function PixelIconSvg({ def }: { def: PixelIconDef }) {
  return (
    <svg viewBox="0 0 9 9" shapeRendering="crispEdges" className="h-full w-full" aria-hidden>
      {def.rows.map((row, y) =>
        Array.from(row).map((ch, x) => {
          const fill = PIXEL_PALETTE[ch];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1.03} height={1.03} fill={fill} />;
        }),
      )}
    </svg>
  );
}

/* ------------------------------------------------------ process copy */

interface WordToken {
  text: string;
  muted?: boolean;
  chip?: boolean;
}

const PROCESS_LINE_1: WordToken[] = [
  { text: "From", muted: true },
  { text: "depot" },
  { text: "to", muted: true },
  { text: "site" },
];

const PROCESS_LINE_2: WordToken[] = [
  { text: "built" },
  { text: "through", muted: true },
  { text: "real" },
  { text: "discipline" },
];

const SKY_TL: WordToken[] = [
  { text: "Not", muted: true },
  { text: "just", muted: true },
  { text: "tankers" },
];

const SKY_BR: WordToken[] = [
  { text: "Real", muted: true },
  { text: "accountability" },
  { text: "that", muted: true },
  { text: "arrives" },
];

/* --------------------------------------------------------------- main */

export default function FortitierStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsHostRef = useRef<HTMLDivElement>(null);
  const cardElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const processRef = useRef<HTMLDivElement>(null);
  const skyPanelRef = useRef<HTMLDivElement>(null);
  const skyMediaRef = useRef<HTMLDivElement>(null);
  const skyVideoRef = useRef<HTMLVideoElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);

  const [morphStarted, setMorphStarted] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const [processShown, setProcessShown] = useState(false);
  const [skyWordsShown, setSkyWordsShown] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoOrient, setVideoOrient] = useState<"l" | "p">("l");

  // Trigger the pixel-icon-to-letter morph when #story enters the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMorphStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Step through the icon-to-letter morph cleanly (14 characters over ~2.8s)
  useEffect(() => {
    if (!morphStarted) return;
    const timers: number[] = [];
    const baseDelay = 520;
    const stepMs = 155;
    for (let k = 1; k <= CHARS.length; k++) {
      timers.push(window.setTimeout(() => setRevealedChars(k), baseDelay + (k - 1) * stepMs));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [morphStarted]);

  // Core frame-rate-independent scroll choreography loop
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const displayedPoses: CardPose[] = STORY_CARDS.map(() => ({
      x: 0,
      y: 0,
      rot: 0,
      scale: 1,
      opacity: 0,
    }));

    let initialized = false;
    let skyProgress = 0;
    let lastNavTone: "light" | "dark" | null = null;
    let processRevealedRef = false;
    let skyWordsRevealedRef = false;
    let videoPlaying = false;
    let metrics = { W: 1440, H: 900, mobile: false, cw: 214 };

    const updateMetrics = () => {
      const W = stage.clientWidth || window.innerWidth;
      const H = stage.clientHeight || window.innerHeight;
      const mobile = W < 820 && W < H * 1.1;
      const cw = cardWidthForViewport(W, H, mobile);
      metrics = { W, H, mobile, cw };
      setVideoOrient(mobile ? "p" : "l");

      const hfs = mobile ? Math.min(W * 0.115, H * 0.085) : Math.min(W * 0.072, H * 0.128);
      const pfs = mobile ? Math.min(W * 0.082, 38) : Math.min(W * 0.034, H * 0.064);
      const sfs = mobile ? Math.min(W * 0.085, 42) : Math.min(W * 0.042, H * 0.078);
      const camw = mobile ? Math.min(W * 0.84, H * 0.44) : Math.min(W * 0.52, H * 0.78);
      const n = mobile ? Math.min(1, W / 560) : Math.min(1.25, Math.max(0.65, W / 1440));

      section.style.setProperty("--hfs", `${hfs.toFixed(1)}px`);
      section.style.setProperty("--ic", `${(hfs * 0.62).toFixed(1)}px`);
      section.style.setProperty("--pfs", `${pfs.toFixed(1)}px`);
      section.style.setProperty("--sfs", `${sfs.toFixed(1)}px`);
      section.style.setProperty("--camw", `${camw.toFixed(1)}px`);
      section.style.setProperty("--n", `${n.toFixed(3)}px`);
      if (cardsHostRef.current) {
        cardsHostRef.current.style.setProperty("--cw", `${cw.toFixed(2)}`);
      }
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(48, Math.max(4, now - lastTime));
      lastTime = now;

      const { W, H, mobile, cw } = metrics;
      const rect = section.getBoundingClientRect();
      const totalTravel = Math.max(1, section.offsetHeight - H);
      const p = clamp01(-rect.top / totalTravel);

      // 1) Hero headline fades out cleanly before reaching the fixed nav
      if (headlineRef.current && heroHeaderRef.current) {
        const navH = mobile ? 60 : 74;
        const hRect = headlineRef.current.getBoundingClientRect();
        const hfs = parseFloat(section.style.getPropertyValue("--hfs")) || 72;
        const fadeStart = navH + 1.85 * hfs;
        const fadeEnd = navH + 0.55 * hfs;
        const headOpacity = clamp01((hRect.top - fadeEnd) / Math.max(1, fadeStart - fadeEnd));
        headlineRef.current.style.opacity = headOpacity.toFixed(3);
      }

      // 2) Cards: compute target pose and chase with per-card staggered inertia
      let maxDeltaPos = 0;
      let maxDeltaRot = 0;

      for (let i = 0; i < STORY_CARDS.length; i++) {
        const target = targetCardPose(i, p, W, H, cw, mobile);
        const cur = displayedPoses[i];
        if (!initialized || p <= 0.001) {
          cur.x = target.x;
          cur.y = target.y;
          cur.rot = target.rot;
          cur.scale = target.scale;
          cur.opacity = target.opacity;
        } else {
          const w = 0.068 + (i % 4) * 0.009;
          const k = 1 - Math.pow(1 - w, dt / 16.67);
          cur.x += (target.x - cur.x) * k;
          cur.y += (target.y - cur.y) * k;
          cur.rot += (target.rot - cur.rot) * k;
          cur.scale += (target.scale - cur.scale) * k;
          cur.opacity += (target.opacity - cur.opacity) * k;
        }
        maxDeltaPos = Math.max(maxDeltaPos, Math.abs(target.x - cur.x), Math.abs(target.y - cur.y));
        maxDeltaRot = Math.max(maxDeltaRot, Math.abs(target.rot - cur.rot));

        const el = cardElsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0) rotate(${cur.rot.toFixed(2)}deg) scale(${cur.scale.toFixed(4)})`;
          el.style.opacity = cur.opacity.toFixed(3);
          el.style.visibility = cur.opacity > 0.01 ? "visible" : "hidden";
        }
      }
      initialized = true;

      // 3) Process block ("From depot [chip] to site / built through real discipline")
      if (processRef.current) {
        if (p < 0.05) {
          processRef.current.style.opacity = "0";
          processRef.current.style.pointerEvents = "none";
          if (processRevealedRef) {
            processRevealedRef = false;
            setProcessShown(false);
          }
        } else {
          const fadeIn = clamp01((p - 0.05) / 0.032);
          const fadeOut = 1 - clamp01((p - 0.58) / 0.07);
          const alpha = fadeIn * fadeOut;
          processRef.current.style.opacity = alpha.toFixed(3);
          processRef.current.style.pointerEvents = alpha > 0.35 ? "auto" : "none";
          if (p > 0.078 && !processRevealedRef) {
            processRevealedRef = true;
            setProcessShown(true);
          }
        }
      }

      // 4) Gated expanding dusk horizon panel + 3D-yawing studio tanker + headlight zoom
      const cardsSettled = maxDeltaPos < 6 && maxDeltaRot < 2;
      const wheelDone = p >= 0.61;
      const rawSkyTarget = wheelDone && cardsSettled ? clamp01((p - 0.62) / 0.14) : p < 0.61 ? 0 : skyProgress;
      const skyK = 1 - Math.pow(1 - 0.1, dt / 16.67);
      skyProgress += (rawSkyTarget - skyProgress) * skyK;
      if (skyProgress < 0.002 && rawSkyTarget === 0) skyProgress = 0;

      const skyPanel = skyPanelRef.current;
      if (skyPanel) {
        if (skyProgress <= 0.002) {
          skyPanel.style.visibility = "hidden";
          skyPanel.style.opacity = "0";
          if (blackoutRef.current) blackoutRef.current.style.opacity = "0";
          if (videoPlaying && skyVideoRef.current) {
            skyVideoRef.current.pause();
            videoPlaying = false;
          }
          if (skyWordsRevealedRef) {
            skyWordsRevealedRef = false;
            setSkyWordsShown(false);
          }
        } else {
          skyPanel.style.visibility = "visible";
          skyPanel.style.opacity = clamp01(skyProgress * 3.5).toFixed(3);
          const g = eInOut(skyProgress);

          // Grow from sleek centered rounded window to full bleed
          const initW = mobile ? 44 : 18;
          const initH = mobile ? 18 : 22;
          const centerY = mobile ? 44 : 39;
          const topStart = centerY - initH / 2;
          const bottomStart = 100 - (centerY + initH / 2);
          const sideStart = (100 - initW) / 2;

          const topPct = lerp(topStart, 0, g);
          const bottomPct = lerp(bottomStart, 0, g);
          const sidePct = lerp(sideStart, 0, g);
          const rad = lerp(16, 0, g);
          skyPanel.style.clipPath = `inset(${topPct.toFixed(2)}% ${sidePct.toFixed(2)}% ${bottomPct.toFixed(2)}% ${sidePct.toFixed(2)}% round ${rad.toFixed(1)}px)`;

          const zoomGate = clamp01((skyProgress - 0.88) / 0.12);
          const qRaw = clamp01((p - 0.88) / 0.095);
          const q = Math.pow(qRaw, 1.55) * zoomGate;

          if (skyMediaRef.current) {
            const bgScale = lerp(1.16, 1, g) + q * 0.22;
            skyMediaRef.current.style.transform = `scale(${bgScale.toFixed(4)})`;
          }

          if (!videoPlaying && skyVideoRef.current) {
            skyVideoRef.current.playbackRate = 0.72;
            void skyVideoRef.current.play().catch(() => undefined);
            videoPlaying = true;
          }

          if (skyProgress > 0.92 && !skyWordsRevealedRef) {
            skyWordsRevealedRef = true;
            setSkyWordsShown(true);
          }

          // Blackout curtain sweeps in smoothly into the horizontal manifesto
          if (blackoutRef.current) {
            const blackAlpha = clamp01((q - 0.36) / 0.48);
            blackoutRef.current.style.opacity = blackAlpha.toFixed(3);
          }
        }
      }

      // 5) Update adaptive nav tone (light over warm paper, dark once dusk window dominates)
      const desiredTone: "light" | "dark" = skyProgress > 0.55 ? "dark" : "light";
      if (desiredTone !== lastNavTone) {
        lastNavTone = desiredTone;
        section.dataset.navTone = desiredTone;
        window.dispatchEvent(new CustomEvent("fortitier:nav-tone-change"));
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  // Compute remaining pixel icons count matching Tidewell's formula
  const nonSpaceTotal = CHARS.filter((c) => c !== " ").length;
  const nonSpaceRevealed = CHARS.slice(0, revealedChars).filter((c) => c !== " ").length;
  const lettersLeft = Math.max(0, nonSpaceTotal - nonSpaceRevealed);
  const iconsRemaining = Math.ceil((FORTITIER_PIXEL_ICONS.length * lettersLeft) / Math.max(1, nonSpaceTotal));
  const consumedCount = FORTITIER_PIXEL_ICONS.length - iconsRemaining;

  return (
    <section
      ref={sectionRef}
      id="story"
      data-nav-tone="light"
      aria-label="Fortitier Logistics — Fuel in Motion scroll story"
      className="relative h-[950vh] w-full bg-[#FBF7F2] text-[#3B1902]"
    >
      {/* Opening Warm-Paper Hero Header (scrolls away 1:1 while stage stays pinned) */}
      <div
        ref={heroHeaderRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-[9] flex h-[100svh] flex-col items-center justify-start pt-[26svh] sm:pt-[24svh]"
      >
        <div
          ref={headlineRef}
          role="heading"
          aria-level={2}
          aria-label={HEADLINE}
          className="flex flex-wrap items-center justify-center px-4 text-center font-display font-semibold leading-none tracking-[-0.035em] text-[#3B1902]"
          style={{ fontSize: "var(--hfs, clamp(2.6rem, 7vw, 6.2rem))" }}
        >
          {/* Letters revealed left-to-right */}
          <span className="inline-flex items-baseline" aria-hidden>
            {CHARS.map((ch, idx) => {
              const shown = idx < revealedChars;
              return (
                <span
                  key={`${ch}-${idx}`}
                  className="inline-block transition-[clip-path,opacity,max-width] duration-300"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.25, 0.75, 0.2, 1)",
                    clipPath: shown ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                    opacity: shown ? 1 : 0,
                    maxWidth: shown ? (ch === " " ? "0.28em" : "1.1em") : "0px",
                    overflow: "hidden",
                    whiteSpace: "pre",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>

          {/* Remaining pixel icons smoothly squashing out as letters form */}
          <span
            aria-hidden
            className="inline-flex items-center transition-[margin,gap] duration-300"
            style={{
              marginLeft: revealedChars > 0 && iconsRemaining > 0 ? "0.24em" : "0px",
              gap: "calc(var(--ic, 40px) * 0.18)",
            }}
          >
            {FORTITIER_PIXEL_ICONS.map((icon, idx) => {
              const consumed = idx < consumedCount;
              return (
                <span
                  key={icon.id}
                  className="inline-flex shrink-0 items-center justify-center transition-[transform,opacity,width,margin] duration-300"
                  style={{
                    width: consumed ? "0px" : "var(--ic, 40px)",
                    height: "var(--ic, 40px)",
                    opacity: !morphStarted ? 0 : consumed ? 0 : 1,
                    transform: !morphStarted
                      ? "scale(0.2)"
                      : consumed
                        ? "scaleX(1.25) scaleY(0.16) rotate(-42deg)"
                        : "scale(1) rotate(0deg)",
                    transitionDelay: !morphStarted ? "0ms" : consumed ? "0ms" : `${idx * 55}ms`,
                    transitionTimingFunction: consumed
                      ? "cubic-bezier(0.4, 0, 0.2, 1)"
                      : "cubic-bezier(0.22, 1.28, 0.36, 1)",
                    overflow: "hidden",
                  }}
                >
                  <PixelIconSvg def={icon} />
                </span>
              );
            })}
          </span>
        </div>
      </div>

      {/* Pinned Full-Viewport Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#FBF7F2]"
      >
        {/* Subtle warm-paper radial depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 50% 42%, rgba(251, 207, 106, 0.14) 0%, rgba(243, 235, 224, 0.35) 55%, rgba(251, 247, 242, 0) 100%)",
          }}
        />

        {/* Z-2: 12 Fortitier Cards (fan -> scatter -> pile -> rotating wheel) */}
        <div ref={cardsHostRef} className="pointer-events-none absolute inset-0 z-[2]">
          {STORY_CARDS.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => {
                cardElsRef.current[idx] = el;
              }}
              className="absolute left-0 top-0 overflow-hidden will-change-transform"
              style={{
                width: "calc(var(--cw, 200) * 1px)",
                height: "calc(var(--cw, 200) * 1.32px)",
                marginLeft: "calc(var(--cw, 200) * -0.5px)",
                marginTop: "calc(var(--cw, 200) * -0.66px)",
                borderRadius: "calc(var(--cw, 200) * 0.075px)",
                boxShadow:
                  "0 calc(var(--cw, 200) * 0.03px) calc(var(--cw, 200) * 0.09px) rgba(59, 25, 2, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.38)",
                backgroundColor: card.studio ? "#140903" : "#1a0e06",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.alt}
                loading={idx < 6 ? "eager" : "lazy"}
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: card.objectPosition ?? "50% 50%" }}
              />
            </div>
          ))}
        </div>

        {/* Z-4: Process Headline ("From depot [chip] to site / built through real discipline") */}
        <div
          ref={processRef}
          className="absolute inset-x-0 top-[17%] z-[4] flex flex-col items-center px-4 text-center opacity-0 sm:top-[19%]"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="font-display font-medium leading-[1.12] tracking-[-0.03em] text-[#3B1902]"
            style={{ fontSize: "var(--pfs, clamp(1.9rem, 3.4vw, 3.3rem))" }}
          >
            <p className="flex flex-wrap items-center justify-center gap-x-[0.24em]">
              {PROCESS_LINE_1.map((tok, i) => (
                <span
                  key={`${tok.text}-${i}`}
                  className={`inline-block transition-[opacity,transform,filter] duration-500 ${tok.muted ? "text-[#9A7B5C]" : "text-[#3B1902]"}`}
                  style={{
                    opacity: processShown ? 1 : 0,
                    transform: processShown ? "translateY(0)" : "translateY(0.34em)",
                    filter: processShown ? "blur(0px)" : "blur(6px)",
                    transitionDelay: `${i * 95}ms`,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {tok.text}
                </span>
              ))}
            </p>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-[0.24em]">
              {PROCESS_LINE_2.map((tok, i) => {
                const delay = (PROCESS_LINE_1.length + i) * 95;
                return (
                  <span
                    key={`${tok.text}-${i}`}
                    className={`inline-block transition-[opacity,transform,filter] duration-500 ${tok.muted ? "text-[#9A7B5C]" : "text-[#3B1902]"}`}
                    style={{
                      opacity: processShown ? 1 : 0,
                      transform: processShown ? "translateY(0)" : "translateY(0.34em)",
                      filter: processShown ? "blur(0px)" : "blur(6px)",
                      transitionDelay: `${delay}ms`,
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {tok.text}
                  </span>
                );
              })}
            </p>
          </div>

          <p
            className="mt-4 max-w-md text-[13.5px] font-normal text-[#5C3A22] transition-[opacity,transform] duration-500 sm:text-[15.5px]"
            style={{
              opacity: processShown ? 1 : 0,
              transform: processShown ? "translateY(0)" : "translateY(8px)",
              transitionDelay: "680ms",
            }}
          >
            Petrol, diesel and gasoil across Ghana — tracked gate to gate, reconciled to the litre.
          </p>

          <Link
            href={siteConfig.ctaHref}
            className="group mt-5 inline-flex items-center gap-2.5 rounded-xl bg-[#3B1902] px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#FBF7F2] shadow-[0_8px_24px_rgba(59,25,2,0.22)] transition-[background-color,opacity,transform] duration-300 hover:bg-[#5C3A22]"
            style={{
              opacity: processShown ? 1 : 0,
              transform: processShown ? "translateY(0)" : "translateY(8px)",
              transitionDelay: "820ms",
            }}
          >
            {siteConfig.ctaLabel}
            <span aria-hidden className="text-[#FBCF6A] transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Z-6: Gated Expanding Dusk Horizon Window + 3D-Yawing Studio Tanker */}
        <div
          ref={skyPanelRef}
          className="pointer-events-none absolute inset-0 z-[6] overflow-hidden bg-[#0e0703] opacity-0 will-change-[clip-path]"
          style={{ visibility: "hidden" }}
        >
          {/* Scaling dusk highway plate + looping 0.6x dusk video */}
          <div ref={skyMediaRef} className="absolute -inset-[4%] will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={videoOrient === "p" ? "/film/hero-axis-mobile.jpg?v=2" : "/film/hero-axis-hd.jpg?v=2"}
              alt=""
              className="h-full w-full object-cover"
            />
            <video
              ref={skyVideoRef}
              src={videoOrient === "p" ? "/film/hero-axis-mobile.mp4?v=2" : "/film/hero-axis-hd.mp4?v=2"}
              muted
              loop
              playsInline
              preload="none"
              onPlaying={() => setVideoReady(true)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              style={{ opacity: videoReady ? 0.88 : 0 }}
              aria-hidden
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-[#120803]/70 via-[#3B1902]/20 to-[#090502]/75"
            />
          </div>

          {/* Top-left Sky Phrase: "Not just tankers" */}
          <div
            className="absolute left-4 top-[5.2rem] font-display font-medium leading-[1.08] tracking-[-0.03em] sm:left-10 sm:top-[6.2rem]"
            style={{ fontSize: "var(--sfs, clamp(1.9rem, 4.2vw, 3.8rem))" }}
          >
            <p className="flex flex-wrap gap-x-[0.25em]">
              {SKY_TL.map((tok, i) => (
                <span
                  key={tok.text}
                  className={`inline-block transition-[opacity,transform,filter] duration-500 ${tok.muted ? "text-[#C9B393]/75" : "text-[#FBF7F2]"}`}
                  style={{
                    opacity: skyWordsShown ? 1 : 0,
                    transform: skyWordsShown ? "translateY(0)" : "translateY(0.3em)",
                    filter: skyWordsShown ? "blur(0px)" : "blur(6px)",
                    transitionDelay: `${i * 115}ms`,
                  }}
                >
                  {tok.text}
                </span>
              ))}
            </p>
          </div>

          {/* Bottom-right Sky Phrase: "Real accountability that arrives" */}
          <div
            className="absolute bottom-7 right-4 max-w-[90vw] text-right font-display font-medium leading-[1.08] tracking-[-0.03em] sm:bottom-11 sm:right-10"
            style={{ fontSize: "var(--sfs, clamp(1.9rem, 4.2vw, 3.8rem))" }}
          >
            <p className="flex flex-wrap justify-end gap-x-[0.25em]">
              {SKY_BR.map((tok, i) => (
                <span
                  key={tok.text}
                  className={`inline-block transition-[opacity,transform,filter] duration-500 ${
                    tok.text === "arrives"
                      ? "text-[#FBCF6A]"
                      : tok.muted
                        ? "text-[#C9B393]/75"
                        : "text-[#FBF7F2]"
                  }`}
                  style={{
                    opacity: skyWordsShown ? 1 : 0,
                    transform: skyWordsShown ? "translateY(0)" : "translateY(0.3em)",
                    filter: skyWordsShown ? "blur(0px)" : "blur(6px)",
                    transitionDelay: `${420 + i * 115}ms`,
                  }}
                >
                  {tok.text}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Z-8: Seamless Obsidian Blackout transitioning into the Horizontal Manifesto */}
        <div
          ref={blackoutRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[8] bg-[#090502] opacity-0"
        />
      </div>
    </section>
  );
}
