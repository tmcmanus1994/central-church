"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PAYMENT_METHODS,
  cartCount,
  cartTotalCents,
  firstName,
  formatMoney,
  type CartLine,
  type PaymentMethod,
  type ShopProduct,
  type ShopSettings,
} from "@/lib/shop";
import { animate, useReducedMotion } from "./motion";

type Step = "cart" | "details" | "pay" | "receipt" | "done";
const STEPS: Step[] = ["cart", "details", "pay", "receipt", "done"];
const PROGRESS = ["Cart", "Details", "Pay", "Receipt"];

const MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Vercel caps a request body around 4.5 MB, so anything bigger after
 *  compression can't be sent — the buyer is asked for a screenshot. */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const COMPRESS_ABOVE_BYTES = 1_200_000;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const ACCEPT_TYPES = [...IMAGE_TYPES, "application/pdf"];

const inputCls =
  "h-12 w-full rounded-xl border-[1.5px] border-line-dark bg-white px-3.5 text-[15px] font-medium text-ink placeholder:font-normal placeholder:text-muted";
const pillBase =
  "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-[22px] text-[15px] font-bold transition-[background-color,opacity,transform] active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";
const pillPrimary = `${pillBase} bg-primary text-white hover:bg-primary-deep`;
const pillAccent = `${pillBase} bg-accent text-white hover:bg-accent-deep`;
const pillGhost = `${pillBase} border-[1.5px] border-line-dark bg-white text-ink hover:bg-surface`;
const pillOutline = `${pillBase} border-[1.5px] border-primary bg-white text-primary hover:bg-teal-50`;

export interface OrderResult {
  orderNumber: string;
  totalCents: number;
  itemCount: number;
  name: string;
  contact: string;
  method: PaymentMethod;
  cashTo: string | null;
}

/**
 * Shrinks a big photo before upload: phone camera shots run 3–8 MB, and a
 * receipt is perfectly legible at 1800px. Leaves PDFs, HEIC (which most
 * browsers can't decode), and already-small images alone. Any failure
 * returns the original file untouched.
 */
