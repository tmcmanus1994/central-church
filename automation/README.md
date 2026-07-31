# Weekly bulletin automation

Every Sunday morning, an agent reads that week's bulletin email and opens a
pull request updating `src/content/bulletin.ts` and
`src/content/bulletin-events.ts` — the files behind `/bulletin`, `/hub`,
`/events`, and the homepage spotlight. A human reviews and merges; nothing
reaches the live site without that review.

```
Sun ~6 AM CT   weekly-bulletin.yml   Gmail (IMAP) -> inbox/{date}/
                                      -> Claude reads AGENT.md
                                      -> opens a PR against bulletin.ts /
                                         bulletin-events.ts
                                      -> commits runs/{date}-summary.md
```

One workflow, one run, entirely on the Actions runner's disk — the raw
email and PDF (which carry named prayer requests, phone numbers, and giving
figures) are never committed to git or uploaded anywhere. Only the curated,
already-public-safe result reaches a PR.

## Files

- **`AGENT.md`** — the standing instructions Claude Code follows each run.
  This is the actual spec; read it before changing how the automation
  behaves.
- **`config.json`** — which sender/subject to match, and how many days back
  to search.
- **`ingest.py`** — logs into the dedicated automation Gmail mailbox via
  IMAP, finds this week's bulletin email, and writes it to `inbox/{date}/`
  (`email.md`, `bulletin.pdf`, `meta.json`). Exits nonzero if nothing
  matches, which the workflow turns into a GitHub issue.
- **`../scripts/import-bulletin.mjs`** — already existed before this
  automation (built for the manual bulletin process); the agent reuses it to
  parse the PDF and flag sensitive lines, rather than re-implementing PDF
  parsing.

## One-time setup

1. **Create a dedicated Gmail mailbox** for this — nothing else should ever
   use it. Turn on 2-Step Verification, then generate an App Password
   (Google Account -> Security -> App passwords). A regular password won't
   work with IMAP.
2. **Set up the forward**, in the account where Jessica's bulletin email
   currently arrives: Gmail Settings -> Filters and Blocked Addresses ->
   Create a new filter -> From `jessica@arcentralchurch.org`, Subject
   contains `Weekly Bulletin` -> Forward it to the new agent mailbox. Gmail
   will send a one-time confirmation code to the agent mailbox to verify the
   forwarding address.
3. **Add repo secrets** (Settings -> Secrets and variables -> Actions):

   | Secret | Value |
   |---|---|
   | `GMAIL_ADDRESS` | the dedicated agent mailbox's address |
   | `GMAIL_APP_PASSWORD` | the App Password from step 1 |
   | `ANTHROPIC_API_KEY` | from console.anthropic.com -> Settings -> API Keys. Bills pay-as-you-go against that Console account's balance (separate from any claude.ai subscription) — make sure it has credits/a payment method loaded. Alternative: `CLAUDE_CODE_OAUTH_TOKEN`, generated locally with `claude setup-token`, which bills against a Claude subscription instead — if you switch to that, update the workflow's `with:` block to use `claude_code_oauth_token` in place of `anthropic_api_key` |

Everything else — permissions, the cron schedule — is already set in
`.github/workflows/weekly-bulletin.yml`.

## What happens on a normal Sunday

1. `ingest.py` finds the email, saves it + the PDF to `inbox/{date}/`.
2. Claude reads `email.md` (source of truth), parses `bulletin.pdf` for
   supporting detail, and diffs both against the current content files.
3. Anything health/bereavement/shower/phone/personal-email/giving-related
   gets kept out of the public files and instead tracked in
   `withheldFromBulletin` (`bulletin-events.ts`) — same as the existing
   manual process already does.
4. If there's a real change, it opens a PR: `Bulletin update — {weekOf}`,
   with a summary of what changed, what was withheld, and anything
   ambiguous that needs a human's read. If nothing changed, no PR — no
   noise for a re-run.
5. You review the PR like any other change and merge it. That's what
   actually updates the live site — the agent never pushes to the default
   branch directly.

## When something goes wrong

- **No email found** -> a GitHub issue opens automatically; the run stops
  before touching anything. Re-run manually (Actions tab -> Weekly bulletin
  update -> Run workflow) once the email has arrived.
- **PDF won't parse** -> the run continues email-only; noted in the PR
  summary.
- **Email and PDF disagree on a fact** -> the email wins; the contradiction
  is noted in the PR summary so you can flag it to the office.
- **Anything else fails partway** (git, GitHub API, Claude itself) -> the
  agent is instructed to stop and open an issue rather than leave a
  half-finished branch or commit. A stale site is fine; a wrong one isn't.

## Rollout

This ships already in "review everything" mode by design — every run is a
PR, not a direct write, so there's no separate propose/apply flag to flip.
Once you're comfortable with a run of these PRs looking right, you could
have the agent auto-merge its own PRs after some number of clean weeks, but
that's a deliberate future change, not a default here.
