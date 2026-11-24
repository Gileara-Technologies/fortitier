import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Inner-page hero: a full-bleed photograph under the transparent navbar, with the page title set
 * low on the left over a dark gradient.
 */
export default function PageHero({
  kicker,
  title,
  description,
  actions,
  image,
  imageAlt,
  imagePosition = "50% 50%",
  size = "lg",
}: {
  kicker: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  size?: "lg" | "md";
}) {
  return (
    <section className="relative isolate -mt-[4.25rem] overflow-hidden bg-[#0c0602] text-paper" aria-labelledby="page-title">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-10 object-cover" style={{ objectPosition: imagePosition }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/50 to-black/5" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/60 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#0c0602] via-[#0c0602]/50 to-transparent" aria-hidden />
      <div className={cn("container-page flex flex-col justify-end pb-14 pt-36 sm:pb-20", size === "lg" ? "min-h-[78svh]" : "min-h-[60svh]")}>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#dfa040]">{kicker}</p>
        <h1 id="page-title" className="mt-4 max-w-4xl font-wide text-[clamp(2.1rem,4.4vw,4.2rem)] font-semibold uppercase leading-[1.0] text-[#f4ecdf]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-body-lg text-paper/78">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
