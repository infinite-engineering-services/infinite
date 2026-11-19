"use client";

import { useEffect, useState } from "react";

const GLYPHS = "0123456789°′″.NE-/·";

/**
 * Survey-style "decode" for short mono readouts (coordinates, file names,
 * counts). The final text is server-rendered and is what assistive tech reads;
 * the scramble only runs in animation frames after a change, and never under
 * reduced motion. Not for headings, specs or form text.
 */
export function ScrambleText({
  text,
  className,
  duration = 700,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      if (p >= 1) {
        setScrambled(null);
        return;
      }
      const settled = Math.floor(text.length * p);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++)
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      setScrambled(out);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{scrambled ?? text}</span>
    </span>
  );
}
