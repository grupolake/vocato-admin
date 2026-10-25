import { ChevronDown } from "lucide-react";

const CONTROL =
  "w-full rounded-[12px] border border-line bg-card px-3.5 text-[14.5px] text-strong placeholder:text-muted focus:border-[var(--lake-700)] focus:outline-none focus:ring-4 focus:ring-[var(--lake-100)]";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-strong">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`${CONTROL} h-11 ${props.className ?? ""}`} />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`${CONTROL} py-2.5 ${props.className ?? ""}`}
    />
  );
}

export function Select({
  options,
  placeholder,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={`${CONTROL} h-11 cursor-pointer appearance-none pr-10 ${props.className ?? ""}`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
