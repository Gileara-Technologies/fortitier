import { siteConfig } from "./site-config";

export interface NavLink {
  name: string;
  href: string;
}

/** Primary marketing nav — keep to one desktop line. */
export const primaryNav: NavLink[] = [
  { name: "Services", href: "/services" },
  { name: "How we haul", href: "/how-we-haul" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export const legalNav: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Contact", href: "/contact" },
];

export const footerColumns = [
  {
    title: "Services",
    links: [
      { name: "All services", href: "/services" },
      { name: "Bulk fuel haulage", href: "/services#bulk-fuel-haulage" },
      { name: "OMC contracts", href: "/services#contract-haulage-omc" },
      { name: "GPS tracking", href: "/services#gps-tracking" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "How we haul", href: "/how-we-haul" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: siteConfig.ctaHref },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
] as const;
