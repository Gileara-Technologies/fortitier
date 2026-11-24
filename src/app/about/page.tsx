import type { Metadata } from "next";
import Image from "next/image";
import { aboutContent, audiences, mission, profile } from "@/content/about";
import { siteConfig } from "@/content/site-config";
import PageHero from "@/components/PageHero";
import ContactBand from "@/components/ContactBand";
import { Button } from "@/components/Button";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fortitier Logistics is a Ghanaian bulk fuel haulage company. The name means with strength: safety, reliability and trust.",
  alternates: { canonical: `${siteConfig.url}/about` },
};

export default function AboutPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <main className="-mt-[4.25rem] pt-[4.25rem] bg-[#0c0602]">
        <PageHero
          kicker="About Fortitier"
          title={aboutContent.headline}
          description={aboutContent.intro}
          image="/images/haul/depot-gantry-dusk.webp"
          imageAlt="A Fortitier fuel tanker under the depot loading gantry at dusk, headlights on"
          imagePosition="35% 50%"
          actions={<Button href={siteConfig.ctaHref}>{siteConfig.ctaLabel}</Button>}
        />

        <div className="bg-paper">
          <section className="section-pad">
            <div className="container-page grid gap-12 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                {aboutContent.story.map((para) => (
                  <p key={para.slice(0, 24)} className="max-w-measure text-body-lg text-brown-muted">
                    {para}
                  </p>
                ))}
                <blockquote className="border-l-2 border-gold pl-5">
                  <p className="font-display text-heading-lg text-brown">{aboutContent.nameMeaning}</p>
                </blockquote>
              </div>
              <aside className="lg:col-span-5">
                <div className="card-surface p-6">
                  <p className="font-mono text-label text-bronze">Company</p>
                  <dl className="mt-4 space-y-3 text-body-sm">
                    <div>
                      <dt className="text-brown-soft">Legal name</dt>
                      <dd className="font-medium text-brown">{siteConfig.legalName}</dd>
                    </div>
                    <div>
                      <dt className="text-brown-soft">Office</dt>
                      <dd className="font-medium text-brown">{siteConfig.office}</dd>
                    </div>
                    <div>
                      <dt className="text-brown-soft">Phone</dt>
                      <dd>
                        <a className="link-gold font-medium" href={`tel:${siteConfig.phoneTel}`}>
                          {siteConfig.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-brown-soft">Email</dt>
                      <dd>
                        <a className="link-gold font-medium" href={`mailto:${siteConfig.email}`}>
                          {siteConfig.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-brown-soft">Timezone</dt>
                      <dd className="font-medium text-brown">{siteConfig.timezoneLabel}</dd>
                    </div>
                  </dl>
                  <p className="mt-6 text-body-sm text-brown-muted">{aboutContent.groupNote}</p>
                </div>
              </aside>
            </div>
          </section>

          <section className="relative isolate overflow-hidden bg-black text-paper" aria-labelledby="mission-title">
            <Image src="/images/haul/aerial-savanna-highway.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-80" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/30" aria-hidden />
            <div className="container-page py-20 lg:py-28">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#dfa040]">Mission</p>
              <h2 id="mission-title" className="mt-4 max-w-3xl font-wide text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold uppercase leading-[1.02] text-[#f4ecdf]">
                {profile.positioning}
              </h2>
              <p className="mt-4 max-w-2xl text-body-lg text-paper/75">
                Move petroleum products across Ghana with strength, so customers can trust that product left the depot, travelled safely and arrived complete and on schedule.
              </p>
              <ol className="mt-12 grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-5">
                {mission.map((m, i) => (
                  <li key={m.title} className="bg-black/55 p-6 backdrop-blur-md">
                    <p className="font-mono text-[10.5px] tracking-[0.2em] text-[#dfa040]">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-5 font-display text-heading-md font-semibold text-paper">{m.title}</h3>
                    <p className="mt-2 text-body-sm text-paper/70">{m.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="section-pad" aria-labelledby="serve-title">
            <div className="container-page">
              <p className="font-mono text-label-lg text-bronze">Who we serve</p>
              <h2 id="serve-title" className="mt-3 max-w-3xl font-display text-display-md text-brown text-balance-pretty">
                Customers who already own or market the fuel.
              </h2>
              <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {audiences.map((a) => (
                  <li key={a.id} className="border-t-2 border-gold pt-4">
                    <h3 className="font-display text-heading-md text-brown">{a.title}</h3>
                    <p className="mt-2 text-body-sm text-brown-muted">{a.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section-pad border-t border-outline-variant bg-paper-warm" aria-labelledby="pillars-title">
            <div className="container-page">
              <h2 id="pillars-title" className="font-display text-display-md text-brown">
                How we operate
              </h2>
              <dl className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
                {aboutContent.pillars.map((p) => (
                  <div key={p.title} className="border-t-2 border-gold pt-4">
                    <dt className="font-display text-heading-md text-brown">{p.title}</dt>
                    <dd className="mt-2 max-w-measure text-body text-brown-muted">{p.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="section-pad" aria-labelledby="not-title">
            <div className="container-page max-w-3xl">
              <h2 id="not-title" className="font-display text-display-md text-brown">
                What Fortitier is not
              </h2>
              <ul className="mt-6 space-y-3">
                {aboutContent.notList.map((item) => (
                  <li key={item} className="border-l-2 border-outline pl-4 text-body text-brown-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <ContactBand />
      </main>
    </>
  );
}