async function prepareReceipt(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return file;
  if (file.size <= COMPRESS_ABOVE_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function PayGlyph({ on, dim, children }: { on: boolean; dim: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`grid size-16 place-items-center rounded-[18px] border-[1.5px] transition-[transform,background-color,color,opacity,border-color] duration-[450ms] ${
        on
          ? "-translate-y-2 scale-[1.18] border-primary bg-primary text-white"
          : `border-line bg-white text-muted ${dim ? "opacity-45" : ""}`
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(.3,1.5,.5,1)" }}
    >
      {children}
    </span>
  );
}

export function OrderDrawer({
  open,
  onClose,
  products,
  settings,
  cart,
  onChangeLine,
  onClearCart,
  openedAt,
}: {
  open: boolean;
  onClose: () => void;
  products: ShopProduct[];
  settings: ShopSettings;
  cart: CartLine[];
  /** Adds `delta` to a line's quantity; a line at 0 is removed. */
  onChangeLine: (index: number, delta: number) => void;
  onClearCart: () => void;
  /** When the drawer was first opened (ms); sent as `startedAt`. */
  openedAt: number | null;
}) {
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [cashTo, setCashTo] = useState<string>(settings.cashRecipients[0] ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const lastIndex = useRef(0);
  const reduced = useReducedMotion();

  const count = cartCount(cart);
  const total = cartTotalCents(cart, products);
  const closed = !settings.isOpen;
  const byId = (id: string) => products.find((p) => p.id === id);

  // Focus moves into the drawer when it opens and back to whatever opened
  // it when it closes. Escape closes. Page scroll is locked underneath.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus();
    };
  }, [open, onClose]);

  // Steps slide in from the side they're coming from.
  useEffect(() => {
    const idx = STEPS.indexOf(step);
    const dir = idx >= lastIndex.current ? 1 : -1;
    lastIndex.current = idx;
    animate(
      panelRef.current,
      [{ opacity: 0, transform: `translateX(${24 * dir}px)` }, { opacity: 1, transform: "none" }],
      { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" },
      reduced,
    );
  }, [step, reduced]);

  // An emptied cart can't sit on a later step; a new item after an order
  // starts a fresh cart view.
  useEffect(() => {
    if (cart.length === 0 && step !== "cart" && step !== "done") setStep("cart");
    if (cart.length > 0 && step === "done") {
      setResult(null);
      setStep("cart");
    }
  }, [cart.length, step]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const takeFile = useCallback(async (f: File | null | undefined) => {
    setFileError(null);
    if (!f) return;
    if (!ACCEPT_TYPES.includes(f.type)) {
      setFileError("Upload a photo or screenshot (JPG, PNG, HEIC) or a PDF.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setFileError("That file is over 10 MB. Try a screenshot instead.");
      return;
    }
    const prepared = await prepareReceipt(f);
    if (prepared.size > MAX_UPLOAD_BYTES) {
      setFileError("That file is too large to send. Try a screenshot instead.");
      return;
    }
    setFile(prepared);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return ["image/jpeg", "image/png", "image/webp"].includes(prepared.type)
        ? URL.createObjectURL(prepared)
        : null;
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || (!file && !reference.trim()) || !method) return;
    setSubmitting(true);
    setSubmitError(null);
    const form = new FormData();
    form.set("name", name.trim());
    form.set("contact", contact.trim());
    form.set("method", method);
    if (method === "cash") form.set("cashRecipient", cashTo);
    form.set("reference", reference.trim());
    form.set("items", JSON.stringify(cart));
    if (file) form.set("receipt", file, file.name);
    form.set("website", "");
    form.set("startedAt", String(openedAt ?? Date.now()));
    try {
      const res = await fetch("/api/shop/orders", { method: "POST", body: form });
      const data: { ok?: boolean; error?: string; orderNumber?: string; totalCents?: number; itemCount?: number } | null =
        await res.json().catch(() => null);
      if (res.ok && data?.ok && data.orderNumber) {
        setResult({
          orderNumber: data.orderNumber,
          totalCents: data.totalCents ?? total,
          itemCount: data.itemCount ?? count,
          name,
          contact,
          method,
          cashTo: method === "cash" ? cashTo : null,
        });
        setStep("done");
        setFile(null);
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return null;
        });
        setReference("");
        setMethod("");
        onClearCart();
      } else {
        setSubmitError(
          data?.error ?? "We couldn't send your order. Check your connection and try again. Your cart is saved.",
        );
      }
    } catch {
      setSubmitError("We couldn't send your order. Check your connection and try again. Your cart is saved.");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setResult(null);
    setStep("cart");
  }

  const stepIndex = STEPS.indexOf(step);
  const tot = formatMoney(total);
  const first = firstName(name);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[45] bg-[rgba(20,17,15,.45)] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[46] flex w-full flex-col border-l border-line bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-transform duration-[450ms] sm:w-[440px] ${
          open ? "translate-x-0" : "translate-x-[104%]"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.2,.9,.2,1)" }}
      >
        <div className="flex flex-col gap-3.5 bg-teal-50 px-5 pt-[18px] pb-3.5">
          <div className="flex items-center justify-between">
            <h2 className="m-0 font-display text-[21px]">Your order</h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close your order"
              className="grid size-11 place-items-center rounded-full border-[1.5px] border-line-dark bg-white text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <ol className="m-0 grid list-none grid-cols-4 gap-1.5 p-0" aria-label="Order progress">
            {PROGRESS.map((label, i) => {
              const on = i <= stepIndex;
              const now = i === stepIndex;
              return (
                <li
                  key={label}
                  aria-current={now ? "step" : undefined}
                  className={`flex flex-col gap-1.5 text-xs font-bold ${now ? "text-ink" : "text-muted"}`}
                >
                  <i className="block h-1 overflow-hidden rounded-full bg-line-dark">
                    <i
                      className={`block h-full w-full origin-left bg-primary transition-transform duration-[450ms] ${on ? "scale-x-100" : "scale-x-0"}`}
                      style={{ transitionTimingFunction: "cubic-bezier(.3,.9,.3,1)" }}
                    />
                  </i>
                  {label}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative flex-1 overflow-y-auto p-5">
          <div ref={panelRef} className="flex flex-col gap-4">
            {step === "cart" ? (
              cart.length === 0 ? (
                <div className="flex flex-col items-start gap-3 text-muted">
                  <p className="m-0">Nothing here yet. Pick a size and tap Add to order.</p>
                  <button type="button" onClick={onClose} className={pillGhost}>
                    Keep shopping
                  </button>
                </div>
              ) : (
                <>
                  <ul className="m-0 flex list-none flex-col p-0">
                    {cart.map((line, i) => {
                      const p = byId(line.productId);
                      if (!p) return null;
                      return (
                        <li key={`${line.productId}-${line.size}`} className="flex items-center gap-3 border-b border-line py-3">
                          <span className="relative size-14 shrink-0 overflow-hidden rounded-[10px] bg-surface p-1">
                            <Image src={p.imagePath} alt="" fill sizes="56px" className="object-contain p-1" />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <b>{p.name}</b>
                            <small className="text-[13px] text-muted">
                              Size {line.size} · {formatMoney(p.priceCents)} each
                            </small>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => onChangeLine(i, -1)}
                              aria-label={`Remove one ${p.name}, size ${line.size}`}
                              className="size-9 rounded-full border border-line bg-white text-ink"
                            >
                              −
                            </button>
                            <span className="min-w-[22px] text-center font-bold tabular-nums">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => onChangeLine(i, 1)}
                              aria-label={`Add one ${p.name}, size ${line.size}`}
                              className="size-9 rounded-full border border-line bg-white text-ink"
                            >
                              +
                            </button>
                          </span>
                          <span className="min-w-11 text-right font-bold tabular-nums">
                            {formatMoney(p.priceCents * line.qty)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex items-baseline justify-between">
                    <span>Total</span>
                    <b className="font-display text-[26px] tabular-nums">{tot}</b>
                  </div>
                  {closed ? (
                    <p className="m-0 rounded-xl bg-surface px-4 py-3 text-center text-[14.5px] font-semibold text-body">
                      Orders are closed right now. Check back soon.
                    </p>
                  ) : (
                    <button type="button" onClick={() => setStep("details")} className={pillPrimary}>
                      Check out
                    </button>
                  )}
                </>
              )
            ) : null}

            {step === "details" ? (
              <form
                className="flex flex-col gap-4"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name.trim() && contact.trim()) setStep("pay");
                }}
              >
                <p className="m-0">Who is this order for?</p>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor="shop-name">
                  Name
                  <input
                    id="shop-name"
                    type="text"
                    autoComplete="name"
                    placeholder="First and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus={!name}
                    maxLength={100}
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor="shop-contact">
                  Phone or email
                  <input
                    id="shop-contact"
                    type="text"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="So we can tell you it’s ready"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    maxLength={200}
                    className={inputCls}
                  />
                </label>
                <div className="flex gap-2.5">
                  <button type="button" onClick={() => setStep("cart")} className={pillGhost}>
                    Back
                  </button>
                  <button type="submit" disabled={!name.trim() || !contact.trim()} className={`${pillPrimary} flex-1`}>
                    Continue to payment
                  </button>
                </div>
              </form>
            ) : null}

            {step === "pay" ? (
              <>
                <div
                  className="flex h-[130px] items-center justify-center gap-3.5 rounded-[14px] bg-surface"
                  aria-hidden
                  data-shop-slot="pay"
                >
                  <PayGlyph on={method === "cashapp"} dim={!!method}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M15.5 7.5c-.8-1-2-1.5-3.5-1.5-2 0-3.5 1-3.5 2.7 0 3.8 7.5 2 7.5 6 0 1.8-1.6 2.8-3.8 2.8-1.6 0-3-.6-3.9-1.7M12 3.5v2.5M12 18v2.5" />
                    </svg>
                  </PayGlyph>
                  <PayGlyph on={method === "pushpay"} dim={!!method}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
                      <path d="M12 15.5s-3-1.8-3-3.8a1.7 1.7 0 0 1 3-1.1 1.7 1.7 0 0 1 3 1.1c0 2-3 3.8-3 3.8Z" />
                    </svg>
                  </PayGlyph>
                  <PayGlyph on={method === "cash"} dim={!!method}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="6" width="19" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2.6" />
                      <path d="M6 9.5v5M18 9.5v5" />
                    </svg>
                  </PayGlyph>
                </div>
                <div className="flex items-baseline justify-between">
                  <span>Amount to send</span>
                  <b className="font-display text-[26px] tabular-nums">{tot}</b>
                </div>
                <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-2">
                  {PAYMENT_METHODS.map((m) => {
                    const checked = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => setMethod(m.id)}
                        className={`flex items-center gap-3 rounded-[14px] border-[1.5px] p-3.5 text-left transition-[border-color,background-color,transform] duration-200 hover:-translate-y-px ${
                          checked ? "border-primary bg-teal-50" : "border-line bg-white"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-primary" : "border-line-dark"}`}
                        >
                          <span
                            className={`size-2.5 rounded-full bg-primary transition-transform duration-300 ${checked ? "scale-100" : "scale-0"}`}
                            style={{ transitionTimingFunction: "cubic-bezier(.3,1.6,.5,1)" }}
                          />
                        </span>
                        <span>
                          <b className="block">{m.title}</b>
                          <small className="text-[13px] text-muted">{m.sub(settings)}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {method === "cashapp" ? (
                  <div className="flex flex-col gap-2.5 rounded-[14px] bg-surface p-4 text-[14.5px] text-body">
                    <strong className="text-ink">
                      Send {tot} in Cash App to {settings.cashappCashtag}
                    </strong>
                    <span>
                      In the note, write &ldquo;Shirts – {first}&rdquo;. Then screenshot the payment screen.
                    </span>
                  </div>
                ) : null}
                {method === "pushpay" ? (
                  <div className="flex flex-col gap-2.5 rounded-[14px] bg-surface p-4 text-[14.5px] text-body">
                    <strong className="text-ink">Give {tot} through Pushpay</strong>
                    <span>
                      Choose the {settings.pushpayFund} fund and add the memo &ldquo;Shirts – {first}&rdquo;.
                      Screenshot your receipt email or confirmation screen.
                    </span>
                    <a
                      href={settings.pushpayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary no-underline hover:text-primary-deep"
                    >
                      Open Pushpay →
                    </a>
                  </div>
                ) : null}
                {method === "cash" ? (
                  <div className="flex flex-col gap-2.5 rounded-[14px] bg-surface p-4 text-[14.5px] text-body">
                    <strong className="text-ink">Hand {tot} in cash to:</strong>
                    <div role="radiogroup" aria-label="Who you are paying" className="flex flex-wrap gap-2">
                      {settings.cashRecipients.map((who) => {
                        const checked = cashTo === who;
                        return (
                          <button
                            key={who}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            onClick={() => setCashTo(who)}
                            className={`min-h-11 rounded-full border-[1.5px] px-4 font-bold ${
                              checked ? "border-ink bg-ink text-white" : "border-line-dark bg-white text-ink"
                            }`}
                          >
                            {who}
                          </button>
                        );
                      })}
                    </div>
                    <span>
                      Ask {cashTo || "them"} for a receipt, or snap a photo of it, so you can upload it next.
                    </span>
                  </div>
                ) : null}

                <p className="m-0 text-[13px] text-muted">
                  No payment happens on this website. You pay through the app or in person, then show us the receipt.
                </p>
                <div className="flex gap-2.5">
                  <button type="button" onClick={() => setStep("details")} className={pillGhost}>
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!method || (method === "cash" && !cashTo)}
                    onClick={() => setStep("receipt")}
                    className={`${pillPrimary} flex-1`}
                  >
                    I&rsquo;ve paid, add my receipt
                  </button>
                </div>
              </>
            ) : null}

            {step === "receipt" ? (
              <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
                <p className="m-0">
                  Show us your {method === "cash" ? `cash (${cashTo})` : PAYMENT_METHODS.find((m) => m.id === method)?.title} receipt so we can fill your order.
                </p>
                <label
                  htmlFor="shop-receipt"
                  data-shop-slot="upload"
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    takeFile(e.dataTransfer.files[0]);
                  }}
                  className={`relative flex min-h-[170px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[14px] border-2 border-dashed bg-teal-50 p-[18px] text-center font-bold text-teal-ink transition-[transform,border-color] duration-200 ${
                    dragOver ? "scale-[1.015] border-primary" : "border-teal-light"
                  }`}
                >
                  <input
                    id="shop-receipt"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => takeFile(e.target.files?.[0])}
                    className="absolute size-px opacity-0"
                  />
                  {file ? (
                    <span className="flex flex-col items-center gap-2">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Your receipt preview"
                          className="max-h-[190px] rounded-[10px] shadow-[0_18px_40px_-18px_rgba(20,17,15,.35)]"
                        />
                      ) : (
                        <span className="grid size-14 place-items-center rounded-xl bg-white text-primary">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                            <path d="M14 3v5h5" />
                          </svg>
                        </span>
                      )}
                      <span className="text-[13px] font-medium text-muted">{file.name} · tap to replace</span>
                    </span>
                  ) : (
                    <>
                      <svg className="shop-nudge" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M12 16V4" />
                        <path d="m7 9 5-5 5 5" />
                        <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                      </svg>
                      Upload a screenshot or photo
                      <small className="font-medium text-muted">Drag it here or tap to choose</small>
                    </>
                  )}
                </label>
                {fileError ? (
                  <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700" role="alert">
                    {fileError}
                  </p>
                ) : null}
                <div className="flex items-center gap-2.5 text-xs font-bold text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
                  OR
                </div>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor="shop-reference">
                  Confirmation or reference number
                  <input
                    id="shop-reference"
                    type="text"
                    placeholder="e.g. #D-48213 or “paid Jessica Sunday”"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    maxLength={200}
                    className={inputCls}
                  />
                </label>
                {submitError ? (
                  <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                <div className="flex gap-2.5">
                  <button type="button" onClick={() => setStep("pay")} disabled={submitting} className={pillGhost}>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!file && !reference.trim())}
                    className={`${pillAccent} flex-1`}
                  >
                    {submitting ? "Uploading…" : "Send my order"}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "done" && result ? (
              <>
                <Confirmation reduced={reduced} />
                <h3 className="m-0 font-display text-[22px]">Thanks, {firstName(result.name)}! Order received.</h3>
                <p className="m-0 text-body">
                  Order <span className="font-mono font-medium text-ink">{result.orderNumber}</span> ·{" "}
                  {result.itemCount} item{result.itemCount === 1 ? "" : "s"} · {formatMoney(result.totalCents)} via{" "}
                  {result.method === "cash"
                    ? `cash (${result.cashTo})`
                    : PAYMENT_METHODS.find((m) => m.id === result.method)?.title}
                  . We&rsquo;ll check your receipt and reach out at {result.contact} when it&rsquo;s ready to pick up.
                </p>
                {settings.pickupDetails ? (
                  <p className="m-0 text-[14.5px] text-muted">Pickup: {settings.pickupDetails}</p>
                ) : null}
                <button type="button" onClick={startOver} className={`${pillOutline} self-start`}>
                  Start a new order
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

/** Check mark that draws itself on, over a one-time confetti burst in the
 *  seven stripe colors. */
function Confirmation({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || reduced) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth;
    const H = cv.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    const cs = getComputedStyle(cv);
    const colors = ["--s1", "--s2", "--s3", "--s4", "--s5", "--s6", "--s7"].map((v) => cs.getPropertyValue(v).trim());
    const ps = Array.from({ length: 90 }, (_, i) => ({
      x: W / 2,
      y: H / 2,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 7 - 2,
      w: 5 + Math.random() * 5,
      h: 8 + Math.random() * 8,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[i % 7],
    }));
    const t0 = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const el = t - t0;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - el / 1800);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (el < 1800) frame = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <div className="relative grid h-[180px] place-items-center overflow-hidden rounded-[14px] bg-accent-tint" data-shop-slot="success">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />
      <span className="shop-check relative z-[1] grid size-[78px] place-items-center rounded-full bg-accent" aria-hidden>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
    </div>
  );
}
