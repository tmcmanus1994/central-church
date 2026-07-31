/**
 * Formatting for an Iglesia ("¡Déjanos saber que vienes!") submission.
 *
 * Split out from the route handler for the same reason as visit-request.ts —
 * Next.js route files may only export HTTP handlers.
 */

export interface Submission {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

/** The email body — always in English, since it lands in Matt's inbox regardless of which toggle the visitor used. */
export function formatSubmission(s: Submission) {
  const lines = [
    `Name:      ${s.name}`,
    `Email:     ${s.email}`,
    s.phone ? `Phone:     ${s.phone}` : null,
    s.notes ? `\nNotes:\n${s.notes}` : null,
    "",
    "—",
    "Sent from the Iglesia page on arcentralchurch.org",
  ].filter((l) => l !== null);

  return {
    subject: `Iglesia — ${s.name}`,
    text: lines.join("\n"),
  };
}
