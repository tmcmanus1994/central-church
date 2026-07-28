const palettes: Record<string, string> = {
  Outreach: "bg-accent-tint text-accent-deep",
  "Central Kids": "bg-accent-tint text-accent-deep",
  Featured: "bg-accent-tint text-accent-deep",
  "Life Groups": "bg-teal-50 text-primary-deep",
  Recurring: "bg-teal-50 text-primary-deep",
  "All Church": "bg-sand text-body",
  "Central Teens": "bg-sand text-body",
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
    : (palettes[children] ?? "bg-sand text-body");
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-[6px] text-[11px] font-bold tracking-[.1em] uppercase ${palette}`}
    >
      {children}
    </span>
  );
}
