import type { Thing, WithContext } from "schema-dts";
import { site } from "@/config/site";
import { serviceGroups } from "@/content/services";

export function JsonLd<T extends Thing>({
  data,
}: {
  data: WithContext<T> | WithContext<T>[];
}) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/brand/infinite-logo.png`,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    email: site.email,
    telephone: site.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: site.areaServed.map((c) => ({ "@type": "Country", name: c })),
    sameAs: [site.socials.linkedin].filter(Boolean),
    knowsAbout: [
      "Laser scanning",
      "Point cloud processing",
      "Scan to BIM",
      "Revit modelling",
      "AutoCAD drafting",
      "GIS mapping",
      "Gas pipeline GIS",
      "City gas distribution",
      "BIM to GIS",
      "Photogrammetry",
      "LiDAR data processing",
      "Structural steel detailing",
      "3D CAD modelling",
      "Utility GIS mapping",
      "Telecom network design",
      "Web and mobile application development",
      "Data science and machine learning",
      "SAP",
      "Cloud computing",
      "Cyber security",
      "Software testing",
      "Digital marketing",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: serviceGroups.map((g) => ({
        "@type": "OfferCatalog",
        name: g.title,
        itemListElement: g.categories.flatMap((c) =>
          c.services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              url: `${site.url}/services/${s.slug}`,
            },
          })),
        ),
      })),
    },
  } as const;
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  } as const;
}
