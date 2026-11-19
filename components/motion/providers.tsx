"use client";

import { useEffect } from "react";
/**
 * Drives every [data-reveal] element on the site with one IntersectionObserver.
 * Elements already on screen are marked in before reveals are switched on, so
 * nothing visible ever flashes. New content (route changes, lazy sections) is
 * picked up through a MutationObserver.
 */
export function RevealObserver() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    const scan = () => {
      const vh = window.innerHeight;
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])")
        .forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          const r = el.getBoundingClientRect();
          // Already in (or above) the viewport: show immediately, no animation
          if (r.top < vh * 0.92) el.dataset.in = "";
          else io.observe(el);
        });
    };

    scan();
    document.documentElement.classList.add("reveal-on");

    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
