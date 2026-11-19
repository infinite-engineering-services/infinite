"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectArt } from "@/components/sections/project-art";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Representative scopes as a big typographic index. On fine pointers the
 * project render floats beside the cursor while a row is hovered; on touch
 * each row shows its thumbnail inline.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const float = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = pos.current;
      p.cx += (p.x - p.cx) * 0.14;
      p.cy += (p.y - p.cy) * 0.14;
      if (float.current) float.current.style.transform = `translate(${p.cx + 28}px, ${p.cy - 120}px)`;
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="relative" onPointerLeave={() => setActive(null)}>
      <ol className="border-t">
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b">
            <Link
              href={`/work/${p.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 sm:gap-8 sm:py-8"
            >
              <span className="t-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block font-display text-[clamp(26px,4.4vw,64px)] leading-[0.98] font-medium tracking-[-0.04em] transition-[color,translate] duration-500 group-hover:translate-x-3",
                    active !== null && active !== i ? "text-ink/30" : "text-ink",
                  )}
                >
                  {p.title}
                </span>
                <span className="t-mono mt-2 block text-[11px] text-muted-foreground">
                  {p.sector} · {p.metric.label} {p.metric.value} · {p.turnaround} · Representative
                </span>
              </span>
              <span className="grid size-12 place-items-center rounded-full border transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
              <span className="col-span-3 mt-1 aspect-[16/9] overflow-hidden rounded-2xl pointer-fine:hidden">
                <ProjectArt kind={p.art} sizes="100vw" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div
        ref={float}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[380px] pointer-fine:block"
      >
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden rounded-2xl border border-ink/10 shadow-[0_30px_80px_-20px_rgba(10,14,13,0.6)] transition-[opacity,scale] duration-300",
            active === null ? "scale-90 opacity-0" : "scale-100 opacity-100",
          )}
        >
          {projects.map((p, i) => (
            <div
              key={p.slug}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                active === i ? "opacity-100" : "opacity-0",
              )}
            >
              <ProjectArt kind={p.art} sizes="380px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
