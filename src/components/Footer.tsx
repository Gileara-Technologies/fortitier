import Link from "next/link";
import { footerColumns } from "@/content/nav";
import { siteConfig } from "@/content/site-config";
import BrandLockup from "@/components/BrandLockup";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="band-dark border-t border-black/20">
      <div className="container-page section-pad-tight">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label="Fortitier Logistics, home">
              <BrandLockup tone="dark" size="lg" />
            </Link>
            <p className="mt-5 max-w-sm text-body-sm text-paper/75">
              {siteConfig.positioningLine}
            </p>
            <div className="mt-5 space-y-1.5 font-mono text-label text-gold-light/90">
              <p>
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="transition-colors hover:text-gold-light"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-gold-light"
                >
                  {siteConfig.email}
                </a>
              </p>
              <p className="text-paper/60">{siteConfig.office}</p>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="font-display text-body-sm font-semibold text-paper">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.name}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-paper/70 transition-colors hover:text-gold-light"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/10 pt-6 text-body-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}
          </p>
          <p className="font-mono text-label">{siteConfig.timezoneLabel}</p>
        </div>
      </div>
    </footer>
  );
}
