"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useState } from "react";
import MapGL, {
  Layer,
  NavigationControl,
  Popup,
  ScaleControl,
  Source,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import { setWorkerUrl, type StyleSpecification } from "maplibre-gl";
import summary from "./summary.json";

// Worker is served as a static file (see scripts/copy-maplibre-worker.mjs)
setWorkerUrl("/vendor/maplibre-gl-worker.mjs");

export type LayerKey = "network" | "hca" | "hotspots" | "assets";

/** Minimal "survey" basemap on OpenFreeMap vector tiles (no API key, no labels). */
export const surveyStyle: StyleSpecification = {
  version: 8,
  sources: {
    omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#0E1411" } },
    {
      id: "landcover",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      paint: { "fill-color": "#13201A", "fill-opacity": 0.8 },
    },
    {
      id: "park",
      type: "fill",
      source: "omt",
      "source-layer": "park",
      paint: { "fill-color": "#16251C" },
    },
    {
      id: "water",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      paint: { "fill-color": "#0B2026" },
    },
    {
      id: "building",
      type: "fill",
      source: "omt",
      "source-layer": "building",
      minzoom: 14,
      paint: { "fill-color": "#1A2420", "fill-outline-color": "#26302C" },
    },
    {
      id: "roads-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["minor", "service", "track", "path"]],
      ],
      paint: {
        "line-color": "#24302A",
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.4, 16, 2],
      },
    },
    {
      id: "roads-major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["primary", "secondary", "tertiary", "trunk", "motorway"]],
      ],
      paint: {
        "line-color": "#34423B",
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 16, 4],
      },
    },
  ],
};

type Picked = {
  lng: number;
  lat: number;
  props: Record<string, unknown>;
} | null;

const labels: Record<string, string> = {
  id: "ID",
  material: "Material",
  diameter: "Diameter",
  pressure: "Pressure",
  installed: "Installed",
  type: "Type",
  status: "Status",
  name: "Name",
  capacity: "Capacity",
  potential: "Potential",
  count: "Leak reports",
};

export default function PipelineMap({
  visible,
}: {
  visible: Record<LayerKey, boolean>;
}) {
  const [picked, setPicked] = useState<Picked>(null);
  const [cursor, setCursor] = useState<string>("grab");

  const onClick = useCallback((e: MapLayerMouseEvent) => {
    const f = e.features?.[0];
    if (!f) return setPicked(null);
    setPicked({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
      props: f.properties ?? {},
    });
  }, []);

  const [w, s, e, n] = summary.bbox;
  // Layers stay mounted and fade through their opacity (MapLibre animates paint changes over 300 ms)
  const on = (k: LayerKey, opacity = 1) => (visible[k] ? opacity : 0);
  const interactive = [
    ...(visible.network ? ["steel-line", "pe-line"] : []),
    ...(visible.assets ? ["assets-pt"] : []),
    ...(visible.hotspots ? ["hex-fill"] : []),
  ];

  return (
    <MapGL
      initialViewState={{
        bounds: [w, s, e, n],
        fitBoundsOptions: { padding: 40 },
      }}
      mapStyle={surveyStyle}
      style={{ width: "100%", height: "100%" }}
      cooperativeGestures
      attributionControl={{ compact: true }}
      interactiveLayerIds={interactive}
      onClick={onClick}
      onMouseEnter={() => setCursor("pointer")}
      onMouseLeave={() => setCursor("grab")}
      cursor={cursor}
      maxZoom={17}
      minZoom={10}
    >
      <NavigationControl position="top-right" showCompass={false} />
      <ScaleControl position="bottom-left" unit="metric" />

      <Source id="hex" type="geojson" data="/geo/leak-hex.geojson">
        <Layer
          id="hex-fill"
          type="fill"
          paint={{
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "count"],
              1,
              "#3A3412",
              8,
              "#8A6E14",
              20,
              "#F2C230",
              40,
              "#FF5A3C",
            ],
            "fill-opacity": on("hotspots", 0.55),
            "fill-outline-color": "#0E1411",
          }}
        />
      </Source>

      <Source id="hca" type="geojson" data="/geo/hca.geojson">
        <Layer
          id="corridor"
          type="line"
          filter={["==", ["get", "kind"], "corridor"]}
          paint={{
            "line-color": "#FF5A3C",
            "line-width": 1,
            "line-dasharray": [3, 3],
            "line-opacity": on("hca", 0.6),
          }}
        />
        <Layer
          id="hca-fill"
          type="fill"
          filter={["==", ["get", "kind"], "hca"]}
          paint={{ "fill-color": "#FF5A3C", "fill-opacity": on("hca", 0.28) }}
        />
      </Source>

      <Source id="receptors" type="geojson" data="/geo/receptors.geojson">
        <Layer
          id="receptors-pt"
          type="circle"
          paint={{
            "circle-radius": 7,
            "circle-color": "#0E1411",
            "circle-stroke-color": "#FF5A3C",
            "circle-stroke-width": 2.5,
            "circle-opacity": on("hca"),
            "circle-stroke-opacity": on("hca"),
          }}
        />
      </Source>

      <Source id="network" type="geojson" data="/geo/network.geojson">
        <Layer
          id="pe-line"
          type="line"
          filter={["==", ["get", "kind"], "pe"]}
          layout={{ "line-cap": "round" }}
          paint={{
            "line-color": "#7BC47F",
            "line-width": 2.2,
            "line-dasharray": [2, 1.2],
            "line-opacity": on("network"),
          }}
        />
        <Layer
          id="steel-glow"
          type="line"
          filter={["==", ["get", "kind"], "steel"]}
          paint={{
            "line-color": "#F2C230",
            "line-width": 12,
            "line-opacity": on("network", 0.15),
            "line-blur": 4,
          }}
        />
        <Layer
          id="steel-line"
          type="line"
          filter={["==", ["get", "kind"], "steel"]}
          layout={{ "line-cap": "round", "line-join": "round" }}
          paint={{
            "line-color": "#F2C230",
            "line-width": 4,
            "line-opacity": on("network"),
          }}
        />
      </Source>

      <Source id="assets" type="geojson" data="/geo/assets.geojson">
        <Layer
          id="assets-pt"
          type="circle"
          paint={{
            "circle-opacity": on("assets"),
            "circle-stroke-opacity": on("assets"),
            "circle-radius": [
              "match",
              ["get", "kind"],
              "drs",
              8,
              "valve",
              5,
              4,
            ],
            "circle-color": [
              "match",
              ["get", "kind"],
              "drs",
              "#5CC8D7",
              "valve",
              "#0E1411",
              "#EDEFE6",
            ],
            "circle-stroke-color": [
              "match",
              ["get", "kind"],
              "drs",
              "#0E1411",
              "valve",
              "#5CC8D7",
              "#0E1411",
            ],
            "circle-stroke-width": 2,
          }}
        />
      </Source>

      {picked ? (
        <Popup
          longitude={picked.lng}
          latitude={picked.lat}
          onClose={() => setPicked(null)}
          closeOnClick={false}
          maxWidth="260px"
        >
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {Object.entries(picked.props)
              .filter(([k]) => labels[k])
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[#9AA59C]">{labels[k]}</dt>
                  <dd>{String(v)}</dd>
                </div>
              ))}
          </dl>
        </Popup>
      ) : null}
    </MapGL>
  );
}
