"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyCta() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const footer = document.getElementById("footer");
    const cta = ctaRef.current;
    if (!hero || !footer || !cta) return;

    let rafId = 0;

    function update() {
      rafId = 0;
      const ctaRect = cta!.getBoundingClientRect();
      const heroRect = hero!.getBoundingClientRect();
      const footerRect = footer!.getBoundingClientRect();

      // White while the CTA still overlaps the hero — flips the second the
      // hero's bottom edge passes above the CTA's top.
      setOverHero(heroRect.bottom > ctaRect.top);

      // Hide only when the footer would visually collide with the CTA.
      setHidden(footerRect.top < ctaRect.bottom);
    }

    function schedule() {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <a
      ref={ctaRef}
      href="#footer"
      aria-label="Get in touch — scroll to footer"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`group fixed left-1/2 bottom-[52px] z-50 -translate-x-1/2 flex flex-col items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] transition-[opacity,color] duration-300 hover:opacity-80 ${
        overHero ? "text-white" : "text-black"
      } ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <span className="underline underline-offset-4">Get in touch</span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="transition-transform group-hover:translate-y-0.5"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </a>
  );
}
