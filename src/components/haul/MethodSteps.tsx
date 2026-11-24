import Image from "next/image";
import { haulSteps, stepPhotos } from "@/content/about";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

/** Illustrative figures only, labelled as such wherever they appear. */
const LEDGER = [
  { k: "Loaded", v: "33,000 L" },
  { k: "Delivered", v: "33,000 L" },
  { k: "Variance", v: "0 L" },
];

/** The operating method, one photographed step at a time: load, track, deliver, reconcile. */
export default function MethodSteps() {
  return (
    <section className="bg-[#0c0602] text-paper" aria-labelledby="method-steps-title">
      <div className="container-page py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#dfa040]">The trip</p>
          <h2 id="method-steps-title" className="mt-4 font-wide text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold uppercase leading-[1.02] text-[#f4ecdf]">
            Four steps. No gaps between them.
          </h2>
        </Reveal>

        <ol className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
          {haulSteps.map((s, i) => {
            const ph = stepPhotos[s.id];
            const flip = i % 2 === 1;
            return (
              <li key={s.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                    <Image src={ph.src} alt={ph.alt} fill sizes="(min-width:1024px) 56vw, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
                    <span className="absolute left-5 top-5 font-mono text-[11px] tracking-[0.22em] text-[#fbcf6a]">
                      {s.number} / 04
                    </span>
                  </div>
                </Reveal>
                <Reveal className={cn("lg:col-span-5", flip && "lg:order-1")} delay={0.08}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#dfa040]">
                    {s.number} · {s.title}
                  </p>
                  <h3 className="mt-3 font-display text-display-md font-semibold text-paper text-balance-pretty">{s.headline}</h3>
                  <p className="mt-4 text-body-lg text-paper/72">{s.body}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-white/12 pt-5">
                    {s.checks.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-body-sm text-paper/80">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden />
                        {c}
                      </li>
                    ))}
                  </ul>
                  {s.id === "reconcile" ? (
                    <aside aria-label="Example trip ledger" className="mt-7 rounded-md border border-gold/30 bg-black/40 p-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-gold-light">Trip ledger</span>
                        <span className="rounded-sm border border-gold/40 px-1.5 py-0.5 text-[9.5px] text-gold">Illustrative</span>
                      </div>
                      <dl>
                        {LEDGER.map((r) => (
                          <div key={r.k} className="flex justify-between border-t border-white/10 py-2">
                            <dt className="text-paper/55">{r.k}</dt>
                            <dd className="tabular-nums text-paper">{r.v}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-1 text-[9.5px] normal-case tracking-normal text-paper/45">An illustrative 33,000 L load, not performance data.</p>
                    </aside>
                  ) : null}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
