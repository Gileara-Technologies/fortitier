import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy notice for ${siteConfig.tradingName}. How we handle contact form and enquiry data under Ghana's Data Protection Act 2012 (Act 843).`,
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

const sections = [
  {
    title: "Who we are",
    body: `${siteConfig.legalName} ("Fortitier", "we") operates ${siteConfig.domain}. Office: ${siteConfig.office}. Contact: ${siteConfig.email}, ${siteConfig.phone}.`,
  },
  {
    title: "What we collect",
    body: "When you request haulage or contact us, we collect the details you submit: company name, role, segment, product interest, route or corridor, volume cadence, phone, email, and message content. Server logs may include IP address and basic request metadata for security and reliability.",
  },
  {
    title: "Why we collect it",
    body: "We use enquiry data to respond to haulage requests, qualify commercial fit, schedule follow-up, and keep records of customer communications. We do not sell personal data.",
  },
  {
    title: "Legal context (Ghana)",
    body: "Where the Ghana Data Protection Act 2012 (Act 843) applies, we process personal data for legitimate business purposes connected to logistics enquiries and contracts. You may request access, correction, or deletion of personal data we hold about you, subject to legal and operational limits.",
  },
  {
    title: "Sharing",
    body: "We may share enquiry details with operators and staff who need them to respond, and with processors who host email or form infrastructure under contract. We do not run advertising pixels that sell your identity from this marketing site by default.",
  },
  {
    title: "Retention",
    body: "Enquiry records are kept as long as needed to complete the commercial conversation and meet record-keeping needs, then deleted or archived according to internal policy.",
  },
  {
    title: "Your requests",
    body: `To exercise privacy rights or ask a question, email ${siteConfig.email}. We may need to verify your identity before acting on a request.`,
  },
  {
    title: "Updates",
    body: "This notice may be updated as operations and systems change. The page title date reflects the current version on the website.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
        <section className="border-b border-outline-variant bg-warm-paper section-pad-tight">
          <div className="container-page max-w-3xl">
            <p className="font-mono text-label-lg text-bronze">Legal</p>
            <h1 className="mt-3 font-display text-display-lg text-brown">Privacy notice</h1>
            <p className="mt-3 text-body text-brown-muted">
              High-level notice for website and haulage enquiry data. Not a substitute for a full
              Act 843 compliance programme.
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
