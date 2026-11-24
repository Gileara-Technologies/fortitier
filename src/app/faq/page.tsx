import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { siteConfig } from "@/content/site-config";
import FaqAccordion from "@/components/FaqAccordion";
import ContactBand from "@/components/ContactBand";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on bulk fuel haulage in Ghana: products, routes, GPS tracking, shortages, NPA alignment, and how to request haulage.",
  alternates: { canonical: `${siteConfig.url}/faq` },
};

export default function FaqPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "FAQ", href: "/faq" },
  ]);
  const faqLd = faqPageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <main>
        <section className="border-b border-outline-variant bg-warm-paper section-pad-tight">
          <div className="container-page">
            <p className="font-mono text-label-lg text-bronze">FAQ</p>
            <h1 className="mt-3 max-w-3xl font-display text-display-lg text-brown text-balance-pretty">
              Logistics questions, plain answers
            </h1>
            <p className="mt-4 max-w-measure text-body-lg text-brown-muted">
              Products, customers, coverage, tracking, shortages, compliance, and how to request haulage.
            </p>
          </div>
        </section>

        <section className="section-pad bg-paper">
          <div className="container-page max-w-3xl">
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <ContactBand
          title="Still need a human answer?"
          body="Call dispatch or send the haulage form. We respond during Ghana business hours."
        />
      </main>
    </>
  );
}
