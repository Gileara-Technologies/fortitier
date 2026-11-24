"use client";

import { useCallback, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { depots, destinations, getNode, haversineKm, products } from "@/content/geo";
import { cn } from "@/lib/cn";
import LaneMap from "./LaneMap";

const kindLabel = { city: "City / network", mine: "Mine site", depot: "Depot" } as const;

/**
 * Corridor planner: choose a loading depot, a destination and a product, see the lane on an
 * accurate map of Ghana, and send it to dispatch with the request form already filled in.
 */
export default function CorridorPlanner() {
  const [originId, setOriginId] = useState("tema");
  const [destId, setDestId] = useState("kumasi");
  const [product, setProduct] = useState<(typeof products)[number]["id"]>("diesel");

  const origin = getNode(originId)!;
  const dest = getNode(destId)!;
  const km = Math.round(haversineKm(origin, dest));
  const productLabel = products.find((p) => p.id === product)!.label;

  const onPick = useCallback((id: string) => {
    if (depots.some((d) => d.id === id)) setOriginId(id);
    else setDestId(id);
  }, []);

  const params = new URLSearchParams({ origin: origin.name, destination: dest.name, product });
  if (dest.kind === "mine") params.set("segment", "mine");
  const href = `${siteConfig.ctaHref}?${params.toString()}#request`;

  const cities = destinations.filter((d) => d.kind !== "mine");
  const mines = destinations.filter((d) => d.kind === "mine");

  return (
    <section id="corridor" className="relative scroll-mt-16 overflow-hidden bg-[#0b0704] text-paper" aria-labelledby="corridor-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgb(223_160_64/0.10),transparent_60%)]" aria-hidden />
      <div className="container-page relative py-24 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#dfa040]">Corridor planner</p>
            <h2 id="corridor-title" className="mt-5 font-wide text-[clamp(2rem,3.6vw,3.4rem)] font-semibold uppercase leading-[1.02] text-[#f4ecdf]">
              Draw the lane. We will haul it.
            </h2>
            <p className="mt-5 max-w-xl text-body-lg text-paper/72">
              Choose where the product loads, where it goes and what it is. Send the lane to dispatch and the request arrives already filled in.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55" aria-label="Map key">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-[#dfa040]" aria-hidden /> Depot
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c9b393]" aria-hidden /> City / network
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rotate-45 bg-[#c9b393]" aria-hidden /> Mine
            </li>
          </ul>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-lg border border-white/12 lg:grid-cols-12">
          {/* map */}
          <div className="relative border-b border-white/10 bg-[#080503] lg:col-span-7 lg:border-b-0 lg:border-r">
            <div className="mx-auto aspect-[540/730] max-h-[44rem] w-full max-w-[34rem] p-4 sm:p-8">
              <LaneMap originId={originId} destId={destId} onPick={onPick} />
            </div>
            <div className="absolute left-4 top-4 rounded-sm border border-white/12 bg-black/55 px-3 py-2 backdrop-blur-md sm:left-6 sm:top-6">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper/45">Selected lane</p>
              <p className="mt-0.5 font-display text-body font-semibold text-paper">
                {origin.name} <span className="text-gold">→</span> {dest.name}
              </p>
            </div>
          </div>

          {/* builder */}
          <div className="flex flex-col bg-white/[0.03] lg:col-span-5">
            <div className="flex-1 space-y-8 p-6 sm:p-8">
              <Step n="01" label="Loading depot">
                <div className="grid grid-cols-3 gap-2">
                  {depots.map((d) => (
                    <Choice key={d.id} active={originId === d.id} onClick={() => setOriginId(d.id)}>
                      {d.name}
                    </Choice>
                  ))}
                </div>
              </Step>

              <Step n="02" label="Destination">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {cities.map((d) => (
                    <Choice key={d.id} active={destId === d.id} onClick={() => setDestId(d.id)}>
                      {d.name}
                    </Choice>
                  ))}
                </div>
                <p className="mb-2 mt-4 font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper/40">Mine sites</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {mines.map((d) => (
                    <Choice key={d.id} active={destId === d.id} onClick={() => setDestId(d.id)}>
                      {d.name}
                    </Choice>
                  ))}
                </div>
              </Step>

              <Step n="03" label="Product">
                <div className="grid grid-cols-3 gap-2">
                  {products.map((p) => (
                    <Choice key={p.id} active={product === p.id} onClick={() => setProduct(p.id)}>
                      {p.label}
                    </Choice>
                  ))}
                </div>
              </Step>
            </div>

            <div className="border-t border-white/10 bg-black/30 p-6 sm:p-8" aria-live="polite">
              <p className="font-wide text-xl font-semibold uppercase leading-tight text-[#f4ecdf]">
                {productLabel} · {origin.name} → {dest.name}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper/45">Straight line</dt>
                  <dd className="mt-1 font-display text-heading-md font-semibold tabular-nums text-gold-light">{km} km</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper/45">Region</dt>
                  <dd className="mt-1 text-body-sm font-medium text-paper">{dest.region}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper/45">Destination</dt>
                  <dd className="mt-1 text-body-sm font-medium text-paper">{kindLabel[dest.kind]}</dd>
                </div>
              </dl>
              <a
                href={href}
                className="group mt-6 flex w-full items-center justify-center gap-3 bg-[#dfa040] px-6 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-[#160b03] transition-colors hover:bg-[#fbcf6a]"
              >
                Request haulage for this lane
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <p className="mt-4 text-body-sm text-paper/50">
                Distance is for orientation only. Routing, scheduling and rates are agreed with dispatch.{" "}
                <a href={`tel:${siteConfig.phoneTel}`} className="text-gold-light underline underline-offset-2 hover:text-paper">
                  Call {siteConfig.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-paper/60">
        <span className="text-[#dfa040]">{n}</span>
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-[44px] rounded-sm border px-3 py-2.5 text-left font-display text-body-sm font-semibold transition-[background-color,border-color,color] duration-150",
        active ? "border-gold bg-gold text-[#1b0c02]" : "border-white/15 bg-white/[0.03] text-paper/85 hover:border-gold/60 hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}
