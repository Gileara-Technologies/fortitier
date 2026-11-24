"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { primaryNav } from "@/content/nav";
import { siteConfig } from "@/content/site-config";
import { cn } from "@/lib/cn";
import BrandLockup from "@/components/BrandLockup";
import FilmReel, { type FilmBus, type ReelHandle, type ReelState } from "./FilmReel";
import ScrambleText from "./ScrambleText";
import { FilmFX, LogoBurst, MapOverlay, RigLabels, useFrameLoop } from "./overlays";
import { Soundscape } from "./soundscape";
import { SCENES, STARTS, TOTAL_SECONDS, filmAt, sceneSeconds } from "./story";

/* --------------------------------------------------------------- header */

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[75] flex flex-col justify-between bg-[#050404]/95 px-5 pb-8 pt-28 backdrop-blur-xl transition-opacity duration-500 sm:px-10",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <nav aria-label="Primary">
        <ol className="space-y-1">
          {primaryNav.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={onClose}
                className="group flex items-baseline gap-5 py-1 font-wide text-[clamp(2rem,6vw,4.6rem)] uppercase leading-[1.05] tracking-tight text-[#efe6d6] transition-colors hover:text-[#fbcf6a]"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/35">0{i + 1}</span>
                {l.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <div className="grid gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 sm:grid-cols-3">
        <a href={`tel:${siteConfig.phoneTel}`} tabIndex={open ? 0 : -1} className="hover:text-white">
          {siteConfig.phone}
        </a>
        <a href={`mailto:${siteConfig.email}`} tabIndex={open ? 0 : -1} className="hover:text-white">
          {siteConfig.email}
        </a>
        <span>{siteConfig.office}</span>
      </div>
    </div>
  );
}

/** The landing header: the real logo, the main pages, the phone line and the one call to action. */
function TopBar({ menu, onMenu }: { menu: boolean; onMenu: () => void }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = primaryNav.filter((l) => l.href !== "/");
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[76] border-b transition-[background-color,border-color] duration-300",
        solid || menu ? "border-white/10 bg-[#070504]/85 backdrop-blur-md" : "border-transparent bg-gradient-to-b from-black/55 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.75rem]">
        <Link
          href="/"
          aria-label="Fortitier Logistics, home"
          className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <BrandLockup tone="dark" priority className="max-sm:hidden" />
          <BrandLockup tone="dark" size="sm" priority className="sm:hidden" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75 transition-colors hover:text-[#fbcf6a]"
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="hidden font-mono text-[11px] tracking-[0.16em] text-white/70 transition-colors hover:text-white xl:inline"
          >
            {siteConfig.phone}
          </a>
          <Link
            href={siteConfig.ctaHref}
            className="hidden bg-[#dfa040] px-4 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.24em] text-[#160b03] transition-colors hover:bg-[#fbcf6a] sm:inline-block"
          >
            {siteConfig.ctaLabel}
          </Link>
          <button
            type="button"
            onClick={onMenu}
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#efe6d6] lg:hidden"
          >
            <span className="relative block h-2.5 w-6" aria-hidden>
              <span className={cn("absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300", menu ? "translate-y-[5px] rotate-45" : "")} />
              <span className={cn("absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300", menu ? "-translate-y-[4px] -rotate-45" : "")} />
            </span>
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- controls */

function SoundToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Mute sound" : "Turn sound on"}
      className="group flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-white"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("w-[2px] origin-bottom bg-current", on ? "cine-eq" : "")}
            style={{ height: on ? "100%" : "25%", animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </span>
      <span className="max-sm:sr-only">Sound {on ? "on" : "off"}</span>
    </button>
  );
}

function PlayPause({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? "Play the film" : "Pause the film"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white/60 hover:text-white"
    >
      {paused ? (
        <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3" aria-hidden>
          <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          <rect x="2" y="1" width="2.6" height="10" fill="currentColor" />
          <rect x="7.4" y="1" width="2.6" height="10" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

/** Six segments that fill as each scene plays; click one to jump to it. */
function SceneBar({ bus, current, onJump }: { bus: React.MutableRefObject<FilmBus>; current: number; onJump: (i: number) => void }) {
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  useFrameLoop(() => {
    const T = bus.current.p * TOTAL_SECONDS;
    SCENES.forEach((s, i) => {
      const el = fills.current[i];
      if (!el) return;
      const k = Math.min(1, Math.max(0, (T - STARTS[i]) / sceneSeconds(s)));
      const v = `scaleX(${k.toFixed(4)})`;
      if (el.style.transform !== v) el.style.transform = v;
    });
  });
  return (
    <nav aria-label="Film scenes" className="w-full">
      <ol className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
        {SCENES.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onJump(i)}
              aria-current={i === current ? "step" : undefined}
              aria-label={`Scene ${s.index}: ${s.title}`}
              className="group block w-full pb-1 pt-3 text-left"
            >
              <span
                className={cn(
                  "mb-2 hidden truncate font-mono text-[9.5px] uppercase tracking-[0.24em] transition-colors md:block",
                  i === current ? "text-[#fbcf6a]" : "text-white/40 group-hover:text-white/80",
                )}
              >
                {s.index} {s.kicker.split("·")[0].trim()}
              </span>
              <span className="relative block h-[2px] overflow-hidden bg-white/18">
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left bg-[#dfa040]"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* --------------------------------------------------------------- copy */

function SceneCopy({ idx }: { idx: number }) {
  const s = SCENES[idx];
  const words = s.title.split(" ");
  const illustrative = s.id === "load" || s.id === "standard";
  const showFacts = s.facts.length > 0 && s.id !== "ignition";
  return (
    <div key={s.id} className="max-w-[36rem]">
      <ScrambleText
        text={`${s.index} — ${s.kicker}`}
        run
        duration={650}
        className="block font-mono text-[10.5px] uppercase tracking-[0.3em] text-[#dfa040]"
      />
      <p className="mt-4 font-wide text-[clamp(2.1rem,4.6vw,4.6rem)] font-semibold uppercase leading-[0.98] tracking-[-0.01em] text-[#f4ecdf]">
        <span className="sr-only">{s.title}</span>
        <span aria-hidden>
          {words.map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              {/* The space sits outside the clipping mask, where it cannot collapse. */}
              <span className="cine-word">
                <span style={{ animationDelay: `${120 + i * 70}ms` }}>{w}</span>
              </span>{" "}
            </Fragment>
          ))}
        </span>
      </p>
      <p className="cine-fade mt-4 max-w-[28rem] text-[15px] leading-relaxed text-white/72 sm:text-base" style={{ animationDelay: "380ms" }}>
        {s.body}
      </p>
      {showFacts ? (
        <dl className="cine-fade mt-6 hidden w-full max-w-[24rem] font-mono text-[10.5px] uppercase tracking-[0.16em] sm:block" style={{ animationDelay: "700ms" }}>
          {s.facts.map((f) => (
            <div key={f.k} className="flex items-baseline gap-3 border-t border-white/10 py-2">
              <dt className="whitespace-nowrap text-white/45">{f.k}</dt>
              <span className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-white/15" aria-hidden />
              <dd className="whitespace-nowrap text-[#f3e6cf]">{f.v}</dd>
            </div>
          ))}
          {illustrative ? <p className="border-t border-white/10 pt-2 text-[9.5px] tracking-[0.2em] text-white/35">Illustrative load · simulation</p> : null}
        </dl>
      ) : null}
      {idx === 0 || s.id === "arrival" ? (
        <div className="cine-fade mt-7 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "560ms" }}>
          <Link
            href={siteConfig.ctaHref}
            className="group inline-flex items-center justify-center gap-3 bg-[#dfa040] px-7 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#160b03] transition-colors hover:bg-[#fbcf6a]"
          >
            {siteConfig.ctaLabel}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href={idx === 0 ? "#story" : `tel:${siteConfig.phoneTel}`}
            className="inline-flex items-center justify-center border border-white/30 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/85 transition-colors hover:border-white/70 hover:text-white"
          >
            {idx === 0 ? "Scroll story ↓" : `Call ${siteConfig.phone}`}
          </a>
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------- still hero */

const STILL_STRIP = [1, 3, 4] as const;
const TRUST = ["NPA-aligned operations", "GPS on every load", "Insured, calibrated tankers", "Nationwide routes"];

/**
 * Shown when the device will not autoplay video (Low Power Mode, data saver, a browser setting)
 * or the film fails to load: a composed hero on the sharp 2K keyframes, with everything a visitor
 * needs, and a way to start the film by hand.
 */
function StillHero({ canPlay, onPlay, embedded = false }: { canPlay: boolean; onPlay: (scene: number) => void; embedded?: boolean }) {
  const hero = SCENES[0];
  const Heading = embedded ? "h2" : "h1";
  return (
    <div className="relative z-[12] min-h-[100svh]">
      <Image
        src={hero.still}
        alt="A Fortitier fuel tanker under the depot loading gantry at dusk"
        fill
        priority={!embedded}
        sizes="100vw"
        className="object-cover object-[30%_50%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" aria-hidden />

      <div className={cn("relative mx-auto flex min-h-[100svh] max-w-[96rem] flex-col justify-end gap-10 px-5 pb-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:pb-14", embedded ? "pt-36 sm:pt-36" : "pt-28")}>
        <div className="max-w-[40rem]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.3em] text-[#dfa040]">{hero.kicker}</p>
          <Heading className="mt-4 font-wide text-[clamp(2.3rem,5vw,4.8rem)] font-semibold uppercase leading-[0.98] text-[#f4ecdf]">{hero.title}</Heading>
          <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-white/78 sm:text-lg">
            Petrol, diesel and gasoil from the depot to oil marketing companies, filling stations, mines and industry across Ghana. Every trip tracked. Every litre reconciled.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={siteConfig.ctaHref}
              className="inline-flex items-center justify-center gap-3 bg-[#dfa040] px-7 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#160b03] transition-colors hover:bg-[#fbcf6a]"
            >
              {siteConfig.ctaLabel} <span aria-hidden>→</span>
            </Link>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="inline-flex items-center justify-center border border-white/30 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/85 transition-colors hover:border-white/70 hover:text-white"
            >
              Call {siteConfig.phone}
            </a>
            {canPlay ? (
              <button
                type="button"
                onClick={() => onPlay(0)}
                className="group inline-flex items-center justify-center gap-3 px-2 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/80 transition-colors hover:text-[#fbcf6a]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
                  <svg viewBox="0 0 12 12" className="ml-0.5 h-2.5 w-2.5" aria-hidden>
                    <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
                  </svg>
                </span>
                Play the film
              </button>
            ) : null}
          </div>
          <ul className="mt-9 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-3 border-t border-white/12 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65 sm:grid-cols-4 sm:gap-x-4">
            {TRUST.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-[5px] h-1 w-1 shrink-0 rotate-45 bg-[#dfa040]" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <ol className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[30rem]">
          {STILL_STRIP.map((i) => {
            const s = SCENES[i];
            const Tag = canPlay ? "button" : "div";
            return (
              <li key={s.id}>
                <Tag
                  {...(canPlay ? { type: "button" as const, onClick: () => onPlay(i), "aria-label": `Play from scene ${s.index}: ${s.title}` } : {})}
                  className="group block w-full text-left"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden border border-white/15">
                    <Image src={s.still} alt="" fill sizes="(min-width:1024px) 10rem, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
                  </span>
                  <span className="mt-2 block font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/55 group-hover:text-[#fbcf6a]">
                    {s.index} {s.kicker.split("·")[0].trim()}
                  </span>
                </Tag>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- main */

/**
 * The landing hero: the film plays on its own as soon as the page opens (motion first), with its
 * copy, map, callouts and logo timed to the footage. Visitors can pause it or jump between scenes.
 */
export default function Cinema({ embedded = false, hideHeader = false }: { embedded?: boolean; hideHeader?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const reel = useRef<ReelHandle>(null);
  const bus = useRef<FilmBus>({ p: 0, box: { x: 0, y: 0, w: 0, h: 0 } });
  const audio = useRef<Soundscape | null>(null);
  const [state, setState] = useState<ReelState>("loading");
  const [scene, setScene] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [menu, setMenu] = useState(false);
  const visible = useRef(!embedded);
  const still = state === "blocked" || state === "error";

  const onScene = useCallback((i: number) => {
    setScene((c) => {
      if (c !== i) audio.current?.whoosh();
      return i;
    });
  }, []);

  // Pause when the film is off screen or the tab is hidden; start/resume smoothly when scrolled into view.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const sync = () => {
      const on = visible.current && document.visibilityState === "visible";
      if (!on) {
        reel.current?.pause();
      } else if (!userPaused && state !== "blocked" && state !== "error") {
        void reel.current?.play();
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio > 0.15;
        sync();
      },
      { threshold: [0, 0.15, 0.5] },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [userPaused, state]);

  // Engine note follows the film.
  useFrameLoop(() => {
    if (sound) audio.current?.setSpeed(filmAt(bus.current.p).kmh);
  });

  const togglePause = () => {
    if (userPaused) {
      setUserPaused(false);
      void reel.current?.play();
    } else {
      setUserPaused(true);
      reel.current?.pause();
    }
  };

  const toggleSound = () => {
    if (!audio.current) audio.current = new Soundscape();
    if (sound) audio.current.stop();
    else {
      audio.current.start();
      audio.current.setSpeed(filmAt(bus.current.p).kmh);
    }
    setSound((s) => !s);
  };
  useEffect(() => () => audio.current?.dispose(), []);

  const jump = (i: number) => {
    reel.current?.jump(i);
    audio.current?.tick();
  };

  const playFromStill = async (i: number) => {
    const r = reel.current;
    if (!r) return;
    if (i > 0) r.jump(i);
    setUserPaused(false);
    await r.play();
  };

  const closeMenu = useCallback(() => setMenu(false), []);

  return (
    <>
      {embedded || hideHeader ? null : (
        <>
          <TopBar menu={menu} onMenu={() => setMenu((m) => !m)} />
          <Menu open={menu} onClose={closeMenu} />
        </>
      )}

      <section
        ref={section}
        id={embedded ? "night-haul-film" : "film"}
        data-nav-tone="dark"
        aria-label="Fortitier: one night haul, in six scenes"
        className={cn(
          "relative overflow-hidden bg-[#050302] text-white",
          embedded ? "scroll-mt-16 border-y border-white/10" : "",
          still ? "min-h-[100svh]" : embedded ? "h-[92svh] min-h-[580px]" : "h-[100svh] min-h-[600px]",
        )}
      >
        {embedded ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/80 via-black/35 to-transparent pb-10 pt-20 sm:pt-24">
            <div className="mx-auto flex max-w-[96rem] items-center justify-between px-5 sm:px-8">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rotate-45 bg-[#dfa040]" aria-hidden />
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#fbcf6a]">
                  The Night Haul · Six-Scene Dispatch Film
                </p>
              </div>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:block">
                Tema → Nationwide · Click any chapter below
              </p>
            </div>
          </div>
        ) : null}

        {/* Accessible outline of the whole film */}
        <ol className="sr-only">
          {SCENES.map((s) => (
            <li key={s.id}>
              <p>{s.kicker}</p>
              <p>{s.title}</p>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="absolute inset-0" role="img" aria-label="Film: a Fortitier fuel tanker leaves the depot at dusk and drives through the Ghanaian night">
          <FilmReel ref={reel} bus={bus} onState={setState} onScene={onScene} autoStart={!embedded} />
        </div>

        {still ? (
          <StillHero canPlay={state === "blocked"} onPlay={playFromStill} embedded={embedded} />
        ) : (
          <>
            {embedded ? (
              <h2 className="sr-only">Night Haul: bulk fuel haulage across Ghana in six scenes.</h2>
            ) : (
              <h1 className="sr-only">Fortitier Logistics: bulk fuel haulage across Ghana. Safe, accountable, on time.</h1>
            )}
            <MapOverlay bus={bus} />
            <RigLabels bus={bus} />
            <LogoBurst bus={bus} />
            <FilmFX bus={bus} />

            {/* legibility */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[10] w-full bg-gradient-to-r from-black/60 via-black/20 to-transparent sm:w-[62%]" aria-hidden />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[10] h-[55%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" aria-hidden />

            <div className="absolute inset-x-0 bottom-0 z-30">
              <div className="mx-auto max-w-[96rem] px-5 sm:px-8">
                <SceneCopy idx={scene} />
                <div className="mt-8 flex items-end gap-4 pb-5 sm:mt-10 sm:gap-6 sm:pb-7">
                  <SceneBar bus={bus} current={scene} onJump={jump} />
                  <div className="flex shrink-0 items-center gap-4 pb-0.5">
                    <PlayPause paused={userPaused} onToggle={togglePause} />
                    <SoundToggle on={sound} onToggle={toggleSound} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
