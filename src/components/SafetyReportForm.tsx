"use client";

import { TextArea, TextField } from "./Field";
import { useFormPost } from "@/lib/use-form-post";
import { site } from "@/lib/site";

/**
 * A report to the Safe Team — grooming, abusive or pre-abusive behavior, or
 * anything that made someone feel unsafe. Reporting by name is optional on
 * purpose: some people will only come forward if they don't have to give
 * theirs, especially for something like this.
 *
 * Submissions POST to /api/safety-report, which emails the Safe Team
 * directly. That route needs RESEND_API_KEY and FORMS_FROM_EMAIL set;
 * without them it returns a message telling the reporter to email
 * safety@arcentralchurch.org directly rather than failing silently.
 */
export function SafetyReportForm() {
  const { status, errorMessage, onSubmit } = useFormPost("/api/safety-report");
  const today = new Date().toISOString().slice(0, 10);

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[18px] bg-white p-8 lg:p-9">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-tint text-2xl">
          ✓
        </span>
        <h2 className="m-0 font-display text-[22px] tracking-[-.02em]">
          Thank you for telling us
        </h2>
        <p className="m-0 text-[15.5px] leading-[1.6] text-body">
          The Safe Team has your report and will follow up if you gave a way
          to reach you. We don&rsquo;t take this lightly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-white p-5 lg:p-9">
      <span className="text-[11px] font-bold tracking-[.16em] uppercase text-primary">
        Report to the Safe Team
      </span>
      <h2 className="mt-2 mb-2 font-display text-[26px] tracking-[-.025em] lg:text-[32px]">
        Tell us what happened
      </h2>
      <p className="m-0 mb-6 max-w-[640px] text-[15.5px] leading-[1.6] text-body lg:text-base">
        Every field below except your name and how to reach you is required.
        You&rsquo;re welcome to report anonymously — but if you&rsquo;d like us
        to follow up with you, leave a way to reach you.
      </p>

      <form
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        action="/api/safety-report"
        method="post"
        onSubmit={onSubmit}
      >
        <TextField
          id="safety-date-reporting"
          label="Date of reporting"
          type="date"
          defaultValue={today}
        />
        <TextField
          id="safety-date-offense"
          label="Date of offense"
          autoComplete="off"
        />
        <TextField
          id="safety-reporter-name"
          label="Person(s) reporting"
          optional
          autoComplete="name"
        />
        <TextField
          id="safety-reporter-contact"
          label="Your email or phone, if you'd like us to follow up"
          optional
          autoComplete="email"
        />
        <div className="lg:col-span-2">
          <TextField id="safety-offender" label="Who is this about?" />
        </div>
        <div className="lg:col-span-2">
          <TextArea
            id="safety-events"
            label="What happened — everything you can tell us"
            optional={false}
          />
        </div>
        {status === "error" && errorMessage ? (
          <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14.5px] text-red-700 lg:col-span-2">
            {errorMessage}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex h-14 items-center justify-center rounded-full bg-primary text-base font-bold text-white transition-colors hover:bg-primary-deep disabled:opacity-60 lg:col-span-2"
        >
          {status === "submitting" ? "Sending…" : "Send report"}
        </button>
      </form>

      <p className="m-0 mt-5 text-[14.5px] leading-[1.6] text-muted">
        Would rather write it in your own words? Email{" "}
        <a
          href={`mailto:${site.safetyEmail}`}
          className="font-semibold text-primary no-underline hover:text-primary-deep"
        >
          {site.safetyEmail}
        </a>{" "}
        directly instead — either way reaches the same team.
      </p>
    </div>
  );
}
