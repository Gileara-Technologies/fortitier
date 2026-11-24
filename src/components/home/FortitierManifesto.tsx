"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/content/site-config";
import { clamp01, lerp } from "./story-choreography";

/* ----------------------------------------------------------- sub-pieces */

function DropWord({ text, muted = false }: { text: string; muted?: boolean }) {
  return (
    <span
      data-m-item="word"
      className={`m-word inline-flex shrink-0 whitespace-pre font-display font-medium leading-none tracking-[-0.03em] ${
        muted ? "text-[#8D7A66]" : "text-[#FBF7F2]"
      }`}
    >
      {Array.from(text).map((ch, idx) => (
        <span
          key={`${ch}-${idx}`}
          className="m-char inline-block"
          style={{ transitionDelay: `${idx * 32}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function Sticker({
  text,
  bg,
  fg = "#160B03",
  rot,
  size = "lg",
  dot = false,
  className = "",
}: {
  text: string;
  bg: string;
  fg?: string;
  rot: number;
  size?: "sm" | "lg";
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      data-m-item="pop"
      className={`m-pop relative inline-flex shrink-0 items-center whitespace-nowrap font-display font-semibold leading-none tracking-[-0.02em] shadow-[0_0.12em_0.34em_rgba(0,0,0,0.45)] ${className}`}
      style={
        {
          backgroundColor: bg,
          color: fg,
          fontSize: size === "sm" ? "0.24em" : "0.42em",
          padding: size === "sm" ? "0.34em 0.68em" : "0.28em 0.62em 0.32em",
          borderRadius: "0.18em",
          "--rest-rot": `${rot}deg`,
        } as React.CSSProperties
      }
    >
      {text}
      {dot ? (
        <span
          aria-hidden
          className="absolute right-[0.26em] top-[0.22em] h-[0.22em] w-[0.22em] rounded-full bg-[#160B03]"
        />
      ) : null}
    </span>
  );
}

function Sparkle({ size = "0.38em" }: { size?: string }) {
  return (
    <span
      data-m-item="pop"
      aria-hidden
      className="m-pop inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, "--rest-rot": "0deg" } as React.CSSProperties}
    >
      <svg viewBox="0 0 20 20" className="h-full w-full" fill="#FBCF6A">
        <path d="M10 0c.8 5.6 3.6 8.6 10 10-6.4 1.4-9.2 4.4-10 10-.8-5.6-3.6-8.6-10-10 6.4-1.4 9.2-4.4 10-10z" />
      </svg>
    </span>
  );
}

function TankerTrinket({ src, alt, widthEm, rot }: { src: string; alt: string; widthEm: number; rot: number }) {
  return (
    <span
      data-m-item="pop"
      className="m-pop inline-flex shrink-0 items-center justify-center"
      style={
        {
          width: `${widthEm}em`,
          "--rest-rot": `${rot}deg`,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="h-auto w-full select-none object-contain"
        style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.65))" }}
      />
    </span>
  );
}

/* --------------------------------------------------------------- main */

export default function FortitierManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return;

    const items = Array.from(track.querySelectorAll<HTMLElement>("[data-m-item]"));
    let metrics = { W: 1440, H: 900, mobile: false, trackW: 4800 };

    const measure = () => {
      const W = stage.clientWidth || window.innerWidth;
      const H = stage.clientHeight || window.innerHeight;
      const mobile = W < 820 && W < H * 1.1;
      const mfs = mobile ? Math.min(W * 0.115, H * 0.078) : Math.min(W * 0.052, H * 0.105);
      section.style.setProperty("--mfs", `${mfs.toFixed(1)}px`);
      metrics = { W, H, mobile, trackW: track.scrollWidth || W * 3.5 };
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(track);
    window.addEventListener("resize", measure, { passive: true });

    let currentX = metrics.W * (metrics.mobile ? 0.08 : 0.06);
    let initialized = false;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(48, Math.max(4, now - lastTime));
      lastTime = now;

      const { W, H, mobile, trackW } = metrics;
      const rect = section.getBoundingClientRect();
      const totalTravel = Math.max(1, section.offsetHeight - H);
      const mp = clamp01(-rect.top / totalTravel);

      const startX = W * (mobile ? 0.08 : 0.06);
      const endX = Math.min(startX, -(trackW - W * 0.88));
      const targetX = lerp(startX, endX, mp);

      if (!initialized) {
        currentX = targetX;
        initialized = true;
      } else {
        const k = 1 - Math.pow(1 - 0.12, dt / 16.67);
        currentX += (targetX - currentX) * k;
      }

      track.style.transform = `translate3d(${currentX.toFixed(2)}px, -50%, 0)`;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${mp.toFixed(4)})`;
      }

      // Reveal items cleanly once section is within 20% of the viewport and item crosses right threshold
      const inZone = rect.top < H * 0.8 && rect.bottom > H * 0.2;
      if (inZone) {
        const threshold = W * (mobile ? 0.93 : 0.88);
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.classList.contains("is-revealed")) continue;
          const itemRect = item.getBoundingClientRect();
          if (itemRect.left <= threshold) {
            item.classList.add("is-revealed");
          }
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      data-nav-tone="dark"
      aria-label="Fortitier Logistics manifesto"
      className="relative h-[620vh] w-full bg-[#090502] text-[#FBF7F2]"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#090502]">
        {/* Warm radial obsidian depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 68% 55% at 50% 50%, rgba(172, 112, 35, 0.14) 0%, rgba(59, 25, 2, 0.12) 48%, rgba(9, 5, 2, 0) 100%)",
          }}
        />

        {/* Horizontal Manifesto Track */}
        <div
          ref={trackRef}
          className="absolute left-0 top-1/2 flex flex-nowrap items-center whitespace-nowrap will-change-transform"
          style={{
            fontSize: "var(--mfs, clamp(2.4rem, 5.2vw, 5.2rem))",
            gap: "0.34em",
          }}
        >
          {/* 1. Two-row intro block with non-overlapping floating stickers */}
          <div className="relative mr-[0.3em] inline-flex shrink-0 flex-col justify-center" style={{ fontSize: "0.72em", gap: "0.24em" }}>
            <Sticker
              text="bulk haulage"
              bg="#FBCF6A"
              fg="#160B03"
              rot={-6}
              size="sm"
              className="!absolute -top-[1.55em] left-0"
            />
            <Sticker
              text="tema · takoradi · buipe"
              bg="#F3EBE0"
              fg="#3B1902"
              rot={-3}
              size="sm"
              className="!absolute -top-[1.75em] left-[6.4em]"
            />
            <div className="flex items-center gap-[0.28em]">
              <DropWord text="Moving" muted />
              <DropWord text="fuel" />
            </div>
            <div className="flex items-center gap-[0.28em]">
              <DropWord text="that" />
              <DropWord text="powers" />
              <DropWord text="Ghana." muted />
            </div>
            <Sticker
              text="npa-aligned"
              bg="#DFA040"
              fg="#160B03"
              rot={4}
              size="sm"
              className="!absolute -bottom-[1.6em] left-[0.8em]"
            />
          </div>

          {/* 2. Miniature transparent Petrol tanker object */}
          <TankerTrinket
            src="/images/hero/tanker-petrol.webp"
            alt="Fortitier petrol tanker"
            widthEm={2.25}
            rot={-6}
          />

          {/* 3. "Every" + "tracked" badge + "litre reconciled." */}
          <DropWord text="Every" muted />

          <Sticker text="tracked" bg="#DFA040" fg="#160B03" rot={-7} dot className="mx-[0.12em]" />

          <DropWord text="litre" muted />
          <DropWord text="reconciled." />

          {/* 4. Gold sparkle + Fortitier emblem */}
          <Sparkle />
          <span
            data-m-item="pop"
            className="m-pop mx-[0.1em] inline-flex shrink-0 items-center justify-center"
            style={{ width: "1.15em", "--rest-rot": "-8deg" } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mark-on-dark.png"
              alt="Fortitier mark"
              className="h-auto w-full object-contain"
            />
          </span>

          {/* 5. "Fortitier — Latin for [with strength]" */}
          <DropWord text="Fortitier" />
          <DropWord text="—" muted />
          <DropWord text="Latin" muted />
          <DropWord text="for" muted />

          <Sticker text="with strength" bg="#FBCF6A" fg="#160B03" rot={-6} />
          <TankerTrinket
            src="/images/hero/tanker-diesel.webp"
            alt="Fortitier diesel tanker"
            widthEm={2.1}
            rot={5}
          />
          <Sparkle size="0.32em" />
          <Sticker text="nationwide" bg="#DFA040" fg="#160B03" rot={3} />

          {/* 6. Audience & promise */}
          <DropWord text="serving" muted />
          <DropWord text="OMCs," />
          <DropWord text="stations," />
          <DropWord text="mines," />
          <DropWord text="and" muted />
          <DropWord text="industry" />

          <Sticker text="calibrated" bg="#F3EBE0" fg="#3B1902" rot={-6} />
          <TankerTrinket
            src="/images/hero/tanker-gasoil.webp"
            alt="Fortitier gasoil tanker"
            widthEm={2.45}
            rot={-4}
          />

          <DropWord text="—" muted />
          <DropWord text="safe," />
          <DropWord text="accountable," />
          <DropWord text="on" muted />
          <DropWord text="time." />

          {/* End-of-track interactive CTA */}
          <Link
            href={siteConfig.ctaHref}
            data-m-item="pop"
            className="m-pop ml-[0.45em] inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#DFA040] px-7 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.24em] text-[#160B03] shadow-[0_10px_30px_rgba(223,160,64,0.35)] transition-colors hover:bg-[#FBCF6A]"
            style={{ "--rest-rot": "0deg" } as React.CSSProperties}
          >
            {siteConfig.ctaLabel}
            <span aria-hidden>→</span>
          </Link>

          <span className="inline-block w-[18vw] shrink-0" aria-hidden />
        </div>

        {/* Bottom subtle progress rail */}
        <div className="pointer-events-none absolute inset-x-5 bottom-8 z-10 sm:inset-x-10">
          <div className="h-[2px] w-full overflow-hidden bg-white/12">
            <span
              ref={progressBarRef}
              className="block h-full w-full origin-left bg-[#DFA040]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
