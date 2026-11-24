import Image from "next/image";
import Link from "next/link";
import { aboutContent, audiences, haulSteps, mission, profile, stepPhotos } from "@/content/about";
import { services } from "@/content/services";
import { ServiceIcon } from "@/components/ServiceIcon";
import { StatusChip } from "@/components/StatusChip";
import { Reveal } from "@/components/Reveal";

/**
 * The company profile, told on the landing page under the film: who Fortitier is, what it
 * promises, who it serves, the services, and how a load is run.
 */

function Kicker({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.28em] ${tone === "dark" ? "text-[#dfa040]" : "text-bronze"}`}>{children}</p>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="transition-transform group-hover:translate-x-1">
      →
    </span>
  );
}

/* ------------------------------------------------------ operating ribbon */

const RIBBON_ITEMS = [
  "NPA-Aligned Operations",
  "Live GPS · Gate to Gate",
  "Insured & Calibrated Tankers",
  "Tema · Takoradi · Buipe",
  "Every Litre Reconciled",
  "Petrol · Diesel · Gasoil",
  "Nationwide Corridors · Ghana",
] as const;

export function OperatingRibbon() {
  return (
    <div
      aria-label="Fortitier operating standards"
      className="relative overflow-hidden border-y border-[#dfa040]/20 bg-[#080402] py-3.5 text-[#f4ecdf]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#080402] to-transparent sm:w-24" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#080402] to-transparent sm:w-24" aria-hidden />
      <div className="ribbon-track">
        {[0, 1].map((dup) => (
          <ul key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10">
            {RIBBON_ITEMS.map((item) => (
              <li
                key={`${dup}-${item}`}
                className="flex items-center gap-8 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.26em] text-[#f3e6cf]/80 sm:gap-10 sm:text-[11px]"
              >
                <span>{item}</span>
                <span className="h-1.5 w-1.5 rotate-45 bg-[#dfa040]" aria-hidden />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ who we are */

export function ProfileIntro() {
  return (
    <section id="profile" className="relative scroll-mt-20 overflow-hidden bg-[#0b0704] text-paper" aria-labelledby="profile-title">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_15%,rgba(223,160,64,0.09),transparent_65%)]"
        aria-hidden
      />
      <div className="container-page relative grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-12 lg:py-32">
        <Reveal className="lg:col-span-7">
          <Kicker>Who we are</Kicker>
          <h2 id="profile-title" className="mt-5 font-wide text-[clamp(1.85rem,3.6vw,3.4rem)] font-semibold uppercase leading-[1.03] text-[#f4ecdf]">
            {profile.positioning}
          </h2>
          <p className="mt-5 font-display text-heading-md font-semibold text-gold-light">{profile.promise}</p>
          <div className="mt-7 max-w-[38rem] space-y-5 text-body text-paper/75 sm:text-body-lg">
            <p>{profile.identity}</p>
            <p>{profile.why}</p>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <dl className="border-t border-white/15">
            {profile.facts.map((f) => (
              <div
                key={f.k}
                className="grid grid-cols-[7.25rem_1fr] gap-3 border-b border-white/10 py-3.5 transition-colors hover:border-[#dfa040]/40 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45 sm:text-[10.5px]">{f.k}</dt>
                <dd className="text-body-sm font-medium text-[#f3e6cf]">{f.v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="mt-8 rounded-r-sm border-l-2 border-gold bg-white/[0.025] py-4 pl-5 pr-4">
            <p className="text-body-sm leading-relaxed text-paper/80 sm:text-body">{aboutContent.nameMeaning}</p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ commitments */

export function Commitments() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-paper" aria-labelledby="commitments-title">
      <Image
        src="/images/haul/loading-arm-hatch.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[60%_40%] opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/82 via-black/45 to-black/92" aria-hidden />
      <div className="container-page flex min-h-[72vh] flex-col justify-between gap-12 py-18 sm:py-20 lg:min-h-[78vh] lg:gap-16 lg:py-24">
        <Reveal className="max-w-2xl">
          <Kicker>Our mission</Kicker>
          <h2 id="commitments-title" className="mt-5 font-wide text-[clamp(1.85rem,3.6vw,3.4rem)] font-semibold uppercase leading-[1.03] text-[#f4ecdf]">
            Five commitments on every load.
          </h2>
          <p className="mt-5 max-w-xl text-body text-paper/78 sm:text-body-lg">
            Move petroleum products across Ghana with strength, so customers can trust that product left the depot, travelled safely and arrived complete and on schedule.
          </p>
        </Reveal>
        <ol className="grid gap-px overflow-hidden rounded-sm border border-white/14 bg-white/14 sm:grid-cols-2 lg:grid-cols-5">
          {mission.map((m, i) => (
            <li
              key={m.title}
              className="group relative bg-black/62 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-[#190c04]/80"
            >
              <span
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#dfa040] transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
              <p className="font-mono text-[10.5px] tracking-[0.22em] text-[#dfa040]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 font-display text-heading-md font-semibold text-paper sm:mt-6">{m.title}</h3>
              <p className="mt-2 text-body-sm text-paper/70">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ who we serve */

export function Audiences() {
  return (
    <section className="bg-paper" aria-labelledby="audiences-title">
      <div className="container-page grid gap-12 py-24 lg:grid-cols-12 lg:gap-14 lg:py-28">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg lg:sticky lg:top-28">
            <Image
              src="/images/haul/highway-wheels-night.webp"
              alt="A Fortitier tanker on a Ghanaian highway at night, wet road reflecting the streetlights"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover object-[40%_50%]"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal>
            <Kicker tone="light">Who we haul for</Kicker>
            <h2 id="audiences-title" className="mt-4 font-display text-display-md font-semibold text-brown text-balance-pretty">
              For the businesses that cannot run dry.
            </h2>
            <p className="mt-4 max-w-xl text-body-lg text-brown-muted">
              We haul product for customers who already own or market the fuel. We do not trade it, and we do not compete with you for the pump.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {audiences.map((a, i) => (
              <li key={a.id}>
                <Reveal delay={i * 0.05} className="border-t-2 border-gold pt-5">
                  <p className="font-mono text-label text-bronze">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display text-heading-md font-semibold text-brown">{a.title}</h3>
                  <p className="mt-2 font-medium text-brown">{a.lead}</p>
                  <p className="mt-2 text-body-sm text-brown-muted">{a.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ services */

export function ServicesOverview() {
  return (
    <section className="border-t border-outline-variant bg-paper-warm" aria-labelledby="services-title">
      <div className="container-page py-24 lg:py-28">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Kicker tone="light">Services</Kicker>
            <h2 id="services-title" className="mt-4 font-display text-display-md font-semibold text-brown text-balance-pretty">
              Five services today. One standard across all of them.
            </h2>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-2 font-display font-semibold text-bronze hover:text-brown">
            All services <Arrow />
          </Link>
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.id} className="h-full">
              <Reveal delay={(i % 3) * 0.05} className="h-full">
                <Link
                  href={`/services#${s.id}`}
                  className="group flex h-full flex-col rounded-lg border border-outline-variant bg-paper p-6 shadow-card transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-gold-soft/70">
                      <ServiceIcon name={s.icon} className="h-5 w-5" />
                    </span>
                    {s.status === "roadmap" ? <StatusChip status="roadmap" /> : <span className="font-mono text-label text-bronze">{s.number}</span>}
                  </div>
                  <h3 className="mt-6 font-display text-heading-md font-semibold text-brown">{s.title}</h3>
                  <p className="mt-2 flex-1 text-body-sm text-brown-muted">{s.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-bronze">
                    Details <Arrow />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ method */

export function Method() {
  return (
    <section className="bg-[#0b0704] text-paper" aria-labelledby="method-title">
      <div className="container-page py-20 sm:py-24 lg:py-28">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Kicker>How we haul</Kicker>
            <h2 id="method-title" className="mt-5 font-wide text-[clamp(1.85rem,3.6vw,3.4rem)] font-semibold uppercase leading-[1.03] text-[#f4ecdf]">
              Load. Track. Deliver. Reconcile.
            </h2>
            <p className="mt-5 max-w-xl text-body text-paper/72 sm:text-body-lg">
              The chain is simple on purpose. Figures recorded at loading, the trip visible throughout, delivery confirmed, differences explained.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45 sm:hidden">Swipe steps →</span>
            <Link href="/how-we-haul" className="group inline-flex items-center gap-2 font-display font-semibold text-gold-light hover:text-paper">
              The full method <Arrow />
            </Link>
          </div>
        </Reveal>
        <ol className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {haulSteps.map((s, i) => {
            const ph = stepPhotos[s.id];
            return (
              <li key={s.id} className="group w-[78vw] shrink-0 snap-start sm:w-auto">
                <Reveal delay={i * 0.06}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-white/10">
                    <Image
                      src={ph.src}
                      alt={ph.alt}
                      fill
                      sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 78vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" aria-hidden />
                    <p className="absolute left-4 top-4 rounded-sm border border-[#dfa040]/35 bg-black/55 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.2em] text-[#fbcf6a] backdrop-blur-sm">
                      {s.number}
                    </p>
                    <h3 className="absolute bottom-5 left-5 font-wide text-2xl font-semibold uppercase text-[#f4ecdf]">{s.title}</h3>
                  </div>
                  <p className="mt-5 font-display text-body font-semibold text-paper">{s.headline}</p>
                  <p className="mt-2 text-body-sm text-paper/68">{s.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ about */

export function AboutTeaser() {
  return (
    <section className="bg-paper" aria-labelledby="about-teaser-title">
      <div className="container-page grid items-center gap-12 py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal>
          <div className="relative aspect-[16/11] overflow-hidden rounded-lg">
            <Image
              src="/images/haul/tail-lights-night-road.webp"
              alt="A Fortitier tanker driving away down a long straight highway under a starry sky"
              fill
              sizes="(min-width:1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Kicker tone="light">Fortitier · Latin, “with strength”</Kicker>
          <h2 id="about-teaser-title" className="mt-4 font-display text-display-md font-semibold text-brown text-balance-pretty">
            Strong on safety. Strong on reliability. Strong on trust.
          </h2>
          <p className="mt-5 max-w-xl text-body-lg text-brown-muted">{aboutContent.story[1]}</p>
          <p className="mt-4 max-w-xl text-body text-brown-muted">{aboutContent.groupNote}</p>
          <Link href="/about" className="group mt-8 inline-flex items-center gap-2 font-display font-semibold text-bronze hover:text-brown">
            About Fortitier <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
