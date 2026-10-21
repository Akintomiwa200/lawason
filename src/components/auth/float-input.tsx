export const authFieldClass =
  "peer w-full rounded-2xl border border-border bg-surface px-4 pb-2 pt-6 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

export const authFloatingLabelClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs";

interface FloatInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  minLength?: number;
  defaultValue?: string;
}

export function FloatInput({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  minLength,
  defaultValue,
}: FloatInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        placeholder=" "
        autoComplete={autoComplete}
        minLength={minLength}
        defaultValue={defaultValue}
        required
        className={authFieldClass}
      />
      <label htmlFor={id} className={authFloatingLabelClass}>
        {label}
      </label>
    </div>
  );
}
