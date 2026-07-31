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

Four ministry calendars feed the site.

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
appears without a deploy. Dated events become the chronological Upcoming
list, filtered to the next 240 days. Cancelled events are dropped. A new
event gets its page on first request rather than 404ing until the next build.

**The weekly rhythm does not come from the calendar.** Seven things meet
every week — Sunday Morning Class, Sunday Morning Worship, Iglesia, Wednesday
Classes, Encouragers, Friday Story Time, Kids Closet — and they live in
`recurringEvents` in `src/content/events.ts`. Edit that list to change what
meets weekly or when.

The calendars carry many more repeating entries than those seven, including
series that overlap and duplicate each other, so **every repeating calendar
entry is skipped** and logged at build time. Anything that should show up on
the site needs a date; anything weekly belongs in the file.

**If a feed is unreachable** the site falls back to the seed events in
`src/content/events.ts`, so a network blip never renders an empty calendar.
With no feeds configured at all it uses that same seed data, which is why the
project builds out of the box.

**Event photos** live in `src/content/event-photos.ts`, keyed by the slug
derived from the event title — Google Calendar carries no artwork. Annual
events keep their photo year to year automatically, since the title (and so
the slug) stays the same. An event with no entry renders without an image.

### What reaches the site — `src/content/calendar-rules.ts`

A working church calendar carries more than the congregation needs: staff
meetings, time off, room bookings, the same event entered twice. One file
decides what gets through, and it's the only file to edit when the rules need
adjusting.

