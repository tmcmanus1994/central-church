import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin, supabasePublic } from "./supabase";
import {
  productFromRow,
  settingsFromRow,
  type ShopProduct,
  type ShopProductRow,
  type ShopSettings,
  type ShopSettingsRow,
} from "./shop";

/**
 * Reads the shop catalog and settings. Server-only — the page uses the
 * public client (RLS lets anyone read active products and the settings
 * row), the order route uses the service-role client so it can also see
 * products someone just deactivated and refuse them.
 *
 * `configured` is false when Supabase env vars aren't set, in which case
 * /shop renders a "not connected yet" notice instead of a catalog — the
 * same never-break-a-deploy pattern as the calendar feeds and the forms.
 *
 * SHOP_DEV_FIXTURE=1 (local `npm run dev` only, never set on Vercel) serves
 * the migration's seed rows so the page can be worked on without a
 * database. The fixture mirrors supabase/migrations/*_shop.sql and is the
 * one place a product appears in code.
 */
export interface ShopData {
  configured: boolean;
  products: ShopProduct[];
  settings: ShopSettings | null;
}

async function load(client: SupabaseClient): Promise<ShopData> {
  const [productsRes, settingsRes] = await Promise.all([
    client
      .from("shop_products")
      .select("id, name, price_cents, sizes, image_path, image_alt, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    client
      .from("shop_settings")
      .select("is_open, cashapp_cashtag, pushpay_url, pushpay_fund, cash_recipients, pickup_details")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  if (productsRes.error) {
    console.error("shop_products read failed:", productsRes.error.message);
  }
  if (settingsRes.error) {
    console.error("shop_settings read failed:", settingsRes.error.message);
  }

  const products = ((productsRes.data ?? []) as ShopProductRow[])
    .map(productFromRow)
    .filter((p) => p.sizes.length > 0);
  const settings = settingsRes.data
    ? settingsFromRow(settingsRes.data as ShopSettingsRow)
    : null;

  // A missing settings row (migration not run yet) reads as "not
  // configured" rather than as an open shop with placeholder handles.
  if (!settings && !settingsRes.error) {
    console.warn(
      "Shop: shop_settings has no row with id 1 — run supabase/migrations/20261124120000_shop.sql in the SQL Editor.",
    );
  }
  return { configured: settings !== null, products, settings };
}

/** Names only, never values — shows up in the Vercel build/function log. */
function warnUnconfigured(which: "page" | "order") {
  const missing = [
    "NEXT_PUBLIC_SUPABASE_URL",
    which === "page" ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : "SUPABASE_SERVICE_ROLE_KEY",
  ].filter((name) => !process.env[name]);
  console.warn(`Shop (${which}): Supabase not configured — unset: ${missing.join(", ") || "none"}`);
}

function fixture(): ShopData {
  const sizes = ["S", "M", "L", "XL", "2XL"];
  return {
    configured: true,
    products: [
      { id: "tee", name: "T-Shirt", priceCents: 1500, sizes, imagePath: "/shop/tee.webp", imageAlt: "Black Central Church T-shirt with the skyline stripe design", sortOrder: 1 },
      { id: "crew", name: "Crewneck", priceCents: 2500, sizes, imagePath: "/shop/crew.webp", imageAlt: "Black Central Church crewneck sweatshirt with the skyline stripe design", sortOrder: 2 },
      { id: "hoodie", name: "Hoodie", priceCents: 3000, sizes, imagePath: "/shop/hoodie.webp", imageAlt: "Black Central Church hoodie with the skyline stripe design", sortOrder: 3 },
    ],
    settings: {
      isOpen: process.env.SHOP_DEV_FIXTURE_CLOSED !== "1",
      cashappCashtag: "$CentralCashtag",
      pushpayUrl: "https://example.com/pushpay",
      pushpayFund: "[Fund name]",
      cashRecipients: ["Travelle", "Jessica Ward"],
      pickupDetails: "[Pickup details]",
    },
  };
}

const useFixture = process.env.SHOP_DEV_FIXTURE === "1";

/** For the page: anon key, under RLS. */
export async function loadShopData(): Promise<ShopData> {
  if (useFixture) return fixture();
  if (!supabasePublic) {
    warnUnconfigured("page");
    return { configured: false, products: [], settings: null };
  }
  return load(supabasePublic);
}

/** For the order route: service role, so the read can't be shaped by RLS. */
export async function loadShopDataAdmin(): Promise<ShopData> {
  if (useFixture) return fixture();
  if (!supabaseAdmin) {
    warnUnconfigured("order");
    return { configured: false, products: [], settings: null };
  }
  return load(supabaseAdmin);
}
