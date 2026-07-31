import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
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
 * FALLBACK_CONTACT directly, so the form degrades to a clear instruction
 * rather than a silent failure.
 *
 * Goes to Shannon and Steven always; if the visitor checked "bringing kids",
 * Tammy (Children's Minister) is added so she knows to expect a family.
 * Exception: picking the Spanish service routes to Matt Thomas alone — he
 * leads that service and is the one who'll actually follow up, so Shannon
 * and Steven don't need to be copied.
 *
 * Every submission is also saved to Supabase (`visit_requests`) when
 * NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are set — see
 * supabase/schema.sql. That save is best-effort: a Supabase failure is
 * logged but never blocks the email, which is the path that actually gets
 * a human to respond.
 */

const RECIPIENTS = ["shannon@arcentralchurch.org", "steven@arcentralchurch.org"];
const KIDS_RECIPIENT = "tammy@arcentralchurch.org";
const IGLESIA_SERVICE = "Adoración en Español · 1:30 PM";
const IGLESIA_RECIPIENT = "matt@arcentralchurch.org";
const FALLBACK_CONTACT = "office@arcentralchurch.org";

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
    hasKids: form.get("has-kids") === "yes",
    notes: str("notes") || undefined,
  };
  const recipients =
    submission.service === IGLESIA_SERVICE
      ? [IGLESIA_RECIPIENT]
      : submission.hasKids
        ? [...RECIPIENTS, KIDS_RECIPIENT]
        : RECIPIENTS;

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from("visit_requests").insert({
      first_name: submission.firstName,
      last_name: submission.lastName,
      email: submission.email,
      phone: submission.phone ?? null,
      service: submission.service ?? null,
      has_kids: submission.hasKids ?? false,
      notes: submission.notes ?? null,
    });
    if (error) console.error("visit_requests insert failed:", error.message);
  }

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
        error: `Our form isn't connected yet — please email ${FALLBACK_CONTACT} directly and we'll be looking for you.`,
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
        to: recipients,
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
          error: `Something went wrong sending that. Please email ${FALLBACK_CONTACT} directly.`,
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Plan a Visit form send failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong sending that. Please email ${FALLBACK_CONTACT} directly.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
