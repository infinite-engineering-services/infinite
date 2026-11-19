import Link from "next/link";
import { ArrowRight, ArrowUpRight, Box, Clock, FileLock2, FlaskConical } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cta, promises, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import { chapters } from "./chapters";
import { ExploreButton } from "./explore";
import { FilmStage } from "./film-stage";

const dot = { scan: "bg-scan", model: "bg-model", map: "bg-map" } as const;

function StaticRender({ name, alt }: { name: string; alt: string }) {
  return (
    // Shown only without JS or with reduced motion (the sticky stage is hidden then)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/renders/${name}-800.webp`}
      srcSet={`/renders/${name}-800.webp 800w, /renders/${name}.webp 1600w`}
      sizes="(min-width: 1024px) 50vw, 100vw"
      alt={alt}
      loading="lazy"
      width={1600}
      height={900}
      className="film-static mb-6 aspect-video w-full rounded-2xl border object-cover"
    />
  );
}

/**
 * Homepage story: a sticky 3D stage (scan → model → map) with real HTML
 * chapters scrolling over it on frosted glass. Native scroll throughout.
 */
export function Film() {
  return (
    <section id="film" aria-label="Scan, model, map" className="relative bg-void">
      <div className="film-stage sticky top-0 h-svh overflow-hidden">
        <FilmStage />
      </div>

      <div className="film-flow relative z-10 -mt-[100svh]">
        {/* 00 · Hero */}
        <article
          id="top"
          data-film-chapter
          aria-labelledby="hero-title"
          className="film-chapter mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-4 pt-32 pb-24 sm:px-6 md:pb-12 lg:px-8"
        >
          <StaticRender name="station-scan-hero" alt="Laser scan of a gas metering station: the demonstration scene" />
          <h1 id="hero-title">
            <span className="t-display block text-ink">
              Scan<span className="text-scan">.</span> Model<span className="text-model">.</span> Map
              <span className="text-map">.</span>
            </span>
            <span className="t-h3 mt-5 block max-w-3xl text-ink/90">
              From point cloud to pipeline map, on one coordinate system.
            </span>
          </h1>
          <div className="glass mt-7 max-w-3xl rounded-2xl p-5 sm:p-6">
            <p className="hidden text-[17px] leading-7 text-ink/80 sm:block">
              Laser scanning, Scan-to-BIM, CAD drafting and GIS from one team in Visakhapatnam. Built to
              your templates and LOD, under NDA, with overnight delivery for US and UK teams.
            </p>
            <div className="flex flex-col gap-3 sm:mt-5 sm:flex-row">
              <Button asChild size="lg">
                <Link href={cta.href}>
                  {cta.primary} <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="max-sm:hidden">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" /> {cta.secondary}
                </a>
              </Button>
              <ExploreButton className="film-explore h-12 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-ink/85 transition-colors hover:text-map">
                <Box className="size-4 text-map" aria-hidden /> Explore the station in 3D
              </ExploreButton>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-fog">
              <li className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-map" aria-hidden /> {promises.replyShort}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FileLock2 className="size-3.5 text-map" aria-hidden /> {promises.ndaShort}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FlaskConical className="size-3.5 text-map" aria-hidden /> Pilot projects on your own data
              </li>
            </ul>
          </div>
        </article>

        {chapters.map((c, i) => (
          <article
            key={c.id}
            id={c.id}
            data-film-chapter
            aria-labelledby={`${c.id}-title`}
            className={cn(
              "film-chapter mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
              i === 0 ? "min-h-[110vh]" : "min-h-[150vh]",
            )}
          >
            <div className="sticky top-[38svh] pb-24 lg:top-[22vh] lg:pb-0">
              <StaticRender name={c.poster.name} alt={c.poster.alt} />
              <div className="film-plate glass max-w-xl rounded-2xl p-5 sm:p-7">
                <p className="t-mono flex items-center gap-2 text-fog">
                  <span aria-hidden className={cn("size-2 rounded-full", dot[c.stage])} />
                  {c.index} · {c.label}
                </p>
                <h2
                  id={`${c.id}-title`}
                  className="mt-3 font-display text-[clamp(26px,3.4vw,48px)] leading-[1.04] font-medium tracking-[-0.03em] text-balance"
                >
                  {c.title}
                </h2>
                <p className="mt-3 text-[15px] leading-6 text-ink/75 sm:text-[16px] sm:leading-7">{c.body}</p>
                <ul aria-label="Specifications" className="mt-4 flex flex-wrap gap-1.5">
                  {c.specs.map((s) => (
                    <li key={s} className="t-mono rounded-md border px-2 py-1 text-[11px] text-ink/85">
                      {s}
                    </li>
                  ))}
                </ul>
                {c.id === "model" ? (
                  <ExploreButton className="film-explore mt-4 items-center gap-2 rounded-full bg-map px-4 py-2 text-[14px] font-medium text-void">
                    <Box className="size-4" aria-hidden /> Explore the 3D model
                  </ExploreButton>
                ) : null}
                <ul aria-label="Related services" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4">
                  {c.services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-flex items-center gap-1 text-[14px] font-medium text-ink hover:text-map"
                      >
                        {s.label}
                        <ArrowUpRight className="size-3.5 text-map" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
