import type { ReactNode } from "react";

function Label({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[13px] font-bold text-[#2A2622]">
      {children}
      {optional ? (
        <span className="font-medium text-muted"> (optional)</span>
      ) : null}
    </label>
  );
}

const inputCls =
  "h-[52px] w-full rounded-[10px] border border-line-dark bg-white px-4 text-[15.5px] text-ink placeholder:text-muted";

export function TextField({
  id,
  label,
  type = "text",
  optional = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={!optional}
        className={inputCls}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  options,
}: {
  id: string;
  label: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} name={id} className={`${inputCls} appearance-auto`}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({
  id,
  label,
  optional = true,
}: {
  id: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea
        id={id}
        name={id}
        rows={4}
        className="w-full rounded-[10px] border border-line-dark bg-white p-4 text-[15.5px] text-ink"
      />
    </div>
  );
}
