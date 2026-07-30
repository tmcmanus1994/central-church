import { NextResponse } from "next/server";
import { formatSubmission, type Submission } from "@/lib/visit-request";

/**
 * "Plan a Visit" submissions — also the site's general contact fallback,
 * linked from every "Contact" button that has no specific staff member to
 * reach (an elder, or a page where the right person isn't obvious).
 *
 * Delivery goes through Resend, same as the Kids Closet form:
 *
 *   RESEND_API_KEY   — from resend.com, after verifying arcentralchurch.org
 *   FORMS_FROM_EMAIL — the verified sender, e.g. website@arcentralchurch.org
 *
 * With those unset the request is logged and the caller is told to email
 * TO directly, so the form degrades to a clear instruction rather than a
 * silent failure.
 *
 * TO is Travelle's address for now, while the form is being tested — swap
 * it for the office's or a distribution address once it's live.
 */

const TO = "travelle@arcentralchurch.org";

function missing(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value !== "string" || value.trim() === "";
}

export async function POST(request: Request) {
  const form = await request.formData();

  const required = ["first-name", "last-name", "email"];
  const blank = required.filter((f) => missing(form, f));
  if (blank.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name and email." },
      { status: 400 },
    );
  }

  const str = (f: string) => String(form.get(f) ?? "").trim();
  const submission: Submission = {
    firstName: str("first-name"),
    lastName: str("last-name"),
    email: str("email"),
    phone: str("phone") || undefined,
    service: str("service") || undefined,
    notes: str("notes") || undefined,
  };

  const { subject, text } = formatSubmission(submission);
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      `Plan a Visit form not delivered — RESEND_API_KEY / FORMS_FROM_EMAIL unset.\n${subject}\n${text}`,
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Our form isn't connected yet — please email ${TO} directly and we'll be looking for you.`,
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
        to: [TO],
        // Replies go to the visitor, not to the website.
        reply_to: submission.email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      console.error(`Resend responded ${res.status}: ${await res.text()}`);
      return NextResponse.json(
        {
          ok: false,
          error: `Something went wrong sending that. Please email ${TO} directly.`,
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Plan a Visit form send failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong sending that. Please email ${TO} directly.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
