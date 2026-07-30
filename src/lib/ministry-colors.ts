import type { EventTag } from "@/content/events";

/**
 * One color per ministry, applied wherever events are listed.
 *
 * A month of events all wearing the same teal reads as one undifferentiated
 * column. Giving each ministry its own hue makes the list scannable — you can
 * pick out the Kids events without reading a word — and carries the same
 * association through cards, rows, filters, and the spotlight.
 *
 * Class strings are written out in full rather than composed, because
 * Tailwind scans source text for literal class names and would never generate
 * `bg-${key}-tint`. Colors and their contrast notes live in globals.css.
 */
export interface MinistryPalette {
  /** Tag chip: tinted background, deep text. */
  chip: string;
  /** Date block on a row: tinted background. */
  block: string;
  /** Deep text — the day number, the date line on a card. */
  text: string;
  /** Slightly recessive text for the month abbreviation. */
  textSoft: string;
  /** Border for the accent rule across the top of a card. */
  rule: string;
  /** Hover treatment for a whole row. */
  hover: string;
  /** Filled background for an active filter chip. */
  solid: string;
  /** Tinted background for an inactive filter chip on hover. */
  hoverChip: string;
  /** Diagonal gradient for the ministry banner, in the ministry's own hue. */
  bannerFlat: string;
}

const PALETTES: Record<EventTag, MinistryPalette> = {
  "All Church": {
    chip: "bg-church-tint text-church-deep",
    block: "bg-church-tint",
    text: "text-church-deep",
    textSoft: "text-church-deep/70",
    rule: "border-t-church-solid",
    hover: "hover:border-church-solid/40 hover:bg-church-tint/50",
    solid: "bg-church-solid text-white",
    hoverChip: "hover:bg-church-tint",
    bannerFlat: "from-church-deep to-church-solid",
  },
  Outreach: {
    chip: "bg-outreach-tint text-outreach-deep",
    block: "bg-outreach-tint",
    text: "text-outreach-deep",
    textSoft: "text-outreach-deep/70",
    rule: "border-t-outreach-solid",
    hover: "hover:border-outreach-solid/40 hover:bg-outreach-tint/50",
    solid: "bg-outreach-solid text-white",
    hoverChip: "hover:bg-outreach-tint",
    bannerFlat: "from-outreach-deep to-outreach-solid",
  },
  "Central Kids": {
    chip: "bg-kids-tint text-kids-deep",
    block: "bg-kids-tint",
    text: "text-kids-deep",
    textSoft: "text-kids-deep/70",
    rule: "border-t-kids-solid",
    hover: "hover:border-kids-solid/40 hover:bg-kids-tint/50",
    solid: "bg-kids-solid text-white",
    hoverChip: "hover:bg-kids-tint",
    bannerFlat: "from-kids-deep to-kids-solid",
  },
  "Central Teens": {
    chip: "bg-teens-tint text-teens-deep",
    block: "bg-teens-tint",
    text: "text-teens-deep",
    textSoft: "text-teens-deep/70",
    rule: "border-t-teens-solid",
    hover: "hover:border-teens-solid/40 hover:bg-teens-tint/50",
    solid: "bg-teens-solid text-white",
    hoverChip: "hover:bg-teens-tint",
    bannerFlat: "from-teens-deep to-teens-solid",
  },
  "Life Groups": {
    chip: "bg-groups-tint text-groups-deep",
    block: "bg-groups-tint",
    text: "text-groups-deep",
    textSoft: "text-groups-deep/70",
    rule: "border-t-groups-solid",
    hover: "hover:border-groups-solid/40 hover:bg-groups-tint/50",
    solid: "bg-groups-solid text-white",
    hoverChip: "hover:bg-groups-tint",
    bannerFlat: "from-groups-deep to-groups-solid",
  },
};

/** An untagged event falls back to the brand teal. */
const FALLBACK = PALETTES["All Church"];

export function paletteFor(tag?: EventTag): MinistryPalette {
  return (tag && PALETTES[tag]) || FALLBACK;
}
