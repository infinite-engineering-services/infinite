import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, FileDown } from "lucide-react";
import { PageTransition } from "@/components/motion/transitions";
import {
  Chip,
  Container,
  Icon,
  Photo,
  Section,
  SectionHeading,
  stageDot,
  stagger,
} from "@/components/brand/primitives";
import { WhatsAppIcon } from "@/components/brand/logo";
import { ServiceVisual } from "@/components/brand/service-art";
import { PageHero } from "@/components/sections/page-hero";
import { ProjectCard } from "@/components/sections/project-card";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { Button } from "@/components/ui/button";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { getService, groupMeta, services } from "@/content/services";
import { projects } from "@/content/projects";
import { capabilityPdf, cta, pilot, site, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: `${s.summary} ${s.accuracy}. ${s.turnaround}.`,
    keywords: s.keywords,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const related = projects.filter((p) => p.services.includes(s.slug)).slice(0, 3);
  const siblings = services.filter((o) => o.category === s.category && o.slug !== s.slug);
  const group = groupMeta[s.group];
  const facts: [string, string][] = s.facts ?? [
    ["Accuracy", s.accuracy],
    ["Turnaround", s.turnaround],
    ["Delivered in", s.software.slice(0, 2).join(" · ")],
  ];
  const isCgd = s.slug === "gas-pipeline-cgd-gis";

  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="Service"
          crumbs={[
            { name: "Services", href: "/services" },
            { name: group.label, href: `/services#${s.group}` },
            { name: s.label },
          ]}
          title={s.title}
          intro={s.summary}
          media={
            s.photo ? (
              <Photo name={s.photo} eager sizes="(min-width: 1024px) 45vw, 100vw" />
            ) : (
              <div className="aspect-[16/9] overflow-hidden">
                <ServiceVisual s={s} eager />
              </div>
            )
          }
        >
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={cta.href}>
                {cta.primary} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={whatsappLink(`Hi ${site.name}, I'd like a quote for ${s.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4 text-[#25d366]" /> {cta.secondary}
              </a>
            </Button>
          </div>
          {isCgd && capabilityPdf ? (
            <a
              href={capabilityPdf}
              className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-brand hover:underline"
            >
              <FileDown className="size-4" aria-hidden /> Capability statement (PDF)
            </a>
          ) : null}
        </PageHero>

        <section aria-label="Key facts" className="border-b">
          <Container>
            <dl className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {facts.map(([k, v]) => (
                <div key={k} className="py-6 sm:px-6 sm:first:pl-0">
                  <dt className="text-sm text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <Section label="Deliverables">
          <Container className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <SectionHeading eyebrow="Deliverables" title="What you get." />
              <ul className="mt-8 grid gap-3">
                {s.deliverables.map((d, i) => (
                  <li
                    key={d}
                    data-reveal
                    style={stagger(i)}
                    className="flex items-start gap-3 rounded-lg border bg-surface p-4 shadow-card"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f4c430]/10 text-brand">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-[16px]">{d}</span>
                  </li>
                ))}
              </ul>
              {s.photo ? (
                <>
                  <div data-reveal className="mt-8 aspect-[16/9] overflow-hidden rounded-xl border bg-[#0a0e0d] shadow-card">
                    <ServiceVisual s={s} sizes="(min-width: 1024px) 55vw, 100vw" />
                  </div>
                  <p className="mt-2 text-[13px] text-muted-foreground">
                    {s.media
                      ? `Representative render of a typical ${s.label.toLowerCase()} deliverable.`
                      : `Illustration of a typical ${s.label.toLowerCase()} deliverable.`}
                  </p>
                </>
              ) : null}
            </div>

            <aside data-reveal className="self-start rounded-xl border bg-canvas p-6 sm:p-7 lg:sticky lg:top-28">
              <span className="grid size-11 place-items-center rounded-lg border bg-surface text-brand">
                <Icon name={s.icon} className="size-5" />
              </span>
              <h3 className="mt-6 text-sm font-semibold">Inputs we accept</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.inputs.map((x) => (
                  <Chip key={x}>{x}</Chip>
                ))}
              </div>
              <h3 className="mt-6 text-sm font-semibold">Outputs we deliver</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.outputs.map((x) => (
                  <Chip key={x} className="border-[#f4c430]/30 bg-[#f4c430]/[0.06]">
                    {x}
                  </Chip>
                ))}
              </div>
              <h3 className="mt-6 text-sm font-semibold">Software</h3>
              <p className="mt-1.5 text-[15px] text-muted-foreground">{s.software.join(" · ")}</p>
              <div className="mt-7 rounded-lg border bg-surface p-4">
                <p className="text-sm font-semibold">{pilot.headline}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  {pilot.terms}
                </p>
                <Link href={cta.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                  {cta.primary} <ArrowRight className="size-4" />
                </Link>
              </div>
            </aside>
          </Container>
        </Section>

        {s.scope ? (
          <Section tone="carbon" grid label="Full scope">
            <Container>
              <SectionHeading
                eyebrow="Full scope"
                title="Everything this service covers."
                intro="Take one item or the whole scope. Each is delivered to your standards and checked before hand-over."
              />
              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {s.scope.map((block, i) => (
                  <li
                    key={block.title}
                    data-reveal
                    style={stagger(i)}
                    className="rounded-2xl border border-line bg-void/60 p-6"
                  >
                    <p className="t-mono flex items-center gap-2 text-[11px] text-fog">
                      <span aria-hidden className={cn("size-2 rounded-full", stageDot[s.stage])} />
                      {String(i + 1).padStart(2, "0")} · {block.title}
                    </p>
                    <ul className="mt-5 grid gap-3">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-3 text-[15px] leading-6">
                          <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rotate-45", stageDot[s.stage])} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              {s.applications?.length ? (
                <div data-reveal className="mt-10 flex flex-col gap-4 border-t border-line pt-8 lg:flex-row lg:items-start">
                  <h3 className="t-mono shrink-0 pt-1.5 text-[11px] text-fog lg:w-44">Applications</h3>
                  <ul className="flex flex-wrap gap-2">
                    {s.applications.map((a) => (
                      <li key={a} className="rounded-full border border-line px-3.5 py-1.5 text-sm">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Container>
          </Section>
        ) : null}

        {related.length ? (
          <Section tone="canvas" label="Representative projects">
            <Container>
              <SectionHeading
                eyebrow="Representative projects"
                title="Where this service fits."
                intro="Typical scopes with the ranges and turnaround you can expect."
              />
              <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p, i) => (
                  <li key={p.slug} data-reveal style={stagger(i)}>
                    <ProjectCard p={p} />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        ) : null}

        <Section label="Related services" className="py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold">More in {s.category.toLowerCase()}</h2>
              <Link href={`/services#${s.group}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-map hover:underline">
                All {group.label.toLowerCase()} services <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {siblings.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/services/${o.slug}`}
                    className="group flex h-full flex-col gap-3 rounded-xl border bg-surface p-4 shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <Icon name={o.icon} className="size-5 text-brand" />
                    <span className="text-[15px] leading-snug font-semibold">{o.title}</span>
                    <span className="text-[13px] leading-snug text-muted-foreground">{o.short}</span>
                    <ArrowRight className="mt-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <PilotCTA />
        <JsonLd
          data={
            [
              {
                "@context": "https://schema.org",
                "@type": "Service",
                name: s.title,
                serviceType: s.label,
                category: `${group.label} · ${s.category}`,
                description: s.summary,
                provider: { "@id": `${site.url}/#organization` },
                areaServed: site.areaServed,
                url: `${site.url}/services/${s.slug}`,
              },
              breadcrumbLd([
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: s.title, path: `/services/${s.slug}` },
              ]),
            ] as never
          }
        />
      </div>
    </PageTransition>
  );
}
