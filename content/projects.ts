import type { Project } from "@/lib/types";

// PLACEHOLDER: every project below is a REPRESENTATIVE sample scope, and the site labels it
// as such. The wording describes what such a project involves; it does not claim a past job.
// Replace with real (anonymised if under NDA) case studies, then set placeholder: false.
export const projects: Project[] = [
  {
    slug: "cgd-network-digitisation",
    title: "CGD network digitisation",
    sector: "City Gas Distribution",
    location: "India",
    stages: ["map"],
    services: ["gas-pipeline-cgd-gis", "gis-mapping-analysis"],
    scope: "Steel and MDPE network with DRS, valves and CP posts",
    metric: { label: "Typical network", value: "100–500 km" },
    software: ["ArcGIS Pro", "AutoCAD", "QGIS"],
    turnaround: "4–8 weeks",
    summary:
      "Years of paper and CAD as-builts become one topologically clean geodatabase that field crews can use.",
    challenge:
      "As-builts sit across hundreds of DWG and scanned PDF sheets in different coordinate systems, and many valves have no attributes.",
    approach: [
      "Georeference legacy sheets to one UTM control network",
      "Digitise steel and PE mains, services, valves, DRS and CP test posts to a UPDM-aligned schema",
      "Run topology rules for dangles, overshoots and connectivity, and fix every issue",
      "Prepare ArcGIS Field Maps layers for crew verification",
    ],
    results: [
      "One authoritative network model in place of hundreds of drawings",
      "Valve-isolation tracing ready for emergency response",
      "An attribute completeness report for every asset class",
    ],
    specs: [
      { label: "Assets", value: "Mains · services · valves · DRS · CP posts" },
      { label: "CRS", value: "WGS 84 / UTM (project zone)" },
      { label: "Schema", value: "UPDM-aligned file GDB" },
    ],
    art: "network",
    placeholder: true,
  },
  {
    slug: "hca-class-location-analysis",
    title: "HCA & class-location analysis",
    sector: "Oil & Gas Transmission",
    location: "India",
    stages: ["map"],
    services: ["gas-pipeline-cgd-gis"],
    scope: "Trunk line with structures inside the impact corridor",
    metric: { label: "Typical line", value: "50–300 km" },
    software: ["ArcGIS Pro", "Python"],
    turnaround: "2–4 weeks",
    summary:
      "Every pipeline segment within the impact radius of schools, hospitals and dense housing is flagged for prioritised inspection.",
    challenge:
      "The operator needs defensible, repeatable HCA results for its integrity plan, and building footprints are often years out of date.",
    approach: [
      "Extract structures from recent imagery and classify occupancy",
      "Calculate the potential impact radius per segment from diameter and MAOP",
      "Apply binary HCA logic (1 = within radius of an identified site) in a scripted, auditable workflow",
    ],
    results: [
      "A scored register of every segment, with HCA segments flagged",
      "A repeatable Python toolbox handed over to the client team",
      "A map book ready for regulatory submission",
    ],
    specs: [
      { label: "Method", value: "PIR buffer + binary overlay" },
      { label: "Analysis", value: "Leak-report hexbin hotspots" },
      { label: "Delivery", value: "GDB · map book · toolbox" },
    ],
    art: "hca",
    placeholder: true,
  },
  {
    slug: "hospital-scan-to-bim",
    title: "Hospital Scan-to-BIM, LOD 300",
    sector: "Healthcare / AEC",
    location: "India",
    stages: ["scan", "model"],
    services: ["laser-scanning-point-cloud", "scan-to-bim"],
    scope: "Multi-storey block, architecture + MEP",
    metric: { label: "Typical area", value: "50,000–250,000 sq ft" },
    software: ["Leica Cyclone", "Revit", "Navisworks"],
    turnaround: "3–6 weeks",
    summary:
      "An as-built Revit model of a working hospital, so an MEP retrofit can be designed without shutting down wards.",
    challenge:
      "Ceilings are congested with ducts, medical gas and cable trays, and the drawings no longer match the building.",
    approach: [
      "Register the scan stations in Cyclone REGISTER 360 and report the residuals",
      "Model architecture, ducts, pipes and trays in Revit at LOD 300",
      "Run Navisworks clash checks against the proposed retrofit",
    ],
    results: [
      "Clashes found and resolved before site work begins",
      "A model-vs-scan deviation report with every delivery",
      "Native RVT, NWD and IFC files",
    ],
    specs: [
      { label: "LOD", value: "300 (architecture + MEP)" },
      { label: "QA", value: "Deviation heatmap vs point cloud" },
      { label: "Formats", value: "RVT · NWD · IFC" },
    ],
    art: "hospital",
    placeholder: true,
  },
  {
    slug: "heritage-facade-elevations",
    title: "Heritage façade point cloud to CAD",
    sector: "Heritage & Conservation",
    location: "India",
    stages: ["scan", "model"],
    services: ["laser-scanning-point-cloud", "cad-drafting"],
    scope: "Measured elevations with ornament-level detail",
    metric: { label: "Drawing scale", value: "1:20 / 1:50" },
    software: ["Leica Cyclone", "AutoCAD"],
    turnaround: "1–3 weeks",
    summary:
      "Measured elevation drawings of a carved stone façade, drafted from the point cloud for a conservation architect.",
    challenge:
      "Hand measurement is impractical because of the height, the fragile carving and the traffic below.",
    approach: [
      "Create orthographic slices and ortho-images from the registered cloud",
      "Draft elevations with stone-joint and ornament detail at 1:20",
    ],
    results: ["Restoration drawings accurate enough to tender from", "No scaffolding needed for the survey"],
    specs: [
      { label: "Scale", value: "1:20 / 1:50" },
      { label: "Tolerance", value: "Drawn to scan, ±5 mm" },
      { label: "Output", value: "DWG · PDF · ortho TIFF" },
    ],
    art: "facade",
    placeholder: true,
  },
  {
    slug: "smart-city-bim-to-gis",
    title: "Smart-city utility BIM-to-GIS",
    sector: "Smart Cities / Municipal",
    location: "India",
    stages: ["model", "map"],
    services: ["bim-to-gis", "gis-mapping-analysis"],
    scope: "Civic buildings and utility corridors in one city model",
    metric: { label: "Typical scope", value: "20–100 buildings" },
    software: ["Revit", "FME", "ArcGIS Pro"],
    turnaround: "4–8 weeks",
    summary: "Civic building BIMs and underground utility models brought into a single city digital twin.",
    challenge:
      "The models come from many consultants, each with its own local origin, units and parameter naming.",
    approach: [
      "Establish survey control and transform each model to the city coordinate system",
      "Build FME schema-mapping workspaces from Revit parameters to GIS fields",
      "Publish lightweight scene layers for the city portal",
    ],
    results: ["One 3D portal for planners and utility departments", "A reusable FME pipeline for future handovers"],
    specs: [
      { label: "Inputs", value: "RVT / IFC models" },
      { label: "Pipeline", value: "FME → File GDB → SLPK" },
      { label: "CRS", value: "Local grid → UTM" },
    ],
    art: "city",
    placeholder: true,
  },
  {
    slug: "us-residential-as-builts",
    title: "US residential as-built drawings",
    sector: "International Outsourcing",
    location: "USA",
    stages: ["scan", "model"],
    services: ["cad-drafting", "scan-to-bim"],
    scope: "As-built floor plans on an overnight delivery cycle",
    metric: { label: "Typical volume", value: "40–60 homes / month" },
    software: ["AutoCAD", "Revit"],
    turnaround: "Overnight (IST)",
    summary:
      "As-built floor plans drafted overnight for US scanning firms, ready when their team logs in.",
    challenge: "The client needs steady volume, US drafting standards and next-morning delivery.",
    approach: [
      "A dedicated drafting pod working US-night hours from India",
      "Client templates, layer standards and a QA checklist built into the process",
    ],
    results: ["Files delivered before the US working day starts", "Drawings on the client's own title block and layers"],
    specs: [
      { label: "Standard", value: "US ANSI sheets, feet-inches" },
      { label: "Layers", value: "Client or AIA layer standard" },
      { label: "Formats", value: "DWG · PDF · RVT on request" },
    ],
    art: "plan",
    placeholder: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
