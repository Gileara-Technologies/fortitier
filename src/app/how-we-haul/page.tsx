import type { Metadata } from "next";
import { aboutContent, customerAsks, exceptions } from "@/content/about";
import { scenarios } from "@/content/scenarios";
import { siteConfig } from "@/content/site-config";
import { StatusChip } from "@/components/StatusChip";
import MethodSteps from "@/components/haul/MethodSteps";
import PageHero from "@/components/PageHero";
import ContactBand from "@/components/ContactBand";
import { Button } from "@/components/Button";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "How we haul",
  description:
    "The Fortitier operating method: load, track, deliver, reconcile, with safety and product accountability on every trip.",
  alternates: { canonical: `${siteConfig.url}/how-we-haul` },
};

export default function HowWeHaulPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "How we haul", href: "/how-we-haul" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <main className="-mt-[4.25rem] pt-[4.25rem] bg-[#0c0602]">
        <PageHero
          kicker="How we haul"
          title="An operating method, not a slogan."
          description="Petroleum moves carefully. The chain is simple on purpose: figures recorded at loading, the trip visible throughout, delivery confirmed, differences reconciled."
          image="/images/haul/loading-arm-hatch.webp"
          imageAlt="A loading arm connected to the top hatch of a fuel tanker under the depot gantry, a worker in reflective overalls on the walkway"
          imagePosition="58% 40%"
          actions={
            <>
              <Button href={siteConfig.ctaHref}>{siteConfig.ctaLabel}</Button>
              <Button
                href="/services"
                variant="secondary"
                className="border-paper/30 bg-black/30 text-paper hover:border-gold hover:bg-black/50 hover:text-gold-light"
              >
                Services
              </Button>
            </>
          }
        />

        <MethodSteps />

        <div className="bg-paper">
          <section className="section-pad" aria-labelledby="safety-title">
            <div className="container-page grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="font-mono text-label-lg text-bronze">Safety and compliance</p>
                <h2 id="safety-title" className="mt-3 font-display text-display-md text-brown text-balance-pretty">
                  The safe way is the only way we run.
                </h2>
                <p className="mt-4 max-w-md text-body-lg text-brown-muted">
                  Trained drivers and mates. Insured, calibrated tankers. Procedures aligned with National Petroleum
                  Authority expectations for moving bulk petroleum. Licences and permits are shared through the
                  commercial process, never invented on a website.
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                {aboutContent.pillars.map((p) => (
                  <li key={p.title} className="card-surface p-5">
                    <h3 className="font-display text-heading-md text-brown">{p.title}</h3>
                    <p className="mt-2 text-body-sm text-brown-muted">{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section-pad border-t border-outline-variant bg-paper-warm" aria-labelledby="exceptions-title">
            <div className="container-page">
              <p className="font-mono text-label-lg text-bronze">When it does not go to plan</p>
              <h2 id="exceptions-title" className="mt-3 max-w-3xl font-display text-display-md text-brown text-balance-pretty">
                Roads are roads. Here is what we do about it.
              </h2>
              <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
                {exceptions.map((e) => (
                  <div key={e.title} className="border-t-2 border-gold pt-4">
                    <dt className="font-display text-heading-md text-brown">{e.title}</dt>
                    <dd className="mt-2 max-w-measure text-body text-brown-muted">{e.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="section-pad" aria-labelledby="ask-title">
            <div className="container-page grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="font-mono text-label-lg text-bronze">Working with us</p>
                <h2 id="ask-title" className="mt-3 font-display text-display-md text-brown text-balance-pretty">
                  What we need from you to plan a lane.
                </h2>
              </div>
              <ol className="space-y-3 lg:col-span-7">
                {customerAsks.map((a, i) => (
                  <li key={a} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 border-b border-outline-variant pb-3">
                    <span className="font-mono text-label text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-body-lg text-brown">{a}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="section-pad border-t border-outline-variant bg-paper-warm" aria-labelledby="lanes-title">
            <div className="container-page">
              <h2 id="lanes-title" className="font-display text-display-md text-brown">
                Example lanes
              </h2>
              <p className="mt-3 max-w-measure text-body text-brown-muted">
                Labeled scenarios only. No invented on-time rates or shortage percentages.
              </p>
              <ul className="mt-8 grid gap-4 lg:grid-cols-3">
                {scenarios.map((s) => (
                  <li key={s.id} className="card-surface p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-label text-bronze">{s.corridor}</p>
                      <StatusChip status={s.status} />
                    </div>
                    <h3 className="mt-3 font-display text-heading-md text-brown">{s.title}</h3>
                    <p className="mt-2 text-body-sm text-brown-muted">{s.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <ContactBand
          title="Put a corridor in front of dispatch."
          body="Share product, route and cadence. We will tell you plainly whether we can cover the lane."
        />
      </main>
    </>
  );
}
