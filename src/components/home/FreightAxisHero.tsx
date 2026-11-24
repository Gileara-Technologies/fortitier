"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site-config";

/**
 * Lightweight aerial highway opening hero inspired by the freight-axis composition:
 * one single looping aerial Ghanaian highway clip (326 KB landscape / 200 KB portrait)
 * whose vertical center road line splits the mirrored feature blocks, paired with a
 * single 1.6s clipped entrance animation and zero looping UI overhead.
 */
export default function FreightAxisHero() {
  const [orient, setOrient] = useState<"l" | "p">("l");

  useEffect(() => {
    const sync = () => {
      setOrient(window.innerWidth / Math.max(1, window.innerHeight) < 0.8 ? "p" : "l");
    };
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <section
      id="hero"
      data-nav-tone="dark"
      aria-label="Fortitier Logistics — Bulk fuel haulage that works as hard as you do"
      className="ft-axis-hero relative min-h-[100svh] w-full overflow-hidden bg-[#0a0603] text-[#FBF7F2] sm:h-[100svh] sm:min-h-[620px]"
    >
      {/* Crisp 1080p60 seamlessly looping aerial highway video (pure 90-deg top-down tracking, zero jump cuts) */}
      <video
        key={orient}
        src={orient === "p" ? "/film/hero-axis-mobile.mp4?v=2" : "/film/hero-axis-hd.mp4?v=2"}
        poster={orient === "p" ? "/film/hero-axis-mobile.jpg?v=2" : "/film/hero-axis-hd.jpg?v=2"}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-label="Aerial view of a Fortitier fuel tanker moving along a lit Ghanaian highway at night"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Measured subtle vertical legibility tint matching the freight-axis scrim */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,4,2,0.52) 0%, rgba(8,4,2,0.28) 18%, rgba(8,4,2,0.16) 38%, rgba(8,4,2,0.22) 58%, rgba(8,4,2,0.46) 80%, rgba(8,4,2,0.72) 100%)",
        }}
      />

      {/* Axis-centered stage */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-between gap-6 px-5 pb-8 pt-20 sm:h-full sm:gap-0 sm:px-10 sm:pb-10 sm:pt-24 lg:px-14 lg:pb-11 lg:pt-24">
        {/* Top Axis Header: 4 Stacked Clipped Display Lines */}
        <div className="flex flex-col items-center text-center">
          <h1
            className="flex flex-col items-center font-wide font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#FBF7F2] drop-shadow-[0_15px_36px_rgba(0,0,0,0.55)]"
            style={{ fontSize: "clamp(2rem, min(10.4vw, 7.2svh), 4.85rem)" }}
          >
            <span className="ft-axis-line ft-axis-l1 block whitespace-nowrap">Haulage</span>
            <span className="ft-axis-line ft-axis-l2 block whitespace-nowrap">That Works</span>
            <span className="ft-axis-line ft-axis-l3 block whitespace-nowrap">As Hard As</span>
            <span className="ft-axis-line ft-axis-l4 block whitespace-nowrap text-[#FBCF6A]">You Do.</span>
          </h1>
        </div>

        {/* Center-Lower Axis Composition: Feature Blocks (centered on mobile, mirrored on desktop) */}
        <div className="flex flex-col items-center">
          {/* Feature Grid: centered cleanly on mobile, mirrored across the highway axis on sm+ */}
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-[1fr_clamp(96px,15vw,210px)_1fr] sm:items-start sm:gap-0">
            {/* LEFT FEATURE — Centered on mobile, right-aligned on sm+ */}
            <article className="ft-axis-left text-center sm:col-start-1 sm:text-right">
              <svg
                viewBox="0 0 35 34"
                fill="none"
                aria-hidden
                className="mx-auto mb-2 h-[30px] w-[31px] sm:mb-3.5 sm:ml-auto sm:mr-0 sm:h-[36px] sm:w-[37px]"
              >
                <defs>
                  <clipPath id="ft-globe-clip">
                    <circle cx="17.5" cy="17" r="9.8" />
                  </clipPath>
                </defs>
                <circle
                  cx="17.5"
                  cy="17"
                  r="16"
                  stroke="#FBF7F2"
                  strokeWidth="1.8"
                  strokeDasharray="3.6 3"
                />
                <circle cx="17.5" cy="17" r="9.8" fill="#FBF7F2" />
                <g stroke="#140B05" strokeWidth="0.95" clipPath="url(#ft-globe-clip)">
                  <path d="M11.9 7.2 V26.8 M17.5 7.2 V26.8 M23.1 7.2 V26.8" />
                  <path d="M7.7 11.4 H27.3 M7.7 17 H27.3 M7.7 22.6 H27.3" />
                </g>
              </svg>
              <h2 className="font-display text-[16px] font-bold uppercase leading-[1.06] tracking-[-0.01em] text-[#FBF7F2] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-[21px]">
                <span className="block">One point of</span>
                <span className="block">dispatch</span>
              </h2>
              <p className="mx-auto mt-1.5 max-w-[270px] text-[12.5px] leading-[1.42] text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:ml-auto sm:mr-0 sm:mt-2.5 sm:max-w-[295px] sm:text-[13.5px]">
                No chasing ad-hoc tankers. One team manages your entire depot-to-site flow across Ghana.
              </p>
            </article>

            {/* RIGHT FEATURE — Centered on mobile, left-aligned on sm+ */}
            <article className="ft-axis-right text-center sm:col-start-3 sm:text-left">
              <svg
                viewBox="0 0 35 38"
                fill="none"
                aria-hidden
                className="mx-auto mb-2 h-[32px] w-[30px] sm:mb-3.5 sm:ml-0 sm:mr-auto sm:h-[38px] sm:w-[35px]"
              >
                <rect x="0.5" y="0.5" width="17" height="9.6" rx="0.6" fill="#FBF7F2" />
                <rect x="10.5" y="13.5" width="13.5" height="10.9" rx="0.6" fill="#FBF7F2" />
                <rect x="17.5" y="28.3" width="17" height="9.7" rx="0.6" fill="#FBF7F2" />
                <g fill="#140B05">
                  {[2.5, 5.6, 8.7, 11.8, 14.9].map((x) => (
                    <g key={`t-${x}`}>
                      <rect x={x} y="2.5" width="1.1" height="1.9" />
                      <rect x={x} y="6.5" width="1.1" height="1.9" />
                    </g>
                  ))}
                  {[12.5, 15.6, 18.7, 21.8].map((x) => (
                    <g key={`m-${x}`}>
                      <rect x={x} y="15.2" width="1.1" height="1.9" />
                      <rect x={x} y="20.4" width="1.1" height="1.9" />
                    </g>
                  ))}
                  {[19.5, 22.6, 25.7, 28.8, 31.9].map((x) => (
                    <g key={`b-${x}`}>
                      <rect x={x} y="30.3" width="1.1" height="1.9" />
                      <rect x={x} y="34.4" width="1.1" height="1.9" />
                    </g>
                  ))}
                </g>
              </svg>
              <h2 className="font-display text-[16px] font-bold uppercase leading-[1.06] tracking-[-0.01em] text-[#FBF7F2] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-[21px]">
                <span className="block">Full litre</span>
                <span className="block">visibility</span>
              </h2>
              <p className="mx-auto mt-1.5 max-w-[270px] text-[12.5px] leading-[1.42] text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:ml-0 sm:mr-auto sm:mt-2.5 sm:max-w-[295px] sm:text-[13.5px]">
                Live GPS on every load and calibrated reconciliation before variance becomes delay.
              </p>
            </article>
          </div>

          {/* Crisp centered action strip below the axis (always visible on mobile & desktop) */}
          <div className="ft-axis-actions mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-7 sm:gap-4">
            <Link
              href={siteConfig.ctaHref}
              className="group inline-flex items-center justify-center gap-2.5 bg-[#DFA040] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#160B03] shadow-[0_8px_28px_rgba(223,160,64,0.3)] transition-colors hover:bg-[#FBCF6A]"
            >
              {siteConfig.ctaLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              href="#story"
              className="hidden items-center justify-center border border-white/25 bg-black/35 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm transition-colors hover:border-[#DFA040] hover:text-[#FBCF6A] sm:inline-flex"
            >
              Explore ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
