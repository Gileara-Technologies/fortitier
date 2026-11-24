/**
 * Company story, operating posture and homepage narrative copy.
 * Voice: strong, disciplined, sparse. No invented metrics.
 */

export const aboutContent = {
  headline: "Bulk fuel, moved with strength.",
  intro:
    "Fortitier Logistics Limited is a Ghanaian bulk fuel haulage company. We move petrol, diesel and gasoil by road tanker, and we keep an account of every litre from the depot gate to the customer's tank.",
  story: [
    "Almost all of Ghana's fuel travels by road. That makes the tanker the most important and least visible link in the chain. When it is late, a forecourt closes. When it is unaccounted for, a shortage turns into an argument. When it is unsafe, the cost is not a line on an invoice.",
    "We started Fortitier on one conviction: hauling dangerous product is a discipline, not a favour. The trucks, the crews, the paperwork and the tracking are one system, and the system is only as strong as its weakest trip.",
    "So we run it the way the cargo deserves. Trained drivers and mates. Insured, calibrated tankers. GPS on every load. Loading figures written down and set against delivery figures when the trip ends. Nothing assumed, nothing waved through.",
  ],
  nameMeaning:
    'Fortitier is Latin for "with strength." It is the operating standard, not a slogan: strong on safety, strong on reliability, strong on trust.',
  pillars: [
    {
      title: "Safety is the first job",
      body: "Trained drivers and mates, insured and calibrated tankers, and road discipline that treats every load as what it is: flammable, valuable and someone else's.",
    },
    {
      title: "Every litre has an account",
      body: "Product is recorded going on and recorded coming off. The two figures are compared at the end of the trip, and any difference is explained from the record.",
    },
    {
      title: "Nothing in transit is invisible",
      body: "GPS runs for the whole trip, so position, stops and deviations are known while they happen, not reconstructed after.",
    },
    {
      title: "Operated to the regulator's standard",
      body: "Our operations are aligned with National Petroleum Authority requirements for moving bulk petroleum. Documentation is shared through the commercial process.",
    },
  ],
  notList: [
    "Not a fuel marketer or OMC. We haul product; we do not own the retail brand.",
    "Not general cargo, container or courier freight.",
    "Not a petroleum trading desk.",
    "Not a software company. The tracking supports the haulage, never the other way around.",
  ],
  groupNote: "Fortitier Logistics Limited is part of AFH Global Holdings Limited.",
} as const;

export const audiences = [
  {
    id: "omc",
    kind: "depot",
    title: "Oil marketing companies",
    lead: "A lane you agree once and run every week.",
    body: "Dedicated trucks and crews on agreed routes and schedules, so your supply plan stops depending on who is free today.",
  },
  {
    id: "station",
    kind: "station",
    title: "Filling stations and retail networks",
    lead: "Depot to pump, timed so the tank is never empty.",
    body: "Loads planned against how your forecourt actually sells, delivered complete and confirmed on arrival.",
  },
  {
    id: "mine",
    kind: "mine",
    title: "Mines",
    lead: "Where a late load stops a shift, not a sale.",
    body: "Diesel and gasoil into remote and industrial sites on routes we plan for the distance, the terrain and the gate procedure.",
  },
  {
    id: "industrial",
    kind: "industrial",
    title: "Industrial customers",
    lead: "Bulk product to plant and yard, on the day agreed.",
    body: "Petrol, diesel or gasoil delivered to your storage with a trip record you can reconcile against your own stock.",
  },
] as const;

export const trustItems = [
  {
    id: "npa",
    title: "NPA-aligned operations",
    body: "Run to the standard the National Petroleum Authority expects for bulk petroleum movement.",
  },
  {
    id: "gps",
    title: "GPS on every load",
    body: "Live position, trip records and delivery confirmation, from gate to gate.",
  },
  {
    id: "insured",
    title: "Insured, calibrated tankers",
    body: "Cover and calibration are treated as operating defaults, never as extras.",
  },
  {
    id: "nationwide",
    title: "Nationwide routes",
    body: "From the coast to the Savannah. Depot origins to stations, mines and plants across Ghana.",
  },
] as const;

export const painPoints = [
  {
    id: "dry-stations",
    title: "Dry stations",
    body: "A late load is a closed pump. Customers do not wait for the tanker; they drive to the next forecourt, and some do not come back.",
    serviceId: "bulk-fuel-haulage",
    service: "Bulk fuel haulage",
  },
  {
    id: "untracked",
    title: "Blind trips",
    body: "Between the depot gate and the station tank, product is only as visible as your last phone call to the driver.",
    serviceId: "gps-tracking",
    service: "GPS tracking and trip reporting",
  },
  {
    id: "shortages",
    title: "Unexplained shortages",
    body: "A variance with no paper trail becomes a dispute between people who were not there. A record ends the dispute early.",
    serviceId: "product-accountability",
    service: "Product accountability",
  },
  {
    id: "delays",
    title: "Slipping schedules",
    body: "Ad-hoc capacity gives ad-hoc arrival times. Contracted lanes, with the same trucks and crews, give planned ones.",
    serviceId: "contract-haulage-omc",
    service: "Contract haulage for OMCs",
  },
  {
    id: "compliance",
    title: "Compliance exposure",
    body: "Flammable product on a public road demands trained crews and calibrated, insured tankers. Anything less is borrowed risk.",
    serviceId: "safety-compliance",
    service: "Safety and compliance",
  },
] as const;

