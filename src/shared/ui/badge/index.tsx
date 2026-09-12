import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    variant: {
      default: "bg-zinc-100 text-zinc-700",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      destructive: "bg-red-100 text-red-800",
      outline: "border border-zinc-200 text-zinc-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badge({ variant, className })} {...props} />;
}

export type { BadgeProps };
