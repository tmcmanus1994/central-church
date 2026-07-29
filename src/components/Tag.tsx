import type { EventTag } from "@/content/events";
import { paletteFor } from "@/lib/ministry-colors";

/** Non-ministry labels that still appear as chips. */
const EXTRAS: Record<string, string> = {
  Featured: "bg-accent-tint text-accent-deep",
  Recurring: "bg-teal-50 text-primary-deep",
};

export function Tag({
  children,
  onImage = false,
}: {
  children: string;
  onImage?: boolean;
}) {
  const palette = onImage
    ? "bg-white text-primary"
    : (EXTRAS[children] ?? paletteFor(children as EventTag).chip);
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-[6px] text-[11px] font-bold tracking-[.1em] uppercase ${palette}`}
    >
      {children}
    </span>
  );
}
