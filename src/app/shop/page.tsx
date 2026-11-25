import type { Metadata } from "next";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { loadShopData } from "@/lib/shop-data";
import { site } from "@/lib/site";

const SHARE_TITLE = "Central Shop — Wear Central all week long";
const DESCRIPTION =
  "Central Church shirts with the Little Rock skyline design — a tee, a crewneck, or a hoodie. Order online, pay with Cash App, Pushpay, or cash, and pick up at church.";

export const metadata: Metadata = {
  title: "Shop",
  description: DESCRIPTION,
  alternates: { canonical: "/shop" },
  // The share card (opengraph-image.png beside this file) is picked up by
  // file convention; these make the text on the card match it.
  openGraph: { title: SHARE_TITLE, description: DESCRIPTION, url: "/shop" },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: DESCRIPTION },
};

/**
 * The Central Shop. Server-rendered from Supabase (`shop_products`,
 * `shop_settings`) and refreshed every minute, so a price or a closed shop
 * takes effect without a deploy. All the interaction lives in
 * ShopExperience; the order itself goes to /api/shop/orders.
 */
export const revalidate = 60;

export default async function ShopPage() {
  const { configured, products, settings, reason } = await loadShopData();

  if (!configured || !settings) {
    // Preview deployments and local dev say why, so setup can be finished
    // from the page itself. Production keeps the plain notice.
    const showReason = process.env.VERCEL_ENV !== "production" && reason;
    return (
      <div className="bg-coal px-5 py-20 text-white">
        <div className="mx-auto flex max-w-[640px] flex-col gap-4">
          <p className="m-0 text-[11px] font-bold tracking-[.16em] uppercase text-teal-light">
            Central Merch · Downtown Little Rock
          </p>
          <h1 className="m-0 font-display text-[36px] leading-[1.05] font-bold tracking-[-.03em] text-white">
            The shop isn&rsquo;t open online yet
          </h1>
          <p className="m-0 text-[17px] leading-[1.6] text-[#d9d3ca]">
            Check back soon, or find Travelle or Jessica Ward at church on Sunday to order a shirt. Questions?
            Call the office at{" "}
            <a href={site.phoneHref} className="text-white">
              {site.phone}
            </a>
            .
          </p>
          {showReason ? (
            <p className="m-0 mt-4 rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-mono text-[13px] leading-[1.6] text-[#d9d3ca]">
              Setup (preview only): {reason}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return <ShopExperience products={products} settings={settings} />;
}
