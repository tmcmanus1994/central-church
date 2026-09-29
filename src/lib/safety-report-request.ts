/**
 * Formatting for a Safe Team report.
 *
 * Split out from the route handler so the same formatter can be exercised
 * outside a request — Next.js route files may only export HTTP handlers.
 */

export interface Submission {
  /** Optional — reporting anonymously is allowed. */
  reporterName?: string;
  /** Optional — how to reach the reporter back, if they want to be reachable. */
  reporterContact?: string;
  dateOfReporting: string;
  offender: string;
  dateOfOffense: string;
  eventsOfOffense: string;
}

/** The email body. Plain text, read by the Safe Team on a phone. */
export function formatSubmission(s: Submission) {
  const lines = [
    `Date of reporting: ${s.dateOfReporting}`,
    `Person(s) reporting: ${s.reporterName || "(anonymous)"}`,
    s.reporterContact ? `Reporter contact: ${s.reporterContact}` : null,
    `Offender: ${s.offender}`,
    `Date of offense: ${s.dateOfOffense}`,
    "",
    "Events of offense:",
    s.eventsOfOffense,
    "",
    "—",
    "Sent from the Safety report form on arcentralchurch.org",
  ].filter((l) => l !== null);

  return {
    subject: `Safety report — ${s.dateOfReporting}${s.reporterName ? ` — ${s.reporterName}` : ""}`,
    text: lines.join("\n"),
  };
}
