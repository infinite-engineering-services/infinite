import type { Metadata } from "next";
import { Clock, FileLock2, Mail, MapPin, Phone } from "lucide-react";
import { PageTransition } from "@/components/motion/transitions";
import { WhatsAppIcon } from "@/components/brand/logo";
import { Container, Section } from "@/components/brand/primitives";
import { QuoteForm } from "@/components/forms/quote-form";
import { Faq } from "@/components/sections/faq";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { promises, site, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & Quotations",
  description: `Send your scans, drawings or GIS data for a fixed quotation. ${promises.reply} Call, email or WhatsApp ${site.name}.`,
  alternates: { canonical: "/contact" },
};

const next = [
  { title: "Response", body: "An engineer reviews your brief and replies within one working day." },
  { title: "Confidentiality", body: "We sign your NDA, or ours, before any files are shared." },
  { title: "Pilot project", body: "We process a small sample of your data to your standards, so you can assess quality before committing." },
];

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;
  const channels = [
    { href: whatsappLink(), icon: <WhatsAppIcon className="size-5 text-[#25d366]" />, label: "WhatsApp an engineer", value: "Usually the fastest reply", external: true },
    { href: `mailto:${site.email}`, icon: <Mail className="size-5 text-brand" aria-hidden />, label: "Email", value: site.email },
    { href: `tel:${site.phone.tel}`, icon: <Phone className="size-5 text-brand" aria-hidden />, label: "Call", value: site.phone.display },
  ];

  return (
    <PageTransition>
      <div>
        <Section tone="canvas" label="Request a quote" className="pt-28 sm:pt-36">
          <Container className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            {/* Form first: on mobile it is the first thing after the heading */}
            <div>
              <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.25rem)] leading-[1.06] font-semibold text-balance">
                Request a quote.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                Four short fields to start. {promises.reply} {promises.nda}
              </p>
              <div id="quote" className="glass mt-8 scroll-mt-28 rounded-3xl p-6 sm:p-8">
                <QuoteForm />
              </div>
            </div>

            <aside className="grid content-start gap-6 lg:pt-4">
              <div className="rounded-xl border bg-surface p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold">What happens next</h2>
                <ol className="mt-5 grid gap-4">
                  {next.map((s, i) => (
                    <li key={s.title} className="flex gap-3.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#f4c430]/40 font-display text-sm font-semibold text-brand">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold">{s.title}</span>
                        <span className="block text-[15px] leading-6 text-muted-foreground">{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <ul className="grid gap-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-center gap-4 rounded-xl border bg-surface p-4 shadow-card transition-[box-shadow,border-color] hover:border-foreground/30 hover:shadow-lift"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg border bg-canvas">{c.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold">{c.label}</span>
                        <span className="block truncate text-sm text-muted-foreground">{c.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="grid gap-3 rounded-xl border bg-surface p-5 text-[15px] shadow-card">
                <p className="flex items-center gap-3"><Clock className="size-5 text-brand" aria-hidden /> {site.hours}</p>
                <p className="flex items-center gap-3"><FileLock2 className="size-5 text-brand" aria-hidden /> {promises.ndaShort}</p>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <span>
                    {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-medium text-brand hover:underline">
                      Open in Google Maps
                    </a>
                  </span>
                </p>
              </div>
            </aside>
          </Container>
        </Section>
        <Faq />
        <JsonLd
          data={
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]) as never
          }
        />
      </div>
    </PageTransition>
  );
}