export const haulSteps = [
  {
    id: "load",
    number: "01",
    title: "Load",
    headline: "The trip starts with a figure.",
    body: "Product is loaded at the depot against calibrated equipment. Product, compartment and quantity are written down before the tanker moves, so the trip has a start and a number to be held to.",
    checks: ["Calibrated loading", "Compartment and product recorded", "Crew briefed on the lane"],
  },
  {
    id: "track",
    number: "02",
    title: "Track",
    headline: "Nothing in transit is invisible.",
    body: "GPS runs for the whole trip. Dispatch and the customer can see position, stops and deviations as they happen. A tanker that stops where it should not is a call we make, not one we wait to receive.",
    checks: ["Live position", "Stops and deviations surfaced", "Trip record kept"],
  },
  {
    id: "deliver",
    number: "03",
    title: "Deliver",
    headline: "Discharged by trained hands.",
    body: "At the gate, product is discharged into the customer's tank by a trained driver and mate following procedure, and delivery is confirmed against the trip record.",
    checks: ["Trained discharge procedure", "Delivery confirmed on site", "Customer sign-off"],
  },
  {
    id: "reconcile",
    number: "04",
    title: "Reconcile",
    headline: "Every litre has an account.",
    body: "Loaded figure meets delivered figure. If they agree, the trip closes. If they do not, the difference is explained from the record, not argued from memory.",
    checks: ["Loaded vs delivered compared", "Variances explained", "Record retained"],
  },
] as const;

export const exceptions = [
  {
    title: "A delay on the road",
    body: "Dispatch sees it on the trip, contacts the crew and tells the customer, with a revised arrival, before the customer has to ask.",
  },
  {
    title: "A breakdown",
    body: "The load is kept secure and tracked while a recovery or transfer is arranged. Safety decides the next move, never the schedule.",
  },
  {
    title: "A shortage at delivery",
    body: "Loading figures, trip record and delivery figures are laid side by side and the difference is explained. Commercial treatment follows the haulage agreement.",
  },
  {
    title: "An incident",
    body: "Crew safety and public safety come first. The customer and relevant authorities are informed in line with the agreement and the regulations.",
  },
] as const;

export const customerAsks = [
  "Product: petrol, diesel or gasoil.",
  "Origin depot and destination site.",
  "How often, and in what quantities.",
  "Site access, gate hours and discharge arrangements.",
  "Whether you want contract capacity or one-off hauls.",
] as const;

/** Company identity and mission, from the Fortitier company profile (v1.1). */
export const profile = {
  positioning: "Ghanaian bulk fuel haulage. Safe, accountable, on time.",
  promise: "Every trip tracked. Every litre reconciled.",
  identity:
    "Fortitier Logistics Limited moves petrol, diesel and gasoil by road tanker, from the loading depot to oil marketing companies, filling stations, mines and industrial customers across Ghana.",
  why: "Ghana's fuel demand grows every year, and nearly all of it travels by road. So we treat haulage as infrastructure, not an afterthought: a disciplined, compliant fleet, every trip tracked, every litre accounted for from loading to delivery.",
  facts: [
    { k: "Company", v: "Fortitier Logistics Limited" },
    { k: "Products", v: "Petrol · Diesel · Gasoil" },
    { k: "Loading", v: "Tema · Takoradi · Buipe" },
    { k: "Delivering to", v: "OMCs · Stations · Mines · Industry" },
    { k: "Coverage", v: "Nationwide, Ghana" },
    { k: "Office", v: "24 Yooyi Lane, Accra" },
    { k: "Group", v: "AFH Global Holdings Limited" },
  ],
} as const;

/** The five commitments of the mission statement. */
export const mission = [
  { title: "Safety first", body: "Trained crews, insured and calibrated tankers, disciplined road operations." },
  { title: "Accountability", body: "Loading-to-delivery reconciliation, so shortages are minimised and explained." },
  { title: "Reliability", body: "Agreed routes and schedules kept, with live visibility when it matters." },
  { title: "Compliance", body: "Operations aligned with National Petroleum Authority requirements." },
  { title: "Trust", body: "Transparent trip records and delivery confirmation for every load." },
] as const;

/** Photography for the operating steps (2K keyframes from the Fortitier film). */
export const stepPhotos: Record<string, { src: string; alt: string }> = {
  load: { src: "/images/haul/loading-arm-hatch.webp", alt: "A loading arm connected to the top hatch of a stainless-steel fuel tanker under the depot gantry" },
  track: { src: "/images/haul/aerial-savanna-highway.webp", alt: "Aerial view at night of a single tanker's headlights on a highway crossing dark savanna" },
  deliver: { src: "/images/haul/headlights-oncoming.webp", alt: "A Fortitier fuel tanker arriving at night, headlights on" },
  reconcile: { src: "/images/haul/tanker-studio.webp", alt: "A polished fuel tanker truck lit in a dark studio" },
};
