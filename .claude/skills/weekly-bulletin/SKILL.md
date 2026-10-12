---
name: weekly-bulletin
description: Update arcentralchurch.org from this week's bulletin email, read from the Google Drive folder "Central Bulletins". Use on Sunday mornings, or whenever Travelle asks to run "this week's bulletin update".
---

# Weekly bulletin update

You are updating `src/content/bulletin.ts` and `src/content/bulletin-events.ts`,
the two files behind `/bulletin`, `/hub`, `/events`, and the homepage
spotlight, from this week's bulletin email. When the build passes you commit
and push straight to the deploy branch
(`claude/church-rebuild-framer-handoff-refm6s`, the repo's only branch, which
Vercel deploys to production). There is no PR step and no human review:
Travelle chose that on 2026-10-06. A stale site is fine; a wrong one is not,
so when in doubt leave something out and say so in the summary.

## Where the sources are

A Google Apps Script in Travelle's account watches his Gmail for
jessica@arcentralchurch.org and saves each bulletin email into the Drive
folder **Central Bulletins** (folder id `1MSkwWoKPPn6pqeMMqAHei-xyeSBy35Hn`)
as:

- `YYYY-MM-DD email.html`: the email body. THE source of truth. Its wording,
  dates, times, and instructions override everything else.
- `YYYY-MM-DD Weekly_Bulletin_MMDDYY.pdf`: the printed bulletin. Supporting
  detail only (order of worship, Wednesday classes, Looking Ahead list,
  ongoing groups). If the PDF contradicts the email on a fact, the email wins;
  note the contradiction in the summary.
- `YYYY-MM-DD <image>.png/.jpg`: flyer images, usually not needed.

The date prefix is the date the email arrived (normally Friday or Saturday).

Read them with the Google Drive connector:

1. `search_files` for files in that folder modified in the last 8 days (query
   on the folder id, or search by name prefix for this week's dates).
2. `read_file_content` on the PDF: it returns the text, no download needed.
3. `download_file_content` on the HTML file (base64). Decode it in the
   scratchpad, strip tags, and read the text. Do not read the HTML with
   `read_file_content` only; it may truncate.

If there is no file dated within the last 8 days: STOP. Touch no content
files. Report "no bulletin email found for {today}" and ask Travelle to check
whether Jessica sent it and whether the Apps Script trigger is still running
(Apps Script -> Triggers, and the label `bulletin-saved` on the email).

The raw email and PDF carry named prayer requests, phone numbers, and giving
figures. Never commit them, never write them into the repo, and keep the
scratchpad copy only for the run.

## Steps

1. Pull the deploy branch first (`git fetch origin` then fast-forward) so you
   are editing what is live.
2. Read the email fully. Extract every upcoming event (title, date, time,
   location, description, sign-up links or deadlines), anything
   spotlight-worthy, and general announcement copy. Resolve relative dates
   ("this Wednesday", "next Sunday") against the email's own date, not
   today's. **Never invent a date the sources don't support.** If a date is
   genuinely ambiguous, leave that event out and say so in the summary.
3. Read the PDF and use it to fill gaps the email left open: order of
   worship, Wednesday class list, Looking Ahead dates, class descriptions,
   locations.
4. **Never write any of the following into `bulletin.ts` or
   `bulletin-events.ts`**, even if the email or PDF states it plainly:
   named health/medical/bereavement details, wedding or baby showers,
   personal phone numbers, personal (non-@arcentralchurch.org) email
   addresses, or specific giving/offering dollar figures (including the
   Harvest goal and the weekly Kids Harvest tub total). This matches
   `bulletinPolicy` in `bulletin.ts` and the existing `withheldFromBulletin`
   list in `bulletin-events.ts`. When you find one, add or update an entry in
   `withheldFromBulletin` instead, same shape as what's there, so the
   information isn't lost, just kept off an indexable page. Do not change
   `bulletinPolicy`.

   One standing exception: the Duréy baby shower (`e-durey-baby-shower`,
   Nov 15, 2026) is public at Travelle's explicit request. Leave it alone.
5. Update `src/content/bulletin.ts`:
   - `weekOf` → this Sunday's date, matching the existing string format
     ("October 11, 2026").
   - `announcements` → rewrite from this week's email, in the same voice as
     what's already there: short, warm, plain English. Use the email's own
     wording lightly cleaned up. Do not invent flourishes the office didn't
     write, and do not flatten it into something stiffer than how Central
     talks to its congregation. Drop anything covered by rule 4. Keep any
     existing `href` (Breeze sign-up links and the like) when the item
     carries over. Use `contact` with an @arcentralchurch.org address when
     the email names a point person.
   - `ongoing`, `sundayClasses`, `wednesdayClasses`, `orderOfWorship`,
     `kidsClosetNeeds` → update only the fields this week's sources speak
     to. Leave everything else as it reads.
   - `archive` → prepend the previous `weekOf` value if it isn't already
     the first entry.
   - Leave `giving` and `prayer` alone unless the email unmistakably asks
     for a specific, publishable change to them.
6. Update `src/content/bulletin-events.ts`:
   - New Looking Ahead events → append, following the `BulletinEvent` shape
     exactly (slug, title, start/end ISO with `-05:00` during CDT or
     `-06:00` during CST, location, description, tag from `EventTag`,
     `ministrySlug` where it fits, `aliases` for any shorthand the Google
     Calendar might use for the same event). Church address is
     `823 W 6th St, Little Rock`; set `offsite: true` for anything elsewhere.
   - An event already there whose details changed → update in place. Keep
     the slug even if the event was renamed, so the calendar match survives;
     add the old name as an alias.
   - An event more than 14 days past → remove it.
   - Never remove an event just because this week's sources don't mention
     it. Absence isn't cancellation. Only remove past-dated ones, or ones the
     email explicitly says are cancelled (and say so in the summary).
7. Review `git diff` and sanity-check it: does every new or changed field
   trace back to the email or the PDF? If you're inferring rather than
   reading, don't write it.
8. If there is no real change from what's already in both files (a re-run
   against the same week), stop here and say so. No commit.
9. Write `runs/{this Sunday}-summary.md` in the same format as the existing
   files in `runs/`: what changed, what was deliberately left out (rule 4
   withholdings described without names or figures, ambiguous dates
   skipped), any email/PDF contradictions, and anything Travelle should
   double-check. It is committed, so it must contain nothing from rule 4
   beyond descriptions like "2 health items withheld".
10. Verify, then publish:
    ```
    npx tsc --noEmit && npm run build
    ```
    Both must pass. Then commit only `src/content/bulletin.ts`,
    `src/content/bulletin-events.ts`, and the run summary, with the message
    `Bulletin update — {weekOf}` and a short body, and
    `git push -u origin claude/church-rebuild-framer-handoff-refm6s`.
    If the build fails, do not push; report the error instead.
11. Report back in a few lines: what changed, what was withheld (by
    category), and anything that needs Travelle's call. Vercel deploys the
    push within a couple of minutes; confirm the deployment reached
    `success` through the GitHub deployments API if you can.

## Hard rules

- Only these three files change in a bulletin run. Never touch code,
  config, or other content files; if the email implies a site change outside
  the bulletin (a new page, a ministry contact change), note it in the
  report for Travelle instead.
- Never write an event without an unambiguous date from the sources.
- Never write anything matching rule 4 into the repo.
- Copy tone: the email's wording as-is or lightly cleaned. This is Central's
  own voice, not a rewrite exercise.
- On any failure (git, build, connector): stop, leave no partial commit, and
  say plainly what failed.
