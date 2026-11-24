import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/Button";

export default function ContactBand({
  title = "Ready to move product with accountability?",
  body = "Tell us the corridor, product, and cadence. Dispatch responds on phone or email during Ghana business hours.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="band-dark" aria-labelledby="contact-band-title">
      <div className="container-page section-pad">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-mono text-label-lg text-gold-light">Next step</p>
            <h2
              id="contact-band-title"
              className="mt-3 max-w-2xl font-display text-display-md text-paper text-balance-pretty"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-measure text-body-lg text-paper/75">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch xl:flex-row">
            <Button href={siteConfig.ctaHref} variant="dark" size="lg">
              {siteConfig.ctaLabel}
            </Button>
            <Button
              href={`tel:${siteConfig.phoneTel}`}
              variant="secondary"
              size="lg"
              className="border-paper/25 bg-transparent text-paper hover:border-gold hover:bg-paper/5 hover:text-gold-light"
            >
              Call {siteConfig.phone}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
