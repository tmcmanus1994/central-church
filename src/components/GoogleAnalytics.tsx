import Script from "next/script";

/** GA4 property for arcentralchurch.org. */
const GA_MEASUREMENT_ID = "G-D4M1R6KWWG";

/**
 * Google's gtag.js, loaded via next/script instead of a raw <script> tag so
 * it doesn't block the page — `afterInteractive` fires once the page is
 * interactive, same timing GA recommends.
 *
 * Skipped outside production so local dev and preview deployments don't
 * pollute real traffic data.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
