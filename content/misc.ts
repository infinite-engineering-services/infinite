import type { Faq, Industry, Testimonial } from "@/lib/types";

export const industries: Industry[] = [
  {
    slug: "gas-cgd",
    name: "Gas Pipelines & CGD",
    icon: "flame",
    featured: true,
    pitch:
      "We work fluently with DRS, MRS, CP test posts, PE and steel mains, HCA and class-location analysis.",
    points: [
      "Network digitisation from as-builts and DGPS",
      "HCA, class-location and risk scoring",
      "Leak hotspot binning and integrity dashboards",
      "Compressor and metering station Scan-to-BIM",
    ],
    services: ["gas-pipeline-cgd-gis", "gis-mapping-analysis", "scan-to-bim"],
    photo: "pipeline",
  },
  {
    slug: "aec",
    name: "Architects & Builders",
    icon: "building",
    pitch: "Accurate as-built information before design begins: Scan-to-BIM models and drawings your team can build from.",
    points: ["Renovation and retrofit as-builts", "LOD 200–400 Revit models", "Clash coordination"],
    services: ["scan-to-bim", "cad-drafting", "laser-scanning-point-cloud"],
    photo: "plant",
  },
  {
    slug: "smart-city",
    name: "Smart Cities & Municipal",
    icon: "network",
    pitch: "City-scale GIS and digital twins combining buildings, utilities and terrain.",
    points: ["Utility and property mapping", "BIM-to-GIS digital twins", "Web GIS portals"],
    services: ["bim-to-gis", "gis-mapping-analysis"],
    photo: "city-kolkata",
  },
  {
    slug: "survey",
    name: "Survey & Scanning Firms",
    icon: "radar",
    pitch: "You capture on site; we register, process and model the data under your brand.",
    points: ["White-label registration", "Overflow drafting and modelling", "Fast pilot turnaround"],
    services: ["laser-scanning-point-cloud", "cad-drafting", "scan-to-bim"],
    photo: "scanner",
  },
  {
    slug: "telecom-utilities",
    name: "Telecom & Utilities",
    icon: "tower",
    pitch: "Fibre, wireless, water and power networks designed, drafted and mapped to operator standards.",
    points: [
      "FTTx and HFC design with construction packages",
      "Pole loading, small cell and tower documents",
      "Water, power and sewer networks in GIS",
    ],
    services: ["telecom-network-design", "utility-gis-mapping", "lidar-data-analysis"],
    photo: "city-delhi",
  },
  {
    slug: "oil-gas-mining",
    name: "Oil, Gas & Mining",
    icon: "pickaxe",
    pitch: "Plant, pipeline and site data you can engineer from, from as-built models to terrain and volumes.",
    points: [
      "Plant and pipe-rack as-built models",
      "Stockpile and pit volumes from LiDAR and drone surveys",
      "Cyclone separator and dust-control studies",
    ],
    services: ["as-built-modelling", "lidar-data-analysis", "cyclone-separator-modelling"],
    photo: "plant",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Industrial",
    icon: "factory",
    pitch: "Parts, structures and process equipment modelled for fabrication, retrofit and simulation.",
    points: [
      "3D CAD and reverse engineering of parts",
      "Structural steel shop and erection drawings",
      "Factory layouts from laser scans",
    ],
    services: ["3d-cad-modelling", "structural-steel-detailing", "laser-scanning-point-cloud"],
    photo: "scanner",
  },
  {
    slug: "enterprise",
    name: "Enterprise & Public Sector",
    icon: "landmark",
    pitch: "Software, data and security for healthcare, finance, retail and government teams.",
    points: [
      "Web portals, mobile apps and SAP programmes",
      "Analytics, AI and clinical SAS programming",
      "Cloud migration and cyber security",
    ],
    services: ["website-development", "data-science-ai-ml", "cyber-security"],
    photo: "design-team",
  },
  {
    slug: "international",
    name: "International Outsourcing",
    icon: "globe",
    pitch: "Teams in the US, UK and Middle East work with us across time zones: our IST working day overlaps UK mornings and runs while US teams are offline.",
    points: ["Time-zone advantage for US and UK teams", "Your templates and standards", "NDA and secure transfer"],
    services: ["cad-drafting", "scan-to-bim", "gis-mapping-analysis"],
    photo: "design-team",
  },
];

