/**
 * Renders the shop's social share card to src/app/shop/opengraph-image.png.
 *
 * Same approach as generate-og-image.mjs: a static PNG that Next.js picks
 * up by file convention for /shop, so link previews (iMessage, Facebook,
 * Instagram DMs, X) show the shirts instead of the site-wide card.
 *
 *   node scripts/generate-shop-og-image.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const b64 = (p) => readFileSync(p).toString("base64");
const display = b64("node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2");
const body = b64("node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2");
const mono = b64("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2");
const img = (p, type) => `data:image/${type};base64,${b64(p)}`;
const logo = img("public/brand/logo-white.webp", "webp");
const tee = img("public/shop/tee.webp", "webp");
const crew = img("public/shop/crew.webp", "webp");
const hoodie = img("public/shop/hoodie.webp", "webp");

const stripes = ["#cf3e41", "#e2ab37", "#d2d3c3", "#2e979b", "#a52e64", "#65927d", "#2f6486"];

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(data:font/woff2;base64,${display}) format("woff2");font-weight:700}
@font-face{font-family:M;src:url(data:font/woff2;base64,${body}) format("woff2");font-weight:200 800}
@font-face{font-family:Mono;src:url(data:font/woff2;base64,${mono}) format("woff2");font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#16130f;color:#fff;font-family:M,sans-serif;position:relative;overflow:hidden}
.copy{position:absolute;left:72px;top:0;bottom:0;width:560px;display:flex;flex-direction:column;justify-content:center;gap:22px}
.logo{height:52px;width:auto;align-self:flex-start}
.eyebrow{font-size:19px;letter-spacing:.18em;text-transform:uppercase;color:#9FC3D1;font-weight:700}
h1{font-family:B;font-size:78px;line-height:.98;letter-spacing:-.04em;font-weight:700}
.sub{font-size:25px;line-height:1.35;color:#D9D3CA;max-width:520px}
.chips{display:flex;gap:10px;font-family:Mono;font-size:19px;color:#D9D3CA}
.chips span{border:1.5px solid #3a342d;border-radius:999px;padding:9px 16px}
.art{position:absolute;left:640px;top:0;right:0;bottom:0}
.art img{position:absolute;filter:drop-shadow(0 24px 28px rgba(0,0,0,.55))}
.stripes{position:absolute;left:0;right:0;bottom:0;height:14px;display:grid;grid-template-columns:repeat(7,1fr)}
.url{position:absolute;right:40px;bottom:30px;font-family:Mono;font-size:18px;color:#9C958B}
</style>
<div class="copy">
  <img class="logo" src="${logo}" alt="">
  <div class="eyebrow">Central Merch · Downtown Little Rock</div>
  <h1>Wear Central all week long</h1>
  <div class="sub">Our skyline design on a tee, a crewneck, or a hoodie. Order online, pick up at church.</div>
  <div class="chips"><span>T-Shirt $15</span><span>Crewneck $25</span><span>Hoodie $30</span></div>
</div>
<div class="art">
  <img src="${crew}" style="left:-30px;top:120px;width:300px;transform:rotate(-7deg)">
  <img src="${hoodie}" style="left:290px;top:95px;width:310px;transform:rotate(6deg)">
  <img src="${tee}" style="left:110px;top:190px;width:340px;z-index:2">
</div>
<div class="stripes">${stripes.map((c) => `<i style="background:${c}"></i>`).join("")}</div>`;

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: "src/app/shop/opengraph-image.png" });
await browser.close();
console.log("Wrote src/app/shop/opengraph-image.png");
