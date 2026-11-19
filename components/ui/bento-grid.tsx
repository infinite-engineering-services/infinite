// Source: Magic UI "Bento Grid" (magicui.design, also on 21st.dev).
// Adapted: lucide icons instead of @radix-ui/react-icons, the whole card is a
// link (keyboard and touch friendly), and colours come from the site tokens.
import Link from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoGrid({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[19rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  description,
  href,
  cta = "Learn more",
  icon,
  background,
  meta,
  className,
  style,
  dark,
}: {
  name: string;
  description: string;
  href: string;
  cta?: string;
  icon?: ReactNode;
  /** Image or decoration filling the top of the card. */
  background?: ReactNode;
  meta?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Render text in light colours over a dark image. */
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      style={style}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-xl border bg-card shadow-card transition-[box-shadow,translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong/40 hover:shadow-lift",
        className,
      )}
    >
      {background ? (
        <div className="absolute inset-0 -z-0">{background}</div>
      ) : null}
      <div
        className={cn(
          "relative z-10 flex flex-col gap-2 p-6",
          dark &&
            "bg-gradient-to-t from-[#0a0e0d] via-[#0a0e0d]/85 to-transparent pt-16 text-white",
        )}
      >
        {icon ? (
          <span
            className={cn(
              "mb-2 grid size-10 place-items-center rounded-lg border text-brand transition-transform duration-300 group-hover:scale-95",
              dark ? "border-white/15 bg-white/10 text-[#f4c430]" : "bg-canvas",
            )}
          >
            {icon}
          </span>
        ) : null}
        <h3 className="font-display text-xl leading-snug font-semibold">
          {name}
        </h3>
        <p
          className={cn(
            "max-w-md text-[15px] leading-6",
            dark ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
        {meta}
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1.5 text-sm font-medium",
            dark ? "text-[#f4c430]" : "text-brand",
          )}
        >
          {cta}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
