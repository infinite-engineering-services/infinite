import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Container,
  Section,
  SectionHeading,
  stagger,
} from "@/components/brand/primitives";
import { Button } from "@/components/ui/button";
import { cta, pilot } from "@/config/site";
import { processSteps } from "@/content/misc";

/** Dark band 2 of 3: four steps, then the pilot offer. */
export function Process({ id = "process" }: { id?: string }) {
  return (
    <Section id={id} tone="dark" grid label="How a project runs">
      <Container>
        <SectionHeading
          eyebrow="How a project runs"
          title="From first file to final delivery in four steps."
          intro="You see quality on your own data before you commit, and every delivery comes with the QA evidence behind it."
        />

        <ol className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute top-5 right-8 left-8 hidden h-px bg-gradient-to-r from-[#f4c430]/60 via-border to-border lg:block"
          />
          {processSteps.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={stagger(i)}
              className="relative flex flex-col rounded-xl border bg-surface/70 p-6 backdrop-blur-sm"
            >
              <span className="relative z-10 grid size-10 place-items-center rounded-full border border-[#f4c430]/50 bg-background font-display text-sm font-semibold text-brand">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                {s.body}
              </p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {s.io.map((x) => (
                  <li
                    key={x}
                    className="rounded-md border bg-background px-2 py-0.5 font-mono text-[12px] text-muted-foreground"
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div
          data-reveal
          className="mt-6 grid gap-8 rounded-xl border border-[#f4c430]/30 bg-gradient-to-br from-[#f4c430]/[0.12] to-transparent p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <h3 className="font-display text-2xl font-semibold">
              {pilot.headline}
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              {pilot.terms}
            </p>
          </div>
          <Button asChild size="lg">
            <Link href={cta.href}>
              {cta.primary} <ArrowRight />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
