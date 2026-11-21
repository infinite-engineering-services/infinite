import type { Service, ServiceGroup } from "@/lib/types";

/**
 * The full service catalogue, in display order. Engineering services follow
 * the pipeline (capture → model → map); technology services are grouped by
 * what they do for the client.
 *
 * Software lists on services added in November 2026 are the typical toolset
 * for that discipline and are marked for the owner to confirm.
 */
export const services: Service[] = [
  /* ── Engineering · Capture ─────────────────────────────────── */
  {
    slug: "laser-scanning-point-cloud",
    group: "engineering",
    category: "Capture",
    stage: "scan",
    icon: "scan",
    title: "3D Laser Scanning & Point Cloud Processing",
    label: "3D laser scanning",
    short: "Registration, cleaning and classification of terrestrial and mobile scans.",
    summary:
      "We register, clean, georeference and classify raw scan data in Leica Cyclone, so every downstream drawing, model and map sits on one surveyed control network.",
    deliverables: [
      "Registered and georeferenced point clouds",
      "Noise removal, decimation and unification",
      "Classification (ground, structure, MEP, vegetation)",
      "Registration QA report with residuals",
      "TruView / web viewer packages",
    ],
    inputs: ["Leica, Faro, Trimble and NavVis raw scans", "E57", "LAS / LAZ", "PTX / PTS"],
    outputs: ["RCP / RCS", "E57", "LAS / LAZ", "LGS", "QA report (PDF)"],
    software: ["Leica Cyclone", "Cyclone REGISTER 360", "Autodesk ReCap", "CloudCompare"],
    accuracy: "±2–6 mm registration",
    turnaround: "48 h pilot · 3–10 days typical",
    keywords: ["point cloud processing services", "Leica Cyclone registration", "3D laser scanning India"],
    scope: [
      {
        title: "Processing",
        items: [
          "Cloud-to-cloud and target-based registration",
          "Georeferencing to project or national grid control",
          "Noise, ghost and moving-object removal",
          "Decimation, unification and tiling for large sites",
        ],
      },
      {
        title: "Analysis",
        items: [
          "Exact measurements, sections and elevation slices",
          "Reverse engineering of plant, parts and structures",
          "Deformation and as-built versus design comparison",
          "Digital-twin base data for maintenance, renovation and expansion",
        ],
      },
      {
        title: "Sharing",
        items: [
          "Shareable web viewers for virtual site visits",
          "Stakeholder packages for design and planning reviews",
          "Hand-over to CAD, BIM and GIS teams on one control network",
        ],
      },
    ],
    applications: ["Construction", "Architecture", "Engineering", "Manufacturing", "Heritage preservation", "Plant maintenance"],
    media: { src: "station-classified", alt: "Classified laser scan of a gas metering station" },
    photo: "scanner",
  },
  {
    slug: "photogrammetry",
    group: "engineering",
    category: "Capture",
    stage: "scan",
    icon: "camera",
    title: "Photogrammetry & Drone Mapping",
    label: "Photogrammetry",
    short: "Measured 3D models, orthomosaics and surface models from photographs.",
    summary:
      "We turn overlapping aerial and close-range photographs into measured, georeferenced 3D outputs: orthomosaics, surface models, dense point clouds and textured meshes for documentation, inspection and planning.",
    deliverables: [
      "Georeferenced orthomosaics",
      "Digital surface and terrain models (DSM / DTM)",
      "Dense point clouds",
      "Textured 3D meshes",
      "Contours and accuracy report against ground control",
    ],
    inputs: ["UAV / drone imagery", "Close-range and terrestrial photographs", "Ground control points (GCP)", "RTK / PPK image positions"],
    outputs: ["GeoTIFF orthomosaic", "DSM / DTM", "LAS / LAZ", "OBJ / FBX mesh", "3D Tiles / SLPK", "Contours (DWG / SHP)"],
    // PLACEHOLDER: confirm toolset
    software: ["Agisoft Metashape", "Pix4Dmapper", "RealityCapture", "Global Mapper"],
    accuracy: "Checked against ground control",
    turnaround: "Scoped after a sample review",
    keywords: ["photogrammetry services India", "drone mapping orthomosaic", "3D model from photos"],
    scope: [
      {
        title: "Aerial",
        items: [
          "Drone survey processing with GCP and RTK / PPK",
          "Orthomosaics for site planning and progress records",
          "Stockpile and earthwork surface models",
        ],
      },
      {
        title: "Close-range",
        items: [
          "Façade and heritage documentation",
          "Inspection models of structures and equipment",
          "Object and artefact models for archives and media",
        ],
      },
      {
        title: "Deliverables",
        items: [
          "Dense point clouds and textured meshes",
          "Maps and contours from the surface model",
          "Web-ready 3D for stakeholders",
        ],
      },
    ],
    applications: ["Cultural heritage", "Urban development", "Environmental management", "Architecture", "Archaeology", "Film and games"],
    art: "photogrammetry",
  },
  {
    slug: "lidar-data-analysis",
    group: "engineering",
    category: "Capture",
    stage: "scan",
    icon: "mountain",
    title: "LiDAR Data Analysis & Visualisation",
    label: "LiDAR analysis",
    short: "Classified terrain, contours, volumes and corridor models from aerial and mobile LiDAR.",
    summary:
      "We process aerial, mobile and terrestrial LiDAR from raw points to engineering surfaces: bare-earth terrain, contours, volumes, floodplain breaklines and classified features along corridors and power lines.",
    deliverables: [
      "Classified point clouds (ASPRS classes)",
      "Bare-earth DTM and DSM",
      "Contours, breaklines and TIN surfaces",
      "Volumetric and cut-fill reports",
      "Elevation profiles, slope and intensity images",
    ],
    inputs: ["Aerial LiDAR (LAS / LAZ)", "Mobile LiDAR with trajectory (IMU / GNSS)", "Terrestrial scans", "Survey control"],
    outputs: ["Classified LAS / LAZ", "BIN / EBN", "DTM / DSM (GeoTIFF)", "TIN", "Contours (DWG / SHP)", "Volume reports (PDF)"],
    // PLACEHOLDER: confirm toolset
    software: ["TerraScan / TerraModeler", "Global Mapper", "LAStools", "ArcGIS Pro", "Civil 3D"],
    accuracy: "Contours at 1 ft for design, 2–5 ft for planning",
    turnaround: "Scoped after a sample review",
    keywords: ["LiDAR data processing services", "DTM DSM generation", "LiDAR classification India"],
    scope: [
      {
        title: "Terrain",
        items: [
          "Precision bare-earth classified DTMs",
          "Detailed contour mapping",
          "Terrain extraction and planimetric feature classification",
          "Raster, TIN, contour and slope models",
        ],
      },
      {
        title: "Engineering",
        items: [
          "Corridor surveys for roads, rail and pipelines",
          "Volumetric analysis of stockpiles and earthworks",
          "Floodplain mapping with 3D breaklines",
          "Elevation profiles and cross-sections",
        ],
      },
      {
        title: "Features",
        items: [
          "Intensity images and intensity-based contours",
          "3D street-view extraction from mobile LiDAR",
          "Electric tower classification and wire detection",
        ],
      },
    ],
    applications: ["Civil engineering", "Urban planning", "Mining", "Forestry", "Environmental management", "Power utilities"],
    art: "lidar",
  },

  /* ── Engineering · Model & detail ──────────────────────────── */
  {
    slug: "cad-drafting",
    group: "engineering",
    category: "Model & detail",
    stage: "model",
    icon: "drafting",
    title: "2D CAD Drafting & Drawing Conversion",
    label: "2D CAD drafting",
    short: "Floor plans, elevations, sections and P&IDs from scans, sketches or PDFs.",
    summary:
      "We produce precise 2D AutoCAD deliverables from point clouds, legacy PDFs or site sketches, drawn to your layer standards, title blocks and plot styles.",
    deliverables: [
      "As-built floor plans, elevations and sections",
      "Pipeline alignment sheets and crossing drawings",
      "P&ID and isometric drafting",
      "PDF / scanned drawing to CAD conversion",
      "Layer, block and CTB standards compliance",
    ],
    inputs: ["Point clouds (RCP / E57)", "PDF / TIFF scans", "Hand sketches", "Survey CSV"],
    outputs: ["DWG", "DXF", "PDF sets", "DGN on request"],
    software: ["AutoCAD", "AutoCAD Plant 3D", "Civil 3D"],
    accuracy: "Drawn to scan tolerance ±5 mm",
    turnaround: "24–72 h per sheet batch",
    keywords: ["AutoCAD drafting outsourcing India", "2D CAD drawings from point cloud", "PDF to CAD conversion"],
    scope: [
      {
        title: "From scans",
        items: [
          "2D plans, elevations and sections from point clouds",
          "Measured drawings for renovation and heritage conservation",
          "Topographic and site plans",
        ],
      },
      {
        title: "From documents",
        items: [
          "PDF, TIFF and paper drawing conversion",
          "Sketch and markup to CAD",
          "Drawing set clean-up and re-standardisation",
        ],
      },
      {
        title: "Disciplines",
        items: [
          "Architectural and structural drawings",
          "P&IDs, isometrics and alignment sheets",
          "Civil and infrastructure drawings",
        ],
      },
    ],
    applications: ["Architects", "Engineers", "Surveyors", "Planners", "Infrastructure development", "Heritage conservation"],
    media: { src: "/art/plan-cad.svg", alt: "As-built floor plan drafted in AutoCAD", svg: true },
    photo: "design-team",
  },
  {
    slug: "as-built-modelling",
    group: "engineering",
    category: "Model & detail",
    stage: "model",
    icon: "building",
    title: "As-Built Modelling",
    label: "As-built modelling",
    short: "3D records of buildings and plants exactly as they were built, including site changes.",
    summary:
      "We model existing buildings, plants and infrastructure as they stand today, capturing every change made during construction, so renovations, maintenance and compliance start from a verified record.",
    deliverables: [
      "3D as-built models of buildings, plants and structures",
      "Piping, equipment and steel models for industrial sites",
      "Construction changes reconciled against design",
      "Drawings extracted from the model",
      "Model-vs-scan deviation checks",
    ],
    inputs: ["Point clouds", "Design drawings and models", "Site photographs", "Markups and RFIs"],
    outputs: ["RVT", "NWD / NWC", "DWG", "IFC", "PCF / isometrics"],
    // PLACEHOLDER: confirm toolset
    software: ["Revit", "AutoCAD Plant 3D", "Navisworks", "Leica Cyclone 3DR"],
    accuracy: "Verified against the scan",
    turnaround: "Scoped after a sample review",
    keywords: ["as-built modelling services", "as-built 3D model", "plant as-built modelling India"],
    scope: [
      {
        title: "Buildings",
        items: [
          "Architecture, structure and MEP as constructed",
          "Renovation and retrofit base models",
          "Heritage and historical documentation",
        ],
      },
      {
        title: "Plants and infrastructure",
        items: [
          "Piping, equipment and pipe-rack models",
          "Tie-in and brownfield modification models",
          "Infrastructure records for maintenance",
        ],
      },
      {
        title: "Records",
        items: [
          "Facility management data and asset tags",
          "Compliance documentation for codes and regulators",
          "Hand-over packages for owners and operators",
        ],
      },
    ],
    applications: ["Architects", "Engineers", "Contractors", "Facility managers", "Renovation", "Infrastructure maintenance"],
    art: "asbuilt",
  },
  {
    slug: "scan-to-bim",
    group: "engineering",
    category: "Model & detail",
    stage: "model",
    icon: "cuboid",
    title: "Scan-to-BIM Modelling",
    label: "Scan-to-BIM",
    short: "Revit models at LOD 200–400 built directly on registered point clouds.",
    summary:
      "We build intelligent Revit models of architecture, structure and MEP from your point clouds, then verify them against the scan with deviation analysis before delivery.",
    deliverables: [
      "Architectural, structural and MEP Revit models",
      "LOD 200 / 300 / 350 / 400 per BIMForum spec",
      "Families with parameters and asset data",
      "Clash detection and coordination (Navisworks)",
      "Model-vs-scan deviation heatmaps",
    ],
    inputs: ["RCP / RCS", "E57", "Existing DWG", "Site photos"],
    outputs: ["RVT", "IFC 2x3 / 4", "NWD", "DWG sheets", "COBie on request"],
    software: ["Revit", "Navisworks", "Autodesk ReCap", "Dynamo"],
    accuracy: "LOD 100–400, verified against scan",
    turnaround: "3–15 days by area",
    keywords: ["Scan to BIM services India", "point cloud to Revit outsourcing", "as-built BIM"],
    media: { src: "station-bim", alt: "Revit model of a gas metering station built from a laser scan" },
    photo: "plant",
  },
  {
    slug: "3d-cad-modelling",
    group: "engineering",
    category: "Model & detail",
    stage: "model",
    icon: "box",
    title: "3D CAD Modelling & Reverse Engineering",
    label: "3D CAD modelling",
    short: "Parametric parts, assemblies and product models, including mesh-to-CAD reverse engineering.",
    summary:
      "We build parametric 3D models of parts, assemblies, products and buildings for design, simulation and visualisation, and rebuild existing components from scans when no drawings exist.",
    deliverables: [
      "Parametric part and assembly models",
      "Reverse engineering from scans (mesh to CAD)",
      "Architectural and product design models",
      "2D manufacturing drawings with GD&T",
      "Renders and models prepared for simulation",
    ],
    inputs: ["Sketches and 2D drawings", "STL / OBJ scan meshes", "Point clouds", "Physical-part photographs"],
    outputs: ["STEP / IGES", "SLDPRT / SLDASM", "IPT / IAM", "STL", "DWG / PDF drawings"],
    // PLACEHOLDER: confirm toolset
    software: ["SolidWorks", "Autodesk Inventor", "Fusion 360", "Geomagic Design X"],
    accuracy: "Modelled to drawing or scan tolerance",
    turnaround: "Scoped after a sample review",
    keywords: ["3D CAD modelling services", "reverse engineering scan to CAD", "SolidWorks modelling outsourcing"],
    scope: [
      {
        title: "Product and mechanical",
        items: [
          "Part and assembly modelling",
          "Design for manufacture and assembly",
          "Sheet-metal, weldment and casting models",
        ],
      },
      {
        title: "Reverse engineering",
        items: [
          "Scan mesh to parametric CAD",
          "Legacy parts without drawings",
          "Wear and deviation comparison",
        ],
      },
      {
        title: "Design support",
        items: [
          "Architectural 3D models",
          "Simulation-ready geometry",
          "Visualisation and marketing renders",
        ],
      },
    ],
    applications: ["Manufacturing", "Automotive", "Aerospace", "Architecture", "Consumer electronics"],
    art: "cad3d",
  },
  {
    slug: "structural-steel-detailing",
    group: "engineering",
    category: "Model & detail",
    stage: "model",
    icon: "beam",
    title: "Structural Steel Detailing",
    label: "Steel detailing",
    short: "Shop and erection drawings, 3D steel models and fabrication data.",
    summary:
      "We detail structural steel from design drawings to fabrication-ready output: a coordinated 3D model, shop and erection drawings, material lists and CNC data that fit first time on site.",
    deliverables: [
      "3D steel model (stick model to fully detailed)",
      "Shop drawings for beams, columns, braces and plates",
      "Erection and anchor-bolt drawings",
      "Material take-off and bills of materials",
      "CNC / NC1 (DSTV) files and part lists",
    ],
    inputs: ["Structural and architectural drawings (PDF / DWG)", "IFC / Revit design models", "Connection design criteria", "RFIs and revisions"],
    outputs: ["Shop drawings (PDF / DWG)", "Erection drawings", "NC1 / DSTV", "KSS / BOM", "IFC model"],
    // PLACEHOLDER: confirm toolset and detailing codes
    software: ["Tekla Structures", "Advance Steel", "AutoCAD"],
    accuracy: "Detailed to AISC, IS 800 or Eurocode practice",
    turnaround: "Scoped after a sample review",
    keywords: ["structural steel detailing services India", "steel shop drawings", "Tekla detailing outsourcing"],
    scope: [
      {
        title: "Modelling",
        items: [
          "Stick modelling from design drawings",
          "Connection modelling and clash checks",
          "Miscellaneous steel: stairs, handrails, platforms",
        ],
      },
      {
        title: "Drawings and data",
        items: [
          "Shop and erection drawings",
          "Material take-off and bills of materials",
          "CNC data for fabrication",
        ],
      },
      {
        title: "Coordination",
        items: [
          "Connection design support with the engineer of record",
          "Drawing stamping coordination with licensed engineers",
          "RFI logs and revision management",
        ],
      },
    ],
    applications: ["Commercial buildings", "Industrial facilities", "Healthcare", "Sports complexes", "Power generation", "Bridges and infrastructure"],
    art: "steel",
  },
  {
    slug: "cyclone-separator-modelling",
    group: "engineering",
    category: "Model & detail",
    stage: "model",
    icon: "tornado",
    title: "Cyclone Separator Modelling & CFD",
    label: "Cyclone separator CFD",
    short: "Simulation-led design of cyclone separators for particle capture and emissions control.",
    summary:
      "We model and simulate cyclone separators before they are built, tuning geometry for your particle size, density and flow rate so you get the collection efficiency you need at an acceptable pressure drop.",
    deliverables: [
      "3D geometry of the cyclone and inlet",
      "CFD flow and particle-tracking simulation",
      "Collection efficiency and pressure-drop curves",
      "Design variants and optimisation report",
      "Fabrication drawings of the selected design",
    ],
    inputs: ["Process data: flow rate, temperature, gas properties", "Particle size distribution and density", "Existing drawings or site constraints", "Emission limits"],
    outputs: ["Simulation report (PDF)", "Efficiency curves", "STEP model", "GA drawings (DWG / PDF)"],
    // PLACEHOLDER: confirm toolset
    software: ["ANSYS Fluent", "SolidWorks Flow Simulation", "OpenFOAM"],
    accuracy: "Validated against design data",
    turnaround: "Scoped after a sample review",
    keywords: ["cyclone separator design", "cyclone CFD simulation", "dust collector modelling"],
    scope: [
      {
        title: "Simulation",
        items: [
          "Gas flow and vortex simulation",
          "Particle tracking and cut-size prediction",
          "Pressure-drop estimation",
        ],
      },
      {
        title: "Optimisation",
        items: [
          "Geometry tuning for particle size, density and flow rate",
          "Design changes tested before fabrication",
          "Retrofit studies for existing units",
        ],
      },
      {
        title: "Compliance",
        items: [
          "Particulate capture targets",
          "Emissions reduction support",
          "Environmental and safety documentation",
        ],
      },
    ],
    applications: ["Manufacturing", "Chemical processing", "Mining", "Energy production", "Cement and minerals"],
    art: "cyclone",
  },

  /* ── Engineering · Map & network ───────────────────────────── */
  {
    slug: "gis-mapping-analysis",
    group: "engineering",
    category: "Map & network",
    stage: "map",
    icon: "map",
    title: "GIS Mapping & Spatial Analysis",
    label: "GIS mapping",
    short: "Digitisation, geodatabases, terrain models, suitability studies and cartography.",
    summary:
      "We build clean, topologically correct geodatabases and run the analyses that turn them into decisions: hotspot binning, buffer and proximity studies, suitability models and map books.",
    deliverables: [
      "Digitisation from imagery, scans and CAD",
      "Geodatabase design and attribute schemas",
      "Hexbin hotspot and density analysis",
      "Binary and weighted suitability modelling",
      "Map books, atlases and web maps",
    ],
    inputs: ["SHP", "GDB", "GPKG", "CSV / XY", "GeoTIFF", "KML", "DWG"],
    outputs: ["File GDB", "GeoPackage", "SHP", "GeoJSON", "Web map / dashboard", "PDF map books"],
    software: ["ArcGIS Pro", "QGIS", "FME", "Python (GeoPandas / ArcPy)"],
    accuracy: "Topology-validated, CRS-documented",
    turnaround: "48 h pilot · 1–3 weeks typical",
    keywords: ["GIS mapping services India", "GIS digitisation outsourcing", "spatial analysis"],
    scope: [
      {
        title: "Data capture",
        items: [
          "Image georectification, georeferencing and spatial adjustment",
          "Map digitisation, vectorisation and feature extraction",
          "Aerial and satellite image mapping",
          "Parcel mapping and updating",
        ],
      },
      {
        title: "Data quality",
        items: [
          "Attribution to your schema",
          "Topology validation",
          "Geodatabase modelling and design",
          "Data integration and format conversion",
        ],
      },
      {
        title: "Analysis and terrain",
        items: [
          "Spatial analysis and modelling",
          "Thematic mapping",
          "DEM creation, TIN editing and contour interpolation",
          "3D shapefile creation",
          "Agriculture and forestry change detection",
        ],
      },
    ],
    applications: ["Municipal planning", "Environmental consulting", "Agriculture and forestry", "Real estate", "Infrastructure"],
    media: { src: "gis-hca", alt: "Pipeline HCA buffers and leak hotspot hexagons on a city basemap" },
    photo: "city-kolkata",
  },
  {
    slug: "utility-gis-mapping",
    group: "engineering",
    category: "Map & network",
    stage: "map",
    icon: "plug",
    title: "GIS for Utility Mapping",
    label: "Utility GIS",
    short: "Water, power, sewer and telecom networks as connected, attributed GIS.",
    summary:
      "We map utility networks for water, electricity, sewer and telecom operators as connected, attributed geodatabases, then run the network and terrain analyses that maintenance, planning and emergency teams rely on.",
    deliverables: [
      "Utility network digitisation and attribution",
      "Connectivity and topology validation",
      "Route and network tracing analysis",
      "Terrain models and topographic maps for design",
      "Thematic maps and asset registers",
    ],
    inputs: ["As-built drawings (DWG / PDF)", "Scanned maps", "Field survey and GPS", "Aerial imagery and LiDAR"],
    outputs: ["File GDB / Utility Network", "SHP / GPKG", "3D shapefiles", "DTM and contours", "PDF map books"],
    // PLACEHOLDER: confirm toolset
    software: ["ArcGIS Pro", "ArcGIS Utility Network", "QGIS", "AutoCAD Map 3D"],
    accuracy: "Contours at 1 ft for design, 2–5 ft for planning",
    turnaround: "Scoped after a sample review",
    keywords: ["utility GIS mapping services", "water network GIS", "electric utility mapping India"],
    scope: [
      {
        title: "Mapping",
        items: [
          "Image georectification, georeferencing and spatial adjustment",
          "Map digitisation, vectorisation and feature extraction",
          "Utility mapping for water, power, sewer and telecom",
          "Parcel mapping and updating",
          "Attribution",
        ],
      },
      {
        title: "Network and data",
        items: [
          "Route network analysis",
          "Topology validation",
          "Geospatial database creation and maintenance",
          "Data integration and data format conversion",
        ],
      },
      {
        title: "Terrain and analysis",
        items: [
          "TIN creation",
          "DEM creation and maintenance",
          "3D shapefile creation",
          "Thematic mapping",
          "Spatial analysis and modelling",
          "Agriculture and forestry status change detection",
        ],
      },
    ],
    applications: ["Water utilities", "Electric utilities", "Gas utilities", "Telecom", "Municipal planners", "Emergency response"],
    art: "utility",
  },
  {
    slug: "gas-pipeline-cgd-gis",
    group: "engineering",
    category: "Map & network",
    stage: "map",
    icon: "flame",
    title: "Gas Pipeline & CGD Utility GIS",
    label: "Gas pipeline GIS",
    short: "Network digitisation, HCA analysis and asset inventory for gas utilities.",
    summary:
      "We digitise and maintain steel and PE gas networks for CGD operators and EPC contractors, covering DRS/MRS, valves, CP test posts and service lines, plus the HCA and risk analyses regulators ask for.",
    deliverables: [
      "Steel and PE network digitisation from as-builts",
      "Asset inventory with material, diameter, pressure and install year",
      "High Consequence Area (HCA) and class-location analysis",
      "Leak and incident hotspot binning",
      "Connectivity, topology and valve-isolation tracing",
    ],
    inputs: ["As-built DWG / PDF", "GPS / DGPS survey", "Alignment sheets", "ILI / CP data"],
    outputs: ["UPDM / PODS-aligned GDB", "SHP / GPKG", "HCA reports", "Field Maps ready layers"],
    software: ["ArcGIS Pro", "ArcGIS Utility Network", "QGIS", "AutoCAD"],
    accuracy: "Survey-grade where DGPS supplied",
    turnaround: "Per-km batches, 48 h pilot",
    keywords: ["CGD GIS mapping services", "gas pipeline GIS digitisation India", "HCA analysis pipeline"],
    media: { src: "gis-network", alt: "Gas network digitised in GIS over a city basemap" },
    photo: "pipeline",
  },
  {
    slug: "telecom-network-design",
    group: "engineering",
    category: "Map & network",
    stage: "map",
    icon: "tower",
    title: "Telecom Utilities: Network Design & Drafting",
    label: "Telecom utilities",
    short: "FTTx and HFC design, construction packages, pole loading and tower documents.",
    summary:
      "We design and document wired and wireless telecom networks, from high-level fibre routes to construction-ready packages, pole loading studies and tower strengthening drawings, built on an accurate GIS land-base.",
    deliverables: [
      "FTTx and HFC network designs (HLD and LLD)",
      "Construction packages and permit drawings",
      "Pole loading analysis reports",
      "Small cell and tower site drawings",
      "As-built records in GIS and CAD",
    ],
    inputs: ["Route surveys and field notes", "Pole and site photographs", "Existing plant records", "Operator design standards"],
    outputs: ["Design packages (PDF / DWG)", "GIS network layers", "Pole loading reports", "Zoning and RF compliance drawings"],
    // PLACEHOLDER: confirm toolset
    software: ["AutoCAD", "ArcGIS Pro", "QGIS", "O-Calc Pro"],
    accuracy: "Drawn to operator standards",
    turnaround: "Scoped after a sample review",
    keywords: ["FTTx design services", "telecom drafting outsourcing", "pole loading analysis"],
    scope: [
      {
        title: "Network design",
        items: [
          "FTTx and HFC network design",
          "High-level and low-level design (HLD / LLD)",
          "Preliminary design",
          "GIS land-base for network planning",
          "ARAMIS (AT&T) integration",
        ],
      },
      {
        title: "Construction",
        items: [
          "Preparation of construction packages",
          "Telecom construction drawings",
          "Detailed construction and fabrication drawings",
          "As-built capture and as-built drawings",
        ],
      },
      {
        title: "Sites and structures",
        items: [
          "Pole loading analysis",
          "Small cell site drafting",
          "Tower strengthening design documents",
          "Radiation hazard documents and zoning drawings",
          "Photo simulations",
        ],
      },
    ],
    applications: ["Telecom operators", "Network providers", "Infrastructure companies", "5G and IoT roll-outs", "Transmission and distribution"],
    art: "telecom",
  },
  {
    slug: "bim-to-gis",
    group: "engineering",
    category: "Map & network",
    stage: "map",
    icon: "layers",
    title: "BIM-to-GIS & Digital Twins",
    label: "BIM-to-GIS",
    short: "Georeferenced building and plant models inside your city-scale GIS.",
    summary:
      "We move Revit and IFC models from local site coordinates into real-world coordinate systems, map their schema to GIS attributes, and publish them as 3D layers for digital twins.",
    deliverables: [
      "Georeferencing from local (0,0) to UTM / WGS84",
      "BIM File to Geodatabase conversion",
      "Schema mapping from BIM parameters to GIS fields",
      "Model simplification for web performance",
      "3D scene layers for ArcGIS / Cesium",
    ],
    inputs: ["RVT", "IFC", "NWD", "DWG", "Survey control"],
    outputs: ["File GDB (3D)", "Scene layer package (SLPK)", "3D Tiles", "GeoJSON"],
    software: ["ArcGIS Pro", "FME", "Revit", "QGIS"],
    accuracy: "Control-point verified georeferencing",
    turnaround: "1–2 weeks per facility",
    keywords: ["BIM to GIS conversion", "digital twin services", "Revit to ArcGIS"],
    media: { src: "gis-city", alt: "3D city model with a gas network overlaid" },
    photo: "city-delhi",
  },

  /* ── Technology · Build & experience ───────────────────────── */
  {
    slug: "website-development",
    group: "technology",
    category: "Build & experience",
    stage: "build",
    icon: "code",
    title: "Website & Web Application Development",
    label: "Web development",
    short: "Business websites, e-commerce, portals and custom web applications.",
    summary:
      "We design, build and run websites and web applications that are fast, secure and easy to manage, from company sites and online stores to enterprise portals connected to your existing systems.",
    deliverables: [
      "UI/UX design and interactive prototypes",
      "Responsive websites and web applications",
      "E-commerce with catalogues, carts and payment gateways",
      "Content management for your team",
      "Hosting, monitoring, maintenance and support",
    ],
    inputs: ["Business goals and audience", "Brand assets and content", "Existing systems and APIs", "Hosting preferences"],
    outputs: ["Production website or app", "Design system and source code", "CMS training", "Documentation"],
    // PLACEHOLDER: confirm toolset
    software: ["React / Next.js", "Angular", "Vue.js", "Node.js", "Django", "ASP.NET", "WordPress", "Magento", "HubSpot"],
    accuracy: "WCAG 2.2 AA · Core Web Vitals",
    turnaround: "Scoped after discovery",
    keywords: ["website development company Visakhapatnam", "web application development India", "e-commerce development"],
    facts: [
      ["Standards", "WCAG 2.2 AA · Core Web Vitals"],
      ["Stack", "React · Node.js · Django · .NET"],
      ["Engagement", "Design, build and ongoing support"],
    ],
    scope: [
      {
        title: "Build",
        items: [
          "Custom web application development",
          "Progressive Web Apps (PWA) with offline use and push notifications",
          "E-commerce solutions with catalogues, carts and payment gateway integration",
          "Content management systems (CMS)",
        ],
      },
      {
        title: "Enterprise",
        items: [
          "Enterprise web applications: ERP, CRM and project management",
          "Web portal development for B2B and internal teams",
          "API development and integration",
          "Cloud infrastructure and DevOps",
        ],
      },
      {
        title: "Experience and care",
        items: [
          "UI/UX design",
          "Cross-device and cross-browser quality assurance and testing",
          "Maintenance, security updates and support",
        ],
      },
    ],
    applications: ["Corporate websites", "E-commerce", "B2B portals", "ERP and CRM", "Internal tools"],
    art: "web",
  },
  {
    slug: "mobile-app-development",
    group: "technology",
    category: "Build & experience",
    stage: "build",
    icon: "smartphone",
    title: "Mobile Application Development",
    label: "Mobile apps",
    short: "Native and cross-platform iOS and Android apps, from prototype to app store.",
    summary:
      "We take mobile apps from idea to the app stores: prototypes and MVPs to test the concept, native or cross-platform builds for iOS and Android, and the integrations, testing and support that keep them running.",
    deliverables: [
      "Clickable prototypes and MVPs",
      "Native and cross-platform iOS and Android apps",
      "Third-party service and API integration",
      "App store submission and release",
      "Monitoring, updates and support",
    ],
    inputs: ["Product idea or requirements", "Brand assets", "Backend systems and APIs", "Target devices"],
    outputs: ["iOS and Android builds", "Source code", "Store listings", "Release documentation"],
    // PLACEHOLDER: confirm toolset
    software: ["Swift", "Kotlin", "Flutter", "React Native", "Firebase"],
    accuracy: "Tested across target devices",
    turnaround: "Scoped after discovery",
    keywords: ["mobile app development company India", "iOS Android app development", "cross-platform app"],
    facts: [
      ["Platforms", "iOS · Android"],
      ["Approach", "Native or cross-platform"],
      ["Engagement", "Prototype, build and support"],
    ],
    scope: [
      {
        title: "Product",
        items: ["UI/UX design", "App prototyping", "MVP development"],
      },
      {
        title: "Build",
        items: [
          "Native app development",
          "Cross-platform app development",
          "App integration with third-party services and APIs",
          "App migration to new platforms or frameworks",
        ],
      },
      {
        title: "Release and care",
        items: [
          "Quality assurance and testing",
          "App deployment to the app stores",
          "Maintenance and support",
        ],
      },
    ],
    applications: ["Field data collection", "Customer apps", "Service and booking", "Internal operations"],
    art: "mobile",
  },
  {
    slug: "iot-applications",
    group: "technology",
    category: "Build & experience",
    stage: "build",
    icon: "cpu",
    title: "IoT-Based Applications",
    label: "IoT applications",
    short: "Connected sensors, dashboards and automation for real-time monitoring.",
    summary:
      "We connect sensors and equipment to software that monitors, alerts and automates in real time, from device integration and data pipelines to the dashboards your operations team uses every day.",
    deliverables: [
      "Device and sensor integration",
      "Data ingestion and storage pipelines",
      "Real-time dashboards and alerts",
      "Rules and automation",
      "Mobile and web control apps",
    ],
    inputs: ["Use case and site conditions", "Devices and sensors", "Network and power constraints", "Existing systems"],
    outputs: ["Working IoT platform", "Dashboards", "Device firmware or configuration", "Documentation"],
    // PLACEHOLDER: confirm toolset
    software: ["MQTT", "AWS IoT", "Azure IoT Hub", "Node-RED", "Grafana"],
    accuracy: "Real-time monitoring and alerting",
    turnaround: "Scoped after discovery",
    keywords: ["IoT application development India", "IoT dashboard", "smart monitoring solutions"],
    facts: [
      ["Focus", "Monitoring · Alerts · Automation"],
      ["Protocols", "MQTT · HTTP · LoRaWAN"],
      ["Engagement", "Pilot, roll-out and support"],
    ],
    scope: [
      {
        title: "Use cases",
        items: [
          "Smart homes",
          "Healthcare",
          "Transportation and logistics",
          "Agriculture",
          "Smart cities",
          "Energy utilisation",
        ],
      },
      {
        title: "Platform",
        items: ["Device connectivity and data pipelines", "Real-time monitoring and alerts", "Automation and decision support"],
      },
    ],
    applications: ["Smart homes", "Healthcare", "Logistics", "Agriculture", "Smart cities", "Energy"],
    art: "iot",
  },
  {
    slug: "game-development",
    group: "technology",
    category: "Build & experience",
    stage: "build",
    icon: "gamepad",
    title: "Game Development",
    label: "Game development",
    short: "2D and 3D games for mobile, web, desktop and multiplayer, from concept to live ops.",
    summary:
      "We design, build and support games across mobile, web and desktop, from concept and art to multiplayer back ends, monetisation and post-launch updates.",
    deliverables: [
      "Game design documents and prototypes",
      "2D and 3D game builds",
      "Game art, characters, environments and animation",
      "Multiplayer back end, matchmaking and leaderboards",
      "Store release and post-launch updates",
    ],
    inputs: ["Game concept or brief", "Target platforms", "Art direction", "Monetisation model"],
    outputs: ["Playable builds", "Source project", "Art assets", "Release packages"],
    // PLACEHOLDER: confirm toolset
    software: ["Unity", "Unreal Engine", "Cocos2d", "Blender"],
    accuracy: "Performance-tested across devices",
    turnaround: "Scoped after discovery",
    keywords: ["game development company India", "Unity game development", "mobile game development"],
    facts: [
      ["Engines", "Unity · Unreal · Cocos2d"],
      ["Platforms", "iOS · Android · Web · PC"],
      ["Engagement", "Concept to live operations"],
    ],
    scope: [
      {
        title: "Create",
        items: [
          "Game design and conceptualisation: narrative, characters and mechanics",
          "2D and 3D game development",
          "Game art and animation",
          "AR and VR games",
        ],
      },
      {
        title: "Platforms",
        items: [
          "Mobile games for iOS and Android",
          "Web and desktop games for browsers, Windows and macOS",
          "Multiplayer and online games with matchmaking and leaderboards",
          "Game porting between platforms",
        ],
      },
      {
        title: "Launch and grow",
        items: [
          "Game monetisation: in-app purchases, ads and subscriptions",
          "Game testing and QA",
          "Post-launch support and maintenance",
        ],
      },
    ],
    applications: ["Entertainment", "Education", "Brand campaigns", "Training"],
    art: "game",
  },
  {
    slug: "ar-vr-development",
    group: "technology",
    category: "Build & experience",
    stage: "build",
    icon: "glasses",
    title: "AR & VR Experiences",
    label: "AR / VR",
    short: "Augmented, virtual and mixed reality for games, training and product demos.",
    summary:
      "We build immersive AR, VR and mixed-reality experiences for entertainment, training, simulation and product demonstrations, optimised to run smoothly on phones and headsets.",
    deliverables: [
      "AR apps for iOS and Android",
      "VR experiences for standalone headsets",
      "Mixed-reality training and simulation",
      "Real-time 3D environments and assets",
      "Device testing and frame-rate optimisation",
    ],
    inputs: ["Experience brief", "Target devices", "3D models, scans or CAD", "Brand assets"],
    outputs: ["AR / VR builds", "Optimised 3D assets", "Source project", "Deployment packages"],
    // PLACEHOLDER: confirm toolset
    software: ["Unity", "Unreal Engine", "ARKit", "ARCore", "Meta Quest SDK"],
    accuracy: "Optimised for smooth frame rates",
    turnaround: "Scoped after discovery",
    keywords: ["AR VR development company India", "virtual reality training", "augmented reality app"],
    facts: [
      ["Devices", "iOS · Android · Meta Quest"],
      ["Engines", "Unity · Unreal"],
      ["Engagement", "Prototype, build and support"],
    ],
    scope: [
      {
        title: "Experiences",
        items: [
          "AR game development for iOS and Android",
          "VR game development for headsets such as Meta Quest",
          "Mixed-reality experiences for training, simulation and product demos",
          "Multiplayer and social VR spaces",
        ],
      },
      {
        title: "Production",
        items: [
          "3D environments and assets optimised for real time",
          "Testing, optimisation and post-launch support",
          "Scan and CAD data turned into immersive walkthroughs",
        ],
      },
    ],
    applications: ["Training and simulation", "Product demonstrations", "Entertainment", "Site walkthroughs"],
    art: "xr",
  },

  /* ── Technology · Data & enterprise ────────────────────────── */
  {
    slug: "data-science-ai-ml",
    group: "technology",
    category: "Data & enterprise",
    stage: "build",
    icon: "brain",
    title: "Data Science, AI & Machine Learning",
    label: "Data science & AI",
    short: "Forecasting, machine learning, NLP, computer vision and decision dashboards.",
    summary:
      "We turn your data into decisions: cleaned and modelled datasets, forecasts and machine-learning models, language and vision systems, and dashboards that show the people who act on them what matters.",
    deliverables: [
      "Data audit, cleaning and preparation",
      "Predictive and machine-learning models",
      "NLP and computer-vision solutions",
      "Interactive dashboards and reports",
      "Data and AI strategy roadmaps",
    ],
    inputs: ["Business question", "Databases, spreadsheets and logs", "Documents, images or video", "Existing BI tools"],
    outputs: ["Models and APIs", "Dashboards", "Analysis reports", "Roadmap"],
    // PLACEHOLDER: confirm toolset
    software: ["Python", "TensorFlow / PyTorch", "Tableau", "Power BI", "Qlik"],
    accuracy: "Models validated on held-out data",
    turnaround: "Scoped after discovery",
    keywords: ["data science services India", "AI ML development company", "Power BI dashboard development"],
    facts: [
      ["Focus", "Forecasts · ML · NLP · Vision"],
      ["BI tools", "Tableau · Power BI · Qlik"],
      ["Engagement", "Proof of concept to production"],
    ],
    scope: [
      {
        title: "Data science",
        items: [
          "Predictive modelling and forecasting",
          "Machine learning and AI solutions",
          "Data visualisation and reporting",
          "Data mining and cleaning",
          "Custom data strategy and roadmap development",
          "Market research and competitive analysis",
        ],
      },
      {
        title: "AI and ML",
        items: [
          "Custom AI and ML development",
          "Natural language processing: chatbots, sentiment analysis and translation",
          "Computer vision: image recognition, detection and object tracking",
          "Predictive analytics",
          "AI strategy consulting",
          "AI-driven process automation",
        ],
      },
    ],
    applications: ["Operations", "Sales and marketing", "Asset management", "Customer service", "Geospatial analytics"],
    art: "ai",
  },
  {
    slug: "sas-analytics",
    group: "technology",
    category: "Data & enterprise",
    stage: "build",
    icon: "chart",
    title: "SAS Programming & Analytics",
    label: "SAS analytics",
    short: "Clinical SAS programming, statistical analysis, data integration and BI.",
    summary:
      "We provide SAS programming and statistical analysis, from clinical trial datasets and regulatory outputs to predictive models, data integration and business reporting.",
    deliverables: [
      "SDTM and ADaM datasets",
      "Tables, listings and figures (TLFs)",
      "Define.xml and submission support",
      "Statistical and predictive models",
      "Dashboards, KPI tracking and ad-hoc reports",
    ],
    inputs: ["Raw study or business data", "Specifications and SAPs", "Existing SAS programs", "Reporting requirements"],
    outputs: ["Validated datasets", "TLFs", "Define.xml", "Analysis reports", "Dashboards"],
    // PLACEHOLDER: confirm toolset
    software: ["SAS 9.4", "SAS Viya", "SAS Enterprise Guide"],
    accuracy: "Double programming and validation",
    turnaround: "Scoped after discovery",
    keywords: ["clinical SAS programming services", "SAS analytics outsourcing India", "SDTM ADaM programming"],
    facts: [
      ["Standards", "CDISC SDTM · ADaM"],
      ["Outputs", "TLFs · Define.xml"],
      ["Engagement", "Project or dedicated team"],
    ],
    scope: [
      {
        title: "Clinical SAS",
        items: [
          "Derived datasets (SDTM, ADaM)",
          "Tables, listings and figures (TLFs)",
          "Regulatory submission support including Define.xml",
          "Data validation and auditing",
        ],
      },
      {
        title: "Analytics",
        items: [
          "Statistical analysis and SAS programming",
          "Predictive analytics and ML modelling",
          "Optimisation and simulation",
          "Data visualisation and reporting",
        ],
      },
      {
        title: "Data and BI",
        items: [
          "Data cleansing and transformation",
          "Integration of disparate sources and ETL",
          "Data governance and quality assurance",
          "Interactive dashboards, ad-hoc reporting, KPI tracking and decision support",
        ],
      },
    ],
    applications: [
      "Healthcare and pharma: trial analysis and regulatory reporting",
      "Finance: risk modelling, fraud detection and credit scoring",
      "Retail: segmentation, demand forecasting and inventory",
      "Public sector: policy analysis, resource allocation and health monitoring",
    ],
    art: "sas",
  },
  {
    slug: "sap-services",
    group: "technology",
    category: "Data & enterprise",
    stage: "build",
    icon: "database",
    title: "SAP Services",
    label: "SAP",
    short: "S/4HANA implementation and migration, integration, analytics and managed support.",
    summary:
      "We help organisations implement, migrate to and run SAP: S/4HANA projects, cloud and integration work, analytics, governance and HR modules, with application management once you are live.",
    deliverables: [
      "S/4HANA implementation and migration plans",
      "System conversion and data migration",
      "SAP to non-SAP integrations",
      "Analytics and reporting",
      "Application management and support",
    ],
    inputs: ["Current ERP landscape", "Business processes", "Data and integrations", "Compliance requirements"],
    outputs: ["Roadmap and blueprint", "Configured system", "Integrations", "Support runbooks"],
    // PLACEHOLDER: confirm toolset
    software: ["SAP S/4HANA", "SAP RISE", "SAP SuccessFactors", "SAP Analytics Cloud", "SAP GRC"],
    accuracy: "Structured cut-over and validation",
    turnaround: "Scoped after assessment",
    keywords: ["SAP S/4HANA migration services", "SAP consulting India", "SAP application management"],
    facts: [
      ["Platform", "S/4HANA · RISE · SuccessFactors"],
      ["Paths", "Greenfield · conversion · migration"],
      ["Engagement", "Advisory to managed support"],
    ],
    scope: [
      {
        title: "Implementation",
        items: [
          "SAP S/4HANA implementation and migration: greenfield, system migration and conversion",
          "SAP cloud solutions",
          "SAP digital transformation and advisory",
        ],
      },
      {
        title: "Connect and analyse",
        items: [
          "SAP integration with non-SAP and third-party systems",
          "SAP analytics and business intelligence",
          "SAP governance, risk and compliance (GRC) with continuous controls monitoring",
        ],
      },
      {
        title: "Run",
        items: [
          "SAP Human Capital Management: payroll, performance and employee self-service",
          "SAP Application Management Services (AMS)",
          "End-to-end support",
        ],
      },
    ],
    applications: ["Manufacturing", "Utilities", "Retail and distribution", "Professional services"],
    art: "sap",
  },
  {
    slug: "cloud-computing",
    group: "technology",
    category: "Data & enterprise",
    stage: "build",
    icon: "cloud",
    title: "Cloud Computing",
    label: "Cloud",
    short: "Plan, migrate and run on AWS, Azure and Google Cloud.",
    summary:
      "We help you plan, migrate to and run on the cloud, choosing the right mix of infrastructure, platform and software services so you scale when needed and pay only for what you use.",
    deliverables: [
      "Cloud readiness assessment and plan",
      "Migration of applications, data and storage",
      "Landing zones, networking and security baselines",
      "Cost monitoring and optimisation",
      "Managed operations and support",
    ],
    inputs: ["Current infrastructure", "Applications and data", "Security and compliance needs", "Budget"],
    outputs: ["Migration plan", "Cloud environment", "Infrastructure as code", "Runbooks"],
    // PLACEHOLDER: confirm toolset
    software: ["Amazon Web Services", "Microsoft Azure", "Google Cloud Platform", "Terraform"],
    accuracy: "Security and cost baselines",
    turnaround: "Scoped after assessment",
    keywords: ["cloud migration services India", "AWS Azure consulting", "cloud computing company"],
    facts: [
      ["Providers", "AWS · Azure · Google Cloud"],
      ["Models", "IaaS · PaaS · SaaS"],
      ["Engagement", "Plan, migrate and run"],
    ],
    scope: [
      {
        title: "Plan",
        items: ["Cloud readiness and cost assessment", "Choice of IaaS, PaaS and SaaS", "Architecture and security design"],
      },
      {
        title: "Migrate",
        items: ["Servers, storage and databases", "Applications and workloads", "Email and collaboration suites"],
      },
      {
        title: "Run",
        items: ["Monitoring and incident response", "Cost control and scaling", "Backup and disaster recovery"],
      },
    ],
    applications: [
      "Healthcare: patient data and telemedicine",
      "Finance: transactions, risk and compliance",
      "Education: online learning and collaboration",
      "Retail: inventory, customer data and e-commerce",
    ],
    art: "cloud",
  },

  /* ── Technology · Assure & grow ────────────────────────────── */
  {
    slug: "cyber-security",
    group: "technology",
    category: "Assure & grow",
    stage: "build",
    icon: "shield",
    title: "Cyber Security",
    label: "Cyber security",
    short: "VAPT, managed detection and response, SIEM, identity and compliance.",
    summary:
      "We find and close security gaps before attackers do, then watch your systems around the clock: testing, monitoring, incident response and the controls and training that keep you compliant.",
    deliverables: [
      "Vulnerability assessment and penetration test reports",
      "24×7 monitoring with detection and response",
      "Incident response and forensics",
      "Identity, network, cloud and endpoint hardening",
      "Compliance audits and staff awareness training",
    ],
    inputs: ["Asset inventory", "Network and cloud access", "Policies and compliance scope", "Incident history"],
    outputs: ["VAPT reports", "Remediation plan", "SIEM dashboards", "Audit evidence"],
    // PLACEHOLDER: confirm toolset
    software: ["Burp Suite", "Nessus", "Microsoft Sentinel", "Splunk", "CrowdStrike"],
    accuracy: "Mapped to GDPR, HIPAA and PCI DSS",
    turnaround: "Scoped after assessment",
    keywords: ["cyber security services India", "VAPT company", "managed detection and response"],
    facts: [
      ["Frameworks", "GDPR · HIPAA · PCI DSS"],
      ["Coverage", "Network · Cloud · Endpoint · Identity"],
      ["Engagement", "Assessment or managed service"],
    ],
    scope: [
      {
        title: "Test",
        items: [
          "Vulnerability assessment and penetration testing (VAPT) with attack simulation",
          "Compliance and risk management audits",
        ],
      },
      {
        title: "Detect and respond",
        items: [
          "Managed detection and response (MDR)",
          "Security information and event management (SIEM)",
          "Incident response and forensics",
        ],
      },
      {
        title: "Protect",
        items: [
          "Identity and access management with MFA and SSO",
          "Network security: firewalls, IDS/IPS, VPN and segmentation",
          "Cloud security: encryption, data-loss prevention and secure configuration",
          "Endpoint security: antivirus, encryption and mobile device management",
          "Security awareness training against phishing and malware",
        ],
      },
    ],
    applications: ["Healthcare", "Finance and payments", "Utilities and critical infrastructure", "SaaS and e-commerce"],
    art: "security",
  },
  {
    slug: "software-testing",
    group: "technology",
    category: "Assure & grow",
    stage: "build",
    icon: "bug",
    title: "Software Testing & QA",
    label: "Software testing",
    short: "Manual, automated, performance, security, API and mobile testing.",
    summary:
      "We test software before your users do: functional and automated suites, load and security tests, usability reviews and device coverage, so releases go out with fewer defects and less risk.",
    deliverables: [
      "Test strategy and test cases",
      "Automated regression suites in your CI",
      "Performance and load test reports",
      "Security and compliance test findings",
      "Defect reports with clear reproduction steps",
    ],
    inputs: ["Application builds and environments", "Requirements and user stories", "Target devices and browsers", "Release schedule"],
    outputs: ["Test plans", "Automation code", "Test and defect reports", "Release sign-off"],
    // PLACEHOLDER: confirm toolset
    software: ["Selenium", "Playwright", "Appium", "JMeter", "Postman"],
    accuracy: "Coverage reported per release",
    turnaround: "Scoped after discovery",
    keywords: ["software testing services India", "QA automation company", "performance testing"],
    facts: [
      ["Types", "Manual · Automated · Performance"],
      ["Tools", "Selenium · Playwright · JMeter"],
      ["Engagement", "Per release or dedicated QA team"],
    ],
    scope: [
      {
        title: "Functional",
        items: ["Manual testing", "Automation testing", "API testing", "Mobile application testing across devices and OS versions"],
      },
      {
        title: "Non-functional",
        items: ["Performance testing (load and stress)", "Security testing", "Usability testing of UI and UX", "Compliance testing against regulatory and industry standards"],
      },
    ],
    applications: ["Web platforms", "Mobile apps", "Enterprise systems", "Regulated industries"],
    art: "testing",
  },
  {
    slug: "digital-marketing",
    group: "technology",
    category: "Assure & grow",
    stage: "build",
    icon: "megaphone",
    title: "Digital Marketing",
    label: "Digital marketing",
    short: "Social media, SEO, YouTube, WhatsApp, bulk messaging, reviews and reputation.",
    summary:
      "We grow your visibility and enquiries online: social media and SEO that compound, video and messaging channels that reach customers directly, and reputation management for when it matters most.",
    deliverables: [
      "Channel strategy and content calendar",
      "Social media management and paid campaigns",
      "SEO audits, fixes and content",
      "YouTube and WhatsApp channel management",
      "Monthly performance and ROI reports",
    ],
    inputs: ["Business goals", "Brand guidelines", "Website and analytics access", "Target markets"],
    outputs: ["Content", "Campaigns", "SEO changes", "Performance reports"],
    // PLACEHOLDER: confirm toolset
    software: ["Google Analytics", "Google Search Console", "Meta Business Suite", "WhatsApp Business API"],
    accuracy: "Tracked against agreed KPIs",
    turnaround: "Monthly retainer or campaign",
    keywords: ["digital marketing agency Visakhapatnam", "SEO services India", "social media management"],
    facts: [
      ["Channels", "Social · Search · Video · Messaging"],
      ["Reporting", "Monthly KPIs and ROI"],
      ["Engagement", "Retainer or campaign"],
    ],
    scope: [
      {
        title: "Social media management",
        items: [
          "Content planning and creation",
          "Engagement and community interaction",
          "Analytics and performance tracking",
          "Ad campaigns and boosted posts",
          "Trend and competitor monitoring",
          "Brand reputation, compliance and privacy",
          "Testing, adapting and measuring ROI",
        ],
      },
      {
        title: "Search engine optimisation",
        items: [
          "Website audit and keyword research",
          "On-page and technical SEO",
          "Content creation and optimisation",
          "Link building and local SEO",
          "UX optimisation",
          "Performance tracking, reporting and algorithm updates",
        ],
      },
      {
        title: "Channels and reputation",
        items: [
          "YouTube channel setup and management",
          "WhatsApp channel broadcasting",
          "Bulk SMS and WhatsApp Business API messaging with CRM integration and delivery reports",
          "Google Reviews management",
          "Crisis management: plan, prepare, respond and recover",
        ],
      },
    ],
    applications: ["B2B lead generation", "Local businesses", "E-commerce", "Recruitment"],
    art: "marketing",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const groupMeta: Record<ServiceGroup, { label: string; title: string; intro: string }> = {
  engineering: {
    label: "Engineering",
    title: "Engineering services",
    intro:
      "Capture, model and map: scanning, photogrammetry and LiDAR, drawings and models, and GIS for every kind of network, all on one survey control.",
  },
  technology: {
    label: "Technology",
    title: "Technology services",
    intro:
      "Software, data and digital services: web and mobile products, AI, enterprise systems and cloud, and the security, testing and marketing around them.",
  },
};

/** Services grouped for menus, the index and the atlas, in display order. */
export const serviceGroups = (["engineering", "technology"] as const).map((group) => {
  const list = services.filter((s) => s.group === group);
  const categories = [...new Set(list.map((s) => s.category))].map((name) => ({
    name,
    stage: list.find((s) => s.category === name)!.stage,
    services: list.filter((s) => s.category === name),
  }));
  return { group, ...groupMeta[group], count: list.length, categories };
});
