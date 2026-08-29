#!/usr/bin/env python3
"""
One-time setup helper — run this on your own machine, not in CI, to mint
the refresh token the weekly bulletin automation uses to read the
automation mailbox via the Gmail API.

    pip install google-auth-oauthlib
    python automation/get_refresh_token.py path/to/client_secret.json

Opens a browser. Sign in AS THE AUTOMATION MAILBOX (not your personal
account) and click Allow on the read-only Gmail access prompt. Prints
three values to save as GitHub repo secrets — Settings -> Secrets and
variables -> Actions:

    GMAIL_OAUTH_CLIENT_ID
    GMAIL_OAUTH_CLIENT_SECRET
    GMAIL_OAUTH_REFRESH_TOKEN

Run this exactly once. The refresh token doesn't expire from use — only
if it's revoked (Google Account -> Security -> Third-party access) or
goes completely unused for 6 months.
"""

import json
import sys

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python automation/get_refresh_token.py path/to/client_secret.json")
        return 1

    client_secret_path = sys.argv[1]
    flow = InstalledAppFlow.from_client_secrets_file(client_secret_path, SCOPES)
    creds = flow.run_local_server(port=0)

    if not creds.refresh_token:
        # Happens if this exact client/account already granted consent
        # once before without a refresh token being issued again — Google
        # only issues one on the *first* consent. Revoke prior access at
        # myaccount.google.com/permissions for this app and re-run.
        print(
            "No refresh token came back. If you've run this before for the "
            "same app, revoke its access at myaccount.google.com/permissions "
            "and run this again."
        )
        return 1

    with open(client_secret_path) as f:
        client_config = json.load(f)
    client_info = client_config.get("installed") or client_config.get("web")

    print("\nSave these as GitHub repo secrets (Settings -> Secrets and variables -> Actions):\n")
    print(f"GMAIL_OAUTH_CLIENT_ID={client_info['client_id']}")
    print(f"GMAIL_OAUTH_CLIENT_SECRET={client_info['client_secret']}")
    print(f"GMAIL_OAUTH_REFRESH_TOKEN={creds.refresh_token}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
