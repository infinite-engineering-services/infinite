import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/transitions";
import { Container, Section, stagger } from "@/components/brand/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { ProjectCard } from "@/components/sections/project-card";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Representative Projects: CGD GIS, Scan-to-BIM & CAD",
  description:
    "Representative project scopes: CGD network digitisation, HCA analysis, hospital Scan-to-BIM, heritage façade drawings, smart-city BIM-to-GIS and US as-built drafting.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="Representative work"
          crumbs={[{ name: "Work" }]}
          title="Representative project scopes."
          intro="Typical scopes for gas utilities, healthcare, heritage and smart cities, with the ranges and turnaround you can expect. Client work is shared on request, under NDA."
        />
        <Section label="All representative projects" className="pt-14 sm:pt-20">
          <Container>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <li key={p.slug} data-reveal style={stagger(i % 3)}>
                  <ProjectCard p={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
        <PilotCTA />
        <JsonLd
          data={
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
            ]) as never
          }
        />
      </div>
    </PageTransition>
  );
}