- **`PRIVATE_PATTERNS`** — titles that never publish. Meetings that aren't
  gatherings, time off ("Tammy out of office"), room bookings ("Taurus gym
  reservation"), set-up and cleaning, private weddings and memorials.
  Deliberately specific: a rule that's too broad silently hides a real event,
  which is worse than an admin entry slipping through. Every hidden event is
  logged at build time (`Calendar: hid 4 internal event(s): …`) so mistakes
  surface instead of disappearing.
- **`INCOMPLETE_PATTERNS`** — entries that read as half-typed rather than
  private, like a Teens entry titled just "with Stephen". A dangling
  connector can't start a real event name. These are logged separately from
  the private ones because the fix is on the calendar: give the entry a full
  title and it publishes on the next revalidate.
- **`ALWAYS_PUBLIC` / `ALWAYS_PRIVATE`** — exact-title escape hatches, for
  when a real event happens to contain a flagged word ("Volunteer Set-Up
  Party") or a one-off needs hiding without writing a pattern.
- **`TITLE_CLEANUP`** — strips the noise staff titles accumulate: leading
  ministry prefixes (`CC - `), trailing room notes (`(Fellowship Hall)`),
  trailing organiser initials.
- **`CENTRAL_LOCATIONS`** — the rooms and addresses that mean "at the
  building". Anything else counts as **off-site**, and an off-site event
  shows its own address, map, and directions rather than 823 W 6th St — so a
  trip to Silver Dollar City points at Branson.
- **`LOCATION_OVERRIDES`** — a location per event slug, for entries whose
  destination lives in the title and whose location field is blank.

**Duplicates merge.** Titles collapse to a comparison key — case, accents,
punctuation, and filler words (`open`, `meeting`, `class`, `group`, `time`)
all drop out — so "Kid's Closet Open" and "Kids Closet" become one entry. The
weekly rhythm's own titles are seeded into that key set first, so a one-off
copy of something that already meets weekly (an "Encouragers Class" entry on
a Thursday) drops out instead of appearing twice.

## The bulletin is the source of truth

The weekly PDF bulletin carries things the calendar doesn't: events nobody
added, real names for entries someone abbreviated, and the standing
information (classes, ongoing ministries, order of worship) that never
appears on a calendar at all. It's cross-referenced against the feeds.

```bash
npm run bulletin -- Weekly_Bulletin_072626.pdf
```

That parses the PDF into `content-drafts/bulletin-<week>.json` and prints a
report: every "Looking Ahead" event, which ones are **new** against
`src/content/bulletin-events.ts`, and every line carrying information that
shouldn't be published. It deliberately does *not* write
`src/content/bulletin.ts` — bulletin shorthand ("30's potluck", "Chili and
Pushups", "Shannabration") needs a human to turn it into copy a first-time
visitor can read.

**`src/content/bulletin-events.ts`** is where bulletin events live, and
`lib/calendar.ts` folds them into the feeds three ways:

- A calendar entry matching one takes the bulletin's **title, description,
  and location** — that's where the bulletin is better. A Teens entry saved
  as just "with Stephen" becomes "Fun with Stephen" with a description.
- The calendar keeps its own **date and time**, because it's edited all week
  while the bulletin is a Sunday snapshot.
- Anything the calendar has no match for is **added outright**, so a
  forgotten calendar entry doesn't mean a missing event on the site.

Matching is by title, plus an `aliases` list for the shorthand the calendar
actually uses. All three behaviors log at build time.

### What stays off the site

A printed bulletin handed to the congregation and a page a search engine
indexes are different things. `bulletinPolicy` in `src/content/bulletin.ts`
withholds three categories, all off by default:

| | Why |
| --- | --- |
| Named prayer requests | health information about real people |
| Weekly offering and budget | internal finances |
| Wedding and baby showers | member-personal, not church programming |

Member phone numbers and personal email addresses are never published —
announcements route to a staff contact instead. `withheldFromBulletin` in
`bulletin-events.ts` records what was held back and why, so nothing is
silently lost. `content-drafts/` is gitignored for the same reason: the raw
parse contains all of it.

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

### Contacting a person

`src/content/people.ts` carries a staff email per person — elders deliberately
have none, since they're volunteers and the office fields anything for them.
`staffByName` resolves a full name *or* a first name, because bulletin copy and
event descriptions say "Contact Matt".

Three components consume it, so a staff mention anywhere becomes a real
mailbox instead of a general contact form: `ContactButton` (ministry asides,
event host cards), `ContactLink` (tighter spots), and `StaffMention` (inline
prose). Unknown names fall back to the contact form or stay plain text rather
than rendering a misleading link.

Events resolve their host through the hosting ministry, falling back to
`CONTACT_BY_TAG` for tags with no ministry page — Outreach events show Matt
that way. All Church events show no host, because no one person owns them.

### Ministry banners are drawn, not photographed

`MinistryBanner` builds each banner from the ministry's own color plus an arch
motif — concentric arcs, the arch from Central's mark, drawn with a repeating
radial gradient (`.ministry-arches`) so it scales with the banner instead of
being cropped. It weighs nothing, is sharp at any width, and can't crop badly
the way a 21:9 slice of a group photo does.

Two pairs share a hue because they genuinely are siblings — Central Kids with
Kids Closet, Iglesia with Freedom Prayer. `COMPOSITION` in `MinistryBanner.tsx`
moves the arches to a different corner on each page so no two banners read as
the same image twice.

### Ministry colors

A month of events all wearing the same teal reads as one undifferentiated
column, so each ministry carries its own hue — you can find the Kids events
without reading a word.

| Ministry | Color |
| --- | --- |
| All Church | teal (the brand color) |
| Outreach | green |
| Central Kids | amber |
| Central Teens | violet |
| Life Groups | terracotta |

`src/lib/ministry-colors.ts` maps a tag to the class strings for a chip, a
date block, text, a card's top rule, row hover, and a filled filter chip.
It's applied by `Tag`, `EventCard`, `EventRow`, and the events page filters,
so the chip row doubles as the legend for the list under it.

Every `deep` value clears AA on both its own tint and white — the tightest is
Central Kids at 5.3:1. `solid` is for rules and dots only, never type. Class
strings are written out in full rather than composed, because Tailwind scans
for literal names and would never generate `bg-${key}-tint`. The color values
and their contrast notes are in `globals.css`.

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

## Watch Live (YouTube, no embed)

Every "Watch Live" CTA — homepage, `/media/live`, nav/footer — links straight
to `youtubeLiveUrl` in `src/lib/site.ts`:
`https://www.youtube.com/channel/{youtubeChannelId}/live`. That permanent
link always resolves to whatever's live right now, or the channel's Live tab
otherwise, so there's no polling, no scheduling data, and no Supabase state
to keep fresh — people just land on YouTube, where they can comment, like,
and subscribe. `youtubeChannelId` falls back to the `@handle` URL in
`site.socials.youtube` if it's ever cleared.

(An earlier version of this feature polled the YouTube Data API and embedded
a player with LIVE/UPCOMING/REPLAY states. That's been cut in favor of the
simple outbound link above — engagement lives on YouTube, not on the site.)

## Plan a Visit storage

"Let us know you're coming" submissions always email the office through
Resend (see `.env.example`), and are also saved to Supabase
(`visit_requests` table) when `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are set — run `supabase/schema.sql` once in the
Supabase SQL Editor to create the table. The Supabase write is best-effort:
a failure is logged but never blocks the email.

## Remind (text alerts)

`src/lib/remind.ts` maps each audience (Teens, Central Kids, churchwide) to
its Remind class code — Remind has no public signup API, so every alert
CTA on the site is one of two links built from that code:
join (`remind.com/join/{code}`) or text-to-join (`@{code}` to `81010`).
`src/components/RemindSignup.tsx` renders both from a code and renders
nothing for a class that isn't set up yet (empty code), so filling in a code
in `remind.ts` is the only step needed to turn a signup on. Currently wired
into the Central Teens ministry page, Central Kids ministry page (once its
code is set), the site footer, and `/plan-a-visit` (once the churchwide code
is set).

## Still to wire up

- **Photography** — the big ones still open: homepage hero (congregation in
  worship), the lobby-welcome and greeter shots, six ministry banners, and
  Tammy Beck's portrait. Run `npm run shots` to see them all in context.
- **Forms** — Kids Closet (`/api/kids-closet`) and Plan a Visit
  (`/api/plan-a-visit`) both email through Resend; see `.env.example`. Plan a
  Visit currently sends to Travelle's address while it's being tested — point
  it at the office (or a distribution address) once it's approved. Both forms
  submit via `fetch` (see `src/lib/use-form-post.ts`) so a submission shows an
  inline confirmation instead of navigating to the raw API response.
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
