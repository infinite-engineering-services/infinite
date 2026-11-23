import Link from "next/link";
import { ArrowRight, Clock, Receipt } from "lucide-react";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/brand/primitives";
import { Button } from "@/components/ui/button";
import { cta, pilot, pricingModels, promises, timezones } from "@/config/site";
import { cn } from "@/lib/utils";

const steps = ["Sign NDA", "Share a sample", "Pilot delivery", "Full production"];

/**
 * The risk-removal band: the pilot project, then how work is priced and how
 * work is priced. Static on purpose (no motion in task zones).
 */
export function DataPricing({ withPilot = true }: { withPilot?: boolean }) {
  return (
    <Section id="pilot" tone="carbon" grid label="Pilot projects and pricing">
      <Container>
        {withPilot ? (
          <>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow="Pilot projects"
                title="Start with a pilot on your own data."
                intro={`${pilot.terms} ${promises.nda}`}
              />
              <Button asChild size="lg" className="shrink-0">
                <Link href={cta.href}>
                  {cta.primary} <ArrowRight />
                </Link>
              </Button>
            </div>

            <ol className="t-mono mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-fog" aria-label="How a pilot runs">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="rounded-full border px-3 py-1.5 text-ink/85">
                    {String(i + 1).padStart(2, "0")} {s}
                  </span>
                  {i < steps.length - 1 ? <span aria-hidden>→</span> : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}

        <div className={cn("grid gap-5", withPilot ? "mt-16" : "")}>
          <div data-reveal className="glass rounded-2xl p-6 sm:p-8">
            <h3 className="flex items-center gap-3 font-display text-2xl font-medium tracking-[-0.02em]">
              <Receipt className="size-5 text-map" aria-hidden />
              How we price
            </h3>
            <ul className="mt-5 grid divide-y sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0">
              {pricingModels.map((m) => (
                <li key={m.name} className="flex items-start justify-between gap-4 border-line py-3.5 sm:border-b">
                  <span>
                    <span className="block text-[15px] font-medium">{m.name}</span>
                    <span className="block text-[15px] leading-6 text-fog">{m.bestFor}</span>
                  </span>
                  <span className="t-mono shrink-0 rounded-full border px-2.5 py-1 text-[10.5px]">{m.unit}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-ink/[0.05] p-4 text-[15px] leading-6">
              A written, fixed quote within one working day of your brief, or after the pilot. No
              hourly billing surprises.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:gap-8">
          <p className="t-mono flex shrink-0 items-center gap-2 text-[11px]">
            <Clock className="size-4 text-map" aria-hidden /> Working hours
          </p>
          <ul className="grid flex-1 gap-2 sm:grid-cols-3">
            {timezones.map((t) => (
              <li key={t.city} className="text-[15px]">
                <span className="text-fog">{t.city}</span>{" "}
                <span className="font-medium tabular-nums">{t.hours}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-fog sm:max-w-[250px]">
            Our working day overlaps UK mornings and runs while US teams are offline.
          </p>
        </div>
      </Container>
    </Section>
  );
}
