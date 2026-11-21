import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/transitions";
import { Container, Section } from "@/components/brand/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";

// PLACEHOLDER: have this policy reviewed by the company's legal adviser before launch.
const updated = "21 November 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.legalName} collects, uses and protects personal data from this website and enquiries, in line with India's Digital Personal Data Protection Act, 2023.`,
  alternates: { canonical: "/privacy" },
};

const address = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.countryName}`;

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          This website is operated by {site.legalName} (&ldquo;Infinite Engineering&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;), registered office at {address}. For the purposes of
          India&apos;s Digital Personal Data Protection Act, 2023 (the &ldquo;DPDP Act&rdquo;), we are
          the Data Fiduciary for the personal data described in this policy.
        </p>
        <p>
          This policy covers personal data collected through this website and through enquiries
          you send us by email, phone or WhatsApp. Project data you share with us for delivery
          (scans, drawings, models and GIS datasets) is governed by the non-disclosure agreement
          and contract for that project.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Personal data we collect",
    body: (
      <>
        <p>
          <strong>When you request a quote.</strong> Your name, work email address, the services
          you are interested in and, if you choose to add them, a short description of your
          project. On the optional second step you may also give your company name, phone
          number, file type, project size, deadline, budget and a link to sample files.
        </p>
        <p>
          <strong>When you contact us directly.</strong> The details you share by email, phone or
          WhatsApp, such as your name, contact details and the content of your messages.
        </p>
        <p>
          <strong>When you browse the website.</strong> Anonymous usage and performance
          information, such as pages viewed, the type of device and browser, and clicks on contact
          buttons. Our hosting provider also processes technical data, including IP addresses, to
          deliver and secure the website.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use it",
    body: (
      <ul>
        <li>To reply to your enquiry and prepare a quotation or pilot proposal.</li>
        <li>To deliver, manage and invoice the services you engage us for.</li>
        <li>To keep the website secure and understand how it is used, so we can improve it.</li>
        <li>To meet our legal, tax and regulatory obligations.</li>
      </ul>
    ),
  },
  {
    id: "consent",
    title: "Consent and legal basis",
    body: (
      <p>
        We process the details you submit through the quote form on the basis of your consent,
        which you give with the checkbox on the form. You can withdraw consent at any time by
        writing to us; this does not affect processing carried out before you withdrew it. We
        may also process personal data where the DPDP Act permits it without consent, for
        example to comply with the law.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We do not sell personal data or share it for advertising. We share it only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who help us run the website and handle enquiries:
            website hosting and cookieless analytics (Vercel), and our email delivery provider.
          </li>
          <li>
            <strong>Map tiles.</strong> If you open the interactive map, your browser requests map
            tiles from OpenFreeMap, which receives your IP address to deliver them.
          </li>
          <li>
            <strong>WhatsApp.</strong> If you contact us on WhatsApp, your messages are also
            processed by WhatsApp (Meta) under its own privacy policy.
          </li>
          <li>
            <strong>Authorities</strong>, where we are required to by law.
          </li>
        </ul>
        <p>
          Some of these providers process data outside India. Where they do, we rely on their
          contractual and security commitments, and transfers follow the DPDP Act and any
          restrictions notified under it.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: (
      <p>
        This website does not use advertising or tracking cookies. Our analytics measure page
        views and performance without cookies and without identifying you personally.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep enquiry details for as long as we need them to respond, to deliver any resulting
        project and to keep the business records the law requires. After that we delete them or
        make them anonymous.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        We use reasonable security safeguards, including encrypted connections (HTTPS), access
        limited to the people who need it, and confidentiality agreements. No method of
        transmission or storage is completely secure, but we work to protect your data and will
        notify you and the Data Protection Board of India of a personal data breach as the DPDP
        Act requires.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act you can ask us to:</p>
        <ul>
          <li>give you a summary of the personal data we hold about you and how we use it;</li>
          <li>correct, complete or update it;</li>
          <li>erase it, where we no longer need it for the purpose it was collected for;</li>
          <li>withdraw your consent;</li>
          <li>nominate another person to exercise these rights on your behalf.</li>
        </ul>
        <p>
          To make a request, write to us using the details below. If you are not satisfied with
          our response, you may complain to the Data Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our services are for businesses. This website is not directed at children, and we do
        not knowingly collect personal data from anyone under 18.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The date at the top shows when it was last
        changed.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="Legal"
          crumbs={[{ name: "Privacy Policy" }]}
          title="Privacy Policy."
          intro={`How ${site.legalName} collects, uses and protects your personal data. Last updated ${updated}.`}
        />
        <Section label="Privacy Policy" className="pt-12 sm:pt-16">
          <Container className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="On this page" className="hidden lg:block">
              <ol className="sticky top-28 grid gap-2 text-[14px] text-fog">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 transition-colors hover:text-ink">
                      <span className="t-mono text-[11px] leading-6 text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#contact" className="flex gap-3 transition-colors hover:text-ink">
                    <span className="t-mono text-[11px] leading-6 text-ink/40">{String(sections.length + 1).padStart(2, "0")}</span>
                    Contact and grievances
                  </a>
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 border-b py-8 first:pt-0">
                  <h2 className="flex items-baseline gap-3 font-display text-[22px] font-semibold tracking-[-0.01em] sm:text-2xl">
                    <span className="t-mono text-[12px] font-normal text-fog">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 grid gap-4 text-[15.5px] leading-7 text-ink/80 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
                    {s.body}
                  </div>
                </section>
              ))}

              <section id="contact" className="scroll-mt-28 pt-8">
                <h2 className="flex items-baseline gap-3 font-display text-[22px] font-semibold tracking-[-0.01em] sm:text-2xl">
                  <span className="t-mono text-[12px] font-normal text-fog">
                    {String(sections.length + 1).padStart(2, "0")}
                  </span>
                  Contact and grievances
                </h2>
                <div className="mt-4 grid gap-4 text-[15.5px] leading-7 text-ink/80">
                  <p>
                    For questions about this policy, to exercise your rights or to raise a
                    grievance, contact us. We aim to respond within the time the DPDP Act and its
                    rules allow.
                  </p>
                  <address className="rounded-xl border bg-surface p-5 not-italic sm:p-6">
                    <span className="block font-semibold text-ink">{site.legalName}</span>
                    <span className="mt-1 block">{address}</span>
                    <span className="mt-3 block">
                      Email:{" "}
                      <a href={`mailto:${site.email}`} className="break-all text-ink underline underline-offset-2">
                        {site.email}
                      </a>
                    </span>
                    <span className="block">
                      Phone:{" "}
                      <a href={`tel:${site.phone.tel}`} className="text-ink underline underline-offset-2">
                        {site.phone.display}
                      </a>
                    </span>
                  </address>
                  <p>
                    <Link href="/contact" className="font-medium text-ink underline underline-offset-4">
                      Back to contact and quotations
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </Container>
        </Section>
      </div>
      <JsonLd
        data={
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ]) as never
        }
      />
    </PageTransition>
  );
}
