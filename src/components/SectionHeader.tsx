import { ArrowLink } from "./Button";

export function SectionHeader({
  eyebrow,
  title,
  action,
  rule = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  action?: { label: string; href: string };
  rule?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-end justify-between gap-6 ${rule ? "border-b border-line pb-6 lg:pb-7" : ""} ${className}`}
    >
      <div className="flex flex-col gap-2 lg:gap-3">
        {eyebrow ? (
          <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-[26px] leading-[1.1] tracking-[-.025em] text-pretty-wrap lg:text-[40px] lg:tracking-[-.03em]">
          {title}
        </h2>
      </div>
      {action ? (
        <ArrowLink href={action.href} className="shrink-0 pb-1">
          {action.label}
        </ArrowLink>
      ) : null}
    </div>
  );
}
