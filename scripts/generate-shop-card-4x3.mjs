/**
 * Renders a 4:3 version of the shop share card with a QR code, for social
 * posts, slides, and print. Not used by the site itself.
 *
 *   node scripts/generate-shop-card-4x3.mjs <qr.png> <out.png>
 *
 * Rendered at 2400×1800 (1200×900 at 2×). The QR tile is 300 CSS px, so
 * it comes out 600 px wide — scannable from a phone screen or a printed
 * flyer. The QR image should already carry its white quiet zone.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const [qrPath, outPath = "central-shop-card-4x3.png"] = process.argv.slice(2);
if (!qrPath) {
  console.error("usage: node scripts/generate-shop-card-4x3.mjs <qr.png> [out.png]");
  process.exit(1);
}

const b64 = (p) => readFileSync(p).toString("base64");
const display = b64("node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2");
const body = b64("node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2");
const mono = b64("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2");
const img = (p, type) => `data:image/${type};base64,${b64(p)}`;
const logo = img("public/brand/logo-white.webp", "webp");
const tee = img("public/shop/tee.webp", "webp");
const crew = img("public/shop/crew.webp", "webp");
const hoodie = img("public/shop/hoodie.webp", "webp");
const qr = img(qrPath, qrPath.endsWith(".jpg") || qrPath.endsWith(".jpeg") ? "jpeg" : "png");

const stripes = ["#cf3e41", "#e2ab37", "#d2d3c3", "#2e979b", "#a52e64", "#65927d", "#2f6486"];

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(data:font/woff2;base64,${display}) format("woff2");font-weight:700}
@font-face{font-family:M;src:url(data:font/woff2;base64,${body}) format("woff2");font-weight:200 800}
@font-face{font-family:Mono;src:url(data:font/woff2;base64,${mono}) format("woff2");font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:900px;background:#16130f;color:#fff;font-family:M,sans-serif;position:relative;overflow:hidden}
.copy{position:absolute;left:64px;top:64px;width:540px;display:flex;flex-direction:column;gap:20px}
.logo{height:50px;width:auto;align-self:flex-start;margin-bottom:10px}
.eyebrow{font-size:17px;letter-spacing:.18em;text-transform:uppercase;color:#9FC3D1;font-weight:700}
h1{font-family:B;font-size:70px;line-height:.98;letter-spacing:-.04em;font-weight:700}
.sub{font-size:23px;line-height:1.4;color:#D9D3CA;max-width:520px}
.chips{display:flex;gap:10px;font-family:Mono;font-size:18px;color:#D9D3CA}
.chips span{border:1.5px solid #3a342d;border-radius:999px;padding:9px 16px}
.art{position:absolute;left:640px;top:40px;right:0;height:560px}
.art img{position:absolute;filter:drop-shadow(0 24px 28px rgba(0,0,0,.55))}
.scan{position:absolute;left:64px;bottom:72px;display:flex;align-items:center;gap:30px}
.qr{width:320px;height:320px;background:#fff;border-radius:22px;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center}
.qr img{width:100%;height:100%;image-rendering:pixelated}
.scan-text{display:flex;flex-direction:column;gap:10px}
.scan-text b{font-family:B;font-size:40px;letter-spacing:-.02em;line-height:1.05}
.scan-text span{font-size:22px;color:#D9D3CA;line-height:1.4;max-width:300px}
.scan-text code{font-family:Mono;font-size:21px;color:#9FC3D1;margin-top:6px}
.stripes{position:absolute;left:0;right:0;bottom:0;height:16px;display:grid;grid-template-columns:repeat(7,1fr)}
</style>
<div class="copy">
  <img class="logo" src="${logo}" alt="">
  <div class="eyebrow">Central Merch · Downtown Little Rock</div>
  <h1>Wear Central all week long</h1>
  <div class="sub">Our skyline design on a tee, a crewneck, or a hoodie. Order online, pay with Cash App, Pushpay, or cash, and pick up at church.</div>
  <div class="chips"><span>T-Shirt $15</span><span>Crewneck $25</span><span>Hoodie $30</span></div>
</div>
<div class="art">
  <img src="${crew}" style="left:0;top:90px;width:300px;transform:rotate(-7deg)">
  <img src="${hoodie}" style="left:270px;top:60px;width:300px;transform:rotate(6deg)">
  <img src="${tee}" style="left:120px;top:170px;width:340px;z-index:2">
</div>
<div class="scan">
  <div class="qr"><img src="${qr}" alt="QR code to the shop"></div>
  <div class="scan-text"><b>Scan to order</b><span>Point your phone's camera at the code to open the shop.</span><code>arcentralchurch.org/shop</code></div>
</div>
<div class="stripes">${stripes.map((c) => `<i style="background:${c}"></i>`).join("")}</div>`;

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: outPath });
await browser.close();
console.log(`Wrote ${outPath}`);
