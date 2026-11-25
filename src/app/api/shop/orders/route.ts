import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { loadShopDataAdmin } from "@/lib/shop-data";
import {
  formatCustomerEmail,
  formatOrderEmail,
  generateOrderNumber,
  isEmail,
  receiptPath,
  tableEditorUrl,
  validateOrder,
} from "@/lib/shop-order";

/**
 * Central Shop orders. Accepts multipart/form-data from the order drawer:
 *
 *   name, contact, method, cashRecipient?, reference?, items (JSON string of
 *   [{productId, size, qty}]), receipt? (file), website (honeypot — must be
 *   empty), startedAt (ms timestamp from when the drawer opened)
 *
 * The site never takes money. This route records what the buyer says they
 * paid, keeps their receipt in the private `shop-receipts` bucket, and
 * emails the office. Every price is read from `shop_products` here; a
 * total from the browser is never trusted.
 *
 * Email goes through Resend's REST API, same as the site's other forms:
 *
 *   RESEND_API_KEY        — from resend.com
 *   ORDER_FROM_EMAIL      — the sender, e.g. "Central Shop <shop@arcentralchurch.org>"
 *                           (falls back to FORMS_FROM_EMAIL)
 *   ORDER_NOTIFY_EMAILS   — comma-separated recipients
 *   SEND_CUSTOMER_CONFIRMATION=true — optional short email to the buyer
 *                           when their contact is an email address
 *
 * If the email fails the order still counts: it's saved, the error is
 * logged, `notification_sent_at` stays null, and the buyer still sees
 * their confirmation. The row in Supabase is the record of truth.
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only;
 * bypasses RLS, which is why `shop_orders` and the bucket have no public
 * policies at all).
 */

const BUCKET = "shop-receipts";
const MIN_SECONDS_ON_FORM = 3;
const SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;
const ORDER_NUMBER_ATTEMPTS = 5;

/**
 * Best-effort per-IP throttle: 5 orders per 10 minutes. In-memory, so each
 * serverless instance keeps its own count — enough to blunt a runaway
 * script without adding a paid service, not a hard guarantee.
 */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const recent = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (hits.length >= RATE_LIMIT.max) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 2000) {
    for (const [key, times] of recent) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) recent.delete(key);
    }
  }
  return false;
}