// PLACEHOLDER: replace with real testimonials (with permission)
export const testimonials: Testimonial[] = [
  {
    quote:
      "They understood our network straight away. The valve register and connectivity checks saved our GIS team months of rework.",
    role: "GIS Manager",
    org: "CGD operator, Gujarat",
    placeholder: true,
  },
  {
    quote:
      "The Revit model matched the scan within tolerance and arrived ahead of schedule. Our MEP retrofit went to site with no surprises.",
    role: "Project Director",
    org: "Healthcare design consultancy",
    placeholder: true,
  },
  {
    quote:
      "We send scans at 6 pm Texas time and the drawings are waiting when we log in. It's like having a night shift.",
    role: "Operations Lead",
    org: "3D scanning firm, USA",
    placeholder: true,
  },
];

export const faqs: Faq[] = [
  {
    q: "Do you also deliver software and IT projects?",
    a: "Yes. Alongside our engineering work we build websites, mobile apps and IoT systems, and deliver data science, SAS, SAP, cloud, cyber security, software testing and digital marketing. Many clients use both, for example a GIS dataset served through a custom web portal.",
  },
  {
    q: "Which file formats do you accept?",
    a: "Point clouds in E57, RCP/RCS, LAS/LAZ, PTX and native Leica, Faro or Trimble projects. CAD/BIM in DWG, DXF, RVT, IFC and NWD. GIS in SHP, File GDB, GeoPackage, GeoJSON, KML and CSV. We also convert scanned PDFs and paper drawings.",
  },
  {
    q: "How accurate are your deliverables?",
    a: "Scan registration typically achieves ±2–6 mm residuals. BIM models are built to the LOD you specify (100–400) and checked against the point cloud with a deviation report. GIS data is topology-validated and delivered with its coordinate system documented.",
  },
  {
    q: "Can you start with a small pilot?",
    a: "Yes. We can begin with a pilot on a small sample of your data, so you can assess quality and turnaround before committing to the full project.",
  },
  {
    q: "How do you keep our data confidential?",
    a: "We sign your NDA, or ours, before you send any files. Tell us how your organisation needs data transferred and stored, and we work to that.",
  },
  {
    q: "How is pricing calculated?",
    a: "Pricing depends on the service: per sq ft or sq m for Scan-to-BIM, per sheet for drafting, per km or per asset for network GIS, or a fixed project price. Share your scope and we'll quote within one working day.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We work with teams in the USA, UK, Middle East and Australia. Our IST working day overlaps UK mornings and runs while US teams are offline, so work moves forward outside your hours. Delivery dates are agreed per project.",
  },
  {
    q: "Do you provide on-site laser scanning?",
    a: "We focus on processing, modelling and mapping, and work with partner survey crews for on-site capture. Tell us your location and we'll arrange it.",
  },
];

/** How a project runs. Inputs and outputs are shown as format chips. */
export const processSteps = [
  {
    title: "NDA & brief",
    body: "Send a link to your scans, drawings or GIS data and tell us the LOD, standards and deadline. We sign the NDA first.",
    io: ["E57", "RCP", "DWG", "PDF", "SHP"],
  },
  {
    title: "Pilot project",
    body: "We deliver a small sample on your own data, so you can check quality before you commit.",
    io: ["Sample", "Your data", "Review"],
  },
  {
    title: "Production",
    body: "A dedicated team works in your templates and standards, with progress updates on WhatsApp or email.",
    io: ["RVT", "DWG", "GDB"],
  },
  {
    title: "QA & delivery",
    body: "Checklist QA, deviation and topology reports, native files, and revisions within scope.",
    io: ["QA report", "IFC", "GPKG"],
  },
];
