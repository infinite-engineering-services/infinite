"use client";

// Base: shadcnblocks "Navbar 1" (also on 21st.dev), rebuilt on the site's
// NavigationMenu / Sheet / Accordion from shadcn/ui.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Phone } from "lucide-react";
import { Logo, WhatsAppIcon } from "@/components/brand/logo";
import { Icon } from "@/components/brand/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cta, nav, site, whatsappLink } from "@/config/site";
import { services } from "@/content/services";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const links = nav.filter((n) => n.href !== "/services");

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [paper, setPaper] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  // Solid glass once scrolled; light glass while over a paper band
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 34)
        .find((el) => !bar.current?.contains(el));
      setPaper(!!under?.closest('[data-theme="paper"]'));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3"
      style={{ viewTransitionName: "site-header" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div
        ref={bar}
        data-theme={paper && !open ? "paper" : undefined}
        className={cn(
          "mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 rounded-2xl border border-transparent px-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-4 lg:h-16",
          (scrolled || open) && "glass",
        )}
      >
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop */}
        <NavigationMenu className="hidden lg:flex" aria-label="Primary" viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "rounded-full bg-transparent text-[15px] hover:bg-ink/[0.06] focus:bg-ink/[0.06] data-[state=open]:bg-ink/[0.08]",
                  isActive("/services") && "text-map",
                )}
              >
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent className="glass !rounded-2xl !border-ink/10 !bg-[rgba(14,19,17,0.92)]">
                <ul className="grid w-[660px] grid-cols-2 gap-1 p-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/services/${s.slug}`}
                          className="flex flex-row items-start gap-3 rounded-xl p-3 hover:bg-ink/[0.06]"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-ink/[0.04] text-map">
                            <Icon name={s.icon} className="size-[18px]" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-foreground">
                              {s.title}
                            </span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                              {s.short}
                            </span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="col-span-2 mt-1 border-t pt-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/services"
                        className="flex-row items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-ink/[0.06]"
                      >
                        All services and how they connect
                        <ArrowRight className="size-4 text-map" />
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {links.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full px-4 text-[15px] font-medium hover:bg-ink/[0.06]",
                      isActive(item.href) && "text-map",
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-[15px] md:inline-flex"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: "header" })}
            >
              <WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp
            </a>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link
              href={cta.href}
              onClick={() => track("quote_cta_click", { from: "header" })}
            >
              {cta.primary}
            </Link>
          </Button>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="glass w-full !max-w-none overflow-y-auto border-0 !bg-[rgba(10,14,13,0.86)] sm:w-[420px]">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation and contact options
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col px-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="services" className="border-b">
                    <AccordionTrigger className="py-4 font-display text-2xl font-medium hover:no-underline">
                      Services
                    </AccordionTrigger>
                    <AccordionContent className="grid gap-1 pb-3">
                      {services.map((s) => (
                        <SheetClose asChild key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] hover:bg-ink/[0.06]"
                          >
                            <Icon
                              name={s.icon}
                              className="size-4 shrink-0 text-map"
                            />
                            {s.title}
                          </Link>
                        </SheetClose>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {links.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="border-b py-4 font-display text-2xl font-medium aria-[current=page]:text-map"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto grid gap-2.5 p-5">
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href={cta.href}>
                      {cta.primary} <ArrowRight />
                    </Link>
                  </Button>
                </SheetClose>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button asChild size="lg" variant="outline">
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        track("whatsapp_click", { from: "mobile_menu" })
                      }
                    >
                      <WhatsAppIcon className="size-4 text-[#25d366]" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a
                      href={`tel:${site.phone.tel}`}
                      onClick={() => track("call_click", { from: "mobile_menu" })}
                    >
                      <Phone /> Call
                    </a>
                  </Button>
                </div>
                <p className="pt-1 text-center text-sm text-muted-foreground">
                  {site.hours}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
