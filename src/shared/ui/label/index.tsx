import { tv } from "tailwind-variants";

const label = tv({
  base: "cursor-pointer text-sm font-medium leading-none text-zinc-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  variants: {
    error: {
      true: "text-red-600",
    },
  },
});

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  error?: boolean;
};

export function Label({ error, className, ...props }: LabelProps) {
  return <label className={label({ error, className })} {...props} />;
}

export type { LabelProps };
