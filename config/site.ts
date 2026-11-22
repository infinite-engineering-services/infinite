/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for company details.
 *  Every value marked PLACEHOLDER must be replaced before launch.
 *  Run `npm run check:placeholders` to list what is left.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  name: "Infinite Engineering",
  legalName: "Infinite Engineering Service and Technology Pvt. Ltd.",
  tagline: "Scan. Model. Map.",
  description:
    "Engineering and technology services from one team: laser scanning, CAD, Scan-to-BIM, steel detailing and GIS, plus web, mobile, AI, cloud and security. Specialists in pipeline and utility GIS.",

  // Production domain (apex; www redirects here)
  url: "https://infiniteengineeringservices.com",

  // From the company letterhead
  email: "infiniteengineeringservice7@gmail.com",
  phone: { display: "+91 99667 08007", tel: "+919966708007" },
  // Assumed to be the same number as the phone: confirm with the owner
  whatsapp: "919966708007", // digits only, with country code

  address: {
    // Registered office, from the company letterhead
    street: "#26-2-37, Chinagantyada, Old Gajuwaka",
    city: "Visakhapatnam",
    region: "Andhra Pradesh",
    postalCode: "530026",
    country: "IN",
    countryName: "India",
  },
  geo: { lat: 17.6868, lng: 83.2105 }, // Gajuwaka, Visakhapatnam (approximate)

  hours: "Mon–Sat, 09:30–19:00 IST",
  copyrightYear: 2026,

  socials: {
    // PLACEHOLDER: add the company LinkedIn URL; the icon is hidden while empty
    linkedin: "" as string,
  },

  areaServed: ["IN", "US", "GB", "AE", "SA", "AU"],
} as const;

/** Flags for anything in this file that still needs real data. */
export const sitePlaceholders = [
  "whatsapp (assumed same as phone)",
  "socials.linkedin",
];


export const software = [
  { name: "Leica Cyclone", stage: "scan" },
  { name: "Cyclone REGISTER 360", stage: "scan" },
  { name: "Autodesk ReCap", stage: "scan" },
  { name: "AutoCAD", stage: "model" },
  { name: "Revit", stage: "model" },
  { name: "Navisworks", stage: "model" },
  { name: "ArcGIS Pro", stage: "map" },
  { name: "QGIS", stage: "map" },
  { name: "FME", stage: "map" },
] as const;

export const specs = [
  { label: "Registration accuracy", value: "±2–6 mm" },
  { label: "BIM detail", value: "LOD 100–400" },
  { label: "Formats in and out", value: "12+" },
  { label: "Confidentiality", value: "NDA before files" },
];

export const formats = ["E57", "RCP", "LAS", "DWG", "DXF", "RVT", "IFC", "NWD", "SHP", "GDB", "GPKG", "KML"];

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
] as const;

/** One wording for every promise, used everywhere on the site. */
export const promises = {
  reply: "We reply within one working day.",
  replyShort: "Reply within one working day",
  nda: "We sign your NDA, or ours, before you send any files.",
  ndaShort: "NDA before files",
};

export const cta = {
  primary: "Start your project",
  secondary: "WhatsApp an engineer",
  href: "/contact#quote",
};

export const pilot = {
  headline: "Start with a pilot project",
  terms: "We process a small sample of your own data to your standards, so you can assess quality and turnaround before committing to the full project.",
};

export const pricingModels = [
  { name: "Per area", unit: "sq ft / m²", bestFor: "Scan-to-BIM, priced by LOD and disciplines" },
  { name: "Per sheet", unit: "drawing", bestFor: "CAD drafting and PDF-to-CAD conversion" },
  { name: "Per km or feature", unit: "km · asset", bestFor: "GIS digitisation and CGD networks" },
  { name: "Dedicated engineer", unit: "monthly", bestFor: "Ongoing overflow work in your standards" },
];

export const timezones = [
  { city: "India (IST)", hours: "09:30–19:00" },
  { city: "London (GMT)", hours: "04:00–13:30" },
  { city: "New York (ET)", hours: "23:00–08:30" },
];

/** Shown on the CGD service page only once a real PDF exists in /public. */
export const capabilityPdf: string | null = null;

export function whatsappLink(message?: string) {
  const text = message ?? `Hi ${site.name}, I'd like a quote for a project.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
