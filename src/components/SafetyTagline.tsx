import Link from "next/link";

/**
 * A small, calm pointer to the Safety page — not a warning banner, just
 * enough presence that anyone who needs it can find it without having to go
 * looking. Placed directly on pages where families and kids/teens are most
 * likely to be reading (Central Kids, Central Teens), plus a quieter mention
 * in the footer sitewide. See src/app/safety/page.tsx for the full page and
 * report form this points to.
 */
export function SafetyTagline({ className = "" }: { className?: string }) {
  return (
    <p
      className={`m-0 flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-[14px] leading-[1.55] text-body ${className}`}
    >
      <span aria-hidden className="mt-0.5 shrink-0 text-muted">
        ⓘ
      </span>
      <span>
        Central is committed to keeping kids and adults safe. If something
        doesn&rsquo;t feel right, our Safe Team wants to know —{" "}
        <Link
          href="/safety"
          className="font-semibold text-primary no-underline hover:text-primary-deep"
        >
          report a concern
        </Link>
        .
      </span>
    </p>
  );
}
