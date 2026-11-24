import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker ? (
        <p
          className={cn(
            "mb-3 font-mono text-label-lg",
            tone === "dark" ? "text-gold-light" : "text-bronze",
          )}
        >
          {kicker}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-display-md text-balance-pretty",
          tone === "dark" ? "text-paper" : "text-brown",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-measure text-body-lg",
            tone === "dark" ? "text-paper/80" : "text-brown-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
