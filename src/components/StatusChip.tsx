import { cn } from "@/lib/cn";

type ChipStatus = "available" | "roadmap" | "scenario" | "pilot" | "case-study";

const labels: Record<ChipStatus, string> = {
  available: "Available",
  roadmap: "Coming as we grow",
  scenario: "Scenario",
  pilot: "Pilot",
  "case-study": "Case study",
};

const styles: Record<ChipStatus, string> = {
  available: "border-bronze/30 bg-gold-soft/60 text-brown",
  roadmap: "border-outline bg-surface-variant text-brown-muted",
  scenario: "border-outline bg-paper-warm text-brown-muted",
  pilot: "border-gold/40 bg-gold-soft text-brown",
  "case-study": "border-bronze/40 bg-gold-soft text-brown",
};

export function StatusChip({
  status,
  className,
}: {
  status: ChipStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-label",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
