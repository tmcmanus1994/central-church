# Weekly Bulletin Update Run

You are updating `src/content/bulletin.ts` and `src/content/bulletin-events.ts`
— the two files that power `/bulletin`, `/hub`, `/events`, and the homepage
spotlight — from this week's bulletin email. You open a **pull request**;
you never push to the default branch directly. A human reviews and merges.

## Sources, in order of authority

1. `inbox/{today}/email.md` — THE source of truth. Its wording, dates, times,
   and instructions override everything else. `{today}` is this run's date
   (`date +%F`) — the ingest step that ran immediately before you wrote it.
2. `inbox/{today}/bulletin.pdf` — supporting detail only, **when present**.
   Some weeks the email arrives with no PDF attached at all (check
   `inbox/{today}/meta.json`'s `original_pdf_filename` — `null` means there
   isn't one, and `bulletin.pdf` won't exist on disk either). That's not a
   failure: proceed on `email.md` alone and say so plainly in your summary,
   since there's no PDF to cross-check details or names against this week.
   When a PDF is present, run
   `node scripts/import-bulletin.mjs inbox/{today}/bulletin.pdf` to get a
   structured draft (written to `content-drafts/`, which is gitignored —
   never add it with `git add -A` or any wildcard) plus a console report
   flagging lines that read as health/bereavement, showers, phone numbers,
   personal email addresses, or giving figures. If the PDF contradicts the
   email on any fact, THE EMAIL WINS — note the contradiction in your summary
   so a human can flag it to the office.
3. The current contents of `src/content/bulletin.ts` and
   `src/content/bulletin-events.ts` — what's live now, to be corrected
   toward the email.

## Steps

1. Confirm `inbox/{today}/` exists (today = the date this workflow run
   started). If it doesn't, STOP — do not touch any content files. This
   shouldn't happen: the workflow only runs this step after a successful
   ingest.
2. Read `email.md` fully. Extract every upcoming event (title, date, time,
   location, description, sign-up links or deadlines), anything
   spotlight-worthy, and general announcement copy. Resolve relative dates
   ("this Wednesday", "next Sunday") against today's actual date. **Never
   invent a date the sources don't support** — if a date is genuinely
   ambiguous, leave that event out and say so in your summary.
3. If a PDF is present this week, run the parser (step 1 above) and use its
   output only to fill gaps the email left open (a location, a class
   description). Read its flagged-lines report before writing anything. If
   there's no PDF this week, skip straight to step 4 on `email.md` alone.
4. **Never write any of the following into `bulletin.ts` or
   `bulletin-events.ts`**, even if the email or PDF states it plainly:
   named health/medical/bereavement details, wedding or baby showers,
   personal phone numbers, personal (non-@arcentralchurch.org) email
   addresses, or specific giving/offering dollar figures. This matches
   `bulletinPolicy` in `bulletin.ts` (`publishPrayerList`, `publishGiving`,
   `publishShowers` are all `false` on purpose) and the existing
   `withheldFromBulletin` list in `bulletin-events.ts`. When you find one of
   these, add or update an entry in `withheldFromBulletin` instead — same
   shape as what's already there — so the information isn't silently lost,
   just kept off a page a search engine can index. Do not leave
   `bulletinPolicy` itself changed.
5. Update `src/content/bulletin.ts`:
   - `weekOf` → this week's date, matching the existing string format.
   - `announcements` → rewrite from this week's email/PDF content, in the
     same voice as what's already there: short, warm, plain-English. Use the
     email's own wording lightly cleaned up — do not invent flourishes the
     office didn't write, and do not flatten it into something stiffer than
     how Central actually talks to its congregation. Drop anything covered
     by rule 4.
   - `ongoing`, `sundayClasses`, `wednesdayClasses`, `orderOfWorship`,
     `kidsClosetNeeds` → update only the fields this week's sources actually
     speak to. Leave everything else as it already reads.
   - `archive` → prepend last week's `weekOf` value if it isn't already the
     first entry.
   - Leave `giving` and `prayer` alone unless the email is unmistakably
     asking for a specific, publishable change to them — these are
     policy-sensitive and default to untouched.
6. Update `src/content/bulletin-events.ts`:
   - New "Looking Ahead" events → append, following the existing `BulletinEvent`
     shape exactly (slug, title, start/end ISO with `-05:00` or `-06:00` per
     current CDT/CST, location, description, tag, ministrySlug where it
     fits, aliases for any shorthand the calendar might use for the same
     event).
   - An event already there whose details changed → update in place.
   - An event whose date is more than 14 days in the past → remove it
     (routine cleanup; it's already invisible on the site by then, this just
     keeps the file from growing forever).
   - Never remove an event just because this week's sources don't mention it
     again — absence isn't cancellation. Only remove past-dated ones (above)
     or ones the email explicitly says are cancelled (in which case, remove
     it and say so plainly in your summary, since there's no "cancelled"
     status on this type — it isn't a database row).
7. Fetch the diff you're about to make and sanity-check it: does every new
   or changed field trace back to something in `email.md` or the PDF? If
   you're inferring rather than reading, don't write it.
8. If, after all of this, there is no real change from what's already in
   both files (a re-run against the same week, for instance), do **not**
   open a PR. Say so in a run comment instead (see step 10) and stop.
9. Open the pull request:
   - Branch name: `bulletin/{today}` off the repository's actual default
     branch (`git symbolic-ref refs/remotes/origin/HEAD` or the
     `GITHUB_HEAD_REF`/default-branch context the Action provides — do not
     hardcode `main`, this repository's default branch has a different
     name).
   - Commit only `src/content/bulletin.ts` and
     `src/content/bulletin-events.ts`. Never commit `inbox/` or
     `content-drafts/` — both are gitignored on purpose (they carry the raw
     PDF and parsed draft, which hold exactly the information rule 4 keeps
     off the public site). If either was accidentally staged, unstage it
     before committing.
   - Write `runs/{today}-summary.md` (this one *is* committed — it never
     contains anything from rule 4, only descriptions like "1 item withheld
     — member-personal") covering: what changed and why, what you
     deliberately left out (rule 4 withholdings, ambiguous dates skipped),
     any email/PDF contradictions, and anything a human should double-check.
     Commit it in the same PR.
   - Push the branch and open the PR (`gh pr create`) with that summary as
     the PR body. Title: `Bulletin update — {weekOf}`.
10. If you stopped at step 8 (no real change), still leave a trace: comment
    on the most recent open "Bulletin update" PR if one exists, or just
    print a clear final message in the run log — no commit, no PR, no
    issue, since nothing is wrong.

## Hard rules

- Never push to the default branch directly. Every change is a PR.
- Never delete a `bulletin-events.ts` entry except the two cases in step 6
  (past-dated cleanup, or an explicit cancellation).
- Never write an event without an unambiguous date from the sources.
- Never write anything matching rule 4 into a file that reaches the PR diff.
- Copy tone: use the email's wording as-is or lightly cleaned — this is
  Central's own voice, not a rewrite exercise.
- On any failure (git, `gh`, or otherwise): stop, leave no half-finished
  branch or partial commit, and open a GitHub issue describing what failed.
  A stale site is fine; a wrong or broken site is not.
