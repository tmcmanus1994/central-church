"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_LINES,
  MAX_LINE_QTY,
  cartCount,
  formatMoney,
  sanitizeCart,
  type CartLine,
  type ShopProduct,
  type ShopSettings,
} from "@/lib/shop";
import { HeroArt } from "./HeroArt";
import { OrderDrawer } from "./OrderDrawer";
import { ProductCard } from "./ProductCard";
import { animate, useReducedMotion } from "./motion";
import "./shop.css";

const CART_KEY = "central-shop-cart";
const HEADLINE = ["Wear", "Central", "all", "week", "long"];

/**
 * Everything interactive on /shop: the sticky Order button with its badge,
 * the hero, the product grid, and the order drawer. The page passes in
 * products and settings from Supabase; this component owns the cart
 * (mirrored to localStorage so a refresh doesn't lose it) and the drawer.
 */
export function ShopExperience({ products, settings }: { products: ShopProduct[]; settings: ShopSettings }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const closed = !settings.isOpen;
  const count = cartCount(cart);

  // Cart persistence. Every storage call is wrapped: private windows and
  // blocked site data can throw, and the shop must work either way.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (raw) setCart(sanitizeCart(JSON.parse(raw), products));
    } catch {
      /* no saved cart */
    }
    setHydrated(true);
  }, [products]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (cart.length === 0) window.localStorage.removeItem(CART_KEY);
      else window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart, hydrated]);

  const openDrawer = useCallback(() => {
    setOpenedAt((t) => t ?? Date.now());
    setDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  function bumpBadge() {
    animate(
      badgeRef.current,
      [{ transform: "scale(1)" }, { transform: "scale(1.45)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }],
      { duration: 520, easing: "ease-out" },
      reduced,
    );
  }

  /** A small dot arcs from the Add button to the badge, then the badge bumps. */
  function flyToBadge(fromEl: HTMLElement) {
    const badge = badgeRef.current;
    if (!badge || reduced || typeof document.body.animate !== "function") {
      bumpBadge();
      return;
    }
    const a = fromEl.getBoundingClientRect();
    const b = badge.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.setAttribute("aria-hidden", "true");
    dot.className = "pointer-events-none fixed top-0 left-0 z-[60] size-4 rounded-full bg-accent shadow-[0_0_0_3px_#fff]";
    document.body.appendChild(dot);
    const x0 = a.left + a.width / 2 - 8;
    const y0 = a.top + a.height / 2 - 8;
    const x1 = b.left + b.width / 2 - 8;
    const y1 = b.top + b.height / 2 - 8;
    const mx = (x0 + x1) / 2;
    const my = Math.min(y0, y1) - 120;
    const anim = dot.animate(
      [
        { transform: `translate(${x0}px, ${y0}px) scale(1)` },
        { transform: `translate(${mx}px, ${my}px) scale(1.3)`, offset: 0.5 },
        { transform: `translate(${x1}px, ${y1}px) scale(.6)` },
      ],
      { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" },
    );
    anim.onfinish = () => {
      dot.remove();
      bumpBadge();
    };
  }

  function addToCart(product: ShopProduct, size: string, qty: number, fromEl: HTMLElement) {
    setCart((prev) => {
      const next = prev.map((l) => ({ ...l }));
      const line = next.find((l) => l.productId === product.id && l.size === size);
      if (line) line.qty = Math.min(MAX_LINE_QTY, line.qty + qty);
      else if (next.length < MAX_LINES) next.push({ productId: product.id, size, qty });
      return next;
    });
    flyToBadge(fromEl);
  }

  function changeLine(index: number, delta: number) {
    setCart((prev) => {
      const next = prev.map((l) => ({ ...l }));
      const line = next[index];
      if (!line) return prev;
      line.qty = Math.min(MAX_LINE_QTY, line.qty + delta);
      if (line.qty <= 0) next.splice(index, 1);
      return next;
    });
    if (delta > 0) bumpBadge();
  }

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <div className="shop">
      {/* Shop bar: the Order button lives here rather than in the global
          header, so the rest of the site is untouched. Sticks just under
          the site header (36+64px on phones, 44+82px on desktop). */}
      <div className="sticky top-[100px] z-30 border-b border-line bg-white/95 backdrop-blur lg:top-[126px]">
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4 px-5">
          <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">Central Shop</span>
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            className="inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] border-line-dark bg-white pr-2.5 pl-[18px] text-[15px] font-bold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            Order
            <span
              ref={badgeRef}
              aria-hidden
              data-shop-slot="badge"
              className={`grid size-[26px] place-items-center rounded-full text-[12.5px] font-bold tabular-nums text-white transition-colors duration-200 ${
                count > 0 ? "bg-accent" : "bg-muted"
              }`}
            >
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="overflow-hidden bg-coal pt-[52px] text-white" aria-labelledby="shop-hero-title">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-9 px-5">
          <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-[18px] pb-11">
            <p className="m-0 text-[11px] font-bold tracking-[.16em] uppercase text-teal-light">
              Central Merch · Downtown Little Rock
            </p>
            <h1
              id="shop-hero-title"
              className="m-0 font-display text-[clamp(36px,5vw,54px)] leading-[1.05] font-bold tracking-[-.03em] text-white"
            >
              {HEADLINE.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 ? " " : null}
                  <span className="shop-word" style={{ ["--i" as string]: i }}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </h1>
            <p className="m-0 max-w-[34em] text-[17px] leading-[1.6] text-[#d9d3ca]">
              Our skyline design on a tee, a crewneck, or a hoodie. Pick your items, pay with Cash App,
              Pushpay, or cash, then send us your receipt and we&rsquo;ll have your order ready at church, or
              ship it if you&rsquo;re out of state.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#collection"
                className="inline-flex h-[46px] items-center rounded-full bg-primary px-[22px] text-[15px] font-bold text-white no-underline transition-colors hover:bg-primary-deep"
              >
                Shop the collection
              </a>
              <button
                type="button"
                onClick={openDrawer}
                className="inline-flex h-[46px] items-center rounded-full border-[1.5px] border-white/55 px-[22px] text-[15px] font-bold text-white transition-colors hover:bg-white/10"
              >
                View your order
              </button>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[13px] font-medium text-[#d9d3ca]">
              {products.map((p) => (
                <span key={p.id} className="rounded-full border border-[#3a342d] px-3 py-1.5">
                  {p.name} {formatMoney(p.priceCents)}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full min-w-0 flex-[1_1_420px]">
            <HeroArt
              src="/shop/print.webp"
              alt="Central Church shirt design: CENTRAL CHURCH lettering over seven colored stripes showing the Little Rock skyline"
            />
          </div>
        </div>
      </section>
      <div className="shop-stripes h-2" aria-hidden>
        <i /><i /><i /><i /><i /><i /><i />
      </div>

      {/* How ordering works */}
      <section className="bg-surface py-[22px]" aria-label="How ordering works">
        <ol className="mx-auto m-0 flex max-w-[1240px] list-none flex-wrap gap-x-7 gap-y-2.5 px-5 text-[14.5px] font-semibold text-body">
          {[
            "Pick your items",
            "Pay with Cash App, Pushpay, or cash",
            "Send your receipt",
            `Pick up at Central${settings.pickupDetails ? ` · ${settings.pickupDetails}` : ""}, or we ship out of state`,
          ].map((label, i) => (
            <li key={label} className="flex items-center gap-2.5">
              <b className="grid size-7 place-items-center rounded-full border border-line-dark bg-white font-mono text-xs font-medium text-primary">
                {i + 1}
              </b>
              {label}
            </li>
          ))}
        </ol>
      </section>

      {/* Product grid */}
      <section id="collection" className="scroll-mt-[160px] py-12 lg:scroll-mt-[190px] lg:pb-[72px]" aria-labelledby="shop-collection-title">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-bold tracking-[.14em] uppercase text-primary">The Skyline Collection</p>
              <h2 id="shop-collection-title" className="m-0 mt-1.5 font-display text-[32px] tracking-[-.02em]">
                Choose your shirt
              </h2>
            </div>
            <p className="m-0 max-w-[30em] text-muted">
              All three are black with the full-color Central skyline print. Nothing is charged on this site.
            </p>
          </div>
          {closed ? (
            <p className="m-0 mb-6 rounded-2xl border border-line bg-surface px-5 py-4 text-[15px] font-semibold text-body">
              Orders are closed right now. Check back soon.
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} closed={closed} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <OrderDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        products={products}
        settings={settings}
        cart={cart}
        onChangeLine={changeLine}
        onClearCart={clearCart}
        openedAt={openedAt}
      />
    </div>
  );
}
