import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/content/site-config";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/jsonld";
import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request bulk fuel haulage from Fortitier Logistics. Share product, corridor, and cadence. Accra office, Ghana business hours.",
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ]);
  const org = organizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <main className="-mt-[4.25rem] pt-[4.25rem] bg-[#0c0602]">
        <PageHero
          kicker="Contact"
          title={siteConfig.ctaLabel}
          description={`Tell us who you are, what product moves and which corridor. We respond on phone or email during ${siteConfig.businessHours}.`}
          image="/images/haul/tail-lights-night-road.webp"
          imageAlt="A Fortitier tanker driving away down a long highway at night"
          imagePosition="50% 60%"
          size="md"
        />
        <div className="bg-paper">

        <section className="section-pad bg-paper">
          <div className="container-page grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="card-surface p-6 md:p-8">
                <h2 className="font-display text-heading-lg text-brown">Haulage request</h2>
                <p className="mt-2 text-body-sm text-brown-muted">
                  Fields marked * are required.
                </p>
                <div className="mt-6" id="request">
                  <Suspense fallback={<p className="text-body-sm text-brown-muted">Loading form…</p>}>
                    <ContactForm />
                  </Suspense>
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-5">
              <div className="card-surface p-6">
                <h2 className="font-display text-heading-md text-brown">Direct lines</h2>
                <ul className="mt-5 space-y-4">
                  <li className="flex gap-3">
                    <LuPhone className="mt-0.5 h-5 w-5 shrink-0 text-bronze" aria-hidden />
                    <div>
                      <p className="text-body-sm text-brown-soft">Phone</p>
                      <a
                        href={`tel:${siteConfig.phoneTel}`}
                        className="font-medium text-brown transition-colors hover:text-bronze"
                      >
                        {siteConfig.phone}
                      </a>
                      <p className="mt-1 font-mono text-label text-brown-soft">Temporary number</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <LuMail className="mt-0.5 h-5 w-5 shrink-0 text-bronze" aria-hidden />
                    <div>
                      <p className="text-body-sm text-brown-soft">Email</p>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="font-medium text-brown transition-colors hover:text-bronze"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <LuMapPin className="mt-0.5 h-5 w-5 shrink-0 text-bronze" aria-hidden />
                    <div>
                      <p className="text-body-sm text-brown-soft">Office</p>
                      <p className="font-medium text-brown">{siteConfig.office}</p>
                      <p className="mt-1 text-body-sm text-brown-muted">
                        {siteConfig.timezoneLabel}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-bronze/25 bg-gold-soft/40 p-6">
                <p className="font-display text-body font-semibold text-brown">
                  What to have ready
                </p>
                <ul className="mt-3 space-y-2 text-body-sm text-brown-muted">
                  <li>Product: petrol, diesel, or gasoil</li>
                  <li>Origin depot and destination corridor</li>
                  <li>Volume cadence (per week / month)</li>
                  <li>Whether you need contract / dedicated capacity</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
        </div>
      </main>
    </>
  );
}
