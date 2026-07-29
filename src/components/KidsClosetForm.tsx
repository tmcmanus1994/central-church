import { SelectField, TextArea, TextField } from "./Field";
import { ContactLink } from "./ContactButton";

/**
 * Booking a Friday slot at Kids Closet.
 *
 * Every "schedule a time" button on the Kids Closet page lands here rather
 * than on the general contact form, because what Lacey needs to know is
 * specific — which Friday, how many children, and what sizes to have out.
 *
 * Submission wiring is shared with the visit form and still open; the fields,
 * validation, and focus states are final. Until an endpoint exists the email
 * link below is a working path, so nobody hits a dead end.
 */
export function KidsClosetForm() {
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
        action="#"
        method="post"
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
        <button
          type="submit"
          className="flex h-14 items-center justify-center rounded-full bg-primary text-base font-bold text-white transition-colors hover:bg-primary-deep lg:col-span-2"
        >
          Request this time
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
