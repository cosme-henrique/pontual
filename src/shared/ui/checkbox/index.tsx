import { tv } from "tailwind-variants";

const checkbox = tv({
  base: "h-4 w-4 cursor-pointer rounded border border-zinc-300 accent-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    error: {
      true: "border-red-500",
    },
  },
});

type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  error?: boolean;
};

export function Checkbox({ value, onChange, error, className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={value ?? false}
      onChange={(event) => onChange?.(event.target.checked)}
      className={checkbox({ error, className })}
      {...props}
    />
  );
}

export type { CheckboxProps };
