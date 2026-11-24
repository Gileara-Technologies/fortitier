import type { ServiceIcon as IconName } from "@/content/services";
import {
  LuFuel,
  LuHandshake,
  LuMapPinned,
  LuScale,
  LuShieldCheck,
  LuTruck,
} from "react-icons/lu";
import { cn } from "@/lib/cn";

const map = {
  tanker: LuFuel,
  contract: LuHandshake,
  gps: LuMapPinned,
  reconcile: LuScale,
  shield: LuShieldCheck,
  fleet: LuTruck,
} as const;

export function ServiceIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = map[name];
  return (
    <Icon
      aria-hidden
      className={cn("h-6 w-6 text-bronze", className)}
      strokeWidth={1.75}
    />
  );
}
