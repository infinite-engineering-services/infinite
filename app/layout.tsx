import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactDock } from "@/components/layout/contact-dock";
import { RevealObserver } from "@/components/motion/providers";
import { JsonLd, organizationLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Laser Scanning, Scan-to-BIM, CAD & GIS Services`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Scan to BIM services India",
    "point cloud to Revit outsourcing",
    "CGD GIS mapping services",
    "gas pipeline GIS digitisation India",
    "HCA analysis pipeline",
    "AutoCAD drafting outsourcing India",
    "BIM to GIS conversion",
    "laser scanning services Visakhapatnam",
    "structural steel detailing services India",
    "photogrammetry and LiDAR processing",
    "utility GIS mapping",
    "FTTx telecom design outsourcing",
    "website and app development Visakhapatnam",
    "SAP and cloud services India",
    "cyber security services India",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0E0D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available before first paint (film and reveals key off it) */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-dvh">
        <div aria-hidden className="grain" />
        <RevealObserver />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ContactDock />
        <JsonLd data={organizationLd() as never} />
        {/* These scripts only exist on Vercel; skip them elsewhere to avoid 404s */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
