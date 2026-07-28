/**
 * Renders the social share card to src/app/opengraph-image.png.
 *
 * Static by design: Next.js picks the PNG up via its file convention, so there
 * is no runtime font loading and the card can't drift out of sync.
 *
 *   node scripts/generate-og-image.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const b64 = (p) => readFileSync(p).toString("base64");
const display = b64(
  "node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2",
);
const body = b64(
  "node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
);

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(data:font/woff2;base64,${display}) format("woff2");font-weight:700}
@font-face{font-family:M;src:url(data:font/woff2;base64,${body}) format("woff2");font-weight:200 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#235568;color:#fff;font-family:M,sans-serif;
  padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px}
.mark{width:56px;height:56px;border-radius:999px;background:#fff;color:#235568;display:flex;
  align-items:center;justify-content:center;font-family:B;font-size:32px;font-weight:700}
.name{font-size:21px;letter-spacing:.16em;text-transform:uppercase;color:#9FC3D1;font-weight:700}
h1{font-family:B;font-size:92px;line-height:1;letter-spacing:-.04em;font-weight:700}
.sub{font-size:30px;color:#D5E2E8;margin-top:20px}
.foot{display:flex;justify-content:space-between;font-size:23px;color:#9FC3D1;
  border-top:1px solid rgba(255,255,255,.25);padding-top:24px}
</style>
<div class="brand"><div class="mark">C</div><div class="name">Central Church of Christ</div></div>
<div><h1>Following Jesus Together</h1><div class="sub">Downtown Little Rock, Arkansas</div></div>
<div class="foot"><span>Sundays 10:15 AM &middot; Wednesdays 6:30 PM</span><span>823 W 6th St, Little Rock, AR 72201</span></div>`;

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: "src/app/opengraph-image.png" });
await browser.close();
console.log("Wrote src/app/opengraph-image.png");
