import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PlaceholderBadge } from "@/components/brand/primitives";
import { ProjectImageTransition } from "@/components/motion/transitions";
import { ProjectArt } from "@/components/sections/project-art";
import type { Project } from "@/lib/types";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-void">
        <ProjectImageTransition slug={p.slug}>
          <ProjectArt
            kind={p.art}
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </ProjectImageTransition>
        <span className="glass t-mono absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10.5px] text-[#eceae2]">
          Representative
        </span>
        <span className="glass absolute top-3 right-3 grid size-8 place-items-center rounded-full text-[#eceae2] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="t-mono text-[11px] text-muted-foreground">
          {p.sector}
          <PlaceholderBadge show={p.placeholder} />
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug font-medium tracking-[-0.02em]">
          {p.title}
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{p.summary}</p>
        <dl className="mt-auto grid grid-cols-[1.35fr_1fr] gap-4 border-t pt-4">
          <div>
            <dt className="t-mono text-[10.5px] text-muted-foreground">{p.metric.label}</dt>
            <dd className="mt-1 font-display text-lg font-medium tabular-nums">{p.metric.value}</dd>
          </div>
          <div>
            <dt className="t-mono text-[10.5px] text-muted-foreground">Turnaround</dt>
            <dd className="mt-1 font-display text-lg font-medium">{p.turnaround}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
