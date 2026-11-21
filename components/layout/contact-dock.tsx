"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/logo";
import { cta, site, whatsappLink } from "@/config/site";
import { services } from "@/content/services";
import { track } from "@/lib/analytics";

function messageFor(pathname: string) {
  const svc = services.find((s) => pathname.startsWith(`/services/${s.slug}`));
  return svc
    ? `Hi ${site.name}, I'd like a quote for ${svc.title}.`
    : `Hi ${site.name}, I'd like a quote for a project.`;
}

/** Mobile: fixed bottom bar (Call · WhatsApp · Pilot). Desktop: floating WhatsApp button. */
export function ContactDock() {
  const pathname = usePathname();
  const wa = whatsappLink(messageFor(pathname));
  const onContact = pathname === "/contact";
  const item =
    "flex h-12 items-center justify-center gap-1.5 rounded-full text-[13px] font-medium";

  return (
    <>
      <div
        style={{ viewTransitionName: "contact-dock" }}
        className="glass fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 grid grid-cols-[1fr_1.2fr_1.5fr] gap-1 rounded-full p-1 md:hidden"
      >
        <a
          href={`tel:${site.phone.tel}`}
          onClick={() => track("call_click", { from: "dock" })}
          className={`${item} text-foreground`}
        >
          <Phone className="size-[18px]" aria-hidden /> Call
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "dock" })}
          className={`${item} text-foreground`}
        >
          <WhatsAppIcon className="size-[18px] text-[#25d366]" /> WhatsApp
        </a>
        {onContact ? (
          <a
            href={`mailto:${site.email}`}
            className={`${item} bg-primary text-primary-foreground`}
          >
            <Mail className="size-[18px]" aria-hidden /> Email
          </a>
        ) : (
          <Link
            href={cta.href}
            onClick={() => track("quote_cta_click", { from: "dock" })}
            className={`${item} bg-primary font-semibold text-primary-foreground`}
          >
            <FileText className="size-[18px]" aria-hidden /> Start
          </Link>
        )}
      </div>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with an engineer on WhatsApp"
        style={{ viewTransitionName: "contact-fab" }}
        onClick={() => track("whatsapp_click", { from: "fab" })}
        className="glass group fixed right-6 bottom-6 z-40 hidden h-13 items-center gap-0 overflow-hidden rounded-full px-3.5 text-ink transition-[gap,padding] duration-300 hover:gap-2.5 hover:pr-5 md:inline-flex"
      >
        <WhatsAppIcon className="size-6 text-[#25d366]" />
        <span className="max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-48 group-focus-visible:max-w-48">
          Chat with an engineer
        </span>
      </a>
    </>
  );
}
