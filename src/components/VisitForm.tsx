import { SelectField, TextArea, TextField } from "./Field";

/**
 * "Let us know you're coming." Submission wiring (form backend or church
 * automation endpoint) lands in a follow-up; markup, validation attributes,
 * and focus states are final.
 */
export function VisitForm() {
  return (
    <form
      className="grid grid-cols-1 gap-5 rounded-[18px] bg-white p-5 lg:grid-cols-2 lg:p-9"
      action="#"
      method="post"
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
            "Adoración en Español · 1:30 PM",
            "Wednesday Classes · 6:30 PM",
          ]}
        />
      </div>
      <div className="lg:col-span-2">
        <TextArea
          id="notes"
          label="Anything we should know? Kids' ages, questions, needs"
        />
      </div>
      <button
        type="submit"
        className="flex h-14 items-center justify-center rounded-full bg-primary text-base font-bold text-white transition-colors hover:bg-primary-deep lg:col-span-2"
      >
        We&rsquo;ll be looking for you
      </button>
    </form>
  );
}
