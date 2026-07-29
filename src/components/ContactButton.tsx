import { staffByName } from "@/content/people";
import { Button } from "./Button";
import { ArrowLink } from "./Button";

/**
 * A contact button for a named staff member, wherever they're mentioned.
 *
 * Every ministry page, event, and announcement names the person to ask, and
 * until now all of them pointed at the general contact form — which means
 * someone with a question for Tammy had to describe who they wanted. This
 * resolves the name to a real mailbox instead.
 *
 * An unknown name (an elder, a volunteer, someone who's left) falls back to
 * the contact form rather than rendering nothing, so the path to a human never
 * disappears.
 */
export function ContactButton({
  name,
  label,
  full = false,
  variant = "primary",
  subject,
}: {
  name: string;
  label?: string;
  full?: boolean;
  variant?: "primary" | "outline" | "neutral";
  /** Pre-fills the email subject — the event or ministry being asked about. */
  subject?: string;
}) {
  const person = staffByName(name);
  const first = name.split(" ")[0];
  const text = label ?? `Contact ${first}`;

  if (!person?.email) {
    return (
      <Button href="/plan-a-visit#contact" variant={variant} full={full}>
        {text}
      </Button>
    );
  }

  const href = subject
    ? `mailto:${person.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${person.email}`;

  return (
    <Button href={href} variant={variant} full={full}>
      {text}
    </Button>
  );
}

/** The same resolution as an inline link, for tighter spots. */
export function ContactLink({
  name,
  label,
  className,
}: {
  name: string;
  label?: string;
  className?: string;
}) {
  const person = staffByName(name);
  const first = name.split(" ")[0];
  return (
    <ArrowLink
      href={person?.email ? `mailto:${person.email}` : "/plan-a-visit#contact"}
      className={className}
    >
      {label ?? `Email ${first}`}
    </ArrowLink>
  );
}

/**
 * A staff name rendered inline as a mailto link — for prose that already reads
 * "Contact Shannon Cooper." Names that aren't staff (volunteers, group
 * leaders) stay plain text rather than becoming a misleading link.
 */
export function StaffMention({ name }: { name: string }) {
  const person = staffByName(name);
  if (!person?.email) return <>{name}</>;
  return (
    <a
      href={`mailto:${person.email}`}
      className="font-semibold text-primary no-underline hover:text-primary-deep"
    >
      {name}
    </a>
  );
}
