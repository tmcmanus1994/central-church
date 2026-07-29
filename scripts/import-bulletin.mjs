#!/usr/bin/env node
/**
 * Parses a weekly bulletin PDF into a structured draft.
 *
 *   node scripts/import-bulletin.mjs Weekly_Bulletin_072626.pdf
 *
 * Writes content-drafts/bulletin-<date>.json and prints a report: which
 * "Looking Ahead" events are new against src/content/bulletin-events.ts, and
 * which lines carry information that shouldn't go on a public page.
 *
 * It deliberately does NOT write src/content/bulletin.ts. Bulletin shorthand
 * ("30's potluck", "Chili and Pushups", "Shannabration") needs a human to
 * turn it into copy a first-time visitor can read, and the prayer list needs
 * a human to decide what's publishable at all. The draft is the input to that
 * pass, not a replacement for it.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src", "content");
const OUT_DIR = path.join(process.cwd(), "content-drafts");

/** Lines matching these never belong on a public page. */
const SENSITIVE = [
  { re: /\b(surgery|hip replacement|cancer|chemo|alzheimer|hospice|passed away|memorial service)\b/i, why: "health or bereavement, named" },
  { re: /\b(baby|wedding)\s+shower\b/i, why: "member-personal" },
  { re: /\b(offering|weekly budget)\b.*\$/i, why: "internal finances" },
  { re: /\(\d{3}\)\s*\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/, why: "personal phone number" },
  { re: /\b[\w.+-]+@(?!arcentralchurch\.org)[\w-]+\.[\w.]+\b/i, why: "personal email address" },
];

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

async function extractLines(file) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(await readFile(file));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];

  for (let n = 1; n <= doc.numPages; n++) {
    const content = await (await doc.getPage(n)).getTextContent();
    const lines = [];
    let y = null;
    let buf = [];
    for (const item of content.items) {
      if (!item.str) continue;
      const top = Math.round(item.transform[5]);
      // A jump in baseline means a new line; PDF text comes in runs.
      if (y !== null && Math.abs(top - y) > 3) {
        lines.push(buf.join(""));
        buf = [];
      }
      buf.push(item.str);
      y = top;
    }
    if (buf.length) lines.push(buf.join(""));
    pages.push(lines.map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean));
  }
  return pages;
}

/** Everything between a heading and the next known heading. */
function section(lines, start, stops) {
  const from = lines.findIndex((l) => start.test(l));
  if (from === -1) return [];
  const rest = lines.slice(from + 1);
  const to = rest.findIndex((l) => stops.some((s) => s.test(l)));
  return to === -1 ? rest : rest.slice(0, to);
}

/** "• Aug. 5: Back to School Event" → { date, title } */
function parseLookingAhead(rawLines, year) {
  const events = [];
  let currentDate = null;

  // The column is narrow, so a title can wrap: "Back to School Event/" then
  // "Friends & Family Meal" on the next line. Rejoin before parsing.
  const lines = [];
  for (const line of rawLines) {
    if (lines.length && /\/$/.test(lines[lines.length - 1])) {
      lines[lines.length - 1] += " " + line;
    } else {
      lines.push(line);
    }
  }

  for (const raw of lines) {
    const line = raw.replace(/^[•·\-\s]+/, "").trim();
    if (!line) continue;

    const dated = line.match(
      /^([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2})(?:\s*[-–]\s*(?:([A-Z][a-z]{2})[a-z]*\.?\s*)?(\d{1,2}))?\s*:?\s*(.*)$/,
    );
    if (dated) {
      const [, mon, day, endMon, endDay, rest] = dated;
      const month = MONTHS[mon.toLowerCase()];
      if (month === undefined) continue;
      currentDate = {
        start: iso(year, month, +day),
        end: endDay
          ? iso(year, endMon ? MONTHS[endMon.toLowerCase()] : month, +endDay)
          : undefined,
      };
      if (rest.trim()) events.push({ ...currentDate, title: clean(rest) });
      continue;
    }
    // A bare line under a date belongs to it — Aug. 2 lists four events.
    if (currentDate) events.push({ ...currentDate, title: clean(line) });
  }
  return events.filter((e) => e.title.length > 2);
}

