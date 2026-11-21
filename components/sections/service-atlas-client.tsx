"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { stageDot } from "@/components/brand/primitives";
import { ServiceVisual } from "@/components/brand/service-art";
import { cta } from "@/config/site";
import type { ArtName, IconName, Service, ServiceGroup, Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

export type AtlasItem = {
  slug: string;
  label: string;
  title: string;
  short: string;
  stage: Stage;
  icon: IconName;
  media?: Service["media"];
  art?: ArtName;
  outputs: string[];
};
export type AtlasGroup = {
  group: ServiceGroup;
  label: string;
  count: number;
  categories: { name: string; stage: Stage; services: AtlasItem[] }[];
};

const stageText: Record<Stage, string> = {
  scan: "text-scan",
  model: "text-model",
  map: "text-map",
  build: "text-build",
};

/**
 * Typographic service index with a sticky live preview (large screens). Rows
 * are plain links; hovering or focusing one swaps the preview, whose line art
 * redraws each time. On touch and small screens each row shows its summary.
 */
export function AtlasBody({ groups }: { groups: AtlasGroup[] }) {
  const [gi, setGi] = useState(0);
  const g = groups[gi];
  const flat = useMemo(
    () => g.categories.flatMap((c) => c.services.map((s) => ({ ...s, category: c.name }))),
    [g],
  );
  const [activeSlug, setActiveSlug] = useState(flat[0].slug);
  const [pointerIn, setPointerIn] = useState(false);
  const cur = flat.find((s) => s.slug === activeSlug) ?? flat[0];

  const choose = (i: number) => {
    setGi(i);
    setActiveSlug(groups[i].categories[0].services[0].slug);
  };

  const num = (slug: string) => String(flat.findIndex((x) => x.slug === slug) + 1).padStart(2, "0");
  return (
    <div className="mt-10">
      {groups.length > 1 ? (
        <div role="group" aria-label="Service family" className="inline-flex rounded-full border border-line bg-ink/[0.03] p-1">
          {groups.map((x, i) => (
            <button
              key={x.group}
              type="button"
              aria-pressed={i === gi}
              onClick={() => choose(i)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5",
                i === gi ? "bg-ink text-void" : "text-fog hover:text-ink",
              )}
            >
              {x.label}
              <span className="t-mono ml-2 text-[11px] opacity-70">{String(x.count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div
          key={g.group}
          onPointerEnter={() => setPointerIn(true)}
          onPointerLeave={() => setPointerIn(false)}
        >
          {g.categories.map((c) => (
            <div key={c.name} className="mt-12 first:mt-0">
              <p className="t-mono flex items-center gap-2 text-[11px] text-fog">
                <span aria-hidden className={cn("size-2 rounded-full", stageDot[c.stage])} />
                {c.name}
                <span className="opacity-60">· {String(c.services.length).padStart(2, "0")}</span>
              </p>
              <ul className="mt-3">
                {c.services.map((s) => {
                  const on = s.slug === cur.slug;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        onPointerEnter={() => setActiveSlug(s.slug)}
                        onFocus={() => setActiveSlug(s.slug)}
                        className={cn(
                          "group/row relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-3 border-t border-line py-4 transition-colors duration-300 lg:py-[1.05rem]",
                          pointerIn && !on ? "lg:text-ink/40" : "text-ink",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "absolute -top-px left-0 hidden h-px transition-[width] duration-500 ease-out lg:block",
                            stageDot[s.stage],
                            on ? "w-full" : "w-0",
                          )}
                        />
                        <span className={cn("t-mono text-[11px]", on ? stageText[s.stage] : "text-fog")}>
                          {num(s.slug)}
                        </span>
                        <span>
                          <span className="block font-display text-[clamp(1.4rem,2.5vw,2.15rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                            {s.label}
                          </span>
                          <span className="mt-1.5 block text-[14px] leading-6 text-fog lg:hidden">{s.short}</span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-5 self-center text-fog transition-transform duration-300 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-ink"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="mt-8 border-t border-line pt-6 text-[15px] text-fog">
            Need several of these on one project? We scope them together.{" "}
            <Link href={cta.href} className="inline-flex items-center gap-1 font-medium text-ink hover:text-map">
              {cta.primary} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </p>
        </div>

        <div className="hidden lg:block">
          <div data-reveal className="sticky top-28">
            <div className="overflow-hidden rounded-2xl border border-line bg-[#0a0e0d]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <ServiceVisual key={cur.slug} s={cur} decorative sizes="40vw" className="h-full w-full" />
              </div>
              <div className="p-6 xl:p-7">
                <p className="t-mono flex items-center gap-2 text-[11px] text-fog">
                  <span aria-hidden className={cn("size-2 rounded-full", stageDot[cur.stage])} />
                  {g.label} · {cur.category}
                </p>
                <h3 className="mt-3 font-display text-[26px] leading-tight font-semibold tracking-[-0.02em]">{cur.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-fog">{cur.short}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cur.outputs.map((o) => (
                    <span key={o} className="t-mono rounded-md border border-line px-2 py-1 text-[11px] text-ink/85">
                      {o}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${cur.slug}`}
                  tabIndex={-1}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-map hover:underline"
                >
                  View {cur.label} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