const GENERIC_FAIL = "We couldn't send your order. Check your connection and try again. Your cart is saved.";

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    console.error("Shop order refused: Supabase env vars unset.");
    return fail("The shop isn't connected yet. Please find Travelle or Jessica on Sunday to order.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("That didn't come through as a form. Please try again.", 400);
  }
  const str = (f: string) => {
    const v = form.get(f);
    return typeof v === "string" ? v : "";
  };

  // Spam checks: a filled honeypot or a sub-3-second submit is a bot. Both
  // get a bland 400 rather than a hint about why.
  if (str("website").trim() !== "") return fail(GENERIC_FAIL, 400);
  const startedAt = Number(str("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_SECONDS_ON_FORM * 1000) {
    return fail(GENERIC_FAIL, 400);
  }
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return fail("That's a lot of orders at once. Please wait a few minutes and try again.", 429);
  }

  const { configured, products, settings } = await loadShopDataAdmin();
  if (!configured || !settings) {
    return fail("The shop isn't set up yet. Please find Travelle or Jessica on Sunday to order.", 503);
  }
  if (!settings.isOpen) {
    return fail("Orders are closed right now. Check back soon.", 409);
  }

  const receipt = form.get("receipt");
  const validated = validateOrder(
    {
      name: str("name"),
      contact: str("contact"),
      method: str("method"),
      cashRecipient: str("cashRecipient"),
      reference: str("reference"),
      itemsJson: str("items"),
      file: receipt instanceof File ? receipt : null,
      delivery: str("delivery") || "pickup",
      shipStreet: str("shipStreet"),
      shipUnit: str("shipUnit"),
      shipCity: str("shipCity"),
      shipState: str("shipState"),
      shipZip: str("shipZip"),
    },
    products,
    settings,
  );
  if (!validated.ok) return fail(validated.error, 400);
  const order = validated.order;

  // Receipt bytes are read once and reused for the upload and the email
  // attachment, so the file is never downloaded back out of the bucket.
  const receiptBytes = order.file ? Buffer.from(await order.file.arrayBuffer()) : null;
  const receiptFilename = order.file
    ? `${order.file.name || "receipt"}`.replace(/[^\w.\-]+/g, "_").slice(0, 80)
    : null;

  // Create the row. Order numbers are random 5-character codes; on the rare
  // unique collision a fresh number is tried, and any receipt uploaded under
  // the colliding number is removed first.
  let orderNumber = "";
  let storedReceiptPath: string | null = null;
  let orderId: string | null = null;
  let createdAt = new Date();

  for (let attempt = 0; attempt < ORDER_NUMBER_ATTEMPTS && !orderId; attempt++) {
    orderNumber = generateOrderNumber();
    storedReceiptPath = null;

    if (order.file && receiptBytes) {
      const path = receiptPath(orderNumber, order.file.type);
      const { error } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, receiptBytes, { contentType: order.file.type, upsert: false });
      if (error) {
        console.error("shop receipt upload failed:", error.message);
        return fail(GENERIC_FAIL, 502);
      }
      storedReceiptPath = path;
    }

    const { data, error } = await supabaseAdmin
      .from("shop_orders")
      .insert({
        order_number: orderNumber,
        customer_name: order.name,
        customer_contact: order.contact,
        items: order.items,
        total_cents: order.totalCents,
        delivery_method: order.delivery,
        shipping_address: order.shippingAddress,
        shipping_cents: order.shippingCents,
        payment_method: order.method,
        cash_recipient: order.cashRecipient,
        payment_reference: order.reference,
        receipt_path: storedReceiptPath,
      })
      .select("id, created_at")
      .single();

    if (!error && data) {
      orderId = data.id as string;
      createdAt = new Date(data.created_at as string);
      break;
    }

    if (storedReceiptPath) {
      await supabaseAdmin.storage.from(BUCKET).remove([storedReceiptPath]);
    }
    if (error?.code === "23505") continue; // order_number collision — try again
    console.error("shop_orders insert failed:", error?.message ?? "no row returned");
    return fail(GENERIC_FAIL, 502);
  }
  if (!orderId) {
    console.error("shop_orders insert failed: no free order number after retries");
    return fail(GENERIC_FAIL, 502);
  }

  const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
  const result = { ok: true, orderNumber, totalCents: order.totalCents, itemCount };

  // Notification. Failure here never fails the order.
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL || process.env.FORMS_FROM_EMAIL;
  const to = (process.env.ORDER_NOTIFY_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!apiKey || !from || to.length === 0) {
    console.warn(
      `Shop order ${orderNumber} saved but not emailed — RESEND_API_KEY / ORDER_FROM_EMAIL / ORDER_NOTIFY_EMAILS unset.`,
    );
    return NextResponse.json(result);
  }

  let receiptUrl: string | null = null;
  if (storedReceiptPath) {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(storedReceiptPath, SIGNED_URL_SECONDS);
    if (error) console.error("shop receipt signed URL failed:", error.message);
    receiptUrl = data?.signedUrl ?? null;
  }

  const email = formatOrderEmail({
    orderNumber,
    createdAt,
    name: order.name,
    contact: order.contact,
    items: order.items,
    totalCents: order.totalCents,
    delivery: order.delivery,
    shippingAddress: order.shippingAddress,
    shippingCents: order.shippingCents,
    method: order.method,
    cashRecipient: order.cashRecipient,
    reference: order.reference,
    receiptFilename,
    receiptUrl,
    editorUrl: tableEditorUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
  });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        // Replies go to the buyer when they gave an email; Resend rejects a
        // phone number here, so it's left off otherwise.
        reply_to: isEmail(order.contact) ? order.contact : undefined,
        subject: email.subject,
        text: email.text,
        html: email.html,
        attachments:
          receiptBytes && receiptFilename
            ? [{ filename: receiptFilename, content: receiptBytes.toString("base64") }]
            : undefined,
      }),
    });
    if (!res.ok) {
      console.error(`Resend responded ${res.status} for shop order ${orderNumber}: ${await res.text()}`);
    } else {
      const { error } = await supabaseAdmin
        .from("shop_orders")
        .update({ notification_sent_at: new Date().toISOString() })
        .eq("id", orderId);
      if (error) console.error("notification_sent_at update failed:", error.message);
    }
  } catch (err) {
    console.error(`Shop order ${orderNumber} email failed:`, err);
  }

  if (process.env.SEND_CUSTOMER_CONFIRMATION === "true" && isEmail(order.contact)) {
    const confirmation = formatCustomerEmail({
      orderNumber,
      name: order.name,
      itemCount,
      totalCents: order.totalCents,
      method: order.method,
      cashRecipient: order.cashRecipient,
      pickupDetails: settings.pickupDetails,
      delivery: order.delivery,
      shippingAddress: order.shippingAddress,
    });
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [order.contact.trim()],
          reply_to: to[0],
          subject: confirmation.subject,
          text: confirmation.text,
        }),
      });
      if (!res.ok) {
        console.error(`Resend responded ${res.status} for customer confirmation ${orderNumber}`);
      }
    } catch (err) {
      console.error(`Customer confirmation ${orderNumber} failed:`, err);
    }
  }

  return NextResponse.json(result);
}
