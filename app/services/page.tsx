import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/transitions";
import { Photo } from "@/components/brand/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceAtlas } from "@/components/sections/service-atlas";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { faqs } from "@/content/misc";
import { serviceGroups, services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services: Laser Scanning, CAD, BIM, GIS, Steel Detailing & Technology",
  description:
    "Laser scanning, photogrammetry, LiDAR, CAD drafting, Scan-to-BIM, steel detailing, GIS and telecom design, plus web, mobile, AI, SAP, cloud, cyber security and digital marketing from one team in Visakhapatnam.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="Services"
          crumbs={[{ name: "Services" }]}
          title="Engineering and technology services."
          intro={`${services.length} services in two families. Engineering covers capture, modelling and mapping on one survey control; technology covers the software, data and digital work around it.`}
          media={<Photo name="design-team" eager sizes="(min-width: 1024px) 45vw, 100vw" />}
        >
          <nav aria-label="Service families" className="mt-8 flex flex-wrap gap-2">
            {serviceGroups.map((g) => (
              <a
                key={g.group}
                href={`#${g.group}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.04] px-4 py-2 text-sm font-medium transition-colors hover:border-ink/40"
              >
                {g.title}
                <span className="t-mono text-[11px] text-fog">{String(g.count).padStart(2, "0")}</span>
              </a>
            ))}
          </nav>
        </PageHero>
        <ServiceAtlas group="engineering" id="engineering" />
        <ServiceAtlas group="technology" id="technology" tone="carbon" />
        <Process />
        <Faq items={faqs.slice(0, 5)} />
        <PilotCTA />
        <JsonLd
          data={
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]) as never
          }
        />
      </div>
    </PageTransition>
  );
}
