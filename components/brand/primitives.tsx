import type { CSSProperties, ReactNode } from "react";
import {
  Building2,
  Cuboid,
  DraftingCompass,
  Flame,
  Globe,
  Layers,
  Map as MapIcon,
  Network,
  Radar,
  ScanLine,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/types";
import { photos, type PhotoName } from "@/content/photos";
import { cn } from "@/lib/utils";

/** Stagger index for [data-reveal] siblings. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/* ── Icons ───────────────────────────────────────────────────── */
const icons: Record<IconName, React.ComponentType<LucideProps>> = {
  scan: ScanLine,
  drafting: DraftingCompass,
  cuboid: Cuboid,
  map: MapIcon,
  layers: Layers,
  flame: Flame,
  building: Building2,
  globe: Globe,
  radar: Radar,
  network: Network,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = icons[name];
  return <C aria-hidden strokeWidth={1.75} {...props} />;
}

/* ── Layout ──────────────────────────────────────────────────── */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

/**
 * A page band. `void` is the default dark page, `carbon` a slightly raised
 * dark band, `paper` a light bone interlude. Legacy names map onto these.
 */
export function Section({
  tone = "void",
  id,
  className,
  children,
  label,
  grid,
}: {
  tone?: "void" | "carbon" | "paper" | "light" | "canvas" | "dark";
  id?: string;
  className?: string;
  children: ReactNode;
  label?: string;
  /** Survey dot-and-major grid behind the content. */
  grid?: boolean;
}) {
  const t = tone === "canvas" ? "carbon" : tone === "light" || tone === "dark" ? "void" : tone;
  return (
    <section
      id={id}
      aria-label={label}
      data-theme={t === "void" ? undefined : t}
      className={cn("relative isolate overflow-hidden py-24 sm:py-32", className)}
    >
      {grid ? (
        <div
          aria-hidden
          className="grid-survey absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_75%)]"
        />
      ) : null}
      {children}
    </section>
  );
}

/* ── Type ────────────────────────────────────────────────────── */
const stageDot = { scan: "bg-scan", model: "bg-model", map: "bg-map" } as const;

export function Eyebrow({
  children,
  className,
  stage = "map",
}: {
  children: ReactNode;
  className?: string;
  stage?: keyof typeof stageDot;
}) {
  return (
    <p className={cn("t-mono inline-flex items-center gap-2 text-fog", className)}>
      <span aria-hidden className={cn("size-2 rounded-full", stageDot[stage])} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: As = "h2",
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header
      data-reveal
      className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
      <As
        data-reveal={typeof title === "string" ? "words" : undefined}
        className={cn(
          "font-display font-medium text-balance",
          As === "h1"
            ? "text-[clamp(40px,6.4vw,96px)] leading-[0.95] tracking-[-0.04em]"
            : "text-[clamp(34px,5vw,72px)] leading-[0.98] tracking-[-0.035em]",
        )}
      >
        {typeof title === "string" ? <Kinetic text={title} /> : title}
      </As>
      {intro ? (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-pretty text-muted-foreground">
          {intro}
        </p>
      ) : null}
      {children}
    </header>
  );
}

/** Splits a heading into masked words that rise in one after another. */
export function Kinetic({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="kw">
              <span style={{ "--w": i } as CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

/** File formats, units and spec values: small monospaced chip. */
export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "t-mono inline-flex items-center rounded-md border border-border px-2 py-1 text-[11px] text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Images ──────────────────────────────────────────────────── */
type ImgProps = {
  className?: string;
  sizes?: string;
  eager?: boolean;
  style?: CSSProperties;
};

/** Stock photo from public/photos (3:2, 1600 + 800 px WebP). */
export function Photo({
  name,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  eager,
  style,
}: { name: PhotoName } & ImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/photos/${name}.webp`}
      srcSet={`/photos/${name}-800.webp 800w, /photos/${name}.webp 1600w`}
      sizes={sizes}
      alt={photos[name].alt}
      width={1600}
      height={1067}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      style={style}
      className={cn("grade h-full w-full object-cover", className)}
    />
  );
}

/** Our own render from public/renders (16:9, 1600 + 800 px WebP). */
export function Render({
  name,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  eager,
  style,
}: { name: string; alt: string } & ImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/renders/${name}.webp`}
      srcSet={`/renders/${name}-800.webp 800w, /renders/${name}.webp 1600w`}
      sizes={sizes}
      alt={alt}
      width={1600}
      height={900}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      style={style}
      className={cn("h-full w-full bg-[#0a0e0d] object-cover", className)}
    />
  );
}

/* ── Placeholder badge (only visible in development) ─────────── */
export function PlaceholderBadge({ show }: { show?: boolean }) {
  if (!show || process.env.NODE_ENV === "production") return null;
  return (
    <span
      title="Sample content: replace before launch"
      className="ml-2 inline-block rounded bg-scan px-1.5 py-0.5 align-middle text-[11px] font-medium text-void"
    >
      Placeholder
    </span>
  );
}
