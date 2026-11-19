import { ViewTransition, type ReactNode } from "react";

/** Fade/rise between routes (React <ViewTransition>, see globals.css). */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}

/** Morphs a project image from its card into the case-study hero. */
export function ProjectImageTransition({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={`project-${slug}`}
      share="project-image"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
