"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Box, DraftingCompass, Map as MapIcon, Route } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/brand/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cta } from "@/config/site";

const webp = (name: string) => ({
  src: `/renders/${name}.webp`,
  srcSet: `/renders/${name}-800.webp 800w, /renders/${name}.webp 1600w`,
});

const CompareSlider = dynamic(() => import("./compare-slider"), {
  ssr: false,
  loading: () => <div className="aspect-[4/3] w-full sm:aspect-[16/9]" />,
});

const MapPanel = dynamic(
  () => import("@/components/map/map-demo").then((m) => m.MapPanel),
  { ssr: false, loading: () => <div className="h-[540px]" /> },
);

const pairs = [
  {
    id: "bim",
    tab: "Scan → BIM",
    icon: Box,
    caption: "A registered point cloud on the left, the Revit model built from it on the right.",
    before: { ...webp("station-scan"), label: "Registered point cloud" },
    after: { ...webp("station-bim"), label: "Revit model" },
  },
  {
    id: "cad",
    tab: "Sketch → CAD",
    icon: DraftingCompass,
    caption: "A scanned field sketch on the left, the AutoCAD as-built plan on the right.",
    before: { src: "/art/plan-scan.svg", label: "Scanned field sketch" },
    after: { src: "/art/plan-cad.svg", label: "AutoCAD as-built" },
  },
  {
    id: "gis",
    tab: "Survey → GIS",
    icon: Route,
    caption: "Raw GPS survey shots on the left, the connected, attributed GIS network on the right.",
    before: { ...webp("gis-raw"), label: "Raw GPS survey shots" },
    after: { ...webp("gis-network"), label: "Connected GIS network" },
  },
];

const trigger =
  "h-10 min-w-0 gap-2 rounded-full px-3 text-[13px] text-ink/80 data-[state=active]:bg-void data-[state=active]:text-bone sm:flex-none sm:px-4 sm:text-sm";

export function DeliverableTabs() {
  return (
    <Section id="proof" tone="paper" label="See the deliverable" className="pb-12 sm:pb-16">
      <Container>
        <SectionHeading
          eyebrow="Proof"
          title="What you send us, and what we deliver."
          intro="Drag the divider to compare input and output, or open the interactive map. These are demonstration scenes; client samples are shared under NDA."
        />

        <Tabs defaultValue="bim" className="mt-10 gap-6">
          <TabsList className="grid h-auto w-full group-data-[orientation=horizontal]/tabs:h-auto grid-cols-2 gap-1 rounded-[22px] border bg-raised p-1 sm:flex sm:w-fit sm:gap-0 sm:rounded-full">
            {pairs.map((p) => (
              <TabsTrigger key={p.id} value={p.id} className={trigger}>
                <p.icon aria-hidden /> {p.tab}
              </TabsTrigger>
            ))}
            <TabsTrigger value="map" className={trigger}>
              <MapIcon aria-hidden /> Live map
            </TabsTrigger>
          </TabsList>

          {pairs.map((p) => (
            <TabsContent key={p.id} value={p.id} className="animate-fade-in">
              <div data-reveal="wipe" className="relative overflow-hidden rounded-2xl bg-void shadow-[0_30px_80px_-30px_rgba(10,14,13,0.6)]">
                <CompareSlider before={p.before} after={p.after} />
                <span className="t-mono pointer-events-none absolute top-3 left-3 z-10 rounded-full border border-white/15 bg-void/85 px-3 py-1 text-[11px] text-[#eceae2]">
                  Before<span className="hidden sm:inline"> · {p.before.label}</span>
                </span>
                <span className="t-mono pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-map px-3 py-1 text-[11px] text-void">
                  After<span className="hidden sm:inline"> · {p.after.label}</span>
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {p.caption} Renders of our demonstration scenes. Drag the handle,
                or focus it and use the arrow keys.
              </p>
            </TabsContent>
          ))}
          <TabsContent value="map" className="animate-fade-in">
            <div data-theme="void" className="rounded-2xl p-3 sm:p-5">
              <MapPanel />
            </div>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-[15px]">
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
          >
            Sample files available under NDA <ArrowRight className="size-4" />
          </Link>
        </p>
      </Container>
    </Section>
  );
}
