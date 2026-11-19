import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/brand/primitives";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** Dark hero for inner pages: mono breadcrumb, heading, optional graded media on the right. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  media,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: { name: string; href?: string }[];
  /** Image shown beside the heading on large screens. */
  media?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b pt-32 pb-16 sm:pt-40 sm:pb-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="grid-survey absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]"
      />
      <Container className={cn(media && "grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]")}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="t-mono flex flex-wrap items-center gap-1.5 text-[11px] text-fog">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.name} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3" aria-hidden />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-ink">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} />
          {children}
        </div>
        {media ? (
          <div
            data-reveal="wipe"
            className="relative aspect-[3/2] overflow-hidden rounded-3xl border bg-void"
          >
            {media}
            <span className="glass t-mono absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10.5px] text-ink/80">
              {site.address.city} · {site.geo.lat.toFixed(4)} N {site.geo.lng.toFixed(4)} E
            </span>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
