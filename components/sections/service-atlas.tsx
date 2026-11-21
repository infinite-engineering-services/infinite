import { Container, Section, SectionHeading } from "@/components/brand/primitives";
import { groupMeta, serviceGroups } from "@/content/services";
import type { ServiceGroup } from "@/lib/types";
import { AtlasBody, type AtlasGroup } from "./service-atlas-client";

/** Trim the catalogue to what the atlas needs, so the client payload stays small. */
function atlasData(only?: ServiceGroup): AtlasGroup[] {
  return serviceGroups
    .filter((g) => !only || g.group === only)
    .map((g) => ({
      group: g.group,
      label: g.label,
      count: g.count,
      categories: g.categories.map((c) => ({
        name: c.name,
        stage: c.stage,
        services: c.services.map((s) => ({
          slug: s.slug,
          label: s.label,
          title: s.title,
          short: s.short,
          stage: s.stage,
          icon: s.icon,
          media: s.media,
          art: s.art,
          outputs: s.outputs.slice(0, 4),
        })),
      })),
    }));
}

/**
 * The capability atlas: every service as a big typographic index with a live
 * preview. With no `group` it shows both families behind a toggle (homepage);
 * with a `group` it shows that family only (the /services index).
 */
export function ServiceAtlas({
  group,
  id,
  tone = "void",
  eyebrow,
  title,
  intro,
  headingAs,
  className,
}: {
  group?: ServiceGroup;
  id?: string;
  tone?: "void" | "carbon";
  eyebrow?: string;
  title?: string;
  intro?: string;
  headingAs?: "h1" | "h2";
  className?: string;
}) {
  const meta = group ? groupMeta[group] : null;
  return (
    <Section id={id} tone={tone} grid label={meta?.title ?? "All services"} className={className}>
      <Container>
        <SectionHeading
          as={headingAs}
          eyebrow={eyebrow ?? meta?.label ?? "Capabilities"}
          title={title ?? meta?.title ?? "Engineering and technology, one accountable team."}
          intro={
            intro ??
            meta?.intro ??
            "From laser scans and steel shop drawings to GIS networks, web platforms, AI and security: every service is delivered and supported by the same team."
          }
        />
        <AtlasBody groups={atlasData(group)} />
      </Container>
    </Section>
  );
}
