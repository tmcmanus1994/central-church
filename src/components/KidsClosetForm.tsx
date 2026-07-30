"use client";

import { SelectField, TextArea, TextField } from "./Field";
import { ContactLink } from "./ContactButton";
import { useFormPost } from "@/lib/use-form-post";

/**
 * Booking a Friday slot at Kids Closet.
 *
 * Every "schedule a time" button on the Kids Closet page lands here rather
 * than on the general contact form, because what Lacey needs to know is
 * specific — which Friday, how many children, and what sizes to have out.
 *
 * Submissions POST to /api/kids-closet, which emails Lacey. That route needs
 * RESEND_API_KEY and FORMS_FROM_EMAIL set; without them it returns a message
 * telling the visitor to email her directly rather than failing silently. The
 * email link at the bottom is the same path, always available.
 */
export function KidsClosetForm() {
  const { status, errorMessage, onSubmit } = useFormPost("/api/kids-closet");

  if (status === "success") {
    return (
      <section
        id="schedule"
        className="scroll-mt-24 flex flex-col items-start gap-3 rounded-[18px] border border-line bg-surface p-8 lg:p-9"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-tint text-2xl">
          ✓
        </span>
        <h2 className="m-0 font-display text-[22px] tracking-[-.02em]">
          We&rsquo;ll see you then
        </h2>
        <p className="m-0 text-[15.5px] leading-[1.6] text-body">
          Thanks — Lacey has your request and we&rsquo;ll have things ready
          for you.
        </p>
      </section>
    );
  }

  return (
    <section
      id="schedule"
      className="scroll-mt-24 rounded-[18px] border border-line bg-surface p-5 lg:p-9"
    >
      <span className="text-[11px] font-bold tracking-[.16em] uppercase text-primary">
        Book a time
      </span>
      <h2 className="mt-2 mb-2 font-display text-[26px] tracking-[-.025em] lg:text-[32px]">
        Schedule a Friday at Kids Closet
      </h2>
      <p className="m-0 mb-6 max-w-[640px] text-[15.5px] leading-[1.6] text-body lg:text-base">
        Tell us when you&rsquo;d like to come and who you&rsquo;re shopping for,
        and we&rsquo;ll have things ready. Everything is free, there&rsquo;s no
        paperwork, and you don&rsquo;t need to be a member.
      </p>

      <form
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        action="/api/kids-closet"
        method="post"
        onSubmit={onSubmit}
      >
        <TextField
          id="kc-name"
          label="Your name"
          autoComplete="name"
        />
        <TextField
          id="kc-phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
        />
        <TextField
          id="kc-email"
          label="Email"
          type="email"
          optional
          autoComplete="email"
        />
        <TextField id="kc-date" label="Which Friday works?" type="date" />
        <div className="lg:col-span-2">
          <SelectField
            id="kc-time"
            label="What time?"
            options={["9:00 – 9:30 AM", "9:30 – 10:00 AM", "10:00 – 10:30 AM", "10:30 – 11:00 AM"]}
          />
        </div>
        <TextField
          id="kc-children"
          label="How many children?"
          type="number"
        />
        <TextField
          id="kc-sizes"
          label="Ages and sizes"
          optional
        />
        <div className="lg:col-span-2">
          <TextArea
            id="kc-notes"
            label="Anything specific you're looking for? Diapers, shoes, school clothes"
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
          {status === "submitting" ? "Sending…" : "Request this time"}
        </button>
      </form>

      <p className="m-0 mt-5 text-[14.5px] leading-[1.6] text-muted">
        Prefer to ask a person? Lacey Hines runs Kids Closet and is happy to
        sort out a time with you directly.
      </p>
      <div className="mt-1.5">
        <ContactLink name="Lacey Hines" label="Email Lacey" />
      </div>
    </section>
  );
}
