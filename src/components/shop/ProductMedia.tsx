"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, useFinePointer, useReducedMotion } from "./motion";

/**
 * A product's picture: lifts and tilts a little under the pointer on
 * desktop, and gives a small pop when the item is added to the order.
 *
 * This is the other Rive seam. Later, a `ProductCard` artboard with a view
 * model of `garment` (tee | crew | hoodie), `size`, and an `added` trigger
 * can replace the inside of this component; the props already carry what
 * it will need (`productId`, `selectedSize`, `addedSignal`).
 */
export function ProductMedia({
  productId,
  src,
  alt,
  selectedSize,
  addedSignal,
}: {
  productId: string;
  src: string;
  alt: string;
  selectedSize: string;
  /** Increments every time this product is added to the order. */
  addedSignal: number;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [lift, setLift] = useState(false);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    if (!addedSignal) return;
    animate(
      imgRef.current,
      [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
      { duration: 420, easing: "cubic-bezier(.3,1.4,.5,1)" },
      reduced,
    );
  }, [addedSignal, reduced]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !fine || raf.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(-8px) rotateY(${(x * 14).toFixed(1)}deg) rotateX(${(-y * 10).toFixed(1)}deg)`;
      }
    });
  }

  return (
    <div
      className="relative aspect-square bg-surface [perspective:800px]"
      onPointerEnter={() => fine && setLift(true)}
      onPointerLeave={() => {
        setLift(false);
        if (imgRef.current) imgRef.current.style.transform = "";
      }}
      onPointerMove={onMove}
      data-shop-slot="product"
      data-product={productId}
      data-size={selectedSize}
    >
      <div className="absolute inset-0 p-[22px]">
        <div
          ref={imgRef}
          className={`relative size-full transition-[transform,filter] duration-300 [transform-style:preserve-3d] ${
            lift
              ? "[filter:drop-shadow(0_22px_22px_rgba(0,0,0,.25))]"
              : "[filter:drop-shadow(0_10px_14px_rgba(0,0,0,.18))]"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>
      <span
        aria-hidden
        className={`absolute right-[22%] bottom-[6%] left-[22%] h-4 rounded-full transition-[transform,opacity] duration-300 ${
          lift ? "scale-[.8] opacity-60" : ""
        }`}
        style={{ background: "radial-gradient(closest-side, rgba(0,0,0,.25), transparent)" }}
      />
    </div>
  );
}
