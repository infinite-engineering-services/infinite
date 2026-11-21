import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/transitions";
import {
  Container,
  Photo,
  PlaceholderBadge,
  Section,
  SectionHeading,
} from "@/components/brand/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Process } from "@/components/sections/process";
import { DataPricing } from "@/components/sections/data-pricing";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { site, software } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.legalName} is an engineering services company delivering laser scanning, Scan-to-BIM, CAD and GIS from ${site.address.city}, India.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="About"
          crumbs={[{ name: "About" }]}
          title="Accurate engineering data, from one team."
          intro={`${site.legalName} brings scanning, drafting, BIM and GIS specialists together in one team, so the data you collect stays accurate all the way to the decisions it supports.`}
          media={<Photo name="surveyor" eager sizes="(min-width: 1024px) 45vw, 100vw" />}
        />

        <Section label="Our story">
          <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeading eyebrow="Our story" title="Why one team, end to end." />
              {/* PLACEHOLDER: replace with the founder's real story */}
              <div data-reveal className="mt-7 space-y-5 text-[17px] leading-8 text-pretty text-muted-foreground">
                <p>
                  Infrastructure projects collect huge amounts of data: laser
                  scans, legacy drawings, GPS surveys and BIM models. Most of it
                  loses accuracy when it moves between vendors, because the
                  scanner, the drafter and the GIS team each work in their own
                  coordinate system.
                </p>
                <p>
                  We started {site.name} to fix that. One team registers the
                  scan, builds the model and maps the network, all on the same
                  survey control, so deliverables line up the first time.
                </p>
                <p>
                  We work with city gas distribution companies, EPC contractors,
                  architects, municipal bodies and scanning firms in India and
                  abroad.
                  <PlaceholderBadge show />
                </p>
              </div>
            </div>
            <aside data-reveal className="self-start rounded-xl border bg-canvas p-6 sm:p-7">
              <h3 className="text-sm font-semibold">Company record</h3>
              <dl className="mt-4 divide-y text-[15px]">
                {[
                  ["Legal name", site.legalName],
                  ["Office", `${site.address.city}, ${site.address.region}, India`],
                  ["Hours", site.hours],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <h3 className="mt-6 text-sm font-semibold">Software we deliver in</h3>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                {software.map((s) => s.name).join(" · ")}
              </p>
            </aside>
          </Container>
        </Section>

        <Process />
        <DataPricing withPilot={false} />
        <PilotCTA />
        <JsonLd
          data={
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]) as never
          }
        />
      </div>
    </PageTransition>
  );
}
