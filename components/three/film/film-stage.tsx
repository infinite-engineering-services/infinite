"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Pause, Play } from "lucide-react";
import { ScrambleText } from "@/components/motion/scramble-text";
import { cn } from "@/lib/utils";
import { chapters } from "./chapters";
import { ExploreOverlay } from "./explore";
import { clamp01, film, type Tier } from "./store";
import { detectTier } from "./tier";

const FilmCanvas = dynamic(() => import("./film-canvas"), { ssr: false });

const posters = [
  { name: "station-scan-hero", alt: "Laser scan of a gas metering station: the demonstration scene" },
  ...chapters.map((c) => c.poster),
];

const rail = [
  { id: "top", label: "Intro" },
  ...chapters.map((c) => ({ id: c.id, label: c.label })),
];

const HERO_HUD = "DEMONSTRATION SCENE · METERING STATION";

/**
 * The sticky stage behind the film chapters: poster frames (always), the WebGL
 * film (capable devices, after load), a HUD readout and the chapter rail.
 * Scroll position is read natively and written to the shared `film` store.
 */
export function FilmStage() {
  const root = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<Tier>("poster");
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [paused, setPaused] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const [exploring, setExploring] = useState(false);
  const reticle = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  // Device tier, then mount the 3D after load + idle, or on first intent
  useEffect(() => {
    const t = detectTier();
    film.tier = t;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse && (t === "poster" || t === "low")) document.documentElement.classList.add("no-blur");
    const raf = requestAnimationFrame(() => setTier(t));
    if (t === "poster") return () => cancelAnimationFrame(raf);

    // The worker and canvas only start after the page has loaded and gone idle,
    // or on the visitor's first scroll or tap, so they never compete with LCP.
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setMount(true);
    };
    const idle = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(go, { timeout: 2000 })
        : setTimeout(go, 300);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
    window.addEventListener("pointerdown", go, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", idle);
      window.removeEventListener("scroll", go);
      window.removeEventListener("pointerdown", go);
    };
  }, []);

  // Native scroll → chapter coordinate s (0.4 at the top … about 3.6 at the end)
  useEffect(() => {
    const section = root.current?.closest("section");
    if (!section) return;
    const arts = Array.from(section.querySelectorAll<HTMLElement>("[data-film-chapter]"));
    const plates = Array.from(section.querySelectorAll<HTMLElement>(".film-plate"));
    let raf = 0;
    let last = -1;
    const measure = () => {
      raf = 0;
      const ref = window.innerHeight * 0.4;
      let s = 0;
      arts.forEach((a, i) => {
        const r = a.getBoundingClientRect();
        if (r.top <= ref) s = i + clamp01((ref - r.top) / r.height);
      });
      film.s = s;
      // Chapter plates fade as they slide up under the header
      for (const p of plates) {
        const top = p.getBoundingClientRect().top;
        const o = clamp01((top - 40) / 110);
        p.style.opacity = String(o);
        p.style.visibility = o < 0.01 ? "hidden" : "";
      }
      const c = Math.min(arts.length - 1, Math.floor(s));
      if (c !== last) {
        last = c;
        setChapter(c);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(section);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scanner cursor: track the pointer over the stage (fine pointers only) and
  // draw a survey reticle with a live coordinate readout where it hits the ground
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      film.pointer.active = inside && r.bottom > 0;
      film.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      film.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = () => (film.pointer.active = false);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const ret = reticle.current;
      if (!ret) return;
      const on = film.pointer.active && film.cursor.hit;
      ret.style.opacity = on ? "1" : "0";
      if (!on) return;
      ret.style.transform = `translate(${px}px, ${py}px)`;
      if (readout.current) {
        readout.current.textContent = `SCAN  ·  X ${film.cursor.x.toFixed(2)}  Y ${(-film.cursor.z).toFixed(2)} m`;
      }
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      film.pointer.active = false;
    };
  }, []);

  // Explore mode can be opened from buttons anywhere on the page
  useEffect(() => {
    const open = () => {
      if (!film.ready) return;
      setExploring(true);
    };
    window.addEventListener("film:explore", open);
    return () => window.removeEventListener("film:explore", open);
  }, []);
  const closeExplore = useCallback(() => setExploring(false), []);

  const onReady = useCallback((n: number) => {
    setPoints(n);
    setReady(true);
    film.ready = true;
    document.documentElement.classList.add("film-live");
  }, []);
  const onFail = useCallback(() => {
    setFailed(true);
    film.ready = false;
    document.documentElement.classList.remove("film-live");
  }, []);
  const togglePause = () => {
    film.paused = !film.paused;
    setPaused(film.paused);
  };

  const live = mount && !failed && tier !== "poster";
  const hud =
    chapter === 0
      ? `${HERO_HUD} · ${points ? `${points.toLocaleString("en-US")} PTS` : "4 SETUPS"}`
      : chapters[chapter - 1].hud;

  return (
    <div
      ref={root}
      className={cn("inset-0 bg-void", exploring ? "fixed z-[70]" : "absolute")}
    >
      {/* Poster frames: the LCP image, the fallback, and the reduced-power film */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          live && ready && "opacity-0",
        )}
      >
        {posters.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.name}
            src={`/renders/${p.name}.webp`}
            srcSet={`/renders/${p.name}-800.webp 800w, /renders/${p.name}.webp 1600w`}
            sizes="100vw"
            alt={i === 0 ? p.alt : ""}
            width={1600}
            height={900}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : undefined}
            decoding="async"
            data-on={chapter >= i ? "" : undefined}
            className="poster absolute inset-0 h-full w-full object-cover max-md:object-[50%_30%]"
          />
        ))}
      </div>

      {live ? (
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-700",
            ready && "opacity-100",
          )}
        >
          <FilmCanvas
            tier={tier as "low" | "mid" | "high"}
            visible={visible}
            onReady={onReady}
            onFail={onFail}
          />
        </div>
      ) : null}

      {/* Scrims keep text legible over the brightest frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,14,13,0.75),rgba(10,14,13,0.15)_55%,transparent),linear-gradient(to_top,rgba(10,14,13,0.9),transparent_45%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void/80 to-transparent" />

      {/* HUD readout */}
      <div className="glass-light pointer-events-none absolute top-20 left-4 hidden in-[.exploring]:!hidden max-w-[calc(100%-2rem)] rounded-full px-3.5 py-1.5 sm:left-6 md:block lg:top-24 lg:left-8">
        <ScrambleText text={hud} className="t-mono block truncate text-[11px] text-ink/80" />
      </div>

      {/* Scanner reticle (decorative; the system cursor stays) */}
      <div
        ref={reticle}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 opacity-0 transition-opacity duration-200"
      >
        <div className="relative -mt-7 -ml-7 size-14">
          <span className="absolute inset-0 rounded-full border border-scan/80 shadow-[0_0_18px_rgba(255,90,54,0.5)]" />
          <span className="absolute top-1/2 left-0 h-px w-3 bg-scan" />
          <span className="absolute top-1/2 right-0 h-px w-3 bg-scan" />
          <span className="absolute top-0 left-1/2 h-3 w-px bg-scan" />
          <span className="absolute bottom-0 left-1/2 h-3 w-px bg-scan" />
          <span className="absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full bg-scan" />
        </div>
        <span
          ref={readout}
          className="glass t-mono absolute top-6 left-8 rounded-full px-2.5 py-1 text-[10px] whitespace-nowrap text-ink/90"
        />
      </div>

      {exploring ? <ExploreOverlay onClose={closeExplore} /> : null}

      {/* Chapter rail: vertical on desktop, a segmented control on phones */}
      <nav
        aria-label="Film chapters"
        className={cn(
          "glass absolute top-[4.5rem] left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 lg:top-1/2 lg:right-6 lg:left-auto lg:translate-x-0 lg:-translate-y-1/2 lg:flex-col lg:rounded-2xl lg:p-1.5",
          exploring && "hidden",
        )}
      >
        {rail.map((r, i) => (
          <a
            key={r.id}
            href={`#${r.id}`}
            aria-current={chapter === i ? "step" : undefined}
            className={cn(
              "t-mono rounded-full px-3 py-1.5 text-[11px] transition-colors lg:w-full lg:rounded-xl lg:text-left",
              i === 0 && "max-lg:hidden",
              chapter === i ? "bg-ink/12 text-ink" : "text-fog hover:text-ink",
            )}
          >
            <span className="hidden lg:inline">{String(i).padStart(2, "0")} </span>
            {r.label}
          </a>
        ))}
        {live && ready ? (
          <button
            type="button"
            onClick={() => setExploring(true)}
            aria-label="Explore the station in 3D"
            className="t-mono inline-flex items-center gap-1.5 rounded-full bg-map px-3 py-1.5 text-[11px] text-void lg:mt-1 lg:w-full lg:justify-center lg:rounded-xl"
          >
            <Box className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Explore</span>
          </button>
        ) : null}
        {live && ready ? (
          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? "Play animation" : "Pause animation"}
            aria-pressed={paused}
            className="grid size-8 place-items-center rounded-full text-fog transition-colors hover:text-ink lg:mt-1 lg:size-9 lg:rounded-xl"
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        ) : null}
      </nav>
    </div>
  );
}
