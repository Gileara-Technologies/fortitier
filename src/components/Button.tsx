import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "md" | "sm" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-on-primary shadow-cta hover:bg-gold-light active:scale-[0.98]",
  secondary:
    "border border-brown/20 bg-paper text-brown hover:border-gold hover:text-bronze active:scale-[0.98]",
  ghost:
    "text-brown hover:text-bronze underline-offset-4 hover:underline active:scale-[0.98]",
  dark: "bg-paper text-brown hover:bg-gold-soft active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-body-sm",
  md: "px-5 py-2.5 text-body-sm",
  lg: "px-6 py-3 text-body",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold transition-[color,background-color,border-color,transform,box-shadow] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold whitespace-nowrap";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonAsButton;
  return (
    <button className={classes} type={buttonRest.type ?? "button"} {...buttonRest}>
      {children}
    </button>
  );
}
