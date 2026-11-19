// shadcn/ui button (new-york-v4 API), restyled: rounded, yellow primary, glass outline.
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-[15px] font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(244,196,48,0.4),0_8px_28px_-8px_rgba(244,196,48,0.55)] hover:bg-[#ffd447]",
        secondary: "bg-ink text-bg hover:bg-ink/85",
        outline:
          "border border-ink/20 bg-ink/[0.04] text-foreground backdrop-blur-md hover:border-ink/40 hover:bg-ink/[0.08]",
        ghost: "text-foreground hover:bg-ink/[0.06]",
        link: "h-auto px-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
