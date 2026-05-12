"use client";

import { useEffect, useState } from "react";

export default function StickyCta() {
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
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
