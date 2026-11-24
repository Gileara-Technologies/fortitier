import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The Fortitier logo as a horizontal lockup: the F-and-swoosh mark beside the FORTITIER / LOGISTICS
 * wordmark, both cut from the brand-pack logo. `tone` is the surface it sits on.
 */
export default function BrandLockup({
  tone = "dark",
  size = "md",
  className,
  priority = false,
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  const h = size === "lg" ? 52 : size === "sm" ? 30 : 40;
  const markW = Math.round((h * 614) / 420);
  const wordH = Math.round(h * 0.42);
  const wordW = Math.round((wordH * 1038) / 240);
  const suffix = tone === "dark" ? "on-dark" : "on-light";
  return (
    <span className={cn("flex items-center", className)} style={{ gap: Math.round(h * 0.18) }}>
      <Image src={`/brand/mark-${suffix}.png`} alt="" width={markW} height={h} priority={priority} className="shrink-0" style={{ width: markW, height: h }} />
      <Image
        src={`/brand/wordmark-${suffix}.png`}
        alt="Fortitier Logistics"
        width={wordW}
        height={wordH}
        priority={priority}
        className="shrink-0"
        style={{ width: wordW, height: wordH }}
      />
    </span>
  );
}
