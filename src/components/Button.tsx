import Link from "next/link";
import type { ReactNode } from "react";

type Variant =
  | "primary"
  | "outline"
  | "outline-light"
  | "give"
  | "white"
  | "neutral"
  | "ghost";

const base =
  "inline-flex items-center justify-center rounded-full font-bold no-underline transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-deep",
  outline:
    "border-[1.5px] border-primary text-primary hover:bg-teal-50",
  "outline-light":
    "border-[1.5px] border-white/60 text-white hover:bg-white/10",
  give: "bg-accent text-white hover:bg-accent-deep",
  white: "bg-white text-primary-deep hover:bg-teal-50",
  neutral: "border border-line text-body hover:bg-surface",
  ghost: "text-primary hover:text-primary-deep",
};

const sizes = {
  md: "h-[46px] px-[22px] text-[15px]",
  lg: "h-[52px] px-6 text-[15.5px] lg:h-[54px] lg:px-7 lg:text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "lg",
  full = false,
  external = false,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  full?: boolean;
  external?: boolean;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${variant === "ghost" ? "" : sizes[size]} ${full ? "flex w-full" : ""}`;
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Right-arrow text link: "See all events →" */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-bold text-[15.5px] text-primary no-underline hover:text-primary-deep ${className}`}
    >
      {children} →
    </Link>
  );
}
