/**
 * Fortitier Logistics — 3D Services Archival Shelf.
 *
 * Implements Leon Vasari's exact 3D cuboid shelf geometry:
 *   ws = H * 142 / 840, d = H * 474 / 900, gap = H * 0.03
 *   B(r) = |r| < 1 ? (r + sin(pi * r) / pi) / 2 : sign(r) * 0.5
 *   F(r) = r * (ws + gap) + (d - ws + 1.6 * gap) * B(r)
 *   openness o = smoothstep(max(0, 1 - |r|))
 *
 * Strictly focused on Fortitier's six official services from src/content/services.ts
 * (no corridors or fuel products mixed in — zero fabricated KPIs, zero teal/cobalt).
 */

export type ShelfCategory = "haulage" | "tracking" | "compliance";

export interface ShelfDossier {
  id: string;
  code: string;
  category: ShelfCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  meta: string;
  tag: string;
  status: "available" | "roadmap";
  summary: string;
  highlights: string[];
  credit: string;
  ctaQuery: string;
  href: string;
  /** Real local Fortitier photography or transparent studio tanker cutout. */
  image: string;
  /** Whether the cover artwork is a transparent studio cutout rendered over obsidian-gold lighting. */
  studio?: boolean;
  /** Focal crop position for photographic covers. */
  objectPosition?: string;
  /** Spine tint palette strictly inside Fortitier's espresso / bronze / charcoal family. */
  spineBg: string;
  spineAccent: string;
}

export const SHELF_TABS: { id: "all" | ShelfCategory; label: string; firstIndex: number }[] = [
  { id: "all", label: "All · 06", firstIndex: 0 },
  { id: "haulage", label: "Haulage", firstIndex: 0 },
  { id: "tracking", label: "Tracking", firstIndex: 2 },
  { id: "compliance", label: "Compliance", firstIndex: 4 },
];

