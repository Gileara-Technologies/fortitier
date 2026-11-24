import { Button } from "@/components/Button";
import { siteConfig } from "@/content/site-config";

export default function NotFound() {
  return (
    <main className="container-page section-pad">
      <p className="font-mono text-label text-bronze">404</p>
      <h1 className="mt-3 font-display text-display-md text-brown">Page not found</h1>
      <p className="mt-3 max-w-measure text-body text-brown-muted">
        That route is not on the Fortitier site. Head home or request haulage directly.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Home</Button>
        <Button href={siteConfig.ctaHref} variant="secondary">
          {siteConfig.ctaLabel}
        </Button>
      </div>
    </main>
  );
}
