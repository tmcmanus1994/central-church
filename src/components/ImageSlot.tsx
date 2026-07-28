import Image from "next/image";

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

/**
 * A photo slot. Renders next/image when a src is supplied (the automation or
 * CMS provides photos); otherwise a striped placeholder with a note about the
 * intended shot, so layouts read correctly before photography lands.
 */
export function ImageSlot({
  src,
  alt = "",
  label,
  variant = "warm",
  className = "",
  sizes,
}: {
  src?: string | null;
  alt?: string;
  label?: string;
  variant?: Variant;
  className?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
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
