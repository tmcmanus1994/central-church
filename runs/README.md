# Weekly bulletin run summaries

One `{date}-summary.md` per week the automation actually changed something —
see `automation/AGENT.md` and `.github/workflows/weekly-bulletin.yml`. Each
summary is committed on the same PR branch as the content change it
describes, so it shows up in the PR diff for review.

These are safe to read: the agent is instructed to never write named health
details, showers, phone numbers, personal emails, or giving figures into a
summary — see rule 4 in `AGENT.md`. The raw email and PDF those summaries
are drawn from are never committed at all (`inbox/` is gitignored).
