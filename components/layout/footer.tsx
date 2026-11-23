import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { LogoFull, LinkedInIcon, WhatsAppIcon } from "@/components/brand/logo";
import { cta, nav, site, whatsappLink } from "@/config/site";
import { serviceGroups } from "@/content/services";

export function Footer() {
  const heading = "t-mono mb-4 text-[11px] tracking-[0.12em] text-fog uppercase";
  const link = "text-[14px] leading-5 text-fog transition-colors hover:text-ink";
  const address = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.countryName}`;

  return (
    <footer className="relative bg-void pb-24 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {/* Closing call to action */}
        <div className="flex flex-col justify-between gap-8 border-b pb-12 sm:pb-14 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-display text-[clamp(30px,4.4vw,58px)] leading-[1.02] font-medium tracking-[-0.035em]">
              Have a project in mind?{" "}
              <span className="text-fog">Tell us what you have and what you need.</span>
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-fog">
              An engineer replies within one working day, and we sign your NDA before any files
              are shared.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={cta.href}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-[#ffd447]"
            >
              {cta.primary} <ArrowRight className="size-4" aria-hidden />
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

        {/* Directory */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-[1.5fr_1fr_1fr_0.75fr] lg:gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <LogoFull className="w-48 sm:w-56" />
            <p className="mt-5 max-w-sm text-[14.5px] leading-7 text-fog">
              {site.legalName} provides laser scanning, CAD, BIM and GIS services, and the
              software, data and cloud work around them, for clients in India and worldwide.
            </p>
            <ul className="mt-6 grid gap-3 text-[14px] leading-6 text-fog">
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-ink/60" aria-hidden />
                <span>{address}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 size-4 shrink-0 text-ink/60" aria-hidden />
                <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-ink">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 size-4 shrink-0 text-ink/60" aria-hidden />
                <a href={`tel:${site.phone.tel}`} className="transition-colors hover:text-ink">
                  {site.phone.display}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-ink/60" aria-hidden />
                <span>{site.hours}</span>
              </li>
            </ul>
            {site.socials.linkedin ? (
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="mt-6 inline-grid size-10 place-items-center rounded-full border text-fog transition-colors hover:text-ink"
              >
                <LinkedInIcon className="size-4" />
              </a>
            ) : null}
          </div>

          {serviceGroups.map((g) => (
            <nav key={g.group} aria-label={`${g.label} services`}>
              <h2 className={heading}>{g.label}</h2>
              <ul className="space-y-1 sm:space-y-2">
                {g.categories
                  .flatMap((c) => c.services)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className={`${link} inline-block py-1 sm:py-0`}>
                        {s.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Company" className="col-span-2 sm:col-span-1">
            <h2 className={heading}>Company</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:block sm:space-y-2">
              {[...nav, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy Policy" }].map(
                (n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={`${link} inline-block py-1 sm:py-0`}>
                      {n.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col gap-3 border-t py-6 text-[13px] leading-6 text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.copyrightYear} {site.legalName.replace(/\.$/, "")}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy Policy
            </Link>
            <span>
              {site.address.city}, {site.address.countryName}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
