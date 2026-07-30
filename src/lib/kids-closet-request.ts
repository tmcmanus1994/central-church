/**
 * Formatting for a Kids Closet appointment request.
 *
 * Split out from the route handler so the same formatter can be exercised
 * outside a request — Next.js route files may only export HTTP handlers.
 */

export interface Submission {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  children: string;
  sizes?: string;
  notes?: string;
}

/** The email body. Plain text, because it's read on a phone in a closet. */
export function formatSubmission(s: Submission) {
  const lines = [
    `Name:      ${s.name}`,
    `Phone:     ${s.phone}`,
    s.email ? `Email:     ${s.email}` : null,
    "",
    `Requested: ${s.date}, ${s.time}`,
    `Children:  ${s.children}`,
    s.sizes ? `Ages/sizes: ${s.sizes}` : null,
    s.notes ? `\nNotes:\n${s.notes}` : null,
    "",
    "—",
    "Sent from the Kids Closet scheduling form on arcentralchurch.org",
  ].filter((l) => l !== null);

  return {
    subject: `Kids Closet request — ${s.name}, ${s.date}`,
    text: lines.join("\n"),
  };
}

