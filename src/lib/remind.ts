/**
 * Remind (remind.com) class codes, one place so they can be updated without
 * hunting through every page that links to a signup.
 *
 * Remind has no public API for adding subscribers from a custom form — there
 * are exactly two reliable ways in, both driven by the class code below:
 *   1. Join link: https://www.remind.com/join/{code}
 *   2. Text-to-join: text @{code} to 81010
 * `RemindSignup` (src/components/RemindSignup.tsx) renders both from a code.
 *
 * An empty code means "not set up yet" — RemindSignup renders nothing for
 * it, so a blank string here never produces a broken button.
 */
export interface RemindClass {
  code: string;
  label: string;
}

export const remindClasses = {
  /** Central Teens — parent/student comms: class changes, trip details, pickup times. */
  teens: { code: "ymcentral", label: "Central Teens" },
  /** Central Kids — pickup changes, weather closures, event reminders. */
  kids: { code: "", label: "Central Kids" },
  /** Everyone at Central — the single most valuable signup on the site. */
  churchwide: { code: "", label: "Central Church" },
} satisfies Record<string, RemindClass>;

export function remindJoinUrl(code: string) {
  return `https://www.remind.com/join/${code}`;
}

export function remindSmsHref(code: string) {
  return `sms:81010?body=${encodeURIComponent(`@${code}`)}`;
}
