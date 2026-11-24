import {
  MAX_LINES,
  MAX_LINE_QTY,
  formatMoney,
  type PaymentMethod,
  type ShopProduct,
  type ShopSettings,
} from "./shop";

/**
 * Order validation, numbering, and email formatting for the Central Shop.
 *
 * Pure functions, split out from the route handler so they can be
 * exercised outside a request — Next.js route files may only export HTTP
 * handlers. Server-only: nothing here is imported by a client component.
 */

export const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;

export const RECEIPT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};

export const PAYMENT_METHOD_IDS: PaymentMethod[] = ["cashapp", "pushpay", "cash"];

export const METHOD_TITLES: Record<PaymentMethod, string> = {
  cashapp: "Cash App",
  pushpay: "Pushpay",
  cash: "cash",
};

/** No 0/O or 1/I/L, so a number can be read aloud at church. */
export const ORDER_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateOrderNumber(): string {
  const bytes = new Uint8Array(5);
  globalThis.crypto.getRandomValues(bytes);
  let out = "CC-";
  for (const b of bytes) out += ORDER_ALPHABET[b % ORDER_ALPHABET.length];
  return out;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export interface OrderItem {
  product_id: string;
  name: string;
  size: string;
  qty: number;
  unit_price_cents: number;
  line_total_cents: number;
}

export interface OrderInput {
  name: string;
  contact: string;
  method: string;
  cashRecipient: string;
  reference: string;
  itemsJson: string;
  file: File | null;
}

export interface ValidOrder {
  name: string;
  contact: string;
  method: PaymentMethod;
  cashRecipient: string | null;
  reference: string | null;
  items: OrderItem[];
  totalCents: number;
  file: File | null;
}

export type ValidationResult =
  | { ok: true; order: ValidOrder }
  | { ok: false; error: string };

/**
 * Everything the browser sent is checked against the catalog and settings
 * as they are right now, and every price comes from `products` — a total
 * sent from the browser is never read.
 */
export function validateOrder(
  input: OrderInput,
  products: ShopProduct[],
  settings: ShopSettings,
): ValidationResult {
  const name = input.name.trim();
  if (name.length < 1 || name.length > 100) {
    return { ok: false, error: "Please tell us your name (up to 100 characters)." };
  }
  const contact = input.contact.trim();
  if (contact.length < 3 || contact.length > 200) {
    return { ok: false, error: "Please add a phone number or email so we can reach you." };
  }

  if (!PAYMENT_METHOD_IDS.includes(input.method as PaymentMethod)) {
    return { ok: false, error: "Pick how you paid: Cash App, Pushpay, or cash." };
  }
  const method = input.method as PaymentMethod;

  let cashRecipient: string | null = null;
  if (method === "cash") {
    const who = input.cashRecipient.trim();
    if (!settings.cashRecipients.includes(who)) {
      return { ok: false, error: "Tell us who you handed the cash to." };
    }
    cashRecipient = who;
  }

  let rawItems: unknown;
  try {
    rawItems = JSON.parse(input.itemsJson);
  } catch {
    return { ok: false, error: "Your cart didn't come through. Please try again." };
  }
  if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > MAX_LINES) {
    return { ok: false, error: `Your order needs between 1 and ${MAX_LINES} lines.` };
  }

  const items: OrderItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: "Your cart didn't come through. Please try again." };
    }
    const { productId, size, qty } = raw as { productId?: unknown; size?: unknown; qty?: unknown };
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { ok: false, error: "One of the items in your cart isn't available right now." };
    }
    if (typeof size !== "string" || !product.sizes.includes(size)) {
      return { ok: false, error: `Pick a size for the ${product.name}.` };
    }
    const n = Number(qty);
    if (!Number.isInteger(n) || n < 1 || n > MAX_LINE_QTY) {
      return { ok: false, error: `Quantities must be between 1 and ${MAX_LINE_QTY}.` };
    }
    const existing = items.find((i) => i.product_id === product.id && i.size === size);
    if (existing) {
      existing.qty = Math.min(MAX_LINE_QTY, existing.qty + n);
      existing.line_total_cents = existing.qty * existing.unit_price_cents;
    } else {
      items.push({
        product_id: product.id,
        name: product.name,
        size,
        qty: n,
        unit_price_cents: product.priceCents,
        line_total_cents: product.priceCents * n,
      });
    }
  }
  const totalCents = items.reduce((sum, i) => sum + i.line_total_cents, 0);

  const reference = input.reference.trim().slice(0, 200) || null;
  const file = input.file && input.file.size > 0 ? input.file : null;
  if (!file && !reference) {
    return {
      ok: false,
      error: "Add a screenshot of your receipt or type a confirmation number.",
    };
  }
  if (file) {
    if (file.size > MAX_RECEIPT_BYTES) {
      return { ok: false, error: "That file is over 10 MB. Try a screenshot instead." };
    }
    if (!RECEIPT_TYPES[file.type]) {
      return {
        ok: false,
        error: "Upload a photo or screenshot (JPG, PNG, HEIC) or a PDF.",
      };
    }
  }

  return {
    ok: true,
    order: { name, contact, method, cashRecipient, reference, items, totalCents, file },
  };
}

