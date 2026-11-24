/**
 * Labeled haulage scenarios — not fabricated case studies.
 * status stays "scenario" until a real delivery is documented with permission.
 */

export type ScenarioStatus = "scenario" | "pilot" | "case-study";

export interface HaulScenario {
  id: string;
  title: string;
  corridor: string;
  summary: string;
  focus: string[];
  status: ScenarioStatus;
}

export const scenarios: HaulScenario[] = [
  {
    id: "depot-to-station",
    title: "Depot to filling station",
    corridor: "Depot origin → retail network",
    summary:
      "How a standard petrol or diesel drop moves from loading bay to station tank with tracking and delivery confirmation.",
    focus: ["On-time retail supply", "GPS visibility", "Delivery proof"],
    status: "scenario",
  },
  {
    id: "omc-contract-lane",
    title: "OMC contract lane",
    corridor: "Agreed OMC routes and schedules",
    summary:
      "Dedicated truck and driver capacity on contracted lanes — planned turns, not last-minute charters.",
    focus: ["Dedicated crews", "Schedule discipline", "Contract reporting"],
    status: "scenario",
  },
  {
    id: "mine-delivery",
    title: "Mine diesel delivery",
    corridor: "Depot → mine or industrial site",
    summary:
      "Bulk diesel or gasoil into a mine or plant gate, with reconciliation so site stores know what arrived.",
    focus: ["Remote-site reliability", "Product accountability", "Safety posture"],
    status: "scenario",
  },
];
