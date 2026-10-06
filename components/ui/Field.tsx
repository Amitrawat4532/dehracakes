import type { ComponentProps, ReactNode } from "react";

export const inputClasses =
  "w-full rounded-2xl border border-espresso/12 bg-card/80 px-4 py-3.5 text-base text-espresso md:text-[0.95rem] placeholder:text-mocha/50 transition-colors duration-300 hover:border-espresso/25 focus:border-caramel focus:bg-card focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-caramel/15";

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-[0.8rem] font-medium text-cocoa">
        {label}
        {hint ? <span className="text-[0.72rem] font-normal text-mocha/70">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[0.75rem] text-rose">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputClasses} ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${inputClasses} resize-none ${props.className ?? ""}`} />;
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`${inputClasses} appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a5c4a' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10 ${props.className ?? ""}`}
    />
  );
}

/** Pill-style single choice group (sizes, flavours). */
export function ChoiceGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  columns,
}: {
  name: string;
  options: Array<{ value: T; label: ReactNode; sub?: ReactNode }>;
  value: T;
  onChange: (value: T) => void;
  columns?: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className={`grid gap-2 ${columns ?? "grid-cols-2 sm:grid-cols-4"}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            type="button"
            role="radio"
            aria-checked={active}
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex min-h-14 flex-col items-start justify-center rounded-2xl border px-4 py-3 text-left transition-all duration-300 active:scale-[0.97] ${
              active
                ? "border-espresso bg-espresso text-ivory shadow-soft"
                : "border-espresso/12 bg-card/70 text-espresso hover:border-espresso/40"
            }`}
          >
            <span className="text-sm font-medium">{opt.label}</span>
            {opt.sub ? (
              <span className={`mt-0.5 text-xs ${active ? "text-ivory/70" : "text-mocha/80"}`}>{opt.sub}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
  compact,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  compact?: boolean;
}) {
  const btn = `grid place-items-center rounded-full text-espresso transition-colors hover:bg-espresso/8 disabled:opacity-30 ${compact ? "size-8" : "size-11"}`;
  return (
    <div
      className={`inline-flex items-center rounded-full border border-espresso/15 bg-card/70 ${compact ? "p-0.5" : "p-1"}`}
      role="group"
      aria-label={label}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14" /></svg>
      </button>
      <span className={`text-center font-medium tabular-nums ${compact ? "w-6 text-sm" : "w-8"}`} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    </div>
  );
}
