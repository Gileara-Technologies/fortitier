"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·#%";

/**
 * Instrument-style text reveal: letters settle from random glyphs, left to right.
 * The real text is always present for assistive tech (sr-only); the animated copy is aria-hidden.
 */
export default function ScrambleText({
  text,
  run,
  as: Tag = "span",
  className,
  duration = 700,
}: {
  text: string;
  run: boolean;
  as?: ElementType;
  className?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const settled = Math.floor(k * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < settled || ch === " ") out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setShown(out);
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [run, text, duration]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{shown}</span>
    </Tag>
  );
}
