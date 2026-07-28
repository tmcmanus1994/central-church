import type { Person } from "@/content/people";
import { ArrowLink } from "./Button";
import { ImageSlot } from "./ImageSlot";

export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line p-5 lg:p-6">
      <ImageSlot
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

export function PersonChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span aria-hidden className="size-10 shrink-0 rounded-full bg-teal-50" />
      <span className="text-base font-semibold">{name}</span>
    </div>
  );
}

export function StaffRow({ person }: { person: Person }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-line p-3.5">
      <span aria-hidden className="size-11 shrink-0 rounded-full bg-sand" />
      <div className="flex flex-col">
        <span className="text-[16.5px] font-semibold">{person.name}</span>
        <span className="text-[14.5px] text-muted">{person.role}</span>
      </div>
    </div>
  );
}
