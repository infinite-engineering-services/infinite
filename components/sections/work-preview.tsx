import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/brand/primitives";
import { WorkIndex } from "@/components/sections/work-index";
import { projects } from "@/content/projects";

/** Continues the paper Proof band: three representative scopes. */
export function WorkPreview() {
  const picks = projects;
  return (
    <Section id="work" tone="paper" label="Representative work" className="pt-12 sm:pt-16">
      <Container>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Representative scopes</Eyebrow>
            <h3 className="mt-3 font-display text-[clamp(26px,3vw,40px)] leading-tight font-medium tracking-[-0.03em]">
              Representative project scopes.
            </h3>
          </div>
          <Link
            href="/work"
            className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium underline-offset-4 hover:underline"
          >
            All representative projects <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10">
          <WorkIndex projects={picks} />
        </div>
      </Container>
    </Section>
  );
}
