import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageTransition } from "@/components/motion/transitions";
import {
  Container,
  Icon,
  Photo,
  Section,
} from "@/components/brand/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { industries } from "@/content/misc";
import { getService } from "@/content/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Industries: Gas, Telecom, AEC, Manufacturing, Mining & Enterprise",
  description:
    "Engineering and technology services for gas and telecom utilities, architects and builders, manufacturing, oil, gas and mining, smart cities, survey firms and enterprise teams.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="Industries"
          crumbs={[{ name: "Industries" }]}
          title="Engineering data for asset owners and their partners."
          intro="Gas utilities, AEC firms, municipal bodies and survey companies each need different outputs from the same data. These are the deliverables we provide for each."
        />

        <Section label="Industries we serve" className="pt-14 sm:pt-20">
          <Container className="grid gap-20">
            {industries.map((ind, i) => (
              <article
                key={ind.slug}
                id={ind.slug}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  data-reveal
                  className={cn(
                    "aspect-[3/2] overflow-hidden rounded-2xl border bg-[#0a0e0d] shadow-lift",
                    i % 2 === 1 && "lg:order-2",
                  )}
                >
                  <Photo name={ind.photo} eager={i === 0} />
                </div>
                <div data-reveal>
                  <span className="grid size-11 place-items-center rounded-lg border bg-canvas text-brand">
                    <Icon name={ind.icon} className="size-5" />
                  </span>
                  <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.25rem)] leading-tight font-semibold">
                    {ind.name}
                  </h2>
                  <p className="mt-3 text-lg leading-8 text-muted-foreground">
                    {ind.pitch}
                  </p>
                  <ul className="mt-6 grid gap-2.5">
                    {ind.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[16px]">
                        <Check
                          className="mt-1 size-4 shrink-0 text-brand"
                          aria-hidden
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {ind.services.map((sl) => {
                      const s = getService(sl);
                      return s ? (
                        <Link
                          key={sl}
                          href={`/services/${sl}`}
                          className="inline-flex items-center gap-1.5 rounded-full border bg-surface px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-foreground/40"
                        >
                          {s.title.split(" & ")[0]}
                          <ArrowRight className="size-3.5 text-brand" />
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </article>
            ))}
          </Container>
        </Section>

        <PilotCTA />
        <JsonLd
          data={
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Industries", path: "/industries" },
            ]) as never
          }
        />
      </div>
    </PageTransition>
  );
}
