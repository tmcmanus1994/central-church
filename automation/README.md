# Weekly bulletin automation

Every Sunday morning, an agent reads that week's bulletin email and opens a
pull request updating `src/content/bulletin.ts` and
`src/content/bulletin-events.ts` — the files behind `/bulletin`, `/hub`,
`/events`, and the homepage spotlight. A human reviews and merges; nothing
reaches the live site without that review.

```
Sun ~6 AM CT   weekly-bulletin.yml   Gmail (API, OAuth) -> inbox/{date}/
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
- **`ingest.py`** — reads the dedicated automation Gmail mailbox via the
  Gmail API (OAuth, not IMAP), finds this week's bulletin email, and writes
  it to `inbox/{date}/` (`email.md`, `bulletin.pdf`, `meta.json`). Exits
  nonzero if nothing matches, which the workflow turns into a GitHub issue.
- **`get_refresh_token.py`** — one-time, run locally (not in CI) to mint the
  OAuth refresh token `ingest.py` needs. See "One-time setup" below.
- **`../scripts/import-bulletin.mjs`** — already existed before this
  automation (built for the manual bulletin process); the agent reuses it to
  parse the PDF and flag sensitive lines, rather than re-implementing PDF
  parsing.

## One-time setup

1. **Create a dedicated Gmail mailbox** for this, if one doesn't already
   exist — nothing else should ever use it.
2. **Set up the forward**, in the account where Jessica's bulletin email
   currently arrives: Gmail Settings -> Filters and Blocked Addresses ->
   Create a new filter -> From `jessica@arcentralchurch.org`, Subject
   contains `Weekly Bulletin` -> Forward it to the dedicated mailbox. Gmail
   will send a one-time confirmation code to that mailbox to verify the
   forwarding address.
3. **Create a Google Cloud project and OAuth credentials** — this can be
   done from any Google account, it doesn't have to be the dedicated
   mailbox:
   - console.cloud.google.com -> create a new project (any name, e.g.
     "Central Bulletin Automation").
   - APIs & Services -> Library -> search "Gmail API" -> Enable.
   - APIs & Services -> OAuth consent screen -> User type **External** ->
     fill in an app name and your own email for support/developer contact.
     Add scope `https://www.googleapis.com/auth/gmail.readonly`. Under
     **Test users**, add the dedicated mailbox's address — the app stays in
     "Testing" mode (no Google verification review needed) since it's only
     ever used by that one address.
   - APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
     -> Application type **Desktop app** -> Create, then **Download JSON**.
4. **Run the one-time consent flow locally** (not in CI — this step needs a
   real browser and a human to click Allow):
   ```
   pip install google-auth-oauthlib
   python automation/get_refresh_token.py path/to/the/downloaded.json
   ```
   A browser opens. Sign in **as the dedicated mailbox**, not your personal
   account, and allow read-only Gmail access. The script prints three
   values.
5. **Add repo secrets** (Settings -> Secrets and variables -> Actions) with
   those three printed values, plus the existing Claude token:

   | Secret | Value |
   |---|---|
   | `GMAIL_OAUTH_CLIENT_ID` | printed by `get_refresh_token.py` |
   | `GMAIL_OAUTH_CLIENT_SECRET` | printed by `get_refresh_token.py` |
   | `GMAIL_OAUTH_REFRESH_TOKEN` | printed by `get_refresh_token.py` |
   | `CLAUDE_CODE_OAUTH_TOKEN` | generate locally with `claude setup-token` — bills against the existing Claude subscription, no separate balance to fund. Alternative: an `ANTHROPIC_API_KEY` from console.anthropic.com instead, which bills pay-as-you-go against that Console account's own balance — if you switch to that, update the workflow's `with:` block to use `anthropic_api_key` in place of `claude_code_oauth_token` |

Everything else — permissions, the cron schedule — is already set in
`.github/workflows/weekly-bulletin.yml`.

This replaced an earlier IMAP + App Password setup, which Google's
account-safety system kept silently flagging: a static password logging in
from a different GitHub-assigned cloud region on basically every run reads
as suspicious, especially against a low-activity, single-purpose mailbox
with no other usage pattern to offset it. OAuth doesn't hit that trip-wire
— it's a registered app with a scoped, revocable grant, not an
unfamiliar-looking login attempt.

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

- **No email found, or the OAuth token stopped working** -> a GitHub issue
  opens automatically; the run stops before touching anything. Check the
  ingest step's log — an auth error means the refresh token was revoked
  (Google Account -> Security -> Third-party access for the dedicated
  mailbox) and needs `get_refresh_token.py` re-run to mint a new one. A
  plain "no email matched" means Jessica's email hasn't arrived yet. Either
  way, re-run manually once fixed (Actions tab -> Weekly bulletin update ->
  Run workflow).
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
