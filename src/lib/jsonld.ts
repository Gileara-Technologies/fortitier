import { siteConfig } from "@/content/site-config";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: siteConfig.legalName,
    alternateName: siteConfig.tradingName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.positioningLine,
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "24 Yooyi Lane",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    image: `${siteConfig.url}/brand/fortitier-logo.jpeg`,
    logo: `${siteConfig.url}/brand/fortitier-logo-icon.jpg`,
    knowsAbout: [
      "Bulk fuel haulage",
      "Petroleum tanker transport",
      "Diesel haulage",
      "Gasoil transport",
    ],
    makesOffer: services
      .filter((s) => s.status === "available")
      .map((s) => ({
        "@type": "Offer",
        name: s.title,
        description: s.summary,
      })),
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  };
}