/** The receipt's path inside the private bucket. */
export function receiptPath(orderNumber: string, mimeType: string): string {
  const ext = RECEIPT_TYPES[mimeType] ?? "bin";
  const rand = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => ORDER_ALPHABET[b % ORDER_ALPHABET.length])
    .join("")
    .toLowerCase();
  return `orders/${orderNumber}/${rand}.${ext}`;
}

/** "Sun, Nov 22, 2026, 11:04 AM CST" */
export function centralTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function methodPhrase(method: PaymentMethod, cashRecipient: string | null): string {
  if (method === "cash") return `cash to ${cashRecipient ?? "a staff member"}`;
  return METHOD_TITLES[method];
}

/**
 * Supabase dashboard link for the project behind NEXT_PUBLIC_SUPABASE_URL
 * (https://<ref>.supabase.co → https://supabase.com/dashboard/project/<ref>).
 */
export function tableEditorUrl(supabaseUrl: string | undefined): string | null {
  if (!supabaseUrl) return null;
  try {
    const host = new URL(supabaseUrl).hostname;
    const ref = host.split(".")[0];
    if (!ref || !host.endsWith(".supabase.co")) return null;
    return `https://supabase.com/dashboard/project/${ref}/editor`;
  } catch {
    return null;
  }
}

