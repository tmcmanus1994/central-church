"use client";

import { CheckboxField, SelectField, TextArea, TextField } from "./Field";
import { useFormPost } from "@/lib/use-form-post";

/**
 * "Let us know you're coming." Posts to /api/plan-a-visit, which emails the
 * office (Travelle's address while the form is being tested) through Resend.
 * This is also the site's general contact fallback — every "Contact" button
 * with no specific staff member to reach links to #contact on this page.
 */
export function VisitForm() {
  const { status, errorMessage, onSubmit } = useFormPost("/api/plan-a-visit");

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[18px] bg-white p-8 lg:p-9">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-tint text-2xl">
          ✓
        </span>
        <h3 className="m-0 font-display text-[22px] tracking-[-.02em] text-ink">
          We&rsquo;ll be looking for you
        </h3>
        <p className="m-0 text-[15.5px] leading-[1.6] text-body">
          Thanks for letting us know you&rsquo;re coming — someone from our
          team will be in touch before Sunday.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-5 rounded-[18px] bg-white p-5 lg:grid-cols-2 lg:p-9"
      action="/api/plan-a-visit"
      method="post"
      onSubmit={onSubmit}
    >
      <TextField id="first-name" label="First name" autoComplete="given-name" />
      <TextField id="last-name" label="Last name" autoComplete="family-name" />
      <TextField id="email" label="Email" type="email" autoComplete="email" />
      <TextField
        id="phone"
        label="Phone"
        type="tel"
        optional
        autoComplete="tel"
      />
      <div className="lg:col-span-2">
        <SelectField
          id="service"
          label="Which service are you planning to attend?"
          options={[
            "Sunday Worship · 10:15 AM",
            "Sunday Bible Classes · 9:15 AM",
            "Adoración en Español · 1:00 PM",
            "Wednesday Classes · 6:30 PM",
          ]}
        />
      </div>
      <div className="lg:col-span-2">
        <CheckboxField id="has-kids" label="We're bringing kids with us" />
      </div>
      <div className="lg:col-span-2">
        <TextArea
          id="notes"
          label="Anything we should know? Kids' ages, questions, needs"
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
        {status === "submitting" ? "Sending…" : "We’ll be looking for you"}
      </button>
    </form>
  );
}
