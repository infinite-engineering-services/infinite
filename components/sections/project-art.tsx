import { cn } from "@/lib/utils";

/**
 * Project imagery. Renders come from our own 3D scenes and from GIS layers on a
 * real basemap (`npm run capture`), the CAD plan from `npm run art`.
 * Swap any entry for a real, NDA-cleared project screenshot when available.
 */
const art = {
  network: {
    src: "/renders/gis-network",
    alt: "Gas network digitised in GIS over a city basemap",
  },
  hca: {
    src: "/renders/gis-hca",
    alt: "Pipeline with HCA buffers and leak hotspot hexagons",
  },
  city: {
    src: "/renders/gis-city",
    alt: "3D city model with a gas network overlaid",
  },
  hospital: {
    src: "/renders/hospital-bim",
    alt: "BIM model of a hospital block with exposed MEP services",
  },
  facade: {
    src: "/renders/heritage-facade",
    alt: "Point-cloud elevation of a heritage façade with CAD linework",
  },
  station: {
    src: "/renders/station-bim",
    alt: "BIM model of a gas metering station",
  },
  scan: {
    src: "/renders/station-classified",
    alt: "Classified laser scan of a gas metering station",
  },
  plan: { svg: "/art/plan-cad.svg", alt: "As-built floor plan drafted in CAD" },
} as const;

export type ArtKind = keyof typeof art;

export function ProjectArt({
  kind,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  eager,
}: {
  kind: ArtKind;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const a = art[kind];
  const props =
    "svg" in a
      ? { src: a.svg }
      : {
          src: `${a.src}.webp`,
          srcSet: `${a.src}-800.webp 800w, ${a.src}.webp 1600w`,
          sizes,
        };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={a.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width={1600}
      height={900}
      className={cn("h-full w-full bg-[#0a0e0d] object-cover", className)}
    />
  );
}
