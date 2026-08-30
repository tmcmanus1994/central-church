#!/usr/bin/env python3
"""
Fetches this week's bulletin email from the dedicated automation mailbox
and lays it out under inbox/{date}/ for the agent step that follows in the
same workflow run.

    GMAIL_OAUTH_CLIENT_ID=... GMAIL_OAUTH_CLIENT_SECRET=... \
    GMAIL_OAUTH_REFRESH_TOKEN=... python automation/ingest.py

Uses the Gmail API with an OAuth refresh token, not IMAP + an app
password — a static password logging in from a different GitHub Actions
runner (different cloud region, basically every run) is exactly the
pattern Google's account-safety system treats as suspicious, and it kept
silently revoking the app password every few weeks. OAuth doesn't hit
that trip-wire: it's a registered app with a scoped, revocable grant, not
an unfamiliar-looking login. See automation/get_refresh_token.py for the
one-time setup that produces the refresh token above.

inbox/ is gitignored and never committed — the PDF and email both carry
things that don't belong in git history (named prayer requests, giving
figures, phone numbers). It only exists on the runner's disk for the
lifetime of this workflow run.

Exits nonzero when no matching email is found, so the workflow's next step
can open an alert issue and skip the agent run cleanly.
"""

import base64
import email
import email.utils
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

import html2text
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "automation" / "config.json").read_text())
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# A manual "Fwd:" forward (like the test email) quotes the original message
# under a line like "---------- Forwarded message ---------" followed by
# From/Date/Subject/To header lines. A real Gmail *filter* forward carries
# the original headers untouched and has none of this — strip it when
# present, leave the body alone when it isn't.
#
# Line-based rather than one regex: html2text escapes the leading dashes
# (`\----------`) and wraps names in `**bold**`, so matching the whole block
# in one pattern is brittle against its exact output.
FORWARD_MARKER_LINE = re.compile(r"^\\?-+\s*Forwarded message\s*-+\s*$", re.IGNORECASE)
FORWARD_HEADER_LINE = re.compile(r"^(?:\*\*)?(From|Date|Subject|To|Cc)(?:\*\*)?\s*:", re.IGNORECASE)


