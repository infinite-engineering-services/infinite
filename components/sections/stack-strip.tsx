import { Container } from "@/components/brand/primitives";
import { Marquee } from "@/components/ui/marquee";
import { software, specs } from "@/config/site";

/**
 * Software the team delivers in, as plain wordmarks (no vendor logos, so no
 * partnership is implied), plus four spec facts. Magic UI Marquee; it pauses
 * on hover and stops under reduced motion.
 */
export function StackStrip() {
  return (
    <section aria-label="Software and specifications" className="border-b bg-canvas">
      <Container className="py-10">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Native files in the software your team already uses
        </p>
        <div className="relative mt-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee pauseOnHover repeat={3} className="[--duration:45s] [--gap:3.5rem]">
            {software.map((s) => (
              <span
                key={s.name}
                className="font-display text-xl font-semibold whitespace-nowrap text-foreground/55"
              >
                {s.name}
              </span>
            ))}
          </Marquee>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
          {specs.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-4">
              <dt className="text-[13px] text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 font-display text-xl font-semibold tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
