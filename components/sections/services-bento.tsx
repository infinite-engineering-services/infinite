import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Chip,
  Container,
  Icon,
  Render,
  Section,
  SectionHeading,
} from "@/components/brand/primitives";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { cta, pilot } from "@/config/site";
import { getService } from "@/content/services";
import { industries } from "@/content/misc";
import type { Service } from "@/lib/types";

function media(s: Service) {
  if (s.media.svg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={s.media.src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover object-top opacity-90"
      />
    );
  }
  return (
    <Render
      name={s.media.src}
      alt=""
      sizes="(min-width: 1024px) 66vw, 100vw"
      className="transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}

function card(slug: string, className: string, withImage: boolean) {
  const s = getService(slug)!;
  return (
    <BentoCard
      key={s.slug}
      href={`/services/${s.slug}`}
      name={s.title}
      description={s.short}
      icon={<Icon name={s.icon} className="size-5" />}
      background={withImage ? media(s) : undefined}
      dark={withImage}
      className={className}
      meta={
        withImage ? null : (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {s.outputs.slice(0, 3).map((o) => (
              <Chip key={o}>{o}</Chip>
            ))}
          </div>
        )
      }
    />
  );
}

/** Six services as a bento grid, plus the "who we work for" row. */
export function ServicesBento({
  heading = true,
  className,
}: {
  heading?: boolean;
  className?: string;
}) {
  return (
    <Section id="services" label="Services" className={className}>
      <Container>
        {heading ? (
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Services"
              title="Six services. One team, one coordinate system."
              intro="Pick one service or run the whole pipeline with us. Every deliverable sits on the same survey control, so nothing needs re-aligning later."
            />
            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-brand hover:underline"
            >
              All services <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : null}

        <div data-reveal className={heading ? "mt-12" : undefined}>
          <BentoGrid className="lg:auto-rows-[18.5rem]">
            {card("gas-pipeline-cgd-gis", "md:col-span-2 min-h-[22rem] md:min-h-0", true)}
            {card("scan-to-bim", "md:row-span-2 min-h-[22rem] md:min-h-0", true)}
            {card("gis-mapping-analysis", "", false)}
            {card("bim-to-gis", "", false)}
            {card("laser-scanning-point-cloud", "", false)}
            {card("cad-drafting", "", false)}
            <Link
              href={cta.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-6 md:col-span-2 lg:col-span-1 text-void shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div>
                <p className="text-sm font-medium text-void/70">Not sure where to start?</p>
                <h3 className="mt-2 font-display text-2xl leading-snug font-semibold">
                  {pilot.headline}
                </h3>
                <p className="mt-2 text-[15px] leading-6 text-void/80">
                  {pilot.terms}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                {cta.primary}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </BentoGrid>
        </div>

        {heading ? (
          <div data-reveal className="mt-10 flex flex-col gap-4 border-t pt-8 lg:flex-row lg:items-center">
            <p className="shrink-0 text-sm font-medium text-muted-foreground">
              Who we work for
            </p>
            <ul className="flex flex-wrap gap-2">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/industries#${i.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border bg-surface px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-foreground/40"
                  >
                    <Icon name={i.icon} className="size-4 text-brand" />
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
