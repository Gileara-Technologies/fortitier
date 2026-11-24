/**
 * Six Fortitier logistics services — content truth for cards and /services.
 * Service 6 is roadmap only until ops confirms live capacity.
 */

export type ServiceStatus = "available" | "roadmap";

export type ServiceIcon = "tanker" | "contract" | "gps" | "reconcile" | "shield" | "fleet";

export interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  summary: string;
  outcome: string;
  how: string[];
  icpFit: string[];
  included: string[];
  status: ServiceStatus;
  icon: ServiceIcon;
}

export const services: Service[] = [
  {
    id: "bulk-fuel-haulage",
    number: "01",
    title: "Bulk fuel haulage",
    tagline: "Petrol, diesel and gasoil, depot to site.",
    summary:
      "Road tanker transport of petroleum product across Ghana: from the loading depot to filling stations, mines and industrial yards, on the day it was promised.",
    outcome: "Product arrives complete, on schedule, and confirmed.",
    how: [
      "You give us product, origin, destination and cadence.",
      "We plan the lane, assign a crew and a calibrated tanker, and confirm the schedule.",
      "The load runs under GPS and closes with a delivery confirmation and a trip record.",
    ],
    icpFit: ["Oil marketing companies", "Filling stations", "Mines", "Industrial plants"],
    included: ["Petrol, diesel, gasoil", "Depot-to-site routes", "Nationwide coverage", "Delivery confirmation"],
    status: "available",
    icon: "tanker",
  },
  {
    id: "contract-haulage-omc",
    number: "02",
    title: "Contract haulage for OMCs",
    tagline: "Dedicated trucks and crews on agreed lanes.",
    summary:
      "Contracted capacity for oil marketing companies. The same trucks and the same crews, on routes and schedules agreed in advance, so your supply plan rests on capacity you can count on.",
    outcome: "A lane that runs to plan every week, not a favour renegotiated every load.",
    how: [
      "We agree lanes, volumes, schedules and reporting in a haulage contract.",
      "Trucks and crews are dedicated to your lanes and know them.",
      "Reporting follows the cadence you set, with the trip record behind every figure.",
    ],
    icpFit: ["Oil marketing companies", "Retail networks"],
    included: ["Dedicated trucks and drivers", "Agreed routes and schedules", "Lane reliability focus", "Contract reporting"],
    status: "available",
    icon: "contract",
  },
  {
    id: "gps-tracking",
    number: "03",
    title: "GPS tracking and trip reporting",
    tagline: "Live position. Trip records. Delivery proof.",
    summary:
      "Real-time GPS on every load, a trip record you can review, and delivery confirmation, so nobody is left guessing where product is between the depot and the drop.",
    outcome: "You always know where the load is, and can prove where it has been.",
    how: [
      "Every tanker runs with live GPS for the whole trip.",
      "Dispatch watches position, stops and deviations and acts on them.",
      "At the end you receive the trip record and the delivery confirmation.",
    ],
    icpFit: ["OMCs", "Stations", "Mines", "Industrial plants"],
    included: ["Live vehicle position", "Trip history", "Delivery confirmation", "Exception visibility"],
    status: "available",
    icon: "gps",
  },
  {
    id: "product-accountability",
    number: "04",
    title: "Product accountability",
    tagline: "Every litre loaded. Every litre explained.",
    summary:
      "Loading and delivery are recorded and reconciled, so shortages are minimised and, when one appears, explained from the record rather than argued from memory.",
    outcome: "Variances get answers, and disputes get a paper trail instead of a shouting match.",
    how: [
      "Loaded quantity is recorded per compartment before the tanker moves.",
      "Delivered quantity is confirmed at the customer's site.",
      "The two are compared when the trip closes, and any difference is explained.",
    ],
    icpFit: ["OMCs", "Stations", "Mines", "Industrial plants"],
    included: ["Load vs delivery reconciliation", "Shortage explanation process", "Trip documentation", "Customer visibility"],
    status: "available",
    icon: "reconcile",
  },
  {
    id: "safety-compliance",
    number: "05",
    title: "Safety and compliance",
    tagline: "Trained crews. Insured tankers. NPA-aligned operations.",
    summary:
      "Trained drivers and mates, insured and calibrated tankers, and operating discipline aligned with National Petroleum Authority requirements. The safe way is the only way we run.",
    outcome: "Flammable product moves like it matters, and you can show that it did.",
    how: [
      "Crews are trained for the product and the procedure, drivers and mates alike.",
      "Tankers are insured and carry calibrated equipment.",
      "Operations are aligned with NPA requirements, with documentation shared in the commercial process.",
    ],
    icpFit: ["OMCs", "Stations", "Mines", "Industrial plants"],
    included: ["Trained drivers and mates", "Insured tankers", "Calibrated equipment", "NPA-aligned procedures"],
    status: "available",
    icon: "shield",
  },
  {
    id: "fleet-management-owners",
    number: "06",
    title: "Fleet management for truck owners",
    tagline: "Operating discipline for owner-held tankers.",
    summary:
      "Operating and managing tankers on behalf of their owners. This is on our roadmap as the business grows. It is not sold as day-one capacity until operations confirms we are ready.",
    outcome: "Coming as we grow. Ask if you would like to be told when it opens.",
    how: [
      "Owners retain their asset; Fortitier operates it to the same standard as our own.",
      "Dispatch, compliance and reporting under one discipline.",
      "Timing depends on operating maturity. We will say so plainly when it is ready.",
    ],
    icpFit: ["Tanker owners"],
    included: ["Owner fleet operations", "Dispatch discipline", "Compliance support", "Reporting to owners"],
    status: "roadmap",
    icon: "fleet",
  },
];

export const coreServices = services.filter((s) => s.status === "available");
export const roadmapServices = services.filter((s) => s.status === "roadmap");

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}
