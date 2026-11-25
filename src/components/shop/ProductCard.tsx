"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAX_LINE_QTY,
  formatMoney,
  isSoldOut,
  sizeGroups,
  sizeLabel,
  type ShopProduct,
} from "@/lib/shop";
import { ProductMedia } from "./ProductMedia";
import { animate, useReducedMotion } from "./motion";

/** Pick adult "L" when it's available, else the first size that isn't sold out. */
function defaultSize(product: ShopProduct): string {
  const open = product.sizes.filter((s) => !isSoldOut(product, s));
  if (open.includes("L")) return "L";
  return open[0] ?? product.sizes[0];
}

export function ProductCard({
  product,
  closed,
  onAdd,
}: {
  product: ShopProduct;
  /** Shop is closed: no Add button, a short notice instead. */
  closed: boolean;
  onAdd: (product: ShopProduct, size: string, qty: number, fromEl: HTMLElement) => void;
}) {
  const [size, setSize] = useState(() => defaultSize(product));
  const [qty, setQty] = useState(1);
  const [addedLabel, setAddedLabel] = useState<string | null>(null);
  const [addedSignal, setAddedSignal] = useState(0);
  const [soldOutNote, setSoldOutNote] = useState<string | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    if (noteTimer.current) clearTimeout(noteTimer.current);
  }, []);

  const groups = sizeGroups(product.sizes);
  // Sizes marked sold out in Supabase can't be picked; arrow keys skip them.
  const pickable = product.sizes.filter((s) => !isSoldOut(product, s));
  const selectedSoldOut = isSoldOut(product, size);

  function onSizeKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta || pickable.length === 0) return;
    e.preventDefault();
    const i = Math.max(0, pickable.indexOf(size));
    const next = pickable[(i + delta + pickable.length) % pickable.length];
    setSize(next);
    const btn = e.currentTarget.querySelector<HTMLButtonElement>(`button[data-size="${CSS.escape(next)}"]`);
    btn?.focus();
  }

  function pickSize(s: string) {
    if (isSoldOut(product, s)) {
      // No hover on a phone, so a tap shows the note briefly instead.
      setSoldOutNote(`${sizeLabel(s)} is sold out`);
      if (noteTimer.current) clearTimeout(noteTimer.current);
      noteTimer.current = setTimeout(() => setSoldOutNote(null), 1800);
      return;
    }
    setSize(s);
  }

  function add(e: React.MouseEvent<HTMLButtonElement>) {
    if (selectedSoldOut) return;
    const btn = e.currentTarget;
    onAdd(product, size, qty, btn);
    setAddedSignal((s) => s + 1);
    setAddedLabel(`Added ${qty} · ${sizeLabel(size)}`);
    animate(
      labelRef.current,
      [{ transform: "translateY(100%)", opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 300, easing: "ease-out" },
      reduced,
    );
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setAddedLabel(null);
      setQty(1);
    }, 1500);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(20,17,15,.35)]">
      <ProductMedia
        productId={product.id}
        src={product.imagePath}
        alt={product.imageAlt}
        selectedSize={size}
        addedSignal={addedSignal}
      />
      <div className="flex flex-col gap-3.5 p-[18px]">
        <div className="flex items-baseline justify-between gap-2.5">
          <h3 className="m-0 font-display text-[21px]">{product.name}</h3>
          <span className="font-display text-[21px] font-semibold tabular-nums text-primary">
            {formatMoney(product.priceCents)}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label={`${product.name} size`}
          onKeyDown={onSizeKey}
          className="flex flex-col gap-2"
        >
          {groups.map((group) => {
            const n = group.sizes.length;
            const idx = group.sizes.indexOf(size);
            return (
              <div key={group.label} className="flex flex-col gap-1">
                {groups.length > 1 ? (
                  <span className="text-[11px] font-bold tracking-[.12em] uppercase text-muted">{group.label}</span>
                ) : null}
                <div className="relative grid rounded-xl bg-surface p-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                  {idx >= 0 ? (
                    <span
                      aria-hidden
                      className="absolute top-1 bottom-1 left-1 rounded-[9px] bg-ink transition-transform duration-[350ms]"
                      style={{
                        width: `calc((100% - 8px) / ${n})`,
                        transform: `translateX(${idx * 100}%)`,
                        transitionTimingFunction: "cubic-bezier(.3,1.4,.5,1)",
                      }}
                    />
                  ) : null}
                  {group.sizes.map((s) => {
                    const checked = s === size;
                    const soldOut = isSoldOut(product, s);
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        aria-disabled={soldOut || undefined}
                        aria-label={soldOut ? `${sizeLabel(s)}, sold out` : sizeLabel(s)}
                        title={soldOut ? "Sold Out" : undefined}
                        tabIndex={checked ? 0 : -1}
                        data-size={s}
                        onClick={() => pickSize(s)}
                        className={`group relative z-[1] h-11 rounded-[9px] text-[13px] font-bold transition-colors duration-200 ${
                          soldOut
                            ? "cursor-not-allowed text-line-dark line-through decoration-[1.5px]"
                            : checked
                              ? "text-white"
                              : "text-ink hover:text-primary"
                        }`}
                      >
                        {s}
                        {soldOut ? (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[11px] font-bold whitespace-nowrap text-white no-underline opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                          >
                            Sold Out
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <p role="status" aria-live="polite" className={`m-0 min-h-[18px] text-[12.5px] font-semibold text-muted ${soldOutNote ? "" : "sr-only"}`}>
            {soldOutNote ?? ""}
          </p>
        </div>

        {closed ? (
          <p className="m-0 rounded-xl bg-surface px-4 py-3 text-center text-[14.5px] font-semibold text-body">
            Orders are closed right now. Check back soon.
          </p>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="flex h-[46px] items-center rounded-full border-[1.5px] border-line">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={`Decrease ${product.name} quantity`}
                className="h-11 w-[42px] text-xl text-ink"
              >
                −
              </button>
              <output aria-live="polite" className="min-w-5 text-center font-bold tabular-nums">
                {qty}
              </output>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_LINE_QTY, q + 1))}
                aria-label={`Increase ${product.name} quantity`}
                className="h-11 w-[42px] text-xl text-ink"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={add}
              disabled={selectedSoldOut}
              className={`relative flex h-[46px] flex-1 items-center justify-center overflow-hidden rounded-full px-[18px] text-[15px] font-bold text-white transition-colors disabled:opacity-40 ${
                addedLabel ? "bg-accent" : "bg-primary hover:bg-primary-deep"
              }`}
            >
              <span ref={labelRef} className="inline-block whitespace-nowrap">
                {addedLabel ?? `Add to order · ${formatMoney(product.priceCents * qty)}`}
              </span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
