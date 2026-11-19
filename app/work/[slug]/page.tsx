import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  PageTransition,
  ProjectImageTransition,
} from "@/components/motion/transitions";
import {
  Container,
  PlaceholderBadge,
  Section,
} from "@/components/brand/primitives";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/sections/page-hero";
import { ProjectArt } from "@/components/sections/project-art";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { getProject, projects } from "@/content/projects";
import { getService } from "@/content/services";
import { site } from "@/config/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title}: Representative Project`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow={`Representative project · ${p.sector}`}
          crumbs={[{ name: "Work", href: "/work" }, { name: p.title }]}
          title={p.title}
          intro={p.summary}
          className="pb-20 sm:pb-28"
        >
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-surface px-2.5 py-1 text-[13px]"
            >
              Sample scope, not a named client project
            </Badge>
            <PlaceholderBadge show={p.placeholder} />
          </div>
        </PageHero>

        <section aria-label="Project visual">
          <Container>
            <div className="-mt-12 aspect-[16/8] overflow-hidden rounded-2xl border bg-[#0a0e0d] shadow-lift sm:-mt-16">
              <ProjectImageTransition slug={p.slug}>
                <ProjectArt
                  kind={p.art}
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  eager
                />
              </ProjectImageTransition>
            </div>
          </Container>
        </section>

        <Section label="Project details" className="pt-14 sm:pt-20">
          <Container className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-12">
              <div data-reveal>
                <h2 className="text-sm font-semibold text-brand">
                  The typical challenge
                </h2>
                <p className="mt-3 font-display text-2xl leading-snug font-semibold text-pretty">
                  {p.challenge}
                </p>
              </div>
              <div data-reveal>
                <h2 className="text-sm font-semibold text-brand">
                  Our approach
                </h2>
                <ol className="mt-5 grid gap-3">
                  {p.approach.map((a, i) => (
                    <li
                      key={a}
                      className="flex gap-4 rounded-lg border bg-surface p-4 shadow-card"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border font-display text-sm font-semibold text-brand">
                        {i + 1}
                      </span>
                      <span className="text-[16px] leading-7">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div data-reveal>
                <h2 className="text-sm font-semibold text-brand">
                  What it delivers
                </h2>
                <ul className="mt-5 grid gap-3">
                  {p.results.map((r) => (
                    <li key={r} className="flex gap-3 text-[16px] leading-7">
                      <Check
                        className="mt-1 size-5 shrink-0 text-[#25d366]"
                        aria-hidden
                      />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside
              data-reveal
              className="self-start overflow-hidden rounded-xl border bg-surface shadow-card lg:sticky lg:top-28"
            >
              <div className="border-b bg-canvas p-5">
                <p className="text-sm text-muted-foreground">
                  {p.metric.label}
                </p>
                <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
                  {p.metric.value}
                </p>
              </div>
              <dl className="divide-y text-[15px]">
                {[
                  { label: "Scope", value: p.scope },
                  ...p.specs,
                  { label: "Software", value: p.software.join(" · ") },
                  { label: "Turnaround", value: p.turnaround },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-[110px_1fr] gap-3 px-5 py-3.5"
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t p-5">
                <p className="text-sm text-muted-foreground">Services used</p>
                <ul className="mt-2 space-y-1.5">
                  {p.services.map((sl) => {
                    const s = getService(sl);
                    return s ? (
                      <li key={sl}>
                        <Link
                          href={`/services/${sl}`}
                          className="text-[15px] font-medium text-brand hover:underline"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </aside>
          </Container>

          <Container className="mt-16 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-[15px] font-medium hover:text-brand"
            >
              <ArrowLeft className="size-4" /> All representative work
            </Link>
            <Link
              href={`/work/${next.slug}`}
              className="inline-flex items-center gap-2 text-[15px] font-medium hover:text-brand sm:text-right"
            >
              Next: {next.title} <ArrowRight className="size-4 shrink-0" />
            </Link>
          </Container>
        </Section>

        <PilotCTA />

        <JsonLd
          data={
            [
              {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: p.title,
                abstract: p.summary,
                about: p.sector,
                creator: { "@id": `${site.url}/#organization` },
                url: `${site.url}/work/${p.slug}`,
              },
              breadcrumbLd([
                { name: "Home", path: "/" },
                { name: "Work", path: "/work" },
                { name: p.title, path: `/work/${p.slug}` },
              ]),
            ] as never
          }
        />
      </div>
    </PageTransition>
  );
}
