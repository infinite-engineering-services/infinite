import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo, LinkedInIcon, WhatsAppIcon } from "@/components/brand/logo";
import { cta, formats, nav, site, software, whatsappLink } from "@/config/site";
import { services } from "@/content/services";
import { photos } from "@/content/photos";

/** Footer drawn as an engineering title block. */
export function Footer() {
  const link = "text-[15px] text-fog transition-colors hover:text-ink";
  const cell = "border-line p-4 sm:p-5";
  const label = "t-mono mb-1.5 block text-[10.5px] text-fog";

  return (
    <footer className="relative bg-void pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        {/* Big closing line */}
        <div className="flex flex-col justify-between gap-8 border-b pb-14 lg:flex-row lg:items-end">
          <p className="max-w-3xl font-display text-[clamp(32px,4.6vw,64px)] leading-[0.98] font-medium tracking-[-0.04em]">
            One team. One coordinate system.{" "}
            <span className="text-fog">From site scan to GIS.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={cta.href}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-[#ffd447]"
            >
              {cta.primary} <ArrowRight className="size-4" />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-light inline-flex h-12 items-center gap-2 rounded-full px-5 font-medium"
            >
              <WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-7 text-fog">
              Laser scanning, Scan-to-BIM, CAD and GIS from {site.address.city}, India, for teams
              worldwide.
            </p>
            {site.socials.linkedin ? (
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="mt-5 inline-grid size-10 place-items-center rounded-full border text-fog transition-colors hover:text-ink"
            >
              <LinkedInIcon className="size-4" />
            </a>
            ) : null}
          </div>
          <div>
            <h3 className="t-mono mb-4 text-[11px] text-fog">Services</h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={link}>
                    {s.title.split(" & ")[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="t-mono mb-4 text-[11px] text-fog">Company</h3>
            <ul className="space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={link}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className={link}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="t-mono mb-4 text-[11px] text-fog">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${site.email}`} className={`${link} break-all`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.tel}`} className={link}>
                  {site.phone.display}
                </a>
              </li>
              <li className="text-[15px] text-fog">{site.hours}</li>
            </ul>
          </div>
        </div>

        {/* Software and formats strip */}
        <p className="t-mono border-t py-5 text-[10.5px] leading-6 text-fog">
          {software.map((s) => s.name).join(" · ")}
          <span className="mx-2 text-ink/30">|</span>
          {formats.join(" · ")}
        </p>

        {/* Title block */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-line lg:grid-cols-6">
          {[
            ["Drawn by", site.legalName, "max-lg:col-span-2"],
            ["Office", `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`, "max-lg:col-span-2 lg:col-span-2"],
            ["CIN", site.cin, ""],
            ["GSTIN", site.gstin, ""],
            ["Sheet", `1 of 1 · WGS 84 · © ${site.copyrightYear}`, "col-span-2 lg:col-span-1"],
          ].map(([k, v, span]) => (
            <div key={k} className={`bg-void ${cell} ${span}`}>
              <span className={label}>{k}</span>
              <span className="block text-[13px] leading-5 text-ink/90">{v}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] leading-6 text-fog">
          Stock photography from Unsplash:{" "}
          {Object.values(photos).map((p, i, all) => (
            <span key={p.href}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-ink hover:underline"
              >
                {p.credit}
              </a>
              {i < all.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          Renders, scans and maps are our own demonstration work.
        </p>
      </div>
      {/* Closing wordmark, cropped by the page edge */}
      <p
        aria-hidden
        className="pointer-events-none mt-10 overflow-hidden px-2 text-center font-display text-[25vw] leading-[0.72] font-medium tracking-[-0.07em] whitespace-nowrap select-none"
      >
        <span className="bg-gradient-to-b from-ink/25 to-transparent bg-clip-text text-transparent">Infinite</span>
      </p>
    </footer>
  );
}
