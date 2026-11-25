"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Spotlight } from "@/content/spotlights";
import { Button } from "./Button";

const STRIPES = ["#cf3e41", "#e2ab37", "#d2d3c3", "#2e979b", "#a52e64", "#65927d", "#2f6486"];
const INTERVAL_MS = 8000;

const themes: Record<Spotlight["theme"], { bg: string; eyebrow: string; body: string; primary: string; secondary: string }> = {
  green: {
    bg: "bg-[#163a2a] text-[#f5efe0]",
    eyebrow: "text-[#e2ab37]",
    body: "text-[#d9d3c4]",
    primary: "bg-[#f5efe0] text-[#163a2a] hover:bg-white",
    secondary: "border-[1.5px] border-[#f5efe0]/50 text-[#f5efe0] hover:bg-white/10",
  },
  coal: {
    bg: "bg-coal text-white",
    eyebrow: "text-teal-light",
    body: "text-[#d9d3ca]",
    primary: "bg-primary text-white hover:bg-primary-deep",
    secondary: "border-[1.5px] border-white/55 text-white hover:bg-white/10",
  },
};

function Shirts() {
  const shirts = [
    { src: "/shop/crew.webp", alt: "Central Church crewneck", cls: "left-[4%] top-[18%] w-[46%] rotate-[-7deg]" },
    { src: "/shop/hoodie.webp", alt: "Central Church hoodie", cls: "right-[4%] top-[14%] w-[48%] rotate-[6deg]" },
    { src: "/shop/tee.webp", alt: "Central Church T-shirt", cls: "left-[25%] top-[30%] w-[50%] z-[2]" },
  ];
  return (
    <div className="relative h-full min-h-[260px] w-full overflow-hidden lg:min-h-0">
      <div className="absolute inset-x-0 bottom-0 grid h-3 grid-cols-7" aria-hidden>
        {STRIPES.map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
      </div>
      {shirts.map((s) => (
        <div key={s.src} className={`absolute aspect-square ${s.cls}`}>
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="(min-width: 1024px) 320px, 60vw"
            className="object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,.45)]"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Banner-sized homepage spotlight. Rotates through the active entries in
 * src/content/spotlights.ts every few seconds, pausing while hovered or
 * focused and never auto-advancing under reduced motion. With one entry
 * it's a plain banner; with none it renders nothing.
 */
export function HomeSpotlight({ items }: { items: Spotlight[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = items.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (n < 2 || paused || reduced || document.visibilityState === "hidden") return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), INTERVAL_MS);
    return () => clearInterval(t);
  }, [n, paused, reduced, index]);

  if (n === 0) return null;
  const go = (i: number) => setIndex((i + n) % n);

  return (
    <section
      aria-roledescription={n > 1 ? "carousel" : undefined}
      aria-label="Spotlight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
      }}
      className="relative"
    >
      <div className="grid">
        {items.map((s, i) => {
          const t = themes[s.theme];
          const active = i === index;
          return (
            <div
              key={s.id}
              role={n > 1 ? "group" : undefined}
              aria-roledescription={n > 1 ? "slide" : undefined}
              aria-label={n > 1 ? `${i + 1} of ${n}` : undefined}
              aria-hidden={!active}
              inert={!active}
              className={`[grid-area:1/1] transition-opacity duration-700 ${active ? "opacity-100" : "pointer-events-none opacity-0"} ${t.bg}`}
            >
              <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:min-h-[460px] lg:grid-cols-[1.05fr_1fr]">
                <div className={`order-2 flex flex-col justify-center gap-4 px-5 pt-8 lg:order-1 lg:gap-5 lg:px-14 lg:py-14 ${n > 1 ? "pb-[72px]" : "pb-8"}`}>
                  <span className={`text-[11px] font-bold tracking-[.16em] uppercase ${t.eyebrow} lg:text-xs`}>
                    {s.eyebrow}
                  </span>
                  <h2 className="m-0 font-display text-[32px] leading-[1.02] font-bold tracking-[-.035em] text-pretty-wrap lg:text-[54px] lg:tracking-[-.04em]">
                    {s.title}
                  </h2>
                  <p className={`m-0 max-w-[560px] text-base leading-[1.55] text-pretty-wrap lg:text-[18px] ${t.body}`}>
                    {s.body}
                  </p>
                  <div className="mt-1 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                    <Button href={s.primary.href} className={t.primary}>
                      {s.primary.label}
                    </Button>
                    {s.secondary ? (
                      <Button href={s.secondary.href} className={t.secondary}>
                        {s.secondary.label}
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="order-1 relative lg:order-2">
                  {s.visual.kind === "photo" ? (
                    <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
                      <Image
                        src={s.visual.src}
                        alt={s.visual.alt}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover object-[center_30%]"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
                      <Shirts />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {n > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 lg:bottom-5 lg:justify-start lg:px-14">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className="grid size-8 place-items-center rounded-full text-white hover:bg-white/15"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m15 5-7 7 7 7" />
              </svg>
            </button>
            {items.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${s.title}`}
                aria-current={i === index ? "true" : undefined}
                className="grid size-8 place-items-center"
              >
                <span
                  className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/55"
                  }`}
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className="grid size-8 place-items-center rounded-full text-white hover:bg-white/15"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
