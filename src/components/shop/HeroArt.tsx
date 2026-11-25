"use client";

import Image from "next/image";
import { useRef } from "react";
import { useFinePointer, useReducedMotion } from "./motion";

/**
 * The shop hero's artwork: the skyline print behind a seven-bar stripe
 * curtain that lifts away on load (CSS, see shop.css), tilting gently with
 * the pointer on desktop.
 *
 * Kept as its own component on purpose — this is the seam where a Rive
 * `Hero` artboard can take over later without touching the rest of the
 * page. Same props, same box.
 */
export function HeroArt({ src, alt }: { src: string; alt: string }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !fine || raf.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateY(${((x - 0.5) * 10).toFixed(2)}deg) rotateX(${((0.5 - y) * 8).toFixed(2)}deg)`;
      }
    });
  }
  function onLeave() {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  }

  return (
    <div
      className="relative mx-auto aspect-[8/7] w-full max-w-[560px] [perspective:900px]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-shop-slot="hero"
    >
      <div
        ref={tiltRef}
        className="absolute inset-0 transition-transform duration-200 ease-out [transform-style:preserve-3d]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="rounded-t-[14px] object-contain"
        />
      </div>
      <div className="shop-curtain pointer-events-none absolute inset-0 grid grid-cols-7" aria-hidden>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <i key={n} style={{ ["--i" as string]: n - 1, background: `var(--s${n})` }} />
        ))}
      </div>
    </div>
  );
}
