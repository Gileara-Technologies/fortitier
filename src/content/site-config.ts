/**
 * Single source of truth for site-wide contact and brand lines.
 * Phone/email/domain swaps are one edit here.
 */

export const siteConfig = {
  legalName: "Fortitier Logistics Limited",
  tradingName: "Fortitier Logistics",
  shortName: "Fortitier",
  domain: "fortitier.com",
  url: "https://fortitier.com",
  email: "info@fortitier.com",
  /** Temporary until dedicated company number is registered. */
  phone: "+233 54 144 4084",
  phoneTel: "+233541444084",
  office: "24 Yooyi Lane, Accra, Ghana",
  location: "Accra, Ghana",
  country: "Ghana",
  timezone: "Africa/Accra",
  timezoneLabel: "GMT (Accra)",
  businessHours: "Ghana business hours, Monday to Friday",
  positioningLine:
    "Ghanaian bulk fuel haulage — safe, accountable, on time. Every trip tracked. Every litre reconciled.",
  /** Primary CTA verb site-wide. Do not invent alternate contact verbs. */
  ctaLabel: "Request haulage",
  ctaHref: "/contact",
  parentGroup: "AFH Global Holdings Limited",
  nameMeaning:
    'Fortitier is Latin for "with strength" — strong on safety, reliability, and trust.',
  socials: {
    // Publish when official channels exist. Empty values stay hidden in UI.
    linkedin: "",
  },
  seo: {
    titleDefault: "Fortitier Logistics | Bulk Fuel Haulage Ghana",
    titleTemplate: "%s | Fortitier Logistics",
    description:
      "Bulk fuel haulage across Ghana. Petrol, diesel, and gasoil from depot to OMC, station, mine, and industrial site. Safe, accountable, on time.",
    keywords: [
      "bulk fuel haulage Ghana",
      "petroleum tanker transport",
      "diesel haulage OMC",
      "fuel delivery filling stations",
      "mine diesel transport Ghana",
      "gasoil haulage Accra",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
