import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cta } from "@/config/site";

export default function NotFound() {
  const links = [
    { href: "/services", label: "Services", body: "Scanning, CAD, BIM and GIS" },
    { href: "/work", label: "Representative work", body: "Typical scopes and turnaround" },
    { href: "/contact", label: "Contact", body: "Talk to an engineer" },
  ];
  return (
    <section className="bg-canvas px-4 pt-36 pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-brand">Error 404</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,6vw,3.75rem)] leading-tight font-semibold">
          Page not found.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-muted-foreground">
          It may have moved, or the link may be mistyped. These are good places
          to continue:
        </p>
        <ul className="mt-10 grid gap-3 text-left sm:grid-cols-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full flex-col rounded-xl border bg-surface p-4 shadow-card transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="font-semibold">{l.label}</span>
                <span className="mt-1 text-sm text-muted-foreground">{l.body}</span>
                <ArrowRight className="mt-3 size-4 text-brand transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild>
            <Link href={cta.href}>{cta.primary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
