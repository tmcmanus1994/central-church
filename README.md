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

There are **62 slots**, but far fewer distinct photographs — many repeat the
same shot, and 15 fill in automatically as events and blog posts bring their
own images.

## Still to wire up

- **Photography** — every `ImageSlot` placeholder names its intended shot;
  run `npm run shots` to see them all in context.
- **Visit form backend** — markup/validation is final; submission endpoint TBD.
- **Automation feeds** — events JSON, bulletin summary + PDF archive, podcast
  RSS, and the real calendar-subscribe (.ics) URL.
- **Blog migration** — ~30 posts from the current site, existing URLs preserved.
- **Map embeds** — placeholder slots on Plan a Visit, event detail, footer.

## SEO

- Per-page meta titles/descriptions from the handoff copy deck
- `Church` JSON-LD (NAP + service times) on every page
- AA contrast (muted text ≥ `#6E6862` on white), visible focus rings,
  semantic heading order
