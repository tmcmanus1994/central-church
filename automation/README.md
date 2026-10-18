# Weekly bulletin automation

Every Sunday morning, Claude reads that week's bulletin email and updates
`src/content/bulletin.ts` and `src/content/bulletin-events.ts` — the files
behind `/bulletin`, `/hub`, `/events`, and the homepage spotlight — then
pushes straight to the deploy branch once the build passes. There is no pull
request and no review step (Travelle's call, 2026-10-06).

```
Fri/Sat        Jessica emails the bulletin to Travelle's Gmail
               (jessica@arcentralchurch.org -> travelle18@gmail.com)

within 1 hr    Google Apps Script (in Travelle's Google account)
               -> saves the email body as HTML plus the PDF and flyer
                  images into the Drive folder "Central Bulletins",
                  named "YYYY-MM-DD <file>", and labels the email
                  `bulletin-saved` so it is never filed twice

Sun 5:54 AM CT Claude Code Routine "Weekly bulletin update"
               -> wakes the long-running Claude Code session that holds
                  this repo and the Google Drive connector
               -> runs the `weekly-bulletin` skill
                  (.claude/skills/weekly-bulletin/SKILL.md)
               -> edits the two content files, writes runs/{date}-summary.md
               -> npx tsc --noEmit && npm run build
               -> commits and pushes to the deploy branch
               -> Vercel deploys within about a minute
```

This replaced a GitHub Actions workflow (`weekly-bulletin.yml`, retired
2026-10-18) that pulled the email through the Gmail API with an OAuth
refresh token. Google kept revoking that token every few weeks — first for
an IMAP app password, then for OAuth — and each revocation cost a Sunday.
The current path has no credentials of its own: the Apps Script runs inside
Travelle's Google account, and Claude reads Drive through the connector he
already has attached.

## Files

- **`../.claude/skills/weekly-bulletin/SKILL.md`** — the standing
  instructions Claude follows each run. This is the actual spec: which Drive
  files to read, the content rules (what never gets published and goes to
  `withheldFromBulletin` instead), how to edit each field, and the
  build-then-push steps. Read it before changing how the automation behaves.
- **`../runs/`** — one summary per week that changed something, committed
  alongside the content change. Safe to read; never contains names, health
  details, or figures.
- **`../scripts/import-bulletin.mjs`** — the original manual PDF parser,
  still usable by hand (`npm run bulletin -- <pdf>`). The skill reads the PDF
  through the Drive connector instead and does not depend on it.

Nothing else lives in this folder anymore. The Apps Script is not in the
repo: it is in Travelle's Google account at script.google.com, with a
time-driven trigger.

## The Routine

Name: **Weekly bulletin update**. Schedule: Sundays 5:54 AM Central
(`CRON_TZ=America/Chicago 54 5 * * 0`). It fires into the existing Claude
Code session named "Central Church" (the one that built this site) because a
Routine created from a cloud session cannot carry the repo or connectors into
a fresh session. Consequences:

- Keep that session around. Deleting it orphans the Routine.
- There is no push or email notification when a run finishes; the report
  lands in that session. To get notifications, recreate the Routine from the
  Cowork desktop app with Google Drive and this repo attached, as a
  fresh-session Routine, using the same prompt.

To run a week by hand: in that session, say "run this week's bulletin
update", or in Claude Code on the repo run `/weekly-bulletin`.

## When something goes wrong

- **No file for this week in "Central Bulletins"** -> the run changes nothing
  and says so. Check that Jessica sent the email, that it reached
  travelle18@gmail.com, and that the Apps Script trigger is still enabled
  (script.google.com -> Triggers). Once the files appear, run it by hand.
- **Build fails** -> nothing is pushed; the site stays on last week. The
  report says what broke; fix and re-run.
- **Email and PDF disagree on a fact** -> the email wins and the summary notes
  the contradiction so it can be flagged to the office.
- **A week publishes something that needs correcting** -> it's a manual
  content fix after the fact, same as any other edit to the content files.
  To bring back a review step, change the skill's step 10 to stop before the
  push and say so.
