#!/usr/bin/env python3
"""
Fetches this week's bulletin email from the dedicated automation mailbox
and lays it out under inbox/{date}/ for the agent step that follows in the
same workflow run.

    GMAIL_ADDRESS=... GMAIL_APP_PASSWORD=... python automation/ingest.py

inbox/ is gitignored and never committed — the PDF and email both carry
things that don't belong in git history (named prayer requests, giving
figures, phone numbers). It only exists on the runner's disk for the
lifetime of this workflow run.

Exits nonzero when no matching email is found, so the workflow's next step
can open an alert issue and skip the agent run cleanly.
"""

import email
import email.utils
import imaplib
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import html2text

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "automation" / "config.json").read_text())

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


def main() -> int:
    gmail_address = os.environ["GMAIL_ADDRESS"]
    gmail_password = os.environ["GMAIL_APP_PASSWORD"]

    imap = imaplib.IMAP4_SSL("imap.gmail.com")
    imap.login(gmail_address, gmail_password)
    imap.select("INBOX")

    since = (datetime.now(timezone.utc) - timedelta(days=CONFIG["lookback_days"]))
    since_str = since.strftime("%d-%b-%Y")
    # SUBJECT search is a substring match, so this catches both a clean
    # forward ("Weekly Bulletin 07.26.26") and a manual one
    # ("Fwd: Weekly Bulletin 07.26.26").
    criteria = f'(SINCE "{since_str}" SUBJECT "{CONFIG["subject_contains"]}")'
    status, data = imap.search(None, criteria)
    if status != "OK" or not data or not data[0]:
        print(f"No email matched {criteria!r} in the last {CONFIG['lookback_days']} days.")
        return 1

    ids = data[0].split()
    messages = []
    for msg_id in ids:
        status, msg_data = imap.fetch(msg_id, "(RFC822)")
        if status != "OK":
            continue
        msg = email.message_from_bytes(msg_data[0][1])
        date = email.utils.parsedate_to_datetime(msg["Date"])
        messages.append((date, msg))

    if not messages:
        print("Matched message IDs but couldn't fetch any of them.")
        return 1

    messages.sort(key=lambda pair: pair[0])
    newest_date, newest_msg = messages[-1]

    pdf = find_bulletin_pdf(newest_msg)
    if pdf is None:
        print(f"Found the email (subject: {newest_msg['Subject']!r}) but it has no PDF attachment.")
        return 1
    pdf_filename, pdf_bytes = pdf

    out_dir = ROOT / "inbox" / datetime.now().strftime("%Y-%m-%d")
    out_dir.mkdir(parents=True, exist_ok=True)

    (out_dir / "email.md").write_text(get_body_markdown(newest_msg), encoding="utf-8")
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
    imap.logout()
    return 0


if __name__ == "__main__":
    sys.exit(main())
