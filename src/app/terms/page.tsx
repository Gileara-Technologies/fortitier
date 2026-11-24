import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Terms",
  description: `Website terms for ${siteConfig.tradingName}. Haulage contracts are separate written agreements.`,
  alternates: { canonical: `${siteConfig.url}/terms` },
};

const sections = [
  {
    title: "Website use",
    body: `This website is provided by ${siteConfig.legalName} for information about bulk fuel haulage services in Ghana. By using the site you agree to these terms.`,
  },
  {
    title: "No haulage contract from browsing",
    body: "Content on this site does not form a haulage contract, rate card, or service level commitment. Commercial terms are set only in written agreements between Fortitier and the customer.",
  },
  {
    title: "Accuracy",
    body: "We aim to keep service descriptions current. Features marked roadmap are not available as day-one capacity. We may update pages without notice.",
  },
  {
    title: "Intellectual property",
    body: "Fortitier name, logo, and site content are owned by Fortitier or its licensors. Do not copy branding or reuse materials without permission.",
  },
  {
    title: "Acceptable use",
    body: "Do not misuse the site: no scraping that degrades service, no submission of malicious content through forms, no attempt to disrupt systems.",
  },
  {
    title: "Liability",
    body: "To the extent permitted by applicable law, Fortitier is not liable for losses arising solely from use of this marketing website. Liability for haulage services is governed by the signed contract for those services.",
  },
  {
    title: "Contact",
    body: `Questions: ${siteConfig.email} · ${siteConfig.phone} · ${siteConfig.office}.`,
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-outline-variant bg-warm-paper section-pad-tight">
        <div className="container-page max-w-3xl">
          <p className="font-mono text-label-lg text-bronze">Legal</p>
          <h1 className="mt-3 font-display text-display-lg text-brown">Website terms</h1>
          <p className="mt-3 text-body text-brown-muted">
            Stub terms for the marketing site. Haulage work runs on separate contracts.
          </p>
        </div>
      </section>
      <section className="section-pad bg-paper">
        <div className="container-page max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-heading-md text-brown">{s.title}</h2>
              <p className="mt-2 text-body text-brown-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
