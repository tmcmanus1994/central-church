import type { Person } from "@/content/people";
import { ArrowLink } from "./Button";
import { ImageSlot } from "./ImageSlot";

/**
 * Portraits are shot vertically, so every person image uses a 4:5 frame —
 * portrait enough to suit the source photos, forgiving enough that the
 * square-cropped headshots don't lose much. Crops anchor to the top so faces
 * stay in frame.
 */
const PORTRAIT =
  "aspect-[4/5] w-full rounded-xl bg-surface border border-line";

/** Full card with bio — ministry leaders. */
export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line p-4 lg:p-5">
      <ImageSlot
        src={person.photo}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
        focus="top"
        alt={`Portrait of ${person.name}`}
        className={PORTRAIT}
      />
      <span className="font-display text-[22px] tracking-[-.015em]">
        {person.name}
      </span>
      <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
        {person.role}
      </span>
      {person.bio ? (
        <p className="m-0 text-[15.5px] leading-[1.6] text-body">{person.bio}</p>
      ) : null}
      <ArrowLink href="/plan-a-visit#contact" className="mt-auto text-[15px]">
        Contact
      </ArrowLink>
    </div>
  );
}

/**
 * Photo-forward tile for the elder and staff grids — the portrait leads and
 * the name sits under it, so faces are actually legible.
 */
export function PersonTile({
  person,
  showRole = true,
}: {
  person: Person;
  showRole?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <ImageSlot
        src={person.photo}
        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
        focus="top"
        alt={`Portrait of ${person.name}`}
        className={PORTRAIT}
      />
      <div className="flex flex-col">
        <span className="font-display text-[17px] leading-tight tracking-[-.01em] text-ink">
          {person.name}
        </span>
        {showRole ? (
          <span className="text-[13.5px] leading-snug text-muted">
            {person.role}
          </span>
        ) : null}
      </div>
    </div>
  );
}
