import type { Person } from "@/content/people";
import { ArrowLink } from "./Button";
import { ImageSlot } from "./ImageSlot";

export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line p-5 lg:p-6">
      <ImageSlot
        src={person.photo}
        sizes="(min-width: 1024px) 33vw, 100vw"
        focus="top"
        alt={`Portrait of ${person.name}`}
        className="h-[220px] rounded-xl"
      />
      <span className="font-display text-[22px] tracking-[-.02em]">
        {person.name}
      </span>
      <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
        {person.role}
      </span>
      {person.bio ? (
        <p className="m-0 text-[15.5px] leading-[1.6] text-body">{person.bio}</p>
      ) : null}
      <ArrowLink href="/plan-a-visit#contact" className="text-[15px]">
        Contact
      </ArrowLink>
    </div>
  );
}

/** Compact row used for the elder and staff grids. */
export function PersonChip({
  person,
  showRole = false,
}: {
  person: Person;
  showRole?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <ImageSlot
        src={person.photo}
        sizes="48px"
        focus="top"
        alt={`Portrait of ${person.name}`}
        variant="teal"
        className="size-11 shrink-0 rounded-full"
      />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-base font-semibold">{person.name}</span>
        {showRole ? (
          <span className="truncate text-[14.5px] text-muted">{person.role}</span>
        ) : null}
      </div>
    </div>
  );
}
