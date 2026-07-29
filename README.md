# Central Church of Christ — arcentralchurch.org rebuild

Next.js rebuild of the Central Church of Christ website (moving off Framer),
built from the design handoff prototype. Organized around three visitors:
**thinking about visiting · already attend · going deeper.**

## Stack

- **Next.js 15** (App Router, TypeScript) — all routes statically generated
- **Tailwind CSS 4** — design tokens in `src/app/globals.css` (`@theme`)
- **Self-hosted fonts** via Fontsource: Bricolage Grotesque (display),
  Manrope (body/UI), IBM Plex Mono (placeholder annotations)

```bash
npm install
npm run dev    # local dev
npm run build  # static production build
```

## Routes

| Route | Notes |
| --- | --- |
| `/` | Hero (service times above the fold), spotlight slot, This Week, New here, ministries strip, latest media |
| `/plan-a-visit` | Expectation → logistics → kids & access → FAQ → form |
| `/events`, `/events/[slug]` | Client-side tag filters, spotlight zone, recurring vs. upcoming, detail template |
| `/ministries`, `/ministries/[slug]` | One template, a content object per ministry |
| `/iglesia` | Spanish ministry page, `lang="es"` + hreflang (`/ministries/iglesia` redirects here) |
| `/about`, `/about/leadership`, `/about/missionaries` | Editorial layouts, FOLLOW/JESUS/TOGETHER moment, people grids |
| `/bulletin` | Automation-fed weekly summary + archive |
| `/media`, `/media/podcast`, `/media/live` | Media hub, episode list, live stream landing |
| `/blog`, `/blog/[slug]` | Index + article template (~30 posts migrate with URLs preserved) |
| `/give` | Redirects to Pushpay |

## Events come from Google Calendar

Four public ministry calendars feed the site. Only public events go on them,
so the calendar itself is the filter — there's no allow-list in code, and
nothing private is ever fetched.

```bash
cp .env.example .env.local   # then paste in the four iCal URLs
```

Each calendar maps to the tag its events wear on the site:

| Calendar | Tag | Also links to |
| --- | --- | --- |
| Central Church | All Church | — |
| Outreach | Outreach | — |
| Central Teens | Central Teens | `/ministries/teens` |
| Central Kids | Central Kids | `/ministries/children` |

**How it behaves.** Pages revalidate every 15 minutes, so a calendar edit
appears without a deploy. Events with an `RRULE` become the weekly rhythm
list; one-off events become the chronological Upcoming list, filtered to the
next 240 days. Cancelled events are dropped. A new event gets its page on
first request rather than 404ing until the next build.

**If a feed is unreachable** the site falls back to the seed events in
`src/content/events.ts`, so a network blip never renders an empty calendar.
With no feeds configured at all it uses that same seed data, which is why the
project builds out of the box.

**Event photos** live in `src/content/event-photos.ts`, keyed by the slug
derived from the event title — Google Calendar carries no artwork. Annual
events keep their photo year to year automatically, since the title (and so
the slug) stays the same. An event with no entry renders without an image.

## Content & data

- `src/lib/site.ts` — **the** source of NAP facts (name, address, phone,
  service times, socials). Never hardcode these elsewhere; local-SEO
  consistency depends on it.
- `src/content/events.ts` — event data in the automation contract shape
  (`slug, title, start, end, allDay, location, description, image?, tag,
  recurring, rrule?, spotlight, ctaLabel?, ctaHref?, ministrySlug?`).
  Everything except title/start/location is optional; cards, rows, and detail
  pages all render without image, description, or CTA. `image: null` means
  "explicitly no image" (text-only card); `undefined` renders a placeholder
  slot until photography lands.
- `src/content/ministries.ts` — one content object per ministry, rendered by
  the shared `MinistryPage` template.
- `src/content/people.ts`, `src/content/media.ts` — leadership, missionaries,
  podcast episodes, blog posts (placeholder entries until migration).

## Component system

Core components (kept layout-portable for the future React Native app):
`EventCard` (the most reused component), `EventRow`, `SpotlightBanner`
(renders nothing when there's no spotlight — the homepage reads as
intentional either way), `SectionHeader`, `Button`, `Tag`, `Faq`, form
fields, `PersonCard`, `SiteHeader` (info bar + nav + mobile sheet),
`MobileTabBar` (Plan a Visit · This Week · Give — becomes the app tab bar),
`SiteFooter`, `ImageSlot`.

`ImageSlot` renders `next/image` when given a `src` and a striped placeholder
(with a note describing the intended shot) otherwise — photography drops in
without layout changes.

## Photos

`src/content/photos.ts` is the single place to point page slots at real
images. Any key left `null` keeps its placeholder and stays correctly laid
out, so photos land one at a time without breaking a page.

```bash
# 1. drop the uploads anywhere in the repo root, named "<page> - <section>.jpg"
# 2. add a line to MAP in scripts/import-photos.mjs
node scripts/import-photos.mjs      # resizes by role, converts to WebP, writes public/photos/
# 3. fill in the matching key in src/content/photos.ts
```

Photos that belong to a *thing* rather than a page live with that thing:
`image` on each event in `events.ts`, `photo` on each person in `people.ts`,
and `galleries` / `annualPhotos` in `photos.ts` for the ministry pages.

## Seeing what photos are still needed

```bash
npm run build
npm start -- -p 3311 &
npm run shots        # → ./photo-slots/*.png + inventory.json
```

Renders every page at desktop (1440) and mobile (390) with each empty photo
slot outlined in red and numbered, so the remaining photography is visible at
a glance. Nothing in `src/` is touched — the highlighting is injected at
capture time. Re-run it as photos land to see what's left.

Env overrides: `BASE_URL`, `OUT_DIR`, `CHROME_PATH`.

**21 of 62 slots are filled.** Of the 41 remaining, 15 fill in automatically
as events and blog posts bring their own images — so the real outstanding
list is short. See `npm run shots` output for the current state.

## Still to wire up

- **Photography** — the big ones still open: homepage hero (congregation in
  worship), the lobby-welcome and greeter shots, six ministry banners, and
  Tammy Beck's portrait. Run `npm run shots` to see them all in context.
- **Visit form backend** — markup/validation is final; submission endpoint TBD.
- **Bulletin automation** — `src/content/bulletin.ts` is hand-edited until
  the weekly PDF parser is wired up; `/bulletin` and `/hub` both read it.
- **Blog migration** — ~30 posts from the current site, existing URLs preserved.
- **Map embeds** — placeholder slots on Plan a Visit, event detail, footer.

## Deploying

Standard Next.js app — no adapter or extra config needed. On Vercel: import
the repo, accept the detected settings, deploy. `npm run build` must pass
first, which it does.

Two generated assets are committed rather than built at request time:
`src/app/opengraph-image.png` (regenerate with
`node scripts/generate-og-image.mjs`) and `src/app/icon.svg`.

Before going live, set `site.url` in `src/lib/site.ts` to the real domain —
it feeds canonical URLs, the sitemap, and JSON-LD.

## SEO

- Per-page meta titles/descriptions from the handoff copy deck
- `Church` JSON-LD (NAP + service times) on every page
- `sitemap.xml` and `robots.txt` generated from the content files
- Open Graph / Twitter card metadata with a generated share image
- AA contrast (muted text ≥ `#6E6862` on white), visible focus rings,
  semantic heading order
