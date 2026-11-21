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
    // A "wipe" element starts fully clipped (clip-path), and Chrome counts its
    // own clip-path, so it would never intersect: watch its parent instead.
    const targetOf = new Map<Element, HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (targetOf.get(e.target) ?? (e.target as HTMLElement)).dataset.in = "";
          targetOf.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    const watch = (el: HTMLElement) => {
      const proxy = el.dataset.reveal === "wipe" ? el.parentElement : null;
      if (proxy && !targetOf.has(proxy)) {
        targetOf.set(proxy, el);
        io.observe(proxy);
      } else io.observe(el);
    };

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
          else watch(el);
        });
    };

    // This effect runs once the layout has hydrated, but page segments stream in
    // and hydrate later. Writing data-in onto their elements before React has
    // claimed them triggers hydration warnings, so wait for load and an idle
    // moment (React keeps the main thread busy until hydration is done).
    // Until then nothing is hidden, since reveal-on is not yet set.
    let frame = 0;
    let idle = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    const start = () => {
      scan();
      document.documentElement.classList.add("reveal-on");
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const afterLoad = () => {
      // Safari has no requestIdleCallback
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(start, { timeout: 1500 })
          : window.setTimeout(start, 200);
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      window.removeEventListener("load", afterLoad);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