def html_to_markdown(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0
    return h.handle(html)


def strip_forward_boilerplate(markdown: str) -> str:
    lines = markdown.split("\n")

    marker_idx = next(
        (i for i, line in enumerate(lines) if FORWARD_MARKER_LINE.match(line.strip())),
        None,
    )
    if marker_idx is None:
        return markdown.strip()

    i = marker_idx + 1
    saw_header = False
    while i < len(lines):
        stripped = lines[i].strip()
        if stripped == "":
            i += 1
            continue
        if FORWARD_HEADER_LINE.match(stripped):
            saw_header = True
            i += 1
            continue
        break

    if not saw_header:
        # Didn't find the header block we expected right after the marker —
        # be conservative and only drop the marker line itself.
        return "\n".join(lines[:marker_idx] + lines[marker_idx + 1 :]).strip()

    return "\n".join(lines[i:]).strip()


def find_bulletin_pdf(msg) -> tuple[str, bytes] | None:
    """The bulletin PDF specifically — not flyer images also on the email."""
    pdfs = []
    for part in msg.walk():
        filename = part.get_filename()
        if not filename:
            continue
        is_pdf = (
            part.get_content_type() == "application/pdf"
            or filename.lower().endswith(".pdf")
        )
        if is_pdf:
            pdfs.append((filename, part.get_payload(decode=True)))
    if not pdfs:
        return None
    # Prefer a filename that actually says "bulletin" if more than one PDF
    # somehow made it onto the email.
    for filename, data in pdfs:
        if "bulletin" in filename.lower():
            return filename, data
    return pdfs[0]


def get_body_markdown(msg) -> str:
    html_part = None
    text_part = None
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            disposition = str(part.get("Content-Disposition") or "")
            if "attachment" in disposition:
                continue
            if content_type == "text/html" and html_part is None:
                html_part = part
            elif content_type == "text/plain" and text_part is None:
                text_part = part
    else:
        if msg.get_content_type() == "text/html":
            html_part = msg
        else:
            text_part = msg

    if html_part is not None:
        charset = html_part.get_content_charset() or "utf-8"
        html = html_part.get_payload(decode=True).decode(charset, errors="replace")
        markdown = html_to_markdown(html)
    elif text_part is not None:
        charset = text_part.get_content_charset() or "utf-8"
        markdown = text_part.get_payload(decode=True).decode(charset, errors="replace")
    else:
        markdown = ""

    return strip_forward_boilerplate(markdown)


def gmail_service():
    creds = Credentials(
        token=None,
        refresh_token=os.environ["GMAIL_OAUTH_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["GMAIL_OAUTH_CLIENT_ID"],
        client_secret=os.environ["GMAIL_OAUTH_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    return build("gmail", "v1", credentials=creds, cache_discovery=False)


def main() -> int:
    service = gmail_service()

    # Gmail's own search operators, not IMAP's — `subject:"..."` phrase-
    # matches (catching both a clean forward, "Weekly Bulletin 07.26.26",
    # and a manual one, "Fwd: Weekly Bulletin 07.26.26") and `newer_than:Nd`
    # covers the lookback window.
    query = f'subject:"{CONFIG["subject_contains"]}" newer_than:{CONFIG["lookback_days"]}d'
    resp = service.users().messages().list(userId="me", q=query).execute()
    refs = resp.get("messages", [])
    if not refs:
        print(f"No email matched {query!r} in the last {CONFIG['lookback_days']} days.")
        return 1

    # format="raw" hands back the same RFC822 bytes IMAP used to — reusing
    # email.message_from_bytes here means every parsing helper below
    # (forward-stripping, PDF-finding) works unchanged from the IMAP days.
    messages = []
    for ref in refs:
        raw = service.users().messages().get(userId="me", id=ref["id"], format="raw").execute()
        # Gmail's base64url isn't always padded to a multiple of 4, which
        # Python's decoder insists on — pad it out rather than risk a
        # "Incorrect padding" error on some messages and not others.
        raw_data = raw["raw"]
        raw_data += "=" * (-len(raw_data) % 4)
        msg_bytes = base64.urlsafe_b64decode(raw_data)
        msg = email.message_from_bytes(msg_bytes)
        date = email.utils.parsedate_to_datetime(msg["Date"])
        messages.append((date, msg))

    if not messages:
        print("Matched message IDs but couldn't fetch any of them.")
        return 1

    messages.sort(key=lambda pair: pair[0])
    newest_date, newest_msg = messages[-1]

    # A missing PDF isn't fatal — AGENT.md already treats the email as THE
    # source of truth and the PDF as supporting detail only, so a bulletin
    # week that arrives email-only should still get processed, not block
    # the whole run the way it used to.
    pdf = find_bulletin_pdf(newest_msg)
    pdf_filename, pdf_bytes = pdf if pdf is not None else (None, None)
    if pdf is None:
        print(f"Found the email (subject: {newest_msg['Subject']!r}) with no PDF attachment — proceeding email-only.")

    out_dir = ROOT / "inbox" / datetime.now().strftime("%Y-%m-%d")
    out_dir.mkdir(parents=True, exist_ok=True)

    (out_dir / "email.md").write_text(get_body_markdown(newest_msg), encoding="utf-8")
    if pdf_bytes is not None:
        (out_dir / "bulletin.pdf").write_bytes(pdf_bytes)
    (out_dir / "meta.json").write_text(
        json.dumps(
            {
                "from": newest_msg["From"],
                "subject": newest_msg["Subject"],
                "date": newest_date.isoformat(),
                "original_pdf_filename": pdf_filename,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Saved {out_dir.relative_to(ROOT)} from {newest_msg['From']!r}, subject {newest_msg['Subject']!r}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
