"use client";
/* eslint-disable react-hooks/immutability -- `film` is a shared mutable store read by the R3F render loop, by design */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Box, Crosshair, Layers, Map as MapIcon, X } from "lucide-react";
import { cta } from "@/config/site";
import { cn } from "@/lib/utils";
import { film, hotspotDefs } from "./store";

const modes = [
  { id: "scan", label: "Scan", s: 0.95, icon: Crosshair },
  { id: "model", label: "Model", s: 2.5, icon: Box },
  { id: "plan", label: "Plan", s: 3.14, icon: Layers },
] as const;

/** Opens explore mode from anywhere on the page (server components render this). */
export function ExploreButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      data-explore-button
      onClick={() => window.dispatchEvent(new Event("film:explore"))}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * Full-screen explore mode over the live 3D stage: drag to orbit, wheel to
 * zoom, switch Scan / Model / Plan, click hotspots for specs. Esc closes.
 */
export function ExploreOverlay({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("model");
  const [picked, setPicked] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    film.explore.on = true;
    film.explore.s = modes.find((m) => m.id === "model")!.s;
    film.explore.az = 40;
    film.explore.el = 26;
    film.explore.dist = 62;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    html.classList.add("exploring");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") film.explore.az -= 8;
      if (e.key === "ArrowRight") film.explore.az += 8;
      if (e.key === "ArrowUp") film.explore.el = Math.min(88, film.explore.el + 6);
      if (e.key === "ArrowDown") film.explore.el = Math.max(6, film.explore.el - 6);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      film.explore.on = false;
      html.style.overflow = prev;
      html.classList.remove("exploring");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const choose = (id: (typeof modes)[number]["id"]) => {
    const m = modes.find((x) => x.id === id)!;
    film.explore.s = m.s;
    if (id === "plan") film.explore.el = Math.max(film.explore.el, 62);
    setMode(id);
  };

  const hot = hotspotDefs.find((h) => h.id === picked);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Explore the demonstration station in 3D"
      className="absolute inset-0 z-20 cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button,a")) return;
        drag.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        film.explore.az -= (e.clientX - d.x) * 0.25;
        film.explore.el = Math.min(88, Math.max(6, film.explore.el + (e.clientY - d.y) * 0.2));
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => (drag.current = null)}
      onWheel={(e) => {
        film.explore.dist = Math.min(150, Math.max(16, film.explore.dist * (1 + Math.sign(e.deltaY) * 0.08)));
      }}
    >
      {/* Hotspots, positioned every frame by the scene */}
      {hotspotDefs.map((h, i) => (
        <button
          key={h.id}
          type="button"
          ref={(el) => {
            film.hotspots[i] = el;
          }}
          onClick={() => setPicked(h.id)}
          aria-label={`${h.title}: details`}
          className="group absolute top-0 left-0 -mt-3 -ml-3 flex items-center gap-2 opacity-0 transition-opacity duration-300"
        >
          <span className="relative grid size-6 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-map/40" />
            <span className="relative size-3 rounded-full border-2 border-void bg-map shadow-[0_0_14px_rgba(244,196,48,0.9)]" />
          </span>
          <span
            className={cn(
              "glass t-mono rounded-full px-2.5 py-1 text-[10.5px] whitespace-nowrap text-ink transition-opacity",
              picked === h.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
            )}
          >
            {h.title}
          </span>
        </button>
      ))}

      <div className="glass pointer-events-none absolute top-20 left-4 max-w-sm rounded-2xl p-4 sm:left-6 lg:top-24">
        <p className="t-mono text-[10.5px] text-map">Explore · demonstration scene</p>
        <p className="mt-1 font-display text-xl font-medium">Demonstration station: scan, model and plan.</p>
        <p className="t-mono mt-2 text-[10.5px] text-fog">Drag to orbit · scroll to zoom · arrows · Esc to exit</p>
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close explore mode"
        className="glass absolute top-20 right-4 grid size-11 place-items-center rounded-full sm:right-6 lg:top-24"
      >
        <X className="size-5" />
      </button>

      <div
        role="group"
        aria-label="View"
        className="glass absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-1 rounded-full p-1 md:bottom-8"
      >
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => choose(m.id)}
            className={cn(
              "t-mono inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] transition-colors",
              mode === m.id ? "bg-map text-void" : "text-fog hover:text-ink",
            )}
          >
            <m.icon className="size-3.5" aria-hidden /> {m.label}
          </button>
        ))}
        <span aria-hidden className="mx-1 w-px bg-line" />
        <span className="t-mono hidden items-center gap-2 px-3 text-[11px] text-fog sm:inline-flex">
          <MapIcon className="size-3.5" /> WGS 84
        </span>
      </div>

      {hot ? (
        <div className="glass absolute bottom-40 left-4 max-w-sm rounded-2xl p-5 sm:left-6 md:bottom-8">
          <p className="t-mono text-[10.5px] text-map">{hot.spec}</p>
          <p className="mt-1 font-display text-2xl font-medium tracking-[-0.02em]">{hot.title}</p>
          <p className="mt-2 text-[15px] leading-6 text-ink/80">{hot.body}</p>
          <Link
            href={cta.href}
            onClick={onClose}
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-map hover:underline"
          >
            Get this level of detail for your site <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
