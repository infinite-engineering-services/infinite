"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { LayerKey } from "./pipeline-map";
import summary from "./summary.json";

const PipelineMap = dynamic(() => import("./pipeline-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-[#a3aec2]">
      <span className="inline-flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" aria-hidden /> Loading map…
      </span>
    </div>
  ),
});

const layerMeta: {
  key: LayerKey;
  label: string;
  swatch: string;
  desc: string;
}[] = [
  {
    key: "network",
    label: "Network",
    swatch: "bg-[#F2C230]",
    desc: "Steel trunk and PE mains",
  },
  {
    key: "hca",
    label: "HCA buffers",
    swatch: "bg-[#FF5A3C]",
    desc: "Impact radius around schools and hospitals",
  },
  {
    key: "hotspots",
    label: "Leak hotspots",
    swatch: "bg-[#8A6E14]",
    desc: "Hexbin count of leak reports",
  },
  {
    key: "assets",
    label: "Assets",
    swatch: "bg-[#5CC8D7]",
    desc: "DRS, valves, CP test posts",
  },
];

/**
 * Interactive CGD network demo. Mounted only when its tab is opened, so
 * MapLibre (~300 KB gz) never loads for visitors who don't ask for it.
 */
export function MapPanel() {
  const [visible, setVisible] = useState<Record<LayerKey, boolean>>({
    network: true,
    hca: true,
    hotspots: false,
    assets: true,
  });

  const toggle = (k: LayerKey) => {
    setVisible((v) => ({ ...v, [k]: !v[k] }));
    track("map_toggle", { layer: k });
  };

  return (
    <div id="gis-demo" className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="order-2 flex flex-col gap-5 lg:order-1">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Layers</legend>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {layerMeta.map((l) => (
              <button
                key={l.key}
                type="button"
                aria-pressed={visible[l.key]}
                onClick={() => toggle(l.key)}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  visible[l.key]
                    ? "border-foreground/30 bg-surface"
                    : "bg-transparent text-muted-foreground hover:border-foreground/30",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-1 size-3 shrink-0 rounded-sm border border-foreground/30",
                    visible[l.key] ? l.swatch : "bg-transparent",
                  )}
                />
                <span>
                  <span className="block text-sm font-medium">{l.label}</span>
                  <span className="mt-0.5 hidden text-[13px] leading-snug text-muted-foreground sm:block">
                    {l.desc}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="rounded-lg border bg-surface p-4">
          <p className="mb-2 text-sm font-semibold">Network summary</p>
          <table className="w-full text-[13px] tabular-nums">
            <caption className="sr-only">
              Summary of the synthetic demo network
            </caption>
            <tbody className="[&_td]:py-1 [&_td:first-child]:text-muted-foreground [&_td:last-child]:text-right">
              <tr>
                <td>Steel trunk</td>
                <td>{summary.trunkKm} km</td>
              </tr>
              <tr>
                <td>PE mains</td>
                <td>{summary.peKm} km</td>
              </tr>
              <tr>
                <td>DRS / valves / CP</td>
                <td>
                  {summary.drs} / {summary.valves} / {summary.cp}
                </td>
              </tr>
              <tr>
                <td>HCA segments</td>
                <td>
                  {summary.hcaSegments} · {summary.hcaKm} km
                </td>
              </tr>
              <tr>
                <td>Leak reports</td>
                <td>{summary.leakReports}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Synthetic demo data; every feature is fictitious. Basemap ©
          OpenStreetMap contributors, OpenFreeMap.
        </p>
      </div>

      <div className="relative order-1 h-[380px] overflow-hidden rounded-xl border bg-[#0a0e0d] sm:h-[480px] lg:order-2 lg:h-[540px]">
        <div className="animate-fade-in h-full">
          <PipelineMap visible={visible} />
        </div>
      </div>
    </div>
  );
}
