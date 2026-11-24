/**
 * Logistics FAQs — single source for /faq UI and FAQPage JSON-LD.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What products do you haul?",
    answer:
      "Petrol, diesel, and gasoil. Fortitier is a bulk fuel haulage company — we move petroleum product by road tanker. We do not sell retail fuel brands or act as an oil marketing company.",
  },
  {
    question: "Which customers do you serve?",
    answer:
      "Oil marketing companies (OMCs), filling stations and retail networks, mines, and industrial customers who need bulk product delivered to plant or yard.",
  },
  {
    question: "Do you cover routes outside Accra?",
    answer:
      "Yes. Coverage is nationwide across Ghana — depot origins to stations, mines, and industrial destinations. Tell us the corridor when you request haulage.",
  },
  {
    question: "How do I know where my load is?",
    answer:
      "Every load runs with GPS tracking and trip reporting. You get live location visibility, trip records, and delivery confirmation so the product is never a black box in transit.",
  },
  {
    question: "What happens if there is a shortage?",
    answer:
      "We reconcile loading figures against delivery figures and document the trip. Shortages are minimised through disciplined loading and handling, and when a variance appears it is explained through the accountability process — not shrugged off. Exact commercial terms sit in your haulage agreement.",
  },
  {
    question: "Are tankers calibrated and insured?",
    answer:
      "Yes. Operating posture requires insured tankers and calibrated equipment, with trained drivers and mates on every trip.",
  },
  {
    question: "How do you work with NPA requirements?",
    answer:
      "Operations are aligned with National Petroleum Authority requirements for bulk petroleum movement. We do not publish licence numbers on the website; compliance documentation is shared in the commercial process where appropriate.",
  },
  {
    question: "How do contract or dedicated trucks work for OMCs?",
    answer:
      "Contract haulage gives OMCs dedicated trucks and drivers on agreed routes and schedules. Capacity, lanes, and reporting cadence are set in the contract — built for reliability, not one-off charters.",
  },
  {
    question: "How do I request haulage?",
    answer:
      "Use the contact form on this site or call us. Share company name, segment, product, route or corridor, and volume cadence. We respond by phone or email during Ghana business hours.",
  },
  {
    question: "Is fleet management for truck owners available now?",
    answer:
      "Not as day-one capacity. Fleet management for owners is on the roadmap as the business grows. Core services today are bulk haulage, OMC contracts, GPS tracking, product accountability, and safety and compliance.",
  },
];
