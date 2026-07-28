import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-sm font-medium text-text">{label}</span>
      )}
      <input
        id={inputId}
        className={cn(
          "h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Textarea({
  label,
  hint,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-sm font-medium text-text">{label}</span>
      )}
      <textarea
        className={cn(
          "min-h-[96px] w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20",
          className
        )}
        {...props}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}
