import { Plus } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/logo";
import { Container, Section, SectionHeading } from "@/components/brand/primitives";
import { Button } from "@/components/ui/button";
import { cta, whatsappLink } from "@/config/site";
import { faqs } from "@/content/misc";
import type { Faq as FaqItem } from "@/lib/types";

/** The four questions the homepage answers (pilot, data and pricing have their own band). */
export const homeFaqs = [1, 2, 0, 7].map((i) => faqs[i]);

/**
 * Two-column FAQ with native <details name> so only one answer is open and
 * no JS is needed.
 */
export function Faq({
  items = faqs,
  tone = "paper",
}: {
  items?: FaqItem[];
  tone?: "paper" | "void" | "carbon";
}) {
  return (
    <Section id="faq" tone={tone} label="Frequently asked questions">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions."
            intro="Formats, accuracy, on-site capture and working hours. For anything else, speak to an engineer directly."
          >
            <Button asChild variant="outline" className="mt-8">
              <a
                href={whatsappLink("Hi, I have a question before sending files.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4 text-[#1a9e55]" /> {cta.secondary}
              </a>
            </Button>
          </SectionHeading>
        </div>
        <div data-reveal className="grid gap-3">
          {items.map((f, i) => (
            <details
              key={f.q}
              name="faq"
              className="group rounded-2xl border bg-card px-5 transition-colors open:border-line-strong sm:px-6"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="t-mono mt-1 text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-[19px] leading-snug font-medium tracking-[-0.01em]">
                  {f.q}
                </span>
                <Plus
                  className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="pb-5 pl-9 text-[15px] leading-7 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function faqLd(items = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } as const;
}
