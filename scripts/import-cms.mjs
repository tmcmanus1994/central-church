/**
 * Converts the exported CMS CSVs into typed content files.
 *
 *   node scripts/import-cms.mjs <blogs.csv> <camp-caudle.csv>
 *
 * Re-run whenever a fresh export lands; it overwrites the generated files.
 */
import { readFileSync, writeFileSync } from "node:fs";

/** Minimal RFC-4180 parser — handles quoted fields containing commas/newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((v) => v !== ""));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const ts = (v) => JSON.stringify(v);

// ── Blog ──────────────────────────────────────────────────────────────────
const blogRows = parseCsv(readFileSync(process.argv[2], "utf8"));
const posts = blogRows
  .map((r) => ({
    slug: r.Slug,
    title: r["Blog Title"],
    html: r["Blog Text"],
    excerpt: (r["Blog Introduction"] || "").trim(),
    image: r["Blog Picture"] || undefined,
    imageAlt: r["Blog Picture:alt"] || "",
    date: r.Date ? r.Date.slice(0, 10) : "",
    author: r.Author || "Central Church",
  }))
  .filter((p) => p.slug && p.title)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

writeFileSync(
  "src/content/blog.ts",
  `/**
 * Blog posts, generated from the CMS export by scripts/import-cms.mjs.
 * Do not hand-edit — re-run the script against a fresh export instead.
 *
 * \`image\` still points at Framer's CDN. Those files should be migrated into
 * public/blog/ before the Framer site is decommissioned.
 */

export interface BlogPost {
  slug: string;
  title: string;
  /** Trusted CMS HTML — rendered via dangerouslySetInnerHTML. */
  html: string;
  excerpt: string;
  image?: string;
  imageAlt: string;
  /** ISO date, or "" when the export had none. */
  date: string;
  author: string;
}

export const blogPosts: BlogPost[] = ${ts(posts)};

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
`,
);
console.log(`blog: ${posts.length} posts → src/content/blog.ts`);

// ── Camp Caudle videos ────────────────────────────────────────────────────
const campRows = parseCsv(readFileSync(process.argv[3], "utf8"));
const videos = campRows
  .map((r) => ({
    slug: r.Slug,
    title: r.Title,
    year: r["Year?"],
    vimeoUrl: r["Vimeo Link"],
    embedUrl: r["Vimeo Full Screen Link"],
    kind: r["Which item?"] || "Video",
  }))
  .filter((v) => v.slug && v.embedUrl);

const years = [...new Set(videos.map((v) => v.year))].sort((a, b) => Number(b) - Number(a));

writeFileSync(
  "src/content/camp-caudle.ts",
  `/**
 * Camp Caudle videos, generated from the CMS export by scripts/import-cms.mjs.
 * Do not hand-edit — re-run the script against a fresh export instead.
 */

export interface CampVideo {
  slug: string;
  title: string;
  year: string;
  /** Public Vimeo page */
  vimeoUrl: string;
  /** player.vimeo.com URL used by the embedded iframe */
  embedUrl: string;
  kind: string;
}

export const campVideos: CampVideo[] = ${ts(videos)};

/** Years present in the export, newest first. */
export const campYears: string[] = ${ts(years)};

export function campVideosByYear(year: string) {
  return campVideos.filter((v) => v.year === year);
}

export function getCampVideo(slug: string) {
  return campVideos.find((v) => v.slug === slug);
}
`,
);
console.log(
  `camp caudle: ${videos.length} videos across ${years.length} years (${years.join(", ")}) → src/content/camp-caudle.ts`,
);
