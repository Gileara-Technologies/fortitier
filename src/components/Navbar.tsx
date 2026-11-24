"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { legalNav, primaryNav } from "@/content/nav";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/Button";
import BrandLockup from "@/components/BrandLockup";
import { cn } from "@/lib/cn";

type NavbarVariant = "default" | "legal";

export default function Navbar({ variant = "default" }: { variant?: NavbarVariant }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const links = variant === "legal" ? legalNav : primaryNav;
  // Over the dark hero on the homepage the bar is transparent with light text.
  const darkHeroRoutes = ["/", "/services", "/how-we-haul", "/about", "/contact"];
  // The homepage is one dark world end to end, so its bar stays dark glass while scrolling.
  const darkPage = pathname === "/";
  const overDark = (darkHeroRoutes.includes(pathname) && !scrolled && !open) || (darkPage && !open);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Close the mobile drawer on client navigations without a setState-in-effect.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }

  // The homepage film draws its own minimal chrome.
  if (pathname === "/") return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200",
        overDark
          ? darkPage && scrolled
            ? "border-white/10 bg-[#060403]/60 backdrop-blur-md"
            : "border-transparent bg-transparent"
          : scrolled || open
            ? "border-outline-variant bg-paper/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-paper/85 backdrop-blur-sm",
      )}
    >
      <nav
        className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]"
        aria-label={variant === "legal" ? "Legal" : "Primary"}
      >
        <Link
          href="/"
          aria-label="Fortitier Logistics, home"
          className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <BrandLockup tone={overDark ? "dark" : "light"} priority />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
                    overDark
                      ? active
                        ? "bg-paper/15 text-paper"
                        : "text-paper/80 hover:bg-paper/10 hover:text-paper"
                      : active
                        ? "bg-surface-variant text-brown"
                        : "text-brown-muted hover:bg-paper-warm hover:text-brown",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className={cn(
              "font-mono text-label-lg transition-colors",
              overDark ? "text-paper/80 hover:text-gold-light" : "text-brown-muted hover:text-bronze",
            )}
          >
            {siteConfig.phone}
          </a>
          <Button href={siteConfig.ctaHref} size="sm">
            {siteConfig.ctaLabel}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className={cn(
              "rounded-md border px-2.5 py-1.5 font-mono text-label",
              overDark ? "border-paper/40 text-paper" : "border-outline-variant text-brown",
            )}
          >
            Call
          </a>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md border",
              overDark ? "border-paper/40 text-paper" : "border-outline-variant text-brown",
            )}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenuAlt3 className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        id={panelId}
        className={cn("border-t border-outline-variant bg-paper lg:hidden", open ? "block" : "hidden")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <ul className="container-page flex flex-col gap-1 py-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-md px-3 py-3 text-body font-medium text-brown hover:bg-paper-warm"
                onClick={close}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Button href={siteConfig.ctaHref} className="w-full" onClick={close}>
              {siteConfig.ctaLabel}
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
