/**
 * Normalizes uploaded photos into public/photos/.
 *
 * Photos arrive named by page and section ("visit - where to park.png").
 * This resizes them to a sane maximum for their role, converts to WebP, and
 * writes clean kebab-case filenames that the photo registry points at.
 *
 *   node scripts/import-photos.mjs [sourceDir]     # default: repo root
 *
 * Re-runnable: drop new uploads in, add a line to MAP, run again.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2] ?? ".";
const OUT = "public/photos";
mkdirSync(OUT, { recursive: true });

/** Max width by role — every slot displays far smaller than the originals. */
const WIDTH = { hero: 2560, wide: 1920, card: 1600, thumb: 1200, portrait: 900 };

/** uploaded filename (without extension) → [output name, role] */
const MAP = {
  "about - story": ["about-story", "hero"],

  "visit - accessibility": ["visit-accessibility", "thumb"],
  "visit - where to park": ["visit-where-to-park", "thumb"],

  "events - ice cream social": ["event-ice-cream-social", "card"],
  "visit - st. louis trip": ["event-st-louis-trip", "card"],

  "Kids Ministry - Easter Egg Hunt": ["kids-easter-egg-hunt", "thumb"],
  "kids ministry - kids week": ["kids-week", "thumb"],
  "kids ministry - trunk 3": ["kids-trunk-or-treat", "thumb"],
  "kids ministry - photos": ["kids-gallery-1", "card"],
  "kids ministry - photos 2": ["kids-gallery-2", "card"],
  "kids ministry - photos 3": ["kids-gallery-3", "card"],
  "kids ministry - photos 4": ["kids-gallery-4", "card"],

  "igelsia - photo 1": ["iglesia-gallery-1", "card"],
  "igelsia - photo 2": ["iglesia-gallery-2", "card"],
  "igelsia - photo 3": ["iglesia-gallery-3", "card"],
  "igelsia - photo 4": ["iglesia-gallery-4", "card"],

  // Leadership headshots — first names as uploaded, mapped to full names.
  "Leadership - Steven": ["leadership-steven-hovater", "portrait"],
  "Leadership - James": ["leadership-james-mosley", "portrait"],
  "Leadership - Matt": ["leadership-matt-thomas", "portrait"],
  "Leadership - Mark": ["leadership-mark-adkison", "portrait"],
  "Leadership - Brian": ["leadership-brian-beck", "portrait"],
  "Leadership - Mac": ["leadership-mac-bell", "portrait"],
  "Leadership - Will": ["leadership-will-hogg", "portrait"],
  "Leadership - Bill": ["leadership-bill-lamb", "portrait"],
  "Leadership - James Meadors": ["leadership-james-meadors", "portrait"],
  "Leadership - Dennis": ["leadership-dennis-mitchell", "portrait"],
  "Leadership - Terry": ["leadership-terry-shaw", "portrait"],
  "Leadership - Peyton": ["leadership-peyton-tucker", "portrait"],
  "Leadership - Anthony": ["leadership-anthony-wilson", "portrait"],
  "Leadership - Shannon": ["leadership-shannon-cooper", "portrait"],
  "Leadership - Meech": ["leadership-meech-geter", "portrait"],
  "Leadership - Lacey": ["leadership-lacey-hines", "portrait"],
  "Leadership - Travelle": ["leadership-travelle-mcmanus", "portrait"],
  "Leadership - Ian.png": ["leadership-ian-miller", "portrait"],
  "Leadership - Chad": ["leadership-chad-tappe", "portrait"],
  "Leadership - Jessica": ["leadership-jessica", "portrait"],
};

const files = readdirSync(SRC).filter((f) =>
  /\.(jpe?g|png|webp)$/i.test(f),
);

let done = 0;
let savedBytes = 0;
const unmapped = [];

for (const file of files) {
  const stem = file.replace(/\.(jpe?g|png|webp)$/i, "");
  const entry = MAP[stem];
  if (!entry) {
    unmapped.push(file);
    continue;
  }
  const [name, role] = entry;
  const src = join(SRC, file);
  const dest = join(OUT, `${name}.webp`);
  const before = statSync(src).size;

  await sharp(src)
    .rotate() // honour EXIF orientation
    .resize({ width: WIDTH[role], withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);

  const after = statSync(dest).size;
  savedBytes += before - after;
  done += 1;
  console.log(
    `${name}.webp`.padEnd(34),
    `${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024).toFixed(0)}KB`,
  );
}

console.log(`\n${done} photos → ${OUT}`);
console.log(`Saved ${(savedBytes / 1024 / 1024).toFixed(1)}MB`);
if (unmapped.length) {
  console.log(`\nNot in MAP (skipped):\n  ${unmapped.join("\n  ")}`);
}
if (!existsSync(OUT)) process.exitCode = 1;