/** Strictly Fortitier Logistics' six official services. */
export const SHELF_DOSSIERS: ShelfDossier[] = [
  {
    id: "bulk-fuel-haulage",
    code: "01",
    category: "haulage",
    categoryLabel: "Core Service · 01",
    title: "Bulk Fuel Haulage",
    subtitle: "PETROL · DIESEL · GASOIL / DEPOT TO SITE",
    meta: "SERVICE 01 / NATIONWIDE GHANA / AVAILABLE",
    tag: "SERVICE 01",
    status: "available",
    summary:
      "Road tanker transport of petroleum product across Ghana — from the loading depot to filling stations, mines and industrial yards, on the day it was promised.",
    highlights: [
      "Petrol, diesel and gasoil across depot-to-site routes",
      "Calibrated multi-compartment tankers and assigned crews",
      "Live GPS visibility closing with delivery confirmation",
    ],
    credit: "Operated by Fortitier Logistics Limited · Accra, Ghana.",
    ctaQuery: "product=mixed",
    href: "/services#bulk-fuel-haulage",
    image: "/images/haul/depot-gantry-dusk.webp",
    objectPosition: "42% 50%",
    spineBg: "#1A0D05",
    spineAccent: "#DFA040",
  },
  {
    id: "contract-haulage-omc",
    code: "02",
    category: "haulage",
    categoryLabel: "Core Service · 02",
    title: "Contract Haulage",
    subtitle: "DEDICATED OMC FLEET / AGREED LANES",
    meta: "SERVICE 02 / OIL MARKETING COMPANIES / AVAILABLE",
    tag: "SERVICE 02",
    status: "available",
    summary:
      "Contracted capacity for oil marketing companies. The same trucks and the same crews, on routes and schedules agreed in advance, so your supply plan rests on capacity you can count on.",
    highlights: [
      "Dedicated calibrated trucks and route-familiar crews",
      "Agreed lanes, volumes and weekly dispatch schedules",
      "Reporting cadence backed by every signed trip record",
    ],
    credit: "Operated by Fortitier Logistics Limited · Accra, Ghana.",
    ctaQuery: "segment=omc&product=mixed",
    href: "/services#contract-haulage-omc",
    image: "/images/hero/tanker-contracts.webp",
    studio: true,
    spineBg: "#241206",
    spineAccent: "#FBCF6A",
  },
  {
    id: "gps-tracking",
    code: "03",
    category: "tracking",
    categoryLabel: "Core Service · 03",
    title: "GPS & Trip Records",
    subtitle: "LIVE POSITION / GATE TO GATE WATCH",
    meta: "SERVICE 03 / REAL-TIME DISPATCH / AVAILABLE",
    tag: "SERVICE 03",
    status: "available",
    summary:
      "Real-time GPS on every load, a trip record you can review, and delivery confirmation, so nobody is left guessing where product is between the depot and the drop.",
    highlights: [
      "Live vehicle position across the entire trip",
      "Dispatch watches stops and deviations and acts on them",
      "Trip history and delivery proof delivered at closure",
    ],
    credit: "Operated by Fortitier Logistics Limited · Accra, Ghana.",
    ctaQuery: "product=diesel",
    href: "/services#gps-tracking",
    image: "/images/haul/aerial-savanna-highway.webp",
    objectPosition: "50% 50%",
    spineBg: "#120904",
    spineAccent: "#DFA040",
  },
  {
    id: "product-accountability",
    code: "04",
    category: "tracking",
    categoryLabel: "Core Service · 04",
    title: "Product Accountability",
    subtitle: "LOADED MEETS DELIVERED / RECONCILED",
    meta: "SERVICE 04 / COMPARTMENT RECONCILIATION / AVAILABLE",
    tag: "SERVICE 04",
    status: "available",
    summary:
      "Loading and delivery are recorded and reconciled per compartment, so shortages are minimised and, when one appears, explained from the record rather than argued from memory.",
    highlights: [
      "Loaded quantity recorded per compartment before departure",
      "Delivered quantity confirmed on site with sign-off",
      "Load vs delivery reconciliation with variance explanation",
    ],
    credit: "Operated by Fortitier Logistics Limited · Accra, Ghana.",
    ctaQuery: "product=petrol",
    href: "/services#product-accountability",
    image: "/images/haul/loading-arm-hatch.webp",
    objectPosition: "55% 42%",
    spineBg: "#2E1708",
    spineAccent: "#FBCF6A",
  },
  {
    id: "safety-compliance",
    code: "05",
    category: "compliance",
    categoryLabel: "Core Service · 05",
    title: "Safety & Compliance",
    subtitle: "NPA-ALIGNED / TRAINED CREWS & INSURED",
    meta: "SERVICE 05 / REGULATORY DISCIPLINE / AVAILABLE",
    tag: "SERVICE 05",
    status: "available",
    summary:
      "Trained drivers and mates, insured and calibrated tankers, and operating discipline aligned with National Petroleum Authority requirements. The safe way is the only way we run.",
    highlights: [
      "Trained drivers and mates for flammable cargo procedures",
      "Insured tankers carrying calibrated discharge equipment",
      "NPA-aligned procedures with documentation shared on onboarding",
    ],
    credit: "Operated by Fortitier Logistics Limited · Accra, Ghana.",
    ctaQuery: "product=mixed",
    href: "/services#safety-compliance",
    image: "/images/haul/tanker-studio.webp",
    objectPosition: "46% 50%",
    spineBg: "#160A04",
    spineAccent: "#DFA040",
  },
  {
    id: "fleet-management-owners",
    code: "06",
    category: "compliance",
    categoryLabel: "Roadmap Service · 06",
    title: "Owner Fleet Ops",
    subtitle: "TANKER OWNERS / COMING AS WE GROW",
    meta: "SERVICE 06 / ROADMAP CAPACITY / INQUIRE",
    tag: "ROADMAP",
    status: "roadmap",
    summary:
      "Operating and managing tankers on behalf of their owners. On our roadmap as the business grows — not sold as day-one capacity until operations confirms we are ready.",
    highlights: [
      "Owners retain their asset under Fortitier operating discipline",
      "Dispatch, compliance support and reporting under one roof",
      "Ask dispatch to be notified when owner-fleet capacity opens",
    ],
    credit: "Roadmap service · Fortitier Logistics Limited.",
    ctaQuery: "segment=other",
    href: "/services#fleet-management-owners",
    image: "/images/haul/highway-wheels-night.webp",
    objectPosition: "52% 50%",
    spineBg: "#331A09",
    spineAccent: "#AC7023",
  },
];

/* ----------------------------------------------------- 3D shelf geometry */

export function smoothstep(x: number): number {
  const c = x < 0 ? 0 : x > 1 ? 1 : x;
  return c * c * (3 - 2 * c);
}

/** Smooth continuous step B(r) from Leon Vasari: pushes neighbours apart cleanly as a tape opens. */
export function shelfStepB(r: number): number {
  if (Math.abs(r) < 1) {
    return (r + Math.sin(Math.PI * r) / Math.PI) / 2;
  }
  return r < 0 ? -0.5 : 0.5;
}

export interface ShelfDims {
  H: number;
  ws: number;
  d: number;
  gap: number;
}

export function computeShelfDims(H: number): ShelfDims {
  return {
    H,
    ws: (H * 142) / 840,
    d: (H * 474) / 900,
    gap: H * 0.03,
  };
}

/** Exact horizontal centre x of a tape at relative slot r. */
export function shelfX(r: number, dims: ShelfDims): number {
  return r * (dims.ws + dims.gap) + (dims.d - dims.ws + 1.6 * dims.gap) * shelfStepB(r);
}

/** Openness o in [0, 1]: 1 when centred, 0 when standing spine-out. */
export function tapeOpenness(r: number): number {
  return smoothstep(Math.max(0, 1 - Math.abs(r)));
}

/** Shortest-path target index around the endless loop. */
export function shortestLoopTarget(currentS: number, targetIdx: number, count = SHELF_DOSSIERS.length): number {
  const curMod = ((Math.round(currentS) % count) + count) % count;
  let diff = targetIdx - curMod;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return Math.round(currentS) + diff;
}
