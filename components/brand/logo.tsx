/* eslint-disable @next/next/no-img-element -- small pre-sized brand files, no optimiser needed */
import { cn } from "@/lib/utils";

/*
 * The company logo (supplied artwork): a glossy blue infinity ribbon around a
 * tower and a steel frame, "INFINITE", and "Design • Model • Build Beyond".
 * The dark-background files use light lettering so it stays visible on black.
 * Files in public/brand/:
 *   infinite-logo-color.png  original, for light backgrounds
 *   infinite-logo-dark.png   same artwork with light lettering, for dark backgrounds
 *   infinite-emblem(-color).webp, infinite-word(-color).webp  header pieces
 *   infinite-logo.png        square icon (dark tile)
 */

/** The emblem alone: infinity ribbon, tower and frame. */
export function LogoMark({ className, onLight = false }: { className?: string; onLight?: boolean }) {
  return (
    <img
      src={onLight ? "/brand/infinite-emblem-color.webp" : "/brand/infinite-emblem.webp"}
      alt=""
      width={374}
      height={132}
      className={cn("h-10 w-auto", className)}
    />
  );
}

/** Header lockup: emblem + INFINITE. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 paper:hidden lg:h-10" />
      <LogoMark onLight className="hidden h-9 paper:block lg:h-10" />
      {/* light lettering on dark bars; the original navy lettering on paper bars */}
      <img
        src="/brand/infinite-word.webp"
        alt=""
        width={587}
        height={54}
        className="h-[14px] w-auto paper:hidden lg:h-[15px]"
      />
      <img
        src="/brand/infinite-word-color.webp"
        alt=""
        width={587}
        height={54}
        className="hidden h-[14px] w-auto paper:block lg:h-[15px]"
      />
      <span className="sr-only">Infinite Engineering Service and Technology</span>
    </span>
  );
}

/** Full stacked logo with tagline, for dark backgrounds. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <img
      src="/brand/infinite-logo-dark.webp"
      alt="Infinite: Design, Model, Build Beyond"
      width={640}
      height={264}
      className={cn("h-auto w-60", className)}
    />
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-5", className)}
      fill="currentColor"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.22-.08-.39-.12-.55.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47a.9.9 0 0 0-.66.31c-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-5", className)}
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
