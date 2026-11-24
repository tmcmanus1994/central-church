/**
 * Central Shop — shared types and helpers, safe to import from client
 * components. Everything that talks to Supabase lives in shop-data.ts
 * (server) and the order route; nothing here holds a site fact.
 *
 * Products, prices, sizes, payment handles, cash recipients, and pickup
 * details all come from Supabase (`shop_products`, `shop_settings`) so
 * Travelle can change them in the Table Editor without a deploy.
 */

export interface ShopProduct {
  id: string;
  name: string;
  priceCents: number;
  sizes: string[];
  imagePath: string;
  imageAlt: string;
  sortOrder: number;
}

export interface ShopSettings {
  isOpen: boolean;
  cashappCashtag: string;
  pushpayUrl: string;
  pushpayFund: string;
  cashRecipients: string[];
  pickupDetails: string;
}

export type PaymentMethod = "cashapp" | "pushpay" | "cash";

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  title: string;
  /** Short line under the title in the picker; the detail comes from settings. */
  sub: (s: ShopSettings) => string;
}[] = [
  { id: "cashapp", title: "Cash App", sub: () => "Send to the church Cashtag" },
  { id: "pushpay", title: "Pushpay", sub: () => "Give through the Central Pushpay page" },
  {
    id: "cash",
    title: "Cash",
    sub: (s) => `Pay ${joinNames(s.cashRecipients)} in person`,
  },
];

/** One line in the buyer's cart. Prices are never stored here — the server
 *  recomputes every total from `shop_products`. */
export interface CartLine {
  productId: string;
  size: string;
  qty: number;
}

export const MAX_LINE_QTY = 20;
export const MAX_LINES = 10;

/** "$15" for whole dollars, "$15.50" otherwise. */
export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars)
    ? `$${dollars}`
    : `$${dollars.toFixed(2)}`;
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} or ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, or ${names[names.length - 1]}`;
}

export function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first || "friend";
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartTotalCents(cart: CartLine[], products: ShopProduct[]): number {
  return cart.reduce((sum, l) => {
    const p = products.find((x) => x.id === l.productId);
    return p ? sum + p.priceCents * l.qty : sum;
  }, 0);
}

/** Drops cart lines that no longer match an active product or size, and
 *  clamps quantities — used after reading the cart back from localStorage. */
export function sanitizeCart(raw: unknown, products: ShopProduct[]): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { productId, size, qty } = item as Partial<CartLine>;
    const product = products.find((p) => p.id === productId);
    if (!product || typeof size !== "string" || !product.sizes.includes(size)) continue;
    const n = Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(Number(qty) || 0)));
    if (n < 1) continue;
    const existing = out.find((l) => l.productId === productId && l.size === size);
    if (existing) existing.qty = Math.min(MAX_LINE_QTY, existing.qty + n);
    else out.push({ productId: product.id, size, qty: n });
    if (out.length >= MAX_LINES) break;
  }
  return out;
}

/** Row shapes as Supabase returns them. */
export interface ShopProductRow {
  id: string;
  name: string;
  price_cents: number;
  sizes: string[] | null;
  image_path: string;
  image_alt: string;
  sort_order: number | null;
  is_active: boolean;
}

export interface ShopSettingsRow {
  is_open: boolean;
  cashapp_cashtag: string;
  pushpay_url: string;
  pushpay_fund: string;
  cash_recipients: string[] | null;
  pickup_details: string;
}

export function productFromRow(row: ShopProductRow): ShopProduct {
  return {
    id: row.id,
    name: row.name,
    priceCents: row.price_cents,
    sizes: (row.sizes ?? []).filter((s) => typeof s === "string" && s.trim() !== ""),
    imagePath: row.image_path,
    imageAlt: row.image_alt,
    sortOrder: row.sort_order ?? 0,
  };
}

export function settingsFromRow(row: ShopSettingsRow): ShopSettings {
  return {
    isOpen: Boolean(row.is_open),
    cashappCashtag: row.cashapp_cashtag,
    pushpayUrl: row.pushpay_url,
    pushpayFund: row.pushpay_fund,
    cashRecipients: (row.cash_recipients ?? []).filter(
      (s) => typeof s === "string" && s.trim() !== "",
    ),
    pickupDetails: row.pickup_details,
  };
}
