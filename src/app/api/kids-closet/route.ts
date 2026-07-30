import { NextResponse } from "next/server";
import { formatSubmission, type Submission } from "@/lib/kids-closet-request";

/**
 * Kids Closet appointment requests.
 *
 * Posts here get formatted into an email to Lacey, who runs the closet. The
 * form is the only thing on the site that collects a scheduling request, so
 * the shape is fixed by KidsClosetForm.
 *
 * Delivery goes through Resend, which needs two environment variables:
 *
 *   RESEND_API_KEY   — from resend.com, after verifying arcentralchurch.org
 *   FORMS_FROM_EMAIL — the verified sender, e.g. website@arcentralchurch.org
 *
 * With those unset the request is logged and the caller is told to email
 * Lacey directly, so the form degrades to a clear instruction rather than a
 * silent failure. Nothing is ever dropped without saying so.
 */

const TO = "lacey@arcentralchurch.org";

function missing(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value !== "string" || value.trim() === "";
}

export async function POST(request: Request) {
  const form = await request.formData();

  const required = ["kc-name", "kc-phone", "kc-date", "kc-time", "kc-children"];
  const blank = required.filter((f) => missing(form, f));
  if (blank.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please fill in every required field." },
      { status: 400 },
    );
  }

  const str = (f: string) => String(form.get(f) ?? "").trim();
  const submission: Submission = {
    name: str("kc-name"),
    phone: str("kc-phone"),
    email: str("kc-email") || undefined,
    date: str("kc-date"),
    time: str("kc-time"),
    children: str("kc-children"),
    sizes: str("kc-sizes") || undefined,
    notes: str("kc-notes") || undefined,
  };

  const { subject, text } = formatSubmission(submission);
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      `Kids Closet form not delivered — RESEND_API_KEY / FORMS_FROM_EMAIL unset.\n${subject}\n${text}`,
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Our form isn't connected yet — please email ${TO} and we'll get you scheduled.`,
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
        // Replies go to the family, not to the website.
        reply_to: submission.email || undefined,
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
    console.error("Kids Closet form send failed:", err);
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
