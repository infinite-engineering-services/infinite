"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const QuoteForm = dynamic(() => import("./quote-form").then((m) => m.QuoteForm), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

/** Same footprint as the step-1 form, so nothing shifts when it swaps in. */
function FormSkeleton() {
  return (
    <div aria-hidden className="grid min-h-[470px] animate-pulse gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i}>
            <div className="mb-2 h-3.5 w-24 rounded bg-ink/10" />
            <div className="h-11 rounded-xl border bg-ink/[0.04]" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-32 rounded-full border bg-ink/[0.04]" />
        ))}
      </div>
      <div className="h-24 rounded-xl border bg-ink/[0.04]" />
      <div className="h-12 w-56 rounded-full bg-ink/10" />
    </div>
  );
}

/**
 * Homepage only: loads react-hook-form + zod when the form approaches the
 * viewport, keeping them out of the first-load JS. /contact renders the form
 * directly.
 */
export function LazyQuoteForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "1000px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{show ? <QuoteForm /> : <FormSkeleton />}</div>;
}
