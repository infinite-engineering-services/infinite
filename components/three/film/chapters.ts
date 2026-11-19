/** Copy for the three story chapters that follow the hero. */
export const chapters = [
  {
    id: "scan",
    index: "01",
    stage: "scan" as const,
    label: "Scan",
    title: "From raw scans to registered point clouds.",
    body: "Leica, Faro, Trimble and NavVis data, registered in Cyclone to one control network, with a QA report of residuals.",
    specs: ["±2–6 mm registration", "E57", "RCP", "LAS"],
    services: [{ slug: "laser-scanning-point-cloud", label: "Laser scanning & point clouds" }],
    hud: "4 SETUPS · REGISTERED · WGS 84",
    poster: { name: "station-classified", alt: "Classified laser scan of the demonstration gas station" },
  },
  {
    id: "model",
    index: "02",
    stage: "model" as const,
    label: "Model",
    title: "Every model is verified against the scan before delivery.",
    body: "Revit at LOD 100–400 and AutoCAD sheets in your layers and title blocks. Every BIM delivery ships with a model-vs-scan deviation report.",
    specs: ["LOD 100–400", "±5 mm", "RVT", "IFC", "DWG"],
    services: [
      { slug: "scan-to-bim", label: "Scan-to-BIM" },
      { slug: "cad-drafting", label: "CAD drafting" },
    ],
    hud: "REVIT · LOD 300 · BY DISCIPLINE",
    poster: { name: "station-bim", alt: "Revit model of the same station, built from the scan" },
  },
  {
    id: "map",
    index: "03",
    stage: "map" as const,
    label: "Map",
    title: "Every asset placed in its true geographic position.",
    body: "Local (0,0) to UTM. Geodatabases with clean topology, HCA analysis, and steel and PE gas networks with every DRS, valve and CP post attributed. Built for CGD operators and the EPCs who serve them.",
    specs: ["UPDM GDB", "SHP", "GPKG", "SLPK"],
    services: [
      { slug: "gis-mapping-analysis", label: "GIS mapping" },
      { slug: "bim-to-gis", label: "BIM-to-GIS" },
      { slug: "gas-pipeline-cgd-gis", label: "Gas pipeline & CGD GIS" },
    ],
    hud: "DRS-01 · CITY GAS NETWORK · DEMONSTRATION SCENE",
    poster: { name: "gis-network", alt: "The station placed on a city gas network in GIS" },
  },
];

export type Stage = (typeof chapters)[number]["stage"];
