/**
 * Renders every page and outlines each empty photo slot in red with a number
 * badge, so the remaining photography is visible at a glance. Writes PNGs plus
 * an inventory.json of slot dimensions.
 *
 *   npm run build && npm start &      # serve on :3311
 *   npm run shots
 *
 * Override with BASE_URL / OUT_DIR env vars. Nothing here touches app source —
 * the highlighting is injected at capture time.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3311";
const OUT = process.env.OUT_DIR ?? "photo-slots";
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ["home", "/"],
  ["plan-a-visit", "/plan-a-visit"],
  ["events", "/events"],
  ["event-detail", "/events/back-to-school-backpack-giveaway"],
  ["ministry-children", "/ministries/children"],
  ["ministry-kids-closet", "/ministries/kids-closet"],
  ["iglesia", "/iglesia"],
  ["about", "/about"],
  ["leadership", "/about/leadership"],
  ["missionaries", "/about/missionaries"],
  ["media", "/media"],
  ["podcast", "/media/podcast"],
  ["live", "/media/live"],
  ["bulletin", "/bulletin"],
  ["blog", "/blog"],
  ["blog-post", "/blog/what-we-learned-hosting-story-time"],
];

// Injected at capture time — no source changes. Outlines every photo slot,
// numbers it, and neutralizes sticky/fixed elements so full-page shots read cleanly.
const HIGHLIGHT_CSS = `
  *, *::before, *::after { animation: none !important; transition: none !important; }
  header[class*="sticky"], .sticky, [class*="sticky"] { position: static !important; }
  nav[aria-label="Quick actions"] { position: static !important; }
  .ccc-slot { outline: 3px solid #E5484D !important; outline-offset: -3px; }
  /* Only static slots need a containing block for the badge — never override
     absolute/fixed positioning, which would collapse full-bleed hero slots. */
  .ccc-slot-static { position: relative !important; }
  .ccc-badge {
    position: absolute; top: 0; left: 0; z-index: 9999;
    background: #E5484D; color: #fff; font: 700 13px/1 ui-monospace, monospace;
    padding: 6px 9px; border-bottom-right-radius: 8px; letter-spacing: .04em;
  }
`;

const COLLECT = () => {
  const seen = [];
  const nodes = document.querySelectorAll(
    '[role="img"], [class*="img-slot"]',
  );
  let n = 0;
  nodes.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) return; // skip invisible/collapsed
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;
    n += 1;
    el.classList.add("ccc-slot");
    if (style.position === "static") el.classList.add("ccc-slot-static");
    // Capture the note BEFORE injecting the badge, so badge text never leaks in.
    const note = (el.getAttribute("aria-label") || el.textContent || "").trim();
    const badge = document.createElement("span");
    badge.className = "ccc-badge";
    badge.textContent = String(n);
    el.appendChild(badge);
    seen.push({
      n,
      note: note.slice(0, 120),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      ratio: (rect.width / rect.height).toFixed(2),
    });
  });
  return seen;
};

// CHROME_PATH lets a sandbox point at a pre-installed browser; otherwise
// Playwright uses its own download.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const inventory = {};

for (const [name, path] of ROUTES) {
  for (const [device, width, height, scale] of [
    ["desktop", 1440, 900, 1],
    ["mobile", 390, 844, 1],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: scale,
      isMobile: device === "mobile",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    // Full-page screenshots don't trigger lazy-loaded images on their own —
    // scroll the whole page first so every photo is actually decoded.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({ content: HIGHLIGHT_CSS });
    const slots = await page.evaluate(COLLECT);
    if (device === "desktop") inventory[name] = { path, slots };
    await page.screenshot({
      path: `${OUT}/${name}-${device}.png`,
      fullPage: true,
    });
    await ctx.close();
    console.log(`${name} ${device}: ${slots.length} slots`);
  }
}

await browser.close();
writeFileSync(`${OUT}/inventory.json`, JSON.stringify(inventory, null, 2));
console.log("\nTotal desktop slots:", Object.values(inventory).reduce((a, r) => a + r.slots.length, 0));
