import type { ReactNode } from "react";
import { Clock, FileLock2, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/logo";
import { Container, Eyebrow, Section, stagger } from "@/components/brand/primitives";
import { LazyQuoteForm } from "@/components/forms/lazy-quote-form";
import { promises, site, whatsappLink } from "@/config/site";

const next = [
  { title: "Response", body: "An engineer reviews your brief and replies within one working day." },
  { title: "Confidentiality", body: "We sign your NDA, or ours, before any files are shared." },
  { title: "Pilot project", body: "We process a small sample of your data to your standards, so you can assess quality before committing." },
];

/** The close: what happens next, and the two-step form on dark glass. */
export function PilotCTA({
  headingAs = "h2",
  form,
}: {
  headingAs?: "h1" | "h2";
  /** Defaults to the lazily loaded form; /contact passes <QuoteForm /> to render it immediately. */
  form?: ReactNode;
}) {
  const H = headingAs;
  return (
    <Section id="quote" grid label="Start your project" className="pb-28">
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(244,196,48,0.10),transparent)]"
      />
      <Container>
        <Eyebrow>Contact</Eyebrow>
        <H
          data-reveal
          className="mt-5 font-display text-[clamp(44px,8vw,128px)] leading-[0.9] font-medium tracking-[-0.045em]"
        >
          Start your <span className="text-map">project.</span>
        </H>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div>
            <p className="max-w-md text-lg leading-8 text-fog">
              Share what you have and what you need. {promises.reply}
            </p>
            <ol className="mt-10 grid gap-6">
              {next.map((s, i) => (
                <li key={s.title} data-reveal style={stagger(i)} className="flex gap-4">
                  <span className="t-mono grid size-9 shrink-0 place-items-center rounded-full border text-[11px] text-map">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-medium">{s.title}</span>
                    <span className="mt-0.5 block text-[15px] leading-6 text-fog">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <ul className="mt-10 grid gap-3 border-t pt-8 text-[15px]">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-map">
                  <WhatsAppIcon className="size-5 text-[#25d366]" /> WhatsApp an engineer
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 break-all hover:text-map">
                  <Mail className="size-5 text-fog" aria-hidden /> {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.tel}`} className="inline-flex items-center gap-3 hover:text-map">
                  <Phone className="size-5 text-fog" aria-hidden /> {site.phone.display}
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-fog">
                <Clock className="size-5" aria-hidden /> {site.hours}
              </li>
              <li className="inline-flex items-center gap-3 text-fog">
                <FileLock2 className="size-5" aria-hidden /> {promises.nda}
              </li>
            </ul>
          </div>

          <div data-reveal className="glass self-start rounded-3xl p-6 sm:p-8">
            {form ?? <LazyQuoteForm />}
          </div>
        </div>
      </Container>
    </Section>
  );
}
