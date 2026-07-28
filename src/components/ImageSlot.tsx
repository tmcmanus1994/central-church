import Image from "next/image";
import { photo, type PhotoKey } from "@/content/photos";

type Variant = "warm" | "dark" | "teal" | "navy";

const variantClass: Record<Variant, string> = {
  warm: "img-slot",
  dark: "img-slot-dark",
  teal: "img-slot-teal",
  navy: "img-slot-navy",
};

const labelClass: Record<Variant, string> = {
  warm: "text-muted",
  dark: "text-[#7E8B90]",
  teal: "text-teal-muted",
  navy: "text-[#8FB3C2]",
};

/** `fill` needs a positioned box. Callers that place the slot themselves
 *  (`absolute inset-0` heroes) already have one — adding `relative` on top
 *  would collide, since Tailwind resolves position utilities by stylesheet
 *  order, not class order. */
const POSITIONED = /(^|\s)(absolute|fixed|sticky|relative)(\s|$)/;

/**
 * A photo slot. Renders next/image once a photo exists — passed directly as
 * `src`, or looked up in the photo registry by `photoKey`. Until then it draws
 * a striped placeholder with a note about the intended shot, so every layout
 * reads correctly before photography lands.
 */
export function ImageSlot({
  src,
  photoKey,
  alt = "",
  label,
  variant = "warm",
  className = "",
  sizes,
  priority = false,
  focus = "center",
}: {
  src?: string | null;
  /** Key into src/content/photos.ts — the normal way to fill a fixed slot. */
  photoKey?: PhotoKey;
  alt?: string;
  label?: string;
  variant?: Variant;
  className?: string;
  sizes?: string;
  /** Set on above-the-fold images (hero) to preload them. */
  priority?: boolean;
  /** Where to anchor the crop. Portraits want "top" so faces stay in frame. */
  focus?: "center" | "top";
}) {
  const resolved = src ?? (photoKey ? photo(photoKey) : undefined);

  if (resolved) {
    const position = POSITIONED.test(className) ? "" : "relative";
    return (
      <div className={`${position} overflow-hidden ${className}`}>
        <Image
          src={resolved}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={focus === "top" ? "object-cover object-top" : "object-cover"}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt || label || "Photo placeholder"}
      className={`flex items-center justify-center overflow-hidden ${variantClass[variant]} ${className}`}
    >
      {label ? (
        <span
          className={`px-4 text-center font-mono text-[10.5px] tracking-[.08em] uppercase ${labelClass[variant]}`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
