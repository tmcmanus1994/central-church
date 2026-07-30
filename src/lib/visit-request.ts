/**
 * Formatting for a "Plan a Visit" submission.
 *
 * Split out from the route handler so the same formatter can be exercised
 * outside a request — Next.js route files may only export HTTP handlers.
 */

export interface Submission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  notes?: string;
}

/** The email body. Plain text, because it's read on a phone between services. */
export function formatSubmission(s: Submission) {
  const lines = [
    `Name:      ${s.firstName} ${s.lastName}`,
    `Email:     ${s.email}`,
    s.phone ? `Phone:     ${s.phone}` : null,
    s.service ? `\nPlanning to attend: ${s.service}` : null,
    s.notes ? `\nNotes:\n${s.notes}` : null,
    "",
    "—",
    "Sent from the Plan a Visit form on arcentralchurch.org",
  ].filter((l) => l !== null);

  return {
    subject: `Plan a Visit — ${s.firstName} ${s.lastName}`,
    text: lines.join("\n"),
  };
}
