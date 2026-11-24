import type { Metadata } from "next";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site-config";
import { ServiceIcon } from "@/components/ServiceIcon";
import { StatusChip } from "@/components/StatusChip";
import PageHero from "@/components/PageHero";
import ContactBand from "@/components/ContactBand";
import { Button } from "@/components/Button";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Bulk fuel haulage, OMC contract lanes, GPS tracking, product accountability and safety-aligned operations across Ghana.",
  alternates: { canonical: `${siteConfig.url}/services` },
};

export default function ServicesPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <main className="-mt-[4.25rem] pt-[4.25rem] bg-[#0c0602]">
        <PageHero
          kicker="Services"
          title="Five services. One standard."
          description="Bulk haulage, contract capacity, GPS tracking, product accountability and safety run today, under the same standard. Fleet management for truck owners is on the roadmap, and labeled that way."
          image="/images/haul/tanker-studio.webp"
          imageAlt="A polished stainless-steel fuel tanker truck lit in a dark studio"
          imagePosition="62% 50%"
          actions={<Button href={siteConfig.ctaHref}>{siteConfig.ctaLabel}</Button>}
        />

        <div className="bg-paper">
          <section className="section-pad">
            <div className="container-page space-y-6">
              {services.map((service) => (
                <article
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-28 grid gap-8 rounded-lg border border-outline-variant bg-paper p-6 shadow-card md:p-9 lg:grid-cols-[1.1fr_1fr]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-gold-soft/70">
                        <ServiceIcon name={service.icon} className="h-6 w-6" />
                      </span>
                      <p className="font-mono text-label text-bronze">{service.number}</p>
                      <StatusChip status={service.status} />
                    </div>
                    <h2 className="mt-4 font-display text-display-md text-brown text-balance-pretty">
                      {service.title}
                    </h2>
                    <p className="mt-2 font-display text-heading-md font-semibold text-bronze">{service.tagline}</p>
                    <p className="mt-4 max-w-measure text-body-lg text-brown-muted">{service.summary}</p>
                    <p className="mt-5 border-l-2 border-gold pl-4 text-body font-medium text-brown">
                      {service.outcome}
                    </p>
                    {service.status === "roadmap" ? (
                      <p className="mt-6 rounded-md border border-outline bg-surface-variant/60 px-4 py-3 text-body-sm text-brown-muted">
                        Not sold as day-one capacity. Mention it on the request form and we will tell you when owner fleet
                        management opens.
                      </p>
                    ) : (
                      <div className="mt-6">
                        <Button href={siteConfig.ctaHref} size="sm">
                          {siteConfig.ctaLabel}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 rounded-lg bg-paper-warm p-5 sm:p-6">
                    <div>
                      <h3 className="font-display text-body font-semibold text-brown">How it works</h3>
                      <ol className="mt-3 space-y-3">
                        {service.how.map((step, i) => (
                          <li key={step} className="grid grid-cols-[1.75rem_1fr] gap-2 text-body-sm text-brown-muted">
                            <span className="font-mono text-label text-bronze">{String(i + 1).padStart(2, "0")}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-display text-body font-semibold text-brown">Included</h3>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {service.included.map((item) => (
                          <li
                            key={item}
                            className="rounded-sm border border-outline-variant bg-paper px-2.5 py-1 text-label text-brown-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-display text-body font-semibold text-brown">Built for</h3>
                      <p className="mt-2 text-body-sm text-brown-muted">{service.icpFit.join(" · ")}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <ContactBand />
      </main>
    </>
  );
}
