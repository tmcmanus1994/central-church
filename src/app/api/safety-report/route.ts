import { NextResponse } from "next/server";
import { formatSubmission, type Submission } from "@/lib/safety-report-request";

/**
 * Safe Team reports — grooming, abusive or pre-abusive behavior, or anything
 * that makes someone feel unsafe at Central.
 *
 * Goes straight to the Safe Team's dedicated inbox, not any general church
 * mailbox — this is deliberately its own route rather than reusing
 * plan-a-visit's or kids-closet's pattern of multiple staff recipients.
 * Reporting is allowed anonymously: `reporterName` and `reporterContact` are
 * both optional, everything else is required.
 *
 * Delivery goes through Resend, same as every other form on this site —
 * needs RESEND_API_KEY and FORMS_FROM_EMAIL. With those unset the request is
 * logged and the caller is told to email safety@arcentralchurch.org
 * directly, so the form degrades to a clear instruction rather than a
 * silent failure. Nothing is ever dropped without saying so — and least of
 * all a report like this one.
 */

const RECIPIENTS = ["safety@arcentralchurch.org"];
const FALLBACK_CONTACT = "safety@arcentralchurch.org";

function missing(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value !== "string" || value.trim() === "";
}

/**
 * The contact field accepts "email or phone" as free text, but Resend's
 * reply_to requires an actual email address — a phone number (or "Test",
 * as one real submission had it) makes Resend reject the whole request.
 * The contact info is already in the email body either way, so this is
 * purely about whether it's also usable as a reply-to.
 */
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const form = await request.formData();

  const required = ["safety-date-reporting", "safety-offender", "safety-date-offense", "safety-events"];
  const blank = required.filter((f) => missing(form, f));
  if (blank.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please fill in every required field." },
      { status: 400 },
    );
  }

  const str = (f: string) => String(form.get(f) ?? "").trim();
  const submission: Submission = {
    reporterName: str("safety-reporter-name") || undefined,
    reporterContact: str("safety-reporter-contact") || undefined,
    dateOfReporting: str("safety-date-reporting"),
    offender: str("safety-offender"),
    dateOfOffense: str("safety-date-offense"),
    eventsOfOffense: str("safety-events"),
  };

  const { subject, text } = formatSubmission(submission);
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      `Safety report not delivered — RESEND_API_KEY / FORMS_FROM_EMAIL unset.\n${subject}\n${text}`,
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Our form isn't connected yet — please email ${FALLBACK_CONTACT} directly so this reaches the Safe Team right away.`,
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: RECIPIENTS,
        // Replies go to the reporter, if they gave an actual email address —
        // a phone number is still in the body, just not usable as reply_to.
        reply_to:
          submission.reporterContact && isEmail(submission.reporterContact)
            ? submission.reporterContact
            : undefined,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      console.error(`Resend responded ${res.status}: ${await res.text()}`);
      return NextResponse.json(
        {
          ok: false,
          error: `Something went wrong sending that. Please email ${FALLBACK_CONTACT} directly so this doesn't get lost.`,
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Safety report send failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong sending that. Please email ${FALLBACK_CONTACT} directly so this doesn't get lost.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
