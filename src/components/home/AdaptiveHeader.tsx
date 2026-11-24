"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import BrandLockup from "@/components/BrandLockup";
import { primaryNav } from "@/content/nav";
import { siteConfig } from "@/content/site-config";
import { cn } from "@/lib/cn";

/**
 * Single unified homepage header that smoothly adapts between dark (over the Night Haul
 * cinematic hero, dusk horizon, black manifesto and corridor planner) and light (over the
 * warm-paper scroll story and services overview) by inspecting `[data-nav-tone]` under the bar.
 */
export default function AdaptiveHeader() {
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const syncTone = useCallback(() => {
    setScrolled(window.scrollY > 40);
    const probeY = 36;
    const sections = document.querySelectorAll<HTMLElement>("[data-nav-tone]");
    for (let i = 0; i < sections.length; i++) {
      const el = sections[i];
      const r = el.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        const next = el.dataset.navTone === "light" ? "light" : "dark";
        setTone(next);
        return;
      }
    }
    setTone("dark");
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(syncTone);
    window.addEventListener("scroll", syncTone, { passive: true });
    window.addEventListener("resize", syncTone, { passive: true });
    window.addEventListener("fortitier:nav-tone-change", syncTone);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncTone);
      window.removeEventListener("resize", syncTone);
      window.removeEventListener("fortitier:nav-tone-change", syncTone);
    };
  }, [syncTone]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const links = primaryNav.filter((l) => l.href !== "/");
  const isLight = tone === "light" && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[86] border-b transition-[background-color,border-color,color] duration-300",
          isLight
            ? "border-[#E8DCCC] bg-[#FBF7F2]/90 text-[#3B1902] backdrop-blur-md"
            : scrolled || menuOpen
              ? "border-white/12 bg-[#080402]/90 text-white backdrop-blur-md"
              : "border-transparent bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[96rem] items-center justify-between gap-4 px-4 sm:h-16 sm:px-8 lg:h-[4.5rem]">
          <Link
            href="/"
            aria-label="Fortitier Logistics, home"
            className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <BrandLockup tone={isLight ? "light" : "dark"} priority className="max-sm:hidden" />
            <BrandLockup tone={isLight ? "light" : "dark"} size="sm" priority className="sm:hidden" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-sm px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
                  isLight
                    ? "text-[#5C3A22] hover:text-[#3B1902]"
                    : "text-white/75 hover:text-[#fbcf6a]",
                )}
              >
                {l.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className={cn(
                "hidden font-mono text-[11px] tracking-[0.16em] transition-colors xl:inline",
                isLight ? "text-[#5C3A22] hover:text-[#3B1902]" : "text-white/75 hover:text-[#fbcf6a]",
              )}
            >
              {siteConfig.phone}
            </a>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className={cn(
                "inline-flex h-9 items-center rounded-sm border px-3 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors lg:hidden",
                isLight
                  ? "border-[#3B1902]/25 text-[#3B1902] hover:border-[#AC7023]"
                  : "border-white/25 text-white/90 hover:border-[#dfa040] hover:text-[#fbcf6a]",
              )}
            >
              Call
            </a>
            <Link
              href={siteConfig.ctaHref}
              className={cn(
                "hidden rounded-lg px-4 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] transition-colors sm:inline-flex",
                isLight
                  ? "bg-[#3B1902] text-[#FBF7F2] hover:bg-[#5C3A22]"
                  : "bg-[#dfa040] text-[#160b03] hover:bg-[#fbcf6a]",
              )}
            >
              {siteConfig.ctaLabel}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "inline-flex h-9 items-center gap-2.5 rounded-sm border px-3 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors lg:hidden",
                isLight
                  ? "border-[#3B1902]/25 text-[#3B1902] hover:border-[#AC7023]"
                  : "border-white/20 text-[#f4ecdf] hover:border-[#dfa040]",
              )}
            >
              <span className="relative block h-2.5 w-4" aria-hidden>
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300",
                    menuOpen ? "translate-y-[4.5px] rotate-45" : "",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300",
                    menuOpen ? "-translate-y-[4.5px] -rotate-45" : "",
                  )}
                />
              </span>
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-[85] flex flex-col justify-between bg-[#070402]/95 px-6 pb-8 pt-24 backdrop-blur-xl transition-opacity duration-300 sm:px-10",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav aria-label="Primary">
          <ol className="space-y-2">
            {primaryNav.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
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
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full items-center justify-center gap-3 bg-[#dfa040] px-6 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-[#160b03] transition-colors hover:bg-[#fbcf6a] sm:w-auto"
            >
              {siteConfig.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </nav>

        <div className="grid gap-3 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 sm:grid-cols-3">
          <a href={`tel:${siteConfig.phoneTel}`} tabIndex={menuOpen ? 0 : -1} className="hover:text-[#fbcf6a]">
            {siteConfig.phone}
          </a>
          <a href={`mailto:${siteConfig.email}`} tabIndex={menuOpen ? 0 : -1} className="hover:text-[#fbcf6a]">
            {siteConfig.email}
          </a>
          <span>{siteConfig.office}</span>
        </div>
      </div>
    </>
  );
}
