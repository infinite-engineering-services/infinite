import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/transitions";
import { Photo } from "@/components/brand/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesBento } from "@/components/sections/services-bento";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { faqs } from "@/content/misc";

export const metadata: Metadata = {
  title: "Services: Laser Scanning, Scan-to-BIM, CAD Drafting & GIS",
  description:
    "Point cloud processing in Leica Cyclone, Scan-to-BIM in Revit, AutoCAD drafting, GIS mapping, BIM-to-GIS and gas pipeline CGD GIS from one team.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="Services"
          crumbs={[{ name: "Services" }]}
          title="From raw scan to a live GIS layer."
          intro="Pick one service or run the whole pipeline with us. Every deliverable uses the same survey control, so nothing has to be re-aligned later."
          media={<Photo name="design-team" eager sizes="(min-width: 1024px) 45vw, 100vw" />}
        />
        <ServicesBento heading={false} className="pt-14 sm:pt-20" />
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