const clean = (s) => s.replace(/[•·]/g, "").replace(/\s+/g, " ").trim().replace(/[:!]$/, "");
const iso = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Same normalisation lib/calendar.ts uses, so matches agree. */
const key = (title) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(open|opens|meeting|class|classes|group|time)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Titles and aliases already known to the site. */
async function knownEventKeys() {
  const file = path.join(SRC, "bulletin-events.ts");
  if (!existsSync(file)) return new Set();
  const src = await readFile(file, "utf8");
  const keys = new Set();
  for (const m of src.matchAll(/title:\s*"([^"]+)"/g)) keys.add(key(m[1]));
  for (const m of src.matchAll(/aliases:\s*\[([^\]]+)\]/g)) {
    for (const a of m[1].matchAll(/"([^"]+)"/g)) keys.add(key(a[1]));
  }
  return keys;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node scripts/import-bulletin.mjs <bulletin.pdf>");
    process.exit(1);
  }

  const pages = await extractLines(file);
  const all = pages.flat();

  const weekOf =
    all.find((l) => /^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(l)) ?? "unknown";
  const year = +(weekOf.match(/(\d{4})$/)?.[1] ?? new Date().getFullYear());

  const stops = [
    /^Looking Ahead$/i, /^Ongoing Activities$/i, /^NEW PRAYER REQUESTS$/i,
    /^CONTINUED PRAYERS$/i, /^EXPECTING BABIES$/i, /^CANCER TREATMENT$/i,
    /^OUR SERVICE MEMBERS$/i, /^OUR MISSIONARIES$/i, /^ONGOING PRAYERS$/i,
    /^Today.s Order of Worship$/i, /^Class Descriptions$/i,
    /^Kids Closet Needs/i, /^Offering Last Week/i,
    // The masthead block that closes page one.
    /^[A-Z][a-z]+ \d{1,2}, \d{4}$/, /^Following Jesus Together$/i,
    /^We.re glad you.re here/i, /^Welcome to$/i, /^823 W\./i,
  ];

  const draft = {
    source: path.basename(file),
    weekOf,
    lookingAhead: parseLookingAhead(
      section(all, /^Looking Ahead$/i, stops),
      year,
    ),
    ongoing: section(all, /^Ongoing Activities$/i, stops).map(clean),
    orderOfWorship: section(all, /^Today.s Order of Worship$/i, stops).map(clean),
    kidsClosetNeeds: section(all, /^Kids Closet Needs/i, stops).map(clean),
    classDescriptions: section(all, /^Class Descriptions$/i, stops).map(clean),
    prayer: [
      /^NEW PRAYER REQUESTS$/i, /^CONTINUED PRAYERS$/i, /^EXPECTING BABIES$/i,
      /^CANCER TREATMENT$/i, /^OUR SERVICE MEMBERS$/i, /^OUR MISSIONARIES$/i,
      /^ONGOING PRAYERS$/i,
    ].map((h) => ({
      heading: all.find((l) => h.test(l)) ?? "",
      items: section(all, h, stops).map(clean),
    })).filter((s) => s.heading),
    rawPages: pages,
  };

  await mkdir(OUT_DIR, { recursive: true });
  const stamp = weekOf.replace(/[^0-9A-Za-z]+/g, "-").toLowerCase();
  const out = path.join(OUT_DIR, `bulletin-${stamp}.json`);
  await writeFile(out, JSON.stringify(draft, null, 2));

  // ---- report ----------------------------------------------------------
  const known = await knownEventKeys();
  const fresh = draft.lookingAhead.filter((e) => !known.has(key(e.title)));

  console.log(`\nBulletin: ${weekOf}  (${pages.length} pages)`);
  console.log(`Draft written to ${path.relative(process.cwd(), out)}\n`);

  console.log(`Looking Ahead — ${draft.lookingAhead.length} event(s):`);
  for (const e of draft.lookingAhead) {
    const mark = known.has(key(e.title)) ? "  " : "NEW";
    console.log(`  ${mark}  ${e.start}${e.end ? `–${e.end}` : ""}  ${e.title}`);
  }

  if (fresh.length) {
    console.log(
      `\n${fresh.length} event(s) not yet in src/content/bulletin-events.ts.` +
        ` Add them there to reach the site.`,
    );
  } else {
    console.log("\nEvery Looking Ahead event is already on the site.");
  }

  const flagged = [];
  for (const line of all) {
    // The masthead carries the church's own published phone and address.
    if (/arcentralchurch\.org\s*\|/.test(line)) continue;
    for (const { re, why } of SENSITIVE) {
      if (re.test(line)) {
        flagged.push({ why, line: line.slice(0, 90) });
        break;
      }
    }
  }
  if (flagged.length) {
    console.log(`\nReview before publishing — ${flagged.length} line(s):`);
    for (const f of flagged) console.log(`  [${f.why}] ${f.line}`);
    console.log(
      "\nThese stay off the public site unless bulletinPolicy in" +
        " src/content/bulletin.ts says otherwise.",
    );
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
