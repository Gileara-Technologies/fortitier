"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion flag. The server snapshot is always `false`, so the
 * first client render matches the server HTML; React then re-renders with the real
 * value. (framer-motion's useReducedMotion returns null on the server and the real
 * value on the client, which makes branching components fail hydration.)
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