export interface OrderEmailInput {
  orderNumber: string;
  createdAt: Date;
  name: string;
  contact: string;
  items: OrderItem[];
  totalCents: number;
  method: PaymentMethod;
  cashRecipient: string | null;
  reference: string | null;
  receiptFilename: string | null;
  receiptUrl: string | null;
  editorUrl: string | null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** The order email to the office: a subject, plain text, and simple HTML. */
export function formatOrderEmail(o: OrderEmailInput) {
  const via = methodPhrase(o.method, o.cashRecipient);
  const subject = `New shirt order ${o.orderNumber} · ${o.name} · ${formatMoney(o.totalCents)} via ${via}`;
  const when = centralTime(o.createdAt);

  const textLines = [
    `Order:    ${o.orderNumber}`,
    `Placed:   ${when}`,
    "",
    `Name:     ${o.name}`,
    `Contact:  ${o.contact}`,
    "",
    "Items:",
    ...o.items.map(
      (i) => `  ${i.qty} × ${i.name} (size ${i.size}) — ${formatMoney(i.line_total_cents)}`,
    ),
    `  Total: ${formatMoney(o.totalCents)}`,
    "",
    `Paid via: ${via}`,
    o.reference ? `Reference: ${o.reference}` : null,
    o.receiptFilename
      ? `Receipt:  attached (${o.receiptFilename})`
      : "Receipt:  none uploaded — reference number only",
    o.receiptUrl ? `Receipt link (valid 7 days): ${o.receiptUrl}` : null,
    "",
    `Update this order's status in Supabase: Table Editor > shop_orders${o.editorUrl ? ` — ${o.editorUrl}` : ""}`,
    "",
    "—",
    "Sent from the shop on arcentralchurch.org",
  ].filter((l) => l !== null);

  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5dfd6">${escapeHtml(i.name)}</td><td style="padding:6px 10px;border-bottom:1px solid #e5dfd6">${escapeHtml(i.size)}</td><td style="padding:6px 10px;border-bottom:1px solid #e5dfd6;text-align:right">${i.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #e5dfd6;text-align:right">${formatMoney(i.line_total_cents)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#14110f;font-size:15px;line-height:1.5;max-width:560px;margin:0 auto;padding:20px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#2f6e89;font-weight:700">Central Shop · new order</p>
<h1 style="margin:0 0 16px;font-size:24px"><span style="font-family:ui-monospace,Menlo,monospace">${escapeHtml(o.orderNumber)}</span></h1>
<p style="margin:0 0 16px;color:#6e6862">${escapeHtml(when)}</p>
<table style="border-collapse:collapse;margin:0 0 16px">
<tr><td style="padding:4px 10px 4px 0;color:#6e6862">Name</td><td style="padding:4px 0"><strong>${escapeHtml(o.name)}</strong></td></tr>
<tr><td style="padding:4px 10px 4px 0;color:#6e6862">Contact</td><td style="padding:4px 0">${escapeHtml(o.contact)}</td></tr>
<tr><td style="padding:4px 10px 4px 0;color:#6e6862">Paid via</td><td style="padding:4px 0">${escapeHtml(via)}</td></tr>
${o.reference ? `<tr><td style="padding:4px 10px 4px 0;color:#6e6862">Reference</td><td style="padding:4px 0">${escapeHtml(o.reference)}</td></tr>` : ""}
</table>
<table style="border-collapse:collapse;width:100%;margin:0 0 16px;background:#f7f4ef;border-radius:10px">
<thead><tr><th style="text-align:left;padding:8px 10px;font-size:12px;color:#6e6862">Item</th><th style="text-align:left;padding:8px 10px;font-size:12px;color:#6e6862">Size</th><th style="text-align:right;padding:8px 10px;font-size:12px;color:#6e6862">Qty</th><th style="text-align:right;padding:8px 10px;font-size:12px;color:#6e6862">Line</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr><td colspan="3" style="padding:10px;text-align:right;font-weight:700">Total</td><td style="padding:10px;text-align:right;font-weight:700;font-size:18px">${formatMoney(o.totalCents)}</td></tr></tfoot>
</table>
<p style="margin:0 0 8px">${
    o.receiptFilename
      ? `<strong>Receipt attached</strong> (${escapeHtml(o.receiptFilename)}).`
      : "<strong>No receipt uploaded</strong> — reference number only."
  }${o.receiptUrl ? ` <a href="${escapeHtml(o.receiptUrl)}">Open the receipt</a> (link works for 7 days).` : ""}</p>
<p style="margin:0 0 24px;color:#6e6862">Update this order's status in Supabase: Table Editor &gt; shop_orders${
    o.editorUrl ? ` — <a href="${escapeHtml(o.editorUrl)}">open the project</a>` : ""
  }.</p>
<p style="margin:0;font-size:12px;color:#6e6862">Sent from the shop on arcentralchurch.org</p>
</body></html>`;

  return { subject, text: textLines.join("\n"), html };
}

/** Optional short confirmation to the buyer (SEND_CUSTOMER_CONFIRMATION). */
export function formatCustomerEmail(o: {
  orderNumber: string;
  name: string;
  itemCount: number;
  totalCents: number;
  method: PaymentMethod;
  cashRecipient: string | null;
  pickupDetails: string;
}) {
  const first = o.name.trim().split(/\s+/)[0] || "there";
  const subject = `We got your order ${o.orderNumber}`;
  const text = [
    `Hi ${first},`,
    "",
    `We got your Central shirt order ${o.orderNumber} — ${o.itemCount} item${o.itemCount === 1 ? "" : "s"}, ${formatMoney(o.totalCents)} via ${methodPhrase(o.method, o.cashRecipient)}.`,
    "",
    "We'll check your receipt and reach out when it's ready to pick up.",
    o.pickupDetails ? `Pickup: ${o.pickupDetails}` : null,
    "",
    "— Central Church of Christ",
  ]
    .filter((l) => l !== null)
    .join("\n");
  return { subject, text };
}
